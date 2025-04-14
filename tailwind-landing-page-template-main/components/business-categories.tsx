'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

interface LogoItem {
  id: number;
  altText: string;
  logo: {
    url: string;
    width: number;
    height: number;
  };
}

interface LogosData {
  animationColor: string;
  sectionTitle: string;
  showSection: boolean;
  floatingLogos: {
    id: number;
    altText: string;
    width: string;
    height: string;
    logo: {
      url: string;
    };
  }[];
}

export default function PartnerCompanies() {
  const STRAPI_URL = 'http://localhost:1337';
  const [logos, setLogos] = useState<LogoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState({
    animationColor: '#0F5C65', // Valor por defecto
    sectionTitle: 'Empresas asociadas'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${STRAPI_URL}/api/global?populate[logos][populate][floatingLogos][populate]=*`
        );
        
        if (!response.ok) throw new Error('Error al cargar los datos');
        const json = await response.json();
        
        // Extraer configuración de colores y título
        const logosConfig = json.data?.logos;
        if (!logosConfig) throw new Error('Configuración de logos no encontrada');
        
        // Actualizar configuración
        setConfig({
          animationColor: logosConfig.animationColor || '#0F5C65',
          sectionTitle: logosConfig.sectionTitle || 'Empresas asociadas'
        });

        // Procesar logos
        const logosData = logosConfig.floatingLogos?.map((item: any) => ({
          id: item.id,
          altText: item.altText || 'Logo empresa',
          logo: {
            url: item.logo.url.startsWith('/') 
              ? `${STRAPI_URL}${item.logo.url}`
              : item.logo.url,
            width: parseInt(item.width) || 100,
            height: parseInt(item.height) || 100
          }
        })) || [];
        
        setLogos(logosData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-12">Cargando empresas asociadas...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!logos.length) return null;

  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {config.sectionTitle}
          </h2>
          <div 
            className="mt-4 h-1 w-20 mx-auto rounded-full"
            style={{ backgroundColor: config.animationColor }}
          />
        </div>

        {/* Carrusel de logos */}
        <div className="relative overflow-hidden py-8">
          {/* Fondo animado con color dinámico */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div 
              className="absolute left-1/2 top-0 h-full w-[300px] -translate-x-1/2"
              style={{ 
                background: `linear-gradient(to right, ${config.animationColor}33, transparent, ${config.animationColor}33)`
              }}
            />
          </div>

          {/* Contenedor del carrusel */}
          <div className="relative flex items-center justify-center">
            <div className="flex space-x-12 animate-infinite-scroll hover:animation-paused">
              {[...logos, ...logos].map((logo, index) => (
                <div 
                  key={`${logo.id}-${index}`}
                  className="flex-shrink-0 transform transition-all hover:scale-110"
                >
                  <div 
                    className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white p-4 shadow-lg"
                    style={{ 
                      border: `2px solid ${config.animationColor}20`,
                      boxShadow: `0 4px 15px ${config.animationColor}30`
                    }}
                  >
                    <Image
                      src={logo.logo.url}
                      width={logo.logo.width}
                      height={logo.logo.height}
                      alt={logo.altText}
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animaciones CSS */}
      <style jsx global>{`
        @keyframes infinite-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 30s linear infinite;
          display: flex;
          width: max-content;
        }
        .hover\:animation-paused:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}