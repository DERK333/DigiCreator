import { ExternalLink, Edit, Trash2, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { Product } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface InventoryProps {
  products: Product[];
  onToggleList: (id: string, listed: boolean) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateProduct: (product: Product) => void;
}

export function Inventory({ products, onToggleList, onDeleteProduct, onUpdateProduct }: InventoryProps) {
  const [optimizingId, setOptimizingId] = useState<string | null>(null);

  const handleOptimize = async (product: Product) => {
    setOptimizingId(product.id);
    try {
      const response = await fetch("/api/optimize-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      if (!response.ok) throw new Error("Failed to optimize");
      const optimizedFields = await response.json();
      onUpdateProduct({ ...product, ...optimizedFields });
    } catch (err) {
      console.error(err);
      alert("Failed to optimize the listing.");
    } finally {
      setOptimizingId(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 tracking-tight">Your inventory is empty</h3>
        <p className="text-slate-500 mt-2 max-w-sm">Use the AI Generator to create your first digital product and start selling.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-3 px-1">
        <h2 className="font-bold text-slate-800">Recent Shop Listings</h2>
        <button className="text-xs font-medium text-slate-500 hover:text-indigo-600">View All →</button>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {products.map((product) => (
                  <motion.tr
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 flex items-center justify-center rounded-lg shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-900">{product.title}</span>
                          <span className="text-xs text-slate-400 line-clamp-1 max-w-[200px] sm:max-w-[300px]">{product.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 capitalize">
                      {product.tags[0] || "Digital"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-800">${product.price.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => onToggleList(product.id, !product.listed)}
                        className={`inline-block px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider transition-colors ${
                          product.listed ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {product.listed ? 'Active' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleOptimize(product)} 
                          disabled={optimizingId === product.id}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition disabled:opacity-50" 
                          title="Auto-Optimize SEO"
                        >
                          {optimizingId === product.id ? <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> : <Sparkles className="w-4 h-4" />}
                        </button>
                        <button onClick={() => {}} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDeleteProduct(product.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
