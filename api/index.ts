import { startServer } from '../server';

let appPromise: Promise<any> | null = null;

export default async function handler(req: any, res: any) {
  try {
    if (!appPromise) {
      appPromise = startServer();
    }
    const app = await appPromise;
    return app(req, res);
  } catch (err: any) {
    console.error('[Vercel API Handler Error]', err?.message || err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        success: false, 
        error: `Server initialization error: ${err?.message || 'Internal server error'}` 
      }));
    }
  }
}
