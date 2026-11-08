import express, { Request, Response } from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Support JSON payload parsing
  app.use(express.json({ limit: '10mb' }));

  // Initialize GoogleGenAI with API key
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({ apiKey });
      console.log('Gemini API initialized with model gemini-3.8-flash for legal translation.');
    } catch (e) {
      console.warn('Failed to initialize GoogleGenAI with provided key:', e);
    }
  } else {
    console.warn('GEMINI_API_KEY is not set in environment. Live translations will fallback to verified canonical legal translations.');
  }

  // Health and capability status endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      geminiAvailable: !!ai,
      model: 'gemini-3.8-flash',
      supportedLanguages: ['en', 'es', 'fr', 'de', 'la', 'zh'],
      timestamp: new Date().toISOString()
    });
  });

  // Real-time legal clause translation endpoint using Gemini API
  app.post('/api/translate', async (req: Request, res: Response) => {
    try {
      const { text, targetLanguage, targetLanguageName, clauseKey } = req.body;

      if (!text || !targetLanguage) {
        return res.status(400).json({ error: 'Missing required parameters: text and targetLanguage' });
      }

      if (targetLanguage === 'en') {
        return res.json({
          translatedText: text,
          model: 'identity',
          targetLanguage: 'en',
          cached: true
        });
      }

      if (!ai) {
        return res.status(200).json({
          fallback: true,
          message: 'Gemini API key not configured on server. Falling back to verified canonical translation.',
          targetLanguage,
          clauseKey: clauseKey || null
        });
      }

      const prompt = `You are an elite legal jurist, appellate scholar, and certified court interpreter specializing in United States federal court filings, Maryland state equity proceedings, commercial indentures, and statutory trust instruments.

Translate the following legal clause into ${targetLanguageName || targetLanguage} (${targetLanguage}).

CRITICAL INVARIANTS AND TRANSLATION RULES:
1. Strict Legal Precision: Employ the authoritative, formal juridical register appropriate for a master pleading submitted to the Supreme Court of the United States, the D.C. Circuit Court of Appeals, and the Circuit Court for Baltimore County, Maryland.
2. Inviolable Numbers & Financial Formulations: Retain exact dollar amounts ($500,000,000.00, $350,000,000.00, $150,000,000.00), exact share counts (45,850,000 common shares of Centrus Energy Corp. / NYSE: LEU), conversion ratio (0.0917), and zero Tucker Act pool ($0.00) verbatim.
3. Proper Nouns & Citations: Retain exact docket numbers (Case No. C-03-CV-26-004128, Case No. 24-2383, No. 24-10492), statutory citations (28 U.S.C. § 1361, 28 U.S.C. § 1915, 28 U.S.C. § 1651, 11 U.S.C. § 541, 15 U.S.C. § 77aaa, Wyo. Stat. Ann. § 17-23-101 et seq., Md. Code Ann., Est. & Trusts § 14.5-408, Md. Rule 15-701), CUSIPs (917300AA1, 917300AB9), entity names, and party names (Caustin Lee McLaughlin, Juan Jose Fernandez, The Bank of New York Mellon, Computershare Trust Company, N.A., M&T Bank, Centrus Energy Corp.) verbatim or with standard legal transliteration.
4. Housing & Carveout Invariant: Preserve the dedicated 30 row homes SSDI/SSI housing pool and 300 Baltimore rowhomes preservation intact.
5. No Preambles: Return ONLY the translated legal text. Do NOT add conversational introductory notes, markdown backticks, or concluding meta commentary.

Text to translate:
"""
${text}
"""`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.1,
          maxOutputTokens: 2048,
        }
      });

      const translatedText = response.text?.trim() || '';

      return res.json({
        translatedText,
        model: 'gemini-3.8-flash',
        targetLanguage,
        clauseKey: clauseKey || null,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Translation error from Gemini API:', err);
      return res.status(200).json({
        fallback: true,
        error: err.message || 'Gemini translation request failed',
        targetLanguage: req.body?.targetLanguage,
        clauseKey: req.body?.clauseKey || null
      });
    }
  });

  // Batch translation endpoint for translating multiple legal clauses
  app.post('/api/translate-batch', async (req: Request, res: Response) => {
    try {
      const { items, targetLanguage, targetLanguageName } = req.body;
      if (!Array.isArray(items) || !targetLanguage) {
        return res.status(400).json({ error: 'Invalid batch items or target language' });
      }

      if (targetLanguage === 'en' || !ai) {
        return res.json({
          fallback: !ai,
          targetLanguage,
          translations: {}
        });
      }

      const results: Record<string, string> = {};
      await Promise.all(
        items.map(async (item: { key: string; text: string }) => {
          try {
            const prompt = `You are a certified legal translator for US Federal and State courts. Translate this legal clause into ${targetLanguageName || targetLanguage} (${targetLanguage}). Preserve all citations, amounts ($500M, 45,850,000 LEU shares), docket numbers, CUSIPs, and parties intact. Output only the translated text:\n\n${item.text}`;
            const resp = await ai!.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt,
              config: { temperature: 0.1, maxOutputTokens: 2048 }
            });
            results[item.key] = resp.text?.trim() || '';
          } catch (e: any) {
            console.warn(`Batch translation failed for key ${item.key}:`, e.message);
          }
        })
      );

      return res.json({
        model: 'gemini-3.8-flash',
        targetLanguage,
        translations: results
      });
    } catch (err: any) {
      return res.status(200).json({ fallback: true, error: err.message, translations: {} });
    }
  });

  // Setup Vite middleware in development or static hosting in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        ws: isHmrDisabled ? false : { server: httpServer },
        hmr: isHmrDisabled ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Express dev server running on http://0.0.0.0:${PORT} with Gemini API integration`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
