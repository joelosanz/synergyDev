'use client';
import Image from "next/image";
import Stripes from "@/public/images/stripes-dark.svg";
import { useEffect, useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{success?: boolean, message?: string} | null>(null);
  const [strapiData, setStrapiData] = useState({
    titulo: "Contáctanos",
    nombre_placeholder: "Nombre completo",
    email_placeholder: "Correo electrónico",
    mensaje_placeholder: "Tu mensaje...",
    boton_texto: "Enviar mensaje",
    boton_cargando: "Enviando...",
    mensaje_exito: "¡Mensaje enviado con éxito!",
    mensaje_error: "Error al enviar el mensaje"
  });

  useEffect(() => {
    // Fetch Strapi data
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/global?populate[contact][populate]=*`)
      .then(res => res.json())
      .then(data => {
        if(data?.data?.attributes?.contact) {
          setStrapiData(data.data.attributes.contact);
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if(response.ok) {
        setSubmitStatus({ success: true, message: strapiData.mensaje_exito });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error) {
      setSubmitStatus({ success: false, message: strapiData.mensaje_error });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl text-center shadow-xl before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gray-900">
          
          {/* Elementos decorativos */}
          <div className="absolute bottom-0 left-1/2 -z-10 -translate-x-1/2 translate-y-1/2" aria-hidden="true">
            <div className="h-56 w-[480px] rounded-full border-[20px] border-blue-500 blur-3xl" />
          </div>
          
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 transform" aria-hidden="true">
            <Image className="max-w-none" src={Stripes} width={768} height={432} alt="Stripes" />
          </div>

          {/* Formulario */}
          <div className="px-4 py-12 md:px-12 md:py-20">
            <h2 className="mb-6 border-y text-3xl font-bold text-gray-200 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-700/.7),transparent)1] md:mb-12 md:text-4xl">
              {strapiData.titulo}
            </h2>
            
            <form onSubmit={handleSubmit} className="mx-auto max-w-md">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder={strapiData.nombre_placeholder}
                required
                className="w-full mb-4 rounded-md border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder={strapiData.email_placeholder}
                required
                className="w-full mb-4 rounded-md border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              
              <textarea
                name="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder={strapiData.mensaje_placeholder}
                required
                rows={4}
                className="w-full mb-6 rounded-md border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              ></textarea>
              
              <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn group mb-4 w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto disabled:opacity-50"
                >
                  <span className="relative inline-flex items-center">
                    {isSubmitting ? strapiData.boton_cargando : strapiData.boton_texto}
                    {!isSubmitting && (
                      <span className="ml-1 tracking-normal text-blue-300 transition-transform group-hover:translate-x-0.5">
                        -&gt;
                      </span>
                    )}
                  </span>
                </button>
              </div>
              
              {submitStatus && (
                <div className={`mt-4 text-center text-${submitStatus.success ? 'green' : 'red'}-400`}>
                  {submitStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}