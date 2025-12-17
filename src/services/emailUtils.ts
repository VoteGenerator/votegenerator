// ============================================================================
// VoteGenerator - Email Utilities
// Handles email normalization, validation, and hashing for verification
// ============================================================================

import crypto from 'crypto';

// ============================================================================
// Disposable Email Domains (partial list - expand as needed)
// Source: https://github.com/disposable-email-domains/disposable-email-domains
// ============================================================================

const DISPOSABLE_DOMAINS = new Set([
  // Common disposable email services
  '10minutemail.com',
  '10minutemail.net',
  'tempmail.com',
  'tempmail.net',
  'temp-mail.org',
  'guerrillamail.com',
  'guerrillamail.org',
  'guerrillamail.net',
  'guerrillamail.biz',
  'mailinator.com',
  'mailinator2.com',
  'mailinater.com',
  'throwaway.email',
  'throwawaymail.com',
  'fakeinbox.com',
  'fakemailgenerator.com',
  'getnada.com',
  'getairmail.com',
  'dispostable.com',
  'mailnesia.com',
  'maildrop.cc',
  'mytrashmail.com',
  'trashmail.com',
  'trashmail.net',
  'trashmail.org',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'sharklasers.com',
  'grr.la',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam4.me',
  'binkmail.com',
  'safetymail.info',
  'spamgourmet.com',
  'spamgourmet.net',
  'spamgourmet.org',
  'mailexpire.com',
  'tempinbox.com',
  'tempr.email',
  'discard.email',
  'discardmail.com',
  'spambog.com',
  'spambog.de',
  'spambog.ru',
  'mailcatch.com',
  'meltmail.com',
  'mintemail.com',
  'mt2009.com',
  'mytempemail.com',
  'nobulk.com',
  'noclickemail.com',
  'nogmailspam.info',
  'nomail.xl.cx',
  'nomail2me.com',
  'nomorespamemails.com',
  'notmailinator.com',
  'nowhere.org',
  'nowmymail.com',
  'objectmail.com',
  'obobbo.com',
  'odnorazovoe.ru',
  'ohaaa.de',
  'omail.pro',
  'oneoffemail.com',
  'onewaymail.com',
  'oopi.org',
  'opayq.com',
  'ordinaryamerican.net',
  'otherinbox.com',
  'ourklips.com',
  'outlawspam.com',
  'ovpn.to',
  'owlpic.com',
  'pancakemail.com',
  'pjjkp.com',
  'plexolan.de',
  'politikerclub.de',
  'poofy.org',
  'pookmail.com',
  'privacy.net',
  'privatdemail.net',
  'privy-mail.com',
  'privymail.de',
  'proxymail.eu',
  'prtnx.com',
  'putthisinyourspamdatabase.com',
  'qq.com',
  'quickinbox.com',
  'quickmail.nl',
  'rainmail.biz',
  'rcpt.at',
  'reallymymail.com',
  'realtyalerts.ca',
  'recode.me',
  'reconmail.com',
  'recursor.net',
  'regbypass.com',
  'regbypass.comsafe-mail.net',
  'rejectmail.com',
  'reliable-mail.com',
  'remail.cf',
  'remail.ga',
  'rhyta.com',
  'rklips.com',
  'rmqkr.net',
  'royal.net',
  'rppkn.com',
  'rtrtr.com',
  's0ny.net',
  'safe-mail.net',
  'safersignup.de',
  'safetypost.de',
  'sandelf.de',
  'sayawaka-dea.info',
  'saynotospams.com',
  'schafmail.de',
  'schrott-email.de',
  'secretemail.de',
  'secure-mail.biz',
  'selfdestructingmail.com',
  'senseless-entertainment.com',
  'services391.com',
  'sharedmailbox.org',
  'shieldemail.com',
  'shiftmail.com',
  'shitmail.me',
  'shortmail.net',
  'shut.ws',
  'sibmail.com',
  'sinnlos-mail.de',
  'siteposter.net',
  'skeefmail.com',
  'slaskpost.se',
  'slopsbox.com',
  'slowfoodfoothills.xyz',
  'smashmail.de',
  'smellfear.com',
  'snakemail.com',
  'sneakemail.com',
  'sneakmail.de',
  'snkmail.com',
  'sofimail.com',
  'sofort-mail.de',
  'softpls.asia',
  'sogetthis.com',
  'soisz.com',
  'solvemail.info',
  'soodomail.com',
  'soodonims.com',
  'spam.la',
  'spam.su',
  'spam4.me',
  'spamail.de',
  'spamarrest.com',
  'spamavert.com',
  'spambob.com',
  'spambob.net',
  'spambob.org',
  'spambog.com',
  'spambog.de',
  'spambog.net',
  'spambog.ru',
  'spambox.info',
  'spambox.irishspringrealty.com',
  'spambox.us',
  'spamcannon.com',
  'spamcannon.net',
  'spamcero.com',
  'spamcon.org',
  'spamcorptastic.com',
  'spamcowboy.com',
  'spamcowboy.net',
  'spamcowboy.org',
  'spamday.com',
  'spamex.com',
  'spamfree.eu',
  'spamfree24.com',
  'spamfree24.de',
  'spamfree24.eu',
  'spamfree24.info',
  'spamfree24.net',
  'spamfree24.org',
  'spamgoes.in',
  'spamherelots.com',
  'spamhereplease.com',
  'spamhole.com',
  'spamify.com',
  'spaminator.de',
  'spamkill.info',
  'spaml.com',
  'spaml.de',
  'spammotel.com',
  'spamobox.com',
  'spamoff.de',
  'spamsalad.in',
  'spamslicer.com',
  'spamspot.com',
  'spamstack.net',
  'spamthis.co.uk',
  'spamthisplease.com',
  'spamtrail.com',
  'spamtroll.net',
  'speed.1s.fr',
  'spoofmail.de',
  'squizzy.de',
  'ssoia.com',
  'startkeys.com',
  'stinkefinger.net',
  'stop-my-spam.cf',
  'stop-my-spam.com',
  'stop-my-spam.ga',
  'stop-my-spam.ml',
  'stop-my-spam.tk',
  'streetwisemail.com',
  'stuffmail.de',
  'super-auswahl.de',
  'supergreatmail.com',
  'supermailer.jp',
  'superrito.com',
  'superstachel.de',
  'suremail.info',
  'svk.jp',
  'sweetxxx.de',
  'tafmail.com',
  'tagyourself.com',
  'talkinator.com',
  'tapchicuoihoi.com',
  'techemail.com',
  'techgroup.me',
  'teewars.org',
  'teleosaurs.xyz',
  'tellos.xyz',
  'temp-mail.de',
  'temp-mail.org',
  'temp-mail.ru',
  'temp.emeraldwebmail.com',
  'temp.headstrong.de',
  'tempail.com',
  'tempalias.com',
  'tempe-mail.com',
  'tempemail.biz',
  'tempemail.co.za',
  'tempemail.com',
  'tempemail.net',
  'tempinbox.co.uk',
  'tempinbox.com',
  'tempmail.co',
  'tempmail.de',
  'tempmail.eu',
  'tempmail.it',
  'tempmail.net',
  'tempmail.us',
  'tempmail2.com',
  'tempmaildemo.com',
  'tempmailer.com',
  'tempmailer.de',
  'tempmailaddress.com',
  'tempmails.net',
  'tempsky.com',
  'tempthe.net',
  'temporaryemail.net',
  'temporaryemail.us',
  'temporaryforwarding.com',
  'temporaryinbox.com',
  'temporarymailaddress.com',
  'tempthe.net',
  'thankyou2010.com',
  'thecloudindex.com',
  'thelimestones.com',
  'thisisnotmyrealemail.com',
  'thismail.net',
  'thismail.ru',
  'throam.com',
  'throwawayemailaddress.com',
  'throwawaymail.com',
  'tilien.com',
  'tittbit.in',
  'tmailinator.com',
  'toiea.com',
  'tokenmail.de',
  'tonymanso.com',
  'toomail.biz',
  'topranklist.de',
  'tradermail.info',
  'trash-amil.com',
  'trash-mail.at',
  'trash-mail.com',
  'trash-mail.de',
  'trash-mail.ga',
  'trash-mail.gq',
  'trash-mail.ml',
  'trash-mail.tk',
  'trash2009.com',
  'trash2010.com',
  'trash2011.com',
  'trashbox.eu',
  'trashdevil.com',
  'trashdevil.de',
  'trashemail.de',
  'trashmail.at',
  'trashmail.com',
  'trashmail.de',
  'trashmail.me',
  'trashmail.net',
  'trashmail.org',
  'trashmail.ws',
  'trashmailer.com',
  'trashymail.com',
  'trashymail.net',
  'trbvm.com',
  'trickmail.net',
  'trillianpro.com',
  'tryalert.com',
  'turual.com',
  'twinmail.de',
  'twoweirdtricks.com',
  'tyldd.com',
  'uggsrock.com',
  'umail.net',
  'upliftnow.com',
  'uplipht.com',
  'uroid.com',
  'us.af',
  'valemail.net',
  'venompen.com',
  'veryrealemail.com',
  'viditag.com',
  'viralplays.com',
  'vkcode.ru',
  'vpn.st',
  'vsimcard.com',
  'vubby.com',
  'wasteland.rfc822.org',
  'webemail.me',
  'webm4il.info',
  'webuser.in',
  'wee.my',
  'weg-werf-email.de',
  'wegwerf-email-addressen.de',
  'wegwerf-emails.de',
  'wegwerfadresse.de',
  'wegwerfemail.com',
  'wegwerfemail.de',
  'wegwerfmail.de',
  'wegwerfmail.info',
  'wegwerfmail.net',
  'wegwerfmail.org',
  'wetrainbayarea.com',
  'wetrainbayarea.org',
  'wh4f.org',
  'whyspam.me',
  'willhackforfood.biz',
  'willselfdestruct.com',
  'winemaven.info',
  'wolfsmail.tk',
  'worldspace.link',
  'wronghead.com',
  'wuzup.net',
  'wuzupmail.net',
  'wwwnew.eu',
  'xagloo.co',
  'xagloo.com',
  'xemaps.com',
  'xents.com',
  'xmaily.com',
  'xoxy.net',
  'yapped.net',
  'yep.it',
  'yogamaven.com',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.gq',
  'yopmail.net',
  'yourdomain.com',
  'ypmail.webarnak.fr.eu.org',
  'yuurok.com',
  'z1p.biz',
  'za.com',
  'zehnminuten.de',
  'zehnminutenmail.de',
  'zetmail.com',
  'zippymail.info',
  'zoaxe.com',
  'zoemail.com',
  'zoemail.net',
  'zoemail.org',
  'zomg.info',
  'zxcv.com',
  'zxcvbnm.com',
  'zzz.com',
]);

// ============================================================================
// Email Validation
// ============================================================================

/**
 * Basic email format validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Check if email is from a known disposable domain
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return DISPOSABLE_DOMAINS.has(domain);
}

// ============================================================================
// Email Normalization
// ============================================================================

/**
 * Normalize email address for consistent hashing
 * - Lowercase everything
 * - Handle Gmail-specific rules (dots, plus aliases)
 * - Handle other common plus alias patterns
 */
export function normalizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid email');
  }

  let [local, domain] = email.toLowerCase().trim().split('@');
  
  if (!local || !domain) {
    throw new Error('Invalid email format');
  }

  // Gmail-specific normalization
  // Gmail ignores dots and everything after + in the local part
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    local = local.split('+')[0];     // Remove +alias
    local = local.replace(/\./g, ''); // Remove all dots
    domain = 'gmail.com';             // Normalize googlemail to gmail
  } 
  // Microsoft domains (outlook, hotmail, live)
  else if (['outlook.com', 'hotmail.com', 'live.com', 'msn.com'].includes(domain)) {
    local = local.split('+')[0];     // Remove +alias (Microsoft supports this too)
  }
  // For all other providers, just handle +alias
  else {
    local = local.split('+')[0];
  }

  return `${local}@${domain}`;
}

// ============================================================================
// Secure Hashing
// ============================================================================

/**
 * Create a secure hash of email for storage
 * Uses poll-specific salt to prevent cross-poll tracking
 */
export function hashEmail(email: string, pollId: string, secret: string): string {
  const normalized = normalizeEmail(email);
  
  // Double-hash with poll-specific salt
  const saltedEmail = `${normalized}:${pollId}:${secret}`;
  
  return crypto
    .createHash('sha256')
    .update(saltedEmail)
    .digest('hex');
}

/**
 * Hash IP address for rate limiting (privacy-preserving)
 */
export function hashIP(ip: string, secret: string): string {
  return crypto
    .createHash('sha256')
    .update(`${ip}:${secret}`)
    .digest('hex')
    .substring(0, 16); // Shorter hash is fine for rate limiting
}

// ============================================================================
// Code Generation
// ============================================================================

/**
 * Generate a random 6-digit verification code
 */
export function generateVerificationCode(): string {
  // Use crypto for secure random number
  const randomBytes = crypto.randomBytes(4);
  const randomNumber = randomBytes.readUInt32BE(0);
  
  // Get 6-digit code (100000-999999)
  const code = 100000 + (randomNumber % 900000);
  
  return code.toString();
}

/**
 * Generate expiration timestamp (10 minutes from now)
 */
export function getCodeExpiration(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 10);
  return now.toISOString();
}

// ============================================================================
// Exports
// ============================================================================

export const emailUtils = {
  isValidEmail,
  isDisposableEmail,
  normalizeEmail,
  hashEmail,
  hashIP,
  generateVerificationCode,
  getCodeExpiration,
};

export default emailUtils;
