import React, { useState } from 'react';

export default function TranslationWidget() {
  const [isTranslating, setIsTranslating] = useState(false);

  const [isResetting, setIsResetting] = useState(false);

  const triggerHindi = () => {
    setIsTranslating(true);
    const attemptTranslation = (count = 0) => {
      const translateElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (translateElement) {
        translateElement.value = 'hi';
        translateElement.dispatchEvent(new Event('change'));
        setTimeout(() => setIsTranslating(false), 1000);
      } else if (count < 20) {
        setTimeout(() => attemptTranslation(count + 1), 200);
      } else {
        setIsTranslating(false);
      }
    };
    attemptTranslation();
  };

  const resetToEnglish = () => {
    setIsResetting(true);
    const attemptReset = (count = 0) => {
      const translateElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (translateElement) {
        // Try 'en' first, then empty string (original)
        translateElement.value = 'en';
        if (translateElement.value !== 'en') {
          translateElement.value = '';
        }
        translateElement.dispatchEvent(new Event('change'));
        setTimeout(() => setIsResetting(false), 1000);
      } else if (count < 25) {
        setTimeout(() => attemptReset(count + 1), 200);
      } else {
        setIsResetting(false);
      }
    };
    attemptReset();
  };

  return (
    <div className="relative flex flex-col items-center gap-2">
      <div className="flex gap-2">
        <button 
          onClick={triggerHindi}
          disabled={isTranslating || isResetting}
          className="px-4 py-2 bg-blue text-white dark:bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95 disabled:opacity-50"
        >
          {isTranslating ? 'Switching...' : 'हिंदी (Hindi)'}
        </button>
        <button 
          onClick={resetToEnglish}
          disabled={isTranslating || isResetting}
          className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-white/60 rounded-xl text-[8px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50"
        >
          {isResetting ? '...' : 'EN'}
        </button>
      </div>
    </div>
  );
}
