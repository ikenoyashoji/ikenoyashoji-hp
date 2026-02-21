import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CtaBanner } from "@/components/cta-banner";
import { trackPageView } from "@/lib/analytics";
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
      document.title = `${article.title}｜アクロス物流株式会社`;
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
    if (platform === "line") window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`);
    if (platform === "copy") { navigator.clipboard.writeText(url); }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 pt-16 py-12 px-4">
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
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl font-black text-gray-200 mb-4">404</div>
            <p className="text-gray-400 mb-4">記事が見つかりませんでした</p>
            <Link href="/blog" className="text-[#1a4b99] hover:underline flex items-center justify-center gap-1 text-sm">
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

      <main className="flex-1 pt-16">
        {/* Article header */}
        <div className="bg-white border-b border-gray-100 py-10 px-4">
          <div className="max-w-3xl mx-auto">
            <Link href="/blog" className="text-gray-400 text-sm flex items-center gap-1 mb-5 hover:text-[#1a4b99] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> お知らせ一覧
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-[#1a4b99]/10 text-[#1a4b99] border-[#1a4b99]/20 text-xs">{article.category}</Badge>
              {article.tags?.map((t: string) => (
                <span key={t} className="flex items-center gap-1 text-gray-400 text-xs">
                  <Tag className="w-3 h-3" />{t}
                </span>
              ))}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">{article.title}</h1>
            <div className="flex items-center gap-4 text-gray-400 text-xs">
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

        <div className="max-w-3xl mx-auto px-4 py-10">
          {article.metaDescription && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
              <p className="text-gray-600 text-sm leading-relaxed">{article.metaDescription}</p>
            </div>
          )}

          {headings.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
              <button
                className="flex items-center gap-2 text-gray-800 font-bold text-sm w-full"
                onClick={() => setTocOpen(!tocOpen)}
                data-testid="button-toc-toggle"
              >
                <List className="w-4 h-4 text-[#6B9E9E]" />
                目次
                <ChevronRight className={`w-4 h-4 ml-auto transition-transform text-gray-400 ${tocOpen ? "rotate-90" : ""}`} />
              </button>
              {tocOpen && (
                <ol className="mt-3 space-y-1">
                  {headings.map((h, i) => (
                    <li key={i} className={`text-sm ${h.level === 3 ? "pl-4" : ""}`}>
                      <span className="text-[#1a4b99] hover:text-[#c0392b] cursor-pointer transition-colors">{h.text}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          <div
            className="prose prose-slate max-w-none prose-headings:text-gray-800 prose-headings:font-bold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-base prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-500 prose-p:leading-relaxed prose-li:text-gray-500 prose-strong:text-gray-800"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {faqData.length > 0 && (
            <div className="mt-12">
              <Separator className="mb-8" />
              <h2 className="text-xl font-bold text-gray-800 mb-6">よくある質問</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {faqData.map((faq: any, i: number) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-gray-50 border border-gray-200 rounded-lg px-5" data-testid={`faq-article-${i}`}>
                    <AccordionTrigger className="text-gray-800 font-semibold text-sm text-left py-4">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-gray-500 text-sm leading-relaxed pb-4">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                <Share2 className="w-4 h-4" /> この記事をシェア
              </span>
              <button
                onClick={() => share("twitter")}
                className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
                data-testid="button-share-twitter"
              >
                X (Twitter)
              </button>
              <button
                onClick={() => share("line")}
                className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-full hover:bg-green-600 transition-colors"
                data-testid="button-share-line"
              >
                LINE
              </button>
              <button
                onClick={() => share("copy")}
                className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors border border-gray-200"
                data-testid="button-share-copy"
              >
                URLをコピー
              </button>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-12">
              <Separator className="mb-8" />
              <h2 className="text-xl font-bold text-gray-800 mb-6">関連記事</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((a: any) => (
                  <Link key={a.id} href={`/blog/${a.slug}`}>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover-elevate cursor-pointer h-full">
                      <span className="inline-block text-xs text-[#1a4b99] bg-[#1a4b99]/10 px-2 py-0.5 rounded mb-2">{a.category}</span>
                      <p className="text-sm font-semibold text-gray-800 line-clamp-3 leading-snug">{a.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <CtaBanner />
      <Footer />
    </div>
  );
}
