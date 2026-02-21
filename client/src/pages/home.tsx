import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CtaBanner } from "@/components/cta-banner";
import { trackPageView, trackEvent } from "@/lib/analytics";
import {
  Truck, Clock, Shield, MapPin, ArrowRight, CheckCircle, Star,
  Package, Calendar, Zap, Globe, ChevronRight, Award, Users, TrendingUp
} from "lucide-react";

const services = [
  { icon: Calendar, title: "定期輸送", desc: "決まったルートを定期運行。安定した供給体制で荷主様のビジネスを支えます。" },
  { icon: Zap, title: "スポット輸送", desc: "急な輸送ニーズにも即対応。当日・翌日配送も承ります。" },
  { icon: Truck, title: "チャーター便", desc: "専用車両での貸切輸送。大量荷物や機密性の高い輸送に最適です。" },
  { icon: Globe, title: "幹線輸送", desc: "長距離・大量輸送に対応。全国の主要都市間を結ぶ幹線ネットワーク。" },
  { icon: ArrowRight, title: "中継輸送", desc: "中継地点を設けた効率的な長距離輸送。コスト削減と安全性を両立。" },
  { icon: Package, title: "特殊輸送", desc: "精密機器・危険物・大型貨物など、特殊な要件にも対応可能です。" },
];

const strengths = [
  { icon: Clock, title: "24時間365日対応", desc: "緊急輸送にも即座に対応。深夜・早朝・休日を問わず、常に稼働中のオペレーションチームが対応します。", color: "bg-blue-600" },
  { icon: Shield, title: "安心の品質管理", desc: "GPS リアルタイム追跡で荷物の状況を常に把握。温度管理・防振対応車両も完備しています。", color: "bg-amber-500" },
  { icon: MapPin, title: "広域カバーネットワーク", desc: "関東一都六県を中心に全国対応。協力会社ネットワークを活かして日本全国どこへでも。", color: "bg-green-600" },
];

const stats = [
  { value: "15", unit: "年", label: "創業からの実績" },
  { value: "150+", unit: "台", label: "自社・提携車両数" },
  { value: "98", unit: "%", label: "顧客満足度" },
  { value: "24", unit: "時間", label: "365日対応" },
];

const faqs = [
  { q: "急な輸送依頼にも対応できますか？", a: "はい、24時間365日体制で対応しております。当日のご依頼でも、空き車両がある場合は即対応いたします。まずはお電話またはフォームでご相談ください。" },
  { q: "どのような荷物でも対応できますか？", a: "一般貨物から精密機器、危険物（要確認）、大型貨物まで幅広く対応しております。特殊な荷物については事前にお打ち合わせの上、最適な輸送方法をご提案します。" },
  { q: "料金体系はどのようになっていますか？", a: "距離・荷物の大きさ・重量・時間帯・車両種別によって料金が異なります。定期契約では大幅なコストダウンも可能です。まずは無料見積もりをご依頼ください。" },
  { q: "対応エリアを教えてください。", a: "関東一都六県（東京・神奈川・千葉・埼玉・茨城・栃木・群馬）を主な営業エリアとしており、全国の幹線輸送も対応しております。ご不明な場合はお気軽にお問い合わせください。" },
  { q: "見積もりはどのくらいの時間で出てもらえますか？", a: "お問い合わせいただいた後、通常30分以内にお見積もりをご提示しております。複雑な案件でも最大2時間以内を目標にしています。" },
  { q: "定期輸送の最低契約期間はありますか？", a: "最低契約期間は3ヶ月からとなっています。ただし、まずはスポット利用でお試しいただき、そのまま定期契約に移行されるお客様も多くいらっしゃいます。" },
];

const cases = [
  { industry: "食品メーカー", title: "定期輸送で物流コスト25%削減", desc: "週3便のスポット輸送から定期契約に切り替えることで、年間物流コストを25%削減。配送時間の安定化も実現しました。", badge: "荷主事例" },
  { industry: "EC企業", title: "急増した注文に24時間対応で売上アップ", desc: "季節の繁忙期における急な増便依頼にも柔軟に対応。顧客への納期遅延ゼロを維持し、リピート率向上に貢献しました。", badge: "荷主事例" },
  { industry: "建設会社", title: "大型資材の特殊輸送を安全に実現", desc: "通常の車両では対応できない大型建設資材の輸送を、特殊車両と専門チームで安全に実現。工期遅延を防ぎました。", badge: "特殊輸送" },
];

export default function Home() {
  useEffect(() => {
    trackPageView("/");
    document.title = "アクロス物流株式会社｜関東圏の物流・輸送サービス";
  }, []);

  const { data: articles } = useQuery<any[]>({ queryKey: ["/api/articles"] });
  const latestArticles = articles?.slice(0, 3) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 bg-[#0f2044] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f2044] via-[#1a3a7a] to-[#0d1b3e] opacity-95" />
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(245,158,11,0.08) 0%, transparent 40%)"
          }} />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
            backgroundSize: "30px 30px"
          }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-6">
            <Star className="w-3.5 h-3.5" />
            関東圏No.1を目指す物流パートナー
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            物流のすべてを、<br />
            <span className="text-amber-400">あなたのそばに。</span>
          </h1>

          <p className="text-xl sm:text-2xl text-blue-200 mb-4 font-light">
            スピード・品質・安心のワンストップ物流サービス
          </p>
          <p className="text-blue-300 text-base mb-10 max-w-2xl mx-auto">
            創業15年の実績と150台以上の車両ネットワークで、あらゆる物流ニーズに対応。
            関東圏を中心に全国の荷主様の物流課題を解決します。
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link href="/contact?type=shipper">
              <Button
                size="lg"
                className="bg-amber-500 text-white font-black border-amber-400 text-lg px-10 py-4"
                onClick={() => trackEvent("cta_quote_click", { location: "hero" })}
                data-testid="button-hero-quote"
              >
                無料で見積もりを依頼する
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white bg-transparent text-lg px-10 py-4"
                onClick={() => trackEvent("cta_contact_click", { location: "hero" })}
                data-testid="button-hero-contact"
              >
                お問い合わせ
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-blue-300">
            {["24時間365日対応", "最短当日出発可", "全国エリア対応", "GPS追跡サービス"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-blue-400">
          <span className="text-xs tracking-widest">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-blue-400 to-transparent" />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#1a3a7a] py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black text-white">{s.value}</span>
                  <span className="text-amber-400 font-bold">{s.unit}</span>
                </div>
                <div className="text-blue-300 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-500 font-semibold text-sm tracking-widest">OUR STRENGTHS</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0f2044] mt-2">選ばれる3つの理由</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">現場力と対応力で、お客様の物流課題を根本から解決します。</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {strengths.map((s, i) => (
              <Card key={s.title} className="border-card-border hover-elevate transition-shadow">
                <CardContent className="p-6">
                  <div className={`${s.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-blue-500 text-xs font-bold mb-1">POINT {String(i + 1).padStart(2, "0")}</div>
                  <h3 className="text-xl font-bold text-[#0f2044] mb-3">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-slate-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-500 font-semibold text-sm tracking-widest">SERVICES</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0f2044] mt-2">輸送サービス一覧</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">多様なニーズに対応する充実のサービスラインナップ</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <div key={s.title} className="bg-white rounded-lg border border-card-border p-5 hover-elevate flex items-start gap-4">
                <div className="bg-[#0f2044] rounded-lg p-2.5 flex-shrink-0">
                  <s.icon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0f2044] mb-1">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/contact?type=shipper">
              <Button
                className="bg-amber-500 text-white border-amber-400 font-bold"
                onClick={() => trackEvent("cta_quote_click", { location: "services" })}
                data-testid="button-services-quote"
              >
                サービスについて相談する
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-amber-500 font-semibold text-sm tracking-widest">COVERAGE AREA</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#0f2044] mt-2 mb-6">対応エリア</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                関東一都六県を主な営業エリアとし、協力会社ネットワークを活用して全国対応が可能です。
              </p>
              <div className="mb-6">
                <h3 className="font-bold text-[#0f2044] mb-3 flex items-center gap-2">
                  <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded">メイン</span>
                  関東一都六県（直営）
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["東京都", "神奈川県", "千葉県", "埼玉県", "茨城県", "栃木県", "群馬県"].map((p) => (
                    <span key={p} className="bg-blue-50 border border-blue-200 text-[#0f2044] text-sm px-3 py-1 rounded-full">{p}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-[#0f2044] mb-3 flex items-center gap-2">
                  <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded">対応可</span>
                  全国幹線輸送（提携ネットワーク）
                </h3>
                <p className="text-muted-foreground text-sm">東北・中部・近畿・中国・九州など全国主要都市間の幹線輸送に対応しています。詳細はご相談ください。</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#0f2044] to-[#1a3a7a] rounded-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6 text-amber-300">対応可能な車両種別</h3>
              <div className="space-y-3">
                {[
                  { type: "軽バン・軽トラック", capacity: "〜300kg" },
                  { type: "2t トラック", capacity: "〜2,000kg" },
                  { type: "4t トラック", capacity: "〜4,000kg" },
                  { type: "10t トラック", capacity: "〜10,000kg" },
                  { type: "大型・重機運搬", capacity: "要相談" },
                  { type: "冷凍・冷蔵車", capacity: "温度管理対応" },
                ].map((v) => (
                  <div key={v.type} className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-amber-400" />
                      <span className="text-sm">{v.type}</span>
                    </div>
                    <span className="text-blue-300 text-xs">{v.capacity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cases */}
      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-500 font-semibold text-sm tracking-widest">CASE STUDIES</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0f2044] mt-2">導入事例・お客様の声</h2>
            <p className="text-muted-foreground mt-3">様々な業種のお客様に信頼いただいています</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {cases.map((c) => (
              <Card key={c.title} className="border-card-border hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="text-xs">{c.badge}</Badge>
                    <span className="text-muted-foreground text-xs">{c.industry}</span>
                  </div>
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <h3 className="font-bold text-[#0f2044] mb-2">{c.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      {latestArticles.length > 0 && (
        <section className="py-20 bg-white px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-amber-500 font-semibold text-sm tracking-widest">BLOG</span>
                <h2 className="text-3xl md:text-4xl font-black text-[#0f2044] mt-2">最新ブログ記事</h2>
              </div>
              <Link href="/blog" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                すべて見る <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles.map((a: any) => (
                <Link key={a.id} href={`/blog/${a.slug}`}>
                  <Card className="border-card-border hover-elevate h-full">
                    <CardContent className="p-5">
                      <div className="flex gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">{a.category}</Badge>
                      </div>
                      <h3 className="font-bold text-[#0f2044] mb-2 line-clamp-2 text-sm">{a.title}</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">{a.excerpt}</p>
                      <div className="mt-3 text-blue-500 text-xs flex items-center gap-1">
                        続きを読む <ChevronRight className="w-3 h-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-500 font-semibold text-sm tracking-widest">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0f2044] mt-2">よくあるご質問</h2>
            <p className="text-muted-foreground mt-3">荷主様からよくいただくご質問にお答えします</p>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-white border border-card-border rounded-lg px-5" data-testid={`faq-item-${i}`}>
                <AccordionTrigger className="text-[#0f2044] font-semibold text-sm text-left py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CtaBanner />
      <Footer />
    </div>
  );
}
