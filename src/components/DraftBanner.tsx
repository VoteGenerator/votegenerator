// ============================================================================
// DraftBanner.tsx - Banner showing poll is in draft mode
// Location: src/components/DraftBanner.tsx
// Shows on admin view when poll hasn't been activated yet
// ============================================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileEdit, Rocket, Eye, AlertTriangle, CheckCircle, 
    Clock, Users, X
} from 'lucide-react';
import GoLiveModal from './GoLiveModal';

interface DraftBannerProps {
    pollId: string;
    pollTitle: string;
    tier: 'free' | 'pro' | 'business';
    pollsUsed: number;
    pollsMax: number;
    activeDays: number;
    onGoLive: () => Promise<void>;
}

const DraftBanner: React.FC<DraftBannerProps> = ({
    pollId,
    pollTitle,
    tier,
    pollsUsed,
    pollsMax,
    activeDays,
    onGoLive
}) => {
    const [showGoLiveModal, setShowGoLiveModal] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    // For business tier, don't show this banner (or make it minimal)
    if (tier === 'business' || isDismissed) {
        return null;
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl overflow-hidden"
            >
                <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            {/* Draft Icon */}
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <FileEdit size={24} className="text-amber-600" />
                            </div>

                            {/* Content */}
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-amber-200 text-amber-800 text-xs font-bold rounded-full">
                                        DRAFT MODE
                                    </span>
                                    <span className="text-sm text-amber-600">
                                        Not using your poll credits yet
                                    </span>
                                </div>
                                <p className="text-amber-800 font-medium mb-2">
                                    This poll is ready for preview. Go live when you're ready!
                                </p>
                                
                                {/* What draft mode means */}
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-1.5 text-amber-700">
                                        <Eye size={14} />
                                        <span>Preview works</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-amber-700">
                                        <X size={14} className="text-red-500" />
                                        <span>Votes won't save</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-amber-700">
                                        <Clock size={14} />
                                        <span>Timer not started</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Go Live Button */}
                        <button
                            onClick={() => setShowGoLiveModal(true)}
                            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg transition flex items-center gap-2 flex-shrink-0"
                        >
                            <Rocket size={18} />
                            Go Live
                        </button>
                    </div>
                </div>

                {/* Bottom info bar */}
                <div className="px-4 py-2 bg-amber-100/50 border-t border-amber-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-amber-700">
                        <Users size={14} />
                        <span>
                            Poll credits: {pollsUsed} of {pollsMax} used
                        </span>
                    </div>
                    <button
                        onClick={() => setIsDismissed(true)}
                        className="text-xs text-amber-600 hover:text-amber-700"
                    >
                        Dismiss
                    </button>
                </div>
            </motion.div>

            {/* Go Live Confirmation Modal */}
            <GoLiveModal
                isOpen={showGoLiveModal}
                onClose={() => setShowGoLiveModal(false)}
                onConfirm={async () => {
                    await onGoLive();
                    setShowGoLiveModal(false);
                }}
                pollTitle={pollTitle}
                tier={tier}
                pollsUsed={pollsUsed}
                pollsMax={pollsMax}
                activeDays={activeDays}
            />
        </>
    );
};

export default DraftBanner;