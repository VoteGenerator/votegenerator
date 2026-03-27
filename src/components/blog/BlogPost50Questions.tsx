// ============================================================================
// BlogPost: 50 Employee Survey Questions That Get Honest Answers
// CTA Strategy: After intro, after question 20, after question 40, end
// ============================================================================

import React, { useEffect } from 'react';
import BlogLayout, { EarlyCTA, InlineCTA, EndCTA, Callout, QuestionItem } from './BlogLayout';

// Clean section header
const Section: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
    <div className="my-12">
        <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
            <p className="text-slate-500 text-sm">{subtitle}</p>
        </div>
        <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 px-5">
            {children}
        </div>
    </div>
);

const BlogPost50Questions: React.FC = () => {

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = 'https://votegenerator.com/blog/employee-survey-questions';
        document.head.appendChild(link);
        return () => { document.head.removeChild(link); };
    }, []);

    return (
        <BlogLayout
            title="50 Employee Survey Questions That Get Honest Answers"
            subtitle="Copy-paste ready. Organized by category. No corporate fluff."
            publishDate="Jan 6, 2026"
            readTime="12 min read"
            category="Templates"
            floatingCTA="Use these questions"
            ctaLink="/survey?template=employee-engagement"
        >
            {/* Intro */}
            <p>
                Most employee surveys get garbage responses. Vague questions get vague answers. Surveys that take 30 minutes get abandoned at question 12.
            </p>
            
            <p>
                Here are 50 questions that actually work—organized by category, ready to copy.
            </p>

            {/* EARLY CTA */}
            <EarlyCTA 
                text="Don't want to build from scratch?"
                subtext="Our Employee Engagement template includes the top 10 questions, ready to send."
                buttonText="Use the template"
                href="/survey?template=employee-engagement"
            />

            <h2>Before You Start</h2>
            
            <p><strong>1. Keep it under 15 questions.</strong> Pick what matters most.</p>
            <p><strong>2. Make it anonymous.</strong> If people think answers can be traced, they'll tell you what you want to hear.</p>
            <p><strong>3. Tell people what you'll do with results.</strong> If nothing will change, don't bother asking.</p>

            <Callout type="info">
                <strong>Question types:</strong> Scale (1-5) for tracking trends. Multiple choice for specific answers. Open-ended for context (use sparingly).
            </Callout>

            {/* SECTION 1: Engagement */}
            <Section title="Engagement & Satisfaction" subtitle="Start here. Overall health check.">
                <QuestionItem number={1} question="How likely are you to recommend this company as a great place to work?" type="0-10 scale" tip="Track quarterly" />
                <QuestionItem number={2} question="Overall, how satisfied are you with your job?" type="1-5 scale" />
                <QuestionItem number={3} question="I feel motivated to do my best work every day." type="Agree/Disagree" />
                <QuestionItem number={4} question="I see myself working here in two years." type="Agree/Disagree" tip="Retention warning" />
                <QuestionItem number={5} question="I would recommend my team to a friend looking for a job." type="Agree/Disagree" />
                <QuestionItem number={6} question="I feel proud to work for this company." type="Agree/Disagree" />
            </Section>

            {/* SECTION 2: Manager */}
            <Section title="Manager & Leadership" subtitle="#1 predictor of satisfaction.">
                <QuestionItem number={7} question="My manager gives me clear expectations for my work." type="Agree/Disagree" />
                <QuestionItem number={8} question="My manager provides regular feedback on my performance." type="Agree/Disagree" />
                <QuestionItem number={9} question="My manager cares about my wellbeing as a person." type="Agree/Disagree" />
                <QuestionItem number={10} question="I feel comfortable giving honest feedback to my manager." type="Agree/Disagree" tip="If low, survey answers are filtered" />
                <QuestionItem number={11} question="My manager supports my career development." type="Agree/Disagree" />
                <QuestionItem number={12} question="My manager handles conflicts fairly." type="Agree/Disagree" />
                <QuestionItem number={13} question="I trust senior leadership to make good decisions." type="Agree/Disagree" />
                <QuestionItem number={14} question="Leadership communicates a clear vision." type="Agree/Disagree" />
            </Section>

            {/* SECTION 3: Growth */}
            <Section title="Growth & Development" subtitle="People leave when they stop growing.">
                <QuestionItem number={15} question="I have opportunities to learn and grow in my role." type="Agree/Disagree" />
                <QuestionItem number={16} question="I have a clear understanding of my career path here." type="Agree/Disagree" />
                <QuestionItem number={17} question="The company invests in my professional development." type="Agree/Disagree" />
                <QuestionItem number={18} question="I receive the training I need to do my job well." type="Agree/Disagree" />
                <QuestionItem number={19} question="My skills are being fully utilized." type="Agree/Disagree" tip="Low = boredom" />
                <QuestionItem number={20} question="I've had career conversations in the past 6 months." type="Yes/No" />
            </Section>

            {/* MID CTA - After question 20 */}
            <InlineCTA 
                text="These 20 questions are built into our template."
                buttonText="Use them now"
                href="/survey?template=employee-engagement"
            />

            {/* SECTION 4: Environment */}
            <Section title="Work Environment" subtitle="Day-to-day reality.">
                <QuestionItem number={21} question="I have the tools and resources I need." type="Agree/Disagree" />
                <QuestionItem number={22} question="My team collaborates effectively." type="Agree/Disagree" />
                <QuestionItem number={23} question="I feel like I belong here." type="Agree/Disagree" tip="Key inclusion metric" />
                <QuestionItem number={24} question="Different perspectives are valued on my team." type="Agree/Disagree" />
                <QuestionItem number={25} question="I can be myself at work." type="Agree/Disagree" />
                <QuestionItem number={26} question="My workplace is free from harassment." type="Agree/Disagree" />
                <QuestionItem number={27} question="I feel physically safe at work." type="Agree/Disagree" />
                <QuestionItem number={28} question="Meetings are generally productive." type="Agree/Disagree" tip="Low = meeting problem" />
            </Section>

            {/* SECTION 5: Communication */}
            <Section title="Communication" subtitle="Root of most workplace issues.">
                <QuestionItem number={29} question="I receive the information I need to do my job." type="Agree/Disagree" />
                <QuestionItem number={30} question="Communication between departments works well." type="Agree/Disagree" />
                <QuestionItem number={31} question="I feel informed about important company decisions." type="Agree/Disagree" />
                <QuestionItem number={32} question="I feel comfortable speaking up with ideas or concerns." type="Agree/Disagree" tip="Psychological safety" />
                <QuestionItem number={33} question="When I share feedback, I feel like it's heard." type="Agree/Disagree" />
                <QuestionItem number={34} question="Changes are communicated with enough notice." type="Agree/Disagree" />
            </Section>

            {/* SECTION 6: Recognition */}
            <Section title="Recognition & Compensation" subtitle="People won't say 'pay me more' but will show it here.">
                <QuestionItem number={35} question="I feel recognized for my contributions." type="Agree/Disagree" />
                <QuestionItem number={36} question="Recognition is given fairly across the team." type="Agree/Disagree" />
                <QuestionItem number={37} question="I feel fairly compensated for my work." type="Agree/Disagree" />
                <QuestionItem number={38} question="I understand how compensation decisions are made." type="Agree/Disagree" tip="Low transparency = low trust" />
                <QuestionItem number={39} question="The benefits package meets my needs." type="Agree/Disagree" />
                <QuestionItem number={40} question="Good performance is rewarded here." type="Agree/Disagree" />
            </Section>

            {/* MID CTA - After question 40 */}
            <InlineCTA 
                text="Pick 10-15 questions that matter most to you."
                buttonText="Create your survey"
                href="/survey?template=employee-engagement"
            />

            {/* SECTION 7: Work-life */}
            <Section title="Work-Life Balance" subtitle="Burnout is expensive. Catch it early.">
                <QuestionItem number={41} question="I can maintain healthy work-life balance." type="Agree/Disagree" />
                <QuestionItem number={42} question="My workload is manageable." type="Agree/Disagree" />
                <QuestionItem number={43} question="I feel comfortable taking time off when needed." type="Agree/Disagree" />
                <QuestionItem number={44} question="I'm not expected to respond outside work hours." type="Agree/Disagree" />
                <QuestionItem number={45} question="The company genuinely cares about employee wellbeing." type="Agree/Disagree" />
            </Section>

            {/* SECTION 8: Open-ended */}
            <Section title="Open-Ended Questions" subtitle="Use 1-2 max. These surface surprises.">
                <QuestionItem number={46} question="What's one thing we could do to make this a better place to work?" type="Open text" tip="Always include this" />
                <QuestionItem number={47} question="What's working well that we should keep doing?" type="Open text" />
                <QuestionItem number={48} question="Is there anything else you'd like to share?" type="Open text" />
                <QuestionItem number={49} question="If you could change one thing about your day-to-day, what would it be?" type="Open text" />
                <QuestionItem number={50} question="What would make you stay? What would make you leave?" type="Open text" tip="Direct retention intel" />
            </Section>

            <Callout type="tip">
                <strong>Make open-ended questions optional.</strong> Forced responses get you "n/a" or garbage.
            </Callout>

            <h2>Questions to Avoid</h2>
            
            <ul>
                <li><strong>"Are you happy?"</strong> — Too vague</li>
                <li><strong>"Rate your manager 1-10"</strong> — No context, creates anxiety</li>
                <li><strong>Demographics with small teams</strong> — Makes people identifiable</li>
                <li><strong>Anything you won't act on</strong> — Don't ask about snacks if nothing will change</li>
            </ul>

            <h2>How to Use These</h2>
            
            <ol>
                <li>Pick 10-15 questions from relevant categories</li>
                <li>Always include #1 (NPS) — your north star metric</li>
                <li>Include 1-2 open-ended at the end</li>
                <li>Run anonymously for honest answers</li>
                <li>Share results within 2 weeks</li>
                <li>Commit to 1-2 concrete actions</li>
            </ol>
            
            <p>
                <strong>Surveys work when people believe they matter.</strong> The best way to get good responses next time? Show them what you did with the responses this time.
            </p>

            {/* END CTA */}
            <EndCTA 
                title="Create your employee survey"
                subtitle="Template with top questions. Anonymous mode. Ready in 2 minutes."
                buttonText="Create survey — free"
                href="/survey?template=employee-engagement"
            />

        </BlogLayout>
    );
};

export default BlogPost50Questions;