import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Let's declare our health check API routes before general client serving
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', ssr: true, mode: process.env.NODE_ENV });
  });

  let vite: any = null;
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom' // SSR server takes control of HTML rendering
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files built by vite
    const distPath = path.join(process.cwd(), 'dist/client');
    app.use(express.static(distPath, { index: false }));
  }

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      let template: string;
      let render: any;

      if (!isProd) {
        // Read index.html from source root in dev
        template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        const ssrModule = await vite.ssrLoadModule('/src/entry-server.tsx');
        render = ssrModule.render;
      } else {
        // Read index.html from compiled client dist in prod
        template = fs.readFileSync(path.resolve(process.cwd(), 'dist/client/index.html'), 'utf-8');
        
        // Load server-side React render code from compiled SSR distribution
        const ssrPath = path.resolve(process.cwd(), 'dist/server/entry-server.js');
        const ssrModule = await import(ssrPath);
        render = ssrModule.render;
      }

      // Execute render to string
      const { html } = render();

      // Inject server-rendered html into template
      const htmlOutput = template.replace('<!--ssr-outlet-->', html);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(htmlOutput);
    } catch (e: any) {
      if (!isProd && vite) {
        vite.ssrFixStacktrace(e);
      }
      console.error('SSR Render Error:', e);
      next(e);
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
}

startServer();
