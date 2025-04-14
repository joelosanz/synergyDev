'use client';

import { useState } from 'react';

interface ContactFormProps {
  content: any;
  submitAction: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
}

export default function ContactForm({ content, submitAction }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await submitAction(formData);
      
      if (result.success) {
        setSubmitStatus('success');
        event.currentTarget.reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md">
      <div className="mb-4">
        <input
          type="text"
          name="name"
          placeholder={content?.nombre_placeholder || "Nombre completo"}
          required
          className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 mb-4"
        />
      </div>
      
      <div className="mb-4">
        <input
          type="email"
          name="email"
          placeholder={content?.email_placeholder || "Correo electrónico"}
          required
          className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 mb-4"
        />
      </div>
      
      <div className="mb-6">
        <textarea
          name="message"
          placeholder={content?.mensaje_placeholder || "Tu mensaje..."}
          required
          rows={4}
          className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        ></textarea>
      </div>
      
      <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn group mb-4 w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto disabled:opacity-50"
        >
          <span className="relative inline-flex items-center">
            {isSubmitting 
              ? content?.boton_cargando || "Enviando..." 
              : content?.boton_texto || "Enviar mensaje"}
            {!isSubmitting && (
              <span className="ml-1 tracking-normal text-blue-300 transition-transform group-hover:translate-x-0.5">
                -&gt;
              </span>
            )}
          </span>
        </button>
      </div>
      
      {submitStatus === 'success' && (
        <div className="mt-4 text-green-400">
          {content?.mensaje_exito || "¡Mensaje enviado con éxito!"}
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="mt-4 text-red-400">
          {content?.mensaje_error || "Error al enviar el mensaje. Inténtalo de nuevo."}
        </div>
      )}
    </form>
  );
}