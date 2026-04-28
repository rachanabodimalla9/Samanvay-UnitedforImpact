import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import { Ticket, Building2, Heart, ArrowUpRight, ShieldCheck, ShoppingBag, Utensils, X, QrCode, Smartphone, Shield, MessageSquare, Star } from "lucide-react";

interface Voucher {
  id: string;
  corporate: string;
  value: number;
  type: string;
  ngoId: string;
  description: string;
  logo?: string;
  price?: number;
}

interface Feedback {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export default function Vouchers() {
  const [b2bVouchers, setB2bVouchers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedVoucher, setSelectedVoucher] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [isPaying, setIsPaying] = useState(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    { id: "f1", user: "Rohan D.", rating: 5, comment: "Redeeming my Levi's voucher was seamless. Love the impact initiative!", date: "2 days ago" },
    { id: "f2", user: "Shikha P.", rating: 4, comment: "Great to see big brands contributing to NGOs through these vouchers.", date: "1 week ago" },
    { id: "f3", user: "Ananya K.", rating: 5, comment: "The community help is real. Claimed a medical kit easily.", date: "3 days ago" },
  ]);
  const [newFeedback, setNewFeedback] = useState({ user: "", comment: "", rating: 5 });

  useEffect(() => {
    // B2B/CSR Vouchers (Hub Management)
    fetch("/api/csr/vouchers")
      .then(res => res.json())
      .then(data => setB2bVouchers(data));
  }, []);

  const categories = ["All", "Education", "Health", "Water", "Livelihood", "Environment", "Sanitation"];

  const filteredVouchers = b2bVouchers.filter(v => {
    const matchesSearch = v.source.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         v.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         v.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || v.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getBrandIcon = (corporate: string) => {
    const brand = corporate.toLowerCase();
    if (brand.includes('dominos') || brand.includes('kfc') || brand.includes('zomato')) {
      return <Utensils className="w-8 h-8 text-ruby" />;
    }
    if (brand.includes('apollo') || brand.includes('health')) {
      return <Heart className="w-8 h-8 text-ruby" />;
    }
    return <Building2 className="w-8 h-8 text-blue" />;
  };

  const getBrandColor = (corporate: string) => {
    const brand = corporate.toLowerCase();
    if (brand.includes('zara')) return 'border-black text-black';
    if (brand.includes('h&m')) return 'border-ruby text-ruby';
    if (brand.includes('dominos')) return 'border-blue text-blue';
    if (brand.includes('kfc')) return 'border-ruby text-ruby';
    if (brand.includes('adidas')) return 'border-black text-black';
    return 'border-saffron text-saffron';
  };

  return (
    <>
      <div className="min-h-screen bg-sun/20 py-16">
        <div className="max-w-7xl mx-auto px-4">
        {/* Hub Header */}
        <div className="bg-gradient-to-br from-blue via-blue/90 to-blue/80 text-white p-16 rounded-[4rem] shadow-2xl flex flex-col items-center text-center gap-6 mb-20 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
           <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
             <div className="w-2 h-2 bg-saffron rounded-full animate-ping"></div>
             <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Official Samanvay Node</span>
           </div>
           <h1 className="text-5xl md:text-8xl font-serif font-black leading-tight tracking-tighter">Voucher <br /> Hub.</h1>
           <p className="text-white/80 max-w-2xl text-lg font-light">Centralized management for impact rewards and B2B aid distributions. Transparency in every burn.</p>
           
           <div className="flex gap-4 mt-6">
              <button 
                onClick={() => document.getElementById('feedback-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-8 py-3 rounded-2xl border border-white/20 text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 group"
              >
                 Community Stories <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </button>
           </div>
           
           <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">Impact Tokens</p>
                 <p className="text-3xl font-black">1,450</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">Vouchers Claimed</p>
                 <p className="text-3xl font-black">12</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">NGO Trust Rank</p>
                 <p className="text-3xl font-black">#42</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">Community Level</p>
                 <p className="text-3xl font-black text-white">Elite</p>
              </div>
           </div>
        </div>

        {/* B2B Management Section */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 pl-6">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-blue text-white rounded-2xl shadow-lg">
                  <ShieldCheck className="w-6 h-6" />
               </div>
               <div>
                  <h2 className="text-3xl font-serif font-black text-blue">B2B Aid Track</h2>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">CSR Managed Distributions ({filteredVouchers.length} Active)</p>
               </div>
            </div>
            
            <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[400px]">
               <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search by Corporate, Code or Cause..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-xl focus:ring-4 focus:ring-blue/5 outline-none transition-all text-sm font-medium"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-blue text-white rounded-lg pointer-events-none">
                     <Ticket className="w-4 h-4" />
                  </div>
               </div>
               
               <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {categories.map((cat) => (
                     <button
                       key={cat}
                       onClick={() => setActiveCategory(cat)}
                       className={cn(
                          "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                          activeCategory === cat 
                            ? "bg-blue text-white shadow-lg" 
                            : "bg-white text-gray-400 border border-gray-100 hover:border-blue/20"
                       )}
                     >
                        {cat}
                     </button>
                  ))}
               </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
             <div className="max-h-[600px] overflow-y-auto overflow-x-auto scrollbar-thin">
               <table className="w-full text-left">
                  <thead className="sticky top-0 z-10">
                     <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Aid Program</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Benefit</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {filteredVouchers.map((v) => (
                        <tr key={v.id} className="hover:bg-gray-50/50 transition-colors group">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 {v.logo ? (
                                    <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl p-2 flex items-center justify-center shadow-md overflow-hidden group-hover:scale-110 transition-transform bg-gradient-to-br from-white to-gray-50/50 relative">
                                       <img 
                                         src={v.logo} 
                                         alt={v.source} 
                                         className="max-w-full max-h-full object-contain relative z-10" 
                                         onError={(e) => {
                                           const target = e.target as HTMLImageElement;
                                           target.style.display = 'none';
                                           const parent = target.parentElement;
                                           if (parent) {
                                             const existingFallback = parent.querySelector('.logo-fallback');
                                             if (!existingFallback) {
                                               const fallback = document.createElement('div');
                                               fallback.className = 'logo-fallback w-full h-full flex items-center justify-center text-blue text-xs font-black uppercase';
                                               fallback.innerText = v.source?.substring(0, 2) || '??';
                                               parent.appendChild(fallback);
                                             }
                                           }
                                         }}
                                       />
                                    </div>
                                 ) : (
                                    <div className="w-14 h-14 bg-blue/5 rounded-2xl flex items-center justify-center text-blue text-xs font-black uppercase border border-blue/10">
                                       {v.source?.substring(0, 2)}
                                    </div>
                                 )}
                                 <div>
                                    <p className="text-sm font-black text-blue tracking-tight">{v.code}</p>
                                    <p className="text-[10px] font-medium text-gray-400">{v.source}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex flex-col gap-1">
                                 <span className="text-sm font-black text-ruby">{v.val}</span>
                                 <div className="flex items-center gap-1.5">
                                    <ShieldCheck className="w-3 h-3 text-green" />
                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{v.type} • Verified</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className={cn(
                                 "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                 v.status === 'Active' ? "bg-green/10 text-green" : "bg-gray-100 text-gray-400"
                              )}>
                                 {v.status}
                              </span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              {v.status === 'Active' && (
                                <button 
                                  onClick={() => setSelectedVoucher(v)}
                                  className="px-6 py-2 bg-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-ruby transition-all shadow-md active:scale-95"
                                >
                                   {v.price ? `Claim for ₹${v.price}` : "Claim Aid"}
                                </button>
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
             </div>
             {filteredVouchers.length === 0 && (
                <div className="p-20 text-center">
                   <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Ticket className="w-8 h-8 opacity-20" />
                   </div>
                   <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No matching programs found</p>
                </div>
             )}
          </div>
        </div>

        {/* Feedback Section */}
        <div id="feedback-section" className="mb-32 px-6 pt-20 border-t border-blue/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="flex items-center gap-8">
              <div className="p-5 bg-ruby text-white rounded-[2rem] shadow-2xl shadow-ruby/30 rotate-3">
                 <MessageSquare className="w-10 h-10" />
              </div>
              <div>
                 <p className="text-sm font-black uppercase tracking-[0.4em] text-ruby mb-2">Social Proof</p>
                 <h2 className="text-4xl md:text-5xl font-serif font-black text-blue tracking-tighter">Community <br /> Impact.</h2>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md px-8 py-4 rounded-3xl border border-white">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-blue/10 flex items-center justify-center text-[10px] font-black text-blue overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" className="w-full h-full object-cover" />
                     </div>
                  ))}
               </div>
               <p className="text-xs font-black text-blue uppercase tracking-widest">Join 2.4k+ Satisfied Members</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-20">
             <div className="lg:col-span-2 space-y-12">
                {feedbacks.map((f, idx) => (
                   <motion.div 
                     key={f.id}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ delay: idx * 0.1, duration: 0.8 }}
                     viewport={{ once: true }}
                     className="bg-white p-16 rounded-[4.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col gap-12 group hover:scale-[1.02] transition-all relative overflow-hidden"
                   >
                      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue/[0.02] to-transparent pointer-events-none"></div>
                      <div className="flex justify-between items-center relative z-10">
                         <div className="flex items-center gap-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue via-blue-dark to-black rounded-[2.5rem] flex items-center justify-center font-black text-white text-3xl shadow-2xl shadow-blue/30 relative group-hover:rotate-6 transition-transform">
                               {f.user.charAt(0)}
                               <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green rounded-full border-4 border-white flex items-center justify-center">
                                  <ShieldCheck className="w-4 h-4 text-white" />
                               </div>
                            </div>
                            <div className="flex flex-col gap-2">
                               <p className="text-xl font-black text-blue tracking-tight">{f.user}</p>
                               <div className="flex items-center gap-3">
                                  <span className="w-2 h-2 bg-green rounded-full"></span>
                                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] bg-gray-50 px-3 py-1 rounded-full border border-gray-100">Verified Impact Story</p>
                               </div>
                            </div>
                         </div>
                         <div className="flex gap-2 bg-saffron/5 px-8 py-4 rounded-[1.5rem] border border-saffron/20 shadow-sm">
                            {Array.from({ length: 5 }).map((_, i) => (
                               <Star key={i} className={cn("w-6 h-6", i < f.rating ? "text-saffron fill-saffron drop-shadow-sm" : "text-gray-100")} />
                            ))}
                         </div>
                      </div>
                      <div className="relative">
                         <span className="text-[12rem] font-serif text-blue/[0.03] absolute -top-24 -left-12 select-none leading-none">“</span>
                         <p className="text-gray-950 text-xl md:text-2xl leading-relaxed font-serif relative z-10 pl-6 font-semibold tracking-tight">
                            {f.comment}
                         </p>
                      </div>
                      <div className="pt-10 border-t border-gray-50 flex justify-between items-center relative z-10">
                         <div className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 bg-ruby rounded-full"></div>
                            <span className="text-sm text-gray-400 font-bold uppercase tracking-[0.3em]">{f.date}</span>
                         </div>
                         <button className="text-xs font-black text-blue uppercase tracking-[0.4em] flex items-center gap-3 group/btn hover:text-ruby transition-all">
                            HELPFUL? <span className="w-10 h-10 rounded-full border border-blue/10 flex items-center justify-center group-hover/btn:border-ruby/20 transition-all">
                               <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                            </span>
                         </button>
                      </div>
                   </motion.div>
                ))}
             </div>

             <div className="lg:sticky lg:top-24 h-fit">
                <div className="bg-gradient-to-br from-blue via-blue-dark to-[#001144] text-white p-14 rounded-[5rem] shadow-[0_50px_100px_-20px_rgba(0,51,204,0.4)] relative overflow-hidden border border-white/10 ring-1 ring-white/20">
                   <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                   <div className="absolute bottom-0 left-0 w-56 h-56 bg-ruby/20 rounded-full -ml-20 -mb-20 blur-2xl"></div>
                   <div className="relative z-10">
                      <h3 className="text-2xl font-serif font-black mb-6 leading-tight tracking-tight">Post Your <br /> Experience.</h3>
                      <p className="text-white text-[10px] mb-16 uppercase font-black tracking-[0.3em] leading-loose max-w-[240px]">Be the voice that inspires a community of changemakers.</p>
                      
                      <div className="space-y-14">
                         <div className="space-y-4 group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white pl-4 group-focus-within:text-saffron transition-colors">Digital Identity</label>
                            <input 
                              className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] px-10 py-7 outline-none focus:bg-white/10 focus:border-saffron/40 transition-all font-black placeholder:text-white/10 text-base tracking-tight shadow-2xl"
                              placeholder="Your Name..."
                              value={newFeedback.user}
                              onChange={(e) => setNewFeedback({...newFeedback, user: e.target.value})}
                            />
                         </div>
                         
                         <div className="space-y-8">
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white text-center tracking-[0.5em]">Rate Impact</label>
                            <div className="flex gap-4 items-center justify-center bg-black/20 p-8 rounded-[3.5rem] border border-white/5 shadow-inner">
                               {[1,2,3,4,5].map(num => (
                                  <button 
                                    key={num}
                                    onClick={() => setNewFeedback({...newFeedback, rating: num})}
                                    className="group transition-all active:scale-75"
                                  >
                                     <Star 
                                       className={cn(
                                         "w-12 h-12 transition-all duration-500", 
                                         newFeedback.rating >= num 
                                           ? "text-saffron fill-saffron drop-shadow-[0_0_20px_rgba(234,179,8,0.6)] scale-125" 
                                           : "text-white/5 group-hover:text-white/20"
                                       )} 
                                     />
                                  </button>
                               ))}
                            </div>
                         </div>

                         <div className="space-y-4 group">
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-white pl-4 group-focus-within:text-saffron transition-colors">Your Message</label>
                            <textarea 
                              rows={6}
                              className="w-full bg-white/5 border border-white/10 rounded-[3rem] px-10 py-9 outline-none focus:bg-white/10 focus:border-saffron/40 transition-all font-black resize-none placeholder:text-white/10 text-base leading-relaxed shadow-2xl tracking-tight"
                              placeholder="Speak your truth..."
                              value={newFeedback.comment}
                              onChange={(e) => setNewFeedback({...newFeedback, comment: e.target.value})}
                            />
                         </div>

                         <button 
                           onClick={() => {
                              if(!newFeedback.user || !newFeedback.comment) return;
                              setFeedbacks([{ id: Date.now().toString(), ...newFeedback, date: "Just now" }, ...feedbacks]);
                              setNewFeedback({ user: "", comment: "", rating: 5 });
                           }}
                           className="w-full bg-ruby text-white font-black py-10 rounded-[3.5rem] text-sm uppercase tracking-[0.5em] hover:bg-ruby/90 transition-all active:scale-95 shadow-3xl shadow-ruby/50 group overflow-hidden relative ring-4 ring-ruby/20 border border-white/10"
                         >
                            <span className="relative z-10 flex items-center justify-center gap-6 text-white">
                               Post Story <ArrowUpRight className="w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-500" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                         </button>
                      </div>
                   </div>
                </div>
                
                <div className="mt-10 p-8 bg-blue/5 rounded-[3rem] border border-blue/10 flex items-center gap-5">
                   <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue shadow-lg">
                      <ShieldCheck className="w-7 h-7" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-blue uppercase tracking-widest">End-to-End Secure</p>
                      <p className="text-[10px] text-gray-500 font-medium">All feedback is cryptographically verified on the Samanvay network.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>

      {/* Payment Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVoucher(null)}
            className="absolute inset-0 bg-blue/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white dark:bg-[#0a0a0a] w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-serif font-black text-blue">Redeem Voucher</h3>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Redeeming {selectedVoucher.corporate} Voucher</p>
              </div>
              <button 
                onClick={() => setSelectedVoucher(null)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-ruby transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between p-6 bg-blue/5 rounded-3xl border border-blue/10">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl border border-gray-100 overflow-hidden p-3 bg-gradient-to-br from-white to-gray-50">
                    {selectedVoucher.logo ? (
                       <img 
                         src={selectedVoucher.logo} 
                         alt={selectedVoucher.corporate || selectedVoucher.source}
                         className="max-w-full max-h-full object-contain" 
                         onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.style.display = 'none';
                           const parent = target.parentElement;
                           if (parent) {
                             const fallback = document.createElement('div');
                             fallback.className = 'w-full h-full flex items-center justify-center text-blue text-xl font-black uppercase';
                             fallback.innerText = (selectedVoucher.corporate || selectedVoucher.source)?.substring(0, 2) || '??';
                             parent.appendChild(fallback);
                           }
                         }}
                       />
                    ) : getBrandIcon(selectedVoucher.corporate || selectedVoucher.source)}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-blue/40">{selectedVoucher.corporate || selectedVoucher.source}</p>
                    <p className="text-xs font-bold text-blue">{selectedVoucher.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black uppercase text-gray-400">{selectedVoucher.price ? "Platform Fee" : "Contribution"}</p>
                  <p className="text-2xl font-serif font-black text-blue">₹{selectedVoucher.price || selectedVoucher.value}</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-blue/40 mb-4 pl-2">Select Payment Method</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-2 p-6 rounded-2xl border transition-all",
                      paymentMethod === 'upi'
                        ? "bg-blue/5 border-blue text-blue"
                        : "bg-gray-50 border-gray-100 text-gray-400"
                    )}
                  >
                    <QrCode className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase">UPI / QR</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-2 p-6 rounded-2xl border transition-all",
                      paymentMethod === 'card'
                        ? "bg-blue/5 border-blue text-blue"
                        : "bg-gray-50 border-gray-100 text-gray-400"
                    )}
                  >
                    <Smartphone className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase">NetBanking</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'upi' ? (
                <div className="bg-gray-50 rounded-2xl p-6 text-center border border-dashed border-blue/20">
                  <div className="w-24 h-24 bg-white p-2 rounded-xl mx-auto mb-4 shadow-inner">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=samanvay@upi&pn=Samanvay&am=${selectedVoucher.price || selectedVoucher.value}&cu=INR`}
                      alt="QR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[10px] font-black text-blue mb-1 uppercase tracking-widest">Scan with any UPI App</p>
                  <code className="text-[10px] bg-white px-3 py-1 rounded-full text-ruby border border-ruby/10">samanvay@paytm</code>
                </div>
              ) : (
                <div className="space-y-4 bg-gray-50 rounded-2xl p-6 border border-blue/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-[#0033cc] rounded flex items-center justify-center text-white font-black text-[8px]">HDFC</div>
                    <p className="text-[10px] font-black uppercase text-blue">NetBanking Portal</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[8px] font-black uppercase tracking-widest text-blue/40 pl-2">Customer ID</label>
                    <input 
                      type="text" 
                      placeholder="Enter Customer ID"
                      className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-blue/30 transition-all font-medium text-xs text-blue"
                    />
                  </div>
                  <button className="w-full bg-blue text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest hover:bg-ruby transition-all">
                    Login to HDFC Secure
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-[8px] text-gray-400 font-bold uppercase tracking-[0.2em] pt-4">
                <Shield className="w-3 h-3 text-green" />
                Secured by Samanvay Multi-Factor Security
              </div>
            </div>

            <div className="p-8 bg-gray-50 flex gap-4">
              <button 
                onClick={() => setSelectedVoucher(null)}
                className="flex-1 bg-white border border-gray-200 text-gray-400 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button 
                disabled={isPaying}
                onClick={async () => {
                  setIsPaying(true);
                  await new Promise(r => setTimeout(r, 1500));
                  setIsPaying(false);
                  alert(selectedVoucher.price ? `B2B Voucher Claimed Successfully! ${selectedVoucher.val} added to budget.` : "Impact Voucher Redeemed!");
                  setSelectedVoucher(null);
                }}
                className="flex-1 bg-ruby text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-blue transition-all shadow-xl shadow-ruby/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPaying ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Securing...
                  </>
                ) : (
                  selectedVoucher.price ? "Confirm & Claim" : "Redeem Now"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
