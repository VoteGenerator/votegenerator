// ============================================================================
// BlogPost: 50 Employee Survey Questions That Get Honest Answers
// Route: /blog/employee-survey-questions
// Target: employee survey questions, employee satisfaction survey questions,
//         staff satisfaction survey questions, etc.
// ============================================================================

import React from 'react';
import BlogLayout, { Callout, CTABox, QuestionItem } from './BlogLayout';

const tableOfContents = [
    { id: 'before-you-start', title: 'Before You Start', level: 1 as const },
    { id: 'engagement-satisfaction', title: 'Engagement & Satisfaction', level: 1 as const },
    { id: 'manager-leadership', title: 'Manager & Leadership', level: 1 as const },
    { id: 'growth-development', title: 'Growth & Development', level: 1 as const },
    { id: 'work-environment', title: 'Work Environment', level: 1 as const },
    { id: 'communication', title: 'Communication', level: 1 as const },
    { id: 'recognition-compensation', title: 'Recognition & Compensation', level: 1 as const },
    { id: 'work-life-balance', title: 'Work-Life Balance', level: 1 as const },
    { id: 'open-ended', title: 'Open-Ended Questions', level: 1 as const },
    { id: 'questions-to-avoid', title: 'Questions to Avoid', level: 1 as const },
];

const BlogPost50Questions: React.FC = () => {
    return (
        <BlogLayout
            title="50 Employee Survey Questions That Get Honest Answers"
            subtitle="Copy-paste ready questions organized by category. No corporate fluff."
            publishDate="January 6, 2026"
            readTime="12 min read"
            category="Employee Surveys"
            categoryColor="bg-emerald-100 text-emerald-700"
            tableOfContents={tableOfContents}
            ctaTitle="Ready to send your survey?"
            ctaDescription="Use our Employee Engagement template with these questions built in."
            ctaButtonText="Create Employee Survey"
            ctaButtonLink="/survey?template=employee-engagement"
        >
            <p className="text-xl text-slate-600 leading-relaxed">
                Most employee surveys get garbage responses. Vague questions get vague answers. Leading questions get the answers you wanted to hear. And surveys that take 30 minutes get abandoned at question 12.
            </p>
            
            <p>
                Here are 50 questions that actually work—organized by category, with the question type and a note on why each one matters.
            </p>

            <h2 id="before-you-start">Before You Start: Three Rules</h2>
            
            <p><strong>1. Keep it under 15 questions.</strong> Nobody wants to fill out a 50-question survey. Pick the 10-15 that matter most for what you're trying to learn.</p>
            
            <p><strong>2. Make it actually anonymous.</strong> If people think their answers can be traced back to them, they'll tell you what you want to hear. <a href="/blog/is-your-work-survey-anonymous">Here's how to tell if your survey is truly anonymous.</a></p>
            
            <p><strong>3. Tell people what you'll do with the results.</strong> "We're collecting feedback" is not enough. Will you share results? Act on them? When? If people don't believe anything will change, they won't bother giving real feedback.</p>

            <Callout type="tip" title="Question Types">
                <strong>Scale (1-5 or 1-10)</strong> — Best for tracking trends over time<br/>
                <strong>Multiple choice</strong> — Best for specific, actionable answers<br/>
                <strong>Open-ended</strong> — Best for context and surprises (use sparingly)
            </Callout>

            {/* ================================================================ */}
            {/* ENGAGEMENT & SATISFACTION */}
            {/* ================================================================ */}
            
            <h2 id="engagement-satisfaction">Engagement & Overall Satisfaction</h2>
            
            <p>Start here. These tell you the overall health of your workplace.</p>

            <div className="bg-slate-50 rounded-2xl p-6 my-6">
                <QuestionItem 
                    number={1} 
                    question="How likely are you to recommend this company as a great place to work?" 
                    type="Scale 0-10 (NPS)"
                    tip="The classic. Track this quarterly."
                />
                <QuestionItem 
                    number={2} 
                    question="Overall, how satisfied are you with your job?" 
                    type="Scale 1-5"
                />
                <QuestionItem 
                    number={3} 
                    question="I feel motivated to do my best work every day." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={4} 
                    question="I see myself working here in two years." 
                    type="Scale 1-5 (Agree/Disagree)"
                    tip="Early warning for retention issues"
                />
                <QuestionItem 
                    number={5} 
                    question="I would recommend my team to a friend looking for a job." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={6} 
                    question="I feel proud to work for this company." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
            </div>

            {/* ================================================================ */}
            {/* MANAGER & LEADERSHIP */}
            {/* ================================================================ */}
            
            <h2 id="manager-leadership">Manager & Leadership</h2>
            
            <p>Manager quality is the #1 predictor of employee satisfaction. Don't skip this section.</p>

            <div className="bg-slate-50 rounded-2xl p-6 my-6">
                <QuestionItem 
                    number={7} 
                    question="My manager gives me clear expectations for my work." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={8} 
                    question="My manager provides regular feedback on my performance." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={9} 
                    question="My manager cares about my wellbeing as a person." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={10} 
                    question="I feel comfortable giving honest feedback to my manager." 
                    type="Scale 1-5 (Agree/Disagree)"
                    tip="If this is low, your survey might get filtered answers"
                />
                <QuestionItem 
                    number={11} 
                    question="My manager supports my career development." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={12} 
                    question="My manager handles conflicts fairly." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={13} 
                    question="I trust the senior leadership team to make good decisions for the company." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={14} 
                    question="Leadership communicates a clear vision for where the company is heading." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
            </div>

            <CTABox 
                variant="inline"
                title="These questions are built into our template"
                description="Our Employee Engagement Survey includes the top 10 questions, ready to send."
                buttonText="Use the Template"
                buttonLink="/survey?template=employee-engagement"
            />

            {/* ================================================================ */}
            {/* GROWTH & DEVELOPMENT */}
            {/* ================================================================ */}
            
            <h2 id="growth-development">Growth & Development</h2>
            
            <p>People leave when they stop growing. These questions catch that early.</p>

            <div className="bg-slate-50 rounded-2xl p-6 my-6">
                <QuestionItem 
                    number={15} 
                    question="I have opportunities to learn and grow in my role." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={16} 
                    question="I have a clear understanding of my career path here." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={17} 
                    question="The company invests in my professional development." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={18} 
                    question="I receive the training I need to do my job well." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={19} 
                    question="My skills are being fully utilized in my current role." 
                    type="Scale 1-5 (Agree/Disagree)"
                    tip="Low scores = boredom or underemployment"
                />
                <QuestionItem 
                    number={20} 
                    question="I've had meaningful conversations about my career goals in the past 6 months." 
                    type="Yes/No"
                />
            </div>

            {/* ================================================================ */}
            {/* WORK ENVIRONMENT */}
            {/* ================================================================ */}
            
            <h2 id="work-environment">Work Environment & Culture</h2>
            
            <p>Day-to-day reality. The stuff that makes people love or dread Monday mornings.</p>

            <div className="bg-slate-50 rounded-2xl p-6 my-6">
                <QuestionItem 
                    number={21} 
                    question="I have the tools and resources I need to do my job well." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={22} 
                    question="My team collaborates effectively." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={23} 
                    question="I feel like I belong here." 
                    type="Scale 1-5 (Agree/Disagree)"
                    tip="Key inclusion metric"
                />
                <QuestionItem 
                    number={24} 
                    question="Different perspectives are valued on my team." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={25} 
                    question="I can be myself at work." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={26} 
                    question="My workplace is free from harassment and discrimination." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={27} 
                    question="I feel physically safe in my work environment." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={28} 
                    question="Meetings at this company are generally productive." 
                    type="Scale 1-5 (Agree/Disagree)"
                    tip="Low scores = meeting culture problem"
                />
            </div>

            {/* ================================================================ */}
            {/* COMMUNICATION */}
            {/* ================================================================ */}
            
            <h2 id="communication">Communication</h2>
            
            <p>Communication problems are at the root of most workplace issues.</p>

            <div className="bg-slate-50 rounded-2xl p-6 my-6">
                <QuestionItem 
                    number={29} 
                    question="I receive the information I need to do my job effectively." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={30} 
                    question="Communication between departments works well." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={31} 
                    question="I feel informed about important company decisions." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={32} 
                    question="I feel comfortable speaking up with ideas or concerns." 
                    type="Scale 1-5 (Agree/Disagree)"
                    tip="Psychological safety indicator"
                />
                <QuestionItem 
                    number={33} 
                    question="When I share feedback, I feel like it's heard." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={34} 
                    question="The company communicates changes with enough notice." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
            </div>

            {/* ================================================================ */}
            {/* RECOGNITION & COMPENSATION */}
            {/* ================================================================ */}
            
            <h2 id="recognition-compensation">Recognition & Compensation</h2>
            
            <p>Sensitive but important. People won't say "pay me more" but they'll tell you if they feel undervalued.</p>

            <div className="bg-slate-50 rounded-2xl p-6 my-6">
                <QuestionItem 
                    number={35} 
                    question="I feel recognized for my contributions." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={36} 
                    question="Recognition is given fairly across the team." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={37} 
                    question="I feel fairly compensated for my work." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={38} 
                    question="I understand how compensation decisions are made." 
                    type="Scale 1-5 (Agree/Disagree)"
                    tip="Low transparency = low trust"
                />
                <QuestionItem 
                    number={39} 
                    question="The benefits package meets my needs." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={40} 
                    question="Good performance is rewarded here." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
            </div>

            {/* ================================================================ */}
            {/* WORK-LIFE BALANCE */}
            {/* ================================================================ */}
            
            <h2 id="work-life-balance">Work-Life Balance</h2>
            
            <p>Burnout is expensive. These questions catch it before people quit.</p>

            <div className="bg-slate-50 rounded-2xl p-6 my-6">
                <QuestionItem 
                    number={41} 
                    question="I can maintain a healthy balance between work and personal life." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={42} 
                    question="My workload is manageable." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={43} 
                    question="I feel comfortable taking time off when I need it." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
                <QuestionItem 
                    number={44} 
                    question="I'm NOT expected to respond to messages outside of work hours." 
                    type="Scale 1-5 (Agree/Disagree)"
                    tip="Watch the phrasing — avoiding double negatives"
                />
                <QuestionItem 
                    number={45} 
                    question="The company genuinely cares about employee wellbeing." 
                    type="Scale 1-5 (Agree/Disagree)"
                />
            </div>

            {/* ================================================================ */}
            {/* OPEN-ENDED */}
            {/* ================================================================ */}
            
            <h2 id="open-ended">Open-Ended Questions</h2>
            
            <p>Use 1-2 max. These take effort to answer and even more effort to analyze. But they surface things you'd never think to ask about.</p>

            <div className="bg-slate-50 rounded-2xl p-6 my-6">
                <QuestionItem 
                    number={46} 
                    question="What's one thing we could do to make this a better place to work?" 
                    type="Open text"
                    tip="The classic. Always include this one."
                />
                <QuestionItem 
                    number={47} 
                    question="What's working well that we should keep doing?" 
                    type="Open text"
                    tip="Balance the negativity — learn what to protect"
                />
                <QuestionItem 
                    number={48} 
                    question="Is there anything else you'd like to share?" 
                    type="Open text"
                    tip="Catches what you forgot to ask"
                />
                <QuestionItem 
                    number={49} 
                    question="If you could change one thing about your day-to-day work, what would it be?" 
                    type="Open text"
                />
                <QuestionItem 
                    number={50} 
                    question="What would make you consider leaving? What would make you stay?" 
                    type="Open text"
                    tip="Direct retention intel"
                />
            </div>

            <Callout type="important" title="Make open-ended questions optional">
                Not everyone has something to say. Forcing a response gets you "n/a" or garbage. Let people skip if they want.
            </Callout>

            {/* ================================================================ */}
            {/* QUESTIONS TO AVOID */}
            {/* ================================================================ */}
            
            <h2 id="questions-to-avoid">Questions to Avoid</h2>
            
            <p>Some questions do more harm than good:</p>
            
            <ul>
                <li><strong>"Are you happy?"</strong> — Too vague. Happy about what?</li>
                <li><strong>"Do you like your coworkers?"</strong> — Awkward and not actionable</li>
                <li><strong>"Rate your manager from 1-10"</strong> — Without context, this just creates anxiety</li>
                <li><strong>"What is your age/gender/ethnicity?"</strong> — Only ask if you have a specific DEI analysis plan AND large sample sizes</li>
                <li><strong>"Would you like more social events?"</strong> — Leading question. Ask what they want instead.</li>
                <li><strong>Anything you won't act on</strong> — Don't ask about office snacks if you're not going to change them</li>
            </ul>

            <h2>How to Use These Questions</h2>
            
            <ol>
                <li><strong>Pick 10-15 questions</strong> from the categories most relevant to what you're trying to learn</li>
                <li><strong>Always include the NPS question (#1)</strong> — it's your north star metric</li>
                <li><strong>Include 1-2 open-ended questions</strong> at the end</li>
                <li><strong>Run anonymously</strong> if you want honest answers</li>
                <li><strong>Share results with your team</strong> within 2 weeks</li>
                <li><strong>Commit to 1-2 concrete actions</strong> based on what you learn</li>
            </ol>
            
            <p>
                Surveys only work if people believe they matter. The best way to get good responses next time? Show them what you did with the responses this time.
            </p>

        </BlogLayout>
    );
};

export default BlogPost50Questions;