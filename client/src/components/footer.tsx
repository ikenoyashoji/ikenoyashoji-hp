import { Link } from "wouter";
import footerBg from "@assets/スクリーンショット_2026-05-22_14.34.44_1779428095288.webp";

export function Footer() {
  return (
    <footer className="relative text-white overflow-hidden">
      <img src={footerBg} alt="" className="w-full h-[220px] md:h-auto object-cover md:object-fill block [object-position:30%_center] md:[object-position:center_center]" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(15,32,68,0.35) 0%, rgba(15,32,68,0.80) 60%, rgba(15,32,68,0.95) 100%)" }} />

      <div className="absolute inset-x-0 bottom-0 z-10 px-5 md:px-10 pb-2 pt-4">
        {/* Mobile: stacked / Desktop: horizontal */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-6">

          {/* Left: company name + address */}
          <div className="flex flex-col gap-1">
            <p className="text-white font-bold text-base md:text-[20px] tracking-wider leading-none">株式会社池ノ谷商事</p>
            <div className="text-gray-200 text-[11px] md:text-[13px] leading-relaxed mt-0.5">
              <p>〒243-0303 神奈川県愛甲郡愛川町中津7287</p>
              <p>TEL : 046-212-2766　FAX : 046-401-1714</p>
            </div>
          </div>

          {/* Right: SNS + links */}
          <div className="flex flex-col items-start md:items-end gap-2">
            {/* SNS icons */}
            <div className="flex items-center gap-3 md:gap-4">
              <a href="https://www.tiktok.com/@ikenoyashoji?_r=1&_t=ZS-96b4mWRIJ2j" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-white/80 hover:text-white transition-colors">
                <svg className="w-5 h-5 md:w-[27px] md:h-[27px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/ikenoyashoji?igsh=MXhmY2FoczV5cWdyNA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/80 hover:text-white transition-colors">
                <svg className="w-5 h-5 md:w-[27px] md:h-[27px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="https://www.threads.com/@ikenoyashoji?igshid=NTc4MTIwNjQ2YQ==" target="_blank" rel="noopener noreferrer" aria-label="Threads" className="text-white/80 hover:text-white transition-colors">
                <svg className="w-5 h-5 md:w-[27px] md:h-[27px]" fill="currentColor" viewBox="0 0 192 192">
                  <path d="M141.537 88.988a66.667 66.667 0 00-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.941c22.975.17 40.526 7.52 52.171 21.848 5.71 7.025 9.98 15.86 12.737 26.219l16.146-4.32c-3.34-12.687-8.79-23.644-16.291-32.708C147.397 9.781 125.44.235 97.07 0h-.113C68.685.235 46.93 9.817 32.887 28.113 20.596 44.223 14.258 67.112 14.05 96v.072c.208 28.96 6.547 51.838 18.844 67.903C46.93 182.173 68.685 191.765 96.957 192h.113c25.04-.173 42.6-6.731 57.032-21.157 18.958-18.945 18.392-42.692 12.142-57.27-4.484-10.454-13.033-18.944-24.707-24.585z"/>
                  <path d="M96.834 128.756c-10.633 0-17.799-4.974-18.252-12.606-.261-4.39 1.755-8.128 5.647-10.56 3.866-2.416 9.129-3.621 15.575-3.24 7.225.418 14.12 1.755 20.52 3.972-2.351 14.05-11.52 22.434-23.49 22.434z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/share/1EkFdmmTto/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/80 hover:text-white transition-colors">
                <svg className="w-5 h-5 md:w-[27px] md:h-[27px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
            </div>

            {/* Links */}
            <div className="flex items-center gap-3 text-[11px] md:text-[13px] text-gray-300">
              <Link href="/privacy" className="hover:text-white transition-colors">個人情報保護方針</Link>
              <span className="text-gray-500">／</span>
              <Link href="/sitemap" className="hover:text-white transition-colors">サイトマップ</Link>
            </div>
          </div>
        </div>

        {/* Copyright — full width, centered */}
        <p className="text-gray-400 text-[10px] md:text-[13px] tracking-wide text-center w-full mt-3">
          © 2023 株式会社 池ノ谷商事. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
