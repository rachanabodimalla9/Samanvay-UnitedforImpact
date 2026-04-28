/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import NGOs from "./pages/NGOs";
import Community from "./pages/Community";
import Vouchers from "./pages/Vouchers";
import Careers from "./pages/Careers";
import Sociopane from "./pages/Sociopane";
import Collaboration from "./pages/Collaboration";
import JoinSamanvay from "./pages/JoinSamanvay";
import AddVolunteer from "./pages/AddVolunteer";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import React, { useState } from "react";
import LoginSelection from "./pages/LoginSelection";
import LoginPortal from "./pages/LoginPortal";

function AppContent() {
  const { isAuthenticated, login } = useAuth();
  const [selectedPortal, setSelectedPortal] = useState<'resident' | 'corporate' | 'ngo' | null>(null);

  if (!isAuthenticated) {
    if (!selectedPortal) {
      return <LoginSelection onSelect={setSelectedPortal} />;
    }
    return (
      <LoginPortal 
        type={selectedPortal} 
        onBack={() => setSelectedPortal(null)} 
        onLogin={() => login(selectedPortal)} 
      />
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ngos" element={<NGOs />} />
            <Route path="/community" element={<Community />} />
            <Route path="/vouchers" element={<Vouchers />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/sociopane" element={<Sociopane />} />
            <Route path="/collaboration" element={<Collaboration />} />
            <Route path="/join-samanvay" element={<JoinSamanvay />} />
            <Route path="/add-volunteer" element={<AddVolunteer />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer className="px-10 py-12 bg-[#0033cc] dark:bg-blue-950 text-white overflow-hidden relative border-t border-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-ruby/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            <div className="flex items-center">
              <span className="text-3xl font-serif font-black tracking-tighter text-white flex items-baseline notranslate">
                SAMA<span className="text-saffron italic">N</span>VAY
                <span className="w-1.5 h-1.5 bg-green rounded-full ml-1"></span>
              </span>
            </div>
            
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
              <span className="hover:text-saffron cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-saffron cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-saffron cursor-pointer transition-colors">Digital Ethics</span>
            </div>

            <div className="text-[10px] font-black opacity-40 uppercase tracking-widest text-center md:text-right">
              © 2024 <span className="notranslate">Samanvay</span> India • Blockchain Secured • Karma Driven
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
      <style>{`
        /* Global Google Translate cleanup */
        .goog-te-banner-frame, .goog-te-menu-frame, .goog-te-balloon-frame, #goog-gt-tt, .goog-te-balloon, .goog-te-banner {
          display: none !important;
          visibility: hidden !important;
        }
        body { top: 0 !important; }
        .goog-logo-link { display: none !important; }
        .goog-te-gadget { font-size: 0 !important; }
        iframe.skiptranslate { display: none !important; }
      `}</style>
    </ThemeProvider>
  );
}
