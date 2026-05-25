/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aquí añadimos una línea
  experimental: {
    appDir: true, // Ya debería estar si creaste el proyecto con App Router
  },
  // Importante: esta línea ayuda a Next.js con CSS
  reactStrictMode: true, 
}

module.exports = nextConfig
