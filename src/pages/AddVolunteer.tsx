import React, { useState } from "react";
import { motion } from "motion/react";
import { UserPlus, Mail, Phone, MapPin, Heart, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function AddVolunteer() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    interests: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 text-center"
        >
          <div className="w-20 h-20 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif font-black text-blue dark:text-white mb-4">Registration Successful!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Thank you for joining the Samanvay movement. Our community team will reach out to you shortly via email.
          </p>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-ruby transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-blue transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Hub</span>
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-[3.5rem] shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
          <div className="bg-blue p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                <UserPlus className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-serif font-black mb-2">Join the Mission</h1>
              <p className="text-white/60 font-medium italic">Apply to become a verified Samanvay volunteer and impact thousands.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-12 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                <div className="relative">
                  <UserPlus className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input 
                    required
                    type="text"
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue/20 transition-all"
                    placeholder="E.g. Arnav Singh"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input 
                    required
                    type="email"
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue/20 transition-all"
                    placeholder="arnav@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input 
                    required
                    type="tel"
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue/20 transition-all"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Base Location</label>
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input 
                    required
                    type="text"
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue/20 transition-all"
                    placeholder="Mumbai, Maharashtra"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Primary Interests</label>
              <div className="relative">
                <Heart className="absolute left-6 top-6 w-4 h-4 text-gray-300" />
                <textarea 
                  required
                  rows={4}
                  className="w-full pl-14 pr-6 py-6 bg-gray-50 dark:bg-white/5 border-none rounded-3xl outline-none focus:ring-2 focus:ring-blue/20 transition-all resize-none"
                  placeholder="Tell us what causes you're passionate about (Education, Healthcare, Disaster Relief...)"
                  value={formData.interests}
                  onChange={(e) => setFormData({...formData, interests: e.target.value})}
                ></textarea>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-6 bg-ruby text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-ruby/20 hover:scale-105 active:scale-95 transition-all mt-8"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
