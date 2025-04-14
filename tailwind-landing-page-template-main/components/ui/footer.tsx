import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaYoutube, FaFacebook } from 'react-icons/fa';

interface FooterLink {
  id: number;
  href: string;
  text: string;
  external: boolean;
}

interface FooterSection {
  id: number;
  title: string;
  Links?: FooterLink[];
}

interface FooterContent {
  id: number;
  Campo: string;
  primary_color: string;
  secondary_color: string;
  text_color: string;
  big_text: string;
  small_text: string;
  glow_color: string;
  Logo: {
    url: string;
    alternativeText?: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
    };
  };
  sections: FooterSection[];
  social_links: Array<{
    id: number;
    Plataform: string;
    url: string;
  }>;
}

export default function Footer({ border = false }: { border?: boolean }) {
  const [footerData, setFooterData] = useState<FooterContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const res = await fetch(
          'http://localhost:1337/api/global?populate[footer][populate][0]=Logo&populate[footer][populate][1]=sections.Links&populate[footer][populate][2]=social_links'
        );
        const { data } = await res.json();
        setFooterData(data.footer);
      } catch (error) {
        console.error("Error loading footer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  if (loading || !footerData) {
    return (
      <footer className="bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="py-12 text-center">Cargando footer...</div>
        </div>
      </footer>
    );
  }

  const {
    Campo,
    primary_color = '#1cc162',
    secondary_color = '#ffffff',
    text_color = '#000000',
    big_text = 'SynergyDev',
    small_text,
    glow_color = '#0F5C65',
    Logo,
    sections,
    social_links
  } = footerData;

  return (
    <footer className="bg-white" style={{ color: text_color }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className={`grid gap-8 py-8 sm:grid-cols-12 md:py-12 ${
          border ? "border-t border-gray-200" : ""
        }`}>
          
          {/* Logo Block - Corregido */}
          <div className="space-y-4 sm:col-span-12 lg:col-span-4">
            {Logo?.url && (
              <div className="relative h-12 w-40">
                <Image
                  src={Logo.url}
                  alt={Logo.alternativeText || "Company Logo"}
                  fill
                  className="object-contain object-left"
                  unoptimized={true} // Para desarrollo local
                  priority
                />
              </div>
            )}
            <div className="text-sm">
              {small_text || Campo}
            </div>
          </div>

          {/* Sections */}
          {sections?.map((section) => (
            <div key={section.id} className="space-y-3 sm:col-span-6 md:col-span-3 lg:col-span-2">
              <h3 className="text-sm font-medium">{section.title}</h3>
              <ul className="space-y-2">
                {section.Links?.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : "_self"}
                      className="hover:underline"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social Links */}
          <div className="space-y-3 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Social</h3>
            <div className="flex gap-4">
              {social_links?.map((social) => (
                <Link
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  aria-label={social.Plataform}
                  className="text-lg hover:opacity-75"
                  style={{ color: primary_color }}
                >
                  {social.Plataform === 'youtube' && <FaYoutube />}
                  {social.Plataform === 'facebook' && <FaFacebook />}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Big Text - Versión corregida y visible */}
      <div className="relative -mt-12 h-48 w-full overflow-hidden">
        <div 
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[10vw] font-bold leading-none"
          style={{
            background: `linear-gradient(to bottom, ${primary_color}, ${secondary_color})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: 0.6,
            width: '100%'
          }}
        >
          {big_text}
        </div>
        
        {/* Glow Effect */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-40 w-40 rounded-full blur-[60px]"
          style={{ 
            backgroundColor: glow_color,
            opacity: 0.8
          }}
        />
      </div>
    </footer>
  );
}