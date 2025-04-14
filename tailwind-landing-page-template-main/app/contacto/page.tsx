import Image from "next/image";
import Stripes from "@/public/images/stripes-dark.svg";
import { submitContactForm } from "./action";
import ContactForm from "./ContactForm";

export default async function ContactPage() {
  // Obtener datos de Strapi
  const strapiData = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/contact-form?populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 3600 } // Cache por 1 hora
    }
  ).then(res => res.json());

  const contactContent = strapiData.data?.attributes;

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-2xl text-center shadow-xl before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gray-900"
          data-aos="zoom-y-out"
        >
          {/* Glow y Stripes (mantener tu diseño existente) */}
          
          <div className="px-4 py-12 md:px-12 md:py-20">
            <h2 className="mb-6 border-y text-3xl font-bold text-gray-200 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-700/.7),transparent)1] md:mb-12 md:text-4xl">
              {contactContent?.titulo || "Contáctanos"}
            </h2>
            
            <ContactForm 
              content={contactContent} 
              submitAction={submitContactForm} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}