// ============================================================================
// CommentWordCloud.tsx - Word frequency visualization from comments
// Location: src/components/CommentWordCloud.tsx
// ============================================================================

import React, { useMemo } from 'react';
import { MessageSquare } from 'lucide-react';

interface Comment {
    text?: string;
    comment?: string;
    [key: string]: any;
}

interface CommentWordCloudProps {
    comments: Comment[];
    maxWords?: number;
}

// Common stop words to filter out
const STOP_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
    'used', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he',
    'she', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your',
    'his', 'our', 'their', 'what', 'which', 'who', 'whom', 'whose', 'where',
    'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'not', 'only', 'same', 'so',
    'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there', 'then',
    'if', 'because', 'until', 'while', 'about', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further',
    'once', 'any', 'up', 'down', 'out', 'off', 'over', 'own', 'being',
    'having', 'doing', 'really', 'think', 'like', 'get', 'got', 'go', 'going',
    'went', 'come', 'came', 'make', 'made', 'take', 'took', 'see', 'saw',
    'know', 'knew', 'want', 'wanted', 'say', 'said', 'let', 'put', 'give',
    'gave', 'way', 'even', 'new', 'well', 'much', 'lot', 'still', 'back',
    'thing', 'things', 'something', 'anything', 'nothing', 'everything',
    'one', 'two', 'first', 'last', 'long', 'little', 'good', 'great',
    'right', 'sure', 'yes', 'yeah', 'okay', 'ok', 'thanks', 'thank', 'please'
]);

// Color palette for word sizes
const COLORS = [
    'text-indigo-600',
    'text-purple-600',
    'text-blue-600',
    'text-emerald-600',
    'text-amber-600',
    'text-rose-600',
    'text-cyan-600',
    'text-pink-600'
];

const CommentWordCloud: React.FC<CommentWordCloudProps> = ({ 
    comments, 
    maxWords = 20 
}) => {
    const wordData = useMemo(() => {
        const wordCounts: Record<string, number> = {};
        
        comments.forEach(comment => {
            const text = comment.text || comment.comment || '';
            if (!text) return;
            
            // Extract words (letters only, lowercase)
            const words = text.toLowerCase()
                .replace(/[^a-z\s]/g, ' ')
                .split(/\s+/)
                .filter(word => 
                    word.length > 2 && 
                    !STOP_WORDS.has(word)
                );
            
            words.forEach(word => {
                wordCounts[word] = (wordCounts[word] || 0) + 1;
            });
        });
        
        // Sort by frequency and take top N
        const sorted = Object.entries(wordCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, maxWords);
        
        if (sorted.length === 0) return null;
        
        const maxCount = sorted[0][1];
        const minCount = sorted[sorted.length - 1][1];
        
        // Calculate sizes (1-5 scale)
        return sorted.map(([word, count], index) => {
            const normalizedSize = minCount === maxCount 
                ? 3 
                : 1 + ((count - minCount) / (maxCount - minCount)) * 4;
            
            return {
                word,
                count,
                size: normalizedSize,
                color: COLORS[index % COLORS.length]
            };
        });
    }, [comments, maxWords]);
    
    if (!wordData || wordData.length === 0) {
        return (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <MessageSquare size={16} />
                    <span>No comments to analyze yet</span>
                </div>
            </div>
        );
    }
    
    // Shuffle for more natural cloud appearance
    const shuffled = [...wordData].sort(() => Math.random() - 0.5);
    
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-indigo-500" />
                    <span className="text-sm font-semibold text-slate-700">Popular Words</span>
                </div>
                <span className="text-xs text-slate-400">
                    From {comments.length} comment{comments.length !== 1 ? 's' : ''}
                </span>
            </div>
            
            {/* Word Cloud */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 min-h-[100px]">
                {shuffled.map(({ word, count, size, color }) => (
                    <span
                        key={word}
                        className={`${color} font-medium cursor-default transition-transform hover:scale-110`}
                        style={{ 
                            fontSize: `${0.75 + size * 0.25}rem`,
                            opacity: 0.6 + (size / 5) * 0.4
                        }}
                        title={`"${word}" appears ${count} time${count !== 1 ? 's' : ''}`}
                    >
                        {word}
                    </span>
                ))}
            </div>
            
            {/* Top 5 list */}
            <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex flex-wrap gap-2">
                    {wordData.slice(0, 5).map(({ word, count }, i) => (
                        <span 
                            key={word}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full text-xs"
                        >
                            <span className="font-medium text-slate-600">#{i + 1}</span>
                            <span className="text-slate-800">{word}</span>
                            <span className="text-slate-400">({count})</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommentWordCloud;