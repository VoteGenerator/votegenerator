import { useState, useRef } from "react";

const TEMPLATES = [
  { id: "employee-engagement-survey", name: "Employee Engagement Survey", category: "HR & Culture", slug: "employee-engagement-survey", color: "#059669", bg: "from-emerald-600 to-teal-700", emoji: "👥" },
  { id: "employee-satisfaction-survey", name: "Employee Satisfaction Survey", category: "HR & Culture", slug: "employee-satisfaction-survey", color: "#059669", bg: "from-green-600 to-emerald-700", emoji: "😊" },
  { id: "exit-interview-survey", name: "Exit Interview Survey", category: "HR & Culture", slug: "exit-interview-survey", color: "#475569", bg: "from-slate-600 to-gray-700", emoji: "🚪" },
  { id: "weekly-pulse-survey", name: "Weekly Pulse Survey", category: "HR & Culture", slug: "weekly-pulse-survey", color: "#e11d48", bg: "from-rose-500 to-pink-600", emoji: "💓" },
  { id: "job-satisfaction-survey", name: "Job Satisfaction Survey", category: "HR & Culture", slug: "job-satisfaction-survey", color: "#d97706", bg: "from-amber-500 to-yellow-600", emoji: "⚡" },
  { id: "360-feedback-survey", name: "360 Degree Feedback Survey", category: "HR & Culture", slug: "360-feedback-survey", color: "#7c3aed", bg: "from-violet-600 to-purple-700", emoji: "🔄" },
  { id: "diversity-inclusion-survey", name: "Diversity & Inclusion Survey", category: "HR & Culture", slug: "diversity-inclusion-survey", color: "#a855f7", bg: "from-fuchsia-500 to-purple-600", emoji: "🤝" },
  { id: "employee-wellbeing-survey", name: "Employee Wellbeing Survey", category: "HR & Culture", slug: "employee-wellbeing-survey", color: "#16a34a", bg: "from-green-500 to-emerald-600", emoji: "🌱" },
  { id: "remote-work-survey", name: "Remote Work Survey", category: "HR & Culture", slug: "remote-work-survey", color: "#0d9488", bg: "from-teal-500 to-cyan-600", emoji: "🏠" },
  { id: "internship-feedback-survey", name: "Internship Feedback Survey", category: "HR & Culture", slug: "internship-feedback-survey", color: "#6366f1", bg: "from-indigo-500 to-blue-600", emoji: "🌟" },
  { id: "employee-recognition-survey", name: "Employee Recognition Survey", category: "HR & Culture", slug: "employee-recognition-survey", color: "#eab308", bg: "from-yellow-500 to-amber-600", emoji: "🏆" },
  { id: "employee-benefits-survey", name: "Employee Benefits Survey", category: "HR & Culture", slug: "employee-benefits-survey", color: "#0284c7", bg: "from-sky-500 to-blue-600", emoji: "🎁" },
  { id: "canteen-food-service-survey", name: "Canteen & Food Service Survey", category: "HR & Culture", slug: "canteen-food-service-survey", color: "#f97316", bg: "from-orange-500 to-amber-600", emoji: "🍽️" },
  { id: "employee-mental-health-survey", name: "Employee Mental Health Survey", category: "HR & Culture", slug: "employee-mental-health-survey", color: "#0891b2", bg: "from-cyan-500 to-teal-600", emoji: "🧠" },
  { id: "candidate-experience-survey", name: "Candidate Experience Survey", category: "HR & Culture", slug: "candidate-experience-survey", color: "#0ea5e9", bg: "from-sky-500 to-indigo-600", emoji: "💼" },
  { id: "team-building-survey", name: "Team Building Survey", category: "HR & Culture", slug: "team-building-survey", color: "#065f46", bg: "from-emerald-700 to-teal-800", emoji: "🎯" },
  { id: "new-hire-30-60-90-survey", name: "New Hire 30-60-90 Day Survey", category: "HR & Culture", slug: "new-hire-30-60-90-survey", color: "#4f46e5", bg: "from-indigo-600 to-violet-700", emoji: "📅" },
  { id: "customer-satisfaction-survey", name: "Customer Satisfaction (CSAT)", category: "Customer Feedback", slug: "customer-satisfaction-survey", color: "#d97706", bg: "from-amber-500 to-orange-600", emoji: "⭐" },
  { id: "nps-survey", name: "NPS Survey", category: "Customer Feedback", slug: "nps-survey", color: "#2563eb", bg: "from-blue-600 to-indigo-700", emoji: "📊" },
  { id: "restaurant-feedback-survey", name: "Restaurant Feedback Survey", category: "Customer Feedback", slug: "restaurant-feedback-survey", color: "#ea580c", bg: "from-orange-600 to-red-600", emoji: "🍽️" },
  { id: "customer-churn-survey", name: "Customer Churn Survey", category: "Customer Feedback", slug: "customer-churn-survey", color: "#dc2626", bg: "from-red-600 to-rose-700", emoji: "📉" },
  { id: "food-delivery-survey", name: "Food Delivery Survey", category: "Customer Feedback", slug: "food-delivery-survey", color: "#f97316", bg: "from-orange-500 to-red-500", emoji: "🛵" },
  { id: "gym-fitness-class-survey", name: "Gym & Fitness Class Survey", category: "Customer Feedback", slug: "gym-fitness-class-survey", color: "#7c3aed", bg: "from-violet-600 to-purple-700", emoji: "🏋️" },
  { id: "subscription-service-survey", name: "Subscription Service Survey", category: "Customer Feedback", slug: "subscription-service-survey", color: "#6d28d9", bg: "from-violet-700 to-indigo-800", emoji: "🔁" },
  { id: "client-satisfaction-survey", name: "Client Satisfaction Survey", category: "Customer Feedback", slug: "client-satisfaction-survey", color: "#1c1917", bg: "from-stone-700 to-amber-800", emoji: "🤝" },
  { id: "personal-trainer-feedback-survey", name: "Personal Trainer Feedback Survey", category: "Customer Feedback", slug: "personal-trainer-feedback-survey", color: "#ea580c", bg: "from-orange-600 to-red-700", emoji: "💪" },
  { id: "spa-wellness-feedback", name: "Spa & Wellness Feedback Survey", category: "Customer Feedback", slug: "spa-wellness-feedback", color: "#059669", bg: "from-emerald-600 to-teal-700", emoji: "🌿" },
  { id: "retail-customer-survey", name: "Retail Customer Survey", category: "Customer Feedback", slug: "retail-customer-survey", color: "#e11d48", bg: "from-pink-600 to-rose-600", emoji: "🛍️" },
  { id: "real-estate-agent-survey", name: "Real Estate Agent Feedback", category: "Customer Feedback", slug: "real-estate-agent-survey", color: "#b45309", bg: "from-amber-600 to-orange-700", emoji: "🏡" },
  { id: "insurance-satisfaction-survey", name: "Insurance Satisfaction Survey", category: "Customer Feedback", slug: "insurance-satisfaction-survey", color: "#2563eb", bg: "from-blue-700 to-indigo-800", emoji: "🛡️" },
  { id: "sales-feedback-survey", name: "Sales Process Feedback Survey", category: "Customer Feedback", slug: "sales-feedback-survey", color: "#f59e0b", bg: "from-amber-500 to-orange-600", emoji: "📊" },
  { id: "coworking-space-survey", name: "Coworking Space Survey", category: "Customer Feedback", slug: "coworking-space-survey", color: "#4338ca", bg: "from-indigo-700 to-violet-800", emoji: "🏢" },
  { id: "course-evaluation-survey", name: "Course Evaluation Survey", category: "Education", slug: "course-evaluation-survey", color: "#3b82f6", bg: "from-blue-600 to-indigo-700", emoji: "📋" },
  { id: "training-feedback-survey", name: "Training Feedback Survey", category: "Education", slug: "training-feedback-survey", color: "#0891b2", bg: "from-cyan-600 to-teal-700", emoji: "📚" },
  { id: "student-satisfaction-survey", name: "Student Satisfaction Survey", category: "Education", slug: "student-satisfaction-survey", color: "#6366f1", bg: "from-indigo-600 to-purple-700", emoji: "🎒" },
  { id: "school-satisfaction-survey", name: "School Satisfaction Survey", category: "Education", slug: "school-satisfaction-survey", color: "#0284c7", bg: "from-sky-600 to-blue-700", emoji: "🏫" },
  { id: "alumni-survey", name: "Alumni Survey", category: "Education", slug: "alumni-survey", color: "#b45309", bg: "from-amber-600 to-orange-700", emoji: "🎓" },
  { id: "school-parent-survey", name: "School Parent Survey", category: "Education", slug: "school-parent-survey", color: "#059669", bg: "from-emerald-600 to-teal-700", emoji: "👨‍👩‍👧" },
  { id: "childcare-parent-survey", name: "Childcare Parent Survey", category: "Education", slug: "childcare-parent-survey", color: "#0369a1", bg: "from-sky-700 to-blue-800", emoji: "👶" },
  { id: "online-course-feedback-survey", name: "Online Course Feedback Survey", category: "Education", slug: "online-course-feedback-survey", color: "#65a30d", bg: "from-lime-600 to-green-700", emoji: "💻" },
  { id: "event-feedback-survey", name: "Event Feedback Survey", category: "Events", slug: "event-feedback-survey", color: "#e11d48", bg: "from-rose-600 to-pink-700", emoji: "🎉" },
  { id: "conference-feedback-survey", name: "Conference Feedback Survey", category: "Events", slug: "conference-feedback-survey", color: "#475569", bg: "from-slate-600 to-gray-700", emoji: "🏛️" },
  { id: "speaker-evaluation-survey", name: "Speaker Evaluation Survey", category: "Events", slug: "speaker-evaluation-survey", color: "#6366f1", bg: "from-indigo-600 to-violet-700", emoji: "🎤" },
  { id: "meeting-feedback-survey", name: "Meeting Feedback Survey", category: "Events", slug: "meeting-feedback-survey", color: "#0891b2", bg: "from-cyan-600 to-blue-700", emoji: "📅" },
  { id: "product-feedback-survey", name: "Product Feedback Survey", category: "Product & Tech", slug: "product-feedback-survey", color: "#7c3aed", bg: "from-violet-600 to-purple-700", emoji: "📦" },
  { id: "product-market-fit-survey", name: "Product Market Fit Survey", category: "Product & Tech", slug: "product-market-fit-survey", color: "#6d28d9", bg: "from-violet-700 to-purple-800", emoji: "🎯" },
  { id: "website-feedback-survey", name: "Website Feedback Survey", category: "Product & Tech", slug: "website-feedback-survey", color: "#3b82f6", bg: "from-blue-600 to-indigo-700", emoji: "🌐" },
  { id: "app-usability-survey", name: "App Usability Survey", category: "Product & Tech", slug: "app-usability-survey", color: "#c026d3", bg: "from-fuchsia-600 to-pink-700", emoji: "📱" },
  { id: "software-onboarding-survey", name: "Software Onboarding Survey", category: "Product & Tech", slug: "software-onboarding-survey", color: "#06b6d4", bg: "from-cyan-600 to-blue-700", emoji: "🚀" },
  { id: "it-support-survey", name: "IT Support Satisfaction Survey", category: "Product & Tech", slug: "it-support-survey", color: "#475569", bg: "from-slate-600 to-blue-700", emoji: "💻" },
  { id: "market-research-survey", name: "Market Research Survey", category: "Product & Tech", slug: "market-research-survey", color: "#0891b2", bg: "from-emerald-600 to-cyan-700", emoji: "🔍" },
  { id: "patient-satisfaction-survey", name: "Patient Satisfaction Survey", category: "Healthcare", slug: "patient-satisfaction-survey", color: "#0891b2", bg: "from-sky-600 to-cyan-700", emoji: "🏥" },
  { id: "dental-satisfaction-survey", name: "Dental Patient Satisfaction", category: "Healthcare", slug: "dental-satisfaction-survey", color: "#0284c7", bg: "from-sky-500 to-blue-600", emoji: "🦷" },
  { id: "patient-discharge-survey", name: "Patient Discharge Survey", category: "Healthcare", slug: "patient-discharge-survey", color: "#059669", bg: "from-emerald-600 to-teal-700", emoji: "📋" },
  { id: "hotel-guest-satisfaction-survey", name: "Hotel Guest Satisfaction Survey", category: "Hospitality", slug: "hotel-guest-satisfaction-survey", color: "#b45309", bg: "from-amber-600 to-orange-700", emoji: "🏨" },
  { id: "tenant-satisfaction-survey", name: "Tenant Satisfaction Survey", category: "Property", slug: "tenant-satisfaction-survey", color: "#16a34a", bg: "from-green-600 to-emerald-700", emoji: "🏠" },
  { id: "vacation-rental-guest-survey", name: "Vacation Rental Guest Survey", category: "Property", slug: "vacation-rental-guest-survey", color: "#0d9488", bg: "from-teal-600 to-cyan-700", emoji: "🏡" },
  { id: "hoa-resident-survey", name: "HOA Resident Survey", category: "Property", slug: "hoa-resident-survey", color: "#16a34a", bg: "from-green-700 to-teal-800", emoji: "🏘️" },
  { id: "student-housing-survey", name: "Student Housing Survey", category: "Property", slug: "student-housing-survey", color: "#3b82f6", bg: "from-blue-600 to-indigo-700", emoji: "🎓" },
  { id: "brand-awareness-survey", name: "Brand Awareness Survey", category: "Marketing", slug: "brand-awareness-survey", color: "#e11d48", bg: "from-rose-600 to-pink-700", emoji: "🎯" },
  { id: "membership-satisfaction-survey", name: "Membership Satisfaction Survey", category: "Membership", slug: "membership-satisfaction-survey", color: "#4f46e5", bg: "from-indigo-600 to-blue-700", emoji: "🏅" },
  { id: "podcast-content-survey", name: "Podcast Content Survey", category: "Membership", slug: "podcast-content-survey", color: "#7c3aed", bg: "from-purple-600 to-indigo-700", emoji: "🎙️" },
  { id: "vendor-evaluation-survey", name: "Vendor Evaluation Survey", category: "Procurement", slug: "vendor-evaluation-survey", color: "#64748b", bg: "from-slate-600 to-gray-700", emoji: "📋" },
  { id: "volunteer-feedback-survey", name: "Volunteer Feedback Survey", category: "Community", slug: "volunteer-feedback-survey", color: "#059669", bg: "from-emerald-600 to-teal-700", emoji: "🤝" },
  { id: "community-satisfaction-survey", name: "Community Satisfaction Survey", category: "Community", slug: "community-satisfaction-survey", color: "#7c3aed", bg: "from-violet-600 to-purple-700", emoji: "🏘️" },
  { id: "nonprofit-impact-survey", name: "Nonprofit Impact Survey", category: "Community", slug: "nonprofit-impact-survey", color: "#ea580c", bg: "from-orange-600 to-red-700", emoji: "❤️" },
  { id: "museum-visitor-survey", name: "Museum Visitor Survey", category: "Civic", slug: "museum-visitor-survey", color: "#78716c", bg: "from-stone-600 to-amber-700", emoji: "🏛️" },
];

const CATEGORIES = [...new Set(TEMPLATES.map(t => t.category))];

export default function ShortsStudio() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const openCardRef = useRef(null);
  const endCardRef = useRef(null);

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;
    const matchesSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const generate = async () => {
    if (!selectedTemplate) return;
    setLoading(true);
    setError(null);
    setGenerated(null);

    const prompt = `You are a YouTube Shorts content strategist for VoteGenerator.com — a free, no-signup survey and poll tool.

Generate complete YouTube Shorts production assets for this template:
- Template Name: ${selectedTemplate.name}
- Category: ${selectedTemplate.category}
- URL: https://votegenerator.com/templates/${selectedTemplate.slug}/

Return ONLY a valid JSON object (no markdown, no backticks) with this exact structure:
{
  "youtube_title": "60 chars max, punchy, keyword-rich, includes 'free' or a number if natural",
  "youtube_description": "150-200 words. Hook first line. Describe the template and its use case. Include URL. End with 3-5 hashtags. Professional tone.",
  "youtube_tags": ["tag1", "tag2", ...],
  "opening_hook": "8-12 words MAX. A pain point question or bold statement. Visceral and direct. This appears as BIG TEXT on screen. No punctuation at end except ?",
  "opening_subtext": "4-6 words. Secondary line under hook. Softer. Descriptive.",
  "ending_headline": "6-8 words MAX. Action-oriented CTA. Big text.",
  "ending_subtext": "votegenerator.com — always this exact text",
  "voiceover_script": "30-45 second script for ElevenLabs. Conversational, energetic, no filler words. Structure: Hook (3s) → Problem (8s) → Solution (10s) → Features (10s) → CTA (5s). Use short punchy sentences. Write exactly what should be spoken — no stage directions, no brackets, no notes."
}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await response.json();
      const text = data.content[0].text.trim().replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(text);
      setGenerated(parsed);
    } catch (e) {
      setError("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, key) => {
    await navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 2000);
  };

  const CopyBtn = ({ text, label }) => (
    <button
      onClick={() => copyToClipboard(text, label)}
      style={{
        background: copied[label] ? "#10b981" : "#1e293b",
        color: copied[label] ? "#fff" : "#94a3b8",
        border: "1px solid " + (copied[label] ? "#10b981" : "#334155"),
        borderRadius: "6px",
        padding: "4px 12px",
        fontSize: "12px",
        cursor: "pointer",
        transition: "all 0.2s",
        fontWeight: 600,
        letterSpacing: "0.03em"
      }}
    >
      {copied[label] ? "✓ Copied" : "Copy"}
    </button>
  );

  return (
    <div style={{ background: "#090e1a", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#f1f5f9" }}>
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
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: "100%", background: "#0f172a", border: "1px solid #1e293b",
                borderRadius: "8px", padding: "8px 12px", color: "#f1f5f9",
                fontSize: "13px", outline: "none", boxSizing: "border-box"
              }}
            />
          </div>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e293b", display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {["All", ...CATEGORIES].map(cat => (
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
            {filteredTemplates.map(t => (
              <button
                key={t.id}
                onClick={() => { setSelectedTemplate(t); setGenerated(null); }}
                style={{
                  width: "100%", textAlign: "left", background: selectedTemplate?.id === t.id ? "#1e293b" : "transparent",
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
                  color: loading ? "#475569" : "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: 800, fontSize: "14px", letterSpacing: "-0.01em", transition: "all 0.2s"
                }}
              >
                {loading ? "Generating..." : `⚡ Generate Shorts Assets`}
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
              <div style={{ color: "#64748b", fontSize: "14px" }}>Generating your Shorts assets...</div>
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

              {/* Cards Row */}
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>
                  Screenshot Cards · 9:16 Format
                </div>
                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>

                  {/* Opening Card */}
                  <div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "8px", fontWeight: 600 }}>Opening Hook</div>
                    <div
                      ref={openCardRef}
                      style={{
                        width: "270px", height: "480px", borderRadius: "16px", overflow: "hidden",
                        background: `linear-gradient(160deg, ${selectedTemplate.color}dd 0%, #0a0a1a 60%)`,
                        display: "flex", flexDirection: "column", position: "relative",
                        border: "1px solid " + selectedTemplate.color + "44"
                      }}
                    >
                      {/* Noise texture overlay */}
                      <div style={{
                        position: "absolute", inset: 0, opacity: 0.03,
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"
                      }} />

                      {/* Top brand bar */}
                      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: selectedTemplate.color }} />
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                          VoteGenerator
                        </div>
                      </div>

                      {/* Main content */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "24px 24px" }}>
                        <div style={{ fontSize: "9px", fontWeight: 700, color: selectedTemplate.color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px", opacity: 0.9 }}>
                          {selectedTemplate.category}
                        </div>
                        <div style={{
                          fontSize: "28px", fontWeight: 900, lineHeight: 1.05,
                          color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "16px"
                        }}>
                          {generated.opening_hook}
                        </div>
                        <div style={{
                          fontSize: "13px", fontWeight: 500, color: "rgba(255,255,255,0.55)",
                          lineHeight: 1.4
                        }}>
                          {generated.opening_subtext}
                        </div>
                      </div>

                      {/* Bottom */}
                      <div style={{
                        padding: "20px 24px",
                        background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)"
                      }}>
                        <div style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          Free · No Signup Required
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ending Card */}
                  <div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "8px", fontWeight: 600 }}>Ending CTA</div>
                    <div
                      ref={endCardRef}
                      style={{
                        width: "270px", height: "480px", borderRadius: "16px", overflow: "hidden",
                        background: "linear-gradient(160deg, #0f172a 0%, #0a0a1a 100%)",
                        display: "flex", flexDirection: "column", position: "relative",
                        border: "1px solid #1e293b"
                      }}
                    >
                      {/* Glow */}
                      <div style={{
                        position: "absolute", bottom: "-60px", left: "50%", transform: "translateX(-50%)",
                        width: "200px", height: "200px", borderRadius: "50%",
                        background: selectedTemplate.color + "33", filter: "blur(60px)", pointerEvents: "none"
                      }} />

                      {/* Top */}
                      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: selectedTemplate.color }} />
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                          VoteGenerator
                        </div>
                      </div>

                      {/* Main */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "24px" }}>
                        <div style={{
                          width: "48px", height: "48px", borderRadius: "14px",
                          background: `linear-gradient(135deg, ${selectedTemplate.color}, ${selectedTemplate.color}99)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "24px", marginBottom: "24px"
                        }}>
                          {selectedTemplate.emoji}
                        </div>
                        <div style={{
                          fontSize: "26px", fontWeight: 900, lineHeight: 1.05,
                          color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "20px"
                        }}>
                          {generated.ending_headline}
                        </div>
                        <div style={{
                          display: "inline-block",
                          background: selectedTemplate.color + "22",
                          border: "1px solid " + selectedTemplate.color + "66",
                          borderRadius: "8px", padding: "8px 14px",
                          fontSize: "14px", fontWeight: 800, color: selectedTemplate.color,
                          letterSpacing: "-0.01em"
                        }}>
                          votegenerator.com
                        </div>
                      </div>

                      {/* Bottom */}
                      <div style={{ padding: "20px 24px" }}>
                        <div style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                          Free Survey Tool · 50,000+ Teams
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: "12px", fontSize: "12px", color: "#475569" }}>
                  💡 Right-click → Save image, or screenshot for best quality
                </div>
              </div>

              {/* Voiceover Script */}
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 700, fontSize: "14px" }}>🎙️ ElevenLabs Voiceover Script</div>
                  <CopyBtn text={generated.voiceover_script} label="script" />
                </div>
                <div style={{ padding: "20px", fontSize: "15px", lineHeight: 1.7, color: "#cbd5e1", whiteSpace: "pre-wrap", fontStyle: "italic" }}>
                  {generated.voiceover_script}
                </div>
              </div>

              {/* YouTube Metadata */}
              <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e293b" }}>
                  <div style={{ fontWeight: 700, fontSize: "14px" }}>📺 YouTube Metadata</div>
                </div>
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>

                  {/* Title */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" }}>Title</div>
                      <CopyBtn text={generated.youtube_title} label="title" />
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.4 }}>
                      {generated.youtube_title}
                    </div>
                    <div style={{ fontSize: "11px", color: "#334155", marginTop: "4px" }}>{generated.youtube_title?.length || 0}/100 chars</div>
                  </div>

                  {/* URL */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" }}>URL</div>
                      <CopyBtn text={`https://votegenerator.com/templates/${selectedTemplate.slug}/`} label="url" />
                    </div>
                    <div style={{ fontSize: "13px", color: "#6366f1", fontFamily: "monospace" }}>
                      https://votegenerator.com/templates/{selectedTemplate.slug}/
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" }}>Description</div>
                      <CopyBtn text={generated.youtube_description} label="desc" />
                    </div>
                    <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                      {generated.youtube_description}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", letterSpacing: "0.06em", textTransform: "uppercase" }}>Tags</div>
                      <CopyBtn text={generated.youtube_tags?.join(", ")} label="tags" />
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {generated.youtube_tags?.map((tag, i) => (
                        <span key={i} style={{
                          background: "#1e293b", border: "1px solid #334155",
                          borderRadius: "4px", padding: "3px 8px",
                          fontSize: "12px", color: "#64748b"
                        }}>
                          {tag}
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