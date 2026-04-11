import React, { useState, useRef } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

interface Template {
  id: string;
  name: string;
  category: string;
  slug: string;
  color: string;
  colorDark: string;
  emoji: string;
  pattern: string;
}

interface Generated {
  youtube_title: string;
  youtube_description: string;
  youtube_tags: string[];
  opening_hook: string;
  opening_subtext: string;
  ending_headline: string;
  voiceover_script: string;
  pinterest_title: string;
  pinterest_description: string;
  pinterest_tags: string[];
  features: string[];
}

interface CopyState {
  [key: string]: boolean;
}

// ── Pinterest board mapping ────────────────────────────────────────────────

const BOARD_MAP: Record<string, string> = {
  'HR & Culture': 'HR Tools & Employee Surveys',
  'Customer Feedback': 'Customer Experience',
  'Product & Tech': 'Business Tools for...',
  'Events': 'Free Business & Team...',
  'Education': 'Free Business & Team...',
  'Healthcare': 'Business Tools for...',
  'Marketing': 'Business Tools for...',
  'Membership': 'Online Poll Tools &...',
  'Procurement': 'Business Tools for...',
  'Community': 'Free Business & Team...',
  'Civic': 'Free Business & Team...',
  'Hospitality': 'Business Tools for...',
  'Property': 'Business Tools for...',
};

// ── Template data ──────────────────────────────────────────────────────────

const TEMPLATES: Template[] = [
  { id: "employee-engagement-survey", name: "Employee Engagement Survey", category: "HR & Culture", slug: "employee-engagement-survey", color: "#10b981", colorDark: "#064e3b", emoji: "👥", pattern: "grid" },
  { id: "employee-satisfaction-survey", name: "Employee Satisfaction Survey", category: "HR & Culture", slug: "employee-satisfaction-survey", color: "#34d399", colorDark: "#065f46", emoji: "😊", pattern: "dots" },
  { id: "exit-interview-survey", name: "Exit Interview Survey", category: "HR & Culture", slug: "exit-interview-survey", color: "#94a3b8", colorDark: "#0f172a", emoji: "🚪", pattern: "lines" },
  { id: "weekly-pulse-survey", name: "Weekly Pulse Survey", category: "HR & Culture", slug: "weekly-pulse-survey", color: "#f43f5e", colorDark: "#4c0519", emoji: "💓", pattern: "dots" },
  { id: "job-satisfaction-survey", name: "Job Satisfaction Survey", category: "HR & Culture", slug: "job-satisfaction-survey", color: "#fbbf24", colorDark: "#451a03", emoji: "⚡", pattern: "grid" },
  { id: "360-feedback-survey", name: "360 Degree Feedback Survey", category: "HR & Culture", slug: "360-feedback-survey", color: "#a78bfa", colorDark: "#2e1065", emoji: "🔄", pattern: "circle" },
  { id: "diversity-inclusion-survey", name: "Diversity & Inclusion Survey", category: "HR & Culture", slug: "diversity-inclusion-survey", color: "#e879f9", colorDark: "#3b0764", emoji: "🤝", pattern: "dots" },
  { id: "employee-wellbeing-survey", name: "Employee Wellbeing Survey", category: "HR & Culture", slug: "employee-wellbeing-survey", color: "#4ade80", colorDark: "#052e16", emoji: "🌱", pattern: "waves" },
  { id: "remote-work-survey", name: "Remote Work Survey", category: "HR & Culture", slug: "remote-work-survey", color: "#2dd4bf", colorDark: "#042f2e", emoji: "🏠", pattern: "grid" },
  { id: "internship-feedback-survey", name: "Internship Feedback Survey", category: "HR & Culture", slug: "internship-feedback-survey", color: "#818cf8", colorDark: "#1e1b4b", emoji: "🌟", pattern: "dots" },
  { id: "employee-recognition-survey", name: "Employee Recognition Survey", category: "HR & Culture", slug: "employee-recognition-survey", color: "#fde047", colorDark: "#422006", emoji: "🏆", pattern: "lines" },
  { id: "employee-benefits-survey", name: "Employee Benefits Survey", category: "HR & Culture", slug: "employee-benefits-survey", color: "#38bdf8", colorDark: "#082f49", emoji: "🎁", pattern: "grid" },
  { id: "canteen-food-service-survey", name: "Canteen & Food Service Survey", category: "HR & Culture", slug: "canteen-food-service-survey", color: "#fb923c", colorDark: "#431407", emoji: "🍽️", pattern: "dots" },
  { id: "employee-mental-health-survey", name: "Employee Mental Health Survey", category: "HR & Culture", slug: "employee-mental-health-survey", color: "#22d3ee", colorDark: "#083344", emoji: "🧠", pattern: "waves" },
  { id: "candidate-experience-survey", name: "Candidate Experience Survey", category: "HR & Culture", slug: "candidate-experience-survey", color: "#60a5fa", colorDark: "#1e3a5f", emoji: "💼", pattern: "grid" },
  { id: "team-building-survey", name: "Team Building Survey", category: "HR & Culture", slug: "team-building-survey", color: "#6ee7b7", colorDark: "#022c22", emoji: "🎯", pattern: "dots" },
  { id: "new-hire-30-60-90-survey", name: "New Hire 30-60-90 Day Survey", category: "HR & Culture", slug: "new-hire-30-60-90-survey", color: "#818cf8", colorDark: "#1e1b4b", emoji: "📅", pattern: "lines" },
  { id: "customer-satisfaction-survey", name: "Customer Satisfaction (CSAT)", category: "Customer Feedback", slug: "customer-satisfaction-survey", color: "#fbbf24", colorDark: "#451a03", emoji: "⭐", pattern: "dots" },
  { id: "nps-survey", name: "NPS Survey", category: "Customer Feedback", slug: "nps-survey", color: "#60a5fa", colorDark: "#1e3a5f", emoji: "📊", pattern: "grid" },
  { id: "restaurant-feedback-survey", name: "Restaurant Feedback Survey", category: "Customer Feedback", slug: "restaurant-feedback-survey", color: "#fb923c", colorDark: "#431407", emoji: "🍽️", pattern: "dots" },
  { id: "customer-churn-survey", name: "Customer Churn Survey", category: "Customer Feedback", slug: "customer-churn-survey", color: "#f87171", colorDark: "#450a0a", emoji: "📉", pattern: "lines" },
  { id: "food-delivery-survey", name: "Food Delivery Survey", category: "Customer Feedback", slug: "food-delivery-survey", color: "#fdba74", colorDark: "#431407", emoji: "🛵", pattern: "dots" },
  { id: "gym-fitness-class-survey", name: "Gym & Fitness Class Survey", category: "Customer Feedback", slug: "gym-fitness-class-survey", color: "#c084fc", colorDark: "#3b0764", emoji: "🏋️", pattern: "grid" },
  { id: "subscription-service-survey", name: "Subscription Service Survey", category: "Customer Feedback", slug: "subscription-service-survey", color: "#a78bfa", colorDark: "#2e1065", emoji: "🔁", pattern: "circle" },
  { id: "client-satisfaction-survey", name: "Client Satisfaction Survey", category: "Customer Feedback", slug: "client-satisfaction-survey", color: "#d97706", colorDark: "#1c1003", emoji: "🤝", pattern: "dots" },
  { id: "personal-trainer-feedback-survey", name: "Personal Trainer Feedback Survey", category: "Customer Feedback", slug: "personal-trainer-feedback-survey", color: "#fb923c", colorDark: "#431407", emoji: "💪", pattern: "grid" },
  { id: "spa-wellness-feedback", name: "Spa & Wellness Feedback Survey", category: "Customer Feedback", slug: "spa-wellness-feedback", color: "#86efac", colorDark: "#052e16", emoji: "🌿", pattern: "waves" },
  { id: "retail-customer-survey", name: "Retail Customer Survey", category: "Customer Feedback", slug: "retail-customer-survey", color: "#f472b6", colorDark: "#500724", emoji: "🛍️", pattern: "dots" },
  { id: "real-estate-agent-survey", name: "Real Estate Agent Feedback", category: "Customer Feedback", slug: "real-estate-agent-survey", color: "#fcd34d", colorDark: "#1c0a03", emoji: "🏡", pattern: "lines" },
  { id: "insurance-satisfaction-survey", name: "Insurance Satisfaction Survey", category: "Customer Feedback", slug: "insurance-satisfaction-survey", color: "#7dd3fc", colorDark: "#082f49", emoji: "🛡️", pattern: "grid" },
  { id: "sales-feedback-survey", name: "Sales Process Feedback Survey", category: "Customer Feedback", slug: "sales-feedback-survey", color: "#fbbf24", colorDark: "#451a03", emoji: "📊", pattern: "dots" },
  { id: "coworking-space-survey", name: "Coworking Space Survey", category: "Customer Feedback", slug: "coworking-space-survey", color: "#818cf8", colorDark: "#1e1b4b", emoji: "🏢", pattern: "grid" },
  { id: "course-evaluation-survey", name: "Course Evaluation Survey", category: "Education", slug: "course-evaluation-survey", color: "#60a5fa", colorDark: "#1e3a5f", emoji: "📋", pattern: "grid" },
  { id: "training-feedback-survey", name: "Training Feedback Survey", category: "Education", slug: "training-feedback-survey", color: "#22d3ee", colorDark: "#083344", emoji: "📚", pattern: "dots" },
  { id: "student-satisfaction-survey", name: "Student Satisfaction Survey", category: "Education", slug: "student-satisfaction-survey", color: "#818cf8", colorDark: "#1e1b4b", emoji: "🎒", pattern: "lines" },
  { id: "school-satisfaction-survey", name: "School Satisfaction Survey", category: "Education", slug: "school-satisfaction-survey", color: "#38bdf8", colorDark: "#082f49", emoji: "🏫", pattern: "grid" },
  { id: "alumni-survey", name: "Alumni Survey", category: "Education", slug: "alumni-survey", color: "#fcd34d", colorDark: "#1c0a03", emoji: "🎓", pattern: "circle" },
  { id: "school-parent-survey", name: "School Parent Survey", category: "Education", slug: "school-parent-survey", color: "#34d399", colorDark: "#064e3b", emoji: "👨‍👩‍👧", pattern: "dots" },
  { id: "childcare-parent-survey", name: "Childcare Parent Survey", category: "Education", slug: "childcare-parent-survey", color: "#7dd3fc", colorDark: "#082f49", emoji: "👶", pattern: "waves" },
  { id: "online-course-feedback-survey", name: "Online Course Feedback Survey", category: "Education", slug: "online-course-feedback-survey", color: "#a3e635", colorDark: "#1a2e05", emoji: "💻", pattern: "grid" },
  { id: "event-feedback-survey", name: "Event Feedback Survey", category: "Events", slug: "event-feedback-survey", color: "#fb7185", colorDark: "#4c0519", emoji: "🎉", pattern: "dots" },
  { id: "conference-feedback-survey", name: "Conference Feedback Survey", category: "Events", slug: "conference-feedback-survey", color: "#94a3b8", colorDark: "#0f172a", emoji: "🏛️", pattern: "grid" },
  { id: "speaker-evaluation-survey", name: "Speaker Evaluation Survey", category: "Events", slug: "speaker-evaluation-survey", color: "#818cf8", colorDark: "#1e1b4b", emoji: "🎤", pattern: "lines" },
  { id: "meeting-feedback-survey", name: "Meeting Feedback Survey", category: "Events", slug: "meeting-feedback-survey", color: "#22d3ee", colorDark: "#083344", emoji: "📅", pattern: "dots" },
  { id: "product-feedback-survey", name: "Product Feedback Survey", category: "Product & Tech", slug: "product-feedback-survey", color: "#c084fc", colorDark: "#3b0764", emoji: "📦", pattern: "grid" },
  { id: "product-market-fit-survey", name: "Product Market Fit Survey", category: "Product & Tech", slug: "product-market-fit-survey", color: "#a78bfa", colorDark: "#2e1065", emoji: "🎯", pattern: "circle" },
  { id: "website-feedback-survey", name: "Website Feedback Survey", category: "Product & Tech", slug: "website-feedback-survey", color: "#60a5fa", colorDark: "#1e3a5f", emoji: "🌐", pattern: "dots" },
  { id: "app-usability-survey", name: "App Usability Survey", category: "Product & Tech", slug: "app-usability-survey", color: "#e879f9", colorDark: "#3b0764", emoji: "📱", pattern: "grid" },
  { id: "software-onboarding-survey", name: "Software Onboarding Survey", category: "Product & Tech", slug: "software-onboarding-survey", color: "#22d3ee", colorDark: "#083344", emoji: "🚀", pattern: "lines" },
  { id: "it-support-survey", name: "IT Support Satisfaction Survey", category: "Product & Tech", slug: "it-support-survey", color: "#94a3b8", colorDark: "#0f172a", emoji: "💻", pattern: "dots" },
  { id: "market-research-survey", name: "Market Research Survey", category: "Product & Tech", slug: "market-research-survey", color: "#2dd4bf", colorDark: "#042f2e", emoji: "🔍", pattern: "grid" },
  { id: "patient-satisfaction-survey", name: "Patient Satisfaction Survey", category: "Healthcare", slug: "patient-satisfaction-survey", color: "#38bdf8", colorDark: "#082f49", emoji: "🏥", pattern: "cross" },
  { id: "dental-satisfaction-survey", name: "Dental Patient Satisfaction", category: "Healthcare", slug: "dental-satisfaction-survey", color: "#7dd3fc", colorDark: "#082f49", emoji: "🦷", pattern: "dots" },
  { id: "patient-discharge-survey", name: "Patient Discharge Survey", category: "Healthcare", slug: "patient-discharge-survey", color: "#34d399", colorDark: "#064e3b", emoji: "📋", pattern: "grid" },
  { id: "hotel-guest-satisfaction-survey", name: "Hotel Guest Satisfaction Survey", category: "Hospitality", slug: "hotel-guest-satisfaction-survey", color: "#fcd34d", colorDark: "#1c0a03", emoji: "🏨", pattern: "waves" },
  { id: "tenant-satisfaction-survey", name: "Tenant Satisfaction Survey", category: "Property", slug: "tenant-satisfaction-survey", color: "#4ade80", colorDark: "#052e16", emoji: "🏠", pattern: "grid" },
  { id: "vacation-rental-guest-survey", name: "Vacation Rental Guest Survey", category: "Property", slug: "vacation-rental-guest-survey", color: "#2dd4bf", colorDark: "#042f2e", emoji: "🏡", pattern: "dots" },
  { id: "hoa-resident-survey", name: "HOA Resident Survey", category: "Property", slug: "hoa-resident-survey", color: "#86efac", colorDark: "#052e16", emoji: "🏘️", pattern: "lines" },
  { id: "student-housing-survey", name: "Student Housing Survey", category: "Property", slug: "student-housing-survey", color: "#60a5fa", colorDark: "#1e3a5f", emoji: "🎓", pattern: "grid" },
  { id: "brand-awareness-survey", name: "Brand Awareness Survey", category: "Marketing", slug: "brand-awareness-survey", color: "#fb7185", colorDark: "#4c0519", emoji: "🎯", pattern: "dots" },
  { id: "membership-satisfaction-survey", name: "Membership Satisfaction Survey", category: "Membership", slug: "membership-satisfaction-survey", color: "#818cf8", colorDark: "#1e1b4b", emoji: "🏅", pattern: "circle" },
  { id: "podcast-content-survey", name: "Podcast Content Survey", category: "Membership", slug: "podcast-content-survey", color: "#c084fc", colorDark: "#3b0764", emoji: "🎙️", pattern: "waves" },
  { id: "vendor-evaluation-survey", name: "Vendor Evaluation Survey", category: "Procurement", slug: "vendor-evaluation-survey", color: "#94a3b8", colorDark: "#0f172a", emoji: "📋", pattern: "grid" },
  { id: "volunteer-feedback-survey", name: "Volunteer Feedback Survey", category: "Community", slug: "volunteer-feedback-survey", color: "#34d399", colorDark: "#064e3b", emoji: "🤝", pattern: "dots" },
  { id: "community-satisfaction-survey", name: "Community Satisfaction Survey", category: "Community", slug: "community-satisfaction-survey", color: "#a78bfa", colorDark: "#2e1065", emoji: "🏘️", pattern: "grid" },
  { id: "nonprofit-impact-survey", name: "Nonprofit Impact Survey", category: "Community", slug: "nonprofit-impact-survey", color: "#fb923c", colorDark: "#431407", emoji: "❤️", pattern: "lines" },
  { id: "museum-visitor-survey", name: "Museum Visitor Survey", category: "Civic", slug: "museum-visitor-survey", color: "#d6d3d1", colorDark: "#1c1917", emoji: "🏛️", pattern: "dots" },
];

const CATEGORIES: string[] = ["All", ...Array.from(new Set(TEMPLATES.map((t: Template) => t.category)))];

// ── Pattern SVGs ───────────────────────────────────────────────────────────

function PatternBg({ pattern }: { pattern: string }): React.ReactElement {
  if (pattern === 'dots') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }}>
      <defs><pattern id="pd" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.5" fill="white" />
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#pd)" />
    </svg>
  );
  if (pattern === 'grid') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}>
      <defs><pattern id="pg" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.6" />
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#pg)" />
    </svg>
  );
  if (pattern === 'lines') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}>
      <defs><pattern id="pl" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="24" y2="24" stroke="white" strokeWidth="0.5" />
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#pl)" />
    </svg>
  );
  if (pattern === 'waves') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }} viewBox="0 0 270 480" preserveAspectRatio="none">
      {[100, 160, 220, 280, 340].map((y: number, i: number) => (
        <path key={i} d={`M0,${y} Q67,${y-30} 135,${y} T270,${y}`} fill="none" stroke="white" strokeWidth="1.2" />
      ))}
    </svg>
  );
  if (pattern === 'circle') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }}>
      <defs><pattern id="pc" x="0" y="0" width="44" height="44" patternUnits="userSpaceOnUse">
        <circle cx="22" cy="22" r="16" fill="none" stroke="white" strokeWidth="0.6" />
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#pc)" />
    </svg>
  );
  if (pattern === 'cross') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}>
      <defs><pattern id="pcc" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
        <line x1="15" y1="5" x2="15" y2="25" stroke="white" strokeWidth="0.7" />
        <line x1="5" y1="15" x2="25" y2="15" stroke="white" strokeWidth="0.7" />
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#pcc)" />
    </svg>
  );
  return <></>;
}

// ── Logo Bar ───────────────────────────────────────────────────────────────

function LogoBar({ scale, color }: { scale: number; color: string }): React.ReactElement {
  return (
    <div style={{ padding: `${18*scale}px ${20*scale}px 0`, display: "flex", alignItems: "center", gap: 7*scale, position: "relative", zIndex: 2 }}>
      <img
        src="/logo.svg"
        alt=""
        style={{ width: 16*scale, height: 16*scale, borderRadius: 4*scale, objectFit: "contain" }}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
      />
      <div style={{ fontSize: 9*scale, fontWeight: 800, color: "rgba(255,255,255,0.6)", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "system-ui" }}>
        Vote<span style={{ color: color }}>Generator</span>
      </div>
    </div>
  );
}

// ── Card Components ────────────────────────────────────────────────────────

function OpeningCard({ t, g, scale = 1 }: { t: Template; g: Generated; scale?: number }): React.ReactElement {
  const w = Math.round(270 * scale);
  const h = Math.round(480 * scale);
  return (
    <div style={{
      width: w, height: h, borderRadius: 18*scale, overflow: "hidden", position: "relative", flexShrink: 0,
      background: `linear-gradient(145deg, ${t.colorDark} 0%, ${t.color}44 50%, ${t.colorDark} 100%)`,
      border: `${scale}px solid ${t.color}55`,
      boxShadow: `0 0 ${40*scale}px ${t.color}33, inset 0 1px 0 rgba(255,255,255,0.1)`
    }}>
      {/* Bold solid colour stripe on left edge */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4*scale, background: t.color, zIndex: 3 }} />
      {/* Giant faded emoji background */}
      <div style={{ position: "absolute", right: -10*scale, bottom: -10*scale, fontSize: 160*scale, opacity: 0.12, lineHeight: 1, zIndex: 1, userSelect: "none", pointerEvents: "none" }}>
        {t.emoji}
      </div>
      <PatternBg pattern={t.pattern} />
      <LogoBar scale={scale} color={t.color} />
      {/* Content */}
      <div style={{ position: "absolute", top: "28%", left: 0, right: 0, padding: `0 ${24*scale}px`, zIndex: 2 }}>
        {/* Category pill */}
        <div style={{
          display: "inline-flex", alignItems: "center",
          background: t.color + "25",
          border: `1px solid ${t.color}60`,
          borderRadius: 20*scale, padding: `${4*scale}px ${12*scale}px`, marginBottom: 16*scale
        }}>
          <span style={{ fontSize: 9*scale, fontWeight: 900, color: t.color, letterSpacing: "0.12em", textTransform: "uppercase" }}>{t.category}</span>
        </div>
        <div style={{
          fontSize: 29*scale, fontWeight: 900, lineHeight: 1.05, color: "#ffffff",
          letterSpacing: "-0.03em", marginBottom: 14*scale,
          textShadow: `0 2px 20px rgba(0,0,0,0.6), 0 0 40px ${t.color}44`
        }}>
          {g.opening_hook}
        </div>
        <div style={{ fontSize: 13*scale, fontWeight: 500, color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>
          {g.opening_subtext}
        </div>
      </div>
      {/* Bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: `${14*scale}px ${24*scale}px ${18*scale}px`, background: `linear-gradient(to top, ${t.colorDark}ee 0%, transparent 100%)`, zIndex: 2 }}>
        <div style={{ fontSize: 9*scale, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Free · No Signup Required</div>
      </div>
    </div>
  );
}

function FeaturesCard({ t, g, scale = 1 }: { t: Template; g: Generated; scale?: number }): React.ReactElement {
  const w = Math.round(270 * scale);
  const h = Math.round(480 * scale);
  return (
    <div style={{
      width: w, height: h, borderRadius: 18*scale, overflow: "hidden", position: "relative", flexShrink: 0,
      background: `linear-gradient(155deg, ${t.colorDark} 0%, #0d0d1a 45%, ${t.color}22 100%)`,
      border: `${scale}px solid ${t.color}44`,
      boxShadow: `0 0 ${40*scale}px ${t.color}22, inset 0 1px 0 rgba(255,255,255,0.08)`
    }}>
      {/* Top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3*scale, background: `linear-gradient(90deg, transparent, ${t.color}, transparent)`, zIndex: 3 }} />
      {/* Giant faded emoji */}
      <div style={{ position: "absolute", right: -15*scale, top: 20*scale, fontSize: 130*scale, opacity: 0.07, lineHeight: 1, zIndex: 1, userSelect: "none", pointerEvents: "none" }}>
        {t.emoji}
      </div>
      <PatternBg pattern={t.pattern} />
      <LogoBar scale={scale} color={t.color} />
      <div style={{ padding: `${14*scale}px ${22*scale}px`, position: "relative", zIndex: 2 }}>
        <div style={{ fontSize: 11*scale, fontWeight: 900, color: t.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18*scale }}>
          Why Teams Love It
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14*scale }}>
          {(g.features || []).map((f: string, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12*scale }}>
              <div style={{
                width: 24*scale, height: 24*scale, borderRadius: 7*scale, flexShrink: 0,
                background: t.color + "20", border: `1px solid ${t.color}50`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11*scale, fontWeight: 900, color: t.color
              }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 12.5*scale, color: "rgba(255,255,255,0.82)", lineHeight: 1.5, fontWeight: 500, paddingTop: 2*scale }}>{f}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom URL */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: `${14*scale}px ${22*scale}px ${18*scale}px`, background: `linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)`, zIndex: 2 }}>
        <div style={{
          background: t.color + "18", border: `1px solid ${t.color}40`,
          borderRadius: 8*scale, padding: `${7*scale}px ${12*scale}px`,
          fontSize: 11*scale, fontWeight: 800, color: t.color
        }}>
          votegenerator.com
        </div>
      </div>
    </div>
  );
}

function EndingCard({ t, g, scale = 1 }: { t: Template; g: Generated; scale?: number }): React.ReactElement {
  const w = Math.round(270 * scale);
  const h = Math.round(480 * scale);
  return (
    <div style={{
      width: w, height: h, borderRadius: 18*scale, overflow: "hidden", position: "relative", flexShrink: 0,
      background: `radial-gradient(ellipse at 50% 80%, ${t.color}33 0%, #080b14 55%)`,
      border: `${scale}px solid ${t.color}33`,
      boxShadow: `0 0 ${60*scale}px ${t.color}22, inset 0 1px 0 rgba(255,255,255,0.08)`
    }}>
      {/* Big glow bottom */}
      <div style={{ position: "absolute", bottom: -40*scale, left: "50%", transform: "translateX(-50%)", width: 220*scale, height: 220*scale, borderRadius: "50%", background: t.color + "30", filter: `blur(${55*scale}px)`, pointerEvents: "none", zIndex: 1 }} />
      {/* Giant faded emoji */}
      <div style={{ position: "absolute", right: -5*scale, bottom: 60*scale, fontSize: 140*scale, opacity: 0.1, lineHeight: 1, zIndex: 1, userSelect: "none", pointerEvents: "none" }}>
        {t.emoji}
      </div>
      <PatternBg pattern={t.pattern} />
      <LogoBar scale={scale} color={t.color} />
      {/* Content */}
      <div style={{ position: "absolute", top: "22%", left: 0, right: 0, padding: `0 ${24*scale}px`, zIndex: 2 }}>
        {/* Emoji badge */}
        <div style={{
          width: 56*scale, height: 56*scale, borderRadius: 16*scale,
          background: `linear-gradient(135deg, ${t.color}ee, ${t.color}88)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28*scale, marginBottom: 24*scale,
          boxShadow: `0 8px 30px ${t.color}55`
        }}>
          {t.emoji}
        </div>
        <div style={{
          fontSize: 27*scale, fontWeight: 900, lineHeight: 1.08, color: "#ffffff",
          letterSpacing: "-0.03em", marginBottom: 22*scale,
          textShadow: `0 2px 20px rgba(0,0,0,0.5), 0 0 40px ${t.color}33`
        }}>
          {g.ending_headline}
        </div>
        <div style={{
          display: "inline-block",
          background: `linear-gradient(135deg, ${t.color}25, ${t.color}15)`,
          border: `1.5px solid ${t.color}70`,
          borderRadius: 10*scale, padding: `${9*scale}px ${16*scale}px`,
          fontSize: 14*scale, fontWeight: 800, color: t.color,
          boxShadow: `0 4px 16px ${t.color}22`
        }}>
          votegenerator.com
        </div>
      </div>
      {/* Bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: `${14*scale}px ${24*scale}px ${18*scale}px`, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)", zIndex: 2 }}>
        <div style={{ fontSize: 9*scale, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Free Survey Tool · 50,000+ Teams
        </div>
      </div>
    </div>
  );
}

// ── Lightbox ───────────────────────────────────────────────────────────────

function Lightbox({ card, t, g, onClose }: { card: 'open' | 'end' | 'features' | null; t: Template | null; g: Generated | null; onClose: () => void }): React.ReactElement {
  if (!card || !t || !g) return <></>;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.94)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
      <div onClick={(e: React.MouseEvent) => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>Click outside to close · Right-click card → Save image</div>
        {card === 'open' && <OpeningCard t={t} g={g} scale={1.65} />}
        {card === 'features' && <FeaturesCard t={t} g={g} scale={1.65} />}
        {card === 'end' && <EndingCard t={t} g={g} scale={1.65} />}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function ShortsStudio(): React.ReactElement {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [generated, setGenerated] = useState<Generated | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<CopyState>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [lightboxCard, setLightboxCard] = useState<'open' | 'end' | 'features' | null>(null);

  const filteredTemplates: Template[] = TEMPLATES.filter((t: Template) => {
    const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;
    const matchesSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const generate = async (): Promise<void> => {
    if (!selectedTemplate) return;
    setLoading(true);
    setError(null);
    setGenerated(null);

    const prompt = `You are a YouTube Shorts and Pinterest content strategist for VoteGenerator.com — a free, no-signup survey and poll tool used by HR managers, team leads, and small business owners.

Generate complete production assets for this survey template:
- Template Name: ${selectedTemplate.name}
- Category: ${selectedTemplate.category}
- URL: https://votegenerator.com/templates/${selectedTemplate.slug}/

Return ONLY valid JSON (no markdown, no backticks) with this exact structure:
{
  "youtube_title": "Start with How to Create a Free [name] or similar. 60 chars max. Keyword-rich.",
  "youtube_description": "150-200 words. Hook first line. Describe use case. Include URL. End with 3-5 hashtags.",
  "youtube_tags": ["tag1","tag2","tag3","tag4","tag5","tag6","tag7","tag8"],
  "opening_hook": "8-12 words MAX. Sharp pain point question. This is BIG TEXT. End with ?",
  "opening_subtext": "4-6 words. Softer supporting line.",
  "ending_headline": "6-8 words. Action CTA. Big bold text.",
  "voiceover_script": "30-45 second ElevenLabs script. No stage directions. Short punchy sentences. Hook then Problem then Solution then Features then CTA.",
  "features": ["Feature 1 one short sentence","Feature 2 one short sentence","Feature 3 one short sentence","Feature 4 one short sentence"],
  "pinterest_title": "60 chars max. Include Free and the survey type.",
  "pinterest_description": "150-200 chars. Clear value prop. What problem it solves. Include URL.",
  "pinterest_tags": ["tag1","tag2","tag3","tag4","tag5"]
}`;

    try {
      const response = await fetch("/.netlify/functions/vg-claude-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1200,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await response.json();
      const text: string = data.content[0].text.trim().replace(/```json|```/g, "").trim();
      const parsed: Generated = JSON.parse(text);
      setGenerated(parsed);
    } catch (e) {
      setError("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, key: string): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setCopied((prev: CopyState) => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied((prev: CopyState) => ({ ...prev, [key]: false })), 2000);
  };

  const CopyBtn = ({ text, label }: { text: string; label: string }): React.ReactElement => (
    <button
      onClick={() => copyToClipboard(text, label)}
      style={{
        background: copied[label] ? "#10b981" : "#1e293b",
        color: copied[label] ? "#fff" : "#94a3b8",
        border: "1px solid " + (copied[label] ? "#10b981" : "#334155"),
        borderRadius: "6px", padding: "4px 12px", fontSize: "12px",
        cursor: "pointer", transition: "all 0.2s", fontWeight: 600, flexShrink: 0
      }}
    >
      {copied[label] ? "✓ Copied" : "Copy"}
    </button>
  );

  const SectionHeader = ({ icon, title }: { icon: string; title: string }): React.ReactElement => (
    <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ fontSize: "16px" }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: "14px" }}>{title}</div>
    </div>
  );

  const FieldLabel = ({ label }: { label: string }): React.ReactElement => (
    <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>{label}</div>
  );

  return (
    <div style={{ background: "#090e1a", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#f1f5f9" }}>
      <Lightbox card={lightboxCard} t={selectedTemplate} g={generated} onClose={() => setLightboxCard(null)} />

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e293b", padding: "18px 32px", display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🎬</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "17px", letterSpacing: "-0.02em" }}>Shorts Studio</div>
          <div style={{ fontSize: "12px", color: "#475569", display: "flex", alignItems: "center", gap: 6 }}>
            <img src="/logo.svg" alt="" style={{ width: 14, height: 14 }} onError={(e: React.SyntheticEvent<HTMLImageElement>) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
            Vote<span style={{ color: "#6366f1" }}>Generator</span> · YouTube Shorts Production Tool
          </div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: "12px", color: "#475569", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "6px", padding: "6px 12px" }}>
          {TEMPLATES.length} templates
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", minHeight: "calc(100vh - 73px)" }}>

        {/* Left */}
        <div style={{ borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px", borderBottom: "1px solid #1e293b" }}>
            <input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              style={{ width: "100%", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "8px 12px", color: "#f1f5f9", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b", display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {CATEGORIES.map((cat: string) => (
              <button key={cat} onClick={() => setCategoryFilter(cat)} style={{
                background: categoryFilter === cat ? "#6366f1" : "#0f172a",
                color: categoryFilter === cat ? "#fff" : "#64748b",
                border: "1px solid " + (categoryFilter === cat ? "#6366f1" : "#1e293b"),
                borderRadius: "20px", padding: "3px 10px", fontSize: "11px", cursor: "pointer", fontWeight: 600
              }}>{cat}</button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {filteredTemplates.map((t: Template) => (
              <button key={t.id} onClick={() => { setSelectedTemplate(t); setGenerated(null); }} style={{
                width: "100%", textAlign: "left",
                background: selectedTemplate?.id === t.id ? "#1e293b" : "transparent",
                border: "1px solid " + (selectedTemplate?.id === t.id ? "#6366f1" : "transparent"),
                borderRadius: "8px", padding: "10px 12px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "10px", marginBottom: "2px", transition: "all 0.15s"
              }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0, background: `linear-gradient(135deg, ${t.color}33, ${t.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>
                  {t.emoji}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: selectedTemplate?.id === t.id ? "#f1f5f9" : "#94a3b8", lineHeight: 1.3 }}>{t.name}</div>
                  <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>{t.category}</div>
                </div>
              </button>
            ))}
          </div>
          {selectedTemplate && (
            <div style={{ padding: "16px", borderTop: "1px solid #1e293b" }}>
              <button onClick={generate} disabled={loading} style={{
                width: "100%", padding: "12px", borderRadius: "10px",
                background: loading ? "#1e293b" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: loading ? "#475569" : "#fff", border: "none",
                cursor: loading ? "not-allowed" : "pointer", fontWeight: 800, fontSize: "14px", transition: "all 0.2s"
              }}>
                {loading ? "Generating..." : "⚡ Generate All Assets"}
              </button>
            </div>
          )}
        </div>

        {/* Right */}
        <div style={{ overflowY: "auto", padding: "32px" }}>
          {!selectedTemplate && !generated && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "16px", color: "#334155" }}>
              <div style={{ fontSize: "48px" }}>🎬</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#475569" }}>Select a template to get started</div>
              <div style={{ fontSize: "14px" }}>Pick any of the {TEMPLATES.length} survey templates</div>
            </div>
          )}

          {loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "300px", gap: "16px" }}>
              <div style={{ width: "40px", height: "40px", border: "3px solid #1e293b", borderTop: "3px solid #6366f1", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              <div style={{ color: "#64748b", fontSize: "14px" }}>Generating your assets...</div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {error && (
            <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", borderRadius: "10px", padding: "16px", color: "#fca5a5", marginBottom: "24px" }}>{error}</div>
          )}

          {generated && selectedTemplate && (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

              {/* Cards */}
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>
                  Screenshot Cards · 9:16 · Click to enlarge
                </div>
                <div style={{ background: "#ffffff", borderRadius: "20px", padding: "24px", display: "inline-flex", gap: "24px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>Opening Hook</div>
                    <div onClick={() => setLightboxCard('open')} style={{ cursor: "zoom-in" }}>
                      <OpeningCard t={selectedTemplate} g={generated} scale={1} />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>Why Use It</div>
                    <div onClick={() => setLightboxCard('features')} style={{ cursor: "zoom-in" }}>
                      <FeaturesCard t={selectedTemplate} g={generated} scale={1} />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>Ending CTA</div>
                    <div onClick={() => setLightboxCard('end')} style={{ cursor: "zoom-in" }}>
                      <EndingCard t={selectedTemplate} g={generated} scale={1} />
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: "10px", fontSize: "12px", color: "#475569" }}>
                  💡 White background = easy Canva background removal · Click to enlarge · Right-click to save
                </div>
              </div>

              {/* Voiceover */}
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 700, fontSize: "14px" }}>🎙️ ElevenLabs Voiceover Script</div>
                  <CopyBtn text={generated.voiceover_script} label="script" />
                </div>
                <div style={{ padding: "20px", fontSize: "15px", lineHeight: 1.7, color: "#cbd5e1", whiteSpace: "pre-wrap", fontStyle: "italic" }}>
                  {generated.voiceover_script}
                </div>
              </div>

              {/* YouTube */}
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", overflow: "hidden" }}>
                <SectionHeader icon="▶️" title="YouTube Metadata" />
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <FieldLabel label="Title" />
                      <CopyBtn text={generated.youtube_title} label="yttitle" />
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.4 }}>{generated.youtube_title}</div>
                    <div style={{ fontSize: "11px", color: "#334155", marginTop: "4px" }}>{generated.youtube_title?.length ?? 0}/100 chars</div>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <FieldLabel label="URL" />
                      <CopyBtn text={`https://votegenerator.com/templates/${selectedTemplate.slug}/`} label="yturl" />
                    </div>
                    <div style={{ fontSize: "13px", color: "#6366f1", fontFamily: "monospace" }}>https://votegenerator.com/templates/{selectedTemplate.slug}/</div>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <FieldLabel label="Description" />
                      <CopyBtn text={generated.youtube_description} label="ytdesc" />
                    </div>
                    <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{generated.youtube_description}</div>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <FieldLabel label="Tags" />
                      <CopyBtn text={generated.youtube_tags?.map((t: string) => `#${t}`).join(" ") ?? ""} label="yttags" />
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {generated.youtube_tags?.map((tag: string, i: number) => (
                        <span key={i} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "4px", padding: "3px 8px", fontSize: "12px", color: "#64748b" }}>#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pinterest */}
              <div style={{ background: "#0f172a", border: "1px solid #e7343433", borderRadius: "12px", overflow: "hidden" }}>
                <SectionHeader icon="📌" title="Pinterest" />
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <FieldLabel label="Pin Title" />
                      <CopyBtn text={generated.pinterest_title} label="pintitle" />
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.4 }}>{generated.pinterest_title}</div>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <FieldLabel label="Pin Description" />
                      <CopyBtn text={generated.pinterest_description} label="pindesc" />
                    </div>
                    <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.7 }}>{generated.pinterest_description}</div>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <FieldLabel label="Visitor URL (link in pin)" />
                      <CopyBtn text={`https://votegenerator.com/templates/${selectedTemplate.slug}/`} label="pinurl" />
                    </div>
                    <div style={{ fontSize: "13px", color: "#e7345a", fontFamily: "monospace" }}>https://votegenerator.com/templates/{selectedTemplate.slug}/</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: "8px" }}>Suggested Board</div>
                    <div style={{ fontSize: "13px", color: "#94a3b8", fontStyle: "italic" }}>
                      📋 {BOARD_MAP[selectedTemplate.category] || "Online Poll Tools &..."}
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <FieldLabel label="Tags" />
                      <CopyBtn text={generated.pinterest_tags?.map((t: string) => `#${t}`).join(" ") ?? ""} label="pintags" />
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {generated.pinterest_tags?.map((tag: string, i: number) => (
                        <span key={i} style={{ background: "#2d0a10", border: "1px solid #e7343433", borderRadius: "4px", padding: "3px 8px", fontSize: "12px", color: "#e7345a" }}>#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}