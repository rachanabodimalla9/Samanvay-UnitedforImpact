import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, 
  Target, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Heart,
  Globe,
  Sparkles,
  ExternalLink,
  Search,
  AlertCircle,
  QrCode,
  Smartphone
} from 'lucide-react';

const JoinSamanvay = () => {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'volunteer';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: initialType,
    message: '',
    // Volunteer specific
    skills: '',
    availability: 'weekends',
    // NGO specific
    ngoName: '',
    regNumber: '',
    website: '',
    structureType: 'trust',
    hasDocumentation: [] as string[],
    nameApproved: false,
    has12A80G: false,
    darpanID: '',
    // Aadhaar Verification
    aadhaarNumber: '',
    aadhaarOtp: '',
    isAadhaarOtpSent: false,
    isAadhaarVerified: false,
    isAadhaarLoading: false,
    // Donor specific
    interest: 'education',
    frequency: 'one-time',
    donationAmount: '500',
    donationStartTime: '',
    donationEndTime: '',
    paymentMethod: 'upi' as 'upi' | 'card',
    onlineUpiId: '',
    customerID: '',
    accountNumber: '',
  });

  useEffect(() => {
    const type = searchParams.get('type');
    if (type && ['volunteer', 'ngo', 'donor'].includes(type)) {
      setFormData(prev => ({ ...prev, type }));
    }
  }, [searchParams]);

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const steps = [
    {
      title: "Join as Volunteer",
      description: "Direct action, ground work, and immediate impact.",
      icon: Users,
      color: "bg-blue/10 text-blue border-blue/20",
      type: "volunteer"
    },
    {
      title: "Join as NGO",
      description: "Integrate into the ecosystem and scale your operations.",
      icon: Globe,
      color: "bg-ruby/10 text-ruby border-ruby/20",
      type: "ngo"
    },
    {
      title: "Join as Donor",
      description: "Fuel high-impact projects with blockchain transparency.",
      icon: Heart,
      color: "bg-saffron/10 text-saffron border-saffron/20",
      type: "donor"
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-ruby/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Value Proposition */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue/5 border border-blue/10 text-blue text-[10px] font-black uppercase tracking-widest mb-8">
              <Sparkles className="w-3 h-3" />
              <span>Membership Open</span>
            </div>

            <h1 className="text-6xl font-serif font-black text-blue dark:text-white leading-[1.1] mb-8">
              Join us and start making a real <span className="text-ruby italic">Impact</span>.
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium mb-12 leading-relaxed max-w-lg">
              <span className="notranslate">Samanvay</span> is a platform where everyone can help build a better India. Choose how you want to join and start contributing today.
            </p>

            <div className="space-y-6">
              {[
                { icon: Shield, text: "Blockchain verified transparency", desc: "Every rupee, every hour, accounted for." },
                { icon: Target, text: "Data-driven impact reporting", desc: "See the real-time difference you make." },
                { icon: Zap, text: "Instant reward ecosystem", desc: "Earn tokens and vouchers for your service." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-gray-900 border border-blue/10 shadow-sm flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-blue" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-wider text-blue dark:text-white">{item.text}</h3>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-blue/10 dark:border-white/5 shadow-2xl p-4 sm:p-10 relative overflow-hidden"
          >
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 bg-green/10 text-green rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-serif font-black text-blue dark:text-white mb-4">Thank you for joining!</h2>
                <p className="text-gray-500 mb-8">We have received your request. Our team will contact you soon to get you started.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-4 bg-[#0033cc] text-white font-black uppercase text-xs tracking-widest rounded-xl hover:translate-y-[-2px] transition-all shadow-xl shadow-blue/20"
                >
                  Go Back
                </button>
              </motion.div>
            ) : (
              <>
                <div className="mb-10 text-center">
                  <h2 className="text-3xl font-serif font-black text-blue dark:text-white mb-2">Registration</h2>
                  <p className="text-xs font-black uppercase tracking-widest text-[#0033cc]/40">Universal Onboarding Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-3 gap-3 mb-8">
                    {steps.map((step) => (
                      <button
                        key={step.type}
                        type="button"
                        onClick={() => setFormData({...formData, type: step.type})}
                        className={cn(
                          "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 text-center",
                          formData.type === step.type 
                            ? "border-blue bg-blue/5 scale-[1.02] shadow-inner" 
                            : "border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 opacity-60 hover:opacity-100"
                        )}
                      >
                        <step.icon className={cn("w-6 h-6", formData.type === step.type ? "text-blue" : "text-gray-400")} />
                        <span className="text-[9px] font-black uppercase tracking-tighter">{step.title}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {/* Common Fields */}
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-blue/40 dark:text-white/40 mb-2 pl-4">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue/30 focus:bg-white dark:focus:bg-black/20 transition-all font-medium text-blue dark:text-white"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-blue/40 dark:text-white/40 mb-2 pl-4">Electronic Mail</label>
                      <input 
                        required
                        type="email" 
                        placeholder="rahul@domain.com"
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue/30 focus:bg-white dark:focus:bg-black/20 transition-all font-medium text-blue dark:text-white"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>

                    {/* Volunteer Specific Fields */}
                    {formData.type === 'volunteer' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-blue/40 dark:text-white/40 mb-2 pl-4">Primary Skills</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Teaching, Design, Logistics"
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue/30 focus:bg-white dark:focus:bg-black/20 transition-all font-medium text-blue dark:text-white"
                            value={formData.skills}
                            onChange={(e) => setFormData({...formData, skills: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-blue/40 dark:text-white/40 mb-2 pl-4">Availability</label>
                          <select 
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue/30 focus:bg-white dark:focus:bg-black/20 transition-all font-medium text-blue dark:text-white appearance-none"
                            value={formData.availability}
                            onChange={(e) => setFormData({...formData, availability: e.target.value})}
                          >
                            <option value="weekends">Weekends Only</option>
                            <option value="weekdays">Weekdays Only</option>
                            <option value="flexible">Flexible</option>
                            <option value="full-time">Full-time</option>
                          </select>
                        </div>
                      </motion.div>
                    )}

                    {/* NGO Specific Fields */}
                    {formData.type === 'ngo' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2 pl-4">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-blue/40 dark:text-white/40">NGO / Organization Name</label>
                            <a 
                              href="https://ngodarpan.gov.in/index.php/search/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[9px] font-black uppercase text-blue flex items-center gap-1 hover:underline"
                            >
                              Check NGO Darpan <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                          <div className="relative">
                            <input 
                              required
                              type="text" 
                              placeholder="Organization Full Name"
                              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue/30 focus:bg-white dark:focus:bg-black/20 transition-all font-medium text-blue dark:text-white pr-12"
                              value={formData.ngoName}
                              onChange={(e) => setFormData({...formData, ngoName: e.target.value})}
                            />
                            {formData.ngoName.length > 3 && (
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <div className="p-1.5 rounded-full bg-green/10 text-green-600">
                                  <Search className="w-4 h-4" />
                                </div>
                              </div>
                            )}
                          </div>
                          {formData.ngoName && (
                            <p className="mt-2 pl-4 text-[9px] text-gray-500 flex items-center gap-1.5">
                              <AlertCircle className="w-3 h-3 text-saffron" />
                              Ensure this name is unique as per the Emblems and Names Act, 1950.
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-blue/40 dark:text-white/40 mb-2 pl-4">Structure Type</label>
                            <select 
                              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue/30 focus:bg-white dark:focus:bg-black/20 transition-all font-medium text-blue dark:text-white appearance-none"
                              value={formData.structureType}
                              onChange={(e) => setFormData({...formData, structureType: e.target.value})}
                            >
                              <option value="trust">Trust (Act 1882)</option>
                              <option value="society">Society (Act 1860)</option>
                              <option value="section8">Section 8 Company</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-blue/40 dark:text-white/40 mb-2 pl-4">Reg. Number (if any)</label>
                            <input 
                              type="text" 
                              placeholder="Reg No. / Section 8 No."
                              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue/30 focus:bg-white dark:focus:bg-black/20 transition-all font-medium text-blue dark:text-white"
                              value={formData.regNumber}
                              onChange={(e) => setFormData({...formData, regNumber: e.target.value})}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-blue/40 dark:text-white/40 mb-2 pl-4">Documentation Status</label>
                          <div className="grid grid-cols-2 gap-2">
                            {['MOA/Bylaws', 'Trust Deed', 'ID/Address Proof', 'Name Approval'].map((doc) => (
                              <label key={doc} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 cursor-pointer hover:bg-white dark:hover:bg-black/20 transition-all">
                                <input 
                                  type="checkbox"
                                  className="w-4 h-4 rounded border-gray-300 text-blue focus:ring-blue"
                                  checked={formData.hasDocumentation.includes(doc)}
                                  onChange={(e) => {
                                    const newDocs = e.target.checked 
                                      ? [...formData.hasDocumentation, doc]
                                      : formData.hasDocumentation.filter(d => d !== doc);
                                    setFormData({...formData, hasDocumentation: newDocs});
                                  }}
                                />
                                <span className="text-[10px] font-bold uppercase text-gray-500">{doc}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="flex items-center gap-3 p-4 bg-blue/5 border border-blue/10 rounded-2xl cursor-pointer">
                            <input 
                              type="checkbox"
                              className="w-5 h-5 rounded border-blue/30 text-blue focus:ring-blue"
                              checked={formData.has12A80G}
                              onChange={(e) => setFormData({...formData, has12A80G: e.target.checked})}
                            />
                            <div>
                              <p className="text-[10px] font-black uppercase text-blue">12A & 80G Certified</p>
                              <p className="text-[8px] text-blue/60 uppercase">Tax exemption status achieved</p>
                            </div>
                          </label>

                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-blue/40 dark:text-white/40 mb-2 pl-4">NGO Darpan ID (Niti Aayog)</label>
                            <input 
                              type="text" 
                              placeholder="e.g. KA/2023/XXXXXX"
                              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue/30 focus:bg-white dark:focus:bg-black/20 transition-all font-medium text-blue dark:text-white"
                              value={formData.darpanID}
                              onChange={(e) => setFormData({...formData, darpanID: e.target.value})}
                            />
                          </div>
                        </div>

                        {/* Aadhaar Verification Section */}
                        <div className="p-6 bg-blue/5 border border-blue/10 rounded-[2rem] space-y-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-blue" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-blue">Representative Aadhaar Verification</h3>
                          </div>
                          
                          <div className="relative">
                            <label className="block text-[8px] font-black uppercase tracking-widest text-blue/40 mb-1 pl-2">Aadhaar Number</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                maxLength={12}
                                placeholder="12 Digit Aadhaar No."
                                disabled={formData.isAadhaarVerified}
                                className="flex-1 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue/30 transition-all font-medium text-xs text-blue dark:text-white"
                                value={formData.aadhaarNumber}
                                onChange={(e) => setFormData({...formData, aadhaarNumber: e.target.value.replace(/\D/g, '')})}
                              />
                              {!formData.isAadhaarOtpSent && !formData.isAadhaarVerified && (
                                <button
                                  type="button"
                                  disabled={formData.aadhaarNumber.length !== 12 || formData.isAadhaarLoading}
                                  onClick={() => {
                                    setFormData({...formData, isAadhaarLoading: true});
                                    setTimeout(() => {
                                      setFormData({...formData, isAadhaarLoading: false, isAadhaarOtpSent: true});
                                    }, 1500);
                                  }}
                                  className="px-4 py-2 bg-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ruby transition-all"
                                >
                                  {formData.isAadhaarLoading ? "Sending..." : "Send OTP"}
                                </button>
                              )}
                            </div>
                          </div>

                          {formData.isAadhaarOtpSent && !formData.isAadhaarVerified && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-3"
                            >
                              <div className="flex items-center justify-between px-2">
                                <label className="block text-[8px] font-black uppercase tracking-widest text-blue/40">Enter 6-Digit OTP</label>
                                <button 
                                  type="button" 
                                  className="text-[8px] font-bold text-blue hover:underline"
                                  onClick={() => setFormData({...formData, isAadhaarOtpSent: false, aadhaarOtp: ''})}
                                >
                                  Edit Number
                                </button>
                              </div>
                              <div className="flex gap-2">
                                <input 
                                  type="text" 
                                  maxLength={6}
                                  placeholder="XXXXXX"
                                  className="flex-1 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue/30 transition-all font-medium text-xs text-blue dark:text-white"
                                  value={formData.aadhaarOtp}
                                  onChange={(e) => setFormData({...formData, aadhaarOtp: e.target.value.replace(/\D/g, '')})}
                                />
                                <button
                                  type="button"
                                  disabled={formData.aadhaarOtp.length !== 6 || formData.isAadhaarLoading}
                                  onClick={() => {
                                    setFormData({...formData, isAadhaarLoading: true});
                                    setTimeout(() => {
                                      setFormData({...formData, isAadhaarLoading: false, isAadhaarVerified: true});
                                    }, 1500);
                                  }}
                                  className="px-4 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 hover:bg-green-600 transition-all font-medium"
                                >
                                  {formData.isAadhaarLoading ? "Verifying..." : "Verify OTP"}
                                </button>
                              </div>
                              <p className="text-[8px] text-gray-400 pl-2">OTP sent to linked mobile number ending in XXXX</p>
                            </motion.div>
                          )}

                          {formData.isAadhaarVerified && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl"
                            >
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <div>
                                <p className="text-[10px] font-black uppercase text-green-600">Aadhaar Verified</p>
                                <p className="text-[8px] text-green-600/70 uppercase">Identity confirmation successful</p>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-blue/40 dark:text-white/40 mb-2 pl-4">Website</label>
                          <input 
                            type="url" 
                            placeholder="https://your-ngo.org"
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue/30 focus:bg-white dark:focus:bg-black/20 transition-all font-medium text-blue dark:text-white"
                            value={formData.website}
                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Donor Specific Fields */}
                    {formData.type === 'donor' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-blue/40 dark:text-white/40 mb-2 pl-4">Interest Area</label>
                          <select 
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue/30 focus:bg-white dark:focus:bg-black/20 transition-all font-medium text-blue dark:text-white appearance-none"
                            value={formData.interest}
                            onChange={(e) => setFormData({...formData, interest: e.target.value})}
                          >
                            <option value="education">Education & Literacy</option>
                            <option value="health">Healthcare & Hygiene</option>
                            <option value="environment">Environment & Climate</option>
                            <option value="disaster">Disaster Relief</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-blue/40 dark:text-white/40 mb-2 pl-4">Donation Amount (INR)</label>
                          <div className="grid grid-cols-4 gap-2 mb-4">
                            {['250', '500', '750', '1000'].map((amount) => (
                              <button
                                key={amount}
                                type="button"
                                onClick={() => setFormData({...formData, donationAmount: amount})}
                                className={cn(
                                  "py-3 rounded-xl border text-[10px] font-black tracking-widest transition-all",
                                  formData.donationAmount === amount
                                    ? "bg-blue text-white border-blue shadow-lg"
                                    : "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-400 hover:text-blue"
                                )}
                              >
                                ₹{amount}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-blue/40 dark:text-white/40 mb-2 pl-4">Donation Frequency</label>
                          <div className="flex gap-4 mb-4">
                            {['one-time', 'monthly', 'annual'].map((freq) => (
                              <button
                                key={freq}
                                type="button"
                                onClick={() => setFormData({...formData, frequency: freq})}
                                className={cn(
                                  "flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                                  formData.frequency === freq
                                    ? "bg-blue text-white border-blue"
                                    : "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-400 hover:text-blue"
                                )}
                              >
                                {freq}
                              </button>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-blue/40 dark:text-white/40 mb-2 pl-4">Start Time</label>
                              <input 
                                type="datetime-local"
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue/30 focus:bg-white dark:focus:bg-black/20 transition-all font-medium text-blue dark:text-white text-xs"
                                value={formData.donationStartTime}
                                onChange={(e) => setFormData({...formData, donationStartTime: e.target.value})}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-blue/40 dark:text-white/40 mb-2 pl-4">End Time (Optional)</label>
                              <input 
                                type="datetime-local"
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-blue/30 focus:bg-white dark:focus:bg-black/20 transition-all font-medium text-blue dark:text-white text-xs"
                                value={formData.donationEndTime}
                                onChange={(e) => setFormData({...formData, donationEndTime: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-blue/40 dark:text-white/40 mb-2 pl-4">Payment Method</label>
                          <div className="flex gap-4 mb-6">
                            <button
                              type="button"
                              onClick={() => setFormData({...formData, paymentMethod: 'upi'})}
                              className={cn(
                                "flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                                formData.paymentMethod === 'upi'
                                  ? "bg-blue/5 border-blue text-blue"
                                  : "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-400"
                              )}
                            >
                              <QrCode className="w-6 h-6" />
                              <span className="text-[10px] font-black uppercase">UPI / QR Scan</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({...formData, paymentMethod: 'card'})}
                              className={cn(
                                "flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                                formData.paymentMethod === 'card'
                                  ? "bg-blue/5 border-blue text-blue"
                                  : "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-400 hover:text-blue hover:bg-white dark:hover:bg-black/20"
                              )}
                            >
                              <Smartphone className="w-6 h-6" />
                              <span className="text-[10px] font-black uppercase">Online / Card</span>
                            </button>
                          </div>

                          {formData.paymentMethod === 'upi' && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-gray-50 dark:bg-black/20 rounded-2xl p-6 border border-dashed border-blue/20 text-center"
                            >
                              <div className="w-32 h-32 bg-white dark:bg-white p-2 rounded-xl mx-auto mb-4 shadow-inner">
                                {/* Using a placeholder QR code image */}
                                <img 
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=samanvay@upi&pn=SamanvayNGO&am=${formData.donationAmount}&cu=INR`}
                                  alt="UPI QR Code" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <p className="text-[10px] font-black text-blue mb-1 uppercase">Scan to Donate ₹{formData.donationAmount}</p>
                              <code className="text-[10px] bg-white dark:bg-white/10 px-3 py-1 rounded-full text-ruby border border-ruby/10">samanvay@okhdfcbank</code>
                              <div className="mt-4 flex items-center justify-center gap-2 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                                <Shield className="w-3 h-3" />
                                Secured by Blockchain Protocol
                              </div>
                            </motion.div>
                          )}

                          {formData.paymentMethod === 'card' && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-4 bg-gray-50 dark:bg-black/20 rounded-2xl p-6 border border-blue/10"
                            >
                              <div className="pb-4 border-b border-blue/5">
                                <div className="flex items-center gap-2 mb-4">
                                  <div className="w-8 h-8 bg-[#0033cc] rounded flex items-center justify-center text-white font-black text-[10px]">HDFC</div>
                                  <p className="text-[10px] font-black uppercase text-blue">Secure NetBanking Portal</p>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-[8px] font-black uppercase tracking-widest text-blue/40 mb-1 pl-2">Customer ID / User ID</label>
                                    <input 
                                      type="text" 
                                      placeholder="Available on your cheque book"
                                      className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue/30 transition-all font-medium text-xs text-blue dark:text-white"
                                      value={formData.customerID}
                                      onChange={(e) => setFormData({...formData, customerID: e.target.value})}
                                    />
                                  </div>
                                  <p className="text-[8px] text-gray-400 font-medium italic">Your IP address is being logged for security purposes.</p>
                                </div>
                              </div>

                              <div className="pt-2">
                                <label className="block text-[8px] font-black uppercase tracking-widest text-blue/40 mb-2 pl-2">Or Pay via UPI ID</label>
                                <div className="relative">
                                  <input 
                                    type="text" 
                                    placeholder="yourname@upi"
                                    className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue/30 transition-all font-medium text-xs text-blue dark:text-white pr-10"
                                    value={formData.onlineUpiId}
                                    onChange={(e) => setFormData({...formData, onlineUpiId: e.target.value})}
                                  />
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-blue/20">
                                    <Smartphone className="w-4 h-4" />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-blue/40 dark:text-white/40 mb-2 pl-4">Message / Note</label>
                      <textarea 
                        rows={2}
                        placeholder="Any specific mission or goal you have in mind?"
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue/30 focus:bg-white dark:focus:bg-black/20 transition-all font-medium text-blue dark:text-white resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full group bg-[#0033cc] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] overflow-hidden relative transition-all active:scale-95 shadow-xl shadow-blue/20 active:shadow-none"
                  >
                    <div className="absolute inset-0 bg-ruby translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Join <span className="notranslate">Samanvay</span> Now
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>

                  <p className="text-[8px] text-center text-gray-400 dark:text-white/30 uppercase tracking-widest mt-6">
                    By joining, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};


// Helper function for conditional classes (copied from utils or locally defined)
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default JoinSamanvay;
