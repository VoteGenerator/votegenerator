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

        // Cloudinary config - your actual cloud name
        const cloudName = 'dqp5iwehp';
        const uploadPreset = 'votegenerator'; // Your existing unsigned preset

        console.log('Uploading to Cloudinary with unsigned preset:', uploadPreset);
        console.log('Cloud name:', cloudName);

        // For unsigned uploads, use form-urlencoded (works better than JSON)
        const params = new URLSearchParams();
        params.append('file', image);
        params.append('upload_preset', uploadPreset);

        // Upload to Cloudinary
        const cloudinaryResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
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
            
            // Check for specific errors
            const errorMsg = result.error?.message || '';
            
            if (errorMsg.includes('Upload preset') || errorMsg.includes('preset')) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ 
                        error: 'Upload preset "votegenerator" not found or not set to UNSIGNED mode in Cloudinary.',
                        setup: 'Go to Cloudinary Dashboard → Settings → Upload → Upload Presets → Create/Edit "votegenerator" → Set Signing Mode to UNSIGNED'
                    })
                };
            }
            
            if (errorMsg.includes('API key') || errorMsg.includes('Unauthorized')) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ 
                        error: 'Upload preset must be UNSIGNED. Signed uploads require API key.',
                        setup: 'Go to Cloudinary Dashboard → Settings → Upload → Upload Presets → Edit "votegenerator" → Change Signing Mode from SIGNED to UNSIGNED'
                    })
                };
            }
            
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: errorMsg || 'Failed to upload image'
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