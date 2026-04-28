import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, Instagram, Twitter, ExternalLink, HelpCircle, X, Navigation, CheckCircle2, ArrowRight, ArrowLeft, Heart, Shield, Check, Activity, MessageSquare, Star, UserPlus, Youtube, FileText, Download, Zap, AlertTriangle, TrendingUp, Smile } from "lucide-react";
import { cn } from "../lib/utils";

interface NGO {
  id: string;
  name: string;
  category: string;
  description: string;
  socials: { instagram: string; twitter: string; youtube: string };
  location: string;
  tags: string[];
  verification?: {
    financial: boolean;
    fieldImpact: boolean;
    community: boolean;
  };
  projectGoal?: number;
  currentFunding?: number;
  projectName?: string;
  socialFeed?: {
    platform: string;
    content: string;
    timestamp: string;
    url: string;
    sentiment_score?: number;
    urgency_score?: string;
    location?: string;
  }[];
  achievements?: string[];
  sentimentHistory?: number[];
}

interface Story {
  id: string;
  ngoId: string;
  ngoName: string;
  image: string;
  videoId?: string; // YouTube Video ID
  caption: string;
}

function LOGO_URL(domain: string, _originalUrl: string) {
  // Clearbit provides high-availability organizational logos based on domain
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
    />
  );
}

const IMPACT_STORIES: Story[] = [
  {
    id: "s1",
    ngoId: "1",
    ngoName: "Goonj",
    image: LOGO_URL("goonj.org", "https://goonj.org/wp-content/themes/Goonj/images/goonj-logo.png"),
    videoId: "j4m23dVCtuc",
    caption: "Clothing as a dignity: Anshu Gupta shares the mission of Goonj. 📦 #SamanvayImpact"
  },
  {
    id: "s2",
    ngoId: "2",
    ngoName: "Akshaya Patra",
    image: LOGO_URL("akshayapatra.org", "https://www.akshayapatra.org/ap-assets/images/ap-logo.png"),
    videoId: "ECUBE8DtgVg",
    caption: "Witness the scale of the world's largest NGO-run school meal program. 🍲 #MidDayMeal"
  },
  {
    id: "s3",
    ngoId: "3",
    ngoName: "CRY India",
    image: LOGO_URL("cry.org", "https://www.cry.org/wp-content/uploads/2019/11/CRY-Logo.png"),
    videoId: "bH6ulI7CuJ8",
    caption: "Restoring the basic rights of every Indian child. Join the movement. 📚 #ChildRights"
  },
  {
    id: "s4",
    ngoId: "9",
    ngoName: "SEWA",
    image: LOGO_URL("sewa.org", "https://www.sewa.org/wp-content/uploads/2021/04/sewa-logo.png"),
    videoId: "qqzVeuSKwSU",
    caption: "The power of self-employed women: Stories from the SEWA movement. 🧶 #Empowerment"
  },
  {
    id: "s5",
    ngoId: "11",
    ngoName: "Blue Cross",
    image: LOGO_URL("bluecrossofindia.org", "https://bluecrossofindia.org/wp-content/uploads/2016/09/bci-logo-1.png"),
    videoId: "jyg1_yzbpbk",
    caption: "Rescue, Rehabilitation, Release: A day at the Blue Cross animal shelter. 🐾 #AnimalWelfare"
  },
  {
    id: "s6",
    ngoId: "5",
    ngoName: "HelpAge India",
    image: LOGO_URL("helpageindia.org", "https://www.helpageindia.org/wp-content/themes/helpageindia/images/logo.png"),
    videoId: "sqE2IuMKu5c",
    caption: "Fighting elder abuse and providing healthcare to the silver generation. 👵 #HelpAgeIndia"
  }
];

export default function NGOs() {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [search, setSearch] = useState("");
  const [searchService, setSearchService] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchScope, setSearchScope] = useState<"nearby" | "india">("india");
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [userValue, setUserValue] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [reviewNgo, setReviewNgo] = useState<NGO | null>(null);
  const [donationNgo, setDonationNgo] = useState<NGO | null>(null);
  const [profileNgo, setProfileNgo] = useState<NGO | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    fetch("/api/ngos")
      .then(res => res.json())
      .then(data => setNgos(data));
  }, []);

  const detectLocation = () => {
    setIsDetectingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we'd reverse geocode here. 
          // For now, let's simulate detecting a major city based on mock data.
          setTimeout(() => {
            setUserLocation("Mumbai"); // Mock detection
            setIsDetectingLocation(false);
            setQuizStep(prev => prev + 1);
          }, 1500);
        },
        () => {
          setIsDetectingLocation(false);
          setUserLocation("Unknown");
          setQuizStep(prev => prev + 1);
        }
      );
    } else {
      setIsDetectingLocation(false);
      setUserLocation("Unknown");
      setQuizStep(prev => prev + 1);
    }
  };

  const filteredNgos = ngos.filter(ngo => {
    const matchesService = ngo.category.toLowerCase().includes(searchService.toLowerCase()) ||
      ngo.tags.some(t => t.toLowerCase().includes(searchService.toLowerCase()));
    
    const matchesLocation = ngo.location.toLowerCase().includes(searchLocation.toLowerCase());
    
    const matchesGeneral = ngo.name.toLowerCase().includes(search.toLowerCase());
    
    if (searchService && !matchesService) return false;
    if (searchLocation && !matchesLocation) return false;
    if (search && !matchesGeneral) return false;

    // Apply Nearby constraint if active and location detected
    if (searchScope === "nearby" && userLocation && userLocation !== "Unknown" && !searchLocation) {
        if (!ngo.location.toLowerCase().includes(userLocation.toLowerCase())) return false;
    }
    
    if (userValue && !ngo.category.toLowerCase().includes(userValue.toLowerCase()) && !ngo.tags.some(t => t.toLowerCase().includes(userValue.toLowerCase()))) {
       return false;
    }

    if (userLocation && userLocation !== "Unknown" && !ngo.location.toLowerCase().includes(userLocation.toLowerCase())) {
        // We show a more relaxed filter if location is set via quiz
        // but for this demo let's keep it strict if they selected it
    }

    return true;
  });

  const quizQuestions = [
    {
      question: "Which cause resonates most with you?",
      options: [
        { label: "Education", value: "Education" },
        { label: "Environment", value: "Relief" },
        { label: "Child Rights", value: "Children" },
        { label: "Hunger", value: "Hunger" },
      ]
    },
    {
      question: "Where would you like to make an impact?",
      options: [
        { label: "Nearby (Detect my Location)", action: detectLocation, isLocation: true },
        { label: "Pan India", value: "Any" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-sun dark:bg-gray-950 py-16 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4">
        {/* Impact Stories Tray */}
        <div className="mb-12">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue dark:text-[#4a89ff] mb-6 ml-4">Impact Stories</h3>
           <div className="flex gap-6 overflow-x-auto pb-4 px-4 no-scrollbar">
              {IMPACT_STORIES.map((story) => (
                <button 
                  key={story.id} 
                  onClick={() => setSelectedStory(story)}
                  className="flex-shrink-0 group flex flex-col items-center gap-2"
                >
                  <div className="w-20 h-20 rounded-full p-[3px] bg-blue/20 dark:bg-blue/10 border border-blue/10 dark:border-white/5 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-full border-[3px] border-sun dark:border-gray-900 overflow-hidden bg-white">
                      <LogoImage 
                        src={story.image} 
                        alt={story.ngoName} 
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-blue dark:text-[#4a89ff] uppercase tracking-wider">{story.ngoName}</span>
                </button>
              ))}
           </div>
        </div>

        <header className="mb-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green/10 text-green rounded-full border border-green/20">
              <CheckCircle2 className="w-3 h-3" />
              <span className="text-[10px] font-black uppercase tracking-widest leading-none pt-0.5">Sourced from NGO Darpan Directory</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black mb-6">
            <span className="bg-white text-blue px-4 py-2 rounded-xl border-4 border-blue/5 shadow-xl rotate-[-1deg] inline-block mb-4">Empowering</span>
            <br />
            <span className="text-ruby uppercase tracking-tighter drop-shadow-sm">Visionaries</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-xl font-light max-w-2xl mx-auto">Connecting 450+ verified NGOs with corporate synergy and community support.</p>
          
          <div className="mt-8 p-6 bg-white dark:bg-gray-900 rounded-3xl border border-saffron/20 dark:border-white/10 shadow-xl max-w-2xl mx-auto flex flex-col md:flex-row items-center gap-6 justify-between transform hover:scale-[1.01] transition-transform">
             <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-saffron/10 dark:bg-saffron/5 rounded-full flex items-center justify-center text-saffron shrink-0">
                   <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-blue dark:text-[#4a89ff] font-bold">Not sure where to start?</p>
                   <p className="text-sm text-gray-500 dark:text-gray-400">Take our 30-second Discovery Quiz to find your perfect match.</p>
                </div>
             </div>
             <button 
                onClick={() => setShowQuiz(true)}
                className="whitespace-nowrap px-6 py-3 bg-blue dark:bg-[#4a89ff] text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-ruby transition-colors"
             >
                Start Quiz
             </button>
          </div>

          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 p-2 md:p-3 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-stretch gap-2 border border-blue/5 dark:border-white/5">
              <div className="flex-1 relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-ruby w-5 h-5 group-hover:scale-110 transition-transform pointer-events-none" />
                <select 
                  className="w-full pl-14 pr-8 py-4 rounded-3xl bg-transparent dark:text-white outline-none font-medium appearance-none cursor-pointer focus:ring-0"
                  value={searchService}
                  onChange={(e) => setSearchService(e.target.value)}
                >
                  <option value="" className="dark:bg-gray-900 text-gray-900 dark:text-white">All Services</option>
                  {Array.from(new Set(ngos.map(n => n.category))).sort().map(cat => (
                    <option key={cat} value={cat} className="dark:bg-gray-900 text-gray-900 dark:text-white">
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-ruby transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
              <div className="hidden md:block w-px bg-gray-100 dark:bg-gray-800 my-2"></div>
              <div className="flex-1 relative group">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-saffron w-5 h-5 group-hover:scale-110 transition-transform pointer-events-none" />
                <select 
                  className="w-full pl-14 pr-8 py-4 rounded-3xl bg-transparent dark:text-white outline-none font-medium appearance-none cursor-pointer focus:ring-0"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                >
                  <option value="" className="dark:bg-gray-900 text-gray-900 dark:text-white">All India</option>
                  <optgroup label="Major Cities" className="dark:bg-gray-900 text-gray-400 font-bold">
                    {["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Pune"].sort().map(city => (
                      <option key={city} value={city} className="dark:bg-gray-900 text-gray-900 dark:text-white">{city}</option>
                    ))}
                  </optgroup>
                  <optgroup label="States / Regions" className="dark:bg-gray-900 text-gray-400 font-bold mt-2">
                    {["Maharashtra", "Karnataka", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Gujarat", "West Bengal", "Rajasthan", "Kerala", "Assam"].sort().map(state => (
                      <option key={state} value={state} className="dark:bg-gray-900 text-gray-900 dark:text-white">{state}</option>
                    ))}
                  </optgroup>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-saffron transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
              <div className="hidden md:block w-px bg-gray-100 dark:bg-gray-800 my-2"></div>
              <div className="flex p-1 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] min-w-[200px]">
                <button 
                  onClick={() => setSearchScope("nearby")}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all",
                    searchScope === "nearby" ? "bg-white dark:bg-gray-700 shadow-sm text-blue dark:text-white" : "text-gray-400"
                  )}
                >
                  Nearby
                </button>
                <button 
                  onClick={() => setSearchScope("india")}
                  className={cn(
                    "flex-1 px-4 py-3 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all",
                    searchScope === "india" ? "bg-white dark:bg-gray-700 shadow-sm text-blue dark:text-white" : "text-gray-400"
                  )}
                >
                  India Wide
                </button>
              </div>
            </div>
          </div>
        </header>

        {(userValue || userLocation) && (
          <div className="mb-8 flex flex-wrap gap-4 justify-center">
            {userValue && (
              <span className="px-4 py-2 bg-saffron/10 text-saffron rounded-full text-xs font-black uppercase flex items-center gap-2">
                {userValue} <X className="w-3 h-3 cursor-pointer" onClick={() => setUserValue(null)} />
              </span>
            )}
            {userLocation && userLocation !== "Unknown" && (
              <span className="px-4 py-2 bg-green/10 text-green rounded-full text-xs font-black uppercase flex items-center gap-2">
                Nearby: {userLocation} <X className="w-3 h-3 cursor-pointer" onClick={() => setUserLocation(null)} />
              </span>
            )}
            <button 
              onClick={() => { setUserValue(null); setUserLocation(null); }}
              className="text-gray-400 text-xs font-bold uppercase underline"
            >
              Clear All Filters
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredNgos.length > 0 ? (
            filteredNgos.map((ngo, idx) => (
              <NGOCard 
                key={ngo.id} 
                ngo={ngo} 
                index={idx} 
                onLeaveReview={setReviewNgo} 
                onViewProfile={setProfileNgo}
                onSupport={setDonationNgo}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
               <p className="text-gray-400 font-serif italic text-2xl">No matching NGOs found. Try broadening your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Achievements Detail Modal */}
      <AnimatePresence>
        {profileNgo && (
          <div className="fixed inset-0 z-[115] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setProfileNgo(null)}
               className="absolute inset-0 bg-blue/95 backdrop-blur-md"
             />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
             >
                <button 
                  onClick={() => setProfileNgo(null)}
                  className="absolute top-8 right-8 z-30 text-gray-400 hover:text-blue transition-colors bg-white/80 p-2 rounded-full backdrop-blur-sm"
                >
                  <X />
                </button>

                {/* Left Side: Info & Achievements */}
                <div className="md:w-1/2 p-12 overflow-y-auto no-scrollbar border-r border-gray-100">
                   <div className="w-20 h-20 bg-ruby/10 text-ruby rounded-3xl flex items-center justify-center font-serif text-3xl font-black mb-8">
                      {profileNgo.name.substring(0,2)}
                   </div>
                   <h2 className="text-4xl font-serif font-black text-blue mb-4">{profileNgo.name}</h2>
                   <div className="flex items-center gap-3 mb-8">
                      <span className="px-4 py-1.5 bg-blue text-white rounded-full text-[10px] font-black uppercase tracking-widest">{profileNgo.category}</span>
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-ruby" />
                        {profileNgo.location}
                      </span>
                   </div>
                   
                   <div className="space-y-8">
                      <div className="prose prose-sm text-gray-600 font-light leading-relaxed">
                        <h4 className="text-blue font-black uppercase text-xs tracking-widest mb-4">Key Achievements</h4>
                        <div className="space-y-4">
                          {profileNgo.achievements && profileNgo.achievements.length > 0 ? (
                            profileNgo.achievements.map((achievement, i) => (
                              <div key={i} className="flex gap-4 items-start bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="w-6 h-6 rounded-full bg-green text-white flex items-center justify-center shrink-0 mt-0.5">
                                  <Check className="w-3 h-3" />
                                </div>
                                <p className="text-sm font-medium text-gray-700">{achievement}</p>
                              </div>
                            ))
                          ) : (
                            <p className="italic text-gray-400">Loading achievements from directory...</p>
                          )}
                        </div>
                      </div>


                      <div className="flex gap-4">
                         <button 
                           onClick={() => { setDonationNgo(profileNgo); setProfileNgo(null); }}
                           className="flex-1 py-4 bg-ruby text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue transition-all shadow-xl shadow-ruby/20"
                         >
                           Support NGO
                         </button>
                         <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:text-blue transition-all">
                            <ExternalLink className="w-5 h-5" />
                         </button>
                      </div>
                   </div>
                </div>

                {/* Right Side: Mission & Social Proof */}
                <div className="md:w-1/2 bg-sun/20 p-12 overflow-y-auto no-scrollbar">
                   <div className="mb-8 flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue">Mission & Impact</h3>
                      <div className="flex gap-4">
                         <a href={profileNgo.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                            <Instagram className="w-4 h-4 text-ruby" />
                         </a>
                         <a href={profileNgo.socials.twitter} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                            <Twitter className="w-4 h-4 text-blue" />
                         </a>
                         <a href={profileNgo.socials.youtube} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                            <Youtube className="w-4 h-4 text-red-600" />
                         </a>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-white">
                         <h4 className="text-[10px] font-black uppercase text-ruby mb-4 tracking-widest">Our Story</h4>
                         <p className="text-sm text-gray-600 leading-relaxed italic">
                           "{profileNgo.description} Our work spans across multiple regions, driven by a commitment to transparency and measurable outcomes."
                         </p>
                      </div>
                      {profileNgo.socialFeed?.map((post, i) => (
                         <motion.div 
                           key={i}
                           initial={{ x: 20, opacity: 0 }}
                           animate={{ x: 0, opacity: 1 }}
                           transition={{ delay: i * 0.1 }}
                           className="bg-white p-6 rounded-3xl shadow-sm border border-white hover:shadow-md transition-shadow"
                         >
                            <div className="flex justify-between items-center mb-3">
                               <span className={cn(
                                 "text-[8px] font-black uppercase px-2 py-0.5 rounded",
                                 post.platform === 'Instagram' ? "bg-gradient-to-r from-purple-500 to-ruby text-white" : "bg-blue/10 text-blue"
                               )}>
                                 {post.platform}
                               </span>
                               <span className="text-[10px] text-gray-400 font-medium">{post.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed font-medium mb-3">
                               {post.content}
                            </p>
                            <a 
                              href={post.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] font-black uppercase text-ruby hover:underline flex items-center gap-1"
                            >
                              View Original Post <ExternalLink className="w-3 h-3" />
                            </a>
                         </motion.div>
                      ))}
                      <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-3xl">
                         <p className="text-xs text-gray-400 font-bold uppercase tracking-widest italic">Pulling latest updates from APIs...</p>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Donation & Receipt Modal */}
      <AnimatePresence>
        {donationNgo && (
          <div className="fixed inset-0 z-[125] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-blue/95 backdrop-blur-md"
             />
             <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               exit={{ scale: 0.9, y: 20 }}
               className="relative bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl overflow-hidden"
             >
                {!showReceipt ? (
                  <div className="text-center space-y-8">
                     <div className="flex items-center justify-between mb-4">
                        <button 
                          onClick={() => setDonationNgo(null)}
                          className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-blue transition-colors"
                          title="Back"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="w-10"></div>
                     </div>
                     <div className="w-20 h-20 bg-ruby/10 text-ruby rounded-full flex items-center justify-center mx-auto">
                        <Heart className="w-10 h-10 fill-ruby" />
                     </div>
                     <div>
                        <h2 className="text-3xl font-serif font-black text-blue">Fuel Sustainable Change</h2>
                        <p className="text-sm text-gray-500 mt-2">Support <span className="text-ruby font-bold">{donationNgo.name}</span> in their mission.</p>
                     </div>

                     <div className="grid grid-cols-3 gap-4">
                        {[500, 1000, 5000].map(amt => (
                          <button key={amt} className="py-4 border-2 border-gray-100 rounded-2xl font-bold text-blue hover:border-ruby hover:text-ruby transition-all">₹{amt}</button>
                        ))}
                     </div>

                     <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold">₹</span>
                        <input 
                           type="number" 
                           placeholder="Other Amount" 
                           className="w-full pl-12 pr-6 py-5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-4 focus:ring-ruby/20 font-bold text-blue"
                        />
                     </div>

                     <button 
                       onClick={() => setShowReceipt(true)}
                       className="w-full py-5 bg-ruby text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-ruby/20 hover:scale-[1.02] transition-all"
                     >
                       Confirm Support
                     </button>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-center space-y-8"
                  >
                     <div className="w-20 h-20 bg-green/10 text-green rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10" />
                     </div>
                     <div>
                        <h2 className="text-3xl font-serif font-black text-blue">Impact Confirmed!</h2>
                        <p className="text-sm text-gray-500 mt-2">Your contribution has been allocated to <br/> <span className="text-green font-bold">{donationNgo.projectName}</span></p>
                     </div>

                     <div className="bg-sun/30 p-8 rounded-[1.5rem] border border-saffron/20 relative overflow-hidden text-left">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-saffron/10 -mr-8 -mt-8 rotate-12 rounded-3xl" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-blue/40 mb-4 flex items-center gap-2">
                           <FileText className="w-3 h-3" />
                           Automated Transaction Receipt
                        </h4>
                        <div className="space-y-2 mb-6">
                           <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Date</span>
                              <span className="font-bold text-blue">{new Date().toLocaleDateString()}</span>
                           </div>
                           <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Receipt No.</span>
                              <span className="font-bold text-blue">SAM-REC-{Math.floor(Math.random()*10000)}</span>
                           </div>
                           <div className="flex justify-between text-lg pt-2 border-t border-dashed border-gray-100">
                              <span className="font-medium text-gray-500">Amount</span>
                              <span className="font-black text-ruby">₹1,000.00</span>
                           </div>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium italic">An official copy has been sent to your email.</p>
                     </div>

                     <div className="space-y-4">
                        <button className="w-full py-4 bg-blue text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-ruby transition-colors">
                           <Download className="w-4 h-4" />
                           Download PDF Receipt
                        </button>
                        <button 
                          onClick={() => { setDonationNgo(null); setShowReceipt(false); }}
                          className="w-full py-4 text-gray-400 font-black uppercase tracking-widest text-xs hover:text-blue"
                        >
                          Close
                        </button>
                     </div>
                  </motion.div>
                )}
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Leave Review Modal */}
      <AnimatePresence>
        {reviewNgo && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setReviewNgo(null)}
               className="absolute inset-0 bg-blue/90 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl overflow-hidden"
             >
                <button 
                  onClick={() => setReviewNgo(null)}
                  className="absolute top-8 right-8 text-gray-300 hover:text-blue transition-colors"
                >
                  <X />
                </button>

                <div className="text-center space-y-6">
                   <div className="flex items-center justify-between mb-4">
                      <button 
                        onClick={() => setReviewNgo(null)}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-blue transition-colors"
                        title="Back"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div className="w-10"></div>
                   </div>
                   <div className="w-16 h-16 bg-ruby/10 text-ruby rounded-full flex items-center justify-center mx-auto">
                      <MessageSquare className="w-8 h-8" />
                   </div>
                   <div>
                      <h2 className="text-3xl font-serif font-black text-blue">Share Impact Experience</h2>
                      <p className="text-sm text-gray-500 mt-2">Your review for <span className="font-bold text-ruby font-sans">{reviewNgo.name}</span> helps others find authentic missions.</p>
                   </div>

                   <div className="flex justify-center gap-2">
                      {[...Array(5)].map((_, i) => (
                         <Star key={i} className="w-8 h-8 text-saffron fill-saffron cursor-pointer hover:scale-110 transition-transform" />
                      ))}
                   </div>

                   <textarea 
                     placeholder="How was your experience? (e.g. transparency, organization, impact...)"
                     className="w-full p-6 bg-sun/30 border-none rounded-3xl min-h-[150px] outline-none focus:ring-4 focus:ring-saffron/20 transition-all font-medium text-blue"
                   />

                   <button 
                     onClick={() => {
                        // In a real app we'd submit to API
                        alert("Impact review submitted! Thank you for strengthening the Samanvay community.");
                        setReviewNgo(null);
                     }}
                     className="w-full py-4 bg-blue text-white rounded-2xl font-black uppercase tracking-widest hover:bg-ruby transition-all shadow-xl shadow-blue/20"
                   >
                     Post Review
                   </button>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
                     *Reviews are verified against Samanvay's community database.
                   </p>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-8">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedStory(null)}
               className="absolute inset-0 bg-black/95 backdrop-blur-xl"
             />
             
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="relative w-full max-w-md aspect-[9/16] bg-gray-900 overflow-hidden md:rounded-[3rem] shadow-2xl flex flex-col"
             >
                {/* Progress Bar Container */}
                <div className="absolute top-0 left-0 right-0 z-20 p-4 flex gap-1">
                   <div className="h-1 bg-white ring-1 ring-black/20 flex-1 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: selectedStory?.videoId ? 600 : 15, ease: "linear" }}
                        className="h-full bg-saffron"
                        onAnimationComplete={() => {
                          if (!selectedStory?.videoId) setSelectedStory(null);
                        }}
                      />
                   </div>
                </div>

                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-start pt-10">
                   <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setSelectedStory(null)}
                        className="mr-2 text-white/50 hover:text-white transition-colors p-1"
                        title="Back"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-lg bg-white">
                        <LogoImage src={selectedStory.image} alt={selectedStory.ngoName} className="w-full h-full object-contain p-0.5" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm drop-shadow-md">{selectedStory.ngoName}</p>
                        <p className="text-white/70 text-[10px] font-black uppercase tracking-wider drop-shadow-md">Verified Impact</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => setSelectedStory(null)}
                     className="bg-black/20 hover:bg-black/40 p-2 rounded-full text-white backdrop-blur-md transition-colors"
                   >
                     <X className="w-6 h-6" />
                   </button>
                </div>

                {/* Main Content (Image/Video Simulator) */}
                <div className="flex-1 relative bg-black">
                    <LogoImage 
                       src={selectedStory.image} 
                       alt={selectedStory.ngoName}
                       className="w-full h-full object-contain opacity-20 p-20" 
                    />

                    {selectedStory.videoId && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-6">
                        <div className="w-20 h-20 bg-ruby/20 rounded-full flex items-center justify-center border border-ruby/30">
                          <Youtube className="w-10 h-10 text-ruby" />
                        </div>
                        <div>
                          <h4 className="text-white text-xl font-serif font-black mb-2 px-4 italic">Exclusive Documentary Coverage</h4>
                          <p className="text-white/60 text-xs font-bold uppercase tracking-widest leading-relaxed">
                            Watch the official mission story <br/> directly on our YouTube channel
                          </p>
                        </div>
                        <a 
                          href={`https://www.youtube.com/watch?v=${selectedStory.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-8 py-4 bg-ruby text-white text-xs font-black uppercase tracking-widest rounded-full hover:scale-110 hover:bg-ruby-hover transition-all shadow-2xl flex items-center gap-3"
                        >
                          <Youtube className="w-5 h-5" />
                          Watch Mission Story
                        </a>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 pointer-events-none" />
                   
                   {/* Caption Card */}
                   <div className="absolute bottom-32 left-0 right-0 p-8 pointer-events-none">
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white font-medium text-lg leading-snug drop-shadow-lg"
                      >
                        {selectedStory.caption}
                      </motion.p>
                   </div>
                </div>

                {/* Action Footer */}
                <div className="relative z-20 p-8 pt-0 flex flex-col gap-3">
                   <button 
                      className="w-full py-5 bg-gradient-to-r from-saffron to-green text-blue font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                      onClick={() => {
                        window.location.href = "/vouchers";
                      }}
                   >
                      <Heart className="w-4 h-4" />
                      Support This Mission
                   </button>
                   <p className="text-[9px] text-center text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                      100% of your contribution reaches the ground. <br/>
                      Verified by Samanvay Transparency Protocol.
                   </p>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Discovery Quiz Modal */}
      <AnimatePresence>
        {showQuiz && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowQuiz(false)}
               className="absolute inset-0 bg-blue/90 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-2xl overflow-hidden"
             >
                <button 
                  onClick={() => setShowQuiz(false)}
                  className="absolute top-8 right-8 text-gray-300 hover:text-blue transition-colors"
                >
                  <X />
                </button>

                {quizStep < quizQuestions.length ? (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between gap-4 mb-8">
                      {quizStep > 0 ? (
                        <button 
                          onClick={() => setQuizStep(prev => prev - 1)}
                          className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-blue transition-colors shrink-0"
                          title="Previous Question"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                      ) : (
                        <div className="w-9 h-9" /> // Spacer for alignment
                      )}
                      <div className="flex-1 flex gap-2">
                        {quizQuestions.map((_, i) => (
                          <div key={i} className={cn("h-1 flex-1 rounded-full", i <= quizStep ? "bg-saffron" : "bg-gray-100")} />
                        ))}
                      </div>
                      <div className="w-9 h-9" /> // Right spacer for symmtery
                    </div>
                    <h2 className="text-3xl font-serif font-black text-blue">
                      {quizQuestions[quizStep].question}
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                       {quizQuestions[quizStep].options.map((option, i) => (
                         <button
                           key={i}
                           onClick={() => {
                             if (option.action) {
                               option.action();
                             } else {
                               if (quizStep === 0) setUserValue(option.value as string);
                               if (quizStep === 1) setUserLocation(option.value as string);
                               setQuizStep(prev => prev + 1);
                             }
                           }}
                           disabled={isDetectingLocation}
                           className="w-full p-6 text-left border-2 border-gray-100 rounded-3xl hover:border-saffron hover:bg-saffron/5 transition-all group flex items-center justify-between"
                         >
                           <span className="font-bold text-blue group-hover:text-saffron">{option.label}</span>
                           {option.isLocation && isDetectingLocation ? (
                              <Navigation className="animate-spin w-5 h-5 text-saffron" />
                           ) : (
                              <ArrowRight className="w-5 h-5 text-gray-200 group-hover:text-saffron group-hover:translate-x-1 transition-all" />
                           )}
                         </button>
                       ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-8">
                    <div className="w-20 h-20 bg-green/10 text-green rounded-full flex items-center justify-center mx-auto">
                       <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-serif font-black text-blue">We've found matches!</h2>
                      <p className="text-gray-500 mt-2">Based on your values and location, we've filtered the best NGOs for you.</p>
                    </div>
                    <button 
                      onClick={() => setShowQuiz(false)}
                      className="w-full py-4 bg-blue text-white rounded-2xl font-black uppercase tracking-widest hover:bg-ruby transition-all"
                    >
                      Show Results
                    </button>
                  </div>
                )}
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ... rest of the file (NGOCard and SocialLink)

interface NGOCardProps {
  ngo: NGO;
  index: number;
  onLeaveReview: (ngo: NGO) => void;
  onViewProfile: (ngo: NGO) => void;
  onSupport: (ngo: NGO) => void;
  key?: React.Key;
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
            {sortedWords.map(([word, _]: any) => (
                <span key={word} className="px-2 py-1 bg-ruby/5 text-ruby text-[9px] font-black uppercase rounded-lg border border-ruby/10">
                    {word}
                </span>
            ))}
        </div>
    );
}

function NGOCard({ ngo, index, onLeaveReview, onViewProfile, onSupport }: NGOCardProps) {
  const [showReviews, setShowReviews] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all border border-gray-50 dark:border-white/5 flex flex-col group vibrant-card"
    >
      <div className="flex-1">
        <div className="flex justify-between items-start mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-ruby/10 to-saffron/10 rounded-2xl flex items-center justify-center font-serif text-2xl font-bold text-ruby shadow-inner cursor-pointer" onClick={() => onViewProfile(ngo)}>
             {ngo.name.substring(0,2)}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex -space-x-2">
              <a 
                href={ngo.socials.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border-2 border-gray-50 flex items-center justify-center text-ruby hover:z-10 transition-transform hover:scale-110 cursor-pointer shadow-sm"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href={ngo.socials.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white border-2 border-gray-50 flex items-center justify-center text-blue hover:z-10 transition-transform hover:scale-110 cursor-pointer shadow-sm"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
            {/* Verification Badges */}
            <div className="flex gap-1">
              {ngo.verification?.financial && (
                <div title="Financial Transparency" className="p-1 px-2 bg-green/10 text-green rounded-md flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span className="text-[8px] font-black uppercase">Tax-Exempt</span>
                </div>
              )}
              {ngo.verification?.fieldImpact && (
                <div title="Verified Field Impact" className="p-1 px-2 bg-blue/10 text-blue rounded-md flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  <span className="text-[8px] font-black uppercase">Field Verified</span>
                </div>
              )}
              {ngo.verification?.community && (
                <div title="Community Trusted" className="p-1 px-2 bg-saffron/10 text-saffron rounded-md flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span className="text-[8px] font-black uppercase">Community Choice</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <h3 
          className="text-2xl font-serif font-black text-blue dark:text-[#4a89ff] mb-2 group-hover:text-ruby transition-colors cursor-pointer"
          onClick={() => onViewProfile(ngo)}
        >
          {ngo.name}
        </h3>
        <div className="flex items-center text-gray-400 dark:text-gray-500 text-xs mb-4 font-bold uppercase tracking-wider">
          <MapPin className="w-3 h-3 mr-1 text-ruby" />
          {ngo.category} • {ngo.location}
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 font-light line-clamp-3">
          {ngo.description}
        </p>

      </div>

      <button 
        onClick={() => onViewProfile(ngo)}
        className="w-full py-4 bg-gradient-to-r from-ruby to-ruby/80 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-ruby/20 hover:scale-[1.02] active:scale-95 transition-all"
      >
        View Achievements
      </button>
    </motion.div>
  );
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-india-green hover:bg-india-green/10 transition-all"
    >
      {icon}
    </a>
  );
}
