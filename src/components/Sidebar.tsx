import { LayoutGrid, PlusSquare, Store, Settings, User } from "lucide-react";

interface SidebarProps {
  activeTab: "generator" | "inventory";
  setActiveTab: (tab: "generator" | "inventory") => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col h-full sticky top-0 shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center">
          <Store className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-bold tracking-tight text-xl">DigiCreator</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <button
          onClick={() => setActiveTab("generator")}
          className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "generator"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <span className="mr-3 opacity-70">✦</span>
          AI Product Lab
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "inventory"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <span className="mr-3 opacity-70">🛒</span>
          Active Listings
        </button>
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1">AI Generation Tokens</p>
          <div className="flex justify-between items-end mb-2">
            <span className="text-white font-semibold text-lg">4,280</span>
            <span className="text-slate-500 text-xs">/ 5,000</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full w-[85%]"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
