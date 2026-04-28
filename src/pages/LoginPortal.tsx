import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, ShieldCheck, Phone, User, Key, Building2, Eye, EyeOff } from "lucide-react";
import TranslationWidget from "../components/TranslationWidget";
import { cn } from "@/src/lib/utils";

interface LoginPortalProps {
  type: 'resident' | 'corporate' | 'ngo';
  onBack: () => void;
  onLogin: () => void;
}

export default function LoginPortal({ type, onBack, onLogin }: LoginPortalProps) {
  const [step, setStep] = useState<'info' | 'otp'>(type === 'ngo' ? 'info' : 'info');
  const [showSecret, setShowSecret] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    otp: '',
    orgId: '',
    secretCode: ''
  });
  const [error, setError] = useState('');

  const titles = {
    resident: { text: "Resident Access", icon: "🇮🇳" },
    corporate: { text: "Corporate Gateway", icon: "🏢" },
    ngo: { text: "NGO Dashboard", icon: "❤️" }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'ngo') {
      if (!formData.orgId) {
        setError("Please enter a valid Organizational ID.");
        return;
      }
      if (formData.orgId !== 'NGO-12345') {
        setError("Invalid Organizational ID. Try NGO-12345");
        return;
      }
    } else {
      if (!formData.firstName || !formData.lastName || formData.phone.length < 10) {
        setError("Please fill all fields correctly.");
        return;
      }
    }
    setError("");
    setStep('otp');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'ngo') {
      if (formData.secretCode === 'SAMANVAY-2024') {
        onLogin();
      } else {
        setError("Invalid Secret Code. Try SAMANVAY-2024");
      }
    } else {
      if (formData.otp === '123456') {
        onLogin();
      } else {
        setError("Invalid OTP. Use temporary code: 123456");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-blue/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-[3.5rem] shadow-3xl border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col relative z-10"
      >
        {/* Header */}
        <div className="p-10 pb-6 border-b border-gray-50 dark:border-white/5">
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-ruby hover:bg-ruby/5 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <TranslationWidget />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue/10 dark:bg-blue/20 rounded-[1.5rem] flex items-center justify-center text-3xl">
              {titles[type].icon}
            </div>
            <div>
              <h2 className="text-3xl font-serif font-black text-blue dark:text-white capitalize">{titles[type].text}</h2>
              <p className="text-xs font-bold text-ruby uppercase tracking-widest mt-1">Samanvay Authentication</p>
            </div>
          </div>
        </div>

        {/* Form area */}
        <div className="p-10 pt-8 flex-grow">
          <AnimatePresence mode="wait">
            {step === 'info' ? (
              <motion.form 
                key="info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleNextStep}
                className="space-y-6"
              >
                {type === 'ngo' ? (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Organizational ID</label>
                    <div className="relative">
                      <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-blue" />
                      <input 
                        type="text" 
                        required
                        value={formData.orgId}
                        onChange={(e) => setFormData({...formData, orgId: e.target.value})}
                        className="w-full h-16 pl-14 pr-6 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-blue/20 text-blue dark:text-white font-medium"
                        placeholder="NGO-12345"
                      />
                    </div>
                    <p className="text-[10px] font-bold text-blue/60 ml-4">Temporary ID: NGO-12345</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">First Name</label>
                        <div className="relative">
                          <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-blue" />
                          <input 
                            type="text" 
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="w-full h-16 pl-14 pr-6 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-blue/20 text-blue dark:text-white font-medium"
                            placeholder="Arjun"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Last Name</label>
                        <div className="relative">
                          <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-blue" />
                          <input 
                            type="text" 
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="w-full h-16 pl-14 pr-6 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-blue/20 text-blue dark:text-white font-medium"
                            placeholder="Sharma"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-blue" />
                        <input 
                          type="tel" 
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full h-16 pl-14 pr-6 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-blue/20 text-blue dark:text-white font-medium"
                          placeholder="98765 43210"
                        />
                      </div>
                    </div>
                  </>
                )}

                {error && <p className="text-ruby text-xs font-bold text-center">{error}</p>}

                <button 
                  type="submit"
                  className="w-full h-16 bg-blue text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {type === 'ngo' ? 'Next Step' : 'Request OTP'} <ArrowRight className="w-5 h-5" />
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerify}
                className="space-y-8 text-center"
              >
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-sun/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-10 h-10 text-sun" />
                  </div>
                  <h3 className="text-xl font-bold dark:text-white">
                    {type === 'ngo' ? 'Secret Code Verification' : 'Verify Account'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {type === 'ngo' 
                      ? 'Enter your unique Samanvay organization secret code' 
                      : `We've sent a 6-digit code to ${formData.phone}`}
                  </p>
                </div>

                <div className="relative">
                  <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-sun" />
                  <input 
                    type={showSecret ? "text" : "password"}
                    maxLength={type === 'ngo' ? 20 : 6}
                    required
                    value={type === 'ngo' ? formData.secretCode : formData.otp}
                    onChange={(e) => setFormData({
                      ...formData, 
                      [type === 'ngo' ? 'secretCode' : 'otp']: e.target.value
                    })}
                    className={cn(
                      "w-full h-20 pl-14 pr-16 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-sun/20 text-center text-blue dark:text-white font-black uppercase tracking-[0.2em]",
                      type !== 'ngo' && !showSecret && "tracking-[0.5em] text-3xl",
                      type !== 'ngo' && showSecret && "text-3xl tracking-[0.5em]"
                    )}
                    placeholder={type === 'ngo' ? "••••••••" : "000000"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sun transition-colors"
                  >
                    {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {type === 'ngo' && <p className="text-[10px] font-bold text-sun/60 mt-2">Temporary Code: SAMANVAY-2024</p>}
                </div>

                {error && <p className="text-ruby text-xs font-bold">{error}</p>}

                <button 
                  type="submit"
                  className="w-full h-16 bg-sun text-blue-900 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-sun/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  Verify & Enter <ArrowRight className="w-5 h-5" />
                </button>

                {type !== 'ngo' && (
                  <div className="bg-sun/10 py-3 rounded-2xl border border-sun/20">
                    <p className="text-[10px] font-black uppercase text-sun tracking-widest">Temporary OTP: 123456</p>
                  </div>
                )}

                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {type === 'ngo' 
                    ? 'Forgot your secret code? Contact your state node.' 
                    : 'Didn\'t receive? '}
                  {type !== 'ngo' && <span className="text-blue cursor-pointer">Resend in 30s</span>}
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="p-8 bg-gray-50 dark:bg-white/5 text-center">
          <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.3em]">Secured by Samanvay Blockchain Trust</p>
        </div>
      </motion.div>
    </div>
  );
}
