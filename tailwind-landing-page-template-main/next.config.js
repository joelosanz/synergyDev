// next.config.js
const nextConfig = {
  images: {
    domains: ["localhost"], // Agrega "localhost:1337" aquí
  },
  experimental: {
    serverActions: true, // Habilitar Server Actions
  },
};

module.exports = nextConfig;