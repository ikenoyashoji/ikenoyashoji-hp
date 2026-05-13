import { Link } from "wouter";
import footerBg from "@assets/スクリーンショット_2026-05-13_4.37.54_1778614678216.png";

export function Footer() {
  return (
    <footer className="relative text-white overflow-hidden">
      {/* Full-width background image */}
      <img src={footerBg} alt="" className="w-full h-auto block" />

      {/* Gradient overlay — darker at bottom */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(15,32,68,0.35) 0%, rgba(15,32,68,0.80) 60%, rgba(15,32,68,0.90) 100%)" }} />

      {/* Content — pinned to bottom */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-10 pb-5 pt-4 flex items-end justify-between gap-6">

        {/* Left: company name + address */}
        <div className="flex flex-col gap-1.5">
          <p className="text-white font-bold text-[17px] tracking-wider leading-none">株式会社池ノ谷商事</p>
          <div className="text-gray-200 text-[11px] leading-relaxed mt-0.5">
            <p>〒243-0303 神奈川県愛甲郡愛川町中津7287</p>
            <p>TEL : 046-212-2766　FAX : 046-401-1714</p>
          </div>
        </div>

        {/* Center: copyright */}
        <div className="flex-1 flex justify-center pb-0.5">
          <p className="text-gray-300 text-[11px] tracking-wide whitespace-nowrap">
            © 2023 株式会社 池ノ谷商事. All rights reserved.
          </p>
        </div>

        {/* Right: SNS icons (top) + links (bottom) */}
        <div className="flex flex-col items-end gap-2.5">
          <div className="flex items-center gap-4">
            {/* Facebook */}
            <a href="#" aria-label="Facebook" className="text-white/80 hover:text-white transition-colors">
              <svg className="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" aria-label="YouTube" className="text-white/80 hover:text-white transition-colors">
              <svg className="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" aria-label="Instagram" className="text-white/80 hover:text-white transition-colors">
              <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            {/* TikTok */}
            <a href="#" aria-label="TikTok" className="text-white/80 hover:text-white transition-colors">
              <svg className="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z"/>
              </svg>
            </a>
            {/* note */}
            <a href="#" aria-label="note" className="text-white/80 hover:text-white transition-colors flex items-center justify-center w-[22px] h-[22px]">
              <span className="text-[18px] font-black leading-none" style={{ fontFamily: "'Georgia', serif" }}>n</span>
            </a>
          </div>

          {/* Links */}
          <div className="flex items-center gap-3 text-[11px] text-gray-300">
            <Link href="/privacy" className="hover:text-white transition-colors">個人情報保護方針</Link>
            <span className="text-gray-500">／</span>
            <Link href="/" className="hover:text-white transition-colors">サイトマップ</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
