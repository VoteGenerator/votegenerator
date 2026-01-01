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

        // Use unsigned preset - same as already configured in Cloudinary
        const cloudName = 'votegenerator';
        const uploadPreset = 'votegenerator'; // Your existing unsigned preset

        // Build the upload request - unsigned presets don't need API key/secret
        const uploadData = {
            file: image,
            upload_preset: uploadPreset
        };

        console.log('Uploading to Cloudinary with unsigned preset:', uploadPreset);

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

        console.log('Upload successful:', result.secure_url);

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