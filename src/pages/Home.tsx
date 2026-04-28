import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, HandHeart, Users, Building2, Languages } from "lucide-react";
import { PerfectEarth } from "../components/ui/PerfectEarth";
import { IndiaNetworkMap } from "../components/ui/IndiaNetworkMap";
import TranslationWidget from "../components/TranslationWidget";

export default function Home() {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-950 overflow-x-hidden transition-colors duration-500">
      {/* Floating Global Translation Link for Awareness */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-10 right-10 z-[60] flex flex-col items-end gap-2 pointer-events-none"
      >
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 rounded-3xl border border-blue/10 dark:border-white/10 shadow-3xl pointer-events-auto flex items-center gap-4">
          <div className="flex flex-col items-end mr-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-ruby">Regional Access</span>
          </div>
          <TranslationWidget />
        </div>
      </motion.div>
      {/* Hero Section */}
      <section className="relative h-[200vh] bg-white dark:bg-gray-950">
        {/* Sticky 3D Earth Background Container */}
        <div className="sticky top-0 left-0 w-full h-screen z-0 overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-500">
           <div className="absolute inset-0 flex items-center justify-center">
             {/* Clean White/Dark Background without stage glows */}
             <div className="absolute inset-0 bg-white dark:bg-gray-950 z-0"></div>
             
             {/* Center Frame for Earth */}
             <div className="relative w-full h-full max-w-5xl mx-auto z-5 flex items-center justify-center">
                <PerfectEarth />
             </div>

             {/* Static Hero Statement Overlay */}
             <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                  className="text-center"
                >
                  <h1 className="text-6xl md:text-9xl font-sans font-black text-white mb-8 tracking-[-0.05em] uppercase drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                    United <br />
                    For Impact<span className="text-ruby">.</span>
                  </h1>
                  <p className="text-base md:text-xl text-[#0044bb] dark:text-[#4a89ff] max-sm:px-4 max-w-sm mx-auto font-bold tracking-tight leading-snug bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/80 dark:border-white/10 shadow-xl">
                    <span className="notranslate">Samanvay</span> unites NGOs, Corporates, and Citizens into a seamless 
                    ecosystem of sustainable impact.
                  </p>
                </motion.div>
             </div>
           </div>
        </div>

        {/* Interactive Layer (Buttons) */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center h-screen flex flex-col items-center justify-end pb-56 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-8 pointer-events-auto"
          >
            <Link to="/ngos" className="bg-blue text-white px-12 py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue/20 hover:scale-105 transition-all flex items-center group">
              Explore NGOs <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform w-4 h-4" />
            </Link>
            <Link to="/vouchers" className="bg-white text-blue border-2 border-blue px-12 py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] hover:bg-blue hover:text-white transition-all shadow-xl">
              Voucher Market
            </Link>
            <Link to="/join-samanvay?type=ngo" className="bg-ruby text-white px-12 py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-ruby/20 hover:scale-105 transition-all flex items-center group">
              Join as NGO <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Scroll Insight */}
        <div className="relative z-10 h-[100vh] flex items-end justify-center pb-24 pointer-events-none">
           <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             className="text-[10px] font-black uppercase tracking-[0.4em] text-blue/40 flex flex-col items-center gap-4"
           >
              <span>Scroll to Explore the Ecosystem</span>
              <div className="w-px h-12 bg-gradient-to-b from-blue/40 to-transparent"></div>
           </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white dark:bg-gray-950 border-y border-gray-100 dark:border-white/5 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black uppercase tracking-[0.6em] text-ruby mb-6 opacity-80">Our Pillars of Service</h2>
            <div className="text-5xl md:text-7xl font-serif font-black text-[#0033cc] dark:text-[#4a89ff] tracking-tight leading-[0.9]">Shaping a <span className="italic serif text-ruby">Better</span> Tomorrow</div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Globe className="w-8 h-8 text-green" />}
              title="Wide Visibility"
              description="A centralized platform for NGOs across India to showcase their work and reach a global audience."
            />
            <FeatureCard 
              icon={<HandHeart className="w-8 h-8 text-saffron" />}
              title="Voucher Funding"
              description="Innovative corporate funding model where vouchers bridge the gap between resources and needs."
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-blue" />}
              title="Talent Recruiting"
              description="Direct recruitment portal for NGOs to find passionate individuals for their mission-driven roles."
            />
            <FeatureCard 
              icon={<Building2 className="w-8 h-8 text-ruby" />}
              title="CSR Portal"
              description="B2B Resource sharing and joint ventures hub to eliminate silos and maximize collective impact."
              link="/collaboration"
            />
            <motion.div 
               whileHover={{ y: -10 }}
               className="p-10 bg-[#0033cc] dark:bg-[#4a89ff] border border-blue/5 dark:border-white/5 rounded-[2.5rem] flex flex-col gap-6 text-center items-center shadow-2xl relative overflow-hidden group/lang notranslate"
            >
               <div className="absolute inset-0 bg-ruby/20 translate-y-full group-hover/lang:translate-y-0 transition-transform duration-500"></div>
               <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center shadow-lg border border-white/20 relative z-10">
                 <Languages className="w-8 h-8 text-white" />
               </div>
               <h3 className="text-2xl font-serif font-bold text-white relative z-10">Regional Reach</h3>
               <p className="text-white/80 leading-relaxed font-light text-sm relative z-10 mb-2">
                 Empowering every citizen across the heartland.
               </p>
               <div className="relative z-10">
                 <TranslationWidget />
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nationwide Impact Section */}
      <section className="py-32 bg-sun dark:bg-gray-900 relative overflow-hidden transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 lg:items-center gap-20">
          <div className="relative h-[500px] w-full">
             <IndiaNetworkMap className="w-full h-full" />
             <div className="absolute inset-0 bg-gradient-to-t from-sun/20 dark:from-gray-900/40 via-transparent to-transparent pointer-events-none rounded-[4rem]"></div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            <h4 className="text-sm font-black uppercase tracking-[0.4em] text-ruby">A Nation Connected</h4>
            <h2 className="text-5xl md:text-7xl font-serif font-black text-blue dark:text-[#4a89ff] leading-none">Mapping the <span className="text-ruby italic">Network</span> of Hope.</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-light leading-relaxed">
              <span className="notranslate">Samanvay</span> spans the vast geography of India, bridging the gap between 
              local grassroots NGOs and nationwide corporate support. From the peaks of 
              the North to the coasts of the South, we are unified in service.
            </p>
            <div className="space-y-6">
              {[
                { title: "Pan-India Reach", desc: "Empowering NGOs from every state and union territory." },
                { title: "Localized Impact", desc: "Deep-rooted community service supported by national resources." },
                { title: "Unified Network", desc: "One map, one mission, millions of lives touched." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="w-10 h-10 rounded-2xl bg-saffron/10 dark:bg-saffron/5 flex items-center justify-center text-ruby shrink-0 group-hover:scale-110 transition-transform">
                    <div className="w-2 h-2 bg-ruby rounded-full"></div>
                  </div>
                  <div>
                    <h5 className="font-serif font-bold text-blue dark:text-[#4a89ff] group-hover:text-ruby transition-colors">{item.title}</h5>
                    <p className="text-sm text-gray-400 dark:text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-white dark:bg-gray-950 transition-colors duration-500 overflow-hidden">
        <div className="max-w-7xl mx-auto relative px-8 py-20 rounded-[3rem] bg-gradient-to-r from-blue to-[#001144] shadow-2xl overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-ruby/20 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green/20 rounded-full blur-[100px] -ml-48 -mb-48 group-hover:scale-110 transition-transform duration-700"></div>
          
          <div className="relative z-10 text-center flex flex-col items-center max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-serif font-black text-white mb-6 leading-tight">Ready to synchronize for <span className="text-ruby italic">impact</span>?</h2>
            <p className="text-white/70 text-lg md:text-xl font-medium mb-12">
              Join the <span className="notranslate">Samanvay</span> Ecosystem and turn your intent into measurable action. Whether you are an individual, an NGO, or a donor.
            </p>
            <Link 
              to="/join-samanvay"
              className="group relative px-12 py-5 bg-white text-blue rounded-full font-black text-xs uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/20"
            >
              <div className="absolute inset-0 bg-ruby translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
              <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center gap-2">
                Join <span className="notranslate">Samanvay</span> Now <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, link }: { icon: React.ReactNode, title: string, description: string, link?: string }) {
  const content = (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-10 bg-white dark:bg-gray-900 border border-blue/5 dark:border-white/5 rounded-[2.5rem] flex flex-col gap-6 text-center items-center vibrant-card h-full shadow-blue/5 transition-colors duration-300"
    >
      <div className="w-20 h-20 bg-sun dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border border-blue/10 dark:border-white/5">
        {icon}
      </div>
      <h3 className="text-2xl font-serif font-bold text-blue dark:text-[#4a89ff]">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light">
        {description}
      </p>
    </motion.div>
  );

  if (link) {
    return <Link to={link}>{content}</Link>;
  }

  return content;
}
