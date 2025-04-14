"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import PageIllustration from "@/components/page-illustration";

interface HeroTitle {
  firstText?: string;
  secondText?: string;
}

interface HeroImage {
  id: number;
  name?: string;
  image?: {
    id: number;
    url?: string;
    formats?: {
      thumbnail?: { url?: string };
      small?: { url?: string };
      medium?: { url?: string };
      large?: { url?: string };
    };
  };
}

interface HeroBenefit {
  firstText?: string;
  secondText?: string;
}

interface HeroButton {
  href?: string;
  text?: string;
  external?: boolean;
}

interface Hero {
  id?: number;
  color?: string;
  title?: HeroTitle;
  images?: HeroImage[];
  benefits?: HeroBenefit[];
  firstButton?: HeroButton;
  secondButton?: HeroButton;
}

interface StrapiResponse {
  data?: {
    id?: number;
    attributes?: {
      hero?: Hero;
    };
    hero?: Hero;
  };
}

export default function HeroHome() {
  const [isMounted, setIsMounted] = useState(false);
  const [heroData, setHeroData] = useState<StrapiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroColor, setHeroColor] = useState("#0F5C65");

  useEffect(() => {
    setIsMounted(true);
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://localhost:1337/api/global?populate[hero][populate][0]=title&populate[hero][populate][1]=images.image&populate[hero][populate][2]=benefits&populate[hero][populate][3]=firstButton&populate[hero][populate][4]=secondButton',
          { signal: controller.signal }
        );

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const data = await response.json();
        setHeroData(data);

        // Extraemos el color del hero directamente
        const color = data?.data?.attributes?.hero?.color || 
                     data?.data?.hero?.color || 
                     "#0F5C65";
        setHeroColor(color.startsWith('#') ? color : `#${color}`);


      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  if (!isMounted) return null;

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0F5C65]"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-8 text-red-500">
      {error}
      <p className="mt-2 text-sm text-gray-600">
        Verifica la conexión con la API
      </p>
    </div>
  );

  const hero = heroData?.data?.hero || heroData?.data?.attributes?.hero;
  
  if (!hero) return (
    <div className="text-center py-8">
      No se encontraron datos válidos
    </div>
  );

  return (
    <section className="relative">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Sección superior con logos y título - Simplificada */}
          <div className="pb-12 text-center md:pb-16">
            <div className="mb-6 border-t border-b border-gray-200">
              <div className="flex justify-center space-x-4">
                {hero.images?.map((image) => {
                  const imageUrl = image.image?.formats?.thumbnail?.url || image.image?.url;
                  return imageUrl ? (
                    <div key={image.id} className="relative h-12 w-12 rounded-full border-2 border-white overflow-hidden">
                      <Image
                        src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:1337${imageUrl}`}
                        fill
                        alt={image.name || `Logo ${image.id}`}
                        className="object-cover"
                        priority
                      />
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Título principal */}
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              {hero.title?.firstText}
            </h1>

            {/* Descripción */}
            <p className="mb-8 text-lg text-gray-600">
              {hero.title?.secondText}
            </p>

            {/* Botones */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            {hero.firstButton && (
              <a
                href={hero.firstButton.href || '#'}
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-white transition-colors hover:opacity-90"
                style={{
                  backgroundColor: heroColor,
                }}
                target={hero.firstButton.external ? "_blank" : "_self"}
                rel="noopener noreferrer"
              >
                {hero.firstButton.text}
                <span className="ml-2">→</span>
              </a>
            )}
            {hero.secondButton && (
              <a
                href={hero.secondButton.href || '#'}
                className="inline-flex items-center justify-center rounded-lg border-2 px-6 py-3 transition-colors hover:bg-opacity-10"
                style={{
                  borderColor: heroColor,
                  color: heroColor,
                  
                }}
                target={hero.secondButton.external ? "_blank" : "_self"}
                rel="noopener noreferrer"
              >
                {hero.secondButton.text}
              </a>
            )}
          </div>
          </div>

          {/* Sección de beneficios - Simplificada */}
          <div className="mx-auto max-w-3xl rounded-xl bg-gray-800 p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between border-b border-gray-700 pb-3">
              <span className="font-mono text-sm text-gray-400">
                Synergy Dev
              </span>
              <div className="flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            
            <div className="font-mono text-gray-300">
              {hero.benefits?.map((benefit, index) => (
                <div key={index} className="mb-2">
                  <span className="text-green-400">$</span>{" "}
                  <span className="text-blue-400">{benefit.firstText}:</span>{" "}
                  <span className="text-gray-200">{benefit.secondText}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}