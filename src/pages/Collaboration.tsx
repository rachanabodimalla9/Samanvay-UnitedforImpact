import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  Lock, 
  Users, 
  Package, 
  Handshake, 
  ArrowRight, 
  ArrowLeft,
  X, 
  MessageSquare, 
  Send,
  Plus,
  Briefcase,
  History,
  TrendingUp,
  MapPin,
  Globe,
  Ticket,
  Scan,
  FileText,
  Zap,
  CheckCircle,
  AlertCircle,
  Download,
  ShieldCheck
} from "lucide-react";
import { cn } from "../lib/utils";

interface Resource {
  id: string;
  ngoName: string;
  type: "Supplies" | "Talent" | "Infrastructure";
  location: string;
  description: string;
  timestamp: string;
}

interface Voucher {
  id: string;
  code: string;
  type: string;
  kind: string;
  status: string;
  recipient: string;
  val: string;
  source: string;
  logo?: string;
  price?: number;
}

const MOCK_RESOURCES: Resource[] = [
  {
    id: "res1",
    ngoName: "Goonj",
    type: "Supplies",
    location: "Hyderabad",
    description: "We have 200 surplus textbooks for Primary Grade students. Available for immediate pickup.",
    timestamp: "1h ago"
  },
  {
    id: "res2",
    ngoName: "CRY India",
    type: "Infrastructure",
    location: "Mumbai",
    description: "Available weekend training space (seated capacity 30) for non-profit workshops.",
    timestamp: "4h ago"
  }
];

export default function Collaboration() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab ] = useState<"resources" | "darpan" | "funding" | "reports">("resources");

  const [flashFunds, setFlashFunds] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  React.useEffect(() => {
    if (isLoggedIn) {
       fetch("/api/csr/flash-funds").then(r => r.json()).then(setFlashFunds);
       fetch("/api/csr/reports").then(r => r.json()).then(setAuditLogs);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-sun/30 dark:bg-gray-950 flex flex-col items-center justify-center p-8 transition-colors">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl"
        >
          <button 
            onClick={() => window.location.href = "/"}
            className="mb-8 p-3 hover:bg-white rounded-full text-gray-400 hover:text-blue transition-colors border border-gray-100 bg-white/50"
            title="Back to Home"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="w-20 h-20 bg-blue/10 rounded-3xl flex items-center justify-center text-blue mx-auto mb-8">
             <Building2 className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-serif font-black text-blue dark:text-white mb-6">B2B for <span className="text-ruby italic">Good</span></h1>
          <p className="text-xl text-gray-500 mb-12 leading-relaxed">
            Samanvay's exclusive portal for organizations to eliminate silos, share surplus resources, and bid together for massive impact.
          </p>

          <button 
            onClick={() => setShowLogin(true)}
            className="px-12 py-5 bg-blue text-white rounded-full font-black uppercase tracking-[0.2em] text-sm shadow-2xl hover:bg-ruby transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
          >
             <Lock className="w-4 h-4 text-saffron" />
             Organization Behind the Scenes
          </button>

          <p className="mt-8 text-xs font-black text-gray-400 uppercase tracking-widest">
            Identity Verified • NGO Auth Required
          </p>
        </motion.div>

        {/* Login Modal Simulator */}
        <AnimatePresence>
          {showLogin && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLogin(false)}
                className="absolute inset-0 bg-blue/95 backdrop-blur-md"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-white dark:bg-gray-900 w-full max-w-md rounded-[3rem] p-12 shadow-2xl overflow-hidden border dark:border-white/5"
              >
                <div className="text-center space-y-8">
                  <div className="flex items-center justify-between mb-2">
                    <button 
                      onClick={() => setShowLogin(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-400 hover:text-blue transition-colors"
                      title="Back"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-10"></div>
                  </div>
                  <div className="w-16 h-16 bg-blue/10 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto text-blue dark:text-blue-400">
                     <Lock className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif font-black text-blue dark:text-white">NGO Authentication</h2>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Enter your Samanvay Organization ID</p>
                  </div>
                  
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Organization ID"
                      defaultValue="SAMANVAY-2024"
                      className="w-full p-5 bg-gray-50 dark:bg-blue-900/20 border border-transparent dark:border-white/5 rounded-2xl outline-none focus:ring-4 focus:ring-blue/20 font-black text-center uppercase tracking-widest text-xs dark:text-white transition-all"
                    />
                    <input 
                      type="password" 
                      placeholder="Access Token"
                      defaultValue="SOCIAL-IMPACT"
                      className="w-full p-5 bg-gray-50 dark:bg-blue-900/20 border border-transparent dark:border-white/5 rounded-2xl outline-none focus:ring-4 focus:ring-blue/20 font-black text-center dark:text-white transition-all"
                    />
                    <p className="text-[10px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-[0.2em] mt-2">Temporary credentials pre-filled for preview</p>
                  </div>

                  <button 
                    onClick={() => {
                      setIsLoggedIn(true);
                      setShowLogin(false);
                    }}
                    className="w-full py-5 bg-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue/20 hover:bg-ruby transition-all"
                  >
                    Enter Portal
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Portal Header */}
      <div className="bg-blue text-white py-12 px-10 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                   <Building2 className="w-8 h-8 text-saffron" />
                </div>
                <div>
                   <h1 className="text-3xl font-serif font-black">Collaboration Central</h1>
                   <p className="text-xs font-black uppercase tracking-widest text-white/40 mt-1">Verified: Goonj • Administrator Portal</p>
                </div>
            </div>

            <div className="flex gap-4">
               <button 
                 onClick={() => window.location.href = "/"}
                 className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all text-white/80"
               >
                  <ArrowLeft className="w-4 h-4" />
                  Main Site
               </button>
               <button 
                onClick={() => setIsLoggedIn(false)}
                className="flex items-center gap-2 px-6 py-3 bg-ruby/20 rounded-xl border border-ruby/20 text-xs font-black uppercase tracking-widest hover:bg-ruby/40 transition-all text-ruby-400"
               >
                  <Lock className="w-4 h-4" />
                  Sign Out
               </button>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
         {/* Navigation Tabs */}
         <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-100 flex flex-wrap gap-2 max-w-fit mx-auto mb-12">
            <button 
              onClick={() => setActiveTab("resources")}
              className={cn(
                "px-6 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === "resources" ? "bg-blue text-white shadow-lg shadow-blue/20" : "text-gray-400 hover:text-blue"
              )}
            >
              <Package className="w-4 h-4" />
              Resources
            </button>
            <button 
              onClick={() => setActiveTab("funding")}
              className={cn(
                "px-6 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === "funding" ? "bg-blue text-white shadow-lg shadow-blue/20" : "text-gray-400 hover:text-blue"
              )}
            >
              <Zap className="w-4 h-4" />
              Flash Fund
            </button>
            <button 
              onClick={() => setActiveTab("reports")}
              className={cn(
                "px-6 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === "reports" ? "bg-blue text-white shadow-lg shadow-blue/20" : "text-gray-400 hover:text-blue"
              )}
            >
              <FileText className="w-4 h-4" />
              Audit Log
            </button>
            <button 
              onClick={() => setActiveTab("darpan")}
              className={cn(
                "px-6 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === "darpan" ? "bg-blue text-white shadow-lg shadow-blue/20" : "text-gray-400 hover:text-blue"
              )}
            >
              <Globe className="w-4 h-4" />
              Darpan
            </button>
         </div>

         {/* Content Area */}
         <AnimatePresence mode="wait">
            {activeTab === "resources" ? (
              <motion.div 
                key="resources"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="flex justify-between items-end border-b border-gray-200 pb-6">
                   <div>
                      <h2 className="text-4xl font-serif font-black text-blue">Resource Surplus Portal</h2>
                      <p className="text-gray-500 mt-2">Sharing local logistics, supplies, and talent between NGOs.</p>
                   </div>
                   <button className="flex items-center gap-2 px-6 py-4 bg-ruby text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-ruby/20">
                      <Plus className="w-4 h-4" />
                      List Resource
                   </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   {MOCK_RESOURCES.map((res) => (
                      <div key={res.id} className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 group hover:shadow-2xl transition-all">
                         <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-blue/5 rounded-2xl flex items-center justify-center text-blue">
                                  <Package className="w-6 h-6" />
                               </div>
                               <div>
                                  <h4 className="text-xl font-bold text-blue">{res.ngoName}</h4>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-ruby">{res.type} • {res.timestamp}</p>
                               </div>
                            </div>
                            <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                               <MapPin className="w-3 h-3" />
                               {res.location}
                            </span>
                         </div>
                         <p className="text-gray-600 leading-relaxed font-medium mb-8">"{res.description}"</p>
                         <div className="flex gap-4">
                            <button className="flex-1 py-4 bg-blue text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-ruby transition-all">Claim Resource</button>
                            <button className="px-6 border-2 border-gray-100 rounded-2xl text-gray-400 hover:text-blue hover:border-blue transition-all">
                               <MessageSquare className="w-5 h-5" />
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
              </motion.div>
            ) : activeTab === "funding" ? (
               <motion.div 
                 key="funding"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                 <div className="flex justify-between items-end border-b border-gray-200 pb-6">
                    <div>
                       <h2 className="text-4xl font-serif font-black text-blue">Flash Funding <span className="text-ruby text-sm align-top">Rapid Response</span></h2>
                       <p className="text-gray-500 mt-2">Automated liquidity injection triggered by AI community pulse detection.</p>
                    </div>
                    <div className="bg-blue/5 px-6 py-4 rounded-2xl border border-blue/10">
                       <p className="text-[10px] font-black uppercase text-blue/40 tracking-widest mb-1">Treasury Status</p>
                       <p className="text-lg font-black text-blue">₹1.2 Cr Reserve</p>
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-8">
                    {flashFunds.map((fund) => (
                       <div key={fund.id} className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 relative overflow-hidden group">
                          <div className={cn(
                             "absolute top-0 right-0 px-6 py-2 text-[8px] font-black uppercase tracking-widest rounded-bl-3xl",
                             fund.status === 'Unlocked' ? "bg-green text-white" : "bg-sun text-blue"
                          )}>
                             {fund.status}
                          </div>
                          
                          <div className="flex items-center gap-4 mb-8">
                             <div className="w-14 h-14 bg-blue/5 rounded-2xl flex items-center justify-center text-blue relative">
                                <Zap className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-ruby rounded-full border-2 border-white flex items-center justify-center">
                                   <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                </div>
                             </div>
                             <div>
                                <h4 className="text-xl font-bold text-blue">{fund.ngoName}</h4>
                                <div className="flex items-center gap-2">
                                   <p className="text-[10px] font-black uppercase tracking-widest text-ruby">Flash Fund Batch #{fund.id}</p>
                                   <span className="text-[8px] bg-ruby/5 px-2 py-0.5 rounded-full text-ruby font-black uppercase tracking-tighter">AI Triggered</span>
                                </div>
                             </div>
                          </div>

                          <div className="p-6 bg-gray-50 rounded-3xl mb-8">
                             <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Assessment Reason</p>
                             <p className="text-xs text-gray-600 font-medium italic leading-relaxed">"{fund.reason}"</p>
                          </div>

                          <div className="flex items-center justify-between">
                             <div>
                                <p className="text-[10px] font-black uppercase text-gray-400">Approved Amount</p>
                                <p className="text-3xl font-black text-blue">{fund.amount}</p>
                             </div>
                             <button 
                               disabled={fund.status === 'Unlocked'}
                               className={cn(
                                  "px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all",
                                  fund.status === 'Unlocked' ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-blue text-white hover:bg-ruby shadow-xl shadow-blue/20"
                               )}
                             >
                                {fund.status === 'Unlocked' ? "Disbursed" : "Manual Unlock"}
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
               </motion.div>
             ) : activeTab === "reports" ? (
               <motion.div 
                 key="reports"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="space-y-8"
               >
                 <div className="flex justify-between items-end border-b border-gray-200 pb-6">
                    <div>
                       <h2 className="text-4xl font-serif font-black text-blue">Compliance & Audit</h2>
                       <p className="text-gray-500 mt-2">Tax-compliant export of proof-of-delivery and CSR spending.</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="hidden md:block bg-sun/10 px-4 py-2 rounded-xl border border-sun/20 text-right">
                          <p className="text-[8px] font-black uppercase text-sun tracking-widest">Est. Tax Savings</p>
                          <p className="text-sm font-black text-blue">₹3.42 Lakhs</p>
                       </div>
                       <button className="flex items-center gap-2 px-8 py-5 bg-blue text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-ruby transition-all shadow-xl shadow-blue/20">
                          <Download className="w-4 h-4" />
                          Export CSR-A1 Report
                       </button>
                    </div>
                 </div>

                 <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
                    
                    <div className="flex items-center justify-between mb-10">
                       <div className="flex items-center gap-4">
                          <FileText className="w-8 h-8 text-sun" />
                          <h4 className="text-xl font-black uppercase tracking-widest">Real-time Activity Ledger</h4>
                       </div>
                       <div className="flex gap-2">
                          <div className="w-2 h-2 bg-green rounded-full animate-pulse"></div>
                          <span className="text-[10px] font-black uppercase text-green tracking-widest">Sync Active</span>
                       </div>
                    </div>

                    <div className="space-y-4">
                       {auditLogs.map((log) => (
                          <div key={log.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                   {log.type === 'Voucher Burn' ? <Ticket className="w-4 h-4 text-ruby" /> : <Zap className="w-4 h-4 text-sun" />}
                                </div>
                                <div>
                                   <p className="text-xs font-black uppercase tracking-widest text-white/40">{log.type} • {log.user}</p>
                                   <p className="text-sm font-medium">{log.detail}</p>
                                </div>
                             </div>
                             <span className="text-[10px] font-bold text-white/30">{log.timestamp}</span>
                          </div>
                       ))}
                       {auditLogs.length === 0 && (
                          <p className="text-gray-500 text-center py-12 italic">No logs detected this period.</p>
                       )}
                    </div>

                    <div className="mt-10 p-8 border-t border-white/5 flex justify-between items-center bg-white/5 -mb-10 -mx-10">
                        <div className="flex items-center gap-3">
                           <ShieldCheck className="w-6 h-6 text-green" />
                           <div>
                              <p className="text-[10px] font-black uppercase text-white/40">Audit Guarantee</p>
                              <p className="text-xs font-bold text-white/80">Compliant with Section 135 of Company Act</p>
                           </div>
                        </div>
                        <p className="text-[10px] font-black uppercase text-sun cursor-pointer hover:underline tracking-widest">Generate PDF Digest</p>
                    </div>
                 </div>
               </motion.div>
             ) : activeTab === "darpan" ? (
              <motion.div 
                key="darpan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-end border-b border-gray-200 pb-6">
                   <div>
                      <h2 className="text-4xl font-serif font-black text-blue">NGO Darpan Official</h2>
                      <p className="text-gray-500 mt-2">Access the Ministry of Electronics & IT official portal for NGO verification.</p>
                   </div>
                   <a 
                    href="https://ngodarpan.gov.in/#/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-4 bg-blue text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-ruby transition-all shadow-xl shadow-blue/20"
                   >
                      Launch Portal
                      <ArrowRight className="w-4 h-4" />
                   </a>
                </div>

                <div className="bg-white rounded-[3rem] p-4 shadow-2xl border border-gray-100 overflow-hidden h-[800px] relative flex flex-col">
                   <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-gray-50 -z-10">
                      <div className="w-20 h-20 bg-blue/10 rounded-full flex items-center justify-center mb-6 text-blue">
                        <Globe className="w-10 h-10" />
                      </div>
                      <h3 className="text-2xl font-serif font-black text-blue mb-4">Official Portal Security</h3>
                      <p className="text-gray-500 max-w-md mb-8">
                        The NGO Darpan portal has security protocols that may prevent it from being viewed inside another app. 
                        Please use the button below to access the official site securely in a new window.
                      </p>
                      <a 
                        href="https://ngodarpan.gov.in/#/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-blue text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-ruby transition-all"
                      >
                        Open Official Portal
                      </a>
                   </div>
                   <iframe 
                    src="https://ngodarpan.gov.in/#/" 
                    className="w-full h-full rounded-[2rem] bg-white relative z-10"
                    title="NGO Darpan Portal"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                   />
                   <div className="absolute top-8 right-8 animate-pulse z-20">
                      <div className="px-3 py-1 bg-green-500 text-white text-[8px] font-black uppercase rounded-full tracking-widest shadow-lg">Live Connection</div>
                   </div>
                </div>
              </motion.div>
            ) : null}
         </AnimatePresence>
      </div>

      {/* Persistence / Analytics Section */}
      <div className="max-w-7xl mx-auto px-4 mt-20">
         <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-white/50 rounded-3xl border border-white flex items-center gap-6">
               <div className="w-12 h-12 bg-blue text-white rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-2xl font-black text-blue">₹4.2 Cr</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Joint Impact Value</p>
               </div>
            </div>
            <div className="p-8 bg-white/50 rounded-3xl border border-white flex items-center gap-6">
               <div className="w-12 h-12 bg-ruby text-white rounded-2xl flex items-center justify-center">
                  <Handshake className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-2xl font-black text-blue">89</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Resources Shared</p>
               </div>
            </div>
          </div>
       </div>

    </div>
  );
}
