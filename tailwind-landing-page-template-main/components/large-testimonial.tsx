'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

interface TestimonialData {
  id: number;
  quote: string;
  author_name: string;
  author_position: string;
  author_company: string;
  company_link: string;
  image: {
    id: number;
    url: string;
    formats: {
      thumbnail: {
        url: string;
      };
      small?: {
        url: string;
      };
      medium?: {
        url: string;
      };
    };
  };
  brand_colors: {
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    text_color: string;
    light_text_color: string;
  };
}

export default function LargeTestimonial() {
  const [testimonial, setTestimonial] = useState<TestimonialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/global?populate[testimonial][populate]=*`
        );
        
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }

        const { data } = await response.json();
        
        // Acceso directo a data.testimonial según tu estructura
        if (data?.testimonial) {
          setTestimonial(data.testimonial);
        } else {
          throw new Error("Estructura de datos incorrecta");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error("Error fetching testimonial:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonial();
  }, []);

  if (loading) return <div className="text-center py-12">Cargando testimonio...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!testimonial) return <div className="text-center py-12">No se encontró testimonio</div>;

  return (
    <section>
      <div className="mx-auto max-w-2xl px-4 spsm:px-6">
        <div className="py-12 md:py-20">
          <div className="space-y-3 text-center">
            <div className="relative inline-flex">
              <svg
                className="absolute -left-6 -top-2 -z-10"
                width={40}
                height={49}
                viewBox="0 0 40 49"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: testimonial.brand_colors.light_text_color }}
              >
                <path
                  d="M22.7976 -0.000136375L39.9352 23.4746L33.4178 31.7234L13.7686 11.4275L22.7976 -0.000136375ZM9.34947 17.0206L26.4871 40.4953L19.9697 48.7441L0.320491 28.4482L9.34947 17.0206Z"
                  fill="currentColor"
                />
              </svg>
              <Image
                className="rounded-full"
                src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${testimonial.image.url}`}
                width={48}
                height={48}
                alt={`Testimonio de ${testimonial.author_name}`}
                blurDataURL={`${process.env.NEXT_PUBLIC_STRAPI_URL}${testimonial.image.formats.thumbnail.url}`}
                placeholder="blur"
              />
            </div>
            <p 
              className="text-2xl font-bold"
              style={{ color: testimonial.brand_colors.text_color }}
            >
              {testimonial.quote}
            </p>
            <div 
              className="text-sm font-medium"
              style={{ color: testimonial.brand_colors.light_text_color }}
            >
              <span style={{ color: testimonial.brand_colors.text_color }}>
                {testimonial.author_name}
              </span>{" "}
              <span style={{ color: testimonial.brand_colors.light_text_color }}>/</span>{" "}
              <a
                className="hover:underline"
                href={testimonial.company_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: testimonial.brand_colors.primary_color }}
              >
                {testimonial.author_position} at {testimonial.author_company}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}