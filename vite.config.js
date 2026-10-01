import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'node:path';

const pages = ['index', 'work', 'project', 'garments', 'photography', 'about', 'cv'];

export default defineConfig(({ mode }) => {
  // Make server-only keys from .env.local (e.g. GROQ_API_KEY) visible to the dev API route
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return {
    appType: 'mpa',
    plugins: [{
      // Mirror Vercel in dev: cleanUrls (/work -> /work.html) and the /api/chat function
      name: 'vercel-dev-mirror',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const [path, q] = req.url.split('?');
          if (path === '/api/chat') {
            const { default: handler } = await server.ssrLoadModule('/api/chat.js');
            return handler(req, res);
          }
          if (pages.includes(path.slice(1))) req.url = `${path}.html${q ? `?${q}` : ''}`;
          next();
        });
      },
    }],
    build: { rollupOptions: { input: Object.fromEntries(pages.map((p) => [p, resolve(__dirname, `${p}.html`)])) } },
  };
});
