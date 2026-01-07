'use client';

import { useState, useEffect } from 'react';
import { Navbar, Hero, Features, Contact, Footer } from '@/components/generated/Components';
import { WebsiteSchema } from '@/types/schema';
import { Loader2, Save, Send, Monitor, Smartphone, Download, History, RotateCcw } from 'lucide-react';


const WebsiteRenderer = ({ data }: { data: WebsiteSchema | null }) => {
  // SAFETY CHECK: If data is missing or sections isn't an array, show placeholder
  if (!data || !Array.isArray(data.sections)) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50/50">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p>Waiting for your vision...</p>
      </div>
    );
  }

  const ComponentMap: any = { Navbar, Hero, Features, Testimonials: Features, Contact, Footer };

  return (
    <div className={`h-full w-full overflow-y-auto ${data.theme === 'dark' ? 'bg-slate-950' : 'bg-white'} scroll-smooth`}>
      {data.sections.map((section, index) => {
        const Component = ComponentMap[section.type];

        // Fallback for unknown components to prevent white-screen crashes
        if (!Component) {
           return (
             <div key={section.id || index} className="p-4 m-4 border border-red-300 bg-red-50 text-red-600 rounded">
               ⚠️ Unknown Component: {section.type}
             </div>
           );
        }

        return <Component key={section.id || index} data={section} />;
      })}
    </div>
  );
};

// --- Main Page Logic ---
export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [websiteData, setWebsiteData] = useState<WebsiteSchema | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history when app starts
  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (Array.isArray(data)) setHistory(data);
    } catch (e) {
      console.error("Failed to fetch history", e);
    }
  };

  const generateSite = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) throw new Error('Generation failed');

      const data = await res.json();
      setWebsiteData(data);
    } catch (err) {
      console.error(err);
      alert("Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async () => {
    if (!websiteData) return;
    try {
      await fetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ prompt, schema: websiteData })
      });
      fetchHistory(); // Refresh the list immediately
      alert("Project saved to database!");
    } catch (e) {
      alert("Failed to save.");
    }
  };

  const loadProject = (project: any) => {
    try {
      // POSTGRES FIX: PostgreSQL returns 'schema' as a real Object.
      // SQLite returns it as a String. This line handles BOTH cases automatically.
      let loadedSchema = project.schema;

      if (typeof loadedSchema === 'string') {
        loadedSchema = JSON.parse(loadedSchema);
      }

      setWebsiteData(loadedSchema);
      setPrompt(project.prompt);
      setShowHistory(false);
    } catch (e) {
      console.error("Failed to parse project schema", e);
      alert("Error loading this project.");
    }
  };

  const exportHTML = () => {
    if (!websiteData) return;

    // Generates a standalone HTML file with Tailwind via CDN
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Generated Site</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        <style>body { font-family: 'Inter', sans-serif; }</style>
      </head>
      <body>
        <div id="root">
           <div style="font-family: sans-serif; text-align: center; padding: 50px;">
              <h1>Website Export Successful</h1>
              <p>Your design data is ready to be rendered.</p>
              <textarea style="width: 80%; height: 300px; padding: 10px;">${JSON.stringify(websiteData, null, 2)}</textarea>
           </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "website_export.html";
    link.click();
  };

  return (
    <main className="flex h-screen bg-neutral-900 text-white font-sans overflow-hidden">
      {/* Sidebar Controls */}
      <aside className="w-[400px] flex flex-col p-6 border-r border-neutral-800 bg-neutral-900 z-10 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"/>
            <h1 className="text-xl font-bold tracking-tight">AI Architect</h1>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-lg transition-colors ${showHistory ? 'bg-blue-600 text-white' : 'hover:bg-neutral-800 text-neutral-400'}`}
            title="History"
          >
            <History size={20} />
          </button>
        </div>

        {showHistory ? (
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Saved Projects</h3>
            {history.length === 0 && <p className="text-neutral-500 text-sm">No saved projects yet.</p>}
            {history.map((p) => (
              <div key={p.id} onClick={() => loadProject(p)} className="p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-xl cursor-pointer hover:bg-neutral-800 hover:border-blue-500/50 transition-all group">
                <div className="font-medium truncate text-sm text-neutral-200 group-hover:text-white">{p.prompt}</div>
                <div className="text-xs text-neutral-500 mt-2 flex justify-between">
                  <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                  <RotateCcw size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
            <button onClick={() => setShowHistory(false)} className="w-full mt-4 py-3 text-sm text-neutral-400 hover:text-white border border-dashed border-neutral-700 rounded-lg hover:border-neutral-500 transition-all">
              + New Project
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex-1 bg-neutral-800/50 rounded-xl border border-neutral-700/50 p-1">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your dream website... (e.g., 'A minimalist portfolio for a photographer with a dark theme')"
                className="w-full h-full p-4 bg-transparent border-none text-white focus:ring-0 resize-none placeholder:text-neutral-600"
              />
            </div>

            <button
              onClick={generateSite}
              disabled={loading || !prompt}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
              {loading ? "Architecting..." : "Generate Website"}
            </button>
          </div>
        )}

        {websiteData && !showHistory && (
          <div className="pt-6 border-t border-neutral-800 grid grid-cols-2 gap-3 animate-in slide-in-from-bottom-4 duration-500">
            <button onClick={saveProject} className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 py-3 rounded-xl border border-neutral-700 font-medium transition-all">
              <Save size={18} /> Save
            </button>
            <button onClick={exportHTML} className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 py-3 rounded-xl border border-neutral-700 font-medium transition-all">
              <Download size={18} /> Export
            </button>
          </div>
        )}
      </aside>

      {/* Main Preview Area */}
      <div className="flex-1 bg-neutral-950 p-8 flex flex-col items-center justify-center relative">
        {/* Device Toggles */}
        <div className="absolute top-6 flex bg-neutral-900 p-1 rounded-lg border border-neutral-800 shadow-xl z-20">
          <button onClick={() => setViewMode('desktop')} className={`p-2 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-500 hover:text-neutral-300'}`} title="Desktop View">
            <Monitor size={20} />
          </button>
          <button onClick={() => setViewMode('mobile')} className={`p-2 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-neutral-800 text-white shadow' : 'text-neutral-500 hover:text-neutral-300'}`} title="Mobile View">
            <Smartphone size={20} />
          </button>
        </div>

        {/* The Viewport */}
        <div className={`transition-all duration-500 ease-in-out border border-neutral-800 shadow-2xl overflow-hidden bg-white
          ${viewMode === 'desktop' ? 'w-full h-full rounded-xl' : 'w-[375px] h-[700px] rounded-[3rem] border-8 border-neutral-800'}
        `}>
           <WebsiteRenderer data={websiteData} />
        </div>
      </div>
    </main>
  );
}