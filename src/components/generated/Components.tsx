import React from 'react';
import { Section } from '@/types/schema';
import { Menu, CheckCircle, ArrowRight, Twitter, Instagram, Linkedin, Send, ShoppingBag } from 'lucide-react';

// --- SMART CONTRAST HELPER ---
const getStyles = (data: Section) => {
  const bg = data.styles?.backgroundColor || 'bg-white';

  // 1. Detect if the background is "Dark" based on the class name
  // Checks for: "black", "slate-900", "slate-950", "zinc-900", "indigo-900", etc.
  const isDark = bg.includes('black') ||
                 bg.includes('900') ||
                 bg.includes('950') ||
                 bg.includes('800') ||
                 bg.includes('dark');

  return {
    bg: bg,
    // 2. FORCE readable text color based on background
    text: isDark ? 'text-white' : 'text-slate-900',
    // 3. Subtle borders that match the theme
    border: isDark ? 'border-white/10' : 'border-black/10',
    // 4. Secondary text (subtitles) opacity
    muted: isDark ? 'text-gray-300' : 'text-gray-600'
  };
};

export const Navbar = ({ data }: { data: Section }) => {
  const s = getStyles(data);
  return (
    <nav className={`${s.bg} ${s.text} py-5 px-8 border-b ${s.border} sticky top-0 z-50 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${s.bg === 'bg-white' ? 'bg-blue-600 text-white' : 'bg-white text-black'}`}>
            <ShoppingBag size={20} />
          </div>
          <h1 className="font-bold text-xl tracking-tight">{data.content.title || "ShopMax"}</h1>
        </div>

        <div className="hidden md:flex gap-8 font-medium text-sm">
          {data.content.items?.map((item: any, idx: number) => (
            <a key={idx} href="#" className="hover:opacity-70 transition-opacity">
              {item.title}
            </a>
          )) || (
            <>
              <a href="#">Products</a>
              <a href="#">Deals</a>
              <a href="#">Cart</a>
            </>
          )}
        </div>
        <Menu className="md:hidden opacity-80" />
      </div>
    </nav>
  );
};

export const Hero = ({ data }: { data: Section }) => {
  const s = getStyles(data);
  return (
    <section className={`${s.bg} ${s.text} py-32 px-6 flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors duration-300`}>
      {/* Dynamic Glow Effect */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] blur-[120px] rounded-full pointer-events-none opacity-30 ${s.bg.includes('white') ? 'bg-blue-400' : 'bg-blue-600'}`} />

      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
          {data.content.title}
        </h1>
        <p className={`text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed ${s.muted}`}>
          {data.content.subtitle}
        </p>
        {data.content.primaryAction && (
          <button className="bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center gap-2 mx-auto">
            {data.content.primaryAction} <ArrowRight size={20} />
          </button>
        )}
      </div>
    </section>
  );
};

export const Features = ({ data }: { data: Section }) => {
  const s = getStyles(data);
  return (
    <section className={`${s.bg} ${s.text} py-24 px-6 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-6">{data.content.title}</h2>
          <p className={`text-xl max-w-2xl mx-auto ${s.muted}`}>{data.content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.content.items?.map((item: any, idx: number) => (
            <div key={idx} className={`p-8 rounded-2xl border ${s.border} ${s.bg.includes('white') ? 'bg-gray-50' : 'bg-white/5'} hover:border-blue-500/30 transition-all duration-300 group`}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className={`${s.muted} leading-relaxed text-lg`}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Contact = ({ data }: { data: Section }) => {
  const s = getStyles(data);
  return (
    <section className={`${s.bg} ${s.text} py-24 px-6 transition-colors duration-300`}>
      <div className={`max-w-2xl mx-auto p-10 rounded-3xl border ${s.border} shadow-2xl ${s.bg.includes('white') ? 'bg-white' : 'bg-white/5 backdrop-blur-md'}`}>
        <h2 className="text-3xl font-bold mb-3 text-center">{data.content.title || "Get in Touch"}</h2>
        <p className={`text-center mb-10 ${s.muted}`}>{data.content.subtitle}</p>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Name"
              className={`w-full p-4 rounded-xl bg-transparent border ${s.border} focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:opacity-50`}
            />
            <input
              type="email"
              placeholder="Email"
              className={`w-full p-4 rounded-xl bg-transparent border ${s.border} focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:opacity-50`}
            />
          </div>
          <textarea
            placeholder="How can we help?"
            rows={4}
            className={`w-full p-4 rounded-xl bg-transparent border ${s.border} focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:opacity-50`}
          />
          <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
            <Send size={18} /> Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export const Footer = ({ data }: { data: Section }) => {
  const s = getStyles(data);
  return (
    <footer className={`${s.bg} ${s.text} py-16 px-6 border-t ${s.border} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 justify-center md:justify-start">
             <ShoppingBag size={24} className="text-blue-500" />
             {data.content.title}
          </h3>
          <p className={`text-sm ${s.muted}`}>© {new Date().getFullYear()} {data.content.title}. All rights reserved.</p>
        </div>
        <div className={`flex gap-8 ${s.muted}`}>
          <Twitter className="hover:text-blue-400 hover:scale-110 transition-all cursor-pointer" />
          <Instagram className="hover:text-pink-500 hover:scale-110 transition-all cursor-pointer" />
          <Linkedin className="hover:text-blue-700 hover:scale-110 transition-all cursor-pointer" />
        </div>
      </div>
    </footer>
  );
};