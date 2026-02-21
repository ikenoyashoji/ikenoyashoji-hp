import { useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CtaBanner } from "@/components/cta-banner";
import { trackPageView } from "@/lib/analytics";
import { CheckCircle, MapPin, Phone, Mail, Clock } from "lucide-react";

const companyInfo = [
  { label: "会社名", value: "アクロス物流株式会社" },
  { label: "英語表記", value: "ACROSS LOGISTICS CO., LTD." },
  { label: "設立", value: "2009年（平成21年）4月" },
  { label: "資本金", value: "3,000万円" },
  { label: "代表取締役", value: "山田 太郎" },
  { label: "本社所在地", value: "〒135-0001 東京都江東区東陽1-1-1 東陽ビル3F" },
  { label: "TEL", value: "03-1234-5678" },
  { label: "FAX", value: "03-1234-5679" },
  { label: "Email", value: "info@across-logistics.co.jp" },
  { label: "営業時間", value: "24時間・365日対応（事務：平日9:00〜18:00）" },
  { label: "事業内容", value: "一般貨物自動車運送事業、貨物利用運送事業、貨物軽自動車運送事業" },
  { label: "許可番号", value: "関東運輸局 第○○○○○号" },
  { label: "車両台数", value: "自社50台 + 提携100台以上" },
  { label: "従業員数", value: "約120名（パート・アルバイト含む）" },
  { label: "加盟団体", value: "公益社団法人 全日本トラック協会、東京都トラック協会" },
];

const philosophy = [
  { title: "誠実", desc: "お客様・パートナー・社員に対して、常に誠実であることを第一とします。" },
  { title: "安全", desc: "全ての業務において安全を最優先に。事故ゼロの実現に向けて取り組みます。" },
  { title: "革新", desc: "物流の常識を変えるべく、テクノロジーと現場力を融合させ続けます。" },
];

export default function Company() {
  useEffect(() => {
    trackPageView("/company");
    document.title = "会社情報｜アクロス物流株式会社";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="pt-16 bg-[#0f2044]">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <span className="text-amber-400 font-semibold text-sm tracking-widest">COMPANY</span>
          <h1 className="text-3xl md:text-4xl font-black text-white mt-2">会社情報</h1>
          <p className="text-blue-200 mt-3 text-sm">アクロス物流株式会社について</p>
        </div>
      </section>

      {/* Representative message */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-4xl mx-auto">
          <span className="text-amber-500 font-semibold text-sm tracking-widest">MESSAGE</span>
          <h2 className="text-3xl font-black text-[#0f2044] mt-2 mb-8">代表メッセージ</h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#0f2044] to-[#1a3a7a] flex items-center justify-center">
                <span className="text-white text-4xl font-black">山</span>
              </div>
              <div className="text-center mt-2">
                <div className="font-bold text-[#0f2044] text-sm">山田 太郎</div>
                <div className="text-muted-foreground text-xs">代表取締役</div>
              </div>
            </div>
            <div className="flex-1">
              <blockquote className="text-muted-foreground leading-relaxed space-y-4 text-sm">
                <p>
                  私たちアクロス物流は、「物流で日本を支える」という理念のもと、2009年の創業以来、
                  一貫して荷主様・ドライバー・社会の三者にとって価値ある物流会社を目指してまいりました。
                </p>
                <p>
                  近年の物流業界は、ドライバー不足・燃料高騰・2024年問題など、様々な課題に直面しています。
                  しかし私たちはこれを危機ではなく、物流を根本から変えるチャンスととらえ、
                  デジタル化・効率化・パートナーシップ強化に積極的に投資してきました。
                </p>
                <p>
                  お客様の「困った」を「解決した」に変える。それが私たちアクロス物流の存在意義です。
                  これからも現場力と誠実さを武器に、皆様の物流を全力でサポートしてまいります。
                </p>
                <footer className="text-[#0f2044] font-semibold">アクロス物流株式会社 代表取締役 山田 太郎</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-4xl mx-auto">
          <span className="text-amber-500 font-semibold text-sm tracking-widest">PHILOSOPHY</span>
          <h2 className="text-3xl font-black text-[#0f2044] mt-2 mb-8">企業理念</h2>
          <div className="bg-gradient-to-r from-[#0f2044] to-[#1a3a7a] rounded-xl p-8 mb-8 text-center">
            <p className="text-2xl md:text-3xl font-black text-white mb-2">"物流で、社会をつなぐ。"</p>
            <p className="text-blue-200 text-sm">CONNECTING SOCIETY THROUGH LOGISTICS</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {philosophy.map((p) => (
              <div key={p.title} className="bg-white rounded-lg border border-card-border p-6 hover-elevate">
                <div className="text-amber-500 font-black text-2xl mb-2">{p.title}</div>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company info */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-4xl mx-auto">
          <span className="text-amber-500 font-semibold text-sm tracking-widest">OVERVIEW</span>
          <h2 className="text-3xl font-black text-[#0f2044] mt-2 mb-8">会社概要</h2>
          <div className="border border-card-border rounded-lg overflow-hidden">
            {companyInfo.map((item, i) => (
              <div key={item.label} className={`flex ${i % 2 === 0 ? "bg-slate-50" : "bg-white"}`}>
                <div className="w-40 md:w-48 flex-shrink-0 px-4 py-3 font-semibold text-sm text-[#0f2044] border-r border-card-border bg-slate-100">
                  {item.label}
                </div>
                <div className="px-4 py-3 text-sm text-muted-foreground flex-1">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-slate-50 px-4">
        <div className="max-w-4xl mx-auto">
          <span className="text-amber-500 font-semibold text-sm tracking-widest">CERTIFICATIONS</span>
          <h2 className="text-3xl font-black text-[#0f2044] mt-2 mb-8">認証・取組み</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Gマーク認証取得", desc: "国土交通省認定の安全優良事業所として認定を受けています。" },
              { title: "ISO 9001認証", desc: "品質マネジメントシステムの国際規格を取得し、品質向上に取り組んでいます。" },
              { title: "グリーン経営認証", desc: "環境負荷低減に取り組むグリーン経営認証を取得しています。" },
              { title: "働きやすい職場認証", desc: "ドライバーが働きやすい環境づくりに取り組み、認証を取得しています。" },
            ].map((c) => (
              <div key={c.title} className="bg-white border border-card-border rounded-lg p-4 flex gap-3">
                <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#0f2044] text-sm mb-1">{c.title}</div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Access */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-4xl mx-auto">
          <span className="text-amber-500 font-semibold text-sm tracking-widest">ACCESS</span>
          <h2 className="text-3xl font-black text-[#0f2044] mt-2 mb-8">アクセス</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#0f2044] text-sm mb-1">本社</div>
                  <p className="text-muted-foreground text-sm">〒135-0001<br />東京都江東区東陽1-1-1 東陽ビル3F</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#0f2044] text-sm mb-1">電話番号</div>
                  <p className="text-muted-foreground text-sm">03-1234-5678（24時間対応）</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#0f2044] text-sm mb-1">アクセス方法</div>
                  <p className="text-muted-foreground text-sm">東京メトロ東西線「東陽町駅」より徒歩5分</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-100 rounded-lg flex items-center justify-center min-h-[200px] border border-card-border">
              <div className="text-center text-muted-foreground text-sm">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p>地図（Googleマップ等を<br />環境変数で設定後に表示）</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
      <Footer />
    </div>
  );
}
