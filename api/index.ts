import { startServer } from '../server';
import serverless from 'serverless-http';

let handler: any;

export default async (req: any, res: any) => {
  if (!handler) {
    const app = await startServer();
    handler = serverless(app);
  }
  return handler(req, res);
};
