import { render } from '../src/entry-server';

export interface Env {
  // Add environment variables if needed
}

export type PagesFunction<E = any> = (context: {
  request: Request;
  next: () => Promise<Response>;
  env: E;
}) => Promise<Response>;

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);

  // If requesting a static file, skip SSR and serve directly from the build output
  if (
    url.pathname.includes('.') &&
    !url.pathname.endsWith('.html') &&
    !url.pathname.endsWith('/')
  ) {
    return context.next();
  }

  try {
    // 1. Fetch the static source template (index.html) that was uploaded in the deployment
    const response = await context.next();

    // Ensure it is indeed text/html
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return response;
    }

    const template = await response.text();

    // 2. Execute React Server-Side Rendering
    const { html } = render();

    // 3. Inject the server-rendered HTML into our template
    const pageWithSsr = template
      .replace('<!--ssr-outlet-->', html)
      .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

    // 4. Respond with pre-rendered content and optimized SEO/Headers
    return new Response(pageWithSsr, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
        'cache-control': 'public, max-age=0, must-revalidate',
        'x-powered-by': 'Cloudflare-Edge-SSR',
      },
    });
  } catch (err: any) {
    console.error('Edge SSR Error: ', err.message || err);
    return new Response(
      `<!DOCTYPE html><html><head><title>Edge Recovery Mode</title></head><body><h1>Edge Decryption Failure</h1><p>Erro ao decodificar a requisição no servidor de borda.</p><pre>${err.message || err}</pre></body></html>`,
      {
        status: 500,
        headers: { 'content-type': 'text/html;charset=UTF-8' },
      }
    );
  }
};
