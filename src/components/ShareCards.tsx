// ============================================================================
// ShareCards - Beautiful invitation & share card generator
// Location: src/components/ShareCards.tsx
// Features: Multiple styles, QR codes, image cards, email templates, PDFs
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download, Mail, Image as ImageIcon, FileText, Share2, Copy, Check,
    Sparkles, Heart, Briefcase, PartyPopper, Baby, MessageCircle,
    QrCode, Instagram, X, ChevronRight, Palette, Eye
} from 'lucide-react';

// ============================================================================
// TEMPLATE CATEGORIES & STYLES
// ============================================================================

type TemplateCategory = 'wedding' | 'corporate' | 'party' | 'babyshower' | 'casual';

interface TemplateStyle {
    id: TemplateCategory;
    name: string;
    icon: typeof Heart;
    description: string;
    bestFor: string[];
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        gradient: string;
    };
    fonts: {
        heading: string;
        body: string;
    };
    decorations: string[];
}

const TEMPLATE_STYLES: TemplateStyle[] = [
    {
        id: 'wedding',
        name: 'Wedding & Elegant',
        icon: Heart,
        description: 'Elegant florals, gold accents, script fonts',
        bestFor: ['RSVPs', 'Menu choices', 'Song requests', 'Seating preferences'],
        colors: {
            primary: '#B8860B', // Gold
            secondary: '#F5E6D3', // Cream
            accent: '#8B4513', // Saddle brown
            background: '#FDF8F0', // Warm white
            text: '#2C1810', // Dark brown
            gradient: 'linear-gradient(135deg, #F5E6D3 0%, #FDF8F0 50%, #F5E6D3 100%)',
        },
        fonts: {
            heading: "'Playfair Display', serif",
            body: "'Cormorant Garamond', serif",
        },
        decorations: ['✿', '❧', '❦', '⚜'],
    },
    {
        id: 'corporate',
        name: 'Corporate & Professional',
        icon: Briefcase,
        description: 'Clean, minimal, brand-focused',
        bestFor: ['Team polls', 'Meeting scheduling', 'Feedback surveys', 'Event planning'],
        colors: {
            primary: '#1E40AF', // Blue
            secondary: '#DBEAFE', // Light blue
            accent: '#3B82F6', // Bright blue
            background: '#F8FAFC', // Slate 50
            text: '#1E293B', // Slate 800
            gradient: 'linear-gradient(135deg, #DBEAFE 0%, #F8FAFC 50%, #DBEAFE 100%)',
        },
        fonts: {
            heading: "'Inter', sans-serif",
            body: "'Inter', sans-serif",
        },
        decorations: ['◆', '▸', '●', '○'],
    },
    {
        id: 'party',
        name: 'Party & Celebration',
        icon: PartyPopper,
        description: 'Fun, colorful, confetti vibes',
        bestFor: ['Birthday parties', 'Holiday events', 'Game nights', 'Celebrations'],
        colors: {
            primary: '#EC4899', // Pink
            secondary: '#FDF4FF', // Fuchsia 50
            accent: '#F59E0B', // Amber
            background: '#FFFBEB', // Amber 50
            text: '#1F2937', // Gray 800
            gradient: 'linear-gradient(135deg, #FDF4FF 0%, #FFFBEB 50%, #DBEAFE 100%)',
        },
        fonts: {
            heading: "'Fredoka One', cursive",
            body: "'Nunito', sans-serif",
        },
        decorations: ['🎉', '🎈', '🎊', '✨'],
    },
    {
        id: 'babyshower',
        name: 'Baby Shower',
        icon: Baby,
        description: 'Soft pastels, cute icons, gentle vibes',
        bestFor: ['Gender reveals', 'Name voting', 'Gift polls', 'Shower planning'],
        colors: {
            primary: '#A78BFA', // Violet
            secondary: '#F3E8FF', // Purple 100
            accent: '#F9A8D4', // Pink 300
            background: '#FDF2F8', // Pink 50
            text: '#581C87', // Purple 900
            gradient: 'linear-gradient(135deg, #F3E8FF 0%, #FDF2F8 50%, #DBEAFE 100%)',
        },
        fonts: {
            heading: "'Quicksand', sans-serif",
            body: "'Quicksand', sans-serif",
        },
        decorations: ['🍼', '👶', '🧸', '💕'],
    },
    {
        id: 'casual',
        name: 'Casual & Modern',
        icon: MessageCircle,
        description: 'Modern, friendly, emoji-ready',
        bestFor: ['Friend groups', 'Quick decisions', 'Social plans', 'Fun polls'],
        colors: {
            primary: '#6366F1', // Indigo
            secondary: '#E0E7FF', // Indigo 100
            accent: '#10B981', // Emerald
            background: '#F9FAFB', // Gray 50
            text: '#111827', // Gray 900
            gradient: 'linear-gradient(135deg, #E0E7FF 0%, #F9FAFB 50%, #D1FAE5 100%)',
        },
        fonts: {
            heading: "'Poppins', sans-serif",
            body: "'Poppins', sans-serif",
        },
        decorations: ['→', '•', '★', '◎'],
    },
];

// ============================================================================
// QR CODE GENERATOR (Using QR Server API for real QR codes)
// ============================================================================

// Generate QR code image URL using qrserver.com API
const generateQRCodeUrl = (text: string, size: number = 200): string => {
    // Use QR Server API - free, no auth needed
    const encodedText = encodeURIComponent(text);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&format=png&margin=10`;
};

// Generate QR code as a data URL by fetching from API
const generateQRCodeDataUrl = async (text: string, size: number = 200): Promise<string> => {
    try {
        const response = await fetch(generateQRCodeUrl(text, size));
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        // Fallback to URL-based approach
        return generateQRCodeUrl(text, size);
    }
};

// ============================================================================
// PROPS & TYPES
// ============================================================================

interface ShareCardsProps {
    pollId: string;
    pollTitle: string;
    pollDescription?: string;
    pollUrl: string;
    onClose?: () => void;
}

type OutputFormat = 'square' | 'story' | 'email' | 'pdf';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ShareCards: React.FC<ShareCardsProps> = ({
    pollId,
    pollTitle,
    pollDescription,
    pollUrl,
    onClose
}) => {
    const [selectedStyle, setSelectedStyle] = useState<TemplateCategory>('casual');
    const [outputFormat, setOutputFormat] = useState<OutputFormat>('square');
    const [customMessage, setCustomMessage] = useState('');
    const [showPreview, setShowPreview] = useState(true);
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const style = TEMPLATE_STYLES.find(s => s.id === selectedStyle)!;
    
    // ========================================================================
    // GENERATE IMAGE CARD
    // ========================================================================
    
    const generateImageCard = async (format: 'square' | 'story'): Promise<string> => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Dimensions
        const width = format === 'square' ? 1080 : 1080;
        const height = format === 'square' ? 1080 : 1920;
        canvas.width = width;
        canvas.height = height;
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, style.colors.secondary);
        gradient.addColorStop(0.5, style.colors.background);
        gradient.addColorStop(1, style.colors.secondary);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Decorative border
        ctx.strokeStyle = style.colors.primary;
        ctx.lineWidth = 8;
        ctx.strokeRect(40, 40, width - 80, height - 80);
        
        // Inner decorative line
        ctx.strokeStyle = style.colors.accent + '40';
        ctx.lineWidth = 2;
        ctx.strokeRect(60, 60, width - 120, height - 120);
        
        // Title
        ctx.fillStyle = style.colors.text;
        ctx.font = `bold ${format === 'square' ? 72 : 84}px ${style.fonts.heading.split(',')[0].replace(/'/g, '')}`;
        ctx.textAlign = 'center';
        
        // Word wrap title
        const maxWidth = width - 160;
        const words = pollTitle.split(' ');
        let lines: string[] = [];
        let currentLine = '';
        
        words.forEach(word => {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        if (currentLine) lines.push(currentLine);
        
        const titleY = format === 'square' ? 300 : 500;
        lines.forEach((line, i) => {
            ctx.fillText(line, width / 2, titleY + i * 90);
        });
        
        // Decorative elements
        ctx.fillStyle = style.colors.primary;
        ctx.font = '48px serif';
        const decoY = titleY - 100;
        ctx.fillText(style.decorations[0], width / 2 - 60, decoY);
        ctx.fillText(style.decorations[1] || style.decorations[0], width / 2 + 60, decoY);
        
        // Custom message or description
        const message = customMessage || pollDescription || 'Your vote matters!';
        ctx.fillStyle = style.colors.text + 'CC';
        ctx.font = `${format === 'square' ? 36 : 42}px ${style.fonts.body.split(',')[0].replace(/'/g, '')}`;
        const messageY = titleY + lines.length * 90 + 60;
        ctx.fillText(message, width / 2, messageY);
        
        // QR Code area
        const qrSize = format === 'square' ? 200 : 250;
        const qrX = (width - qrSize) / 2;
        const qrY = format === 'square' ? height - 380 : height - 500;
        
        // QR background with rounded corners effect
        ctx.fillStyle = 'white';
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.shadowBlur = 20;
        ctx.fillRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = style.colors.primary;
        ctx.lineWidth = 3;
        ctx.strokeRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40);
        
        // Draw real QR code using API
        const qrImg = new window.Image();
        qrImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve) => {
            qrImg.onload = () => {
                ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
                resolve();
            };
            qrImg.onerror = () => {
                // Fallback: draw "QR Code" text if API fails
                ctx.fillStyle = style.colors.text;
                ctx.font = `bold 24px ${style.fonts.body.split(',')[0].replace(/'/g, '')}`;
                ctx.fillText('Scan QR Code', width / 2, qrY + qrSize / 2);
                resolve();
            };
            qrImg.src = generateQRCodeUrl(pollUrl, qrSize);
        });
        
        // "Scan to Vote" text
        ctx.fillStyle = style.colors.text;
        ctx.font = `bold 28px ${style.fonts.body.split(',')[0].replace(/'/g, '')}`;
        ctx.fillText('Scan to Vote', width / 2, qrY + qrSize + 60);
        
        // URL (shortened)
        ctx.fillStyle = style.colors.primary;
        ctx.font = `24px ${style.fonts.body.split(',')[0].replace(/'/g, '')}`;
        const shortUrl = pollUrl.replace(/^https?:\/\//, '').substring(0, 40);
        ctx.fillText(shortUrl, width / 2, qrY + qrSize + 100);
        
        // Branding
        ctx.fillStyle = style.colors.text + '80';
        ctx.font = `18px ${style.fonts.body.split(',')[0].replace(/'/g, '')}`;
        ctx.fillText('Created with VoteGenerator', width / 2, height - 60);
        
        return canvas.toDataURL('image/png');
    };
    
    // ========================================================================
    // GENERATE EMAIL HTML
    // ========================================================================
    
    const generateEmailHTML = (): string => {
        const message = customMessage || `You're invited to vote on: ${pollTitle}`;
        
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pollTitle}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;600&family=Poppins:wght@400;600&display=swap');
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${style.colors.background}; font-family: ${style.fonts.body};">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: ${style.colors.gradient}; padding: 40px; text-align: center; border-bottom: 4px solid ${style.colors.primary};">
                            <div style="font-size: 32px; margin-bottom: 8px;">${style.decorations[0]}</div>
                            <h1 style="margin: 0; color: ${style.colors.text}; font-family: ${style.fonts.heading}; font-size: 28px; font-weight: 700;">
                                You're Invited to Vote!
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 16px; color: ${style.colors.text}; font-family: ${style.fonts.heading}; font-size: 24px;">
                                ${pollTitle}
                            </h2>
                            <p style="margin: 0 0 24px; color: ${style.colors.text}; opacity: 0.8; font-size: 16px; line-height: 1.6;">
                                ${message}
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                <tr>
                                    <td style="border-radius: 12px; background: ${style.colors.primary};">
                                        <a href="${pollUrl}" target="_blank" style="display: inline-block; padding: 16px 48px; color: white; font-family: ${style.fonts.body}; font-size: 18px; font-weight: 600; text-decoration: none;">
                                            Vote Now →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 32px 0 0; color: ${style.colors.text}; opacity: 0.6; font-size: 14px; text-align: center;">
                                Or copy this link: <a href="${pollUrl}" style="color: ${style.colors.primary};">${pollUrl}</a>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: ${style.colors.secondary}; padding: 24px; text-align: center; border-top: 1px solid ${style.colors.primary}20;">
                            <p style="margin: 0; color: ${style.colors.text}; opacity: 0.6; font-size: 12px;">
                                Created with VoteGenerator • Privacy-first polling
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
    };
    
    // ========================================================================
    // HANDLERS
    // ========================================================================
    
    const handleDownload = async (format: OutputFormat) => {
        setGenerating(true);
        
        try {
            if (format === 'square' || format === 'story') {
                const dataUrl = await generateImageCard(format);
                const link = document.createElement('a');
                link.download = `${pollTitle.replace(/[^a-z0-9]/gi, '-')}-${format}.png`;
                link.href = dataUrl;
                link.click();
            } else if (format === 'email') {
                const html = generateEmailHTML();
                const blob = new Blob([html], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = `${pollTitle.replace(/[^a-z0-9]/gi, '-')}-email.html`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error generating:', error);
        } finally {
            setGenerating(false);
        }
    };
    
    const copyEmailHTML = () => {
        navigator.clipboard.writeText(generateEmailHTML());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    // ========================================================================
    // RENDER
    // ========================================================================
    
    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Share2 className="text-white" size={20} />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg">Share Cards & Invitations</h2>
                        <p className="text-indigo-200 text-sm">Create beautiful shareable content</p>
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="text-white/80 hover:text-white p-2">
                        <X size={20} />
                    </button>
                )}
            </div>
            
            <div className="p-6">
                {/* Style Selector */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Palette size={16} /> Choose Style
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {TEMPLATE_STYLES.map((template) => {
                            const Icon = template.icon;
                            const isSelected = selectedStyle === template.id;
                            return (
                                <button
                                    key={template.id}
                                    onClick={() => setSelectedStyle(template.id)}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                                        isSelected
                                            ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    <div 
                                        className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                                        style={{ backgroundColor: template.colors.primary + '20' }}
                                    >
                                        <Icon size={18} style={{ color: template.colors.primary }} />
                                    </div>
                                    <p className="font-semibold text-slate-800 text-sm">{template.name.split(' ')[0]}</p>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{template.description}</p>
                                </button>
                            );
                        })}
                    </div>
                    
                    {/* Style Details */}
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                        <p className="text-sm text-slate-600 mb-2">
                            <strong>Best for:</strong> {style.bestFor.join(', ')}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">Colors:</span>
                            {Object.entries(style.colors).slice(0, 4).map(([key, color]) => (
                                <div
                                    key={key}
                                    className="w-6 h-6 rounded-full border-2 border-white shadow"
                                    style={{ backgroundColor: color }}
                                    title={key}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Custom Message */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Custom Message (optional)
                    </label>
                    <input
                        type="text"
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Your vote matters! Make your voice heard."
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                    />
                </div>
                
                {/* Output Format Buttons */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                        📥 Choose Format & Download
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { id: 'square' as OutputFormat, icon: ImageIcon, name: 'Square Card', desc: 'Instagram, WhatsApp', size: '1080×1080', color: 'from-pink-500 to-rose-500' },
                            { id: 'story' as OutputFormat, icon: Instagram, name: 'Story Format', desc: 'Instagram Stories, TikTok', size: '1080×1920', color: 'from-purple-500 to-indigo-500' },
                            { id: 'email' as OutputFormat, icon: Mail, name: 'Email Template', desc: 'Copy & paste ready', size: 'HTML', color: 'from-blue-500 to-cyan-500' },
                            { id: 'pdf' as OutputFormat, icon: FileText, name: 'PDF Invite', desc: 'Coming soon', size: 'PDF', disabled: true, color: 'from-slate-400 to-slate-500' },
                        ].map((format) => {
                            const Icon = format.icon;
                            return (
                                <button
                                    key={format.id}
                                    onClick={() => !format.disabled && handleDownload(format.id)}
                                    disabled={format.disabled || generating}
                                    className={`group relative p-5 rounded-2xl border-2 transition-all text-left overflow-hidden ${
                                        format.disabled
                                            ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                                            : 'border-slate-200 hover:border-transparent hover:shadow-xl cursor-pointer'
                                    }`}
                                >
                                    {/* Hover gradient background */}
                                    {!format.disabled && (
                                        <div className={`absolute inset-0 bg-gradient-to-br ${format.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                                    )}
                                    
                                    <div className="relative z-10">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                                            format.disabled 
                                                ? 'bg-slate-100' 
                                                : `bg-gradient-to-br ${format.color} shadow-lg`
                                        }`}>
                                            <Icon size={24} className="text-white" />
                                        </div>
                                        <p className="font-bold text-slate-800 text-base">{format.name}</p>
                                        <p className="text-sm text-slate-500 mt-1">{format.desc}</p>
                                        <div className="flex items-center gap-2 mt-3">
                                            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">{format.size}</span>
                                            {!format.disabled && (
                                                <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                                                    <Download size={12} /> Click to Download
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
                
                {/* Preview */}
                <div className="border-t border-slate-200 pt-6">
                    <button 
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4"
                    >
                        <Eye size={16} />
                        {showPreview ? 'Hide' : 'Show'} Preview
                        <ChevronRight size={16} className={`transform transition ${showPreview ? 'rotate-90' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                        {showPreview && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                {/* Square Preview */}
                                <div 
                                    className="aspect-square max-w-sm mx-auto rounded-2xl border-4 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
                                    style={{ 
                                        background: style.colors.gradient,
                                        borderColor: style.colors.primary,
                                    }}
                                >
                                    {/* Decorations */}
                                    <div 
                                        className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl flex gap-4"
                                        style={{ color: style.colors.primary }}
                                    >
                                        {style.decorations.slice(0, 2).map((d, i) => (
                                            <span key={i}>{d}</span>
                                        ))}
                                    </div>
                                    
                                    <h3 
                                        className="text-xl font-bold mb-3 mt-8"
                                        style={{ color: style.colors.text, fontFamily: style.fonts.heading }}
                                    >
                                        {pollTitle}
                                    </h3>
                                    
                                    <p 
                                        className="text-sm mb-6 opacity-80"
                                        style={{ color: style.colors.text, fontFamily: style.fonts.body }}
                                    >
                                        {customMessage || pollDescription || 'Your vote matters!'}
                                    </p>
                                    
                                    {/* Real QR Code in Preview */}
                                    <div 
                                        className="w-24 h-24 bg-white rounded-lg border-2 flex items-center justify-center mb-3 overflow-hidden shadow-sm"
                                        style={{ borderColor: style.colors.primary }}
                                    >
                                        <img 
                                            src={generateQRCodeUrl(pollUrl, 96)}
                                            alt="QR Code"
                                            className="w-20 h-20"
                                            onError={(e) => {
                                                // Fallback to icon if API fails
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm-2 3h2v2h-2v-2zm5 0h2v2h-2v-2zm-5 3h2v2h-2v-2zm5 0h3v2h-3v-2z"/></svg>';
                                            }}
                                        />
                                    </div>
                                    
                                    <p 
                                        className="text-xs font-semibold"
                                        style={{ color: style.colors.text }}
                                    >
                                        Scan to Vote
                                    </p>
                                    
                                    <p 
                                        className="absolute bottom-3 text-[10px] opacity-50"
                                        style={{ color: style.colors.text }}
                                    >
                                        Created with VoteGenerator
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                {/* Quick Actions - Prominent Download */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => handleDownload('square')}
                            disabled={generating}
                            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white font-bold text-lg transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50"
                        >
                            <Download size={22} />
                            {generating ? 'Generating...' : '📥 Download Invitation Card'}
                        </button>
                        
                        <button
                            onClick={copyEmailHTML}
                            className="flex items-center justify-center gap-2 px-5 py-4 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-semibold transition"
                        >
                            {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                            {copied ? 'Copied!' : 'Copy Email'}
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 text-center mt-3">
                        Download a beautiful share card or copy ready-to-send email HTML
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShareCards;