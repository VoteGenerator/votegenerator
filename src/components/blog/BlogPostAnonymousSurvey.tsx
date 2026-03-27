// ============================================================================
// BlogPost: Is Your Work Survey Actually Anonymous?
// CTA Strategy: After intro, mid-content, end
// ============================================================================

import React from 'react';
import BlogLayout, { EarlyCTA, InlineCTA, EndCTA, Callout } from './BlogLayout';
import { Eye, EyeOff, Check, X } from 'lucide-react';

useEffect(() => {
  const link = document.createElement('link');
  link.rel = 'canonical';
  link.href = 'https://votegenerator.com/blog/employee-survey-questions';
  document.head.appendChild(link);
  return () => { document.head.removeChild(link); };
}, []);



const BlogPostAnonymousSurvey: React.FC = () => {
    return (
        <BlogLayout
            title="Is Your Work Survey Actually Anonymous?"
            subtitle="What your employer can see, what 'confidential' really means, and how to tell the difference."
            publishDate="Jan 6, 2026"
            readTime="6 min read"
            category="Employee Surveys"
            floatingCTA="Create anonymous survey"
            ctaLink="/survey?template=employee-engagement"
        >
            {/* Intro */}
            <p>
                You just got an email from HR. <em>"We value your feedback! Please complete this anonymous employee survey."</em>
            </p>
            
            <p>
                You hover over the link. You've heard the stories. Sarah from accounting was "anonymous" until her complaint about management showed up in her performance review.
            </p>
            
            <p>
                You're Googling "is Qualtrics survey anonymous" at 11pm. We get it.
            </p>
            
            <p><strong>Let's cut through the corporate speak.</strong></p>

            {/* EARLY CTA - After intro, before first H2 */}
            <EarlyCTA 
                text="Need a survey that's actually anonymous?"
                subtext="No signup. No email required. Anonymous Mode hides individual responses."
                buttonText="Create in 2 minutes"
                href="/survey?template=employee-engagement"
            />

            <h2>The Short Answer</h2>
            
            <p>
                <strong>It depends entirely on how the survey was set up.</strong>
            </p>
            
            <p>
                Most enterprise survey tools can be configured to be anonymous. But they can also track everything. The person who created the survey made that choice—not the software.
            </p>
            
            <p>
                The uncomfortable truth: <strong>you usually have no way to verify which setting they chose.</strong>
            </p>

            <h2>What Your Company Can See</h2>
            
            <p>When a survey is NOT anonymous, administrators can typically see:</p>
            
            <ul>
                <li>Your email address (if you clicked a personalized link)</li>
                <li>Your name (if SSO was required)</li>
                <li>Your IP address</li>
                <li>Timestamp of when you submitted</li>
                <li>Your department (from HR system integration)</li>
            </ul>
            
            <p>
                Even if they promise not to look, <strong>the data exists</strong>. Data that exists can be accessed, subpoenaed, or leaked.
            </p>

            <Callout type="warning">
                <strong>The Personalized Link Problem:</strong> If you received a unique survey link (like <code>survey.com/abc123xyz</code>), that link is tied to your identity. The survey might SAY anonymous, but your response is connected to your email the moment you click.
            </Callout>

            <h2>Anonymous vs Confidential</h2>
            
            <p>Companies blur these terms. Here's the difference:</p>
            
            {/* Clean comparison */}
            <div className="my-8 grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-emerald-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <EyeOff className="text-emerald-600" size={20} />
                        <span className="font-bold text-emerald-900">Anonymous</span>
                    </div>
                    <p className="text-emerald-800 text-[15px]">
                        No one can see who said what. The connection doesn't exist.
                    </p>
                </div>
                
                <div className="p-6 bg-amber-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <Eye className="text-amber-600" size={20} />
                        <span className="font-bold text-amber-900">Confidential</span>
                    </div>
                    <p className="text-amber-800 text-[15px]">
                        Someone CAN see who said what, but they promise not to share.
                    </p>
                </div>
            </div>
            
            <p>
                "Confidential" is a policy. "Anonymous" is a technical reality.
            </p>

            <h2>How to Tell If It's Actually Anonymous</h2>
            
            <h3>🚩 Red Flags</h3>
            
            <div className="my-6 space-y-2">
                {[
                    'You had to log in with your work email',
                    'Personalized link in your email',
                    'Asks for your department or manager',
                    'Uses "confidential" instead of "anonymous"',
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                        <X className="text-red-500 flex-shrink-0" size={18} />
                        <span className="text-slate-700">{item}</span>
                    </div>
                ))}
            </div>
            
            <h3>✓ Good Signs</h3>
            
            <div className="my-6 space-y-2">
                {[
                    'Generic link shared with everyone',
                    'No login required',
                    'Clear statement: "individual responses cannot be viewed"',
                    'No identifying questions',
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                        <Check className="text-emerald-500 flex-shrink-0" size={18} />
                        <span className="text-slate-700">{item}</span>
                    </div>
                ))}
            </div>

            <Callout type="tip">
                <strong>The Small Team Problem:</strong> Even a truly anonymous survey becomes identifiable if your team is small. 3 people in your department + results by department = not anonymous.
            </Callout>

            {/* MID-CONTENT CTA */}
            <InlineCTA 
                text="Want real anonymity? Try Anonymous Mode."
                buttonText="See how it works"
                href="/survey?template=employee-engagement"
            />

            <h2>Should You Be Honest?</h2>
            
            <p><strong>If truly anonymous:</strong> Be honest. That's the point.</p>
            
            <p><strong>If you're not sure:</strong> Be honest about general topics, vague about specifics.</p>
            
            <p><strong>If there are red flags:</strong> Assume someone can read it with your name attached.</p>

            <h2>What Actually Anonymous Looks Like</h2>
            
            <p>We built VoteGenerator with this paranoia in mind. Our Anonymous Mode:</p>
            
            <div className="my-6 space-y-2">
                {[
                    'No login required — respondents don\'t enter their email',
                    'Individual responses hidden — only aggregate data shown',
                    'Timestamps hidden — can\'t figure out who submitted when',
                    'Text responses shuffled — feedback is randomized',
                    'Can\'t be changed after responses start',
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                        <Check className="text-emerald-500 flex-shrink-0" size={18} />
                        <span className="text-slate-700">{item}</span>
                    </div>
                ))}
            </div>
            
            <p>
                The difference: <strong>the survey creator literally cannot access individual responses.</strong> No secret admin panel. No "export all" button.
            </p>

            <h2>The Bottom Line</h2>
            
            <p>
                Your paranoia isn't unfounded. Many "anonymous" surveys aren't.
            </p>
            
            <p>
                <strong>If you're an employee:</strong> Look for the red flags.
            </p>
            
            <p>
                <strong>If you're running surveys:</strong> Use a tool that makes true anonymity the default—so employees don't have to take your word for it.
            </p>

            {/* END CTA */}
            <EndCTA 
                title="Create a truly anonymous survey"
                subtitle="Anonymous Mode hides individual responses. Even you can't see who said what."
                buttonText="Create in 2 minutes — free"
                href="/survey?template=employee-engagement"
            />

        </BlogLayout>
    );
};

export default BlogPostAnonymousSurvey;