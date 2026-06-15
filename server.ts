import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/generate-product", async (req, res) => {
    try {
      const { prompt } = req.body;
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate a digital product idea and listing details based on this prompt: "${prompt}". It should be a realistic digital product for creative entrepreneurs (e.g. template, guide, toolkit). Give a catchy title, a compelling description, a suggested price in USD, and 3-5 tags.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Product title" },
              description: { type: Type.STRING, description: "Compelling product description" },
              price: { type: Type.NUMBER, description: "Suggested price in USD" },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["title", "description", "price", "tags"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("No response text");
      }

      const product = JSON.parse(text);
      
      // Send back the product with a generated id and date
      res.json({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        listed: false,
        ...product
      });

    } catch (error) {
      console.error("Error generating product:", error);
      res.status(500).json({ error: "Failed to generate product" });
    }
  });

  app.post("/api/optimize-product", async (req, res) => {
    try {
      const { product } = req.body;
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are an expert SEO copywriter and digital product marketer. Optimize the following digital product listing to be highly compelling, SEO-friendly, and discoverable in online marketplaces.

Current Title: ${product.title}
Current Description: ${product.description}
Current Tags: ${product.tags.join(', ')}

Provide an optimized SEO title, a highly detailed and persuasive description, and a set of 5-7 highly relevant SEO tags.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "SEO-optimized, compelling product title" },
              description: { type: Type.STRING, description: "Detailed, persuasive SEO description with formatting using plain text" },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "5-7 highly relevant SEO tags for discoverability"
              }
            },
            required: ["title", "description", "tags"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("No response text");
      }

      res.json(JSON.parse(text));
    } catch (error) {
      console.error("Error optimizing product:", error);
      res.status(500).json({ error: "Failed to optimize product" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
