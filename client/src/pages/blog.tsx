import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { trackPageView } from "@/lib/analytics";
import { Search, Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const categories = ["すべて", "物流コラム", "採用情報", "協力会社情報", "お知らせ", "事例紹介"];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [search, setSearch] = useState("");

  useEffect(() => {
    trackPageView("/blog");
    document.title = "お知らせ｜株式会社池ノ谷商事";
  }, []);

  const { data: articles, isLoading } = useQuery<any[]>({ queryKey: ["/api/articles"] });

  const filtered = (articles || []).filter((a) => {
    const matchCat = selectedCategory === "すべて" || a.category === selectedCategory;
    const matchSearch = !search || a.title.includes(search) || a.excerpt?.includes(search);
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Page header */}
      <section className="pt-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <span className="text-[#1d4ed8] font-black text-4xl italic font-serif">News</span>
          <p className="text-gray-400 text-sm mt-1">お知らせ</p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40 px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${selectedCategory === c ? "bg-gray-800 text-white border-gray-800" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}
                data-testid={`filter-category-${c}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="記事を検索..."
              className="pl-9 h-9 text-sm border-gray-200 bg-gray-50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-blog-search"
            />
          </div>
        </div>
      </section>

      <section className="flex-1 py-12 bg-white px-4">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <Skeleton className="aspect-[4/3] w-full mb-4 rounded-lg" />
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-2">記事が見つかりませんでした</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((article: any) => (
                <Link key={article.id} href={`/blog/${article.slug}`}>
                  <div className="group cursor-pointer" data-testid={`card-article-${article.id}`}>
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg mb-4 overflow-hidden relative">
                      {article.imageUrl ? (
                        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-end p-4">
                          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(255,255,255,0.05) 15px, rgba(255,255,255,0.05) 16px)" }} />
                          <span className="text-white/25 text-4xl font-black italic relative z-10">{article.category}</span>
                        </div>
                      )}
                    </div>
                    <h2 className="font-semibold text-[#1a4b99] text-sm md:text-base mb-2 group-hover:text-[#1d4ed8] transition-colors line-clamp-2 leading-snug">{article.title}</h2>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-3">{article.excerpt}</p>
                    <p className="text-gray-400 text-xs">
                      {article.publishedAt
                        ? format(new Date(article.publishedAt), "yyyy.MM.dd", { locale: ja })
                        : format(new Date(article.createdAt), "yyyy.MM.dd", { locale: ja })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
