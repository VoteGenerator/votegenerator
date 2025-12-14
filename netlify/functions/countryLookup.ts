/**
 * Privacy-First Country Lookup
 * 
 * This module provides aggregated country statistics WITHOUT storing
 * individual voter locations. The IP is used once to determine country,
 * then discarded. Only the country name is stored with the vote.
 * 
 * Usage: Called during vote submission if poll has Pro+ tier
 */

interface CountryLookupResult {
    country: string;
    countryCode: string;
}

/**
 * Look up country from IP address using free API
 * We only extract country - not city, region, or exact location
 * 
 * @param ip - The IP address (from request headers)
 * @returns Country name or 'Unknown'
 */
export async function lookupCountry(ip: string): Promise<string> {
    // Skip for localhost/private IPs
    if (isPrivateIP(ip)) {
        return 'Unknown';
    }

    try {
        // Using ip-api.com (free tier: 45 requests/minute)
        // Alternative: ipapi.co (free tier: 1000/day)
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country`, {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            console.warn('Country lookup failed:', response.status);
            return 'Unknown';
        }

        const data = await response.json();
        
        if (data.status === 'success' && data.country) {
            return data.country;
        }

        return 'Unknown';
    } catch (error) {
        console.warn('Country lookup error:', error);
        return 'Unknown';
    }
}

/**
 * Check if IP is private/localhost (don't lookup)
 */
function isPrivateIP(ip: string): boolean {
    if (!ip) return true;
    
    // Localhost
    if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
        return true;
    }
    
    // Private ranges
    const privateRanges = [
        /^10\./,                    // 10.0.0.0/8
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
        /^192\.168\./,              // 192.168.0.0/16
        /^fc00:/i,                  // IPv6 private
        /^fe80:/i,                  // IPv6 link-local
    ];
    
    return privateRanges.some(range => range.test(ip));
}

/**
 * Extract client IP from Netlify function event
 * Netlify provides this in headers
 */
export function getClientIP(headers: Record<string, string | undefined>): string {
    // Netlify provides the real IP in x-nf-client-connection-ip
    // Fallback to x-forwarded-for (may have multiple IPs)
    const nfIP = headers['x-nf-client-connection-ip'];
    if (nfIP) return nfIP;
    
    const forwarded = headers['x-forwarded-for'];
    if (forwarded) {
        // Take the first IP (client's actual IP)
        return forwarded.split(',')[0].trim();
    }
    
    return '';
}

/**
 * IMPORTANT PRIVACY NOTES:
 * 
 * 1. We ONLY store the country name (e.g., "United States")
 * 2. We do NOT store:
 *    - IP addresses
 *    - Cities or regions
 *    - Exact coordinates
 *    - Any other location data
 * 
 * 3. The IP is used once for lookup, then discarded
 * 4. Country data is aggregated - we show "X% from US" not "Voter #5 is from US"
 * 5. This feature is OPT-IN (Pro+ only) and clearly disclosed
 * 
 * This approach provides useful geographic insights while respecting voter privacy.
 */

export default { lookupCountry, getClientIP };