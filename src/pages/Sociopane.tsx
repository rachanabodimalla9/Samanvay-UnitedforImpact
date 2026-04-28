import React from 'react';
import { motion } from 'motion/react';
import { Globe, Instagram, Twitter, MessageSquare, AlertCircle, TrendingUp, Filter, Search, Share2, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

interface Issue {
  id: string;
  source: 'Instagram' | 'Twitter' | 'Reddit' | 'News';
  topic: string;
  location: string;
  intensity: 'High' | 'Medium' | 'Low';
  description: string;
  hashtags: string[];
  timestamp: string;
  engagement: string;
  media?: MediaItem[];
}

const ISSUES: Issue[] = [
  {
    id: '1',
    source: 'Twitter',
    topic: 'Stray Animal Welfare',
    location: 'Delhi NCR',
    intensity: 'High',
    description: 'Multiple reports of extreme heat affecting stray populations. Urgent need for hydration stations and medical aid.',
    hashtags: ['#HeatWave', '#AnimalRescue', '#DelhiIssues'],
    timestamp: '2 mins ago',
    engagement: '14.2K',
    media: [
      {
        type: 'image',
        url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpg'
      }
    ]
  },
  {
    id: '2',
    source: 'Instagram',
    topic: 'Education Access',
    location: 'Rural Bihar',
    intensity: 'Medium',
    description: 'Local activists highlighting the digital divide in primary schools. Children lacking basic learning kits for the upcoming term.',
    hashtags: ['#RightToEducation', '#Bihar', '#SupportStudents'],
    timestamp: '15 mins ago',
    engagement: '8.5K',
    media: [
      {
        type: 'image',
        url: 'https://images.pexels.com/photos/159825/pexels-photo-159825.jpg'
      }
    ]
  },
  {
    id: '3',
    source: 'Reddit',
    topic: 'Water Scarcity',
    location: 'Bengaluru',
    intensity: 'High',
    description: 'Community-led discussion on depleting groundwater levels in North Bengaluru. Urging for rainwater harvesting measures.',
    hashtags: ['#SaveWater', '#BengaluruWater', '#Sustainability'],
    timestamp: '1 hour ago',
    engagement: '2.1K',
    media: [
      {
        type: 'image',
        url: 'https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpg'
      },
      {
        type: 'image',
        url: 'https://images.pexels.com/photos/226593/pexels-photo-226593.jpg'
      }
    ]
  },
  {
    id: '4',
    source: 'News',
    topic: 'Waste Management',
    location: 'Mumbai Coast',
    intensity: 'Medium',
    description: 'Seasonal plastic accumulation at Versova Beach. Local volunteers call for a coordinated cleanup drive this weekend.',
    hashtags: ['#BeachCleanup', '#MumbaiMarine', '#PlasticFree'],
    timestamp: '3 hours ago',
    engagement: '25K',
    media: [
      {
        type: 'image',
        url: 'https://images.pexels.com/photos/1089440/pexels-photo-1089440.jpg'
      }
    ]
  },
  {
    id: '5',
    source: 'Instagram',
    topic: 'Sustainable Agriculture',
    location: 'Punjab',
    intensity: 'Low',
    description: 'Farmers adopting solar-powered irrigation. A video guide on how local cooperatives are reducing carbon footprint.',
    hashtags: ['#AgriTech', '#SolarPower', '#GreenPunjab'],
    timestamp: '5 hours ago',
    engagement: '1.2K',
    media: [
      {
        type: 'image',
        url: 'https://images.pexels.com/photos/195226/pexels-photo-195226.jpg'
      },
      {
        type: 'video',
        url: 'https://vjs.zencdn.net/v/oceans.mp4'
      }
    ]
  }
];

const SOURCE_ICONS = {
  Instagram: <div className="p-3 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-2xl shadow-lg ring-4 ring-pink-500/10 transition-transform group-hover:scale-110"><Instagram className="w-6 h-6 text-white" /></div>,
  Twitter: <div className="p-3 bg-[#1DA1F2] rounded-2xl shadow-lg ring-4 ring-blue-400/10 transition-transform group-hover:scale-110"><Twitter className="w-6 h-6 text-white" /></div>,
  Reddit: <div className="p-3 bg-[#FF4500] rounded-2xl shadow-lg ring-4 ring-orange-500/10 transition-transform group-hover:scale-110"><MessageSquare className="w-6 h-6 text-white" /></div>,
  News: <div className="p-3 bg-blue-900 rounded-2xl shadow-lg ring-4 ring-blue-900/10 transition-transform group-hover:scale-110"><Globe className="w-6 h-6 text-white" /></div>
};

const SOURCE_BG = {
  Instagram: "bg-pink-50/50 dark:bg-pink-500/5 backdrop-blur-sm",
  Twitter: "bg-blue-50/50 dark:bg-blue-500/5 backdrop-blur-sm",
  Reddit: "bg-orange-50/50 dark:bg-orange-500/5 backdrop-blur-sm",
  News: "bg-gray-50/50 dark:bg-gray-500/5 backdrop-blur-sm"
};


const INTENSITY_COLORS = {
  High: 'bg-red-500/10 text-red-500 border-red-500/20',
  Medium: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  Low: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
};

export default function Sociopane() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg">
                <Globe className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-sm font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">Real-time Nerve Center</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-black text-blue-900 dark:text-white leading-tight">
              Socio<span className="text-ruby italic">pane</span>.
            </h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-xl font-light max-w-2xl">
              Monitoring global social signals to pinpoint national crises. A unified view of the problems that need your impact now.
            </p>
          </div>

          <div className="flex items-center gap-3">
             <button className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm hover:shadow-md transition-all">
                <Filter className="w-5 h-5 text-gray-500" />
             </button>
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search regions or issues..." 
                  className="pl-11 pr-6 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-600 outline-none w-64 text-sm dark:text-white"
                />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-6">
            {ISSUES.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-blue-900/5 overflow-hidden hover:scale-[1.01] transition-all group"
              >
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="shrink-0">
                        {SOURCE_ICONS[issue.source as keyof typeof SOURCE_ICONS]}
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 dark:text-white text-xl tracking-tight leading-none mb-1.5">{issue.topic}</h3>
                        <p className="text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest">{issue.location} • {issue.timestamp}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                      INTENSITY_COLORS[issue.intensity]
                    )}>
                      {issue.intensity} Intensity
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 font-medium text-lg">
                    {issue.description}
                  </p>

                   {issue.media && issue.media.length > 0 && (
                    <div className={cn(
                      "mb-6 gap-4 grid",
                      issue.media.length > 1 ? "grid-cols-2" : "grid-cols-1"
                    )}>
                      {issue.media.map((m, mIdx) => (
                        <div key={mIdx} className="rounded-[2rem] overflow-hidden aspect-video border border-gray-100 dark:border-white/5 shadow-inner bg-gray-50 dark:bg-black/20 relative group/media">
                           {m.type === 'video' ? (
                             <div className="relative w-full h-full">
                               <video 
                                 src={m.url} 
                                 className="w-full h-full object-cover"
                                 autoPlay
                                 muted
                                 loop
                                 playsInline
                                 controlsList="nodownload"
                               />
                               {/* Hover Overlay for Video */}
                               <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center">
                                 <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                   <TrendingUp className="w-8 h-8 text-white animate-pulse" />
                                 </div>
                               </div>
                             </div>
                           ) : (
                             <img 
                               src={m.url} 
                               alt={issue.topic}
                               className="w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-105" 
                             />
                           )}
                           <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md text-[8px] font-black uppercase text-white rounded-full tracking-widest border border-white/10">
                             {m.type === 'video' ? 'Live Intel Feed' : 'Ground Evidence'}
                           </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-8">
                    {issue.hashtags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 group/btn cursor-pointer">
                          <TrendingUp className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-black text-gray-400 group-hover:text-gray-600 transition-colors uppercase tracking-widest">{issue.engagement} Signals</span>
                        </div>
                        <div className="flex items-center gap-2 group/btn cursor-pointer">
                          <Share2 className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-black text-gray-400 group-hover:text-gray-600 transition-colors uppercase tracking-widest">Share</span>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 text-ruby font-black text-xs uppercase tracking-[0.2em] hover:translate-x-1 transition-transform group-hover:text-blue transition-colors">
                        View Ground Report <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sidebar / Stats */}
          <div className="lg:col-span-4 space-y-8">
            {/* National Crisis Index */}
            <div className="bg-[#0033cc] dark:bg-blue-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
               <div className="relative z-10">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 mb-6 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-ruby rounded-full animate-pulse"></div>
                   Crisis Volatility Index
                 </h4>
                 <div className="flex items-baseline gap-2 mb-2">
                   <span className="text-6xl font-black font-serif italic tracking-tighter">78.4</span>
                   <span className="text-xs font-black text-ruby">+4.2%</span>
                 </div>
                 <p className="text-sm text-white/60 font-medium leading-relaxed">
                   Overall social unrest and problem signals across 28 states currently above baseline.
                 </p>
                 
                 <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Environment</span>
                      <div className="h-1.5 w-32 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Equity</span>
                      <div className="h-1.5 w-32 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-saffron" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Healthcare</span>
                      <div className="h-1.5 w-32 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                 </div>
               </div>
            </div>

            {/* Top Trending Regions */}
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-xl">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8">Problem Heatmap</h4>
               <div className="space-y-6">
                  {['Bengaluru', 'Delhi NCR', 'Kochi', 'Patna', 'Mumbai'].map((city, i) => (
                    <div key={city} className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-300 dark:text-white/20 font-black text-sm italic">0{i+1}</span>
                        <span className="font-black text-gray-800 dark:text-white tracking-tight uppercase text-xs">{city}</span>
                      </div>
                      <AlertCircle className={cn(
                        "w-4 h-4",
                        i < 2 ? "text-red-500 animate-pulse" : "text-gray-300 dark:text-white/20"
                      )} />
                    </div>
                  ))}
               </div>
               <button className="w-full mt-10 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all">
                  Deep Dive Regional Data
               </button>
            </div>

            <div className="p-8 bg-ruby/5 rounded-[2.5rem] border border-ruby/10">
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-ruby mb-4 notranslate">Samanvay Intel</h4>
               <p className="text-xs text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
                 Our Sociopane AI aggregates anonymous signals from across 14 platforms to help you decide where your contribution can have the most immediate impact.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
