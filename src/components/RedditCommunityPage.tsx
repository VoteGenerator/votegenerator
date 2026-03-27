import React, { useState, useEffect } from 'react';
import { 
    ArrowRight, 
    Check, 
    X, 
    Users, 
    BarChart3, 
    Share2, 
    Clock, 
    Shield, 
    MessageSquare,
    Vote,
    TrendingUp,
    Zap,
    ExternalLink,
    ChevronUp,
    Award,
    Gamepad2,
    ShoppingBag,
    Film,
    Music,
    Laptop,
    Heart
} from 'lucide-react';
import NavHeader from './NavHeader';
import PremiumNav from './PremiumNav';
import Footer from './Footer';

useEffect(() => {
  const link = document.createElement('link');
  link.rel = 'canonical';
  link.href = 'https://votegenerator.com/reddit-polls';
  document.head.appendChild(link);
  return () => { document.head.removeChild(link); };
}, []);



// Custom Reddit icon component
const RedditIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
    >
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
    </svg>
);

const RedditCommunityPage: React.FC = () => {
    const [demoVotes, setDemoVotes] = useState<{ [key: string]: number }>({
        'option1': 847,
        'option2': 623,
        'option3': 412,
        'option4': 389,
        'option5': 301,
        'option6': 256,
        'option7': 198,
        'option8': 142
    });
    const [userVoted, setUserVoted] = useState<string | null>(null);
    const [tier, setTier] = useState<'free' | 'pro' | 'business'>('free');

    // Detect tier from localStorage
    useEffect(() => {
        const savedTier = localStorage.getItem('vg_subscription_tier') || 
                          localStorage.getItem('vg_purchased_tier');
        if (savedTier === 'pro' || savedTier === 'business') {
            setTier(savedTier);
        }
    }, []);

    const handleDemoVote = (optionId: string) => {
        if (userVoted) return;
        setDemoVotes(prev => ({
            ...prev,
            [optionId]: prev[optionId] + 1
        }));
        setUserVoted(optionId);
    };

    const totalVotes = Object.values(demoVotes).reduce((a, b) => a + b, 0);
    const getPercentage = (votes: number) => ((votes / totalVotes) * 100).toFixed(1);

    const demoOptions = [
        { id: 'option1', text: 'The Witcher 3: Wild Hunt', votes: demoVotes.option1 },
        { id: 'option2', text: 'Red Dead Redemption 2', votes: demoVotes.option2 },
        { id: 'option3', text: 'Elden Ring', votes: demoVotes.option3 },
        { id: 'option4', text: 'Baldur\'s Gate 3', votes: demoVotes.option4 },
        { id: 'option5', text: 'God of War (2018)', votes: demoVotes.option5 },
        { id: 'option6', text: 'Breath of the Wild', votes: demoVotes.option6 },
        { id: 'option7', text: 'Mass Effect 2', votes: demoVotes.option7 },
        { id: 'option8', text: 'Skyrim', votes: demoVotes.option8 },
    ];

    const useCases = [
        {
            emoji: '🏆',
            title: 'Community Rankings',
            description: 'Best games, movies, albums of the year',
            example: '"Top 10 horror movies of all time?"'
        },
        {
            emoji: '🤔',
            title: 'Help Me Decide',
            description: 'Get community input on purchases or choices',
            example: '"Which GPU should I buy under $400?"'
        },
        {
            emoji: '📊',
            title: 'Opinion Polls',
            description: 'Gauge community sentiment on hot topics',
            example: '"Should the sub allow memes on weekends?"'
        },
        {
            emoji: '🎮',
            title: 'Game Recommendations',
            description: 'Crowdsource the best suggestions',
            example: '"Best co-op games for couples?"'
        },
        {
            emoji: '⚔️',
            title: 'Debates & Showdowns',
            description: 'Settle arguments with actual votes',
            example: '"Star Wars vs Star Trek?"'
        },
        {
            emoji: '📅',
            title: 'Event Planning',
            description: 'Coordinate community activities',
            example: '"What time works for the AMA?"'
        }
    ];

    // Template IDs must match those in pollTemplates.tsx
    const templates = [
        { id: 'reddit-ranking', title: 'Community Ranking', category: 'Rankings', icon: Award },
        { id: 'reddit-recommendation', title: 'Recommendation Poll', category: 'Decisions', icon: ShoppingBag },
        { id: 'bracket-challenge', title: 'Bracket Challenge', category: 'Gaming', icon: Gamepad2 },
        { id: 'movie-night', title: 'Movie Night Vote', category: 'Entertainment', icon: Film },
        { id: 'music-friday', title: 'Music Ranking', category: 'Music', icon: Music },
        { id: 'reddit-debate', title: 'Community Debate', category: 'Debates', icon: Laptop },
        { id: 'reddit-mod-decision', title: 'Mod Policy Vote', category: 'Meta', icon: MessageSquare },
        { id: 'would-you-rather', title: 'Would You Rather', category: 'Fun', icon: Heart }
    ];

    return (
        <div className="min-h-screen bg-[#DAE0E6]">
            {/* Navigation */}
            {tier !== 'free' ? <PremiumNav tier={tier} /> : <NavHeader />}
            
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#FF4500] via-[#FF5722] to-[#FF6D00] text-white">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                                <RedditIcon size={18} />
                                <span>For Reddit Communities</span>
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                                Polls That Go
                                <span className="block text-white/90">Beyond 6 Options</span>
                            </h1>
                            
                            <p className="text-xl text-white/90 mb-8 leading-relaxed">
                                Reddit's native polls limit you to 6 choices and 1 week. 
                                Create unlimited options, run polls forever, and share results anywhere.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a 
                                    href="/"
                                    className="inline-flex items-center justify-center gap-2 bg-white text-[#FF4500] px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                                >
                                    Create Free Poll
                                    <ArrowRight size={20} />
                                </a>
                                <a 
                                    href="/templates#polls"
                                    className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
                                >
                                    Browse Templates
                                </a>
                            </div>

                            <div className="flex items-center gap-6 mt-8 text-white/80 text-sm">
                                <div className="flex items-center gap-2">
                                    <Check size={16} className="text-white" />
                                    No account needed
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check size={16} className="text-white" />
                                    Share in any subreddit
                                </div>
                            </div>
                        </div>

                        {/* Interactive Demo */}
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                            {/* Reddit-style header */}
                            <div className="bg-[#1A1A1B] px-4 py-3 flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#FF4500] to-[#FF6D00] rounded-full flex items-center justify-center">
                                    <Gamepad2 size={16} className="text-white" />
                                </div>
                                <div>
                                    <div className="text-white text-sm font-medium">r/gaming</div>
                                    <div className="text-gray-400 text-xs">{totalVotes.toLocaleString()} votes</div>
                                </div>
                                <div className="ml-auto flex items-center gap-1 text-[#FF4500]">
                                    <ChevronUp size={20} />
                                    <span className="text-sm font-medium">2.4k</span>
                                </div>
                            </div>
                            
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    What's the greatest RPG of all time?
                                </h3>
                                <p className="text-gray-500 text-sm mb-4">8 options • Vote for your favorite</p>
                                
                                <div className="space-y-2 max-h-80 overflow-y-auto">
                                    {demoOptions.map((option, index) => {
                                        const percentage = parseFloat(getPercentage(option.votes));
                                        const isWinning = index === 0;
                                        const isVoted = userVoted === option.id;
                                        
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => handleDemoVote(option.id)}
                                                disabled={!!userVoted}
                                                className={`w-full text-left p-3 rounded-lg border-2 transition-all relative overflow-hidden ${
                                                    isVoted 
                                                        ? 'border-[#FF4500] bg-orange-50' 
                                                        : userVoted 
                                                            ? 'border-gray-200 bg-gray-50' 
                                                            : 'border-gray-200 hover:border-[#FF4500] hover:bg-orange-50 cursor-pointer'
                                                }`}
                                            >
                                                {userVoted && (
                                                    <div 
                                                        className={`absolute inset-0 ${isWinning ? 'bg-[#FF4500]/10' : 'bg-gray-100'}`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                )}
                                                <div className="relative flex items-center justify-between">
                                                    <span className={`font-medium ${isVoted ? 'text-[#FF4500]' : 'text-gray-800'}`}>
                                                        {option.text}
                                                    </span>
                                                    {userVoted && (
                                                        <span className={`text-sm font-bold ${isWinning ? 'text-[#FF4500]' : 'text-gray-500'}`}>
                                                            {percentage}%
                                                        </span>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                {userVoted && (
                                    <p className="text-center text-gray-500 text-sm mt-4">
                                        ✓ Vote recorded • {totalVotes.toLocaleString()} total votes
                                    </p>
                                )}
                                {!userVoted && (
                                    <p className="text-center text-gray-400 text-xs mt-4">
                                        Click an option to vote
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Section - Reddit Limitations */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            Reddit Polls Are Limited
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Native Reddit polls work for simple questions, but serious community engagement needs more.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: X,
                                title: 'Only 6 Options',
                                description: 'Rankings, brackets, and recommendations need more choices',
                                color: 'text-red-500',
                                bgColor: 'bg-red-50'
                            },
                            {
                                icon: Clock,
                                title: '1 Week Maximum',
                                description: 'Polls auto-close after 7 days — no exceptions',
                                color: 'text-red-500',
                                bgColor: 'bg-red-50'
                            },
                            {
                                icon: X,
                                title: 'Can\'t Share Outside',
                                description: 'Results stay locked inside Reddit',
                                color: 'text-red-500',
                                bgColor: 'bg-red-50'
                            },
                            {
                                icon: X,
                                title: 'Text-Only Subs Blocked',
                                description: 'No polls in r/AskReddit or similar communities',
                                color: 'text-red-500',
                                bgColor: 'bg-red-50'
                            }
                        ].map((item, i) => (
                            <div key={i} className={`${item.bgColor} rounded-2xl p-6 text-center`}>
                                <div className={`w-12 h-12 ${item.bgColor} border-2 border-red-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                                    <item.icon className={item.color} size={24} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section className="py-16 md:py-24 bg-[#DAE0E6]">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            External Polls, Zero Friction
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Share a link. Voters click and vote. No accounts, no barriers.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: TrendingUp,
                                title: 'Unlimited Options',
                                description: 'Add as many choices as you need for rankings, brackets, and recommendations',
                                color: 'text-[#FF4500]',
                                bgColor: 'bg-orange-50'
                            },
                            {
                                icon: Clock,
                                title: 'No Time Limit',
                                description: 'Run polls for weeks, months, or forever — you control when it ends',
                                color: 'text-[#FF4500]',
                                bgColor: 'bg-orange-50'
                            },
                            {
                                icon: Share2,
                                title: 'Share Anywhere',
                                description: 'Post in any subreddit, Discord, Twitter, or embed on your site',
                                color: 'text-[#FF4500]',
                                bgColor: 'bg-orange-50'
                            },
                            {
                                icon: Shield,
                                title: 'Anonymous Voting',
                                description: 'No Reddit account required — voters stay anonymous',
                                color: 'text-[#FF4500]',
                                bgColor: 'bg-orange-50'
                            },
                            {
                                icon: BarChart3,
                                title: 'Real-Time Results',
                                description: 'Watch votes come in live with beautiful charts and percentages',
                                color: 'text-[#FF4500]',
                                bgColor: 'bg-orange-50'
                            },
                            {
                                icon: Zap,
                                title: 'Instant Setup',
                                description: 'Create a poll in 30 seconds and share immediately',
                                color: 'text-[#FF4500]',
                                bgColor: 'bg-orange-50'
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                                    <item.icon className={item.color} size={24} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 text-lg">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            Perfect For Every Subreddit
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            From gaming communities to advice threads, external polls unlock possibilities.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {useCases.map((useCase, i) => (
                            <div key={i} className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                                <div className="text-4xl mb-4">{useCase.emoji}</div>
                                <h3 className="font-bold text-gray-900 mb-2 text-lg">{useCase.title}</h3>
                                <p className="text-gray-600 mb-3">{useCase.description}</p>
                                <p className="text-sm text-[#FF4500] font-medium italic">{useCase.example}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 md:py-24 bg-[#1A1A1B] text-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black mb-4">
                            How to Use on Reddit
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Three simple steps to engage your community.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '1',
                                title: 'Create Your Poll',
                                description: 'Add your question and as many options as you need. Customize settings like multiple choice or ranked voting.'
                            },
                            {
                                step: '2',
                                title: 'Share the Link',
                                description: 'Post your poll link in a text post, comment, or even a link post. Works in any subreddit.'
                            },
                            {
                                step: '3',
                                title: 'Watch Results Live',
                                description: 'Share the results page or update your post with live vote counts. Engage with your community!'
                            }
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#FF4500] to-[#FF6D00] rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black">
                                    {item.step}
                                </div>
                                <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                                <p className="text-gray-400">{item.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Example Post */}
                    <div className="mt-16 max-w-2xl mx-auto">
                        <div className="bg-[#272729] rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-gray-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
                                    <div>
                                        <span className="text-gray-300 font-medium">u/YourUsername</span>
                                        <span className="text-gray-500 text-sm ml-2">• 2h</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-lg mb-2">
                                    🏆 VOTE: Best RPG of All Time Tournament - Round 1
                                </h4>
                                <p className="text-gray-400 mb-4">
                                    It's time to settle this once and for all! Vote for your favorites in our 32-game bracket. Native Reddit polls only allow 6 options, so I'm using an external poll:
                                </p>
                                <div className="bg-[#1A1A1B] rounded-lg p-3 flex items-center gap-3">
                                    <ExternalLink size={20} className="text-[#FF4500]" />
                                    <span className="text-[#4FBCFF]">votegenerator.com/v/abc123</span>
                                </div>
                                <p className="text-gray-500 text-sm mt-3">
                                    Results will be posted Friday! May the best game win.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Templates */}
            <section className="py-16 md:py-24 bg-[#DAE0E6]">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            Community Poll Templates
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Start with a template designed for Reddit communities.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {templates.map((template, i) => (
                            <a 
                                key={i}
                                href={`/create?template=${template.id}`}
                                className="bg-white rounded-xl p-4 hover:shadow-lg transition-all hover:-translate-y-1 group"
                            >
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#FF4500] group-hover:text-white transition-colors">
                                    <template.icon size={20} className="text-[#FF4500] group-hover:text-white" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm mb-1">{template.title}</h3>
                                <p className="text-xs text-gray-500">{template.category}</p>
                            </a>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <a 
                            href="/templates"
                            className="inline-flex items-center gap-2 text-[#FF4500] font-bold hover:underline"
                        >
                            View All Templates
                            <ArrowRight size={18} />
                        </a>
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            Reddit Polls vs VoteGenerator
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-4 px-4 font-bold text-gray-900">Feature</th>
                                    <th className="text-center py-4 px-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <RedditIcon size={20} className="text-[#FF4500]" />
                                            <span className="font-bold text-gray-900">Reddit</span>
                                        </div>
                                    </th>
                                    <th className="text-center py-4 px-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Vote size={20} className="text-indigo-600" />
                                            <span className="font-bold text-gray-900">VoteGenerator</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[
                                    { feature: 'Maximum options', reddit: '6', vg: 'Unlimited' },
                                    { feature: 'Poll duration', reddit: '1 week max', vg: 'No limit' },
                                    { feature: 'Share outside Reddit', reddit: false, vg: true },
                                    { feature: 'Works in text-only subs', reddit: false, vg: true },
                                    { feature: 'Anonymous voting', reddit: true, vg: true },
                                    { feature: 'Real-time results', reddit: true, vg: true },
                                    { feature: 'Ranked choice voting', reddit: false, vg: true },
                                    { feature: 'Multiple selection', reddit: false, vg: true },
                                    { feature: 'Embed on websites', reddit: false, vg: true },
                                    { feature: 'Export results (CSV)', reddit: false, vg: true },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 text-gray-700">{row.feature}</td>
                                        <td className="py-3 px-4 text-center">
                                            {typeof row.reddit === 'boolean' ? (
                                                row.reddit ? (
                                                    <Check size={20} className="text-green-500 mx-auto" />
                                                ) : (
                                                    <X size={20} className="text-gray-300 mx-auto" />
                                                )
                                            ) : (
                                                <span className="text-gray-600">{row.reddit}</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {typeof row.vg === 'boolean' ? (
                                                row.vg ? (
                                                    <Check size={20} className="text-green-500 mx-auto" />
                                                ) : (
                                                    <X size={20} className="text-gray-300 mx-auto" />
                                                )
                                            ) : (
                                                <span className="text-indigo-600 font-medium">{row.vg}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-[#FF4500] via-[#FF5722] to-[#FF6D00] text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <RedditIcon size={64} className="mx-auto mb-6 opacity-90" />
                    <h2 className="text-3xl md:text-4xl font-black mb-4">
                        Ready to Level Up Your Community?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Create engaging polls with unlimited options. Perfect for rankings, brackets, 
                        recommendations, and community decisions.
                    </p>
                    <a 
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-white text-[#FF4500] px-10 py-4 rounded-full font-bold text-lg hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        Create Your First Poll
                        <ArrowRight size={20} />
                    </a>
                    <p className="text-white/70 text-sm mt-6">
                        Free to use • No account required • Works in any subreddit
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default RedditCommunityPage;