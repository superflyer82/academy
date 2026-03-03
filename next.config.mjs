/** @type {import('next').NextConfig} */
const nextConfig = {
  // Zwingend: Static Export für FTP-Deployment – kein SSR, keine API-Routen
  output: 'export',
  // trailingSlash: false vermeidet 404 auf / im Dev-Server (Known Issue mit true)
  trailingSlash: false,
  images: { unoptimized: true },
};

export default nextConfig;
