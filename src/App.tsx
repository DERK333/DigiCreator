/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Generator } from "./components/Generator";
import { Inventory } from "./components/Inventory";
import { Product } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"generator" | "inventory">("generator");
  const [products, setProducts] = useState<Product[]>([]);

  const handleProductGenerated = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
    setActiveTab("inventory");
  };

  const handleToggleList = (id: string, listed: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, listed } : p))
    );
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-semibold text-slate-800">
            {activeTab === "generator" ? "AI Generation Lab" : "Merchant Command Center"}
          </h1>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-medium shrink-0">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> AI Engine Active
            </div>
            <div className="hidden sm:block h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-slate-900">Creative Pro</p>
                <p className="text-[10px] text-slate-400">Premium Storefront</p>
              </div>
              <div className="w-9 h-9 bg-indigo-100 flex items-center justify-center rounded-full border border-slate-300">
                <span className="text-indigo-700 text-xs font-bold">CP</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 flex-1 flex flex-col gap-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === "generator" && (
            <Generator onProductGenerated={handleProductGenerated} />
          )}

          {activeTab === "inventory" && (
            <Inventory 
              products={products} 
              onToggleList={handleToggleList} 
              onDeleteProduct={handleDeleteProduct} 
              onUpdateProduct={handleUpdateProduct}
            />
          )}

        </div>
      </main>
    </div>
  );
}

