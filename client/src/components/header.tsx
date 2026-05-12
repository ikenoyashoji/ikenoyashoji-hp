import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Mail, MapPin } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
const logoImg = "/logo-mark.png";

const navLinks = [
  { href: "/#services", label: "サービスのご案内" },
  { href: "/company", label: "企業情報" },
  { href: "/recruit", label: "採用情報" },
  { href: "/blog", label: "お知らせ" },
  { href: "/partner", label: "協力会社" },
];

function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#0a1628",
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
        style={{ width: "90%", height: "90%", objectFit: "contain" }}
      />
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      {/* Top utility bar */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-9 gap-4">
            <a
              href="/company#access"
              className="hidden sm:flex items-center gap-1 text-xs text-gray-500 hover:text-[#1a4b99] transition-colors"
            >
              <MapPin className="w-3 h-3" />
              本社アクセス
            </a>
            <Link
              href="/contact"
              onClick={() => trackEvent("cta_contact_click", { location: "header_top" })}
              className="flex items-center gap-1.5 bg-[#0f2044] hover:bg-[#1a4b99] text-white text-xs font-medium px-4 py-1.5 transition-colors"
              data-testid="button-contact-header-top"
            >
              <Mail className="w-3 h-3" />
              お問い合わせ
            </Link>
          </div>
        </div>
      </div>

      {/* Main header row */}
      <div className="border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <LogoMark size={40} />
              <div className="flex flex-col leading-none">
                <span className="text-[9px] text-gray-400 tracking-widest mb-0.5">総合物流企業</span>
                <div className="flex items-baseline gap-0">
                  <span className="text-[#1a4b99] font-black text-xl tracking-tight">池ノ谷</span>
                  <span className="text-[#1d4ed8] font-black text-xl tracking-tight">商事</span>
                </div>
              </div>
            </Link>

            {/* Desktop Nav — slash separated */}
            <nav className="hidden lg:flex items-center">
              {navLinks.map((link, i) => (
                <span key={link.href} className="flex items-center">
                  {i > 0 && (
                    <span className="text-gray-300 mx-2 text-sm select-none">/</span>
                  )}
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#1a4b99] transition-colors whitespace-nowrap py-1 px-1"
                    data-testid={`link-nav-${link.label}`}
                  >
                    {link.label}
                  </a>
                </span>
              ))}
            </nav>

            {/* Mobile hamburger */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <button className="p-2 text-gray-600 hover:text-gray-900" data-testid="button-mobile-menu">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white border-gray-200 w-72">
                <div className="flex items-center gap-2.5 mb-8 mt-2">
                  <LogoMark size={36} />
                  <div className="flex flex-col leading-none">
                    <span className="text-[9px] text-gray-400 tracking-widest mb-0.5">総合物流企業</span>
                    <div className="flex items-baseline">
                      <span className="text-[#1a4b99] font-black text-lg">池ノ谷</span>
                      <span className="text-[#1d4ed8] font-black text-lg">商事</span>
                    </div>
                  </div>
                </div>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 text-gray-700 hover:text-[#1a4b99] hover:bg-gray-50 rounded-md transition-colors text-sm border-b border-gray-100"
                      data-testid={`link-nav-mobile-${link.label}`}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-6">
                  <Link
                    href="/contact"
                    onClick={() => { setOpen(false); trackEvent("cta_contact_click", { location: "header_mobile" }); }}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#0f2044] text-white text-sm font-medium"
                    data-testid="button-contact-mobile"
                  >
                    <Mail className="w-4 h-4" />
                    お問い合わせ
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
