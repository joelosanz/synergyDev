"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Feature {
  id: number;
  titulo: string;
  Description: string;
  Icono?: {
    id?: number;
    url?: string;
  };
}

interface FeatureShowcaseData {
  titulo: string;
  Imagen?: {
    id?: number;
    url?: string;
  };
  Features?: Feature[];
}

export default function FeatureShowcase() {
  const [data, setData] = useState<FeatureShowcaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://localhost:1337/api/global?populate[FeatureShowcase][populate][Imagen][fields][0]=url&populate[FeatureShowcase][populate][Features][populate][Icono][fields][0]=url'
        );
        
        if (!response.ok) {
          throw new Error(`Error HTTP! estado: ${response.status}`);
        }

        const jsonData = await response.json();
        
        if (!jsonData.data?.FeatureShowcase) {
          throw new Error("No se encontraron datos de FeatureShowcase");
        }

        setData(jsonData.data.FeatureShowcase);
      } catch (error) {
        console.error("Error obteniendo datos:", error);
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Dividir features en grupos de 3 para el grid
  const featureGroups = [];
  if (data?.Features) {
    for (let i = 0; i < data.Features.length; i += 3) {
      featureGroups.push(data.Features.slice(i, i + 3));
    }
  }

  if (loading) return <div className="text-center py-12">Cargando...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!data) return <div className="text-center py-12 text-red-500">No hay datos disponibles</div>;

  return (
    <section className="relative bg-gray-900 py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Encabezado */}
        <div className="mx-auto max-w-3xl pb-12 md:pb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-200 md:text-4xl">
            {data.titulo}
          </h2>
        </div>

        {/* Imagen principal con animación */}
        <div className="relative mx-auto w-full max-w-2xl pb-12 md:pb-16">
          {data.Imagen?.url ? (
            <div className="animate-[float_6s_ease-in-out_infinite] bg-gray-800 rounded-lg overflow-hidden">
              <Image
                src={`http://localhost:1337${data.Imagen.url}`}
                width={800}
                height={600}
                alt="Imagen destacada"
                className="w-full h-auto object-cover"
                priority
                onError={(e) => {
                  console.error("Error al cargar la imagen:", e);
                  setError("Error al cargar la imagen principal");
                }}
              />
            </div>
          ) : (
            <div className="bg-blue-900 rounded-lg w-full h-64 flex items-center justify-center">
              <span className="text-gray-300">Imagen no disponible</span>
            </div>
          )}
        </div>

        {/* Grid de features - auto-organizado en grupos de 3 */}
        {data.Features && data.Features.length > 0 && (
          <div className="space-y-8">
            {featureGroups.map((group, groupIndex) => (
              <div 
                key={`group-${groupIndex}`}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                data-aos="fade-up"
                data-aos-delay={groupIndex * 100}
              >
                {group.map((feature) => (
                  <article 
                    key={feature.id}
                    className="relative p-6 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
                  >
                    <div className="flex items-start space-x-4">
                      {feature.Icono?.url ? (
                        <div className="flex-shrink-0 mt-1">
                          <Image
                            src={`http://localhost:1337${feature.Icono.url}`}
                            alt={`Icono ${feature.titulo}`}
                            width={32}
                            height={32}
                            className="h-8 w-8 object-contain"
                            onError={(e) => {
                              console.error("Error al cargar el icono:", e);
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 mt-1 text-blue-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                          </svg>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-medium text-gray-200 mb-2">
                          {feature.titulo}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {feature.Description}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
                
                {/* Rellenar espacios vacíos si el último grupo no tiene 3 items */}
                {group.length < 3 && Array.from({ length: 3 - group.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="hidden sm:block" aria-hidden="true" />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Animación CSS */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </section>
  );
}