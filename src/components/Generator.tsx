import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { Product } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface GeneratorProps {
  onProductGenerated: (product: Product) => void;
}

export function Generator({ onProductGenerated }: GeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate product");
      }

      const product = await response.json();
      onProductGenerated(product);
      setPrompt("");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const templates = [
    "A comprehensive notion template for ADHD students",
    "A 30-day Instagram content calendar for real estate agents",
    "A minimalist budgeting spreadsheet for freelancers",
    "100+ Midjourney prompts for architectural rendering",
  ];

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          AI Generation Lab
        </h2>
        <span className="text-xs font-medium text-indigo-600">New Product Blueprint</span>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <div className="absolute top-3.5 left-4 text-slate-400">
            <Wand2 className="w-5 h-5"/>
          </div>
          <input
            type="text"
            className="w-full pl-11 pr-36 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow text-sm"
            placeholder="E.g. 100 Minimalist UI Icons for Fintech Apps, Pastel Palette..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />
          <div className="absolute right-2 top-2 bottom-2 flex gap-1">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="px-4 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:bg-slate-300 transition-colors flex items-center gap-2"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isGenerating ? "Generating..." : "Generate Product"}
            </button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
         {error && (
           <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}} className="text-red-500 text-sm font-medium mb-4">
             {error}
           </motion.div>
         )}
      </AnimatePresence>

      <div className="flex gap-2 text-sm max-w-full flex-wrap">
        {templates.slice(0, 3).map((t, idx) => (
          <button
            key={idx}
            onClick={() => setPrompt(t)}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition text-xs whitespace-nowrap"
            disabled={isGenerating}
          >
            {t}
          </button>
        ))}
      </div>
    </section>
  );
}
