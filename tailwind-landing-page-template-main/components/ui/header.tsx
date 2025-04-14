"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

interface NavbarLink {
  id: number;
  href: string;
  text: string;
  external: boolean;
}

interface NavbarData {
  colorNavbar: string;
  link: NavbarLink[];
  cta: NavbarLink;
  cta2: NavbarLink;
  logoLink: {
    text: string;  // <-- Aquí está el texto dinámico
    colorText: string;
    href: string;
    image: {
      url: string;
      formats: {
        thumbnail: { url: string };
      };
    };
  };
}

export default function Header() {
  const [navbarData, setNavbarData] = useState<NavbarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://localhost:1337/api/global?populate[navbar][populate][0]=link&populate[navbar][populate][1]=cta&populate[navbar][populate][2]=cta2&populate[navbar][populate][3]=logoLink.image'
        );
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        setNavbarData(data.data.navbar);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0F5C65]"></div>
        </div>
      </div>
    </div>
  );

  if (error || !navbarData) return (
    <div className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-center text-red-500">
          Error cargando el navbar
        </div>
      </div>
    </div>
  );

  return (
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div 
          className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]"
          style={{ backgroundColor: navbarData?.colorNavbar + '15' || 'transparent' }}
        >
          {/* Logo y nombre */}
          <Link 
            href={navbarData?.logoLink.href || '/'} 
            className="flex flex-1 items-center gap-2"
            target={navbarData?.logoLink.href?.startsWith('http') ? "_blank" : "_self"}
          >
            {navbarData?.logoLink.image?.formats?.thumbnail?.url && (
              <Image
                src={`http://localhost:1337${navbarData.logoLink.image.formats.thumbnail.url}`}
                alt="Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <span 
              className="font-semibold"
              style={{ color: navbarData?.logoLink.colorText || '#0F5C65' }}
            >
              {navbarData?.logoLink.text || 'Synergy Dev'}
            </span>
          </Link>

          {/* Botón de menú móvil */}
          <button 
            className="md:hidden p-2 rounded-md focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Menú para desktop (se mantiene igual) */}
          <nav className="hidden md:flex items-center gap-4">
            {navbarData?.link.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                target={item.external ? "_blank" : "_self"}
                style={{ color: navbarData?.logoLink.colorText || '#0F5C65' }}
              >
                {item.text}
              </Link>
            ))}
          </nav>

          {/* Botones para desktop (se mantiene igual) */}
          <div className="hidden md:flex flex-1 items-center justify-end gap-3">
            {navbarData?.cta && (
              <Link
                href={navbarData.cta.href}
                className="btn-sm bg-white shadow-sm hover:opacity-80 transition-opacity"
                target={navbarData.cta.external ? "_blank" : "_self"}
                style={{ color: navbarData?.logoLink.colorText || '#0F5C65' }}
              >
                {navbarData.cta.text}
              </Link>
            )}
            {navbarData?.cta2 && (
              <Link
                href={navbarData.cta2.href}
                className="btn-sm text-white shadow-sm hover:opacity-90 transition-opacity"
                target={navbarData.cta2.external ? "_blank" : "_self"}
                style={{ backgroundColor: navbarData?.colorNavbar || '#0F5C65' }}
              >
                {navbarData.cta2.text}
              </Link>
            )}
          </div>
        </div>

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-2xl bg-white/90 shadow-lg p-4">
            {/* Links centrales */}
            <nav className="flex flex-col gap-3 mb-4">
              {navbarData?.link.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="text-sm font-medium py-2 px-3 rounded hover:bg-gray-100 transition-colors"
                  target={item.external ? "_blank" : "_self"}
                  style={{ color: navbarData?.logoLink.colorText || '#0F5C65' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.text}
                </Link>
              ))}
            </nav>

            {/* Botones */}
            <div className="flex flex-col gap-3">
              {navbarData?.cta && (
                <Link
                  href={navbarData.cta.href}
                  className="btn-sm bg-white shadow-sm hover:opacity-80 transition-opacity text-center"
                  target={navbarData.cta.external ? "_blank" : "_self"}
                  style={{ color: navbarData?.logoLink.colorText || '#0F5C65' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {navbarData.cta.text}
                </Link>
              )}
              {navbarData?.cta2 && (
                <Link
                  href={navbarData.cta2.href}
                  className="btn-sm text-white shadow-sm hover:opacity-90 transition-opacity text-center"
                  target={navbarData.cta2.external ? "_blank" : "_self"}
                  style={{ backgroundColor: navbarData?.colorNavbar || '#0F5C65' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {navbarData.cta2.text}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}