/**
 * Image Compression Utility
 * Uses browser's native Canvas API - 100% FREE, no external API needed
 */

interface CompressionOptions {
    maxWidthOrHeight?: number;  // Max dimension in pixels
    quality?: number;           // 0-1, JPEG/WebP quality
    maxSizeMB?: number;         // Target max file size
}

const DEFAULT_OPTIONS: CompressionOptions = {
    maxWidthOrHeight: 1920,     // Good for web, reduces 4K photos
    quality: 0.8,               // 80% quality - good balance
    maxSizeMB: 2                // Target 2MB max
};

/**
 * Compress an image file using Canvas API
 * @param file - Original image file
 * @param options - Compression options
 * @returns Compressed image as Blob
 */
export const compressImage = async (
    file: File, 
    options: CompressionOptions = {}
): Promise<Blob> => {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    
    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
        }

        img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img;
            const maxDim = opts.maxWidthOrHeight!;
            
            if (width > maxDim || height > maxDim) {
                if (width > height) {
                    height = (height / width) * maxDim;
                    width = maxDim;
                } else {
                    width = (width / height) * maxDim;
                    height = maxDim;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw image to canvas
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to blob with compression
            // Use WebP if supported (better compression), fallback to JPEG
            const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
            
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Compression failed'));
                    }
                },
                outputType,
                opts.quality
            );
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
    });
};

/**
 * Compress image with progressive quality reduction to meet size target
 * @param file - Original image file
 * @param maxSizeMB - Maximum file size in MB
 * @returns Compressed image as File
 */
export const compressToTargetSize = async (
    file: File,
    maxSizeMB: number = 2
): Promise<File> => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    // If already under limit, return original
    if (file.size <= maxSizeBytes) {
        return file;
    }
    
    let quality = 0.9;
    let compressed: Blob;
    let attempts = 0;
    const maxAttempts = 5;
    
    // Progressively reduce quality until under size limit
    do {
        compressed = await compressImage(file, {
            maxWidthOrHeight: 1920,
            quality
        });
        quality -= 0.15;
        attempts++;
    } while (compressed.size > maxSizeBytes && quality > 0.3 && attempts < maxAttempts);
    
    // If still too large, reduce dimensions
    if (compressed.size > maxSizeBytes) {
        compressed = await compressImage(file, {
            maxWidthOrHeight: 1200,
            quality: 0.7
        });
    }
    
    // Convert Blob back to File
    return new File([compressed], file.name, {
        type: compressed.type,
        lastModified: Date.now()
    });
};

/**
 * Get human-readable file size
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

/**
 * Check if file is an image
 */
export const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/');
};

/**
 * Create image preview URL
 */
export const createPreviewUrl = (file: File): string => {
    return URL.createObjectURL(file);
};

/**
 * Revoke preview URL to free memory
 */
export const revokePreviewUrl = (url: string): void => {
    URL.revokeObjectURL(url);
};