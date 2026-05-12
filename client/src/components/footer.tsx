import { Link } from "wouter";
import { trackEvent } from "@/lib/analytics";

export function Footer() {
  return (
    <footer className="bg-[#0f2044] text-white relative overflow-hidden">
      {/* Background image placeholder — replace later */}
      <div className="absolute inset-0 bg-gray-800 opacity-0" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-8 py-6 flex items-center justify-between gap-8">

        {/* Left: company info */}
        <div className="flex flex-col gap-1 min-w-fit">
          <p className="text-white font-bold text-base tracking-wide">株式会社池ノ谷商事</p>
          <p className="text-gray-300 text-xs leading-relaxed">
            〒135-0001 東京都江東区東陽1-1-1<br />
            TEL : 03-1234-5678
          </p>
        </div>

        {/* Center: image placeholder + copyright */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="w-48 h-20 bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 text-[10px] tracking-widest">IMAGE</span>
          </div>
          <p className="text-gray-400 text-[11px] tracking-wide">
            © {new Date().getFullYear()} 株式会社池ノ谷商事. All rights reserved.
          </p>
        </div>

        {/* Right: social icons + links */}
        <div className="flex flex-col items-end gap-3 min-w-fit">
          {/* Social icons */}
          <div className="flex items-center gap-4">
            {/* Facebook */}
            <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
            </a>
            {/* YouTube */}
            <a href="#" aria-label="YouTube" className="text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
            </a>
            {/* Instagram */}
            <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path fill="#0f2044" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="#0f2044" strokeWidth="2" strokeLinecap="round"/></svg>
            </a>
            {/* TikTok */}
            <a href="#" aria-label="TikTok" className="text-gray-300 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z"/></svg>
            </a>
            {/* note */}
            <a href="#" aria-label="note" className="text-gray-300 hover:text-white transition-colors text-sm font-bold tracking-tight">
              n
            </a>
          </div>

          {/* Links */}
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link>
            <span className="text-gray-600">／</span>
            <Link href="/" className="hover:text-white transition-colors">サイトマップ</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
