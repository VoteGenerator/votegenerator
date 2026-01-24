// ============================================================================
// ShareCards.tsx - Beautiful Social Media Share Cards
// Theme-aware designs with elegant QR code placement
// Location: src/components/ShareCards.tsx
// ============================================================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Download, Check, Sparkles, 
    Image as ImageIcon
} from 'lucide-react';

interface ShareCardsProps {
    pollId: string;
    pollTitle: string;
    pollDescription?: string;
    pollUrl?: string;
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
    qrColor: string;
}> = {
    default: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#ec4899',
        gradient: 'from-indigo-600 via-purple-600 to-pink-500',
        text: '#ffffff',
        qrColor: '6366f1'
    },
    ocean: {
        primary: '#0891b2',
        secondary: '#06b6d4',
        accent: '#22d3ee',
        gradient: 'from-cyan-600 via-teal-500 to-emerald-500',
        text: '#ffffff',
        qrColor: '0891b2'
    },
    sunset: {
        primary: '#f97316',
        secondary: '#fb923c',
        accent: '#fbbf24',
        gradient: 'from-orange-500 via-amber-500 to-yellow-500',
        text: '#ffffff',
        qrColor: 'f97316'
    },
    forest: {
        primary: '#16a34a',
        secondary: '#22c55e',
        accent: '#4ade80',
        gradient: 'from-green-600 via-emerald-500 to-teal-500',
        text: '#ffffff',
        qrColor: '16a34a'
    },
    berry: {
        primary: '#db2777',
        secondary: '#ec4899',
        accent: '#f472b6',
        gradient: 'from-pink-600 via-rose-500 to-red-500',
        text: '#ffffff',
        qrColor: 'db2777'
    },
    midnight: {
        primary: '#3b82f6',
        secondary: '#6366f1',
        accent: '#8b5cf6',
        gradient: 'from-blue-600 via-indigo-600 to-purple-600',
        text: '#ffffff',
        qrColor: '3b82f6'
    },
    coral: {
        primary: '#f43f5e',
        secondary: '#fb7185',
        accent: '#fda4af',
        gradient: 'from-rose-500 via-pink-500 to-red-400',
        text: '#ffffff',
        qrColor: 'f43f5e'
    },
    lavender: {
        primary: '#8b5cf6',
        secondary: '#a78bfa',
        accent: '#c4b5fd',
        gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
        text: '#ffffff',
        qrColor: '8b5cf6'
    },
    monochrome: {
        primary: '#374151',
        secondary: '#4b5563',
        accent: '#9ca3af',
        gradient: 'from-slate-700 via-gray-600 to-slate-800',
        text: '#ffffff',
        qrColor: '374151'
    },
    gold: {
        primary: '#d97706',
        secondary: '#f59e0b',
        accent: '#fbbf24',
        gradient: 'from-amber-600 via-yellow-500 to-orange-500',
        text: '#ffffff',
        qrColor: 'd97706'
    }
};

// Card design templates
type CardDesign = 'modern' | 'minimal' | 'bold' | 'elegant' | 'playful' | 'corporate';

const CARD_DESIGNS: { 
    id: CardDesign; 
    name: string; 
    description: string;
    previewBg: string;
    previewAccent: string;
    previewStyle: 'gradient' | 'minimal' | 'pattern' | 'shapes' | 'split';
}[] = [
    { id: 'modern', name: 'Modern', description: 'Clean gradient with floating card', previewBg: 'from-indigo-500 via-purple-500 to-pink-500', previewAccent: 'white', previewStyle: 'gradient' },
    { id: 'minimal', name: 'Minimal', description: 'Simple & elegant white design', previewBg: 'from-slate-50 to-white', previewAccent: 'indigo', previewStyle: 'minimal' },
    { id: 'bold', name: 'Bold', description: 'Eye-catching full gradient', previewBg: 'from-orange-500 via-red-500 to-pink-500', previewAccent: 'white', previewStyle: 'gradient' },
    { id: 'elegant', name: 'Elegant', description: 'Sophisticated pattern overlay', previewBg: 'from-slate-800 via-slate-700 to-slate-900', previewAccent: 'gold', previewStyle: 'pattern' },
    { id: 'playful', name: 'Playful', description: 'Fun shapes and rounded corners', previewBg: 'from-cyan-400 via-blue-500 to-purple-600', previewAccent: 'yellow', previewStyle: 'shapes' },
    { id: 'corporate', name: 'Corporate', description: 'Professional business style', previewBg: 'from-slate-100 to-slate-200', previewAccent: 'blue', previewStyle: 'split' }
];

// Card format options
type CardFormat = 'square' | 'story' | 'landscape';

const CARD_FORMATS: { id: CardFormat; name: string; ratio: string; width: number; height: number; icon: string }[] = [
    { id: 'square', name: 'Square', ratio: '1:1', width: 1080, height: 1080, icon: '⬜' },
    { id: 'story', name: 'Story', ratio: '9:16', width: 1080, height: 1920, icon: '📱' },
    { id: 'landscape', name: 'Landscape', ratio: '16:9', width: 1920, height: 1080, icon: '🖥️' }
];

// Design Preview Component - Shows mini visual representation
const DesignPreview: React.FC<{ design: typeof CARD_DESIGNS[0]; isSelected: boolean; themeColors: typeof THEME_COLORS.default }> = ({ design, isSelected, themeColors }) => {
    return (
        <div className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden ${
            design.previewStyle === 'minimal' ? 'border border-slate-200' : ''
        }`}>
            {/* Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${design.previewBg}`} />
            
            {/* Pattern overlay for elegant */}
            {design.previewStyle === 'pattern' && (
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,215,0,0.3) 1px, transparent 0)',
                    backgroundSize: '8px 8px'
                }} />
            )}
            
            {/* Floating shapes for playful */}
            {design.previewStyle === 'shapes' && (
                <>
                    <div className="absolute top-2 right-2 w-4 h-4 bg-yellow-300 rounded-full opacity-80" />
                    <div className="absolute bottom-3 left-2 w-3 h-3 bg-pink-300 rounded-full opacity-80" />
                    <div className="absolute top-1/2 right-3 w-2 h-2 bg-white rounded-full opacity-60" />
                </>
            )}
            
            {/* Split design for corporate */}
            {design.previewStyle === 'split' && (
                <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-gradient-to-b from-blue-600 to-blue-700" />
            )}
            
            {/* Center card mockup */}
            <div className={`absolute inset-0 flex items-center justify-center p-3`}>
                {design.previewStyle === 'gradient' || design.previewStyle === 'shapes' ? (
                    <div className="bg-white/95 rounded-lg shadow-lg w-[70%] h-[65%] flex flex-col items-center justify-center p-2">
                        <div className="w-3 h-0.5 bg-slate-300 rounded mb-1" />
                        <div className="w-6 h-6 bg-slate-100 rounded border border-slate-200 mb-1 flex items-center justify-center">
                            <div className="w-4 h-4 grid grid-cols-3 gap-px">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="bg-slate-400 rounded-[1px]" />
                                ))}
                            </div>
                        </div>
                        <div className="w-4 h-0.5 bg-slate-200 rounded" />
                    </div>
                ) : design.previewStyle === 'minimal' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                        <div className="w-8 h-1 bg-slate-800 rounded mb-2" />
                        <div className="w-8 h-8 bg-slate-100 rounded border border-slate-200 mb-1 flex items-center justify-center">
                            <div className="w-5 h-5 grid grid-cols-3 gap-px">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="bg-indigo-400 rounded-[1px]" />
                                ))}
                            </div>
                        </div>
                        <div className="w-6 h-0.5 bg-slate-300 rounded" />
                    </div>
                ) : design.previewStyle === 'pattern' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="text-amber-300 text-[8px] font-bold mb-1">✦ VOTE ✦</div>
                        <div className="w-8 h-8 bg-white/10 backdrop-blur rounded border border-white/20 mb-1 flex items-center justify-center">
                            <div className="w-5 h-5 grid grid-cols-3 gap-px">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="bg-amber-300/80 rounded-[1px]" />
                                ))}
                            </div>
                        </div>
                        <div className="w-6 h-0.5 bg-white/30 rounded" />
                    </div>
                ) : design.previewStyle === 'split' ? (
                    <div className="w-full h-full flex">
                        <div className="w-1/4" />
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="w-6 h-1 bg-slate-600 rounded mb-2" />
                            <div className="w-7 h-7 bg-white rounded border border-slate-300 shadow-sm mb-1 flex items-center justify-center">
                                <div className="w-4 h-4 grid grid-cols-3 gap-px">
                                    {[...Array(9)].map((_, i) => (
                                        <div key={i} className="bg-blue-500 rounded-[1px]" />
                                    ))}
                                </div>
                            </div>
                            <div className="w-5 h-0.5 bg-slate-400 rounded" />
                        </div>
                    </div>
                ) : null}
            </div>
            
            {/* Selection indicator */}
            {isSelected && (
                <div className="absolute inset-0 ring-2 ring-indigo-500 ring-offset-2 rounded-xl" />
            )}
        </div>
    );
};

const ShareCards: React.FC<ShareCardsProps> = ({ pollId, pollTitle, pollDescription, pollUrl, theme = 'default', onClose }) => {
    const [selectedDesign, setSelectedDesign] = useState<CardDesign>('modern');
    const [selectedFormat, setSelectedFormat] = useState<CardFormat>('square');
    const [isGenerating, setIsGenerating] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState<string>('');
    const [previewUrl, setPreviewUrl] = useState<string>('');
    
    const colors = THEME_COLORS[theme] || THEME_COLORS.default;
    const shareUrl = pollUrl || `${window.location.origin}/#id=${pollId}`;
    const formatConfig = CARD_FORMATS.find(f => f.id === selectedFormat) || CARD_FORMATS[0];
    
    // Generate QR code using a free API
    useEffect(() => {
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}&color=${colors.qrColor}&bgcolor=ffffff`;
        setQrDataUrl(qrApiUrl);
    }, [shareUrl, colors.qrColor]);
    
    // Helper: load image
    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
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
    
    // Draw card on canvas
    const generateCard = async (): Promise<string> => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');
        
        const w = formatConfig.width;
        const h = formatConfig.height;
        canvas.width = w;
        canvas.height = h;
        
        // Draw based on design
        switch (selectedDesign) {
            case 'modern':
                await drawModernCard(ctx, w, h);
                break;
            case 'minimal':
                await drawMinimalCard(ctx, w, h);
                break;
            case 'bold':
                await drawBoldCard(ctx, w, h);
                break;
            case 'elegant':
                await drawElegantCard(ctx, w, h);
                break;
            case 'playful':
                await drawPlayfulCard(ctx, w, h);
                break;
            case 'corporate':
                await drawCorporateCard(ctx, w, h);
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
            try {
                const qrSize = Math.min(cardW, cardH) * 0.45;
                const qrX = (w - qrSize) / 2;
                const qrY = cardY + cardH * 0.35;
                const img = await loadImage(qrDataUrl);
                ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
            } catch (e) {
                console.error('Failed to load QR:', e);
            }
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
            try {
                const qrSize = Math.min(w, h) * 0.4;
                const qrX = (w - qrSize) / 2;
                const qrY = h * 0.35;
                const img = await loadImage(qrDataUrl);
                ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
            } catch (e) {
                console.error('Failed to load QR:', e);
            }
        }
        
        // Scan text
        ctx.fillStyle = colors.primary;
        ctx.font = `600 ${Math.floor(w * 0.028)}px Inter, system-ui, sans-serif`;
        ctx.fillText('📱 Scan to vote', w / 2, h * 0.82);
        
        // URL
        ctx.fillStyle = '#94a3b8';
        ctx.font = `${Math.floor(w * 0.022)}px Inter, system-ui, sans-serif`;
        ctx.fillText(shareUrl.replace('https://', '').replace('http://', ''), w / 2, h * 0.9);
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
            try {
                const qrSize = qrContainerSize * 0.9;
                const img = await loadImage(qrDataUrl);
                ctx.drawImage(img, (w - qrSize) / 2, h * 0.55 - qrSize / 2, qrSize, qrSize);
            } catch (e) {
                console.error('Failed to load QR:', e);
            }
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
        
        // Header
        ctx.fillStyle = '#ffffff';
        ctx.font = `300 ${Math.floor(w * 0.02)}px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('CAST YOUR VOTE', w / 2, h * 0.12);
        
        // Title
        ctx.font = `bold ${Math.floor(w * 0.04)}px Inter, system-ui, sans-serif`;
        wrapText(ctx, pollTitle, w / 2, h * 0.25, w * 0.75, w * 0.05);
        
        // QR Code with background
        if (qrDataUrl) {
            try {
                const qrSize = Math.min(w, h) * 0.38;
                const qrX = (w - qrSize) / 2;
                const qrY = h * 0.4;
                
                // White background for QR
                ctx.fillStyle = '#ffffff';
                roundRect(ctx, qrX - 15, qrY - 15, qrSize + 30, qrSize + 30, 12);
                ctx.fill();
                
                const img = await loadImage(qrDataUrl);
                ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
            } catch (e) {
                console.error('Failed to load QR:', e);
            }
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
        
        // Floating circles (deterministic positions)
        const circlePositions = [
            { x: 0.1, y: 0.2 }, { x: 0.8, y: 0.1 }, { x: 0.2, y: 0.7 },
            { x: 0.9, y: 0.6 }, { x: 0.5, y: 0.9 }, { x: 0.15, y: 0.4 }
        ];
        const circleColors = [colors.primary, colors.secondary, colors.accent];
        circlePositions.forEach((pos, i) => {
            ctx.fillStyle = `${circleColors[i % 3]}20`;
            ctx.beginPath();
            ctx.arc(pos.x * w, pos.y * h, 30 + (i * 15), 0, Math.PI * 2);
            ctx.fill();
        });
        
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
            try {
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
            } catch (e) {
                console.error('Failed to load QR:', e);
            }
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
        
        // Logo text
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
            try {
                const qrSize = Math.min(w, h) * 0.4;
                const qrX = (w - qrSize) / 2;
                const qrY = h * 0.38;
                
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 2;
                ctx.strokeRect(qrX - 15, qrY - 15, qrSize + 30, qrSize + 30);
                
                const img = await loadImage(qrDataUrl);
                ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
            } catch (e) {
                console.error('Failed to load QR:', e);
            }
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
    
    // Generate preview when design/format changes
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
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
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
                                <label className="text-sm font-bold text-slate-700 mb-3 block flex items-center gap-2">
                                    📐 Format
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {CARD_FORMATS.map(format => (
                                        <button
                                            key={format.id}
                                            onClick={() => setSelectedFormat(format.id)}
                                            className={`group p-3 rounded-xl border-2 transition-all hover:shadow-md ${
                                                selectedFormat === format.id
                                                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-sm'
                                                    : 'border-slate-200 hover:border-indigo-300 bg-white'
                                            }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className={`mb-2 bg-gradient-to-br ${
                                                    selectedFormat === format.id 
                                                        ? 'from-indigo-400 to-purple-500' 
                                                        : 'from-slate-200 to-slate-300 group-hover:from-indigo-200 group-hover:to-purple-200'
                                                } ${
                                                    format.id === 'square' ? 'w-10 h-10' :
                                                    format.id === 'story' ? 'w-7 h-12' :
                                                    'w-12 h-7'
                                                } rounded-lg shadow-sm transition-all`} />
                                                <div className={`text-xs font-bold ${selectedFormat === format.id ? 'text-indigo-700' : 'text-slate-600'}`}>
                                                    {format.name}
                                                </div>
                                                <div className={`text-[10px] ${selectedFormat === format.id ? 'text-indigo-500' : 'text-slate-400'}`}>
                                                    {format.ratio}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Design Selection - Visual Grid */}
                            <div>
                                <label className="text-sm font-bold text-slate-700 mb-3 block flex items-center gap-2">
                                    🎨 Style
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {CARD_DESIGNS.map(design => (
                                        <button
                                            key={design.id}
                                            onClick={() => setSelectedDesign(design.id)}
                                            className={`group rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg ${
                                                selectedDesign === design.id
                                                    ? 'border-indigo-500 shadow-md ring-2 ring-indigo-200'
                                                    : 'border-slate-200 hover:border-indigo-300'
                                            }`}
                                        >
                                            {/* Visual Preview */}
                                            <DesignPreview 
                                                design={design} 
                                                isSelected={selectedDesign === design.id}
                                                themeColors={colors}
                                            />
                                            
                                            {/* Label */}
                                            <div className={`p-2.5 text-center transition-colors ${
                                                selectedDesign === design.id 
                                                    ? 'bg-indigo-50' 
                                                    : 'bg-white group-hover:bg-slate-50'
                                            }`}>
                                                <div className={`text-xs font-bold ${
                                                    selectedDesign === design.id ? 'text-indigo-700' : 'text-slate-700'
                                                }`}>
                                                    {design.name}
                                                </div>
                                                <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                                                    {design.description}
                                                </div>
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