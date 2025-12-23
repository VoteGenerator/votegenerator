// ============================================================================
// vg-upload-image.ts - Upload images to Cloudinary for Visual Polls
// Accepts base64 image data, uploads to Cloudinary, returns URL
// ============================================================================

import { Handler } from '@netlify/functions';

// Cloud name is public, can be hardcoded
const CLOUDINARY_CLOUD_NAME = 'dqp5iwehp';
// These are secret and come from env vars
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

interface CloudinaryResponse {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
    error?: { message: string };
}

export const handler: Handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Check Cloudinary credentials (only API key and secret are env vars)
    if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        console.error('Missing Cloudinary API credentials');
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Server configuration error - missing Cloudinary credentials' })
        };
    }

    try {
        let imageData: string;
        
        // Check if it's multipart form data or JSON
        const contentType = event.headers['content-type'] || '';
        
        if (contentType.includes('multipart/form-data')) {
            // Handle multipart form data
            // Parse the boundary
            const boundary = contentType.split('boundary=')[1];
            if (!boundary || !event.body) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid form data' })
                };
            }
            
            // Decode body if base64 encoded
            const body = event.isBase64Encoded 
                ? Buffer.from(event.body, 'base64').toString('binary')
                : event.body;
            
            // Simple multipart parser - find the file content
            const parts = body.split('--' + boundary);
            let fileContent = '';
            let mimeType = 'image/jpeg';
            
            for (const part of parts) {
                if (part.includes('Content-Type: image/')) {
                    // Extract mime type
                    const mimeMatch = part.match(/Content-Type: (image\/\w+)/);
                    if (mimeMatch) {
                        mimeType = mimeMatch[1];
                    }
                    
                    // Extract file content (after double newline)
                    const contentStart = part.indexOf('\r\n\r\n');
                    if (contentStart !== -1) {
                        fileContent = part.substring(contentStart + 4);
                        // Remove trailing boundary markers
                        fileContent = fileContent.replace(/\r\n--$/, '').replace(/--$/, '');
                    }
                    break;
                }
            }
            
            if (!fileContent) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'No image file found in request' })
                };
            }
            
            // Convert binary string to base64
            const base64Content = Buffer.from(fileContent, 'binary').toString('base64');
            imageData = `data:${mimeType};base64,${base64Content}`;
            
        } else {
            // Handle JSON body with base64 image
            const body = JSON.parse(event.body || '{}');
            
            if (!body.image) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'No image data provided' })
                };
            }
            
            imageData = body.image;
        }

        // Upload to Cloudinary using unsigned upload with API credentials
        const timestamp = Math.round(Date.now() / 1000);
        const folder = 'votegenerator/polls';
        
        // Create signature for authenticated upload
        const crypto = await import('crypto');
        const signatureString = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
        const signature = crypto.createHash('sha1').update(signatureString).digest('hex');
        
        // Prepare form data for Cloudinary
        const formData = new URLSearchParams();
        formData.append('file', imageData);
        formData.append('api_key', CLOUDINARY_API_KEY);
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);
        formData.append('folder', folder);
        
        // Upload to Cloudinary
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
        
        const response = await fetch(cloudinaryUrl, {
            method: 'POST',
            body: formData
        });
        
        const result: CloudinaryResponse = await response.json();
        
        if (result.error) {
            console.error('Cloudinary error:', result.error);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: result.error.message || 'Upload failed' })
            };
        }
        
        // Return the secure URL
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format,
                size: result.bytes
            })
        };
        
    } catch (error) {
        console.error('Upload error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: error instanceof Error ? error.message : 'Upload failed' 
            })
        };
    }
};