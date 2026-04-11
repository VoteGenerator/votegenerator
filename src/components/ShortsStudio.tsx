import React, { useState, useRef } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

interface Template {
  id: string;
  name: string;
  category: string;
  slug: string;
  color: string;
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
  { id: "employee-engagement-survey", name: "Employee Engagement Survey", category: "HR & Culture", slug: "employee-engagement-survey", color: "#059669", emoji: "👥", pattern: "grid" },
  { id: "employee-satisfaction-survey", name: "Employee Satisfaction Survey", category: "HR & Culture", slug: "employee-satisfaction-survey", color: "#059669", emoji: "😊", pattern: "dots" },
  { id: "exit-interview-survey", name: "Exit Interview Survey", category: "HR & Culture", slug: "exit-interview-survey", color: "#475569", emoji: "🚪", pattern: "lines" },
  { id: "weekly-pulse-survey", name: "Weekly Pulse Survey", category: "HR & Culture", slug: "weekly-pulse-survey", color: "#e11d48", emoji: "💓", pattern: "dots" },
  { id: "job-satisfaction-survey", name: "Job Satisfaction Survey", category: "HR & Culture", slug: "job-satisfaction-survey", color: "#d97706", emoji: "⚡", pattern: "grid" },
  { id: "360-feedback-survey", name: "360 Degree Feedback Survey", category: "HR & Culture", slug: "360-feedback-survey", color: "#7c3aed", emoji: "🔄", pattern: "circle" },
  { id: "diversity-inclusion-survey", name: "Diversity & Inclusion Survey", category: "HR & Culture", slug: "diversity-inclusion-survey", color: "#a855f7", emoji: "🤝", pattern: "dots" },
  { id: "employee-wellbeing-survey", name: "Employee Wellbeing Survey", category: "HR & Culture", slug: "employee-wellbeing-survey", color: "#16a34a", emoji: "🌱", pattern: "waves" },
  { id: "remote-work-survey", name: "Remote Work Survey", category: "HR & Culture", slug: "remote-work-survey", color: "#0d9488", emoji: "🏠", pattern: "grid" },
  { id: "internship-feedback-survey", name: "Internship Feedback Survey", category: "HR & Culture", slug: "internship-feedback-survey", color: "#6366f1", emoji: "🌟", pattern: "dots" },
  { id: "employee-recognition-survey", name: "Employee Recognition Survey", category: "HR & Culture", slug: "employee-recognition-survey", color: "#eab308", emoji: "🏆", pattern: "lines" },
  { id: "employee-benefits-survey", name: "Employee Benefits Survey", category: "HR & Culture", slug: "employee-benefits-survey", color: "#0284c7", emoji: "🎁", pattern: "grid" },
  { id: "canteen-food-service-survey", name: "Canteen & Food Service Survey", category: "HR & Culture", slug: "canteen-food-service-survey", color: "#f97316", emoji: "🍽️", pattern: "dots" },
  { id: "employee-mental-health-survey", name: "Employee Mental Health Survey", category: "HR & Culture", slug: "employee-mental-health-survey", color: "#0891b2", emoji: "🧠", pattern: "waves" },
  { id: "candidate-experience-survey", name: "Candidate Experience Survey", category: "HR & Culture", slug: "candidate-experience-survey", color: "#0ea5e9", emoji: "💼", pattern: "grid" },
  { id: "team-building-survey", name: "Team Building Survey", category: "HR & Culture", slug: "team-building-survey", color: "#065f46", emoji: "🎯", pattern: "dots" },
  { id: "new-hire-30-60-90-survey", name: "New Hire 30-60-90 Day Survey", category: "HR & Culture", slug: "new-hire-30-60-90-survey", color: "#4f46e5", emoji: "📅", pattern: "lines" },
  { id: "customer-satisfaction-survey", name: "Customer Satisfaction (CSAT)", category: "Customer Feedback", slug: "customer-satisfaction-survey", color: "#d97706", emoji: "⭐", pattern: "dots" },
  { id: "nps-survey", name: "NPS Survey", category: "Customer Feedback", slug: "nps-survey", color: "#2563eb", emoji: "📊", pattern: "grid" },
  { id: "restaurant-feedback-survey", name: "Restaurant Feedback Survey", category: "Customer Feedback", slug: "restaurant-feedback-survey", color: "#ea580c", emoji: "🍽️", pattern: "dots" },
  { id: "customer-churn-survey", name: "Customer Churn Survey", category: "Customer Feedback", slug: "customer-churn-survey", color: "#dc2626", emoji: "📉", pattern: "lines" },
  { id: "food-delivery-survey", name: "Food Delivery Survey", category: "Customer Feedback", slug: "food-delivery-survey", color: "#f97316", emoji: "🛵", pattern: "dots" },
  { id: "gym-fitness-class-survey", name: "Gym & Fitness Class Survey", category: "Customer Feedback", slug: "gym-fitness-class-survey", color: "#7c3aed", emoji: "🏋️", pattern: "grid" },
  { id: "subscription-service-survey", name: "Subscription Service Survey", category: "Customer Feedback", slug: "subscription-service-survey", color: "#6d28d9", emoji: "🔁", pattern: "circle" },
  { id: "client-satisfaction-survey", name: "Client Satisfaction Survey", category: "Customer Feedback", slug: "client-satisfaction-survey", color: "#b45309", emoji: "🤝", pattern: "dots" },
  { id: "personal-trainer-feedback-survey", name: "Personal Trainer Feedback Survey", category: "Customer Feedback", slug: "personal-trainer-feedback-survey", color: "#ea580c", emoji: "💪", pattern: "grid" },
  { id: "spa-wellness-feedback", name: "Spa & Wellness Feedback Survey", category: "Customer Feedback", slug: "spa-wellness-feedback", color: "#059669", emoji: "🌿", pattern: "waves" },
  { id: "retail-customer-survey", name: "Retail Customer Survey", category: "Customer Feedback", slug: "retail-customer-survey", color: "#e11d48", emoji: "🛍️", pattern: "dots" },
  { id: "real-estate-agent-survey", name: "Real Estate Agent Feedback", category: "Customer Feedback", slug: "real-estate-agent-survey", color: "#b45309", emoji: "🏡", pattern: "lines" },
  { id: "insurance-satisfaction-survey", name: "Insurance Satisfaction Survey", category: "Customer Feedback", slug: "insurance-satisfaction-survey", color: "#2563eb", emoji: "🛡️", pattern: "grid" },
  { id: "sales-feedback-survey", name: "Sales Process Feedback Survey", category: "Customer Feedback", slug: "sales-feedback-survey", color: "#f59e0b", emoji: "📊", pattern: "dots" },
  { id: "coworking-space-survey", name: "Coworking Space Survey", category: "Customer Feedback", slug: "coworking-space-survey", color: "#4338ca", emoji: "🏢", pattern: "grid" },
  { id: "course-evaluation-survey", name: "Course Evaluation Survey", category: "Education", slug: "course-evaluation-survey", color: "#3b82f6", emoji: "📋", pattern: "grid" },
  { id: "training-feedback-survey", name: "Training Feedback Survey", category: "Education", slug: "training-feedback-survey", color: "#0891b2", emoji: "📚", pattern: "dots" },
  { id: "student-satisfaction-survey", name: "Student Satisfaction Survey", category: "Education", slug: "student-satisfaction-survey", color: "#6366f1", emoji: "🎒", pattern: "lines" },
  { id: "school-satisfaction-survey", name: "School Satisfaction Survey", category: "Education", slug: "school-satisfaction-survey", color: "#0284c7", emoji: "🏫", pattern: "grid" },
  { id: "alumni-survey", name: "Alumni Survey", category: "Education", slug: "alumni-survey", color: "#b45309", emoji: "🎓", pattern: "circle" },
  { id: "school-parent-survey", name: "School Parent Survey", category: "Education", slug: "school-parent-survey", color: "#059669", emoji: "👨‍👩‍👧", pattern: "dots" },
  { id: "childcare-parent-survey", name: "Childcare Parent Survey", category: "Education", slug: "childcare-parent-survey", color: "#0369a1", emoji: "👶", pattern: "waves" },
  { id: "online-course-feedback-survey", name: "Online Course Feedback Survey", category: "Education", slug: "online-course-feedback-survey", color: "#65a30d", emoji: "💻", pattern: "grid" },
  { id: "event-feedback-survey", name: "Event Feedback Survey", category: "Events", slug: "event-feedback-survey", color: "#e11d48", emoji: "🎉", pattern: "dots" },
  { id: "conference-feedback-survey", name: "Conference Feedback Survey", category: "Events", slug: "conference-feedback-survey", color: "#475569", emoji: "🏛️", pattern: "grid" },
  { id: "speaker-evaluation-survey", name: "Speaker Evaluation Survey", category: "Events", slug: "speaker-evaluation-survey", color: "#6366f1", emoji: "🎤", pattern: "lines" },
  { id: "meeting-feedback-survey", name: "Meeting Feedback Survey", category: "Events", slug: "meeting-feedback-survey", color: "#0891b2", emoji: "📅", pattern: "dots" },
  { id: "product-feedback-survey", name: "Product Feedback Survey", category: "Product & Tech", slug: "product-feedback-survey", color: "#7c3aed", emoji: "📦", pattern: "grid" },
  { id: "product-market-fit-survey", name: "Product Market Fit Survey", category: "Product & Tech", slug: "product-market-fit-survey", color: "#6d28d9", emoji: "🎯", pattern: "circle" },
  { id: "website-feedback-survey", name: "Website Feedback Survey", category: "Product & Tech", slug: "website-feedback-survey", color: "#3b82f6", emoji: "🌐", pattern: "dots" },
  { id: "app-usability-survey", name: "App Usability Survey", category: "Product & Tech", slug: "app-usability-survey", color: "#c026d3", emoji: "📱", pattern: "grid" },
  { id: "software-onboarding-survey", name: "Software Onboarding Survey", category: "Product & Tech", slug: "software-onboarding-survey", color: "#06b6d4", emoji: "🚀", pattern: "lines" },
  { id: "it-support-survey", name: "IT Support Satisfaction Survey", category: "Product & Tech", slug: "it-support-survey", color: "#475569", emoji: "💻", pattern: "dots" },
  { id: "market-research-survey", name: "Market Research Survey", category: "Product & Tech", slug: "market-research-survey", color: "#0891b2", emoji: "🔍", pattern: "grid" },
  { id: "patient-satisfaction-survey", name: "Patient Satisfaction Survey", category: "Healthcare", slug: "patient-satisfaction-survey", color: "#0891b2", emoji: "🏥", pattern: "cross" },
  { id: "dental-satisfaction-survey", name: "Dental Patient Satisfaction", category: "Healthcare", slug: "dental-satisfaction-survey", color: "#0284c7", emoji: "🦷", pattern: "dots" },
  { id: "patient-discharge-survey", name: "Patient Discharge Survey", category: "Healthcare", slug: "patient-discharge-survey", color: "#059669", emoji: "📋", pattern: "grid" },
  { id: "hotel-guest-satisfaction-survey", name: "Hotel Guest Satisfaction Survey", category: "Hospitality", slug: "hotel-guest-satisfaction-survey", color: "#b45309", emoji: "🏨", pattern: "waves" },
  { id: "tenant-satisfaction-survey", name: "Tenant Satisfaction Survey", category: "Property", slug: "tenant-satisfaction-survey", color: "#16a34a", emoji: "🏠", pattern: "grid" },
  { id: "vacation-rental-guest-survey", name: "Vacation Rental Guest Survey", category: "Property", slug: "vacation-rental-guest-survey", color: "#0d9488", emoji: "🏡", pattern: "dots" },
  { id: "hoa-resident-survey", name: "HOA Resident Survey", category: "Property", slug: "hoa-resident-survey", color: "#16a34a", emoji: "🏘️", pattern: "lines" },
  { id: "student-housing-survey", name: "Student Housing Survey", category: "Property", slug: "student-housing-survey", color: "#3b82f6", emoji: "🎓", pattern: "grid" },
  { id: "brand-awareness-survey", name: "Brand Awareness Survey", category: "Marketing", slug: "brand-awareness-survey", color: "#e11d48", emoji: "🎯", pattern: "dots" },
  { id: "membership-satisfaction-survey", name: "Membership Satisfaction Survey", category: "Membership", slug: "membership-satisfaction-survey", color: "#4f46e5", emoji: "🏅", pattern: "circle" },
  { id: "podcast-content-survey", name: "Podcast Content Survey", category: "Membership", slug: "podcast-content-survey", color: "#7c3aed", emoji: "🎙️", pattern: "waves" },
  { id: "vendor-evaluation-survey", name: "Vendor Evaluation Survey", category: "Procurement", slug: "vendor-evaluation-survey", color: "#64748b", emoji: "📋", pattern: "grid" },
  { id: "volunteer-feedback-survey", name: "Volunteer Feedback Survey", category: "Community", slug: "volunteer-feedback-survey", color: "#059669", emoji: "🤝", pattern: "dots" },
  { id: "community-satisfaction-survey", name: "Community Satisfaction Survey", category: "Community", slug: "community-satisfaction-survey", color: "#7c3aed", emoji: "🏘️", pattern: "grid" },
  { id: "nonprofit-impact-survey", name: "Nonprofit Impact Survey", category: "Community", slug: "nonprofit-impact-survey", color: "#ea580c", emoji: "❤️", pattern: "lines" },
  { id: "museum-visitor-survey", name: "Museum Visitor Survey", category: "Civic", slug: "museum-visitor-survey", color: "#78716c", emoji: "🏛️", pattern: "dots" },
];

const CATEGORIES: string[] = ["All", ...Array.from(new Set(TEMPLATES.map((t: Template) => t.category)))];

// ── Pattern SVGs ───────────────────────────────────────────────────────────

function PatternBg({ pattern, color }: { pattern: string; color: string }): React.ReactElement {
  const c = color + '40';
  if (pattern === 'dots') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25 }}>
      <defs><pattern id="p" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="3" r="1.5" fill="white" />
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#p)" />
    </svg>
  );
  if (pattern === 'grid') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
      <defs><pattern id="p" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5" />
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#p)" />
    </svg>
  );
  if (pattern === 'lines') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
      <defs><pattern id="p" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="20" y2="20" stroke="white" strokeWidth="0.5" />
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#p)" />
    </svg>
  );
  if (pattern === 'waves') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }} viewBox="0 0 270 480" preserveAspectRatio="none">
      <path d="M0,120 Q67,90 135,120 T270,120" fill="none" stroke="white" strokeWidth="1.5" />
      <path d="M0,180 Q67,150 135,180 T270,180" fill="none" stroke="white" strokeWidth="1.5" />
      <path d="M0,240 Q67,210 135,240 T270,240" fill="none" stroke="white" strokeWidth="1.5" />
      <path d="M0,300 Q67,270 135,300 T270,300" fill="none" stroke="white" strokeWidth="1.5" />
    </svg>
  );
  if (pattern === 'circle') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}>
      <defs><pattern id="p" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="14" fill="none" stroke="white" strokeWidth="0.5" />
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#p)" />
    </svg>
  );
  if (pattern === 'cross') return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
      <defs><pattern id="p" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
        <line x1="15" y1="5" x2="15" y2="25" stroke="white" strokeWidth="0.7" />
        <line x1="5" y1="15" x2="25" y2="15" stroke="white" strokeWidth="0.7" />
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#p)" />
    </svg>
  );
  return <></>;
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
  "youtube_title": "60 chars max. Start with 'How to Create a Free [Template Name]' or similar. Keyword-rich.",
  "youtube_description": "150-200 words. Hook first line. Describe use case. Include URL. End with 3-5 hashtags.",
  "youtube_tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8"],
  "opening_hook": "8-12 words MAX. A sharp pain point question. BIG TEXT on screen. End with ?",
  "opening_subtext": "4-6 words. Softer supporting line.",
  "ending_headline": "6-8 words. Action CTA. Big bold text.",
  "voiceover_script": "30-45 second ElevenLabs script. No stage directions. Short punchy sentences. Hook then Problem then Solution then Features then CTA.",
  "features": ["Feature 1 — one short sentence", "Feature 2 — one short sentence", "Feature 3 — one short sentence", "Feature 4 — one short sentence"],
  "pinterest_title": "60 chars max. Descriptive and keyword-rich. Include 'Free' and the survey type.",
  "pinterest_description": "150-200 chars. Clear value prop. What problem does it solve. Include URL.",
  "pinterest_tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
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
        cursor: "pointer", transition: "all 0.2s", fontWeight: 600, letterSpacing: "0.03em",
        flexShrink: 0
      }}
    >
      {copied[label] ? "✓ Copied" : "Copy"}
    </button>
  );

  // ── Card renderers ───────────────────────────────────────────────────────

  const OpeningCard = ({ scale = 1 }: { scale?: number }): React.ReactElement => {
    if (!selectedTemplate || !generated) return <></>;
    const w = Math.round(270 * scale);
    const h = Math.round(480 * scale);
    return (
      <div style={{
        width: w, height: h, borderRadius: 16 * scale, overflow: "hidden",
        background: `linear-gradient(160deg, ${selectedTemplate.color} 0%, ${selectedTemplate.color}cc 40%, #1a0a2e 100%)`,
        display: "flex", flexDirection: "column", position: "relative",
        border: `${scale}px solid ${selectedTemplate.color}55`,
        flexShrink: 0
      }}>
        <PatternBg pattern={selectedTemplate.pattern} color={selectedTemplate.color} />
        {/* Top bar */}
        <div style={{ padding: `${20*scale}px ${20*scale}px 0`, display: "flex", alignItems: "center", gap: 8*scale, position: "relative", zIndex: 2 }}>
          <div style={{ width: 6*scale, height: 6*scale, borderRadius: "50%", background: "rgba(255,255,255,0.8)" }} />
          <div style={{ fontSize: 10*scale, fontWeight: 800, color: "rgba(255,255,255,0.7)", letterSpacing: "0.14em", textTransform: "uppercase" }}>VoteGenerator</div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: `${16*scale}px ${24*scale}px`, position: "relative", zIndex: 2 }}>
          {/* Category pill — dark so always readable */}
          <div style={{
            display: "inline-flex", alignItems: "center", alignSelf: "flex-start",
            background: "rgba(0,0,0,0.55)", borderRadius: 20*scale,
            padding: `${4*scale}px ${10*scale}px`, marginBottom: 16*scale
          }}>
            <span style={{ fontSize: 9*scale, fontWeight: 800, color: "#ffffff", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {selectedTemplate.category}
            </span>
          </div>
          <div style={{ fontSize: 28*scale, fontWeight: 900, lineHeight: 1.05, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: 14*scale, textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
            {generated.opening_hook}
          </div>
          <div style={{ fontSize: 13*scale, fontWeight: 500, color: "rgba(255,255,255,0.65)", lineHeight: 1.4 }}>
            {generated.opening_subtext}
          </div>
        </div>
        {/* Bottom bar */}
        <div style={{ padding: `${14*scale}px ${24*scale}px ${20*scale}px`, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)", position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: 9*scale, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Free · No Signup Required
          </div>
        </div>
      </div>
    );
  };

  const FeaturesCard = ({ scale = 1 }: { scale?: number }): React.ReactElement => {
    if (!selectedTemplate || !generated) return <></>;
    const w = Math.round(270 * scale);
    const h = Math.round(480 * scale);
    return (
      <div style={{
        width: w, height: h, borderRadius: 16*scale, overflow: "hidden",
        background: `linear-gradient(145deg, #0f172a 0%, #1e1035 60%, ${selectedTemplate.color}22 100%)`,
        display: "flex", flexDirection: "column", position: "relative",
        border: `${scale}px solid ${selectedTemplate.color}33`,
        flexShrink: 0
      }}>
        <PatternBg pattern={selectedTemplate.pattern} color={selectedTemplate.color} />
        {/* Top */}
        <div style={{ padding: `${20*scale}px ${20*scale}px 0`, display: "flex", alignItems: "center", gap: 8*scale, position: "relative", zIndex: 2 }}>
          <div style={{ width: 6*scale, height: 6*scale, borderRadius: "50%", background: selectedTemplate.color }} />
          <div style={{ fontSize: 10*scale, fontWeight: 800, color: "rgba(255,255,255,0.5)", letterSpacing: "0.14em", textTransform: "uppercase" }}>VoteGenerator</div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: `${8*scale}px ${22*scale}px`, position: "relative", zIndex: 2, gap: 12*scale }}>
          <div style={{ fontSize: 11*scale, fontWeight: 800, color: selectedTemplate.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4*scale }}>
            Why Teams Love It
          </div>
          {(generated.features || []).map((f: string, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10*scale }}>
              <div style={{
                width: 22*scale, height: 22*scale, borderRadius: 6*scale, flexShrink: 0,
                background: selectedTemplate.color + "33",
                border: `1px solid ${selectedTemplate.color}66`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11*scale, fontWeight: 900, color: selectedTemplate.color
              }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 12*scale, color: "rgba(255,255,255,0.8)", lineHeight: 1.45, fontWeight: 500 }}>{f}</div>
            </div>
          ))}
        </div>
        {/* Bottom */}
        <div style={{ padding: `${14*scale}px ${22*scale}px ${20*scale}px`, position: "relative", zIndex: 2 }}>
          <div style={{
            background: selectedTemplate.color + "22", border: `1px solid ${selectedTemplate.color}55`,
            borderRadius: 8*scale, padding: `${7*scale}px ${12*scale}px`,
            fontSize: 12*scale, fontWeight: 800, color: selectedTemplate.color
          }}>
            votegenerator.com
          </div>
        </div>
      </div>
    );
  };

  const EndingCard = ({ scale = 1 }: { scale?: number }): React.ReactElement => {
    if (!selectedTemplate || !generated) return <></>;
    const w = Math.round(270 * scale);
    const h = Math.round(480 * scale);
    return (
      <div style={{
        width: w, height: h, borderRadius: 16*scale, overflow: "hidden",
        background: "linear-gradient(160deg, #0f172a 0%, #0a0a1a 100%)",
        display: "flex", flexDirection: "column", position: "relative",
        border: `${scale}px solid #1e293b`,
        flexShrink: 0
      }}>
        {/* Glow */}
        <div style={{ position: "absolute", bottom: -60*scale, left: "50%", transform: "translateX(-50%)", width: 200*scale, height: 200*scale, borderRadius: "50%", background: selectedTemplate.color + "33", filter: `blur(${60*scale}px)`, pointerEvents: "none" }} />
        <PatternBg pattern={selectedTemplate.pattern} color={selectedTemplate.color} />
        {/* Top */}
        <div style={{ padding: `${20*scale}px ${20*scale}px 0`, display: "flex", alignItems: "center", gap: 8*scale, position: "relative", zIndex: 2 }}>
          <div style={{ width: 6*scale, height: 6*scale, borderRadius: "50%", background: selectedTemplate.color }} />
          <div style={{ fontSize: 10*scale, fontWeight: 800, color: "rgba(255,255,255,0.4)", letterSpacing: "0.14em", textTransform: "uppercase" }}>VoteGenerator</div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: `${8*scale}px ${24*scale}px`, position: "relative", zIndex: 2 }}>
          <div style={{
            width: 52*scale, height: 52*scale, borderRadius: 14*scale,
            background: `linear-gradient(135deg, ${selectedTemplate.color}, ${selectedTemplate.color}99)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26*scale, marginBottom: 22*scale, boxShadow: `0 8px 24px ${selectedTemplate.color}44`
          }}>
            {selectedTemplate.emoji}
          </div>
          <div style={{ fontSize: 26*scale, fontWeight: 900, lineHeight: 1.05, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: 20*scale, textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
            {generated.ending_headline}
          </div>
          <div style={{
            display: "inline-block", background: selectedTemplate.color + "22",
            border: `1px solid ${selectedTemplate.color}66`, borderRadius: 8*scale,
            padding: `${8*scale}px ${14*scale}px`,
            fontSize: 14*scale, fontWeight: 800, color: selectedTemplate.color, letterSpacing: "-0.01em"
          }}>
            votegenerator.com
          </div>
        </div>
        {/* Bottom */}
        <div style={{ padding: `${14*scale}px ${24*scale}px ${20*scale}px`, position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: 9*scale, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Free Survey Tool · 50,000+ Teams
          </div>
        </div>
      </div>
    );
  };

  // ── Lightbox ─────────────────────────────────────────────────────────────

  const Lightbox = (): React.ReactElement => {
    if (!lightboxCard) return <></>;
    return (
      <div
        onClick={() => setLightboxCard(null)}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
      >
        <div onClick={(e: React.MouseEvent) => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Click outside to close · Right-click card to save</div>
          {lightboxCard === 'open' && <OpeningCard scale={1.6} />}
          {lightboxCard === 'features' && <FeaturesCard scale={1.6} />}
          {lightboxCard === 'end' && <EndingCard scale={1.6} />}
        </div>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: "#090e1a", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#f1f5f9" }}>
      <Lightbox />

      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e293b", padding: "20px 32px", display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🎬</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: "18px", letterSpacing: "-0.02em" }}>Shorts Studio</div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>VoteGenerator · YouTube Shorts Production Tool</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: "12px", color: "#475569", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "6px", padding: "6px 12px" }}>
          {TEMPLATES.length} templates
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", minHeight: "calc(100vh - 73px)" }}>

        {/* Left — Template Picker */}
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
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  background: categoryFilter === cat ? "#6366f1" : "#0f172a",
                  color: categoryFilter === cat ? "#fff" : "#64748b",
                  border: "1px solid " + (categoryFilter === cat ? "#6366f1" : "#1e293b"),
                  borderRadius: "20px", padding: "3px 10px", fontSize: "11px",
                  cursor: "pointer", fontWeight: 600, transition: "all 0.15s"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {filteredTemplates.map((t: Template) => (
              <button
                key={t.id}
                onClick={() => { setSelectedTemplate(t); setGenerated(null); }}
                style={{
                  width: "100%", textAlign: "left",
                  background: selectedTemplate?.id === t.id ? "#1e293b" : "transparent",
                  border: "1px solid " + (selectedTemplate?.id === t.id ? "#6366f1" : "transparent"),
                  borderRadius: "8px", padding: "10px 12px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "10px",
                  transition: "all 0.15s", marginBottom: "2px"
                }}
              >
                <div style={{
                  width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
                  background: `linear-gradient(135deg, ${t.color}33, ${t.color}66)`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px"
                }}>
                  {t.emoji}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: selectedTemplate?.id === t.id ? "#f1f5f9" : "#94a3b8", lineHeight: 1.3 }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>{t.category}</div>
                </div>
              </button>
            ))}
          </div>
          {selectedTemplate && (
            <div style={{ padding: "16px", borderTop: "1px solid #1e293b" }}>
              <button
                onClick={generate}
                disabled={loading}
                style={{
                  width: "100%", padding: "12px", borderRadius: "10px",
                  background: loading ? "#1e293b" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: loading ? "#475569" : "#fff", border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: 800, fontSize: "14px", letterSpacing: "-0.01em", transition: "all 0.2s"
                }}
              >
                {loading ? "Generating..." : "⚡ Generate All Assets"}
              </button>
            </div>
          )}
        </div>

        {/* Right — Output */}
        <div style={{ overflowY: "auto", padding: "32px" }}>
          {!selectedTemplate && !generated && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "16px", color: "#334155" }}>
              <div style={{ fontSize: "48px" }}>🎬</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#475569" }}>Select a template to get started</div>
              <div style={{ fontSize: "14px" }}>Pick any of the {TEMPLATES.length} survey templates from the left</div>
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
            <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", borderRadius: "10px", padding: "16px", color: "#fca5a5", marginBottom: "24px" }}>
              {error}
            </div>
          )}

          {generated && selectedTemplate && (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

              {/* ── Cards ── */}
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>
                  Screenshot Cards · 9:16 · Click to enlarge
                </div>
                {/* White background wrapper for easy Canva removal */}
                <div style={{ background: "#ffffff", borderRadius: "20px", padding: "24px", display: "inline-flex", gap: "24px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>Opening Hook</div>
                    <div onClick={() => setLightboxCard('open')} style={{ cursor: "zoom-in" }}>
                      <OpeningCard scale={1} />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>Why Use It</div>
                    <div onClick={() => setLightboxCard('features')} style={{ cursor: "zoom-in" }}>
                      <FeaturesCard scale={1} />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600 }}>Ending CTA</div>
                    <div onClick={() => setLightboxCard('end')} style={{ cursor: "zoom-in" }}>
                      <EndingCard scale={1} />
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: "10px", fontSize: "12px", color: "#475569" }}>
                  💡 White background = easy Canva background removal · Click any card to enlarge · Right-click to save
                </div>
              </div>

              {/* ── Voiceover Script ── */}
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 700, fontSize: "14px" }}>🎙️ ElevenLabs Voiceover Script</div>
                  <CopyBtn text={generated.voiceover_script} label="script" />
                </div>
                <div style={{ padding: "20px", fontSize: "15px", lineHeight: 1.7, color: "#cbd5e1", whiteSpace: "pre-wrap", fontStyle: "italic" }}>
                  {generated.voiceover_script}
                </div>
              </div>

              {/* ── YouTube Metadata ── */}
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: "16px" }}>▶️</div>
                  <div style={{ fontWeight: 700, fontSize: "14px" }}>YouTube Metadata</div>
                </div>
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" }}>Title</div>
                      <CopyBtn text={generated.youtube_title} label="yttitle" />
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.4 }}>{generated.youtube_title}</div>
                    <div style={{ fontSize: "11px", color: "#334155", marginTop: "4px" }}>{generated.youtube_title?.length ?? 0}/100 chars</div>
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" }}>URL</div>
                      <CopyBtn text={`https://votegenerator.com/templates/${selectedTemplate.slug}/`} label="yturl" />
                    </div>
                    <div style={{ fontSize: "13px", color: "#6366f1", fontFamily: "monospace" }}>
                      https://votegenerator.com/templates/{selectedTemplate.slug}/
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" }}>Description</div>
                      <CopyBtn text={generated.youtube_description} label="ytdesc" />
                    </div>
                    <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                      {generated.youtube_description}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" }}>Tags</div>
                      <CopyBtn text={generated.youtube_tags?.map((t: string) => `#${t}`).join(" ") ?? ""} label="yttags" />
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {generated.youtube_tags?.map((tag: string, i: number) => (
                        <span key={i} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "4px", padding: "3px 8px", fontSize: "12px", color: "#64748b" }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* ── Pinterest Metadata ── */}
              <div style={{ background: "#0f172a", border: "1px solid #e7343433", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #e7343422", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: "16px" }}>📌</div>
                  <div style={{ fontWeight: 700, fontSize: "14px" }}>Pinterest</div>
                </div>
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" }}>Pin Title</div>
                      <CopyBtn text={generated.pinterest_title} label="pintitle" />
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.4 }}>{generated.pinterest_title}</div>
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" }}>Pin Description</div>
                      <CopyBtn text={generated.pinterest_description} label="pindesc" />
                    </div>
                    <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.7 }}>
                      {generated.pinterest_description}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" }}>Visitor URL (link in pin)</div>
                      <CopyBtn text={`https://votegenerator.com/templates/${selectedTemplate.slug}/`} label="pinurl" />
                    </div>
                    <div style={{ fontSize: "13px", color: "#e7345a", fontFamily: "monospace" }}>
                      https://votegenerator.com/templates/{selectedTemplate.slug}/
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>Suggested Board</div>
                    <div style={{ fontSize: "13px", color: "#94a3b8", fontStyle: "italic" }}>
                      📋 {BOARD_MAP[selectedTemplate.category] || "Online Poll Tools & ..."}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" }}>Tags</div>
                      <CopyBtn text={generated.pinterest_tags?.map((t: string) => `#${t}`).join(" ") ?? ""} label="pintags" />
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {generated.pinterest_tags?.map((tag: string, i: number) => (
                        <span key={i} style={{ background: "#2d0a10", border: "1px solid #e7343433", borderRadius: "4px", padding: "3px 8px", fontSize: "12px", color: "#e7345a" }}>
                          #{tag}
                        </span>
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