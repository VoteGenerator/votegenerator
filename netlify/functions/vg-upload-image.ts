// ============================================================================
// vg-upload-image.ts - Image upload for visual polls via Cloudinary
// Location: netlify/functions/vg-upload-image.ts
// ============================================================================

import { Handler } from '@netlify/functions';
import crypto from 'crypto';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
};

export const handler: Handler = async (event) => {
    // Handle CORS preflight
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

    try {
        const body = JSON.parse(event.body || '{}');
        const { image } = body;

        if (!image) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'No image provided' })
            };
        }

        // Cloudinary credentials from environment
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'votegenerator';
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (!apiKey || !apiSecret) {
            console.error('Cloudinary credentials not configured');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Image upload service not configured. Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET.' })
            };
        }

        // Generate signature for signed upload
        const timestamp = Math.floor(Date.now() / 1000);
        const folder = 'visual-polls';
        
        // Parameters that must be included in signature (sorted alphabetically)
        const paramsToSign = {
            folder: folder,
            timestamp: timestamp.toString(),
        };
        
        // Create signature string
        const sortedParams = Object.keys(paramsToSign)
            .sort()
            .map(key => `${key}=${paramsToSign[key as keyof typeof paramsToSign]}`)
            .join('&');
        const signatureString = sortedParams + apiSecret;
        const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

        // Build the upload request body
        const uploadData = {
            file: image,
            api_key: apiKey,
            timestamp: timestamp,
            signature: signature,
            folder: folder,
        };

        // Upload to Cloudinary using JSON
        const cloudinaryResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(uploadData)
            }
        );

        const responseText = await cloudinaryResponse.text();
        let result;
        
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse Cloudinary response:', responseText);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Invalid response from image service' })
            };
        }

        if (!cloudinaryResponse.ok) {
            console.error('Cloudinary error:', result);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: result.error?.message || 'Failed to upload image'
                })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                url: result.secure_url,
                publicId: result.public_id,
                width: result.width,
                height: result.height
            })
        };

    } catch (error: any) {
        console.error('Upload error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message || 'Failed to process image upload' })
        };
    }
};