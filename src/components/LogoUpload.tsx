import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Upload, 
    X, 
    Loader2, 
    Image as ImageIcon,
    Check,
    AlertCircle,
    Trash2,
    RefreshCw
} from 'lucide-react';

interface Props {
    currentLogo?: string | null;
    onLogoChange: (logoUrl: string | null) => void;
    tier?: string;
}

const LogoUpload: React.FC<Props> = ({ 
    currentLogo, 
    onLogoChange,
    tier = 'free'
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogo || null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isPremium = tier !== 'free';
    const maxSizeKB = tier === 'unlimited' ? 2000 : tier === 'pro_event' ? 1000 : 500;
    const maxSizeBytes = maxSizeKB * 1024;

    const uploadToCloudinary = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'votegenerator_logo'); // Must be UNSIGNED preset in Cloudinary
        // Note: folder and transformation should be configured in the preset itself

        // Cloud name should match your Cloudinary account
        const cloudName = 'votegenerator';

        try {
            console.log('Uploading to Cloudinary with preset: votegenerator_logo');
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Cloudinary error response:', errorData);
                
                if (response.status === 401 || response.status === 400) {
                    throw new Error('CLOUDINARY_SETUP_REQUIRED');
                }
                throw new Error(`Upload failed: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            console.log('Cloudinary upload success:', data.secure_url);
            return data.secure_url;
        } catch (error: any) {
            console.error('Cloudinary upload error:', error);
            if (error.message === 'CLOUDINARY_SETUP_REQUIRED') {
                throw error;
            }
            return null;
        }
    };

    const handleFile = async (file: File) => {
        setError(null);

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file (PNG, JPG, GIF)');
            return;
        }

        // Validate file size
        if (file.size > maxSizeBytes) {
            setError(`File too large. Max size: ${maxSizeKB}KB`);
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload
        setIsUploading(true);
        try {
            const uploadedUrl = await uploadToCloudinary(file);
            setIsUploading(false);

            if (uploadedUrl) {
                setPreviewUrl(uploadedUrl);
                onLogoChange(uploadedUrl);
            } else {
                setError('Failed to upload image. Please try again.');
                setPreviewUrl(currentLogo || null);
            }
        } catch (error: any) {
            setIsUploading(false);
            if (error.message === 'CLOUDINARY_SETUP_REQUIRED') {
                setError('Logo upload is not configured yet. Please contact support or check Cloudinary setup.');
            } else {
                setError('Failed to upload image. Please try again.');
            }
            setPreviewUrl(currentLogo || null);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const removeLogo = () => {
        setPreviewUrl(null);
        onLogoChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (!isPremium) {
        return (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-3 opacity-60">
                    <div className="p-2 bg-slate-200 rounded-lg">
                        <ImageIcon size={20} className="text-slate-400" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-600">Custom Logo</p>
                        <p className="text-xs text-slate-400">Available on paid plans</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
                Poll Logo <span className="text-slate-400 font-normal">(optional)</span>
            </label>

            <AnimatePresence mode="wait">
                {previewUrl ? (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative"
                    >
                        <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200 flex items-center gap-4">
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-white shadow-sm border border-slate-100">
                                <img 
                                    src={previewUrl} 
                                    alt="Poll logo preview" 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-700">Logo uploaded</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Displays at the top of your poll
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300"
                                    title="Replace logo"
                                >
                                    <RefreshCw size={18} />
                                </button>
                                <button
                                    onClick={removeLogo}
                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                    title="Remove logo"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        {isUploading && (
                            <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
                                <Loader2 className="animate-spin text-indigo-600" size={24} />
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                            ${isDragging 
                                ? 'border-indigo-400 bg-indigo-50' 
                                : 'border-slate-300 hover:border-indigo-300 hover:bg-slate-50'
                            }
                            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
                        `}
                    >
                        <div className="flex flex-col items-center gap-3">
                            {isUploading ? (
                                <Loader2 className="animate-spin text-indigo-600" size={32} />
                            ) : (
                                <div className={`p-3 rounded-full ${isDragging ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                                    <Upload size={24} className={isDragging ? 'text-indigo-600' : 'text-slate-400'} />
                                </div>
                            )}
                            <div>
                                <p className="font-medium text-slate-700">
                                    {isDragging ? 'Drop your logo here' : 'Upload your logo'}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    PNG, JPG or GIF • Max {maxSizeKB}KB
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 flex items-center gap-1"
                >
                    <AlertCircle size={14} />
                    {error}
                </motion.p>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
};

export default LogoUpload;