import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Briefcase, MapPin, Clock, ArrowRight, UserCheck, X, CheckCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface Job {
  id: string;
  ngoId: string;
  ngoName: string;
  title: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

function CareerNGOLogo({ ngoName, className }: { ngoName: string, className?: string }) {
  const domains: Record<string, string> = {
    "Goonj": "goonj.org",
    "Akshaya Patra Foundation": "akshayapatra.org",
    "CRY India": "cry.org",
    "Smile Foundation": "smilefoundationindia.org"
  };
  const domain = domains[ngoName] || "google.com";
  const initials = ngoName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const [error, setError] = React.useState(false);

  if (error) {
    return (
      <div className={cn("flex items-center justify-center bg-blue text-white font-serif font-black", className)}>
        {initials}
      </div>
    );
  }

  return (
    <img 
      src={`https://logo.clearbit.com/${domain}?size=100`} 
      alt={ngoName}
      className={className}
      onError={() => setError(true)}
      referrerPolicy="no-referrer"
    />
  );
}

export default function Careers() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/jobs")
      .then(res => res.json())
      .then(data => setJobs(data));
  }, []);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsApplying(false);
      setSelectedJob(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-sun py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Detail Modal */}
        <AnimatePresence>
          {selectedJob && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedJob(null)}
                className="absolute inset-0 bg-blue/90 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-2xl rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
              >
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="absolute top-8 right-8 text-gray-400 hover:text-blue transition-colors"
                >
                  <X />
                </button>

                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden p-2 shadow-sm shrink-0 border border-gray-100">
                      <CareerNGOLogo ngoName={selectedJob.ngoName} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-ruby/10 text-ruby rounded-full text-[10px] font-black uppercase tracking-widest">{selectedJob.type}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                           <MapPin className="w-3 h-3 text-ruby" /> {selectedJob.location}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-serif font-black text-blue leading-tight mb-1">{selectedJob.title}</h2>
                      <p className="text-ruby font-black uppercase text-xs tracking-[0.2em]">{selectedJob.ngoName}</p>
                    </div>
                  </div>

                  {submitted ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-12 text-center space-y-4"
                    >
                      <div className="w-20 h-20 bg-green/10 text-green rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-serif font-black text-blue">Application Sent!</h3>
                      <p className="text-gray-500 font-medium max-w-xs mx-auto">Your interest has been logged and shared with {selectedJob.ngoName}. They will reach out soon.</p>
                    </motion.div>
                  ) : isApplying ? (
                    <motion.form 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleApply}
                      className="space-y-6 bg-gray-50 p-8 rounded-3xl"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-blue/40 tracking-widest ml-1">Full Name</label>
                          <input required type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-ruby/20 transition-all" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-blue/40 tracking-widest ml-1">Email Address</label>
                          <input required type="email" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-ruby/20 transition-all" placeholder="john@impact.org" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-blue/40 tracking-widest ml-1">Why do you want to join {selectedJob.ngoName}?</label>
                        <textarea required className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-ruby/20 transition-all h-32 resize-none" placeholder="Share your motivation..."></textarea>
                      </div>
                      <div className="pt-4 flex gap-4">
                        <button type="submit" className="flex-1 py-4 bg-ruby text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-ruby/20 hover:scale-[1.02] transition-all">
                          Submit to NGO
                        </button>
                        <button type="button" onClick={() => setIsApplying(false)} className="px-8 py-4 bg-gray-200 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-300">
                           Back
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    <div className="space-y-8">
                      <div className="space-y-4">
                         <h4 className="text-xs font-black uppercase tracking-widest text-blue border-b border-gray-100 pb-2">Role Description</h4>
                         <p className="text-gray-600 leading-relaxed font-medium text-lg">
                            {selectedJob.description}
                         </p>
                      </div>

                      <div className="space-y-4">
                         <h4 className="text-xs font-black uppercase tracking-widest text-blue border-b border-gray-100 pb-2">Requirements</h4>
                         <ul className="grid gap-3">
                            {selectedJob.requirements.map((req, i) => (
                              <li key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                                 <CheckCircle className="w-6 h-6 text-green shrink-0" />
                                 <span className="text-sm text-gray-600 font-bold">{req}</span>
                              </li>
                            ))}
                         </ul>
                      </div>

                      <div className="pt-8 flex gap-4">
                         <button 
                           onClick={() => setIsApplying(true)}
                           className="flex-1 py-5 bg-blue text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-ruby transition-all shadow-xl shadow-blue/20 flex items-center justify-center gap-3"
                         >
                            <ArrowRight className="w-5 h-5" /> Apply Now
                         </button>
                         <button className="flex-1 py-5 bg-gray-50 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all">
                            Save for later
                         </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="flex-1">
            <h4 className="text-sm font-black uppercase tracking-[0.4em] text-ruby mb-4 flex items-center gap-2">
               <div className="w-2 h-2 bg-saffron rounded-full animate-pulse"></div>
               Careers with Character
            </h4>
            <h1 className="text-5xl md:text-8xl font-serif font-black text-blue leading-none">Architect Your <br /> <span className="text-ruby italic">Impact.</span></h1>
            <p className="mt-8 text-gray-500 text-xl font-light max-w-xl leading-relaxed">Your talent meets their transformation. Join 450+ verified NGOs and build a career that resonates far beyond the workplace.</p>
          </div>
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-gray-50 flex flex-col min-w-[320px] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <UserCheck className="w-32 h-32" />
             </div>
             <div className="flex justify-between items-center mb-8 relative z-10">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue">System Integrity</h4>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-green rounded-full"></div>
                  <div className="w-1 h-1 bg-green rounded-full"></div>
                  <div className="w-1 h-1 bg-green rounded-full"></div>
                </div>
             </div>
             <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-3 shadow-inner">
                <div className="h-full bg-gradient-to-r from-saffron via-ruby to-green w-full"></div>
             </div>
             <div className="flex justify-between text-[10px] font-black text-blue relative z-10">
                <span>IDENTITY VERIFIED</span>
                <span>SECURE</span>
             </div>
          </div>
        </div>

        <div className="mb-20 max-w-6xl mx-auto">
           <div className="bg-gradient-to-r from-blue to-ruby p-1 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="bg-sun px-8 py-10 rounded-[2.8rem] flex flex-col items-center gap-10 overflow-hidden">
                 <div className="w-full flex flex-col items-center text-center">
                    <h2 className="text-3xl font-serif font-black text-blue leading-none mb-4">Live Board</h2>
                    <div className="flex items-center gap-2 bg-green/10 px-4 py-2 rounded-full border border-green/20">
                       <div className="w-2 h-2 bg-green rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-700">Open Opportunities • Available Now</span>
                    </div>
                 </div>
                 
                 <div className="w-full overflow-x-auto no-scrollbar pb-4">
                    <div className="flex gap-5 px-4">
                       {jobs.map(job => (
                          <motion.div 
                            key={job.id + "_live"}
                            whileHover={{ scale: 1.05, y: -5 }}
                            onClick={() => setSelectedJob(job)}
                            className="shrink-0 w-[200px] bg-white p-5 rounded-[2rem] border border-gray-100 shadow-xl cursor-pointer group hover:bg-blue transition-all relative overflow-hidden"
                          >
                             <div className="absolute top-0 right-0 w-20 h-20 bg-blue/5 rounded-full -mr-10 -mt-10 transition-colors group-hover:bg-white/10" />
                             <p className="text-ruby font-black uppercase text-[9px] tracking-widest mb-2 group-hover:text-white/80 relative z-10">{job.ngoName}</p>
                             <h4 className="text-base font-serif font-black text-blue group-hover:text-white line-clamp-2 mb-4 leading-tight relative z-10">{job.title}</h4>
                             <div className="flex items-center justify-between relative z-10">
                                <span className="text-[9px] font-bold text-gray-400 group-hover:text-white/60 flex items-center gap-1">
                                   <MapPin className="w-3 h-3" /> {job.location}
                                </span>
                                <div className="p-2 bg-ruby/10 group-hover:bg-white/20 rounded-lg transition-colors">
                                   <ArrowRight className="w-3 h-3 text-ruby group-hover:text-white" />
                                </div>
                             </div>
                          </motion.div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid md:grid-cols-1 gap-12">
          <div className="space-y-6">
            {jobs.map((job, idx) => (
               <motion.div
                 key={job.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 onClick={() => setSelectedJob(job)}
                 className="bg-white p-10 rounded-[2.5rem] border border-gray-50 flex flex-col md:flex-row md:items-center justify-between group hover:border-ruby/20 transition-all shadow-xl hover:shadow-2xl vibrant-card cursor-pointer"
               >
                  <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1">
                     <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden p-2 shadow-sm shrink-0 border border-gray-100">
                        <CareerNGOLogo ngoName={job.ngoName} className="w-full h-full object-contain" />
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                           <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-ruby text-white rounded-full">{job.type}</span>
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {job.location}
                           </span>
                        </div>
                        <p className="text-ruby font-black uppercase text-[10px] tracking-widest mb-1">{job.ngoName}</p>
                        <h3 className="text-2xl font-serif font-black text-blue group-hover:text-ruby transition-colors">{job.title}</h3>
                        <p className="text-gray-500 text-sm mt-2 font-light italic">Impact focus: {job.description.split('.')[0]}.</p>
                     </div>
                  </div>

                  <button className="bg-blue text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue/20 group-hover:bg-ruby transition-all active:scale-95">
                    View & Apply
                  </button>
               </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
