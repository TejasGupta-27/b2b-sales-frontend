'use client';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed bottom-20 right-4 z-50 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 group shadow-lg"
      title="切替: English / 日本語"
    >
      {language === 'en' ? '🇬🇧 EN' : '🇯🇵 JP'}
    </button>
  );
}
