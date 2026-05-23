import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { trackPageView } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import { Calendar, ChevronRight, Share2, Tag, ArrowLeft, List } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [tocOpen, setTocOpen] = useState(false);

  const { data: article, isLoading, error } = useQuery<any>({
    queryKey: ["/api/articles", slug],
    queryFn: async () => {
      const res = await fetch(`/api/articles/${slug}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
  });

  useEffect(() => {
    if (article) {
      trackPageView(`/blog/${slug}`);
      setSeo({
        title: article.title,
        description: article.metaDescription || `${article.title} - 株式会社池ノ谷商事の物流コラム・お知らせです。`,
        path: `/blog/${slug}`,
      });
    }
  }, [article, slug]);

  const { data: allArticles } = useQuery<any[]>({ queryKey: ["/api/articles"] });
  const related = (allArticles || []).filter((a) => a.slug !== slug && a.category === article?.category).slice(0, 3);

  const faqData = (() => {
    try { return JSON.parse(article?.faqData || "[]"); } catch { return []; }
  })();

  const extractHeadings = (html: string) => {
    const matches = [...html.matchAll(/<h([23])[^>]*>(.*?)<\/h[23]>/gi)];
    return matches.map((m) => ({
      level: parseInt(m[1]),
      text: m[2].replace(/<[^>]+>/g, ""),
      id: m[2].replace(/<[^>]+>/g, "").replace(/[^a-zA-Z0-9ぁ-ん一-龯ー\s]/g, "").replace(/\s+/g, "-"),
    }));
  };

  const headings = article ? extractHeadings(article.content) : [];

  const share = (platform: string) => {
    const url = window.location.href;
    const title = article?.title || "";
    if (platform === "twitter") window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
    if (platform === "facebook") window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    if (platform === "line") window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`);
    if (platform === "hatena") window.open(`https://b.hatena.ne.jp/add?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`);
    if (platform === "pocket") window.open(`https://getpocket.com/save?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`);
    if (platform === "copy") { navigator.clipboard.writeText(url); }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 mt-[100px] py-12 px-8">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 mt-[100px] flex items-center justify-center">
          <div className="text-center py-20">
            <p className="text-gray-200 text-8xl font-light tracking-widest mb-4">404</p>
            <p className="text-gray-400 text-sm mb-6">記事が見つかりませんでした</p>
            <Link href="/blog" className="border border-gray-300 text-gray-600 hover:border-[#1d4ed8] hover:text-[#1d4ed8] px-6 py-2 text-sm transition-colors inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> ブログ一覧へ
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 mt-[100px]">
        {/* Article hero */}
        <div className="relative">
          {article.imageUrl ? (
            <img src={article.imageUrl} alt="" className="w-full block" />
          ) : (
            <div className="h-52 bg-[#0f2044]" />
          )}
          <div className="absolute inset-0 bg-[#0f2044]/75 flex items-center px-8">
            <div className="max-w-3xl w-full mx-auto">
              <Link href="/blog" className="text-gray-400 text-xs flex items-center gap-1 mb-6 hover:text-white transition-colors tracking-widest">
                <ArrowLeft className="w-3.5 h-3.5" /> お知らせ一覧
              </Link>
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-white/10 text-white text-[10px] px-3 py-1 tracking-widest">{article.category}</span>
                {article.tags?.map((t: string) => (
                  <span key={t} className="flex items-center gap-1 text-gray-400 text-[10px] tracking-widest">
                    <Tag className="w-3 h-3" />{t}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl md:text-3xl font-light text-white leading-snug tracking-wide mb-5">{article.title}</h1>
              <div className="flex items-center gap-4 text-gray-400 text-xs tracking-widest">
                {article.publishedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(article.publishedAt), "yyyy年M月d日", { locale: ja })}
                  </span>
                )}
                {article.authorNote && <span>{article.authorNote}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-8 py-12">
          {article.metaDescription && (
            <div className="border-l-4 border-[#1d4ed8] bg-gray-50 p-5 mb-8">
              <p className="text-gray-600 text-sm leading-relaxed">{article.metaDescription}</p>
            </div>
          )}

          {headings.length > 0 && (
            <div className="bg-gray-50 border border-gray-100 p-5 mb-8">
              <button
                className="flex items-center gap-2 text-gray-800 font-medium text-sm w-full"
                onClick={() => setTocOpen(!tocOpen)}
                data-testid="button-toc-toggle"
              >
                <List className="w-4 h-4 text-[#1d4ed8]" />
                目次
                <ChevronRight className={`w-4 h-4 ml-auto transition-transform text-gray-400 ${tocOpen ? "rotate-90" : ""}`} />
              </button>
              {tocOpen && (
                <ol className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                  {headings.map((h, i) => (
                    <li key={i} className={`text-sm ${h.level === 3 ? "pl-4" : ""}`}>
                      <span className="text-[#1a4b99] hover:text-[#1d4ed8] cursor-pointer transition-colors">{h.text}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          <div
            className="prose prose-slate max-w-none prose-headings:text-gray-800 prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-base prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-500 prose-p:leading-relaxed prose-li:text-gray-500 prose-strong:text-gray-800"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {faqData.length > 0 && (
            <div className="mt-12 pt-10 border-t border-gray-100">
              <h2 className="text-xl font-light text-gray-900 tracking-[0.15em] mb-6">よくある質問</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {faqData.map((faq: any, i: number) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-gray-50 border border-gray-100 px-5" data-testid={`faq-article-${i}`}>
                    <AccordionTrigger className="text-gray-800 font-medium text-sm text-left py-4">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-gray-500 text-sm leading-relaxed pb-4">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

        </div>

        {/* CTA — full width */}
        <div className="bg-[#0f2044] py-14 px-8 text-center">
          <p className="text-[#7eb3ff] text-[10px] tracking-[0.5em] mb-3">
            {article.category === "採用情報" ? "RECRUIT" : "CONTACT"}
          </p>
          <h3 className="text-white text-xl font-light tracking-wide mb-3">
            {article.category === "採用情報"
              ? "池ノ谷商事で、一緒に働きませんか？"
              : "物流のことなら、まずご相談ください。"}
          </h3>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            {article.category === "採用情報"
              ? "未経験歓迎・充実した研修制度あり。採用に関するご質問はお気軽にどうぞ。"
              : "輸送依頼・見積もり・物流コンサルティング。どんなご要望もお気軽に。"}
          </p>
          <Link
            href={article.category === "採用情報" ? "/contact?type=recruit" : "/contact?type=shipper"}
            className="inline-block bg-white text-[#0f2044] text-xs font-medium px-8 py-3 hover:bg-[#7eb3ff] hover:text-white transition-colors tracking-widest"
            data-testid="link-article-cta"
          >
            {article.category === "採用情報" ? "採用に応募・相談する" : "お問い合わせ・見積もり依頼"}
          </Link>
          <p className="text-gray-500 text-xs mt-4">TEL: 046-212-2766（平日 9:00〜21:00）</p>
        </div>

        <div className="max-w-3xl mx-auto px-8 pb-12">
          {/* Share */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1 tracking-widest mr-1">
                <Share2 className="w-4 h-4" /> SHARE
              </span>
              <button onClick={() => share("twitter")} className="bg-[#000000] text-white text-xs px-3 py-1.5 hover:opacity-80 transition-opacity" data-testid="button-share-twitter">X</button>
              <button onClick={() => share("facebook")} className="bg-[#1877F2] text-white text-xs px-3 py-1.5 hover:opacity-80 transition-opacity" data-testid="button-share-facebook">Facebook</button>
              <button onClick={() => share("line")} className="bg-[#06C755] text-white text-xs px-3 py-1.5 hover:opacity-80 transition-opacity" data-testid="button-share-line">LINE</button>

              <button onClick={() => share("copy")} className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 hover:bg-gray-200 transition-colors border border-gray-200" data-testid="button-share-copy">URLコピー</button>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-12 pt-10 border-t border-gray-100">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-2">RELATED</p>
              <h2 className="text-xl font-light text-gray-900 tracking-[0.15em] mb-6">関連記事</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((a: any) => (
                  <Link key={a.id} href={`/blog/${a.slug}`}>
                    <div className="border border-gray-100 p-5 hover:border-[#1d4ed8] transition-colors cursor-pointer h-full">
                      <span className="inline-block text-[10px] text-[#1a4b99] bg-[#1a4b99]/10 px-2 py-0.5 mb-3 tracking-widest">{a.category}</span>
                      <p className="text-sm font-medium text-gray-800 line-clamp-3 leading-snug">{a.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
