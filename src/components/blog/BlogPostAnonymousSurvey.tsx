// ============================================================================
// BlogPost: Is Your Work Survey Actually Anonymous?
// Route: /blog/is-your-work-survey-anonymous
// ============================================================================

import React from 'react';
import BlogLayout, { Callout, CTABox } from './BlogLayout';
import { Shield, Eye, EyeOff, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const BlogPostAnonymousSurvey: React.FC = () => {
    return (
        <BlogLayout
            title="Is Your Work Survey Actually Anonymous?"
            subtitle="What your employer can see, what 'confidential' really means, and how to tell the difference."
            publishDate="January 6, 2026"
            readTime="6 min read"
            category="Employee Surveys"
            categoryColor="bg-emerald-500/10 text-emerald-600"
            ctaTitle="Need a truly anonymous survey?"
            ctaDescription="Our Anonymous Mode hides individual responses. Even you can't see who said what."
            ctaButtonText="Create Anonymous Survey"
            ctaButtonLink="/survey?template=employee-engagement"
        >
            <p className="text-xl text-slate-600 leading-relaxed">
                You just got an email from HR. <em>"We value your feedback! Please complete this anonymous employee survey."</em>
            </p>
            
            <p>
                You hover over the link. You've heard the stories. Sarah from accounting was "anonymous" until her complaint about management somehow ended up in her performance review. Or was that just a rumor?
            </p>
            
            <p>
                You're Googling "is Qualtrics survey anonymous" or "can my boss see my survey answers" at 11pm. 
            </p>
            
            <p><strong>We get it. Let's cut through the corporate speak.</strong></p>

            <h2>The Short Answer</h2>
            
            <p><strong>It depends entirely on how the survey was set up.</strong></p>
            
            <p>
                Most enterprise survey tools (Qualtrics, SurveyMonkey, Culture Amp) <em>can</em> be configured to be anonymous. But they can also be configured to track everything. The person who created the survey made that choice—not the software.
            </p>
            
            <p>
                Here's the uncomfortable truth: <strong>you usually have no way to verify which setting they chose.</strong>
            </p>

            <h2>What Your Company Can See</h2>
            
            <p>When a survey is NOT set up as anonymous, administrators can typically see:</p>
            
            {/* Visual List */}
            <div className="my-8 grid gap-3">
                {[
                    'Your email address (if you clicked a personalized link)',
                    'Your name (if SSO/single sign-on was required)',
                    'Your IP address (identifies your device/location)',
                    'Timestamp of when you submitted',
                    'Time spent on each question',
                    'Your department/team (from HR system integration)',
                ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-red-50 rounded-xl">
                        <Eye className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                        <span className="text-slate-700">{item}</span>
                    </div>
                ))}
            </div>
            
            <p>
                Even if they pinky-promise not to look, <strong>the data exists</strong>. And data that exists can be accessed, subpoenaed, or leaked.
            </p>

            <Callout type="warning" title="The Personalized Link Problem">
                If you received a unique survey link (like <code>survey.com/abc123xyz</code>), that link is tied to your identity. The survey might SAY it's anonymous, but your response is connected to your email the moment you click.
            </Callout>

            <h2>Anonymous vs Confidential</h2>
            
            <p>Companies love to blur these terms. Here's the difference:</p>
            
            {/* Comparison Cards */}
            <div className="my-8 grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <div className="flex items-center gap-2 mb-3">
                        <EyeOff className="text-emerald-600" size={24} />
                        <h4 className="font-bold text-emerald-900 text-lg">Anonymous</h4>
                    </div>
                    <p className="text-emerald-800">
                        <strong>No one</strong> can see who said what. Not HR. Not your manager. Not even the survey administrator. The connection between your identity and your response doesn't exist.
                    </p>
                </div>
                
                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200">
                    <div className="flex items-center gap-2 mb-3">
                        <Eye className="text-amber-600" size={24} />
                        <h4 className="font-bold text-amber-900 text-lg">Confidential</h4>
                    </div>
                    <p className="text-amber-800">
                        Someone <strong>CAN</strong> see who said what, but they promise not to share it. Your identity is collected but supposedly protected.
                    </p>
                </div>
            </div>
            
            <p>
                <strong>"Confidential" is a policy. "Anonymous" is a technical reality.</strong>
            </p>
            
            <p>
                When your company says "your responses are confidential," they're saying: <em>"We'll know it's you, but we promise to be cool about it."</em>
            </p>
            
            <p>Do you trust that promise?</p>

            <h2>How to Tell If It's Actually Anonymous</h2>
            
            <h3>🚩 Red Flags (Probably NOT Anonymous)</h3>
            
            <div className="my-6 grid gap-2">
                {[
                    'You had to log in with your work email or SSO',
                    'Personalized link in your email (unique URL)',
                    'Asks for your department, team, or manager',
                    'Asks demographic questions that narrow you down',
                    '"Confidential" language instead of "anonymous"',
                    'No clear statement about what data is collected',
                ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                        <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                        <span className="text-slate-700">{item}</span>
                    </div>
                ))}
            </div>
            
            <h3>✅ Signs It Might Be Truly Anonymous</h3>
            
            <div className="my-6 grid gap-2">
                {[
                    'Generic link shared with everyone (same URL for all)',
                    'No login required',
                    'Clear statement that individual responses cannot be viewed',
                    'Third-party tool that the company doesn\'t administer',
                    'No identifying questions (or optional only)',
                ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                        <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={18} />
                        <span className="text-slate-700">{item}</span>
                    </div>
                ))}
            </div>

            <Callout type="tip" title="The Small Team Problem">
                Even a truly anonymous survey can become identifiable if your team is small. If there are only 3 people in your department and the results are broken down by department... you're not anonymous.
            </Callout>

            <h2>Should You Be Honest?</h2>
            
            <p>That's your call. But here's a framework:</p>
            
            <p><strong>If the survey is truly anonymous</strong> (no login, generic link, no identifying questions): Be honest. That's the whole point. Vague, watered-down feedback helps no one.</p>
            
            <p><strong>If you're not sure:</strong> Be honest about general topics, vague about specifics. "Communication could be better" instead of "My manager Dave never responds to Slack."</p>
            
            <p><strong>If there are red flags:</strong> Assume someone can read it with your name attached. Answer accordingly.</p>

            <h2>What Actually Anonymous Looks Like</h2>
            
            <p>
                We built VoteGenerator with this paranoia in mind. Here's how our Anonymous Mode works:
            </p>
            
            <div className="my-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                        <Shield className="text-white" size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-emerald-900">Anonymous Mode</h4>
                        <p className="text-emerald-700 text-sm">Even the survey creator can't see who said what</p>
                    </div>
                </div>
                
                <div className="space-y-3">
                    {[
                        'No login required — respondents don\'t enter their email',
                        'Individual responses are hidden — only aggregate data shown',
                        'Timestamps are hidden — can\'t figure out who submitted when',
                        'Text responses are shuffled — open feedback is randomized',
                        'Cannot be changed after responses start — no switching mid-survey',
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <CheckCircle className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
                            <span className="text-emerald-800">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <p>
                The difference: in Anonymous Mode, we don't just promise not to show individual responses. <strong>The survey creator literally cannot access them.</strong> There's no secret admin panel. No "export all" button that reveals identities.
            </p>

            <CTABox 
                variant="inline"
                title="Try Anonymous Mode"
                description="Create an employee survey where even you can't see who said what."
                buttonText="Create Anonymous Survey"
                buttonLink="/survey?template=employee-engagement"
            />

            <h2>The Bottom Line</h2>
            
            <p>
                Your paranoia isn't unfounded. Many "anonymous" surveys aren't. The word gets thrown around loosely, and employees have learned to be skeptical.
            </p>
            
            <p>
                <strong>If you're an employee:</strong> Look for the red flags. Use your judgment.
            </p>
            
            <p>
                <strong>If you're running surveys:</strong> Earn trust by being transparent about what you can and can't see. Or better yet, use a tool that makes true anonymity the default—so employees don't have to take your word for it.
            </p>
            
            <p>
                Real feedback requires real trust. And real trust requires real anonymity.
            </p>

        </BlogLayout>
    );
};

export default BlogPostAnonymousSurvey;