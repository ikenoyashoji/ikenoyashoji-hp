import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { trackPageView } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

import heroImg from "@assets/スクリーンショット_2026-05-22_14.34.44_1779428095288.png";

const categories = ["すべて", "物流コラム", "採用情報", "お知らせ"];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [search, setSearch] = useState("");

  useEffect(() => {
    trackPageView("/blog");
    setSeo({
      title: "お知らせ・物流コラム",
      description: "株式会社池ノ谷商事の最新ニュース・物流コラム・採用情報をお届けします。輸送コスト削減・3PLの活用法・ドライバー採用など物流に役立つ情報を発信しています。",
      path: "/blog",
    });
  }, []);

  const { data: articles, isLoading } = useQuery<any[]>({ queryKey: ["/api/articles"] });

  const dbArticles = (articles || []).map((a) => ({
    ...a,
    date: a.publishedAt
      ? format(new Date(a.publishedAt), "yyyy.MM.dd", { locale: ja })
      : format(new Date(a.createdAt), "yyyy.MM.dd", { locale: ja }),
    href: `/blog/${a.slug}`,
    isStatic: false,
  }));

  const filtered = dbArticles.filter((a) => {
    const matchCat = selectedCategory === "すべて" || a.category === selectedCategory;
    const matchSearch = !search || a.title.includes(search) || (a.excerpt || "").includes(search);
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero */}
      <section className="relative mt-[100px] overflow-hidden">
        <img src={heroImg} alt="お知らせ・コラム" className="w-full h-auto block" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2044]/80 via-[#0f2044]/60 to-[#0f2044]/90" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%)", backgroundSize: "60px 60px" }} />
        <div className="absolute inset-0 flex items-center justify-center text-center px-8">
          <AnimateIn>
            <p className="text-[#7eb3ff] text-[10px] tracking-[0.6em] mb-6">Ikenoyashoji Co.,Ltd.</p>
            <h1 className="hero-title text-5xl md:text-6xl font-extralight text-white tracking-[0.15em] mb-6">お知らせ</h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#1d4ed8] to-transparent mx-auto mb-6" />
            <p className="text-gray-300 text-sm tracking-widest">物流の現場から、最新情報・コラム・採用情報をお届けします。</p>
          </AnimateIn>
        </div>
      </section>

      {/* Filter bar */}
      <section className="bg-white border-b border-gray-100 sticky top-[100px] z-40 px-4 sm:px-8 py-3 sm:py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`text-xs px-4 py-1.5 border transition-colors tracking-wide ${selectedCategory === c ? "bg-[#0f2044] text-white border-[#0f2044]" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}
                data-testid={`filter-category-${c}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="記事を検索..."
              className="pl-9 h-9 text-sm border-gray-200 bg-gray-50 rounded-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-blog-search"
            />
          </div>
        </div>
      </section>

      <section className="flex-1 py-10 sm:py-16 bg-white px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i}>
                  <Skeleton className="aspect-[4/3] w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-300 text-5xl font-light tracking-widest mb-4">No Posts</p>
              <p className="text-gray-400 text-sm">記事が見つかりませんでした</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filtered.map((article: any, i: number) => (
                <AnimateIn key={article.id} delay={i * 60}>
                  <Link href={article.href}>
                    <div className="group cursor-pointer" data-testid={`card-article-${article.id}`}>
                      <div className="aspect-[16/9] bg-gray-100 overflow-hidden relative mb-4">
                        {article.imageUrl ? (
                          typeof article.imageUrl === "string" && article.imageUrl.startsWith("http") ? (
                            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          ) : (
                            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                          )
                        ) : (
                          <div className="absolute inset-0 bg-[#0f2044] flex items-end p-5">
                            <span className="text-white/15 text-5xl font-black italic">{article.category}</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className="bg-white text-[#0f2044] text-[10px] px-2 py-1 font-medium tracking-wider">{article.category}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-[11px] tracking-widest mb-2">{article.date}</p>
                      <h2 className="font-medium text-gray-900 text-sm leading-snug group-hover:text-[#1d4ed8] transition-colors line-clamp-2">{article.title}</h2>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mt-2">{article.excerpt}</p>
                    </div>
                  </Link>
                </AnimateIn>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
