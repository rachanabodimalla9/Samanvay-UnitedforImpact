import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, MapPin, Check, ExternalLink, Zap, 
  X, TrendingUp, Shield, HelpCircle, Globe, Share2, MessageCircle, Twitter, Send
} from "lucide-react";
import { cn } from "../lib/utils";

interface NGO {
  id: string;
  name: string;
  category: string;
  location: string;
  socialFeed?: {
    platform: string;
    content: string;
    timestamp: string;
    url: string;
    sentiment_score?: number;
    urgency_score?: string;
    location?: string;
    broadcasts?: { platform: string; status: string }[];
  }[];
  sentimentHistory?: number[];
}

function LOGO_URL(domain: string) {
  return `https://logo.clearbit.com/${domain}?size=200`;
}

function LogoImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
  const [error, setError] = React.useState(false);
  const initials = alt.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  if (error) {
    return (
      <div className={cn("flex items-center justify-center bg-gradient-to-br from-blue to-ruby font-serif font-black text-white text-xl tracking-tighter", className)}>
        {initials}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      onError={() => setError(true)}
      referrerPolicy="no-referrer"
    />
  );
}

function Sparkline({ data, color }: { data: number[], color: string }) {
  if (!data || data.length < 2) return null;
  const max = 10;
  const min = 0;
  const range = max - min;
  const width = 100;
  const height = 30;
  const step = width / (data.length - 1);
  
  const points = data.map((d, i) => {
    const x = i * step;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex items-center gap-2">
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          points={points}
        />
      </svg>
      <div className="flex flex-col">
          <span className="text-[8px] font-black uppercase text-gray-400">Vibe Trend</span>
          <span className={cn("text-[9px] font-black", data[data.length-1] > data[0] ? "text-green" : "text-ruby")}>
            {data[data.length-1] > data[0] ? "Improving" : "Declining"}
          </span>
      </div>
    </div>
  );
}

function KeywordCloud({ posts }: { posts: any[] }) {
    const urgentPosts = posts.filter(p => p.urgency_score === "High");
    const words = urgentPosts.flatMap(p => p.content.split(' '))
        .filter(w => w.length > 4)
        .map(w => w.replace(/[.,!]/g, ''))
        .reduce((acc: any, w) => {
            acc[w] = (acc[w] || 0) + 1;
            return acc;
        }, {});
    
    const sortedWords = Object.entries(words).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5);

    return (
        <div className="flex flex-wrap gap-2">
            {sortedWords.map(([word]: any) => (
                <span key={word} className="px-2 py-1 bg-ruby/5 text-ruby text-[9px] font-black uppercase rounded-lg border border-ruby/10">
                    {word}
                </span>
            ))}
        </div>
    );
}

function UrgentTicker({ posts }: { posts: any[] }) {
    const critical = posts.filter(p => p.urgency_score === "High").slice(0, 5);
    if (critical.length === 0) return null;

    return (
        <div className="bg-ruby/10 border-y border-ruby/20 py-2 overflow-hidden whitespace-nowrap mb-8 mt-[-2rem] relative z-20">
            <motion.div 
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="inline-flex gap-12"
            >
                {[...critical, ...critical].map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-ruby rounded-full animate-ping"></span>
                        <span className="text-[10px] font-black uppercase text-ruby tracking-widest">
                            CRITICAL [{p.ngoName}]: {p.content.substring(0, 50)}...
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

export default function Community() {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [sortByUrgency, setSortByUrgency] = useState(false);
  const [resolvedPosts, setResolvedPosts] = useState<Set<string>>(new Set());
  const [pulseContent, setPulseContent] = useState("");
  const [pulseNgoId, setPulseNgoId] = useState("");
  const [isSubmittingPulse, setIsSubmittingPulse] = useState(false);
  const [aiReplyDraft, setAiReplyDraft] = useState<{ content: string; reply: string; ngoName: string } | null>(null);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

  useEffect(() => {
    fetch("/api/ngos")
      .then(res => res.json())
      .then(data => setNgos(data));
  }, []);

  const generateDraft = async (postContent: string, ngoName: string, refinePrompt?: string) => {
    setIsGeneratingDraft(true);
    try {
      const res = await fetch("/api/ai/draft-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          content: postContent, 
          context: `NGO: ${ngoName}`,
          refinePrompt // Optional field for refinement
        })
      });
      const data = await res.json();
      setAiReplyDraft({ content: postContent, reply: data.reply, ngoName });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const toggleResolve = (postContent: string) => {
    setResolvedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postContent)) next.delete(postContent);
      else next.add(postContent);
      return next;
    });
  };

  const submitPulse = async () => {
    if (!pulseContent || !pulseNgoId) return;
    setIsSubmittingPulse(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: pulseContent, ngoId: pulseNgoId })
      });
      if (res.ok) {
        setPulseContent("");
        setPulseNgoId("");
        const data = await fetch("/api/ngos").then(r => r.json());
        setNgos(data);
        alert("Impact update submitted for AI analysis!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingPulse(false);
    }
  };

  const allPosts = ngos.flatMap(n => (n.socialFeed || []).map(p => ({ ...p, ngoName: n.name, ngoId: n.id })));
  
  const sortedPosts = [...allPosts].sort((a, b) => {
    if (sortByUrgency) {
      const urgencyMap: Record<string, number> = { "High": 3, "Medium": 2, "Low": 1 };
      const urgencyA = urgencyMap[a.urgency_score || "Low"] || 1;
      const urgencyB = urgencyMap[b.urgency_score || "Low"] || 1;
      if (urgencyB !== urgencyA) return urgencyB - urgencyA;
    }
    return 0;
  });

  const getPostStyle = (p: any) => {
    if (p.urgency_score === "High" && p.sentiment_score !== undefined && p.sentiment_score <= 4) {
      return "border-ruby bg-ruby/5 dark:bg-ruby/10 ring-1 ring-ruby/20";
    }
    if (p.sentiment_score !== undefined && p.sentiment_score >= 8) {
      return "border-green bg-green/5 dark:bg-green/10 ring-1 ring-green/20";
    }
    return "border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-gray-800/50";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-24 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue/10 text-blue rounded-full border border-blue/20 mb-6">
            <Globe className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Global Community Ecosystem</span>
          </div>
          <h1 className="text-7xl font-serif font-black text-blue dark:text-white mb-6">
            Community <span className="text-ruby">Hub</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xl font-light max-w-3xl mx-auto leading-relaxed">
            A unified space for transparency, impact monitoring, and institutional collaboration.
          </p>
        </header>

        <UrgentTicker posts={allPosts} />

        {/* Samanvay Pulse Main Section */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-10 h-10 bg-ruby/10 rounded-xl flex items-center justify-center text-ruby">
                <Activity className="w-6 h-6" />
             </div>
             <h2 className="text-2xl font-serif font-black text-blue dark:text-white"><span className="notranslate">Samanvay</span> Pulse</h2>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-[3rem] p-10 border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-ruby/5 rounded-full -mr-48 -mt-48 blur-3xl opacity-50"></div>
          
          <div className="flex flex-col lg:flex-row justify-between gap-10 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue/10 rounded-3xl flex items-center justify-center text-blue">
                <Activity className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.4em] text-blue dark:text-white">Live Insights</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Sentiment & Urgency Engine v1.1</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-8 bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
              <div className="flex flex-col items-start lg:items-end">
                <span className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Active Crisis Tags</span>
                <KeywordCloud posts={allPosts} />
              </div>
              <div className="w-px h-12 bg-gray-100 dark:bg-gray-700 hidden lg:block"></div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSortByUrgency(!sortByUrgency)}
                  className={cn(
                    "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2",
                    sortByUrgency ? "bg-ruby text-white border-ruby shadow-lg shadow-ruby/20" : "bg-gray-50 dark:bg-gray-900 text-gray-400 border-gray-200"
                  )}
                >
                  <TrendingUp className="w-4 h-4" />
                  Urgency First
                </button>
                <div className="flex items-center gap-2 bg-green/5 px-4 py-2 rounded-full border border-green/10">
                  <span className="w-2 h-2 bg-green rounded-full animate-ping"></span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-green">AI Scanning</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Feed Section */}
            <div className="lg:col-span-2 space-y-6">
              {sortedPosts.map((post, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-8 rounded-[2.5rem] border-l-[10px] flex flex-col justify-between transition-all bg-white dark:bg-gray-800 shadow-sm",
                    resolvedPosts.has(post.content) ? "opacity-50 grayscale" : getPostStyle(post).replace("border-ruby", "border-l-ruby").replace("border-green", "border-l-green").replace("border-gray-100", "border-l-blue/20")
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                           <span className="text-xs font-black text-blue uppercase tracking-widest">{post.ngoName}</span>
                           {post.sentiment_score !== undefined && (
                             <span className="text-xl">
                               {post.sentiment_score >= 8 ? "😊" : post.sentiment_score <= 4 ? "⚠️" : "️️😐"}
                             </span>
                           )}
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          {post.urgency_score && (
                            <span className={cn(
                              "text-[8px] font-black uppercase px-3 py-1 rounded-full",
                              post.urgency_score === 'High' ? "bg-ruby text-white" : "bg-blue/10 text-blue"
                            )}>
                              {post.urgency_score === 'High' ? "Immediate Attention" : "General Info"}
                            </span>
                          )}
                          {post.location && (
                             <span className="text-[9px] font-black uppercase text-gray-400 flex items-center gap-1">
                               <MapPin className="w-3 h-3 text-ruby" />
                               {post.location}
                             </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold">{post.timestamp}</span>
                    </div>
                    <p className="text-base text-gray-700 dark:text-gray-300 font-medium leading-relaxed italic">"{post.content}"</p>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-gray-100 dark:border-white/5 pt-6">
                    <div className="flex flex-wrap gap-3">
                       <button 
                         onClick={() => toggleResolve(post.content)}
                         className={cn(
                           "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all",
                           resolvedPosts.has(post.content) ? "bg-green text-white shadow-lg shadow-green/20" : "bg-gray-50 dark:bg-gray-900 text-gray-400 border border-gray-100"
                         )}
                       >
                         <Check className="w-4 h-4" />
                         {resolvedPosts.has(post.content) ? "Marked as Resolved" : "Approve Response"}
                       </button>
                       <button 
                         onClick={() => generateDraft(post.content, post.ngoName)}
                         className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-gray-900 text-ruby border border-ruby/20 text-[10px] font-black uppercase hover:bg-ruby hover:text-white transition-all shadow-sm"
                       >
                         <Zap className="w-4 h-4" />
                         AI Smart Draft
                       </button>
                    </div>
                    <div className="flex items-center gap-4">
                       {post.broadcasts && (
                          <div className="flex items-center gap-2">
                             <div className="flex -space-x-1">
                                {post.broadcasts.map((b: any, bi: number) => (
                                   <div key={bi} title={`${b.platform}: ${b.status}`} className="w-5 h-5 rounded-full bg-blue/10 flex items-center justify-center border border-white">
                                      {b.platform === 'Twitter' && <Twitter className="w-2.5 h-2.5 text-blue" />}
                                      {b.platform === 'WhatsApp' && <MessageCircle className="w-2.5 h-2.5 text-green" />}
                                      {b.platform === 'Telegram' && <Send className="w-2.5 h-2.5 text-blue-400" />}
                                   </div>
                                ))}
                             </div>
                             <span className="text-[7px] font-black uppercase text-green">Broadcast Live</span>
                          </div>
                       )}
                       {post.sentiment_score !== undefined && (
                          <div className="flex flex-col items-end">
                             <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Confidence Score</span>
                             <span className="text-xs font-black text-blue">{post.sentiment_score}/10</span>
                          </div>
                       )}
                       <a 
                         href={post.url} 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-white/5 text-gray-400 hover:text-blue hover:border-blue transition-all"
                       >
                         <ExternalLink className="w-4 h-4" />
                       </a>
                    </div>
                  </div>
                </motion.div>
              ))}
              {sortedPosts.length === 0 && (
                <div className="py-24 text-center border-2 border-dashed border-gray-200 dark:border-white/5 rounded-[3rem]">
                  <Activity className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-serif italic text-xl">Waiting for community pulse signals...</p>
                </div>
              )}
            </div>

            {/* Trends & Analytics Section */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm">
                 <div className="mb-10 flex justify-between items-center">
                    <h4 className="text-[11px] font-black uppercase text-blue/40 tracking-[0.3em]">Institutional Trends</h4>
                    <HelpCircle className="w-4 h-4 text-gray-300 cursor-help" />
                 </div>
                 
                 <div className="space-y-8">
                    {ngos.filter(n => n.sentimentHistory).slice(0, 5).map(n => (
                      <div key={n.id} className="flex items-center justify-between group">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-2 border border-blue/5 overflow-hidden group-hover:scale-110 transition-transform">
                              <LogoImage src={LOGO_URL(n.name.split(' ')[0].toLowerCase() + ".org")} alt={n.name} className="w-full h-full object-contain" />
                           </div>
                           <span className="text-[11px] font-black text-gray-600 dark:text-gray-300 truncate max-w-[120px] uppercase tracking-tighter">{n.name}</span>
                         </div>
                         <Sparkline data={n.sentimentHistory!} color={n.name === 'Goonj' ? '#E11D48' : '#22C55E'} />
                      </div>
                    ))}
                 </div>

                 <div className="mt-12 pt-10 border-t border-gray-50 dark:border-white/5">
                    <h4 className="text-[11px] font-black uppercase text-blue/40 tracking-[0.3em] mb-6">Regional Pulse Map</h4>
                    <div className="relative h-48 bg-gray-50 dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden flex items-center justify-center p-8 group">
                       <div className="absolute inset-0 bg-gradient-to-br from-ruby/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <MapPin className="absolute w-32 h-32 text-blue/5 -bottom-8 -right-8 rotate-[15deg]" />
                       <div className="z-10 text-center space-y-4">
                          <div className="flex gap-3 justify-center">
                             <div className="w-6 h-6 bg-ruby rounded-full animate-ping opacity-75"></div>
                             <div className="absolute w-6 h-6 bg-ruby rounded-full flex items-center justify-center shadow-lg shadow-ruby/40">
                                <Activity className="w-3 h-3 text-white" />
                             </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase text-ruby tracking-widest mb-1">Darrang, Assam</p>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Ongoing Crisis Monitoring</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Tips Section */}
              <div className="bg-blue rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-16 -mt-16"></div>
                 <Shield className="w-10 h-10 text-sun/40 mb-6" />
                 <h4 className="text-sm font-black uppercase tracking-widest mb-4"><span className="notranslate">Samanvay</span> Ethics Code</h4>
                 <p className="text-xs font-light text-white/70 leading-relaxed">
                   Every data point submitted to <span className="notranslate">Samanvay</span> Pulse is verified through decentralized karma nodes. We prioritize human dignity over raw metrics.
                 </p>
              </div>
            </div>
          </div>

          {/* Omni-Channel Broadcast Hub Section */}
          <div className="mt-20">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-sun/10 rounded-xl flex items-center justify-center text-sun">
                   <Share2 className="w-6 h-6" />
                </div>
                <div>
                   <h2 className="text-2xl font-serif font-black text-blue dark:text-white">Broadcast Control Center</h2>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Institutional Multi-Channel Syndication</p>
                </div>
             </div>

             <div className="grid md:grid-cols-4 gap-6">
                {[
                  { name: "Samanvay Live Feed", icon: Globe, status: "Active", color: "bg-blue", count: "14.2k active nodes" },
                  { name: "Twitter (X) Automation", icon: Twitter, status: "Connected", color: "bg-sky-500", count: "@SamanvayImpact" },
                  { name: "WhatsApp Broadcast", icon: MessageCircle, status: "Priority 1", color: "bg-green", count: "842 Community Groups" },
                  { name: "Emergency Telegram", icon: Send, status: "Secured", color: "bg-blue-400", count: "12 Channels" }
                ].map((channel, ci) => (
                  <div key={ci} className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm group hover:shadow-xl transition-all">
                     <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg", channel.color)}>
                        <channel.icon className="w-6 h-6" />
                     </div>
                     <h4 className="text-xs font-black uppercase tracking-widest text-gray-800 dark:text-white mb-1 group-hover:text-ruby transition-colors notranslate">{channel.name}</h4>
                     <p className="text-[9px] font-bold text-gray-400 mb-4">{channel.count}</p>
                     <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5">
                        <span className="text-[8px] font-black uppercase text-green">{channel.status}</span>
                        <div className="w-2 h-2 bg-green rounded-full animate-pulse"></div>
                     </div>
                  </div>
                ))}
             </div>

             <div className="mt-8 bg-blue dark:bg-blue-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="flex items-center gap-6 relative z-10">
                   <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                      <Zap className="w-8 h-8 text-sun fill-sun" />
                   </div>
                   <div>
                      <h4 className="text-lg font-black uppercase tracking-widest mb-1">One-Click Multi-Submission System</h4>
                      <p className="text-sm text-white/60 font-light max-w-md italic">
                        Select "Analyze & Broadcast" below to update the internal ticker and push to all connected social channels instantly.
                      </p>
                   </div>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">System Health</p>
                      <p className="text-xs font-bold text-green uppercase tracking-widest">All Gateways Nominal</p>
                   </div>
                   <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-green animate-spin"></div>
                </div>
             </div>
          </div>

          {/* AI Drafting Overlay */}
          <AnimatePresence>
             {aiReplyDraft && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95, y: 20 }}
                 className="mt-12 p-10 bg-[#0033cc] dark:bg-blue-950 text-white rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden ring-4 ring-white/10"
               >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-ruby/20 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
                  <button 
                    onClick={() => setAiReplyDraft(null)}
                    className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <Zap className="w-6 h-6 text-sun fill-sun" />
                     </div>
                     <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.3em]">Smart Contextual Draft</h4>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">AI Recommendation Engine</p>
                     </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-10">
                    <div>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 block">Trigger Content</span>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 italic font-medium text-sm text-white/80">
                           "{aiReplyDraft.content}"
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-sun uppercase tracking-widest mb-3 block">Generated Response</span>
                        <div className="flex-grow p-6 bg-white/10 rounded-2xl border border-sun/20 text-base font-semibold text-white mb-6">
                           <textarea 
                             value={aiReplyDraft.reply}
                             onChange={(e) => setAiReplyDraft({...aiReplyDraft, reply: e.target.value})}
                             className="w-full bg-transparent border-none outline-none resize-none h-32 focus:ring-0"
                           />
                        </div>
                        <div className="flex gap-4">
                           <button 
                             onClick={() => {
                               toggleResolve(aiReplyDraft.content);
                               setAiReplyDraft(null);
                               alert("Approved response has been scheduled for broadcast!");
                             }}
                             className="flex-1 px-8 py-4 bg-sun text-blue-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-sun/20"
                           >
                              Approve & Notify NGO
                           </button>
                           <button 
                             onClick={() => generateDraft(aiReplyDraft.content, aiReplyDraft.ngoName, "Make it more concise and urgent.")}
                             disabled={isGeneratingDraft}
                             className="px-8 py-4 bg-transparent border-2 border-white/20 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/5 transition-all disabled:opacity-50"
                           >
                              {isGeneratingDraft ? "Refining..." : "Refine Draft"}
                           </button>
                        </div>
                    </div>
                  </div>
               </motion.div>
             )}
          </AnimatePresence>

          {/* Submission Gate */}
          <div className="mt-16 pt-16 border-t border-gray-100 dark:border-white/5">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                <div>
                   <h4 className="text-xl font-serif font-black text-blue mb-2">Contribute to the Pulse</h4>
                   <p className="text-sm text-gray-500 font-medium">Spotted an impact story or a critical need? Submit it for AI validation.</p>
                </div>
                <div className="flex -space-x-4">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden bg-gray-100">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                     </div>
                   ))}
                   <div className="w-10 h-10 rounded-full border-4 border-white dark:border-gray-900 bg-ruby flex items-center justify-center text-[10px] font-black text-white">
                      +1k
                   </div>
                </div>
             </div>
             <div className="flex flex-col md:flex-row gap-6">
                <select 
                  value={pulseNgoId}
                  onChange={(e) => setPulseNgoId(e.target.value)}
                  className="md:w-1/4 p-6 rounded-3xl bg-white dark:bg-gray-800 border-2 border-gray-50 dark:border-white/5 outline-none text-sm font-bold shadow-sm focus:border-ruby transition-colors"
                >
                  <option value="">Channel Selection</option>
                  {ngos.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                </select>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Describe the situation or impact milestone..."
                    value={pulseContent}
                    onChange={(e) => setPulseContent(e.target.value)}
                    className="w-full p-6 pr-48 rounded-3xl bg-white dark:bg-gray-800 border-2 border-gray-50 dark:border-white/5 outline-none text-sm font-medium shadow-sm focus:border-blue transition-colors"
                  />
                  <button 
                    onClick={submitPulse}
                    disabled={isSubmittingPulse || !pulseContent || !pulseNgoId}
                    className="absolute right-2 top-2 bottom-2 px-8 bg-blue dark:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] disabled:opacity-50 hover:bg-ruby transition-all overflow-hidden flex items-center gap-2 group"
                  >
                    {isSubmittingPulse ? (
                      <Activity className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-4 h-4 group-hover:scale-125 transition-transform" />
                        Analyze & Broadcast
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
