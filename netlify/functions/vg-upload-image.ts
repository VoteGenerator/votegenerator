// ============================================================================
// vg-upload-image.ts - Image upload for visual polls via Cloudinary
// Location: netlify/functions/vg-upload-image.ts
// ============================================================================

import { Handler } from '@netlify/functions';

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
                body: JSON.stringify({ error: 'Image upload service not configured' })
            };
        }

        // Generate signature for signed upload
        const timestamp = Math.floor(Date.now() / 1000);
        const folder = 'visual-polls';
        
        // Create signature string (sorted alphabetically - ALL params must be included!)
        const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
        
        // Generate SHA1 signature
        const crypto = await import('crypto');
        const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

        // Prepare form data for Cloudinary
        const formData = new URLSearchParams();
        formData.append('file', image);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);
        formData.append('folder', folder);

        // Upload to Cloudinary
        const cloudinaryResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData.toString()
            }
        );

        if (!cloudinaryResponse.ok) {
            const errorData = await cloudinaryResponse.json().catch(() => ({}));
            console.error('Cloudinary error:', errorData);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Failed to upload image',
                    details: errorData.error?.message || 'Unknown error'
                })
            };
        }

        const result = await cloudinaryResponse.json();

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

    } catch (error) {
        console.error('Upload error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to process image upload' })
        };
    }
};