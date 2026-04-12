import React, { useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface Template { id: string; name: string; category: string; slug: string; emoji: string; }

interface CategoryTheme {
  primary: string;    // main accent
  secondary: string;  // lighter variant
  dark: string;       // deep background
  mid: string;        // midtone
  audience: string;
  board: string;
}

interface Generated {
  youtube_title: string; youtube_description: string; youtube_tags: string[];
  opening_hook: string; opening_subtext: string; ending_headline: string;
  voiceover_script: string; features: string[];
  pinterest_title: string; pinterest_description: string; pinterest_tags: string[];
}

interface CopyState { [key: string]: boolean; }

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY THEMES — each category has a completely distinct visual identity
// ─────────────────────────────────────────────────────────────────────────────

const THEMES: Record<string, CategoryTheme> = {
  'HR & Culture':      { primary:'#10b981', secondary:'#34d399', mid:'#059669', dark:'#011a10', audience:'HR managers & team leads',       board:'HR Tools & Employee Surveys' },
  'Customer Feedback': { primary:'#f59e0b', secondary:'#fbbf24', mid:'#d97706', dark:'#160900', audience:'customer success teams',          board:'Customer Experience' },
  'Education':         { primary:'#3b82f6', secondary:'#60a5fa', mid:'#2563eb', dark:'#020d1f', audience:'educators & school admins',        board:'Free Business & Team...' },
  'Events':            { primary:'#f43f5e', secondary:'#fb7185', mid:'#e11d48', dark:'#1a0009', audience:'event organizers',                 board:'Free Business & Team...' },
  'Product & Tech':    { primary:'#8b5cf6', secondary:'#a78bfa', mid:'#7c3aed', dark:'#0d0118', audience:'product teams & founders',         board:'Business Tools for...' },
  'Healthcare':        { primary:'#06b6d4', secondary:'#22d3ee', mid:'#0891b2', dark:'#010e12', audience:'healthcare providers',             board:'Business Tools for...' },
  'Hospitality':       { primary:'#d97706', secondary:'#fbbf24', mid:'#b45309', dark:'#0d0500', audience:'hospitality businesses',           board:'Business Tools for...' },
  'Property':          { primary:'#22c55e', secondary:'#4ade80', mid:'#16a34a', dark:'#011508', audience:'property managers',                board:'Business Tools for...' },
  'Marketing':         { primary:'#e879f9', secondary:'#f0abfc', mid:'#d946ef', dark:'#160020', audience:'marketing teams',                  board:'Business Tools for...' },
  'Membership':        { primary:'#6366f1', secondary:'#818cf8', mid:'#4f46e5', dark:'#07071f', audience:'membership organizations',         board:'Online Poll Tools &...' },
  'Procurement':       { primary:'#94a3b8', secondary:'#cbd5e1', mid:'#64748b', dark:'#06080d', audience:'procurement teams',                board:'Business Tools for...' },
  'Community':         { primary:'#f97316', secondary:'#fb923c', mid:'#ea580c', dark:'#0e0400', audience:'community managers',               board:'Free Business & Team...' },
  'Civic':             { primary:'#a8a29e', secondary:'#d6d3d1', mid:'#78716c', dark:'#0c0b0a', audience:'nonprofits & civic orgs',          board:'Free Business & Team...' },
};

const getTheme = (cat: string): CategoryTheme => THEMES[cat] || THEMES['HR & Culture'];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE DATA — simplified, color from category theme
// ─────────────────────────────────────────────────────────────────────────────

const TEMPLATES: Template[] = [
  { id:"employee-engagement-survey",        name:"Employee Engagement Survey",      category:"HR & Culture",      slug:"employee-engagement-survey",        emoji:"👥" },
  { id:"employee-satisfaction-survey",      name:"Employee Satisfaction Survey",    category:"HR & Culture",      slug:"employee-satisfaction-survey",      emoji:"😊" },
  { id:"exit-interview-survey",             name:"Exit Interview Survey",           category:"HR & Culture",      slug:"exit-interview-survey",             emoji:"🚪" },
  { id:"weekly-pulse-survey",               name:"Weekly Pulse Survey",             category:"HR & Culture",      slug:"weekly-pulse-survey",               emoji:"💓" },
  { id:"job-satisfaction-survey",           name:"Job Satisfaction Survey",         category:"HR & Culture",      slug:"job-satisfaction-survey",           emoji:"⚡" },
  { id:"360-feedback-survey",               name:"360 Degree Feedback Survey",      category:"HR & Culture",      slug:"360-feedback-survey",               emoji:"🔄" },
  { id:"diversity-inclusion-survey",        name:"Diversity & Inclusion Survey",    category:"HR & Culture",      slug:"diversity-inclusion-survey",        emoji:"🤝" },
  { id:"employee-wellbeing-survey",         name:"Employee Wellbeing Survey",       category:"HR & Culture",      slug:"employee-wellbeing-survey",         emoji:"🌱" },
  { id:"remote-work-survey",                name:"Remote Work Survey",              category:"HR & Culture",      slug:"remote-work-survey",                emoji:"🏠" },
  { id:"internship-feedback-survey",        name:"Internship Feedback Survey",      category:"HR & Culture",      slug:"internship-feedback-survey",        emoji:"🌟" },
  { id:"employee-recognition-survey",       name:"Employee Recognition Survey",     category:"HR & Culture",      slug:"employee-recognition-survey",       emoji:"🏆" },
  { id:"employee-benefits-survey",          name:"Employee Benefits Survey",        category:"HR & Culture",      slug:"employee-benefits-survey",          emoji:"🎁" },
  { id:"canteen-food-service-survey",       name:"Canteen & Food Service Survey",   category:"HR & Culture",      slug:"canteen-food-service-survey",       emoji:"🍽️" },
  { id:"employee-mental-health-survey",     name:"Employee Mental Health Survey",   category:"HR & Culture",      slug:"employee-mental-health-survey",     emoji:"🧠" },
  { id:"candidate-experience-survey",       name:"Candidate Experience Survey",     category:"HR & Culture",      slug:"candidate-experience-survey",       emoji:"💼" },
  { id:"team-building-survey",              name:"Team Building Survey",            category:"HR & Culture",      slug:"team-building-survey",              emoji:"🎯" },
  { id:"new-hire-30-60-90-survey",          name:"New Hire 30-60-90 Day Survey",    category:"HR & Culture",      slug:"new-hire-30-60-90-survey",          emoji:"📅" },
  { id:"customer-satisfaction-survey",      name:"Customer Satisfaction (CSAT)",    category:"Customer Feedback", slug:"customer-satisfaction-survey",      emoji:"⭐" },
  { id:"nps-survey",                        name:"NPS Survey",                      category:"Customer Feedback", slug:"nps-survey",                        emoji:"📊" },
  { id:"restaurant-feedback-survey",        name:"Restaurant Feedback Survey",      category:"Customer Feedback", slug:"restaurant-feedback-survey",        emoji:"🍽️" },
  { id:"customer-churn-survey",             name:"Customer Churn Survey",           category:"Customer Feedback", slug:"customer-churn-survey",             emoji:"📉" },
  { id:"food-delivery-survey",              name:"Food Delivery Survey",            category:"Customer Feedback", slug:"food-delivery-survey",              emoji:"🛵" },
  { id:"gym-fitness-class-survey",          name:"Gym & Fitness Class Survey",      category:"Customer Feedback", slug:"gym-fitness-class-survey",          emoji:"🏋️" },
  { id:"subscription-service-survey",       name:"Subscription Service Survey",     category:"Customer Feedback", slug:"subscription-service-survey",       emoji:"🔁" },
  { id:"client-satisfaction-survey",        name:"Client Satisfaction Survey",      category:"Customer Feedback", slug:"client-satisfaction-survey",        emoji:"🤝" },
  { id:"personal-trainer-feedback-survey",  name:"Personal Trainer Feedback",       category:"Customer Feedback", slug:"personal-trainer-feedback-survey",  emoji:"💪" },
  { id:"spa-wellness-feedback",             name:"Spa & Wellness Feedback",         category:"Customer Feedback", slug:"spa-wellness-feedback",             emoji:"🌿" },
  { id:"retail-customer-survey",            name:"Retail Customer Survey",          category:"Customer Feedback", slug:"retail-customer-survey",            emoji:"🛍️" },
  { id:"real-estate-agent-survey",          name:"Real Estate Agent Feedback",      category:"Customer Feedback", slug:"real-estate-agent-survey",          emoji:"🏡" },
  { id:"insurance-satisfaction-survey",     name:"Insurance Satisfaction Survey",   category:"Customer Feedback", slug:"insurance-satisfaction-survey",     emoji:"🛡️" },
  { id:"sales-feedback-survey",             name:"Sales Feedback Survey",           category:"Customer Feedback", slug:"sales-feedback-survey",             emoji:"📈" },
  { id:"coworking-space-survey",            name:"Coworking Space Survey",          category:"Customer Feedback", slug:"coworking-space-survey",            emoji:"🏢" },
  { id:"course-evaluation-survey",          name:"Course Evaluation Survey",        category:"Education",         slug:"course-evaluation-survey",          emoji:"📋" },
  { id:"training-feedback-survey",          name:"Training Feedback Survey",        category:"Education",         slug:"training-feedback-survey",          emoji:"📚" },
  { id:"student-satisfaction-survey",       name:"Student Satisfaction Survey",     category:"Education",         slug:"student-satisfaction-survey",       emoji:"🎒" },
  { id:"school-satisfaction-survey",        name:"School Satisfaction Survey",      category:"Education",         slug:"school-satisfaction-survey",        emoji:"🏫" },
  { id:"alumni-survey",                     name:"Alumni Survey",                   category:"Education",         slug:"alumni-survey",                     emoji:"🎓" },
  { id:"school-parent-survey",              name:"School Parent Survey",            category:"Education",         slug:"school-parent-survey",              emoji:"👨‍👩‍👧" },
  { id:"childcare-parent-survey",           name:"Childcare Parent Survey",         category:"Education",         slug:"childcare-parent-survey",           emoji:"👶" },
  { id:"online-course-feedback-survey",     name:"Online Course Feedback Survey",   category:"Education",         slug:"online-course-feedback-survey",     emoji:"💻" },
  { id:"event-feedback-survey",             name:"Event Feedback Survey",           category:"Events",            slug:"event-feedback-survey",             emoji:"🎉" },
  { id:"conference-feedback-survey",        name:"Conference Feedback Survey",      category:"Events",            slug:"conference-feedback-survey",        emoji:"🏛️" },
  { id:"speaker-evaluation-survey",         name:"Speaker Evaluation Survey",       category:"Events",            slug:"speaker-evaluation-survey",         emoji:"🎤" },
  { id:"meeting-feedback-survey",           name:"Meeting Feedback Survey",         category:"Events",            slug:"meeting-feedback-survey",           emoji:"📅" },
  { id:"product-feedback-survey",           name:"Product Feedback Survey",         category:"Product & Tech",    slug:"product-feedback-survey",           emoji:"📦" },
  { id:"product-market-fit-survey",         name:"Product Market Fit Survey",       category:"Product & Tech",    slug:"product-market-fit-survey",         emoji:"🎯" },
  { id:"website-feedback-survey",           name:"Website Feedback Survey",         category:"Product & Tech",    slug:"website-feedback-survey",           emoji:"🌐" },
  { id:"app-usability-survey",              name:"App Usability Survey",            category:"Product & Tech",    slug:"app-usability-survey",              emoji:"📱" },
  { id:"software-onboarding-survey",        name:"Software Onboarding Survey",      category:"Product & Tech",    slug:"software-onboarding-survey",        emoji:"🚀" },
  { id:"it-support-survey",                 name:"IT Support Satisfaction Survey",  category:"Product & Tech",    slug:"it-support-survey",                 emoji:"💻" },
  { id:"market-research-survey",            name:"Market Research Survey",          category:"Product & Tech",    slug:"market-research-survey",            emoji:"🔍" },
  { id:"patient-satisfaction-survey",       name:"Patient Satisfaction Survey",     category:"Healthcare",        slug:"patient-satisfaction-survey",       emoji:"🏥" },
  { id:"dental-satisfaction-survey",        name:"Dental Patient Satisfaction",     category:"Healthcare",        slug:"dental-satisfaction-survey",        emoji:"🦷" },
  { id:"patient-discharge-survey",          name:"Patient Discharge Survey",        category:"Healthcare",        slug:"patient-discharge-survey",          emoji:"📋" },
  { id:"hotel-guest-satisfaction-survey",   name:"Hotel Guest Satisfaction",        category:"Hospitality",       slug:"hotel-guest-satisfaction-survey",   emoji:"🏨" },
  { id:"tenant-satisfaction-survey",        name:"Tenant Satisfaction Survey",      category:"Property",          slug:"tenant-satisfaction-survey",        emoji:"🏠" },
  { id:"vacation-rental-guest-survey",      name:"Vacation Rental Guest Survey",    category:"Property",          slug:"vacation-rental-guest-survey",      emoji:"🏡" },
  { id:"hoa-resident-survey",               name:"HOA Resident Survey",             category:"Property",          slug:"hoa-resident-survey",               emoji:"🏘️" },
  { id:"student-housing-survey",            name:"Student Housing Survey",          category:"Property",          slug:"student-housing-survey",            emoji:"🎓" },
  { id:"brand-awareness-survey",            name:"Brand Awareness Survey",          category:"Marketing",         slug:"brand-awareness-survey",            emoji:"🎯" },
  { id:"membership-satisfaction-survey",    name:"Membership Satisfaction Survey",  category:"Membership",        slug:"membership-satisfaction-survey",    emoji:"🏅" },
  { id:"podcast-content-survey",            name:"Podcast Content Survey",          category:"Membership",        slug:"podcast-content-survey",            emoji:"🎙️" },
  { id:"vendor-evaluation-survey",          name:"Vendor Evaluation Survey",        category:"Procurement",       slug:"vendor-evaluation-survey",          emoji:"📋" },
  { id:"volunteer-feedback-survey",         name:"Volunteer Feedback Survey",       category:"Community",         slug:"volunteer-feedback-survey",         emoji:"🤝" },
  { id:"community-satisfaction-survey",     name:"Community Satisfaction Survey",   category:"Community",         slug:"community-satisfaction-survey",     emoji:"🏘️" },
  { id:"nonprofit-impact-survey",           name:"Nonprofit Impact Survey",         category:"Community",         slug:"nonprofit-impact-survey",           emoji:"❤️" },
  { id:"museum-visitor-survey",             name:"Museum Visitor Survey",           category:"Civic",             slug:"museum-visitor-survey",             emoji:"🏛️" },
];

const CATEGORIES: string[] = ["All", ...Array.from(new Set(TEMPLATES.map(t => t.category)))];

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY BACKGROUND — unique visual identity per category
// Each uses: distinct colour palette + unique geometric pattern + glow composition
// ─────────────────────────────────────────────────────────────────────────────

function CategoryBg({ cat, sfx, emoji }: { cat: string; sfx: string; emoji: string }): React.ReactElement {
  const th = getTheme(cat);
  // uid for SVG pattern — unique per card instance
  const uid = `p${cat.replace(/[^a-zA-Z]/g,'').slice(0,4)}${sfx}`;

  const Emoji = () => (
    <div style={{ position:'absolute', bottom:-25, right:-15, fontSize:175, opacity:0.09,
      lineHeight:1, userSelect:'none', pointerEvents:'none', filter:'blur(3px)', zIndex:0 }}>
      {emoji}
    </div>
  );

  // ── HR & Culture: emerald hex-network ──────────────────────────────────────
  if (cat === 'HR & Culture') return (
    <>
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(150deg, ${th.dark} 0%, #020f08 45%, ${th.dark} 100%)` }} />
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.14 }}>
        <defs><pattern id={uid} width="56" height="48" patternUnits="userSpaceOnUse">
          <polygon points="28,3 52,15 52,33 28,45 4,33 4,15" fill="none" stroke="white" strokeWidth="0.7"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill={`url(#${uid})`}/>
      </svg>
      <div style={{ position:'absolute', top:-60, right:-40, width:200, height:200, borderRadius:'50%', background:`radial-gradient(circle, ${th.primary}50 0%, transparent 65%)` }}/>
      <div style={{ position:'absolute', bottom:-50, left:'40%', width:260, height:260, borderRadius:'50%', background:`radial-gradient(circle, ${th.primary}40 0%, transparent 60%)` }}/>
      <div style={{ position:'absolute', top:0, left:0, bottom:0, width:3, background:`linear-gradient(to bottom, transparent, ${th.primary}cc, transparent)` }}/>
      <Emoji/>
    </>
  );

  // ── Customer Feedback: amber star pattern ──────────────────────────────────
  if (cat === 'Customer Feedback') return (
    <>
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(150deg, ${th.dark} 0%, #0a0400 50%, ${th.dark} 100%)` }}/>
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.15 }}>
        <defs><pattern id={uid} width="44" height="44" patternUnits="userSpaceOnUse">
          <polygon points="22,5 24,16 35,16 26,22 29,33 22,27 15,33 18,22 9,16 20,16" fill="none" stroke="white" strokeWidth="0.6"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill={`url(#${uid})`}/>
      </svg>
      <div style={{ position:'absolute', top:'25%', left:'50%', transform:'translateX(-50%)', width:280, height:280, borderRadius:'50%', background:`radial-gradient(circle, ${th.primary}45 0%, transparent 55%)` }}/>
      <div style={{ position:'absolute', bottom:-40, right:-20, width:160, height:160, borderRadius:'50%', background:`radial-gradient(circle, ${th.secondary}30 0%, transparent 60%)` }}/>
      <Emoji/>
    </>
  );

  // ── Education: cobalt graph-paper grid ────────────────────────────────────
  if (cat === 'Education') return (
    <>
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(160deg, ${th.dark} 0%, #010812 45%, ${th.dark} 100%)` }}/>
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.1 }}>
        <defs><pattern id={uid} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
          <path d="M 10 0 L 10 40 M 20 0 L 20 40 M 30 0 L 30 40 M 0 10 L 40 10 M 0 20 L 40 20 M 0 30 L 40 30" fill="none" stroke="white" strokeWidth="0.2"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill={`url(#${uid})`}/>
      </svg>
      <div style={{ position:'absolute', top:-50, right:-30, width:220, height:220, borderRadius:'50%', background:`radial-gradient(circle, ${th.primary}55 0%, transparent 60%)` }}/>
      <div style={{ position:'absolute', bottom:-30, left:-30, width:180, height:180, borderRadius:'50%', background:`radial-gradient(circle, ${th.mid}30 0%, transparent 65%)` }}/>
      <Emoji/>
    </>
  );

  // ── Events: rose scattered-dots celebration ────────────────────────────────
  if (cat === 'Events') return (
    <>
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(150deg, ${th.dark} 0%, #0d0005 50%, ${th.dark} 100%)` }}/>
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.16 }}>
        <defs><pattern id={uid} width="50" height="50" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="2.5" fill="white"/>
          <circle cx="28" cy="20" r="1.5" fill="white" opacity="0.6"/>
          <circle cx="42" cy="10" r="2" fill="white" opacity="0.8"/>
          <circle cx="16" cy="38" r="2.2" fill="white" opacity="0.7"/>
          <circle cx="38" cy="36" r="1.2" fill="white" opacity="0.5"/>
          <circle cx="4" cy="26" r="1.8" fill="white" opacity="0.9"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill={`url(#${uid})`}/>
      </svg>
      <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)', width:300, height:300, borderRadius:'50%', background:`radial-gradient(circle, ${th.primary}45 0%, transparent 55%)` }}/>
      <Emoji/>
    </>
  );

  // ── Product & Tech: violet circuit-board ──────────────────────────────────
  if (cat === 'Product & Tech') return (
    <>
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(145deg, ${th.dark} 0%, #060010 50%, ${th.dark} 100%)` }}/>
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.13 }}>
        <defs><pattern id={uid} width="60" height="60" patternUnits="userSpaceOnUse">
          <line x1="0" y1="30" x2="18" y2="30" stroke="white" strokeWidth="0.7"/>
          <line x1="18" y1="30" x2="18" y2="10" stroke="white" strokeWidth="0.7"/>
          <line x1="18" y1="10" x2="60" y2="10" stroke="white" strokeWidth="0.7"/>
          <circle cx="18" cy="30" r="2" fill="white"/>
          <circle cx="18" cy="10" r="2" fill="white"/>
          <line x1="0" y1="50" x2="38" y2="50" stroke="white" strokeWidth="0.7"/>
          <line x1="38" y1="50" x2="38" y2="30" stroke="white" strokeWidth="0.7"/>
          <line x1="38" y1="30" x2="60" y2="30" stroke="white" strokeWidth="0.7"/>
          <circle cx="38" cy="50" r="2" fill="white"/>
          <circle cx="38" cy="30" r="2" fill="white"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill={`url(#${uid})`}/>
      </svg>
      {/* Neon right edge */}
      <div style={{ position:'absolute', top:0, right:0, bottom:0, width:3, background:`linear-gradient(to bottom, transparent, ${th.primary}dd, transparent)` }}/>
      <div style={{ position:'absolute', top:'25%', right:-40, width:200, height:200, borderRadius:'50%', background:`radial-gradient(circle, ${th.primary}45 0%, transparent 60%)` }}/>
      <div style={{ position:'absolute', bottom:'20%', left:-30, width:150, height:150, borderRadius:'50%', background:`radial-gradient(circle, ${th.secondary}25 0%, transparent 60%)` }}/>
      <Emoji/>
    </>
  );

  // ── Healthcare: cyan medical-cross ────────────────────────────────────────
  if (cat === 'Healthcare') return (
    <>
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(155deg, ${th.dark} 0%, #000d11 50%, ${th.dark} 100%)` }}/>
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.11 }}>
        <defs><pattern id={uid} width="36" height="36" patternUnits="userSpaceOnUse">
          <line x1="18" y1="6" x2="18" y2="30" stroke="white" strokeWidth="0.9"/>
          <line x1="6" y1="18" x2="30" y2="18" stroke="white" strokeWidth="0.9"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill={`url(#${uid})`}/>
      </svg>
      {/* Clinical top beam */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, transparent, ${th.primary}ee, transparent)` }}/>
      <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)', width:250, height:250, borderRadius:'50%', background:`radial-gradient(circle, ${th.primary}38 0%, transparent 58%)` }}/>
      <Emoji/>
    </>
  );

  // ── Hospitality: gold diamond luxury ─────────────────────────────────────
  if (cat === 'Hospitality') return (
    <>
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(150deg, ${th.dark} 0%, #070200 50%, ${th.dark} 100%)` }}/>
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.12 }}>
        <defs><pattern id={uid} width="40" height="40" patternUnits="userSpaceOnUse">
          <polygon points="20,4 36,20 20,36 4,20" fill="none" stroke="white" strokeWidth="0.6"/>
          <polygon points="20,10 30,20 20,30 10,20" fill="none" stroke="white" strokeWidth="0.3"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill={`url(#${uid})`}/>
      </svg>
      {/* Candlelight centre */}
      <div style={{ position:'absolute', top:'35%', left:'50%', transform:'translateX(-50%)', width:260, height:260, borderRadius:'50%', background:`radial-gradient(circle, ${th.primary}40 0%, transparent 55%)` }}/>
      <div style={{ position:'absolute', top:-40, right:-20, width:150, height:150, borderRadius:'50%', background:`radial-gradient(circle, ${th.secondary}25 0%, transparent 65%)` }}/>
      <Emoji/>
    </>
  );

  // ── Property: forest-green architectural ──────────────────────────────────
  if (cat === 'Property') return (
    <>
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(145deg, ${th.dark} 0%, #010804 50%, ${th.dark} 100%)` }}/>
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.1 }}>
        <defs><pattern id={uid} width="50" height="50" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="50" height="50" fill="none" stroke="white" strokeWidth="0.5"/>
          <rect x="12" y="12" width="26" height="26" fill="none" stroke="white" strokeWidth="0.3"/>
          <line x1="25" y1="0" x2="25" y2="12" stroke="white" strokeWidth="0.3"/>
          <line x1="25" y1="38" x2="25" y2="50" stroke="white" strokeWidth="0.3"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill={`url(#${uid})`}/>
      </svg>
      <div style={{ position:'absolute', bottom:-40, left:'40%', width:280, height:280, borderRadius:'50%', background:`radial-gradient(circle, ${th.primary}38 0%, transparent 55%)` }}/>
      <Emoji/>
    </>
  );

  // ── Marketing: fuchsia diagonal-stripes ───────────────────────────────────
  if (cat === 'Marketing') return (
    <>
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(150deg, ${th.dark} 0%, #0e0018 50%, ${th.dark} 100%)` }}/>
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.12 }}>
        <defs><pattern id={uid} width="22" height="22" patternUnits="userSpaceOnUse">
          <line x1="0" y1="22" x2="22" y2="0" stroke="white" strokeWidth="1.2"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill={`url(#${uid})`}/>
      </svg>
      {/* High-energy double burst */}
      <div style={{ position:'absolute', top:'10%', left:'30%', width:280, height:280, borderRadius:'50%', background:`radial-gradient(circle, ${th.primary}42 0%, transparent 52%)` }}/>
      <div style={{ position:'absolute', bottom:-40, right:-20, width:160, height:160, borderRadius:'50%', background:`radial-gradient(circle, ${th.secondary}25 0%, transparent 60%)` }}/>
      <Emoji/>
    </>
  );

  // ── Membership: indigo polygon-mesh ──────────────────────────────────────
  if (cat === 'Membership') return (
    <>
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(145deg, ${th.dark} 0%, #040415 50%, ${th.dark} 100%)` }}/>
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.12 }}>
        <defs><pattern id={uid} width="50" height="50" patternUnits="userSpaceOnUse">
          <polygon points="25,5 45,17 45,33 25,45 5,33 5,17" fill="none" stroke="white" strokeWidth="0.6"/>
          <polygon points="25,14 36,20 36,30 25,36 14,30 14,20" fill="none" stroke="white" strokeWidth="0.3"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill={`url(#${uid})`}/>
      </svg>
      {/* Deep space orbs */}
      <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)', width:240, height:240, borderRadius:'50%', background:`radial-gradient(circle, ${th.primary}32 0%, transparent 58%)` }}/>
      <div style={{ position:'absolute', bottom:-30, right:20, width:120, height:120, borderRadius:'50%', background:`radial-gradient(circle, ${th.secondary}28 0%, transparent 65%)` }}/>
      <Emoji/>
    </>
  );

  // ── Procurement: slate minimal-grid ──────────────────────────────────────
  if (cat === 'Procurement') return (
    <>
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(160deg, ${th.dark} 0%, #040507 50%, ${th.dark} 100%)` }}/>
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.08 }}>
        <defs><pattern id={uid} width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill={`url(#${uid})`}/>
      </svg>
      <div style={{ position:'absolute', top:'30%', left:'50%', transform:'translateX(-50%)', width:220, height:220, borderRadius:'50%', background:`radial-gradient(circle, ${th.primary}25 0%, transparent 58%)` }}/>
      <Emoji/>
    </>
  );

  // ── Community: orange concentric-rings ────────────────────────────────────
  if (cat === 'Community') return (
    <>
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(150deg, ${th.dark} 0%, #090200 50%, ${th.dark} 100%)` }}/>
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.1 }} viewBox="0 0 270 480" preserveAspectRatio="xMidYMid slice">
        {[60,110,160,210,260,310].map((r,i) => (
          <circle key={i} cx="135" cy="480" r={r} fill="none" stroke="white" strokeWidth="0.6"/>
        ))}
      </svg>
      {/* Sunrise glow from bottom */}
      <div style={{ position:'absolute', bottom:-60, left:'50%', transform:'translateX(-50%)', width:340, height:340, borderRadius:'50%', background:`radial-gradient(circle, ${th.primary}48 0%, transparent 55%)` }}/>
      <Emoji/>
    </>
  );

  // ── Civic: stone horizontal-lines (classical) ─────────────────────────────
  if (cat === 'Civic') return (
    <>
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(160deg, ${th.dark} 0%, #080807 50%, ${th.dark} 100%)` }}/>
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.1 }}>
        <defs><pattern id={uid} width="100%" height="28" patternUnits="userSpaceOnUse">
          <line x1="0" y1="14" x2="100%" y2="14" stroke="white" strokeWidth="0.5"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill={`url(#${uid})`}/>
      </svg>
      <div style={{ position:'absolute', top:'25%', left:'50%', transform:'translateX(-50%)', width:220, height:220, borderRadius:'50%', background:`radial-gradient(circle, ${th.primary}28 0%, transparent 58%)` }}/>
      <Emoji/>
    </>
  );

  // ── Fallback ───────────────────────────────────────────────────────────────
  return (
    <>
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(145deg, ${th.dark} 0%, #06080f 50%, ${th.dark} 100%)` }}/>
      <div style={{ position:'absolute', top:'30%', left:'50%', transform:'translateX(-50%)', width:240, height:240, borderRadius:'50%', background:`radial-gradient(circle, ${th.primary}35 0%, transparent 60%)` }}/>
      <Emoji/>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED CARD ELEMENTS
// ─────────────────────────────────────────────────────────────────────────────

function LogoBar({ color, scale }: { color: string; scale: number }): React.ReactElement {
  return (
    <div style={{ padding:`${18*scale}px ${20*scale}px 0`, display:'flex', alignItems:'center', gap:7*scale, position:'relative', zIndex:4 }}>
      <img src="/logo.svg" alt="" style={{ width:16*scale, height:16*scale, borderRadius:4*scale }}
        onError={(e:React.SyntheticEvent<HTMLImageElement>) => { (e.currentTarget as HTMLImageElement).style.display='none'; }}/>
      <span style={{ fontSize:9*scale, fontWeight:800, letterSpacing:'0.14em', textTransform:'uppercase' as const }}>
        <span style={{ color:'rgba(255,255,255,0.5)' }}>Vote</span>
        <span style={{ color }}> Generator</span>
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CARD COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function OpeningCard({ t, g, scale=1 }: { t:Template; g:Generated; scale?:number }): React.ReactElement {
  const th = getTheme(t.category);
  const w = Math.round(270*scale), h = Math.round(480*scale);
  return (
    <div style={{ width:w, height:h, borderRadius:18*scale, overflow:'hidden', position:'relative', flexShrink:0,
      border:`${scale}px solid ${th.primary}55`,
      boxShadow:`0 0 ${55*scale}px ${th.primary}44, 0 ${20*scale}px ${60*scale}px rgba(0,0,0,0.7)` }}>
      <CategoryBg cat={t.category} sfx="op" emoji={t.emoji}/>
      {/* Left accent */}
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3*scale, background:`linear-gradient(to bottom, transparent, ${th.primary}ee, transparent)`, zIndex:3 }}/>
      <LogoBar color={th.primary} scale={scale}/>
      <div style={{ position:'absolute', top:'25%', left:0, right:0, padding:`0 ${24*scale}px`, zIndex:4 }}>
        <div style={{ display:'inline-flex', alignItems:'center', background:`${th.primary}22`, border:`1px solid ${th.primary}55`, borderRadius:20*scale, padding:`${4*scale}px ${12*scale}px`, marginBottom:16*scale }}>
          <span style={{ fontSize:9*scale, fontWeight:900, color:th.primary, letterSpacing:'0.12em', textTransform:'uppercase' as const }}>{t.category}</span>
        </div>
        <div style={{ fontSize:29*scale, fontWeight:900, lineHeight:1.05, color:'#ffffff', letterSpacing:'-0.03em', marginBottom:14*scale, textShadow:`0 2px 20px rgba(0,0,0,0.8), 0 0 40px ${th.primary}44` }}>
          {g.opening_hook}
        </div>
        <div style={{ fontSize:13*scale, fontWeight:500, color:'rgba(255,255,255,0.55)', lineHeight:1.4 }}>{g.opening_subtext}</div>
      </div>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:`${14*scale}px ${24*scale}px ${18*scale}px`, background:`linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)`, zIndex:4 }}>
        <div style={{ fontSize:9*scale, fontWeight:700, color:'rgba(255,255,255,0.35)', letterSpacing:'0.1em', textTransform:'uppercase' as const }}>Free · No Signup Required</div>
      </div>
    </div>
  );
}

function FeaturesCard({ t, g, scale=1 }: { t:Template; g:Generated; scale?:number }): React.ReactElement {
  const th = getTheme(t.category);
  const w = Math.round(270*scale), h = Math.round(480*scale);
  return (
    <div style={{ width:w, height:h, borderRadius:18*scale, overflow:'hidden', position:'relative', flexShrink:0,
      border:`${scale}px solid ${th.primary}44`,
      boxShadow:`0 0 ${45*scale}px ${th.primary}33, 0 ${20*scale}px ${60*scale}px rgba(0,0,0,0.7)` }}>
      <CategoryBg cat={t.category} sfx="ft" emoji={t.emoji}/>
      {/* Top accent line */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2*scale, background:`linear-gradient(90deg, transparent, ${th.primary}dd, transparent)`, zIndex:3 }}/>
      <LogoBar color={th.primary} scale={scale}/>
      <div style={{ padding:`${14*scale}px ${22*scale}px`, position:'relative', zIndex:4 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8*scale, marginBottom:18*scale }}>
          <div style={{ width:20*scale, height:1.5*scale, background:th.primary }}/>
          <div style={{ fontSize:11*scale, fontWeight:900, color:th.primary, letterSpacing:'0.1em', textTransform:'uppercase' as const }}>Why Teams Love It</div>
          <div style={{ width:20*scale, height:1.5*scale, background:th.primary }}/>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14*scale }}>
          {(g.features||[]).map((f:string, i:number) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12*scale }}>
              <div style={{ width:24*scale, height:24*scale, borderRadius:7*scale, flexShrink:0, background:`${th.primary}22`, border:`1px solid ${th.primary}55`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11*scale, fontWeight:900, color:th.primary }}>{i+1}</div>
              <div style={{ fontSize:12.5*scale, color:'rgba(255,255,255,0.82)', lineHeight:1.5, fontWeight:500, paddingTop:2*scale }}>{f}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:`${14*scale}px ${22*scale}px ${18*scale}px`, background:`linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)`, zIndex:4 }}>
        <div style={{ background:`${th.primary}20`, border:`1px solid ${th.primary}50`, borderRadius:8*scale, padding:`${7*scale}px ${12*scale}px`, fontSize:11*scale, fontWeight:800, color:th.primary }}>
          votegenerator.com
        </div>
      </div>
    </div>
  );
}

function EndingCard({ t, g, scale=1 }: { t:Template; g:Generated; scale?:number }): React.ReactElement {
  const th = getTheme(t.category);
  const w = Math.round(270*scale), h = Math.round(480*scale);
  return (
    <div style={{ width:w, height:h, borderRadius:18*scale, overflow:'hidden', position:'relative', flexShrink:0,
      border:`${scale}px solid ${th.primary}44`,
      boxShadow:`0 0 ${65*scale}px ${th.primary}44, 0 ${20*scale}px ${60*scale}px rgba(0,0,0,0.7)` }}>
      <CategoryBg cat={t.category} sfx="en" emoji={t.emoji}/>
      <LogoBar color={th.primary} scale={scale}/>
      <div style={{ position:'absolute', top:'22%', left:0, right:0, padding:`0 ${24*scale}px`, zIndex:4 }}>
        <div style={{ width:56*scale, height:56*scale, borderRadius:16*scale, background:`linear-gradient(135deg, ${th.primary}ee, ${th.mid}88)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28*scale, marginBottom:24*scale, boxShadow:`0 8px 30px ${th.primary}66` }}>
          {t.emoji}
        </div>
        <div style={{ fontSize:27*scale, fontWeight:900, lineHeight:1.08, color:'#ffffff', letterSpacing:'-0.03em', marginBottom:22*scale, textShadow:`0 2px 20px rgba(0,0,0,0.7), 0 0 40px ${th.primary}44` }}>
          {g.ending_headline}
        </div>
        <div style={{ display:'inline-block', background:`linear-gradient(135deg, ${th.primary}28, ${th.primary}18)`, border:`1.5px solid ${th.primary}70`, borderRadius:10*scale, padding:`${9*scale}px ${16*scale}px`, fontSize:14*scale, fontWeight:800, color:th.primary, boxShadow:`0 4px 16px ${th.primary}33` }}>
          votegenerator.com
        </div>
      </div>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:`${14*scale}px ${24*scale}px ${18*scale}px`, background:`linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)`, zIndex:4 }}>
        <div style={{ fontSize:9*scale, fontWeight:700, color:'rgba(255,255,255,0.28)', letterSpacing:'0.1em', textTransform:'uppercase' as const }}>
          Perfect for {th.audience}
        </div>
      </div>
    </div>
  );
}

function RelatedCard({ t, scale=1 }: { t:Template; scale?:number }): React.ReactElement {
  const th = getTheme(t.category);
  const w = Math.round(270*scale), h = Math.round(480*scale);
  const related = TEMPLATES.filter(r => r.category === t.category && r.id !== t.id).slice(0, 4);
  return (
    <div style={{ width:w, height:h, borderRadius:18*scale, overflow:'hidden', position:'relative', flexShrink:0,
      border:`${scale}px solid ${th.primary}33`,
      boxShadow:`0 0 ${40*scale}px ${th.primary}22, 0 ${20*scale}px ${60*scale}px rgba(0,0,0,0.7)` }}>
      <CategoryBg cat={t.category} sfx="re" emoji={t.emoji}/>
      <LogoBar color={th.primary} scale={scale}/>
      <div style={{ padding:`${12*scale}px ${20*scale}px`, position:'relative', zIndex:4 }}>
        <div style={{ fontSize:11*scale, fontWeight:900, color:th.primary, letterSpacing:'0.1em', textTransform:'uppercase' as const, marginBottom:4*scale }}>More {t.category} Surveys</div>
        <div style={{ fontSize:10*scale, color:'rgba(255,255,255,0.3)', marginBottom:16*scale }}>Free · No signup · votegenerator.com</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10*scale }}>
          {related.map((r:Template) => (
            <div key={r.id} style={{ display:'flex', alignItems:'center', gap:10*scale, background:'rgba(255,255,255,0.05)', border:`1px solid rgba(255,255,255,0.08)`, borderRadius:10*scale, padding:`${10*scale}px ${12*scale}px` }}>
              <div style={{ width:32*scale, height:32*scale, borderRadius:8*scale, background:`${th.primary}25`, border:`1px solid ${th.primary}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15*scale, flexShrink:0 }}>{r.emoji}</div>
              <div style={{ fontSize:11*scale, fontWeight:600, color:'rgba(255,255,255,0.78)', lineHeight:1.3 }}>{r.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:`${14*scale}px ${20*scale}px ${18*scale}px`, background:`linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)`, zIndex:4 }}>
        <div style={{ background:`linear-gradient(135deg, ${th.primary}ee, ${th.mid}cc)`, borderRadius:10*scale, padding:`${10*scale}px ${16*scale}px`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:8*scale }}>
          <span style={{ fontSize:12*scale, fontWeight:800, color:'#fff', letterSpacing:'-0.01em' }}>Browse All Templates →</span>
        </div>
        <div style={{ fontSize:9*scale, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase' as const, textAlign:'center' as const }}>
          votegenerator.com/templates
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIGHTBOX
// ─────────────────────────────────────────────────────────────────────────────

function Lightbox({ card, t, g, onClose }: { card:'open'|'end'|'features'|'related'|null; t:Template|null; g:Generated|null; onClose:()=>void }): React.ReactElement {
  if (!card || !t || !g) return <></>;
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.96)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
      <div onClick={(e:React.MouseEvent) => e.stopPropagation()} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
        <div style={{ fontSize:12, color:'#475569', marginBottom:4 }}>Click outside to close · Right-click → Save image</div>
        {card==='open'     && <OpeningCard  t={t} g={g} scale={1.65}/>}
        {card==='features' && <FeaturesCard t={t} g={g} scale={1.65}/>}
        {card==='end'      && <EndingCard   t={t} g={g} scale={1.65}/>}
        {card==='related'  && <RelatedCard  t={t} scale={1.65}/>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ShortsStudio(): React.ReactElement {
  const [sel, setSel] = useState<Template|null>(null);
  const [catFilter, setCatFilter] = useState<string>("All");
  const [generated, setGenerated] = useState<Generated|null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string|null>(null);
  const [copied, setCopied] = useState<CopyState>({});
  const [search, setSearch] = useState<string>("");
  const [lightbox, setLightbox] = useState<'open'|'end'|'features'|'related'|null>(null);

  const filtered = TEMPLATES.filter(t => (catFilter==="All" || t.category===catFilter) && (!search || t.name.toLowerCase().includes(search.toLowerCase())));

  const generate = async () => {
    if (!sel) return;
    setLoading(true); setErr(null); setGenerated(null);
    const th = getTheme(sel.category);
    const prompt = `You are a YouTube Shorts and Pinterest content strategist for VoteGenerator.com — a free, no-signup survey tool used by ${th.audience}.

Generate production assets for:
- Template: ${sel.name}
- Category: ${sel.category}
- URL: https://votegenerator.com/templates/${sel.slug}/

Return ONLY valid JSON (no markdown, no backticks):
{
  "youtube_title": "Start: How to Create a Free [name]. 60 chars max. Include keyword.",
  "youtube_description": "150-200 words. Hook first line. Use case. URL. 4-5 hashtags at end.",
  "youtube_tags": ["tag1","tag2","tag3","tag4","tag5","tag6","tag7","tag8"],
  "opening_hook": "8-12 words MAX. Sharp pain point question ending with ?",
  "opening_subtext": "4-6 words. Softer follow-up.",
  "ending_headline": "6-8 words. Strong action CTA.",
  "voiceover_script": "35-45 seconds for ElevenLabs. No stage directions. Short punchy sentences. Hook, Problem, Solution, Features, CTA.",
  "features": ["One clear sentence","One clear sentence","One clear sentence","One clear sentence"],
  "pinterest_title": "60 chars. Include Free + survey type.",
  "pinterest_description": "150-200 chars. Value prop. Problem it solves. URL.",
  "pinterest_tags": ["tag1","tag2","tag3","tag4","tag5"]
}`;
    try {
      const res = await fetch("/.netlify/functions/vg-claude-proxy", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1200, messages:[{role:"user",content:prompt}] })
      });
      const data = await res.json();
      const text:string = data.content[0].text.trim().replace(/```json|```/g,"").trim();
      setGenerated(JSON.parse(text));
    } catch { setErr("Generation failed. Please try again."); }
    finally { setLoading(false); }
  };

  const copy = async (text:string, key:string) => {
    await navigator.clipboard.writeText(text);
    setCopied(p => ({...p,[key]:true}));
    setTimeout(() => setCopied(p => ({...p,[key]:false})), 2000);
  };

  const CBtn = ({ text, label }:{text:string;label:string}) => (
    <button onClick={()=>copy(text,label)} style={{ background:copied[label]?"#10b981":"#1e293b", color:copied[label]?"#fff":"#94a3b8", border:"1px solid "+(copied[label]?"#10b981":"#334155"), borderRadius:6, padding:"4px 12px", fontSize:12, cursor:"pointer", fontWeight:600, flexShrink:0 }}>
      {copied[label]?"✓ Copied":"Copy"}
    </button>
  );

  const Section = ({icon,title}:{icon:string;title:string}) => (
    <div style={{ padding:"16px 20px", borderBottom:"1px solid #1e293b", display:"flex", alignItems:"center", gap:10 }}>
      <span style={{ fontSize:16 }}>{icon}</span><div style={{ fontWeight:700, fontSize:14 }}>{title}</div>
    </div>
  );

  const FieldRow = ({label,text,children}:{label:string;text:string;children:React.ReactNode}) => (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#475569", letterSpacing:"0.06em", textTransform:"uppercase" as const }}>{label}</div>
        <CBtn text={text} label={label}/>
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ background:"#090e1a", minHeight:"100vh", fontFamily:"'DM Sans', system-ui, sans-serif", color:"#f1f5f9" }}>
      <Lightbox card={lightbox} t={sel} g={generated} onClose={()=>setLightbox(null)}/>

      {/* Header */}
      <div style={{ borderBottom:"1px solid #1e293b", padding:"18px 32px", display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:36, height:36, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🎬</div>
        <div>
          <div style={{ fontWeight:800, fontSize:17, letterSpacing:"-0.02em" }}>Shorts Studio</div>
          <div style={{ fontSize:12, color:"#475569", display:"flex", alignItems:"center", gap:6 }}>
            <img src="/logo.svg" alt="" style={{ width:13, height:13 }} onError={(e:React.SyntheticEvent<HTMLImageElement>)=>{(e.currentTarget as HTMLImageElement).style.display='none';}}/>
            <span>Vote<span style={{ color:"#6366f1" }}>Generator</span> · YouTube Shorts Production Tool</span>
          </div>
        </div>
        <div style={{ marginLeft:"auto", fontSize:12, color:"#475569", background:"#0f172a", border:"1px solid #1e293b", borderRadius:6, padding:"6px 12px" }}>
          {TEMPLATES.length} templates
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"340px 1fr", minHeight:"calc(100vh - 73px)" }}>

        {/* Left */}
        <div style={{ borderRight:"1px solid #1e293b", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:16, borderBottom:"1px solid #1e293b" }}>
            <input placeholder="Search templates..." value={search} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>setSearch(e.target.value)}
              style={{ width:"100%", background:"#0f172a", border:"1px solid #1e293b", borderRadius:8, padding:"8px 12px", color:"#f1f5f9", fontSize:13, outline:"none", boxSizing:"border-box" as const }}/>
          </div>
          <div style={{ padding:"12px 16px", borderBottom:"1px solid #1e293b", display:"flex", flexWrap:"wrap", gap:6 }}>
            {CATEGORIES.map((cat:string) => {
              const th = cat === "All" ? null : getTheme(cat);
              return (
                <button key={cat} onClick={()=>setCatFilter(cat)} style={{ background:catFilter===cat?(th?th.primary:"#6366f1"):"#0f172a", color:catFilter===cat?"#fff":"#64748b", border:"1px solid "+(catFilter===cat?(th?th.primary:"#6366f1"):"#1e293b"), borderRadius:20, padding:"3px 10px", fontSize:11, cursor:"pointer", fontWeight:600, transition:"all 0.15s" }}>
                  {cat}
                </button>
              );
            })}
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:8 }}>
            {filtered.map((t:Template) => {
              const th = getTheme(t.category);
              return (
                <button key={t.id} onClick={()=>{setSel(t);setGenerated(null);}} style={{ width:"100%", textAlign:"left", background:sel?.id===t.id?"#1e293b":"transparent", border:"1px solid "+(sel?.id===t.id?th.primary:"transparent"), borderRadius:8, padding:"10px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:10, marginBottom:2, transition:"all 0.15s" }}>
                  <div style={{ width:32, height:32, borderRadius:8, flexShrink:0, background:`linear-gradient(135deg,${th.primary}33,${th.primary}66)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>{t.emoji}</div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:sel?.id===t.id?"#f1f5f9":"#94a3b8", lineHeight:1.3 }}>{t.name}</div>
                    <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>{t.category}</div>
                  </div>
                </button>
              );
            })}
          </div>
          {sel && (
            <div style={{ padding:16, borderTop:"1px solid #1e293b" }}>
              <button onClick={generate} disabled={loading} style={{ width:"100%", padding:12, borderRadius:10, background:loading?"#1e293b":"linear-gradient(135deg,#6366f1,#8b5cf6)", color:loading?"#475569":"#fff", border:"none", cursor:loading?"not-allowed":"pointer", fontWeight:800, fontSize:14, transition:"all 0.2s" }}>
                {loading?"Generating...":"⚡ Generate All Assets"}
              </button>
            </div>
          )}
        </div>

        {/* Right */}
        <div style={{ overflowY:"auto", padding:32 }}>
          {!sel && !generated && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:16, color:"#334155" }}>
              <div style={{ fontSize:48 }}>🎬</div>
              <div style={{ fontSize:18, fontWeight:700, color:"#475569" }}>Select a template to get started</div>
              <div style={{ fontSize:14 }}>Pick any of the {TEMPLATES.length} survey templates</div>
            </div>
          )}
          {loading && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:300, gap:16 }}>
              <div style={{ width:40, height:40, border:"3px solid #1e293b", borderTop:"3px solid #6366f1", borderRadius:"50%", animation:"spin 1s linear infinite" }}/>
              <div style={{ color:"#64748b", fontSize:14 }}>Generating your assets...</div>
              <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
            </div>
          )}
          {err && <div style={{ background:"#450a0a", border:"1px solid #7f1d1d", borderRadius:10, padding:16, color:"#fca5a5", marginBottom:24 }}>{err}</div>}

          {generated && sel && (
            <div style={{ display:"flex", flexDirection:"column", gap:32 }}>

              {/* Cards */}
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:"#475569", letterSpacing:"0.08em", textTransform:"uppercase" as const, marginBottom:16 }}>
                  Screenshot Cards · 9:16 · Click to enlarge
                </div>
                <div style={{ background:"#ffffff", borderRadius:20, padding:24, display:"inline-flex", gap:20, flexWrap:"wrap" as const }}>
                  {([
                    { label:"Opening Hook", card:"open" as const },
                    { label:"Why Use It",   card:"features" as const },
                    { label:"Ending CTA",   card:"end" as const },
                    { label:"Related",      card:"related" as const },
                  ]).map(({ label, card }) => (
                    <div key={card} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                      <div style={{ fontSize:11, color:"#64748b", fontWeight:600 }}>{label}</div>
                      <div onClick={()=>setLightbox(card)} style={{ cursor:"zoom-in" }}>
                        {card==='open'     && <OpeningCard  t={sel} g={generated} scale={1}/>}
                        {card==='features' && <FeaturesCard t={sel} g={generated} scale={1}/>}
                        {card==='end'      && <EndingCard   t={sel} g={generated} scale={1}/>}
                        {card==='related'  && <RelatedCard  t={sel} scale={1}/>}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:10, fontSize:12, color:"#475569" }}>
                  💡 White background = easy Canva BG removal · Click to enlarge · Right-click to save
                </div>
              </div>

              {/* Voiceover */}
              <div style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:12, overflow:"hidden" }}>
                <div style={{ padding:"16px 20px", borderBottom:"1px solid #1e293b", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>🎙️ ElevenLabs Voiceover Script</div>
                  <CBtn text={generated.voiceover_script} label="script"/>
                </div>
                <div style={{ padding:20, fontSize:15, lineHeight:1.7, color:"#cbd5e1", whiteSpace:"pre-wrap", fontStyle:"italic" }}>{generated.voiceover_script}</div>
              </div>

              {/* YouTube */}
              <div style={{ background:"#0f172a", border:"1px solid #1e293b", borderRadius:12, overflow:"hidden" }}>
                <Section icon="▶️" title="YouTube Metadata"/>
                <div style={{ padding:20, display:"flex", flexDirection:"column", gap:20 }}>
                  <FieldRow label="Title" text={generated.youtube_title}>
                    <div style={{ fontSize:15, fontWeight:700, color:"#f1f5f9", lineHeight:1.4 }}>{generated.youtube_title}</div>
                    <div style={{ fontSize:11, color:"#334155", marginTop:4 }}>{generated.youtube_title?.length??0}/100 chars</div>
                  </FieldRow>
                  <FieldRow label="URL" text={`https://votegenerator.com/templates/${sel.slug}/`}>
                    <div style={{ fontSize:13, color:"#6366f1", fontFamily:"monospace" }}>https://votegenerator.com/templates/{sel.slug}/</div>
                  </FieldRow>
                  <FieldRow label="Description" text={generated.youtube_description}>
                    <div style={{ fontSize:13, color:"#94a3b8", lineHeight:1.7, whiteSpace:"pre-wrap" }}>{generated.youtube_description}</div>
                  </FieldRow>
                  <FieldRow label="Tags" text={generated.youtube_tags?.map((t:string)=>`#${t}`).join(" ")??""}>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {generated.youtube_tags?.map((tag:string,i:number)=>(
                        <span key={i} style={{ background:"#1e293b", border:"1px solid #334155", borderRadius:4, padding:"3px 8px", fontSize:12, color:"#64748b" }}>#{tag}</span>
                      ))}
                    </div>
                  </FieldRow>
                </div>
              </div>

              {/* Pinterest */}
              <div style={{ background:"#0f172a", border:"1px solid #e7343433", borderRadius:12, overflow:"hidden" }}>
                <Section icon="📌" title="Pinterest"/>
                <div style={{ padding:20, display:"flex", flexDirection:"column", gap:20 }}>
                  <FieldRow label="Pin Title" text={generated.pinterest_title}>
                    <div style={{ fontSize:15, fontWeight:700, color:"#f1f5f9", lineHeight:1.4 }}>{generated.pinterest_title}</div>
                  </FieldRow>
                  <FieldRow label="Pin Description" text={generated.pinterest_description}>
                    <div style={{ fontSize:13, color:"#94a3b8", lineHeight:1.7 }}>{generated.pinterest_description}</div>
                  </FieldRow>
                  <FieldRow label="Visitor URL" text={`https://votegenerator.com/templates/${sel.slug}/`}>
                    <div style={{ fontSize:13, color:"#e7345a", fontFamily:"monospace" }}>https://votegenerator.com/templates/{sel.slug}/</div>
                  </FieldRow>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:"#475569", letterSpacing:"0.06em", textTransform:"uppercase" as const, marginBottom:8 }}>Suggested Board</div>
                    <div style={{ fontSize:13, color:"#94a3b8", fontStyle:"italic" }}>📋 {getTheme(sel.category).board}</div>
                  </div>
                  <FieldRow label="Tags" text={generated.pinterest_tags?.map((t:string)=>`#${t}`).join(" ")??""}>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {generated.pinterest_tags?.map((tag:string,i:number)=>(
                        <span key={i} style={{ background:"#2d0a10", border:"1px solid #e7343433", borderRadius:4, padding:"3px 8px", fontSize:12, color:"#e7345a" }}>#{tag}</span>
                      ))}
                    </div>
                  </FieldRow>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}