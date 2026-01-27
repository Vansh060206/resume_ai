import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  experimental: {
    turbopack: {
      root: __dirname,
    },
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
