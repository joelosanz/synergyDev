"use client";
import Stripes from "@/public/images/stripes.svg";
import { useState, useEffect } from "react";

export default function PageIllustration() {
  const [circleColor, setCircleColor] = useState("#0F5C65");
  const [backgroundImage, setBackgroundImage] = useState<string>(Stripes.src);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:1337/api/global?populate[hero][populate]=background"
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { data } = await response.json();
        const heroData = data?.attributes?.hero;

        if (heroData) {
          // Actualizar color de círculos
          if (heroData.color) {
            setCircleColor(heroData.color.startsWith('#') 
              ? heroData.color 
              : `#${heroData.color}`);
          }

          // Actualizar imagen de fondo
          if (heroData.background?.data?.attributes) {
            const bgAttr = heroData.background.data.attributes;
            const imageUrl = bgAttr.url 
              ? `http://localhost:1337${bgAttr.url}`
              : Stripes.src;
            setBackgroundImage(imageUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching data from Strapi:", error);
        // Mantener valores por defecto si hay error
      }
    };

    fetchData();
  }, []);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {/* Capa de fondo */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 transform w-[768px] h-full"
        aria-hidden="true"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
  }}
/>

      {/* Círculos de color */}
      {[[-32, 580], [420, 380], [640, -300], [800, 100]].map(([top, left], index) => (
        <div
          key={`circle-${index}`}
          className="absolute transform -translate-x-1/2"
          style={{
            top: `${top}px`,
            left: `calc(50% + ${left}px)`,
            width: '20rem',
            height: '20rem',
            borderRadius: '50%',
            backgroundColor: circleColor,
            opacity: 0.3,
            filter: 'blur(160px)'
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}