// ============================================================================
// BlogPost: Is Your Work Survey Actually Anonymous?
// Route: /blog/is-your-work-survey-anonymous
// Target: "qualtrics survey anonymous" + employee paranoia searches
// ============================================================================

import React from 'react';
import BlogLayout, { Callout, CTABox } from './BlogLayout';

const tableOfContents = [
    { id: 'short-answer', title: 'The Short Answer', level: 1 as const },
    { id: 'what-companies-see', title: 'What Your Company Can See', level: 1 as const },
    { id: 'anonymous-vs-confidential', title: 'Anonymous vs Confidential', level: 1 as const },
    { id: 'how-to-tell', title: 'How to Tell If Yours Is Anonymous', level: 1 as const },
    { id: 'should-you-be-honest', title: 'Should You Be Honest?', level: 1 as const },
    { id: 'actually-anonymous', title: 'What Actually Anonymous Looks Like', level: 1 as const },
];

const BlogPostAnonymousSurvey: React.FC = () => {
    return (
        <BlogLayout
            title="Is Your Work Survey Actually Anonymous?"
            subtitle="What your employer can see, what 'confidential' really means, and how to tell the difference."
            publishDate="January 6, 2026"
            readTime="6 min read"
            category="Employee Surveys"
            categoryColor="bg-emerald-100 text-emerald-700"
            tableOfContents={tableOfContents}
            ctaTitle="Need a truly anonymous survey?"
            ctaDescription="Anonymous Mode hides individual responses. Even you can't see who said what."
            ctaButtonText="Create Anonymous Survey"
            ctaButtonLink="/survey?template=employee-engagement"
        >
            <p className="text-xl text-slate-600 leading-relaxed">
                You just got an email from HR. "We value your feedback! Please complete this anonymous employee survey."
            </p>
            
            <p>
                You hover over the link. You've heard the stories. Sarah from accounting was "anonymous" until her complaint about management showed up in her performance review. Or was that just a rumor?
            </p>
            
            <p>
                You're Googling "is Qualtrics survey anonymous" or "can my boss see my survey answers" at 11pm. We get it.
            </p>
            
            <p>
                Let's cut through the corporate speak and tell you what's actually going on.
            </p>

            <h2 id="short-answer">The Short Answer</h2>
            
            <p><strong>It depends on how the survey was set up.</strong></p>
            
            <p>
                Most enterprise survey tools (Qualtrics, SurveyMonkey, Culture Amp, etc.) <em>can</em> be configured to be anonymous. But they can also be configured to track everything. The person who created the survey made that choice—not the software.
            </p>
            
            <p>
                Here's the uncomfortable truth: you usually have no way to verify which setting they chose.
            </p>

            <h2 id="what-companies-see">What Your Company Can See (In Most Tools)</h2>
            
            <p>When a survey is NOT set up as anonymous, administrators can typically see:</p>
            
            <ul>
                <li><strong>Your email address</strong> (if you clicked a personalized link)</li>
                <li><strong>Your name</strong> (if SSO/single sign-on was required)</li>
                <li><strong>Your IP address</strong> (which can identify your device/location)</li>
                <li><strong>Timestamp</strong> of when you submitted</li>
                <li><strong>Time spent</strong> on each question</li>
                <li><strong>Your department/team</strong> (from HR system integration)</li>
            </ul>
            
            <p>
                Even if they pinky-promise not to look, the data exists. And data that exists can be accessed, subpoenaed, or leaked.
            </p>

            <Callout type="warning" title="The Personalized Link Problem">
                If you received a unique survey link (like survey.com/abc123xyz), that link is tied to your identity. 
                The survey might SAY it's anonymous, but your response is connected to your email the moment you click.
            </Callout>

            <h2 id="anonymous-vs-confidential">Anonymous vs Confidential: They're Not the Same</h2>
            
            <p>Companies love to blur these terms. Here's the difference:</p>
            
            <p>
                <strong>Anonymous</strong> = No one can see who said what. Not HR. Not your manager. Not even the survey administrator. The connection between your identity and your response doesn't exist.
            </p>
            
            <p>
                <strong>Confidential</strong> = Someone CAN see who said what, but they promise not to share it. Your identity is collected but supposedly protected.
            </p>
            
            <p>
                "Confidential" is a policy. "Anonymous" is a technical reality.
            </p>
            
            <p>
                When your company says "your responses are confidential," they're saying: "We'll know it's you, but we promise to be cool about it."
            </p>
            
            <p>
                Do you trust that promise?
            </p>

            <h2 id="how-to-tell">How to Tell If Your Survey Is Actually Anonymous</h2>
            
            <p>Here are some red flags that suggest a survey is NOT truly anonymous:</p>
            
            <h3>🚩 Red Flags</h3>
            
            <ul>
                <li><strong>You had to log in</strong> with your work email or SSO</li>
                <li><strong>Personalized link</strong> in your email (unique URL)</li>
                <li><strong>Asks for your department, team, or manager</strong> (small team? You're identifiable)</li>
                <li><strong>Asks demographic questions</strong> that narrow you down (you're the only 28-year-old in Marketing)</li>
                <li><strong>"Confidential" language</strong> instead of "anonymous"</li>
                <li><strong>No clear statement</strong> about what data is collected</li>
            </ul>
            
            <h3>✅ Signs It Might Be Truly Anonymous</h3>
            
            <ul>
                <li><strong>Generic link</strong> shared with everyone (same URL for all)</li>
                <li><strong>No login required</strong></li>
                <li><strong>Clear statement</strong> that individual responses cannot be viewed</li>
                <li><strong>Third-party tool</strong> that the company doesn't administer</li>
                <li><strong>No identifying questions</strong> (or optional only)</li>
            </ul>

            <Callout type="tip" title="The Small Team Problem">
                Even a truly anonymous survey can become identifiable if your team is small. If there are only 3 people in your department and the results are broken down by department... you're not anonymous. Period.
            </Callout>

            <h2 id="should-you-be-honest">Should You Be Honest?</h2>
            
            <p>That's your call. But here's a framework:</p>
            
            <p><strong>If the survey is truly anonymous</strong> (no login, generic link, no identifying questions): Be honest. That's the whole point. Vague, watered-down feedback helps no one.</p>
            
            <p><strong>If you're not sure:</strong> Be honest about general topics, vague about specifics. "Communication could be better" instead of "My manager Dave never responds to Slack."</p>
            
            <p><strong>If there are red flags:</strong> Assume someone can read it with your name attached. Answer accordingly.</p>
            
            <p>
                The sad reality: employees have been burned enough times that even legitimate anonymous surveys get sanitized, useless responses. Companies lose out on real feedback because trust is broken.
            </p>

            <h2 id="actually-anonymous">What Actually Anonymous Looks Like</h2>
            
            <p>
                We built VoteGenerator with this paranoia in mind. Here's how our Anonymous Mode works:
            </p>
            
            <ul>
                <li><strong>No login required</strong> — respondents don't enter their email</li>
                <li><strong>Individual responses are hidden</strong> — even the survey creator only sees aggregate data</li>
                <li><strong>Timestamps are hidden</strong> — can't figure out who submitted when</li>
                <li><strong>Text responses are shuffled</strong> — open-ended feedback is randomized, not shown in submission order</li>
                <li><strong>Cannot be changed after responses start</strong> — no switching to "identified" mode mid-survey</li>
            </ul>
            
            <p>
                The difference: in Anonymous Mode, we don't just promise not to show individual responses. <strong>The survey creator literally cannot access them.</strong> There's no secret admin panel. No "export all" button that reveals identities. The data structure doesn't connect responses to individuals.
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
                If you're an employee: look for the red flags. Use your judgment.
            </p>
            
            <p>
                If you're running surveys: earn trust by being transparent about what you can and can't see. Or better yet, use a tool that makes true anonymity the default—so employees don't have to take your word for it.
            </p>
            
            <p>
                Real feedback requires real trust. And real trust requires real anonymity.
            </p>

        </BlogLayout>
    );
};

export default BlogPostAnonymousSurvey;