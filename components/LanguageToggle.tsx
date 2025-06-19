'use client';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-md hover:bg-gray-700 transitionfixed bottom-4 right-4 z-50 bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition"
      title="切替: English / 日本語"
    >
      {language === 'en' ? '🌐 EN' : '🌐 JP'}
    </button>
  );
}

// 'use client';
// import { useLanguage } from '@/context/LanguageContext';
// import { useEffect, useState } from 'react';

// export default function LanguageToggle() {
//   const { language, toggleLanguage } = useLanguage();
//   const [isDark, setIsDark] = useState(false);

//   // Set initial theme from system or localStorage
//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

//     document.documentElement.classList.toggle('dark', shouldUseDark);
//     setIsDark(shouldUseDark);
//   }, []);

//   // Toggle dark/light mode
//   const toggleTheme = () => {
//     const newTheme = isDark ? 'light' : 'dark';
//     document.documentElement.classList.toggle('dark', newTheme === 'dark');
//     localStorage.setItem('theme', newTheme);
//     setIsDark(!isDark);
//   };

//   return (
//     <>
//       {/* 🌐 Language Toggle Button */}
//       <button
//         onClick={toggleLanguage}
//         className="fixed bottom-20 right-4 z-50 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 group shadow-lg"
//         title="切替: English / 日本語"
//       >
//         {language === 'en' ? '🇬🇧 EN' : '🇯🇵 JP'}
//       </button>

//       {/* 🌓 Dark Mode Toggle Button */}
//       <button
//         onClick={toggleTheme}
//         className="fixed bottom-32 right-4 z-50 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 group shadow-lg"
//         title="Toggle Dark Mode"
//       >
//         {isDark ? '🌙' : '☀️'}
//       </button>
//     </>
//   );
// }
