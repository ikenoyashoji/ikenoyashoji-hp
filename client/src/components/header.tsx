import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
const logoImg = "/logo-mark.png";

const navLinks = [
  { href: "/company", label: "池ノ谷商事について" },
  { href: "/company", label: "企業情報" },
  { href: "/services", label: "事業紹介" },
  { href: "/recruit", label: "採用情報" },
  { href: "/blog", label: "お知らせ" },
];

function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#ffffff",
        overflow: "hidden",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={logoImg}
        alt="池ノ谷商事ロゴ"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
}

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

      {/* Main header row — PC: always visible horizontal nav */}
      <div className="border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 lg:px-6">
          <div className="flex items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5 flex-shrink-0 mr-auto">
              <LogoMark size={66} />
              <div className="flex flex-col leading-none">
                <span className="text-[11px] text-gray-400 tracking-widest mb-0.5">総合物流企業</span>
                <span className="text-black tracking-tight" style={{ fontFamily: "'Noto Serif JP', serif", fontWeight: 900 }}>
                  <span className="text-sm">株式会社</span>
                  <span className="text-2xl">池ノ谷商事</span>
                </span>
              </div>
            </Link>

            {/* Desktop Nav — always shown, slash separated */}
            <nav className="hidden md:flex items-center">
              {navLinks.map((link, i) => (
                <span key={link.label} className="flex items-center">
                  {i > 0 && (
                    <span className="text-gray-300 mx-3 text-sm select-none">/</span>
                  )}
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#1a4b99] transition-colors whitespace-nowrap"
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
