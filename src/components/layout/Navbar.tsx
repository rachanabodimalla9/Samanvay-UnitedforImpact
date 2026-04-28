import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { Heart, Briefcase, Gift, Home, Info, BarChart3, Building2, Menu, X, Sun, Moon, Globe, Activity, Languages, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import TranslationWidget from "../TranslationWidget";

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { userType, logout } = useAuth();

  const navItems = [
    { name: "Sociopane", path: "/sociopane", icon: Globe },
    { name: "Community Hub", path: "/community", icon: Activity },
    { name: "Home", path: "/", icon: Home },
    { name: "Explore NGOs", path: "/ngos", icon: Heart },
    { name: "Voucher Hub", path: "/vouchers", icon: Gift },
    { name: "Careers", path: "/careers", icon: Briefcase },
    { name: "CSR Portal", path: "/collaboration", icon: Building2 },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          <Link to="/" className="flex items-center group pointer-events-auto notranslate">
            <div className="flex flex-col -space-y-1 group-hover:scale-105 transition-transform duration-500">
              <span className="text-2xl font-black tracking-[-0.08em] text-[#0033cc] dark:text-[#4a89ff] flex items-center leading-none">
                SAMA<span className="text-ruby italic font-serif px-0.5">n</span>VAY
              </span>
              <span className="text-[7px] font-black uppercase tracking-[1.2em] text-[#0033cc]/40 dark:text-[#4a89ff]/40 pl-0.5">
                Ecosystem
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 pointer-events-auto">
            {/* User Type Badge */}
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-blue/10 dark:border-white/10">
              <div className={cn("w-2 h-2 rounded-full animate-pulse", 
                userType === 'resident' ? 'bg-blue' : 
                userType === 'corporate' ? 'bg-ruby' : 'bg-green'
              )}></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#0033cc] dark:text-[#4a89ff]">
                {userType} portal
              </span>
            </div>

            {/* Translation Widget */}
            <div className="hidden lg:block">
              <TranslationWidget />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-blue/10 dark:border-white/10 text-[#0033cc] dark:text-[#4a89ff] shadow-sm hover:scale-105 transition-all duration-300"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-4 h-4" />
                  <span className="font-black text-[10px] uppercase tracking-widest hidden md:block">Night Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" />
                  <span className="font-black text-[10px] uppercase tracking-widest hidden md:block">Day Mode</span>
                </>
              )}
            </button>

            {/* Logout Button */}
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ruby/10 text-ruby hover:bg-ruby hover:text-white transition-all duration-300 group/logout"
            >
              <LogOut className="w-4 h-4 group-hover/logout:-translate-x-1 transition-transform" />
              <span className="font-black text-[10px] uppercase tracking-widest hidden md:block">Exit</span>
            </button>

            {/* Desktop Menu Toggle */}
            <div className="relative">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-6 py-2.5 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-[#0033cc] dark:text-[#4a89ff] border border-[#0033cc]/10 dark:border-white/10 shadow-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 group"
              >
                <div className="relative w-4 h-4 overflow-hidden">
                  <AnimatePresence mode="wait">
                    {isOpen ? (
                      <motion.div
                        key="close"
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        exit={{ y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        exit={{ y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <span className="font-black text-xs uppercase tracking-[0.2em]">{isOpen ? 'Close' : 'Menu'}</span>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-sm -z-10"
                      onClick={() => setIsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-4 w-72 bg-white dark:bg-gray-900 border border-blue/10 dark:border-white/10 rounded-2xl shadow-2xl p-3 overflow-hidden z-50"
                    >
                      <div className="space-y-1">
                        {navItems.map((item) => {
                          const isActive = location.pathname === item.path;
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                "relative px-4 py-3 rounded-xl text-[13px] font-black transition-all duration-300 uppercase tracking-[0.1em] flex items-center gap-3 group/nav",
                                isActive 
                                  ? "text-white bg-[#0033cc] dark:bg-[#4a89ff] shadow-lg shadow-blue/20" 
                                  : "text-[#002266]/70 dark:text-white/70 hover:text-[#0033cc] dark:hover:text-[#4a89ff] hover:bg-gray-50 dark:hover:bg-white/5"
                              )}
                            >
                              <Icon className={cn(
                                "w-4 h-4 transition-transform duration-300",
                                isActive ? "scale-110" : "group-hover/nav:scale-110"
                              )} />
                              <span className="relative z-10">{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <Link to="/join-samanvay" className="relative group hidden sm:block overflow-hidden bg-white dark:bg-gray-900 border-2 border-[#0033cc] dark:border-[#4a89ff] px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue/10 active:scale-95 pointer-events-auto">
              <div className="absolute inset-0 bg-[#0033cc] dark:bg-[#4a89ff] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              <span className="relative z-10 font-black text-xs uppercase tracking-[0.2em] text-[#0033cc] dark:text-[#4a89ff] group-hover:text-white transition-colors duration-300">
                Join Samanvay
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
