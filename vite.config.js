import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const pages = ['index', 'work', 'project', 'garments', 'photography', 'about', 'cv'];

export default defineConfig({
  appType: 'mpa',
  plugins: [{
    // Mirror Vercel's cleanUrls in dev: /work -> /work.html
    name: 'clean-urls',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const [path, q] = req.url.split('?');
        if (pages.includes(path.slice(1))) req.url = `${path}.html${q ? `?${q}` : ''}`;
        next();
      });
    },
  }],
  build: { rollupOptions: { input: Object.fromEntries(pages.map((p) => [p, resolve(__dirname, `${p}.html`)])) } },
});
