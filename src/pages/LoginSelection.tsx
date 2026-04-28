import React from "react";
import { motion } from "motion/react";
import { Users, Building2, Heart, ArrowRight } from "lucide-react";
import TranslationWidget from "../components/TranslationWidget";

interface LoginSelectionProps {
  onSelect: (type: 'resident' | 'corporate' | 'ngo') => void;
}

export default function LoginSelection({ onSelect }: LoginSelectionProps) {
  const portals = [
    {
      id: 'resident',
      title: 'Resident Portal',
      hindiTitle: 'निवासी पोर्टल',
      description: 'For citizens contributing to the social fabric of India.',
      icon: Users,
      color: 'bg-blue',
      shadow: 'shadow-blue/20'
    },
    {
      id: 'corporate',
      title: 'Corporate Portal',
      hindiTitle: 'कॉर्पोरेट पोर्टल',
      description: 'Strategic CSR and ESG integration for enterprise impact.',
      icon: Building2,
      color: 'bg-ruby',
      shadow: 'shadow-ruby/20'
    },
    {
      id: 'ngo',
      title: 'NGO Portal',
      hindiTitle: 'एनजीओ पोर्टल',
      description: 'Scale your grassroots mission with digital synchronization.',
      icon: Heart,
      color: 'bg-green',
      shadow: 'shadow-green/20'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-ruby/5 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none"></div>

      <div className="w-full max-w-5xl relative z-10">
        <div className="flex justify-between items-start mb-12">
          <div>
            <span className="notranslate text-3xl font-serif font-black tracking-tighter text-blue dark:text-[#4a89ff] flex items-baseline">
              SAMA<span className="text-ruby italic">N</span>VAY
            </span>
            <p className="text-sm font-medium text-gray-500 mt-2">Welcome to the Synchronized Impact Ecosystem</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-ruby">Select Language</span>
            <TranslationWidget />
          </div>
        </div>

        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-black text-blue dark:text-white leading-tight"
          >
            Choose Your <span className="text-ruby italic">Gateway</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portals.map((portal, idx) => (
            <motion.button
              key={portal.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => onSelect(portal.id as any)}
              className="group relative h-96 p-8 bg-gray-50 dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/5 text-left flex flex-col gap-6 transition-all hover:bg-white dark:hover:bg-white/10 shadow-sm hover:shadow-2xl"
            >
              <div className={`w-16 h-16 ${portal.color} rounded-[1.5rem] flex items-center justify-center text-white shadow-xl ${portal.shadow}`}>
                <portal.icon className="w-8 h-8" />
              </div>
              
              <div>
                <h3 className="text-2xl font-serif font-black text-blue dark:text-white mb-2">{portal.title}</h3>
                <h4 className="text-lg font-hindi text-ruby dark:text-ruby opacity-80 mb-4">{portal.hindiTitle}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  {portal.description}
                </p>
              </div>

              <div className="mt-auto flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0033cc] dark:text-[#4a89ff] group-hover:translate-x-2 transition-transform">
                Enter Portal <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
