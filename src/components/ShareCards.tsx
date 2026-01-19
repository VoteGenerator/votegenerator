// ============================================================================
// ShareCards.tsx - Beautiful Social Media Share Cards
// Theme-aware designs with elegant QR code placement
// Location: src/components/ShareCards.tsx
// ============================================================================
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Download, Check, Sparkles, QrCode, 
    Image as ImageIcon, Share2, ChevronLeft, ChevronRight
} from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';

interface ShareCardsProps {
    pollId: string;
    pollTitle: string;
    theme?: string;
    onClose: () => void;
}

// Theme color configurations
const THEME_COLORS: Record<string, {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
    text: string;
    qrDots: string;
    qrCorners: string;
}> = {
    default: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#ec4899',
        gradient: 'from-indigo-600 via-purple-600 to-pink-500',
        text: '#ffffff',
        qrDots: '#6366f1',
        qrCorners: '#4f46e5'
    },
    ocean: {
        primary: '#0891b2',
        secondary: '#06b6d4',
        accent: '#22d3ee',
        gradient: 'from-cyan-600 via-teal-500 to-emerald-500',
        text: '#ffffff',
        qrDots: '#0891b2',
        qrCorners: '#0e7490'
    },
    sunset: {
        primary: '#f97316',
        secondary: '#fb923c',
        accent: '#fbbf24',
        gradient: 'from-orange-500 via-amber-500 to-yellow-500',
        text: '#ffffff',
        qrDots: '#f97316',
        qrCorners: '#ea580c'
    },
    forest: {
        primary: '#16a34a',
        secondary: '#22c55e',
        accent: '#4ade80',
        gradient: 'from-green-600 via-emerald-500 to-teal-500',
        text: '#ffffff',
        qrDots: '#16a34a',
        qrCorners: '#15803d'
    },
    berry: {
        primary: '#db2777',
        secondary: '#ec4899',
        accent: '#f472b6',
        gradient: 'from-pink-600 via-rose-500 to-red-500',
        text: '#ffffff',
        qrDots: '#db2777',
        qrCorners: '#be185d'
    },
    midnight: {
        primary: '#3b82f6',
        secondary: '#6366f1',
        accent: '#8b5cf6',
        gradient: 'from-blue-600 via-indigo-600 to-purple-600',
        text: '#ffffff',
        qrDots: '#3b82f6',
        qrCorners: '#2563eb'
    },
    coral: {
        primary: '#f43f5e',
        secondary: '#fb7185',
        accent: '#fda4af',
        gradient: 'from-rose-500 via-pink-500 to-red-400',
        text: '#ffffff',
        qrDots: '#f43f5e',
        qrCorners: '#e11d48'
    },
    lavender: {
        primary: '#8b5cf6',
        secondary: '#a78bfa',
        accent: '#c4b5fd',
        gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
        text: '#ffffff',
        qrDots: '#8b5cf6',
        qrCorners: '#7c3aed'
    },
    monochrome: {
        primary: '#374151',
        secondary: '#4b5563',
        accent: '#9ca3af',
        gradient: 'from-slate-700 via-gray-600 to-slate-800',
        text: '#ffffff',
        qrDots: '#374151',
        qrCorners: '#1f2937'
    },
    gold: {
        primary: '#d97706',
        secondary: '#f59e0b',
        accent: '#fbbf24',
        gradient: 'from-amber-600 via-yellow-500 to-orange-500',
        text: '#ffffff',
        qrDots: '#d97706',
        qrCorners: '#b45309'
    }
};

// Card design templates
type CardDesign = 'modern' | 'minimal' | 'bold' | 'elegant' | 'playful' | 'corporate';

const CARD_DESIGNS: { id: CardDesign; name: string; description: string }[] = [
    { id: 'modern', name: 'Modern', description: 'Clean gradient with centered QR' },
    { id: 'minimal', name: 'Minimal', description: 'Simple white card with accent' },
    { id: 'bold', name: 'Bold', description: 'Full gradient background' },
    { id: 'elegant', name: 'Elegant', description: 'Subtle pattern overlay' },
    { id: 'playful', name: 'Playful', description: 'Rounded corners and shapes' },
    { id: 'corporate', name: 'Corporate', description: 'Professional business look' }
];

// Card format options
type CardFormat = 'square' | 'story' | 'landscape';

const CARD_FORMATS: { id: CardFormat; name: string; ratio: string; width: number; height: number }[] = [
    { id: 'square', name: 'Square', ratio: '1:1', width: 1080, height: 1080 },
    { id: 'story', name: 'Story', ratio: '9:16', width: 1080, height: 1920 },
    { id: 'landscape', name: 'Landscape', ratio: '16:9', width: 1920, height: 1080 }
];

const ShareCards: React.FC<ShareCardsProps> = ({ pollId, pollTitle, theme = 'default', onClose }) => {
    const [selectedDesign, setSelectedDesign] = useState<CardDesign>('modern');
    const [selectedFormat, setSelectedFormat] = useState<CardFormat>('square');
    const [isGenerating, setIsGenerating] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState<string>('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const colors = THEME_COLORS[theme] || THEME_COLORS.default;
    const shareUrl = `${window.location.origin}/#id=${pollId}`;
    const formatConfig = CARD_FORMATS.find(f => f.id === selectedFormat) || CARD_FORMATS[0];
    
    // Generate QR code on mount
    useEffect(() => {
        const qrCode = new QRCodeStyling({
            width: 300,
            height: 300,
            type: 'svg',
            data: shareUrl,
            dotsOptions: {
                color: colors.qrDots,
                type: 'rounded'
            },
            cornersSquareOptions: {
                color: colors.qrCorners,
                type: 'extra-rounded'
            },
            cornersDotOptions: {
                color: colors.qrCorners,
                type: 'dot'
            },
            backgroundOptions: {
                color: 'transparent'
            }
        });
        
        qrCode.getRawData('png').then((data) => {
            if (data) {
                const url = URL.createObjectURL(data);
                setQrDataUrl(url);
            }
        });
        
        return () => {
            if (qrDataUrl) URL.revokeObjectURL(qrDataUrl);
        };
    }, [shareUrl, colors]);
    
    // Draw card on canvas
    const generateCard = async (): Promise<string> => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');
        
        canvas.width = formatConfig.width;
        canvas.height = formatConfig.height;
        
        // Draw background based on design
        switch (selectedDesign) {
            case 'modern':
                await drawModernCard(ctx, canvas.width, canvas.height);
                break;
            case 'minimal':
                await drawMinimalCard(ctx, canvas.width, canvas.height);
                break;
            case 'bold':
                await drawBoldCard(ctx, canvas.width, canvas.height);
                break;
            case 'elegant':
                await drawElegantCard(ctx, canvas.width, canvas.height);
                break;
            case 'playful':
                await drawPlayfulCard(ctx, canvas.width, canvas.height);
                break;
            case 'corporate':
                await drawCorporateCard(ctx, canvas.width, canvas.height);
                break;
        }
        
        return canvas.toDataURL('image/png');
    };
    
    // Modern card design
    const drawModernCard = async (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        // Gradient background
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, colors.primary);
        gradient.addColorStop(0.5, colors.secondary);
        gradient.addColorStop(1, colors.accent);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        
        // Add subtle pattern
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        for (let i = 0; i < w; i += 40) {
            for (let j = 0; j < h; j += 40) {
                ctx.beginPath();
                ctx.arc(i, j, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // White card in center
        const cardW = w * 0.75;
        const cardH = h * 0.65;
        const cardX = (w - cardW) / 2;
        const cardY = (h - cardH) / 2;
        
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetY = 10;
        roundRect(ctx, cardX, cardY, cardW, cardH, 24);
        ctx.fill();
        ctx.shadowColor = 'transparent';
        
        // Title
        ctx.fillStyle = '#1e293b';
        ctx.font = `bold ${Math.floor(w * 0.04)}px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        const maxTitleWidth = cardW * 0.85;
        wrapText(ctx, pollTitle, w / 2, cardY + cardH * 0.18, maxTitleWidth, w * 0.05);
        
        // QR Code
        if (qrDataUrl) {
            const qrSize = Math.min(cardW, cardH) * 0.45;
            const qrX = (w - qrSize) / 2;
            const qrY = cardY + cardH * 0.35;
            const img = await loadImage(qrDataUrl);
            ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
        }
        
        // Scan to vote text
        ctx.fillStyle = '#64748b';
        ctx.font = `${Math.floor(w * 0.025)}px Inter, system-ui, sans-serif`;
        ctx.fillText('Scan to vote', w / 2, cardY + cardH * 0.88);
        
        // Branding
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = `bold ${Math.floor(w * 0.018)}px Inter, system-ui, sans-serif`;
        ctx.fillText('votegenerator.com', w / 2, h - w * 0.04);
    };
    
    // Minimal card design
    const drawMinimalCard = async (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        
        // Accent bar at top
        ctx.fillStyle = colors.primary;
        ctx.fillRect(0, 0, w, h * 0.02);
        
        // Title
        ctx.fillStyle = '#0f172a';
        ctx.font = `bold ${Math.floor(w * 0.045)}px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        wrapText(ctx, pollTitle, w / 2, h * 0.2, w * 0.8, w * 0.055);
        
        // QR Code
        if (qrDataUrl) {
            const qrSize = Math.min(w, h) * 0.4;
            const qrX = (w - qrSize) / 2;
            const qrY = h * 0.35;
            const img = await loadImage(qrDataUrl);
            ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
        }
        
        // Scan text with icon
        ctx.fillStyle = colors.primary;
        ctx.font = `600 ${Math.floor(w * 0.028)}px Inter, system-ui, sans-serif`;
        ctx.fillText('📱 Scan to vote', w / 2, h * 0.82);
        
        // URL
        ctx.fillStyle = '#94a3b8';
        ctx.font = `${Math.floor(w * 0.022)}px Inter, system-ui, sans-serif`;
        ctx.fillText(shareUrl, w / 2, h * 0.9);
    };
    
    // Bold card design
    const drawBoldCard = async (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        // Full gradient
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, colors.primary);
        gradient.addColorStop(1, colors.secondary);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        
        // Large decorative shapes
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.beginPath();
        ctx.arc(w * 0.1, h * 0.1, w * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(w * 0.9, h * 0.9, w * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.floor(w * 0.055)}px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        wrapText(ctx, pollTitle.toUpperCase(), w / 2, h * 0.22, w * 0.85, w * 0.07);
        
        // QR in white circle
        const qrContainerSize = Math.min(w, h) * 0.42;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(w / 2, h * 0.55, qrContainerSize / 2 + 20, 0, Math.PI * 2);
        ctx.fill();
        
        if (qrDataUrl) {
            const qrSize = qrContainerSize * 0.9;
            const img = await loadImage(qrDataUrl);
            ctx.drawImage(img, (w - qrSize) / 2, h * 0.55 - qrSize / 2, qrSize, qrSize);
        }
        
        // CTA
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.floor(w * 0.035)}px Inter, system-ui, sans-serif`;
        ctx.fillText('SCAN TO VOTE NOW', w / 2, h * 0.88);
    };
    
    // Elegant card design
    const drawElegantCard = async (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        // Dark background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);
        
        // Gradient overlay
        const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w * 0.8);
        gradient.addColorStop(0, `${colors.primary}30`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        
        // Decorative lines
        ctx.strokeStyle = `${colors.primary}40`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w * 0.1, h * 0.15);
        ctx.lineTo(w * 0.9, h * 0.15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(w * 0.1, h * 0.85);
        ctx.lineTo(w * 0.9, h * 0.85);
        ctx.stroke();
        
        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = `300 ${Math.floor(w * 0.02)}px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('CAST YOUR VOTE', w / 2, h * 0.12);
        
        ctx.font = `bold ${Math.floor(w * 0.04)}px Inter, system-ui, sans-serif`;
        wrapText(ctx, pollTitle, w / 2, h * 0.25, w * 0.75, w * 0.05);
        
        // QR Code with glow
        ctx.shadowColor = colors.primary;
        ctx.shadowBlur = 30;
        if (qrDataUrl) {
            const qrSize = Math.min(w, h) * 0.38;
            const qrX = (w - qrSize) / 2;
            const qrY = h * 0.4;
            
            // White background for QR
            ctx.fillStyle = '#ffffff';
            roundRect(ctx, qrX - 15, qrY - 15, qrSize + 30, qrSize + 30, 12);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            const img = await loadImage(qrDataUrl);
            ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
        }
        
        // Bottom text
        ctx.fillStyle = colors.accent;
        ctx.font = `600 ${Math.floor(w * 0.025)}px Inter, system-ui, sans-serif`;
        ctx.fillText('Scan • Vote • Share', w / 2, h * 0.92);
    };
    
    // Playful card design
    const drawPlayfulCard = async (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        // Light gradient background
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, '#fef3c7');
        gradient.addColorStop(1, '#fce7f3');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        
        // Floating circles
        const circleColors = [colors.primary, colors.secondary, colors.accent];
        for (let i = 0; i < 12; i++) {
            ctx.fillStyle = `${circleColors[i % 3]}20`;
            ctx.beginPath();
            ctx.arc(
                Math.random() * w,
                Math.random() * h,
                20 + Math.random() * 60,
                0, Math.PI * 2
            );
            ctx.fill();
        }
        
        // Fun emoji header
        ctx.font = `${Math.floor(w * 0.08)}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('🗳️', w / 2, h * 0.12);
        
        // Title
        ctx.fillStyle = colors.primary;
        ctx.font = `bold ${Math.floor(w * 0.042)}px Inter, system-ui, sans-serif`;
        wrapText(ctx, pollTitle, w / 2, h * 0.25, w * 0.8, w * 0.055);
        
        // QR in rounded square
        if (qrDataUrl) {
            const qrSize = Math.min(w, h) * 0.4;
            const qrX = (w - qrSize) / 2;
            const qrY = h * 0.38;
            
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = 'rgba(0,0,0,0.1)';
            ctx.shadowBlur = 20;
            roundRect(ctx, qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 20);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            const img = await loadImage(qrDataUrl);
            ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
        }
        
        // Fun CTA
        ctx.fillStyle = colors.secondary;
        ctx.font = `bold ${Math.floor(w * 0.03)}px Inter, system-ui, sans-serif`;
        ctx.fillText('📱 Scan me!', w / 2, h * 0.88);
    };
    
    // Corporate card design
    const drawCorporateCard = async (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        // White background
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, w, h);
        
        // Header bar
        ctx.fillStyle = colors.primary;
        ctx.fillRect(0, 0, w, h * 0.12);
        
        // Footer bar
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, h * 0.88, w, h * 0.12);
        
        // Logo placeholder
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.floor(w * 0.022)}px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'left';
        ctx.fillText('POLL', w * 0.05, h * 0.07);
        
        // Title
        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'center';
        ctx.font = `bold ${Math.floor(w * 0.038)}px Inter, system-ui, sans-serif`;
        wrapText(ctx, pollTitle, w / 2, h * 0.24, w * 0.8, w * 0.05);
        
        // QR Code
        if (qrDataUrl) {
            const qrSize = Math.min(w, h) * 0.4;
            const qrX = (w - qrSize) / 2;
            const qrY = h * 0.38;
            
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 2;
            ctx.strokeRect(qrX - 15, qrY - 15, qrSize + 30, qrSize + 30);
            
            const img = await loadImage(qrDataUrl);
            ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
        }
        
        // Instructions
        ctx.fillStyle = '#64748b';
        ctx.font = `${Math.floor(w * 0.022)}px Inter, system-ui, sans-serif`;
        ctx.fillText('Scan QR code to participate', w / 2, h * 0.82);
        
        // Footer URL
        ctx.fillStyle = '#ffffff';
        ctx.font = `${Math.floor(w * 0.018)}px Inter, system-ui, sans-serif`;
        ctx.fillText('votegenerator.com', w / 2, h * 0.94);
    };
    
    // Helper: rounded rectangle
    const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    };
    
    // Helper: wrap text
    const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line.trim(), x, currentY);
                line = words[i] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), x, currentY);
    };
    
    // Helper: load image
    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    };
    
    // Handle download - only when button clicked
    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            const dataUrl = await generateCard();
            const link = document.createElement('a');
            link.download = `poll-${selectedDesign}-${selectedFormat}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Failed to generate card:', err);
        } finally {
            setIsGenerating(false);
        }
    };
    
    // Generate preview
    const [previewUrl, setPreviewUrl] = useState<string>('');
    
    useEffect(() => {
        if (qrDataUrl) {
            generateCard().then(setPreviewUrl).catch(console.error);
        }
    }, [selectedDesign, selectedFormat, qrDataUrl, pollTitle]);
    
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${colors.gradient} p-6`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <Sparkles size={24} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Share Cards</h2>
                                    <p className="text-white/80 text-sm">Beautiful cards for social media</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X size={24} className="text-white" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row h-[calc(90vh-100px)]">
                        {/* Left: Options */}
                        <div className="lg:w-80 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto">
                            {/* Format Selection */}
                            <div className="mb-6">
                                <label className="text-sm font-bold text-slate-700 mb-3 block">Format</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {CARD_FORMATS.map(format => (
                                        <button
                                            key={format.id}
                                            onClick={() => setSelectedFormat(format.id)}
                                            className={`p-3 rounded-xl border-2 transition-all ${
                                                selectedFormat === format.id
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className={`mx-auto mb-2 bg-slate-200 ${
                                                format.id === 'square' ? 'w-8 h-8' :
                                                format.id === 'story' ? 'w-5 h-9' :
                                                'w-10 h-6'
                                            } rounded`} />
                                            <div className="text-xs font-semibold text-slate-700">{format.name}</div>
                                            <div className="text-[10px] text-slate-500">{format.ratio}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Design Selection */}
                            <div>
                                <label className="text-sm font-bold text-slate-700 mb-3 block">Style</label>
                                <div className="space-y-2">
                                    {CARD_DESIGNS.map(design => (
                                        <button
                                            key={design.id}
                                            onClick={() => setSelectedDesign(design.id)}
                                            className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                                                selectedDesign === design.id
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                selectedDesign === design.id ? 'bg-indigo-500' : 'bg-slate-100'
                                            }`}>
                                                {selectedDesign === design.id ? (
                                                    <Check size={18} className="text-white" />
                                                ) : (
                                                    <ImageIcon size={18} className="text-slate-400" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-700 text-sm">{design.name}</div>
                                                <div className="text-xs text-slate-500">{design.description}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* Right: Preview & Download */}
                        <div className="flex-1 p-6 flex flex-col overflow-hidden">
                            <div className="flex-1 flex items-center justify-center bg-slate-100 rounded-2xl overflow-hidden mb-4">
                                {previewUrl ? (
                                    <img 
                                        src={previewUrl} 
                                        alt="Card Preview" 
                                        className="max-w-full max-h-full object-contain"
                                        style={{
                                            maxHeight: selectedFormat === 'story' ? '100%' : undefined,
                                            width: selectedFormat === 'landscape' ? '100%' : undefined
                                        }}
                                    />
                                ) : (
                                    <div className="text-slate-400 flex flex-col items-center gap-2">
                                        <ImageIcon size={48} />
                                        <span className="text-sm">Generating preview...</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Download Button */}
                            <button
                                onClick={handleDownload}
                                disabled={isGenerating || !previewUrl}
                                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                                    isGenerating || !previewUrl
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : `bg-gradient-to-r ${colors.gradient} text-white hover:shadow-xl hover:scale-[1.02]`
                                }`}
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Download size={20} />
                                        Download {selectedFormat.charAt(0).toUpperCase() + selectedFormat.slice(1)} Card
                                    </>
                                )}
                            </button>
                            
                            <p className="text-center text-xs text-slate-500 mt-3">
                                High-resolution PNG • {formatConfig.width}×{formatConfig.height}px
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ShareCards;