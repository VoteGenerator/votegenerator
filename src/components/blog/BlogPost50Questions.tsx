// ============================================================================
// BlogPost: 50 Employee Survey Questions That Get Honest Answers
// Route: /blog/employee-survey-questions
// ============================================================================

import React from 'react';
import BlogLayout, { Callout, CTABox, QuestionItem } from './BlogLayout';
import { Lightbulb, AlertCircle, Users, TrendingUp, Heart, MessageCircle, Award, Clock } from 'lucide-react';

// Section wrapper component for visual organization
const QuestionSection: React.FC<{ 
    title: string; 
    description: string;
    icon: React.ReactNode;
    gradient: string;
    children: React.ReactNode 
}> = ({ title, description, icon, gradient, children }) => (
    <div className="my-12">
        <div className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} mb-6`}>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                    {icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="text-white/80 text-sm">{description}</p>
                </div>
            </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
            {children}
        </div>
    </div>
);

const BlogPost50Questions: React.FC = () => {
    return (
        <BlogLayout
            title="50 Employee Survey Questions That Get Honest Answers"
            subtitle="Copy-paste ready questions organized by category. No corporate fluff."
            publishDate="January 6, 2026"
            readTime="12 min read"
            category="Templates"
            categoryColor="bg-purple-500/10 text-purple-600"
            ctaTitle="Ready to send your survey?"
            ctaDescription="Use our Employee Engagement template with these questions built in."
            ctaButtonText="Create Employee Survey"
            ctaButtonLink="/survey?template=employee-engagement"
        >
            <p className="text-xl text-slate-600 leading-relaxed">
                Most employee surveys get garbage responses. Vague questions get vague answers. Leading questions get the answers you wanted to hear. And surveys that take 30 minutes get abandoned at question 12.
            </p>
            
            <p>
                Here are 50 questions that actually work—organized by category, with the question type and a tip on why each one matters.
            </p>

            <h2>Before You Start: Three Rules</h2>
            
            <div className="my-8 grid gap-4">
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-start gap-4">
                        <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold flex-shrink-0">1</span>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-1">Keep it under 15 questions</h4>
                            <p className="text-slate-600">Nobody wants a 50-question survey. Pick the 10-15 that matter most for what you're trying to learn.</p>
                        </div>
                    </div>
                </div>
                
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-start gap-4">
                        <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold flex-shrink-0">2</span>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-1">Make it actually anonymous</h4>
                            <p className="text-slate-600">If people think answers can be traced back, they'll tell you what you want to hear. <a href="/blog/is-your-work-survey-anonymous" className="text-indigo-600 hover:underline">Here's how to tell if it's truly anonymous.</a></p>
                        </div>
                    </div>
                </div>
                
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-start gap-4">
                        <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold flex-shrink-0">3</span>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-1">Tell people what you'll do with results</h4>
                            <p className="text-slate-600">"We're collecting feedback" isn't enough. Will you share results? Act on them? When? If people don't believe anything will change, they won't bother giving real feedback.</p>
                        </div>
                    </div>
                </div>
            </div>

            <Callout type="info" title="Question Types Explained">
                <strong>Scale (1-5 or 1-10)</strong> — Best for tracking trends over time<br/>
                <strong>Multiple choice</strong> — Best for specific, actionable answers<br/>
                <strong>Open-ended</strong> — Best for context and surprises (use sparingly)
            </Callout>

            {/* ENGAGEMENT SECTION */}
            <QuestionSection
                title="Engagement & Satisfaction"
                description="Start here. These tell you the overall health of your workplace."
                icon={<TrendingUp size={24} />}
                gradient="from-indigo-500 to-purple-600"
            >
                <QuestionItem number={1} question="How likely are you to recommend this company as a great place to work?" type="Scale 0-10 (NPS)" tip="The classic. Track this quarterly." />
                <QuestionItem number={2} question="Overall, how satisfied are you with your job?" type="Scale 1-5" />
                <QuestionItem number={3} question="I feel motivated to do my best work every day." type="Agree/Disagree" />
                <QuestionItem number={4} question="I see myself working here in two years." type="Agree/Disagree" tip="Early warning for retention issues" />
                <QuestionItem number={5} question="I would recommend my team to a friend looking for a job." type="Agree/Disagree" />
                <QuestionItem number={6} question="I feel proud to work for this company." type="Agree/Disagree" />
            </QuestionSection>

            {/* MANAGER SECTION */}
            <QuestionSection
                title="Manager & Leadership"
                description="Manager quality is the #1 predictor of employee satisfaction."
                icon={<Users size={24} />}
                gradient="from-emerald-500 to-teal-600"
            >
                <QuestionItem number={7} question="My manager gives me clear expectations for my work." type="Agree/Disagree" />
                <QuestionItem number={8} question="My manager provides regular feedback on my performance." type="Agree/Disagree" />
                <QuestionItem number={9} question="My manager cares about my wellbeing as a person." type="Agree/Disagree" />
                <QuestionItem number={10} question="I feel comfortable giving honest feedback to my manager." type="Agree/Disagree" tip="If low, your survey might get filtered answers" />
                <QuestionItem number={11} question="My manager supports my career development." type="Agree/Disagree" />
                <QuestionItem number={12} question="My manager handles conflicts fairly." type="Agree/Disagree" />
                <QuestionItem number={13} question="I trust the senior leadership team to make good decisions." type="Agree/Disagree" />
                <QuestionItem number={14} question="Leadership communicates a clear vision for the company." type="Agree/Disagree" />
            </QuestionSection>

            <CTABox 
                variant="inline"
                title="These questions are built into our template"
                description="Our Employee Engagement Survey includes the top 10, ready to send."
                buttonText="Use the Template"
                buttonLink="/survey?template=employee-engagement"
            />

            {/* GROWTH SECTION */}
            <QuestionSection
                title="Growth & Development"
                description="People leave when they stop growing. Catch it early."
                icon={<Lightbulb size={24} />}
                gradient="from-amber-500 to-orange-600"
            >
                <QuestionItem number={15} question="I have opportunities to learn and grow in my role." type="Agree/Disagree" />
                <QuestionItem number={16} question="I have a clear understanding of my career path here." type="Agree/Disagree" />
                <QuestionItem number={17} question="The company invests in my professional development." type="Agree/Disagree" />
                <QuestionItem number={18} question="I receive the training I need to do my job well." type="Agree/Disagree" />
                <QuestionItem number={19} question="My skills are being fully utilized in my current role." type="Agree/Disagree" tip="Low scores = boredom or underemployment" />
                <QuestionItem number={20} question="I've had meaningful conversations about my career goals in the past 6 months." type="Yes/No" />
            </QuestionSection>

            {/* ENVIRONMENT SECTION */}
            <QuestionSection
                title="Work Environment & Culture"
                description="Day-to-day reality that makes people love or dread Mondays."
                icon={<Heart size={24} />}
                gradient="from-pink-500 to-rose-600"
            >
                <QuestionItem number={21} question="I have the tools and resources I need to do my job well." type="Agree/Disagree" />
                <QuestionItem number={22} question="My team collaborates effectively." type="Agree/Disagree" />
                <QuestionItem number={23} question="I feel like I belong here." type="Agree/Disagree" tip="Key inclusion metric" />
                <QuestionItem number={24} question="Different perspectives are valued on my team." type="Agree/Disagree" />
                <QuestionItem number={25} question="I can be myself at work." type="Agree/Disagree" />
                <QuestionItem number={26} question="My workplace is free from harassment and discrimination." type="Agree/Disagree" />
                <QuestionItem number={27} question="I feel physically safe in my work environment." type="Agree/Disagree" />
                <QuestionItem number={28} question="Meetings at this company are generally productive." type="Agree/Disagree" tip="Low scores = meeting culture problem" />
            </QuestionSection>

            {/* COMMUNICATION SECTION */}
            <QuestionSection
                title="Communication"
                description="Communication problems are at the root of most workplace issues."
                icon={<MessageCircle size={24} />}
                gradient="from-cyan-500 to-blue-600"
            >
                <QuestionItem number={29} question="I receive the information I need to do my job effectively." type="Agree/Disagree" />
                <QuestionItem number={30} question="Communication between departments works well." type="Agree/Disagree" />
                <QuestionItem number={31} question="I feel informed about important company decisions." type="Agree/Disagree" />
                <QuestionItem number={32} question="I feel comfortable speaking up with ideas or concerns." type="Agree/Disagree" tip="Psychological safety indicator" />
                <QuestionItem number={33} question="When I share feedback, I feel like it's heard." type="Agree/Disagree" />
                <QuestionItem number={34} question="The company communicates changes with enough notice." type="Agree/Disagree" />
            </QuestionSection>

            {/* RECOGNITION SECTION */}
            <QuestionSection
                title="Recognition & Compensation"
                description="Sensitive but important. People won't say 'pay me more' but will tell you if they feel undervalued."
                icon={<Award size={24} />}
                gradient="from-violet-500 to-purple-600"
            >
                <QuestionItem number={35} question="I feel recognized for my contributions." type="Agree/Disagree" />
                <QuestionItem number={36} question="Recognition is given fairly across the team." type="Agree/Disagree" />
                <QuestionItem number={37} question="I feel fairly compensated for my work." type="Agree/Disagree" />
                <QuestionItem number={38} question="I understand how compensation decisions are made." type="Agree/Disagree" tip="Low transparency = low trust" />
                <QuestionItem number={39} question="The benefits package meets my needs." type="Agree/Disagree" />
                <QuestionItem number={40} question="Good performance is rewarded here." type="Agree/Disagree" />
            </QuestionSection>

            {/* WORK-LIFE SECTION */}
            <QuestionSection
                title="Work-Life Balance"
                description="Burnout is expensive. Catch it before people quit."
                icon={<Clock size={24} />}
                gradient="from-slate-600 to-slate-800"
            >
                <QuestionItem number={41} question="I can maintain a healthy balance between work and personal life." type="Agree/Disagree" />
                <QuestionItem number={42} question="My workload is manageable." type="Agree/Disagree" />
                <QuestionItem number={43} question="I feel comfortable taking time off when I need it." type="Agree/Disagree" />
                <QuestionItem number={44} question="I'm NOT expected to respond to messages outside work hours." type="Agree/Disagree" />
                <QuestionItem number={45} question="The company genuinely cares about employee wellbeing." type="Agree/Disagree" />
            </QuestionSection>

            {/* OPEN-ENDED SECTION */}
            <h2>Open-Ended Questions</h2>
            
            <p>Use 1-2 max. These take effort to answer and even more effort to analyze. But they surface things you'd never think to ask about.</p>
            
            <div className="my-8 bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
                <QuestionItem number={46} question="What's one thing we could do to make this a better place to work?" type="Open text" tip="The classic. Always include this one." />
                <QuestionItem number={47} question="What's working well that we should keep doing?" type="Open text" tip="Learn what to protect" />
                <QuestionItem number={48} question="Is there anything else you'd like to share?" type="Open text" tip="Catches what you forgot to ask" />
                <QuestionItem number={49} question="If you could change one thing about your day-to-day work, what would it be?" type="Open text" />
                <QuestionItem number={50} question="What would make you consider leaving? What would make you stay?" type="Open text" tip="Direct retention intel" />
            </div>

            <Callout type="important" title="Make open-ended questions optional">
                Not everyone has something to say. Forcing a response gets you "n/a" or garbage. Let people skip if they want.
            </Callout>

            <h2>Questions to Avoid</h2>
            
            <div className="my-8 grid gap-3">
                {[
                    { q: '"Are you happy?"', why: 'Too vague. Happy about what?' },
                    { q: '"Do you like your coworkers?"', why: 'Awkward and not actionable' },
                    { q: '"Rate your manager 1-10"', why: 'Without context, this just creates anxiety' },
                    { q: 'Age/gender/ethnicity questions', why: 'Only ask if you have a specific plan and large sample sizes' },
                    { q: '"Would you like more social events?"', why: 'Leading question. Ask what they want instead.' },
                    { q: 'Anything you won\'t act on', why: 'Don\'t ask about office snacks if you\'re not going to change them' },
                ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-red-50 rounded-xl">
                        <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                            <span className="font-semibold text-slate-900">{item.q}</span>
                            <span className="text-slate-600"> — {item.why}</span>
                        </div>
                    </div>
                ))}
            </div>

            <h2>How to Use These Questions</h2>
            
            <div className="my-8 space-y-3">
                {[
                    'Pick 10-15 questions from the categories most relevant to you',
                    'Always include the NPS question (#1) — it\'s your north star metric',
                    'Include 1-2 open-ended questions at the end',
                    'Run anonymously if you want honest answers',
                    'Share results with your team within 2 weeks',
                    'Commit to 1-2 concrete actions based on what you learn',
                ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl">
                        <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</span>
                        <span className="text-slate-700">{item}</span>
                    </div>
                ))}
            </div>
            
            <p>
                Surveys only work if people believe they matter. The best way to get good responses next time? <strong>Show them what you did with the responses this time.</strong>
            </p>

        </BlogLayout>
    );
};

export default BlogPost50Questions;