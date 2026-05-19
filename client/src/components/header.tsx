import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
const logoFull = "/logo-full.jpg";

const navLinks = [
  { href: "/about", label: "池ノ谷商事について" },
  { href: "/company", label: "企業情報" },
  { href: "/services", label: "事業紹介" },
  { href: "/recruit", label: "採用情報" },
  { href: "/blog", label: "お知らせ" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      {/* Top utility bar */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 lg:px-6">
          <div className="flex items-center justify-end h-9 gap-4">
            <a
              href="/company#access"
              className="text-xs text-gray-500 hover:text-[#1a4b99] transition-colors"
            >
              本社アクセス
            </a>
            <Link
              href="/contact"
              onClick={() => trackEvent("cta_contact_click", { location: "header_top" })}
              className="flex items-center text-white text-xs font-medium px-5 py-1.5 transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #1a4b99 0%, #1d4ed8 100%)" }}
              data-testid="button-contact-header-top"
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      </div>

      {/* Main header row */}
      <div className="border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 lg:px-6">
          <div className="flex items-center h-16">
            {/* Logo image only */}
            <Link href="/" className="flex items-center flex-shrink-0 mr-auto -ml-2">
              <img
                src={logoFull}
                alt="株式会社池ノ谷商事"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center">
              {navLinks.map((link, i) => (
                <span key={link.label} className="flex items-center">
                  {i > 0 && (
                    <span className="text-gray-300 mx-3 text-sm select-none">/</span>
                  )}
                  <a
                    href={link.href}
                    className="text-base text-gray-600 hover:text-[#1a4b99] transition-colors whitespace-nowrap"
                    data-testid={`link-nav-${link.label}`}
                  >
                    {link.label}
                  </a>
                </span>
              ))}
            </nav>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 ml-auto"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="メニューを開く"
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-md">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex flex-col py-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3.5 text-sm text-gray-700 hover:text-[#1a4b99] border-b border-gray-100 last:border-0 transition-colors"
                  data-testid={`link-nav-mobile-${link.label}`}
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/contact"
                onClick={() => { setMobileOpen(false); trackEvent("cta_contact_click", { location: "header_mobile" }); }}
                className="mt-3 mb-2 flex items-center justify-center w-full py-3 bg-[#0f2044] text-white text-sm font-medium"
                data-testid="button-contact-mobile"
              >
                お問い合わせ
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
