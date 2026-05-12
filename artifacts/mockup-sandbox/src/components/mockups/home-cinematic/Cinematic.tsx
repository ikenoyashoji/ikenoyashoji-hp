import React, { useEffect, useRef, useState } from 'react';
import { Truck, Package, Factory, ChevronRight, ArrowRight } from 'lucide-react';

export function Cinematic() {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: '創業', value: 15, suffix: '年' },
    { label: '車両', value: 50, suffix: '台' },
    { label: '対応エリア', value: 7, suffix: '都県' }
  ];

  const services = [
    {
      title: '一般貨物輸送',
      desc: '安全・確実・迅速な輸送サービス。お客様のニーズに合わせた最適な車両を手配いたします。',
      icon: <Truck className="w-8 h-8 text-[#1d4ed8]" />
    },
    {
      title: '構内作業',
      desc: '倉庫内でのピッキング、梱包、検品など。物流拠点の効率化をサポートします。',
      icon: <Package className="w-8 h-8 text-[#1d4ed8]" />
    },
    {
      title: '産業廃棄物収集運搬',
      desc: '環境に配慮した適切な処理。法令を遵守し、安全に収集・運搬を行います。',
      icon: <Factory className="w-8 h-8 text-[#1d4ed8]" />
    }
  ];

  const news = [
    { date: '2026.02.15', category: 'NEWS', title: '新規車両を10台導入いたしました' },
    { date: '2026.01.20', category: 'RECRUIT', title: '2026年度新卒採用のエントリー受付を開始しました' },
    { date: '2025.12.01', category: 'COMPANY', title: '年末年始の営業に関するお知らせ' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#1d4ed8] selection:text-white">
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        .circular-text {
          font-family: monospace;
          font-size: 14px;
          letter-spacing: 0.15em;
        }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-difference">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white flex items-center justify-center text-black font-bold text-sm">池</div>
          <span className="text-xl font-bold tracking-widest text-white">株式会社池ノ谷商事</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wider text-white">
          <a href="#" className="hover:text-gray-300 transition-colors">COMPANY</a>
          <a href="#" className="hover:text-gray-300 transition-colors">SERVICE</a>
          <a href="#" className="hover:text-gray-300 transition-colors">RECRUIT</a>
          <a href="#" className="hover:text-gray-300 transition-colors">CONTACT</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-start px-8 md:px-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] z-10" />
          <img 
            src="/__mockup/images/hero-cinematic.png" 
            alt="Truck on highway" 
            className="w-full h-full object-cover scale-105 opacity-60"
          />
        </div>

        <div className="relative z-20 max-w-4xl pt-20">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            運ぶのは、信頼。<br />
            支えるのは、現場力。
          </h1>
          <p className="text-lg md:text-xl text-gray-300 tracking-widest animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            物流の未来を切り拓く、確かな品質と機動力。
          </p>
        </div>

        {/* Rotating Badge */}
        <div className="absolute bottom-12 right-12 md:bottom-24 md:right-24 z-20">
          <div className="relative w-32 h-32 md:w-40 md:w-40 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-white/20 animate-spin-slow" />
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-spin-slow">
              <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
              <text className="circular-text fill-white/80">
                <textPath href="#circlePath" startOffset="0%">
                  DRIVEN BY TRUST • DRIVEN BY TRUST • 
                </textPath>
              </text>
            </svg>
            <ArrowRight className="w-6 h-6 text-white/80" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 px-8 md:px-24 relative z-20">
        <div 
          id="services" 
          className={`animate-on-scroll max-w-7xl mx-auto transition-all duration-1000 transform ${
            isVisible['services'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-wider mb-2">SERVICE</h2>
              <p className="text-[#1d4ed8] font-medium tracking-widest">事業内容</p>
            </div>
            <p className="text-gray-400 max-w-xl text-sm md:text-base leading-relaxed">
              神奈川県を拠点に、一般貨物輸送から構内作業まで、物流全般をサポート。長年の経験と実績に基づき、お客様の多様なニーズに柔軟にお応えします。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div 
                key={idx} 
                className="group border border-white/10 bg-white/5 p-8 hover:bg-white/10 hover:border-[#1d4ed8]/50 transition-all duration-500 flex flex-col"
              >
                <div className="mb-8">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-4 tracking-wider">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed flex-grow">{service.desc}</p>
                <div className="mt-8 flex items-center text-sm font-medium text-[#1d4ed8] group-hover:text-blue-400 transition-colors">
                  VIEW MORE <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-white/10 bg-gradient-to-r from-[#0a0a0a] via-[#1a4b99]/10 to-[#0a0a0a]">
        <div 
          id="stats" 
          className={`animate-on-scroll max-w-7xl mx-auto px-8 md:px-24 transition-all duration-1000 transform ${
            isVisible['stats'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            {stats.map((stat, idx) => (
              <div key={idx} className="pt-8 md:pt-0 flex flex-col items-center justify-center">
                <p className="text-gray-400 font-medium tracking-widest mb-4">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
                    {stat.value}
                  </span>
                  <span className="text-2xl font-bold text-gray-500">{stat.suffix}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-32 px-8 md:px-24">
        <div 
          id="news" 
          className={`animate-on-scroll max-w-5xl mx-auto transition-all duration-1000 transform ${
            isVisible['news'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="flex flex-col md:flex-row gap-16">
            <div className="md:w-1/3">
              <h2 className="text-4xl md:text-5xl font-bold tracking-wider mb-2">NEWS</h2>
              <p className="text-[#1d4ed8] font-medium tracking-widest mb-8">お知らせ</p>
              <button className="flex items-center gap-2 text-sm font-medium hover:text-[#1d4ed8] transition-colors">
                VIEW ALL <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="md:w-2/3 flex flex-col gap-6">
              {news.map((item, idx) => (
                <div 
                  key={idx} 
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 py-6 border-b border-white/10 hover:border-white/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <span className="text-sm text-gray-400 font-mono">{item.date}</span>
                    <span className="text-xs px-3 py-1 bg-white/10 text-white rounded-full tracking-wider group-hover:bg-[#1d4ed8] group-hover:text-white transition-colors">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-base text-gray-200 group-hover:text-white transition-colors">{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recruitment CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[#1a4b99]/20" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        
        <div 
          id="recruit" 
          className={`animate-on-scroll relative z-10 max-w-4xl mx-auto px-8 text-center transition-all duration-1000 transform ${
            isVisible['recruit'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">共に物流の未来を。</h2>
          <p className="text-gray-300 text-lg mb-12 tracking-widest">
            池ノ谷商事では、新しい力を求めています。<br className="hidden md:block" />
            経験を活かしたい方、未経験から挑戦したい方、ご応募をお待ちしております。
          </p>
          <button className="bg-[#1d4ed8] hover:bg-blue-600 text-white px-12 py-5 rounded-none font-bold tracking-widest flex items-center gap-4 mx-auto transition-all hover:pr-8 hover:pl-16 group">
            RECRUIT ENTRY
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16 px-8 md:px-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-0">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white flex items-center justify-center text-black font-bold">池</div>
              <span className="text-2xl font-bold tracking-widest text-white">株式会社池ノ谷商事</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              〒252-0000 神奈川県<br />
              TEL: 046-000-0000 / FAX: 046-000-0000
            </p>
          </div>
          
          <div className="flex gap-16">
            <div className="flex flex-col gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">HOME</a>
              <a href="#" className="hover:text-white transition-colors">COMPANY</a>
              <a href="#" className="hover:text-white transition-colors">SERVICE</a>
            </div>
            <div className="flex flex-col gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">NEWS</a>
              <a href="#" className="hover:text-white transition-colors">RECRUIT</a>
              <a href="#" className="hover:text-white transition-colors">CONTACT</a>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs tracking-widest">
            &copy; {new Date().getFullYear()} Ikenoya Shoji Co., Ltd. All Rights Reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors">プライバシーポリシー</a>
            <a href="#" className="hover:text-gray-400 transition-colors">サイトマップ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
