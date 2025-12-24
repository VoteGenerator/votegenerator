import React from 'react';

// =============================================================================
// AD CONFIGURATION - EASY TO CHANGE!
// =============================================================================
// Just update these values to change your ads across the site

export const AD_CONFIG = {
  // Google AdSense
  adsenseEnabled: true,
  adsenseClientId: 'ca-pub-XXXXXXXXXX', // Your AdSense client ID
  adsenseSlots: {
    dashboard: '1234567890',  // Slot for dashboard sidebar
    results: '0987654321',    // Slot for results page
    adWall: '1122334455',     // Slot for ad wall
  },

  // Custom/Affiliate Ads (shown when AdSense not ready or as supplement)
  customAds: [
    {
      id: 'amazon-gift-cards',
      title: '🎁 Need a Last-Minute Gift?',
      description: 'Send an instant Amazon eGift Card',
      ctaText: 'Shop Gift Cards',
      ctaUrl: 'https://amzn.to/YOUR_AFFILIATE_LINK',
      bgGradient: 'from-orange-500 to-amber-500',
      enabled: true,
    },
    {
      id: 'credit-karma',
      title: '💳 Check Your Credit Score',
      description: 'Free credit monitoring with Credit Karma',
      ctaText: 'Check Now - Free',
      ctaUrl: 'https://creditkarma.com/YOUR_AFFILIATE_LINK',
      bgGradient: 'from-green-500 to-emerald-500',
      enabled: true,
    },
    {
      id: 'canva-pro',
      title: '🎨 Create Stunning Graphics',
      description: 'Try Canva Pro free for 30 days',
      ctaText: 'Start Free Trial',
      ctaUrl: 'https://canva.com/YOUR_AFFILIATE_LINK',
      bgGradient: 'from-purple-500 to-pink-500',
      enabled: true,
    },
  ],
};

// =============================================================================
// AD COMPONENTS
// =============================================================================

interface AdBannerProps {
  slot?: 'dashboard' | 'results' | 'adWall';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

// Google AdSense Component
export function AdSenseUnit({ slot = 'dashboard', className = '' }: AdBannerProps) {
  if (!AD_CONFIG.adsenseEnabled) return null;

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CONFIG.adsenseClientId}
        data-ad-slot={AD_CONFIG.adsenseSlots[slot]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <script>
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </script>
    </div>
  );
}

// Custom Affiliate Ad Component
export function CustomAdBanner({ className = '' }: { className?: string }) {
  const enabledAds = AD_CONFIG.customAds.filter(ad => ad.enabled);
  if (enabledAds.length === 0) return null;

  // Rotate through ads (simple random selection)
  const ad = enabledAds[Math.floor(Math.random() * enabledAds.length)];

  return (
    <a
      href={ad.ctaUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`block ${className}`}
    >
      <div className={`bg-gradient-to-r ${ad.bgGradient} rounded-xl p-4 text-white hover:shadow-lg transition-shadow`}>
        <p className="font-bold text-lg">{ad.title}</p>
        <p className="text-white/80 text-sm mt-1">{ad.description}</p>
        <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition">
          {ad.ctaText}
          <span>→</span>
        </div>
        <p className="text-[10px] text-white/50 mt-2">Sponsored • Affiliate link</p>
      </div>
    </a>
  );
}

// Combined Ad Component - Shows AdSense if available, falls back to custom
export function AdBanner({ 
  slot = 'dashboard', 
  size = 'medium',
  showCustomFallback = true,
  className = '' 
}: AdBannerProps & { showCustomFallback?: boolean }) {
  // For now, show custom ads (switch to AdSense when approved)
  const useAdSense = false; // Set to true once AdSense is approved

  if (useAdSense && AD_CONFIG.adsenseEnabled) {
    return <AdSenseUnit slot={slot} className={className} />;
  }

  if (showCustomFallback) {
    return <CustomAdBanner className={className} />;
  }

  // Placeholder for when no ads configured
  return (
    <div className={`bg-slate-100 rounded-xl p-4 border-2 border-dashed border-slate-300 ${className}`}>
      <p className="text-slate-400 text-sm text-center">Ad Space</p>
    </div>
  );
}

// Sidebar Ad for Dashboard (vertical format)
export function SidebarAd({ className = '' }: { className?: string }) {
  const enabledAds = AD_CONFIG.customAds.filter(ad => ad.enabled);
  if (enabledAds.length === 0) return null;

  const ad = enabledAds[Math.floor(Math.random() * enabledAds.length)];

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm ${className}`}>
      {/* Ad Label */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Sponsored</p>
      </div>
      
      {/* Ad Content */}
      <a
        href={ad.ctaUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block p-4 hover:bg-slate-50 transition"
      >
        <div className={`w-12 h-12 bg-gradient-to-br ${ad.bgGradient} rounded-xl flex items-center justify-center text-2xl mb-3`}>
          {ad.title.split(' ')[0]}
        </div>
        <p className="font-semibold text-slate-800">{ad.title.replace(/^[^\s]+\s/, '')}</p>
        <p className="text-slate-500 text-sm mt-1">{ad.description}</p>
        <div className={`mt-3 w-full py-2 bg-gradient-to-r ${ad.bgGradient} text-white rounded-lg text-sm font-medium text-center`}>
          {ad.ctaText}
        </div>
      </a>
    </div>
  );
}

export default AdBanner;