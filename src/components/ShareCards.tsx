// ============================================================================
// ShareCards.tsx - Stunning Social Media Share Cards
// Premium designs with beautiful visuals and engaging UI
// Location: src/components/ShareCards.tsx
// ============================================================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Download, Check, Sparkles, Star, Zap,
    Image as ImageIcon, Palette, Crown
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
    default: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#ec4899', gradient: 'from-indigo-600 via-purple-600 to-pink-500', text: '#ffffff', qrColor: '6366f1' },
    ocean: { primary: '#0891b2', secondary: '#06b6d4', accent: '#22d3ee', gradient: 'from-cyan-600 via-teal-500 to-emerald-500', text: '#ffffff', qrColor: '0891b2' },
    sunset: { primary: '#f97316', secondary: '#fb923c', accent: '#fbbf24', gradient: 'from-orange-500 via-amber-500 to-yellow-500', text: '#ffffff', qrColor: 'f97316' },
    forest: { primary: '#16a34a', secondary: '#22c55e', accent: '#4ade80', gradient: 'from-green-600 via-emerald-500 to-teal-500', text: '#ffffff', qrColor: '16a34a' },
    berry: { primary: '#db2777', secondary: '#ec4899', accent: '#f472b6', gradient: 'from-pink-600 via-rose-500 to-red-500', text: '#ffffff', qrColor: 'db2777' },
    midnight: { primary: '#3b82f6', secondary: '#6366f1', accent: '#8b5cf6', gradient: 'from-blue-600 via-indigo-600 to-purple-600', text: '#ffffff', qrColor: '3b82f6' },
    coral: { primary: '#f43f5e', secondary: '#fb7185', accent: '#fda4af', gradient: 'from-rose-500 via-pink-500 to-red-400', text: '#ffffff', qrColor: 'f43f5e' },
    lavender: { primary: '#8b5cf6', secondary: '#a78bfa', accent: '#c4b5fd', gradient: 'from-violet-500 via-purple-500 to-fuchsia-500', text: '#ffffff', qrColor: '8b5cf6' },
    monochrome: { primary: '#374151', secondary: '#4b5563', accent: '#9ca3af', gradient: 'from-slate-700 via-gray-600 to-slate-800', text: '#ffffff', qrColor: '374151' },
    nature: { primary: '#059669', secondary: '#10b981', accent: '#34d399', gradient: 'from-emerald-600 via-green-500 to-lime-500', text: '#ffffff', qrColor: '059669' },
    royal: { primary: '#7c3aed', secondary: '#8b5cf6', accent: '#a78bfa', gradient: 'from-violet-600 via-purple-600 to-indigo-600', text: '#ffffff', qrColor: '7c3aed' },
    autumn: { primary: '#ea580c', secondary: '#f97316', accent: '#fb923c', gradient: 'from-orange-600 via-amber-500 to-yellow-500', text: '#ffffff', qrColor: 'ea580c' }
};

type CardDesign = 'neon' | 'glass' | 'gradient' | 'minimal' | 'retro' | 'premium';
type CardFormat = 'square' | 'story' | 'landscape';

interface DesignConfig {
    id: CardDesign;
    name: string;
    tagline: string;
    popular?: boolean;
}

const CARD_DESIGNS: DesignConfig[] = [
    { id: 'neon', name: 'Neon Glow', tagline: 'Electric & eye-catching', popular: true },
    { id: 'glass', name: 'Glassmorphism', tagline: 'Modern frosted glass' },
    { id: 'gradient', name: 'Vibrant', tagline: 'Bold & colorful' },
    { id: 'minimal', name: 'Minimal', tagline: 'Clean & simple' },
    { id: 'retro', name: 'Retro Wave', tagline: '80s synthwave vibes' },
    { id: 'premium', name: 'Dark Premium', tagline: 'Luxury & sophisticated' }
];

const CARD_FORMATS: { id: CardFormat; name: string; ratio: string; width: number; height: number; platforms: string }[] = [
    { id: 'square', name: 'Square', ratio: '1:1', width: 1080, height: 1080, platforms: 'Instagram, Facebook' },
    { id: 'story', name: 'Story', ratio: '9:16', width: 1080, height: 1920, platforms: 'Stories, Reels, TikTok' },
    { id: 'landscape', name: 'Wide', ratio: '16:9', width: 1920, height: 1080, platforms: 'Twitter, LinkedIn' }
];

// ============================================================================
// MINI CARD PREVIEW COMPONENT - Realistic visual representations
// ============================================================================
const MiniCardPreview: React.FC<{ designId: CardDesign; isSelected: boolean }> = ({ designId, isSelected }) => {
    const baseClasses = "relative w-full aspect-[4/3] rounded-xl overflow-hidden transition-all duration-300";
    
    switch (designId) {
        case 'neon':
            return (
                <div className={`${baseClasses} bg-[#0f0f23]`}>
                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: 'linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)',
                        backgroundSize: '12px 12px'
                    }} />
                    {/* Glow orbs */}
                    <div className="absolute top-2 left-3 w-6 h-6 bg-pink-500/40 rounded-full blur-md" />
                    <div className="absolute bottom-3 right-2 w-8 h-8 bg-purple-500/40 rounded-full blur-md" />
                    {/* Card */}
                    <div className="absolute inset-3 flex items-center justify-center">
                        <div className="w-[75%] h-[70%] bg-slate-900/90 rounded-lg border-2 border-purple-500/50 shadow-[0_0_20px_rgba(139,92,246,0.4)] flex flex-col items-center justify-center gap-1">
                            <div className="text-[6px] text-purple-400 font-bold">✧ VOTE ✧</div>
                            <div className="w-6 h-6 bg-white rounded grid grid-cols-3 gap-[2px] p-[3px]">
                                {[...Array(9)].map((_, i) => <div key={i} className="bg-purple-600 rounded-[1px]" />)}
                            </div>
                            <div className="text-[5px] text-purple-300/70">Scan to vote</div>
                        </div>
                    </div>
                </div>
            );
            
        case 'glass':
            return (
                <div className={`${baseClasses} bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500`}>
                    {/* Floating blobs */}
                    <div className="absolute top-1 left-2 w-8 h-8 bg-white/20 rounded-full blur-sm" />
                    <div className="absolute bottom-2 right-1 w-10 h-10 bg-white/15 rounded-full blur-sm" />
                    {/* Glass card */}
                    <div className="absolute inset-3 flex items-center justify-center">
                        <div className="w-[75%] h-[70%] bg-white/25 backdrop-blur-sm rounded-xl border border-white/40 shadow-lg flex flex-col items-center justify-center gap-1">
                            <div className="w-10 h-1 bg-white/80 rounded" />
                            <div className="w-7 h-7 bg-white rounded-lg grid grid-cols-3 gap-[2px] p-[3px] shadow-sm">
                                {[...Array(9)].map((_, i) => <div key={i} className="bg-purple-500 rounded-[1px]" />)}
                            </div>
                            <div className="text-[5px] text-white font-medium">Scan ✨</div>
                        </div>
                    </div>
                </div>
            );
            
        case 'gradient':
            return (
                <div className={`${baseClasses} bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600`}>
                    {/* Wave decoration */}
                    <svg className="absolute bottom-0 left-0 right-0 h-1/3 opacity-20" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <path d="M0,15 Q25,5 50,15 T100,15 L100,30 L0,30 Z" fill="white" />
                    </svg>
                    {/* Card */}
                    <div className="absolute inset-3 flex items-center justify-center">
                        <div className="w-[72%] h-[68%] bg-white rounded-xl shadow-xl flex flex-col items-center justify-center gap-1">
                            <div className="text-lg">🗳️</div>
                            <div className="w-6 h-6 bg-slate-100 rounded grid grid-cols-3 gap-[2px] p-[3px]">
                                {[...Array(9)].map((_, i) => <div key={i} className="bg-pink-500 rounded-[1px]" />)}
                            </div>
                            <div className="text-[5px] text-slate-500">Scan to vote</div>
                        </div>
                    </div>
                </div>
            );
            
        case 'minimal':
            return (
                <div className={`${baseClasses} bg-white border border-slate-200`}>
                    {/* Accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-3">
                        <div className="w-12 h-1.5 bg-slate-800 rounded" />
                        <div className="w-1 h-1" />
                        <div className="w-8 h-8 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-3 gap-[2px] p-[4px]">
                            {[...Array(9)].map((_, i) => <div key={i} className="bg-indigo-500 rounded-[1px]" />)}
                        </div>
                        <div className="text-[5px] text-indigo-600 font-medium">📱 Scan to vote</div>
                    </div>
                </div>
            );
            
        case 'retro':
            return (
                <div className={`${baseClasses} overflow-hidden`}>
                    {/* Sunset gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-pink-600 to-orange-400" />
                    {/* Sun */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-b from-yellow-300 to-orange-500 rounded-full" />
                    {/* Sun lines */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 overflow-hidden">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-[3px] bg-purple-900 mb-[3px]" style={{ marginTop: i * 2 }} />
                        ))}
                    </div>
                    {/* Grid floor */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/4 opacity-40" style={{
                        backgroundImage: 'linear-gradient(rgba(251,191,36,0.6) 1px, transparent 1px)',
                        backgroundSize: '8px 6px'
                    }} />
                    {/* Title area */}
                    <div className="absolute top-2 left-0 right-0 text-center">
                        <div className="text-[7px] text-white font-bold drop-shadow-lg">VOTE NOW</div>
                    </div>
                    {/* QR */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded p-[2px]">
                        <div className="w-full h-full grid grid-cols-3 gap-[1px]">
                            {[...Array(9)].map((_, i) => <div key={i} className="bg-purple-800 rounded-[1px]" />)}
                        </div>
                    </div>
                </div>
            );
            
        case 'premium':
            return (
                <div className={`${baseClasses} bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900`}>
                    {/* Corner accents */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-amber-500/50" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-amber-500/50" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-amber-500/50" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-amber-500/50" />
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                        <div className="text-[6px] text-amber-400 font-medium tracking-wider">✦ EXCLUSIVE ✦</div>
                        <div className="w-10 h-0.5 bg-white/20 rounded" />
                        <div className="w-7 h-7 bg-white rounded border border-amber-500/30 grid grid-cols-3 gap-[2px] p-[3px] mt-1">
                            {[...Array(9)].map((_, i) => <div key={i} className="bg-amber-600 rounded-[1px]" />)}
                        </div>
                        <div className="text-[5px] text-slate-400">Scan to participate</div>
                    </div>
                </div>
            );
            
        default:
            return <div className={baseClasses} />;
    }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const ShareCards: React.FC<ShareCardsProps> = ({ pollId, pollTitle, pollDescription, pollUrl, theme = 'default', onClose }) => {
    const [selectedDesign, setSelectedDesign] = useState<CardDesign>('neon');
    const [selectedFormat, setSelectedFormat] = useState<CardFormat>('square');
    const [isGenerating, setIsGenerating] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState<string>('');
    const [previewUrl, setPreviewUrl] = useState<string>('');
    
    const colors = THEME_COLORS[theme] || THEME_COLORS.default;
    const shareUrl = pollUrl || `${window.location.origin}/#id=${pollId}`;
    const formatConfig = CARD_FORMATS.find(f => f.id === selectedFormat) || CARD_FORMATS[0];
    
    useEffect(() => {
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(shareUrl)}&color=${colors.qrColor}&bgcolor=ffffff&margin=1`;
        setQrDataUrl(qrApiUrl);
    }, [shareUrl, colors.qrColor]);
    
    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    };
    
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
    
    const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        let lineCount = 0;
        
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line.trim(), x, currentY);
                line = words[i] + ' ';
                currentY += lineHeight;
                lineCount++;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), x, currentY);
        return lineCount + 1;
    };
    
    const generateCard = async (): Promise<string> => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');
        
        const w = formatConfig.width;
        const h = formatConfig.height;
        canvas.width = w;
        canvas.height = h;
        
        switch (selectedDesign) {
            case 'neon': await drawNeonCard(ctx, w, h); break;
            case 'glass': await drawGlassCard(ctx, w, h); break;
            case 'gradient': await drawGradientCard(ctx, w, h); break;
            case 'minimal': await drawMinimalCard(ctx, w, h); break;
            case 'retro': await drawRetroCard(ctx, w, h); break;
            case 'premium': await drawPremiumCard(ctx, w, h); break;
        }
        
        return canvas.toDataURL('image/png');
    };
    
    // ========== NEON GLOW ==========
    const drawNeonCard = async (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        // Dark bg
        const bgGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w * 0.8);
        bgGrad.addColorStop(0, '#1a1a2e');
        bgGrad.addColorStop(0.5, '#16213e');
        bgGrad.addColorStop(1, '#0f0f23');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);
        
        // Grid
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
        ctx.lineWidth = 1;
        const gridSize = w * 0.04;
        for (let i = 0; i < w; i += gridSize) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
        for (let i = 0; i < h; i += gridSize) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }
        
        // Glow orbs
        const drawGlow = (x: number, y: number, r: number, color: string) => {
            ctx.shadowColor = color; ctx.shadowBlur = 80;
            ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        };
        drawGlow(w * 0.15, h * 0.2, w * 0.1, 'rgba(236, 72, 153, 0.25)');
        drawGlow(w * 0.85, h * 0.75, w * 0.12, 'rgba(139, 92, 246, 0.25)');
        drawGlow(w * 0.1, h * 0.8, w * 0.07, 'rgba(34, 211, 238, 0.2)');
        
        // Card
        const cardW = w * 0.78, cardH = h * 0.7, cardX = (w - cardW) / 2, cardY = (h - cardH) / 2;
        ctx.shadowColor = colors.primary; ctx.shadowBlur = 50;
        ctx.fillStyle = 'rgba(20, 20, 40, 0.95)';
        roundRect(ctx, cardX, cardY, cardW, cardH, 40); ctx.fill();
        ctx.shadowBlur = 25; ctx.strokeStyle = colors.primary; ctx.lineWidth = 3;
        roundRect(ctx, cardX, cardY, cardW, cardH, 40); ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Label
        ctx.shadowColor = colors.accent; ctx.shadowBlur = 15;
        ctx.fillStyle = colors.accent;
        ctx.font = `bold ${w * 0.028}px Inter, system-ui`;
        ctx.textAlign = 'center';
        ctx.fillText('✧ VOTE NOW ✧', w / 2, cardY + cardH * 0.11);
        ctx.shadowBlur = 0;
        
        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${w * 0.042}px Inter, system-ui`;
        wrapText(ctx, pollTitle, w / 2, cardY + cardH * 0.24, cardW * 0.85, w * 0.055);
        
        // QR
        if (qrDataUrl) {
            try {
                const qrSize = Math.min(cardW, cardH) * 0.42, qrX = (w - qrSize) / 2, qrY = cardY + cardH * 0.38;
                ctx.shadowColor = colors.primary; ctx.shadowBlur = 30;
                ctx.fillStyle = '#ffffff';
                roundRect(ctx, qrX - 14, qrY - 14, qrSize + 28, qrSize + 28, 16); ctx.fill();
                ctx.shadowBlur = 0;
                const img = await loadImage(qrDataUrl);
                ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
            } catch (e) { console.error('QR failed:', e); }
        }
        
        // CTA
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = `500 ${w * 0.024}px Inter, system-ui`;
        ctx.fillText('📱 Scan to cast your vote', w / 2, cardY + cardH * 0.9);
        
        // Brand
        ctx.fillStyle = 'rgba(139, 92, 246, 0.7)';
        ctx.font = `600 ${w * 0.018}px Inter, system-ui`;
        ctx.fillText('votegenerator.com', w / 2, h - w * 0.035);
    };
    
    // ========== GLASSMORPHISM ==========
    const drawGlassCard = async (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        // Vibrant bg
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#667eea'); grad.addColorStop(0.3, '#764ba2');
        grad.addColorStop(0.6, '#f093fb'); grad.addColorStop(1, '#f5576c');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
        
        // Blobs
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath(); ctx.arc(w * 0.2, h * 0.25, w * 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.beginPath(); ctx.arc(w * 0.8, h * 0.7, w * 0.25, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.beginPath(); ctx.arc(w * 0.15, h * 0.8, w * 0.15, 0, Math.PI * 2); ctx.fill();
        
        // Glass card
        const cardW = w * 0.8, cardH = h * 0.68, cardX = (w - cardW) / 2, cardY = (h - cardH) / 2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.shadowColor = 'rgba(0,0,0,0.15)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 15;
        roundRect(ctx, cardX, cardY, cardW, cardH, 36); ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)'; ctx.lineWidth = 2;
        roundRect(ctx, cardX, cardY, cardW, cardH, 36); ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${w * 0.045}px Inter, system-ui`;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 12;
        wrapText(ctx, pollTitle, w / 2, cardY + cardH * 0.18, cardW * 0.85, w * 0.058);
        ctx.shadowBlur = 0;
        
        // QR
        if (qrDataUrl) {
            try {
                const qrSize = Math.min(cardW, cardH) * 0.44, qrX = (w - qrSize) / 2, qrY = cardY + cardH * 0.34;
                ctx.fillStyle = '#ffffff';
                roundRect(ctx, qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 16); ctx.fill();
                const img = await loadImage(qrDataUrl);
                ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
            } catch (e) { console.error('QR failed:', e); }
        }
        
        // CTA
        ctx.fillStyle = '#ffffff';
        ctx.font = `600 ${w * 0.026}px Inter, system-ui`;
        ctx.fillText('Scan to vote ✨', w / 2, cardY + cardH * 0.9);
        
        // Brand
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = `600 ${w * 0.02}px Inter, system-ui`;
        ctx.fillText('votegenerator.com', w / 2, h - w * 0.04);
    };
    
    // ========== VIBRANT GRADIENT ==========
    const drawGradientCard = async (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        // Multi-color bg
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, colors.primary); grad.addColorStop(0.4, colors.secondary);
        grad.addColorStop(0.7, colors.accent); grad.addColorStop(1, colors.primary);
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
        
        // Waves
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.beginPath(); ctx.moveTo(0, h * 0.6);
        ctx.bezierCurveTo(w * 0.3, h * 0.5, w * 0.7, h * 0.7, w, h * 0.55);
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.beginPath(); ctx.moveTo(0, h * 0.75);
        ctx.bezierCurveTo(w * 0.4, h * 0.65, w * 0.6, h * 0.85, w, h * 0.7);
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.fill();
        
        // White card
        const cardW = w * 0.76, cardH = h * 0.66, cardX = (w - cardW) / 2, cardY = (h - cardH) / 2;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 15;
        roundRect(ctx, cardX, cardY, cardW, cardH, 32); ctx.fill();
        ctx.shadowBlur = 0;
        
        // Emoji
        ctx.font = `${w * 0.06}px Inter, system-ui`;
        ctx.textAlign = 'center';
        ctx.fillText('🗳️', w / 2, cardY + cardH * 0.13);
        
        // Title
        ctx.fillStyle = '#1e293b';
        ctx.font = `bold ${w * 0.04}px Inter, system-ui`;
        wrapText(ctx, pollTitle, w / 2, cardY + cardH * 0.26, cardW * 0.85, w * 0.052);
        
        // QR
        if (qrDataUrl) {
            try {
                const qrSize = Math.min(cardW, cardH) * 0.43, qrX = (w - qrSize) / 2, qrY = cardY + cardH * 0.38;
                const img = await loadImage(qrDataUrl);
                ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
            } catch (e) { console.error('QR failed:', e); }
        }
        
        // CTA
        ctx.fillStyle = '#64748b';
        ctx.font = `500 ${w * 0.024}px Inter, system-ui`;
        ctx.fillText('Scan QR code to vote', w / 2, cardY + cardH * 0.9);
        
        // Brand
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = `bold ${w * 0.02}px Inter, system-ui`;
        ctx.fillText('votegenerator.com', w / 2, h - w * 0.035);
    };
    
    // ========== MINIMAL ==========
    const drawMinimalCard = async (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
        
        // Accent stripe
        const stripeGrad = ctx.createLinearGradient(0, 0, w, 0);
        stripeGrad.addColorStop(0, colors.primary); stripeGrad.addColorStop(0.5, colors.secondary); stripeGrad.addColorStop(1, colors.accent);
        ctx.fillStyle = stripeGrad;
        ctx.fillRect(0, 0, w, h * 0.012);
        
        // Title
        ctx.fillStyle = '#0f172a';
        ctx.font = `700 ${w * 0.048}px Inter, system-ui`;
        ctx.textAlign = 'center';
        wrapText(ctx, pollTitle, w / 2, h * 0.18, w * 0.8, w * 0.06);
        
        // Divider
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(w * 0.3, h * 0.28, w * 0.4, 2);
        
        // QR
        if (qrDataUrl) {
            try {
                const qrSize = Math.min(w, h) * 0.42, qrX = (w - qrSize) / 2, qrY = h * 0.34;
                ctx.strokeStyle = '#f1f5f9'; ctx.lineWidth = 4;
                roundRect(ctx, qrX - 18, qrY - 18, qrSize + 36, qrSize + 36, 12); ctx.stroke();
                const img = await loadImage(qrDataUrl);
                ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
            } catch (e) { console.error('QR failed:', e); }
        }
        
        // CTA
        ctx.fillStyle = colors.primary;
        ctx.font = `600 ${w * 0.028}px Inter, system-ui`;
        ctx.fillText('📱 Scan to participate', w / 2, h * 0.84);
        
        // URL
        ctx.fillStyle = '#94a3b8';
        ctx.font = `500 ${w * 0.022}px Inter, system-ui`;
        ctx.fillText(shareUrl.replace('https://', '').replace('http://', ''), w / 2, h * 0.92);
    };
    
    // ========== RETRO WAVE ==========
    const drawRetroCard = async (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        // Sunset
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#2d1b4e'); grad.addColorStop(0.3, '#5b2c6f');
        grad.addColorStop(0.5, '#c0392b'); grad.addColorStop(0.7, '#e74c3c'); grad.addColorStop(1, '#f39c12');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
        
        // Sun
        const sunGrad = ctx.createRadialGradient(w/2, h * 0.55, 0, w/2, h * 0.55, w * 0.2);
        sunGrad.addColorStop(0, '#f1c40f'); sunGrad.addColorStop(0.7, '#e67e22'); sunGrad.addColorStop(1, 'rgba(231, 76, 60, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath(); ctx.arc(w/2, h * 0.55, w * 0.2, 0, Math.PI * 2); ctx.fill();
        
        // Sun lines
        ctx.fillStyle = '#2d1b4e';
        for (let i = 0; i < 8; i++) {
            const y = h * 0.48 + i * (w * 0.025);
            ctx.fillRect(w * 0.32, y, w * 0.36, 3 + i * 1.5);
        }
        
        // Grid
        ctx.strokeStyle = 'rgba(241, 196, 15, 0.4)'; ctx.lineWidth = 2;
        for (let i = 0; i < 10; i++) {
            const y = h * 0.7 + i * (h * 0.035);
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
        for (let i = -5; i <= 5; i++) {
            ctx.beginPath(); ctx.moveTo(w/2 + i * (w * 0.1), h * 0.7);
            ctx.lineTo(w/2 + i * (w * 0.25), h); ctx.stroke();
        }
        
        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${w * 0.05}px Inter, system-ui`;
        ctx.textAlign = 'center';
        ctx.shadowColor = '#e74c3c'; ctx.shadowBlur = 25;
        wrapText(ctx, pollTitle.toUpperCase(), w / 2, h * 0.15, w * 0.85, w * 0.065);
        ctx.shadowBlur = 0;
        
        // QR
        if (qrDataUrl) {
            try {
                const qrSize = Math.min(w, h) * 0.32, qrX = (w - qrSize) / 2, qrY = h * 0.22;
                ctx.shadowColor = '#f1c40f'; ctx.shadowBlur = 20;
                ctx.fillStyle = '#ffffff';
                roundRect(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 8); ctx.fill();
                ctx.shadowBlur = 0;
                const img = await loadImage(qrDataUrl);
                ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
            } catch (e) { console.error('QR failed:', e); }
        }
        
        // CTA
        ctx.fillStyle = '#f1c40f';
        ctx.font = `bold ${w * 0.025}px Inter, system-ui`;
        ctx.fillText('⚡ SCAN TO VOTE ⚡', w / 2, h * 0.62);
        
        // Brand
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = `600 ${w * 0.018}px Inter, system-ui`;
        ctx.fillText('votegenerator.com', w / 2, h * 0.97);
    };
    
    // ========== DARK PREMIUM ==========
    const drawPremiumCard = async (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        // Dark bg
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#1a1a2e'); bgGrad.addColorStop(0.5, '#16213e'); bgGrad.addColorStop(1, '#0f0f1a');
        ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, w, h);
        
        // Texture
        ctx.fillStyle = 'rgba(255,255,255,0.015)';
        for (let i = 0; i < w; i += 25) for (let j = 0; j < h; j += 25) ctx.fillRect(i, j, 1, 1);
        
        // Gold lines
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(w * 0.1, h * 0.08); ctx.lineTo(w * 0.9, h * 0.08); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w * 0.1, h * 0.92); ctx.lineTo(w * 0.9, h * 0.92); ctx.stroke();
        
        // Corners
        const drawCorner = (x: number, y: number, fx: number, fy: number) => {
            ctx.save(); ctx.translate(x, y); ctx.scale(fx, fy);
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(0, 30); ctx.lineTo(0, 0); ctx.lineTo(30, 0); ctx.stroke();
            ctx.restore();
        };
        drawCorner(w * 0.08, h * 0.06, 1, 1);
        drawCorner(w * 0.92, h * 0.06, -1, 1);
        drawCorner(w * 0.08, h * 0.94, 1, -1);
        drawCorner(w * 0.92, h * 0.94, -1, -1);
        
        // Badge
        ctx.fillStyle = 'rgba(212, 175, 55, 0.9)';
        ctx.font = `600 ${w * 0.022}px Inter, system-ui`;
        ctx.textAlign = 'center';
        ctx.fillText('✦  EXCLUSIVE POLL  ✦', w / 2, h * 0.13);
        
        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = `300 ${w * 0.044}px Inter, system-ui`;
        wrapText(ctx, pollTitle, w / 2, h * 0.24, w * 0.8, w * 0.058);
        
        // Divider
        ctx.fillStyle = 'rgba(212, 175, 55, 0.4)';
        ctx.fillRect(w * 0.35, h * 0.34, w * 0.3, 1);
        
        // QR
        if (qrDataUrl) {
            try {
                const qrSize = Math.min(w, h) * 0.38, qrX = (w - qrSize) / 2, qrY = h * 0.4;
                ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)'; ctx.lineWidth = 2;
                roundRect(ctx, qrX - 18, qrY - 18, qrSize + 36, qrSize + 36, 4); ctx.stroke();
                ctx.fillStyle = '#ffffff';
                roundRect(ctx, qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 4); ctx.fill();
                const img = await loadImage(qrDataUrl);
                ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
            } catch (e) { console.error('QR failed:', e); }
        }
        
        // CTA
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = `400 ${w * 0.024}px Inter, system-ui`;
        ctx.fillText('Scan to participate', w / 2, h * 0.86);
        
        // Brand
        ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';
        ctx.font = `500 ${w * 0.018}px Inter, system-ui`;
        ctx.fillText('votegenerator.com', w / 2, h * 0.96);
    };
    
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
        } catch (err) { console.error('Failed:', err); }
        finally { setIsGenerating(false); }
    };
    
    useEffect(() => {
        if (qrDataUrl) generateCard().then(setPreviewUrl).catch(console.error);
    }, [selectedDesign, selectedFormat, qrDataUrl, pollTitle]);
    
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] overflow-hidden shadow-2xl"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient}`} />
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIj48Y2lyY2xlIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1IiBjeD0iMjAiIGN5PSIyMCIgcj0iMiIvPjwvZz48L3N2Zz4=')] opacity-50" />
                        <div className="relative p-5 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                        <Sparkles size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-white">Create Share Card</h2>
                                        <p className="text-white/80 text-sm">Design stunning cards for social media</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2.5 hover:bg-white/20 rounded-xl transition-colors">
                                    <X size={24} className="text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row" style={{ height: 'calc(92vh - 100px)' }}>
                        {/* Left: Design Selection */}
                        <div className="lg:w-[400px] p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-200 overflow-y-auto bg-slate-50/50">
                            {/* Style Selection */}
                            <div className="mb-6">
                                <label className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <Palette size={16} className="text-indigo-500" />
                                    Choose Style
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {CARD_DESIGNS.map((design) => (
                                        <motion.button
                                            key={design.id}
                                            onClick={() => setSelectedDesign(design.id)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`group relative rounded-2xl overflow-hidden transition-all ${
                                                selectedDesign === design.id
                                                    ? 'ring-3 ring-indigo-500 ring-offset-2 shadow-lg'
                                                    : 'ring-1 ring-slate-200 hover:ring-indigo-300 hover:shadow-md'
                                            }`}
                                        >
                                            {/* Mini Preview */}
                                            <MiniCardPreview designId={design.id} isSelected={selectedDesign === design.id} />
                                            
                                            {/* Popular badge */}
                                            {design.popular && (
                                                <div className="absolute top-2 right-2 px-2 py-0.5 bg-amber-400 text-amber-900 text-[10px] font-bold rounded-full flex items-center gap-1 shadow">
                                                    <Star size={10} className="fill-current" /> HOT
                                                </div>
                                            )}
                                            
                                            {/* Selection check */}
                                            {selectedDesign === design.id && (
                                                <div className="absolute top-2 left-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <Check size={14} className="text-white" />
                                                </div>
                                            )}
                                            
                                            {/* Label */}
                                            <div className={`p-3 transition-colors ${
                                                selectedDesign === design.id ? 'bg-indigo-50' : 'bg-white'
                                            }`}>
                                                <div className={`text-sm font-bold ${
                                                    selectedDesign === design.id ? 'text-indigo-700' : 'text-slate-800'
                                                }`}>{design.name}</div>
                                                <p className="text-xs text-slate-500">{design.tagline}</p>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Format Selection */}
                            <div>
                                <label className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <ImageIcon size={16} className="text-indigo-500" />
                                    Choose Size
                                </label>
                                <div className="space-y-2">
                                    {CARD_FORMATS.map(format => (
                                        <button
                                            key={format.id}
                                            onClick={() => setSelectedFormat(format.id)}
                                            className={`w-full p-3 rounded-xl border-2 transition-all flex items-center gap-4 ${
                                                selectedFormat === format.id
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : 'border-slate-200 bg-white hover:border-indigo-300'
                                            }`}
                                        >
                                            <div className={`flex-shrink-0 bg-gradient-to-br ${
                                                selectedFormat === format.id 
                                                    ? 'from-indigo-400 to-purple-500' 
                                                    : 'from-slate-200 to-slate-300'
                                            } rounded-lg shadow-sm ${
                                                format.id === 'square' ? 'w-10 h-10' :
                                                format.id === 'story' ? 'w-7 h-12' :
                                                'w-14 h-8'
                                            }`} />
                                            <div className="flex-1 text-left">
                                                <div className={`font-bold text-sm ${
                                                    selectedFormat === format.id ? 'text-indigo-700' : 'text-slate-700'
                                                }`}>
                                                    {format.name} <span className="font-normal text-slate-400">({format.ratio})</span>
                                                </div>
                                                <div className="text-xs text-slate-500">{format.platforms}</div>
                                            </div>
                                            {selectedFormat === format.id && <Check size={18} className="text-indigo-500" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* Right: Preview & Download */}
                        <div className="flex-1 p-5 sm:p-6 flex flex-col overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                            <div className="flex-1 flex items-center justify-center rounded-2xl overflow-hidden mb-4 bg-[repeating-conic-gradient(#e2e8f0_0%_25%,#f1f5f9_0%_50%)] bg-[length:20px_20px]">
                                {previewUrl ? (
                                    <motion.img 
                                        key={selectedDesign + selectedFormat}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        src={previewUrl} 
                                        alt="Card Preview" 
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                        style={{
                                            maxHeight: selectedFormat === 'story' ? '100%' : undefined,
                                            width: selectedFormat === 'landscape' ? '100%' : undefined
                                        }}
                                    />
                                ) : (
                                    <div className="text-slate-400 flex flex-col items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center animate-pulse">
                                            <Sparkles size={24} className="text-slate-400" />
                                        </div>
                                        <span className="text-sm font-medium">Creating your card...</span>
                                    </div>
                                )}
                            </div>
                            
                            <motion.button
                                onClick={handleDownload}
                                disabled={isGenerating || !previewUrl}
                                whileHover={{ scale: isGenerating ? 1 : 1.02 }}
                                whileTap={{ scale: isGenerating ? 1 : 0.98 }}
                                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg ${
                                    isGenerating || !previewUrl
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : `bg-gradient-to-r ${colors.gradient} text-white hover:shadow-xl`
                                }`}
                            >
                                {isGenerating ? (
                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>
                                ) : (
                                    <><Download size={22} /> Download {formatConfig.name} Card</>
                                )}
                            </motion.button>
                            
                            <p className="text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-2">
                                <Zap size={12} className="text-amber-500" />
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