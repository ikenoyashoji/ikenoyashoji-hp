import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronRight, Truck, Package, Recycle, Mail } from 'lucide-react';

const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return { ref, isVisible };
};

const FadeInSection = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export const Premium = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans" style={{ fontFamily: '"Noto Sans JP", sans-serif' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-between px-8 border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1a4b99] rounded-sm flex items-center justify-center">
            <span className="text-white font-bold text-lg leading-none">I</span>
          </div>
          <span className="text-xl font-bold text-[#1a4b99] tracking-wider">池ノ谷商事</span>
        </div>
        
        <div className="flex items-center">
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-gray-600 mr-8">
            <a href="#" className="hover:text-[#1d4ed8] transition-colors">HOME</a>
            <span className="text-gray-300">/</span>
            <a href="#" className="hover:text-[#1d4ed8] transition-colors">サービス紹介</a>
            <span className="text-gray-300">/</span>
            <a href="#" className="hover:text-[#1d4ed8] transition-colors">企業情報</a>
            <span className="text-gray-300">/</span>
            <a href="#" className="hover:text-[#1d4ed8] transition-colors">採用情報</a>
            <span className="text-gray-300">/</span>
            <a href="#" className="hover:text-[#1d4ed8] transition-colors">お知らせ</a>
          </nav>
          
          <button className="bg-[#1d4ed8] hover:bg-[#1a4b99] text-white px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-colors">
            <Mail size={16} />
            お問い合わせ
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 min-h-[90vh] flex flex-col lg:flex-row">
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-16 lg:py-0 bg-gray-50">
          <h2 className="text-4xl lg:text-6xl font-bold leading-tight mb-6 text-[#1a4b99]">
            運ぶのは、信頼。<br />
            支えるのは、現場力。
          </h2>
          <p className="text-gray-600 text-lg mb-10 leading-relaxed max-w-xl">
            神奈川県を拠点に、物流のあらゆるニーズに柔軟に応える。<br />
            安全と確実を第一に、お客様のビジネスを強力にサポートいたします。
          </p>
          <div>
            <button className="bg-[#1a4b99] hover:bg-[#1d4ed8] text-white px-8 py-4 rounded-full text-lg font-bold flex items-center gap-3 transition-all group shadow-lg shadow-blue-900/20">
              サービスを見る
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        <div className="flex-1 relative min-h-[50vh] lg:min-h-full">
          <img 
            src="/__mockup/images/truck-hero.png" 
            alt="Ikenoya Logistics" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-8 lg:px-24 bg-white">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-[#1a4b99] tracking-widest mb-2">SERVICE</h2>
          <div className="text-sm font-bold text-gray-500 mb-4">サービス紹介</div>
          <div className="w-12 h-1 bg-[#1d4ed8] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FadeInSection delay={0}>
            <div className="bg-white p-10 shadow-xl shadow-gray-200/50 rounded-lg border-t-4 border-[#1d4ed8] h-full transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <Truck className="text-[#1d4ed8]" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1a4b99]">一般貨物輸送</h3>
              <p className="text-gray-600 leading-relaxed">
                安全かつ迅速な輸配送ネットワークで、お客様の多様なニーズに合わせた最適な輸送サービスを提供します。
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={200}>
            <div className="bg-white p-10 shadow-xl shadow-gray-200/50 rounded-lg border-t-4 border-[#1d4ed8] h-full transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <Package className="text-[#1d4ed8]" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1a4b99]">構内作業</h3>
              <p className="text-gray-600 leading-relaxed">
                倉庫内での荷役・仕分け・梱包など、物流センター運営に関わるあらゆる作業を効率的かつ正確に遂行します。
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={400}>
            <div className="bg-white p-10 shadow-xl shadow-gray-200/50 rounded-lg border-t-4 border-[#1d4ed8] h-full transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <Recycle className="text-[#1d4ed8]" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1a4b99]">産業廃棄物収集運搬</h3>
              <p className="text-gray-600 leading-relaxed">
                コンプライアンスを遵守し、環境に配慮した適切な産業廃棄物の収集・運搬を行い、持続可能な社会に貢献します。
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Company Snapshot */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 lg:px-24 flex flex-col lg:flex-row gap-0">
          <div className="flex-1 bg-[#1a4b99] text-white p-16 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-8">COMPANY</h2>
            <div className="space-y-6">
              <div>
                <div className="text-blue-200 text-sm mb-1">Company Name</div>
                <div className="text-xl font-medium">株式会社池ノ谷商事</div>
              </div>
              <div className="w-full h-px bg-blue-800"></div>
              <div>
                <div className="text-blue-200 text-sm mb-1">Established</div>
                <div className="text-xl font-medium">2009年</div>
              </div>
              <div className="w-full h-px bg-blue-800"></div>
              <div>
                <div className="text-blue-200 text-sm mb-1">Location</div>
                <div className="text-xl font-medium">神奈川県</div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-white p-16 flex flex-col justify-center border border-gray-100 shadow-xl shadow-gray-200/50">
            <h3 className="text-2xl font-bold text-[#1a4b99] mb-6">物流の力で、地域と未来をつなぐ</h3>
            <p className="text-gray-600 leading-loose mb-8">
              私たちは創業以来、神奈川県を中心に地域に根ざした物流サービスを展開してまいりました。<br /><br />
              刻々と変化する社会情勢のなかで、物流が果たすべき役割はますます重要になっています。私たちは「現場力」を最大の武器とし、いかなる時もお客様の信頼に応え続けるプロフェッショナル集団であり続けます。
            </p>
            <div>
              <a href="#" className="inline-flex items-center text-[#1d4ed8] font-bold hover:underline">
                会社概要を詳しく見る <ChevronRight size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TOPICS / News */}
      <section className="py-24 px-8 lg:px-24 bg-white">
        <FadeInSection>
          <div className="max-w-4xl mx-auto">
            <div className="mb-12 flex items-baseline gap-4 border-b-2 border-[#1a4b99] pb-4">
              <h2 className="text-3xl font-bold text-[#1a4b99] tracking-widest">TOPICS</h2>
              <span className="text-sm font-bold text-gray-500">最新トピックス</span>
            </div>

            <div className="divide-y divide-gray-200">
              {[
                { date: '2024.03.15', category: 'お知らせ', text: '新規事業所開設のお知らせ' },
                { date: '2024.02.20', category: '採用情報', text: '2025年度新卒採用のエントリー受付を開始しました' },
                { date: '2024.01.05', category: 'お知らせ', text: '新年のご挨拶' },
              ].map((item, i) => (
                <a href="#" key={i} className="py-6 flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <time className="text-gray-500 font-medium">{item.date}</time>
                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-sm">{item.category}</span>
                  </div>
                  <p className="text-gray-800 font-medium group-hover:text-[#1d4ed8] transition-colors">{item.text}</p>
                </a>
              ))}
            </div>

            <div className="mt-10 text-center">
              <a href="#" className="inline-flex items-center justify-center border border-gray-300 text-gray-600 px-8 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium">
                一覧を見る
              </a>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Recruit */}
      <section className="py-24 px-8 lg:px-24 bg-[#1a4b99] text-white text-center">
        <FadeInSection>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">RECRUIT</h2>
          <p className="text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            共に成長し、日本の物流を支える仲間を募集しています。<br />
            あなたの「現場力」を、当社のフィールドで発揮してみませんか？
          </p>
          <button className="border-2 border-white hover:bg-white hover:text-[#1a4b99] px-10 py-4 rounded-full text-lg font-bold transition-colors">
            採用情報はこちら
          </button>
        </FadeInSection>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f2c5e] text-blue-100 py-16 px-8 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                <span className="text-[#0f2c5e] font-bold text-lg leading-none">I</span>
              </div>
              <span className="text-xl font-bold text-white tracking-wider">株式会社池ノ谷商事</span>
            </div>
            <p className="text-sm leading-relaxed opacity-80">
              〒252-0000<br />
              神奈川県〇〇市〇〇町1-2-3<br />
              TEL: 046-000-0000
            </p>
          </div>
          
          <div className="flex gap-16">
            <div className="flex flex-col gap-3">
              <a href="#" className="text-sm hover:text-white transition-colors">HOME</a>
              <a href="#" className="text-sm hover:text-white transition-colors">サービス紹介</a>
              <a href="#" className="text-sm hover:text-white transition-colors">企業情報</a>
            </div>
            <div className="flex flex-col gap-3">
              <a href="#" className="text-sm hover:text-white transition-colors">採用情報</a>
              <a href="#" className="text-sm hover:text-white transition-colors">お知らせ</a>
              <a href="#" className="text-sm hover:text-white transition-colors">お問い合わせ</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-blue-900/50 text-center text-xs opacity-60">
          &copy; {new Date().getFullYear()} Ikenoya Shoji Co., Ltd. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};