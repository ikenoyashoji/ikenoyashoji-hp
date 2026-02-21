import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CtaBanner } from "@/components/cta-banner";
import { trackPageView } from "@/lib/analytics";
import { Search, Calendar, ChevronRight, Tag } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const categories = ["すべて", "物流コラム", "採用情報", "協力会社情報", "お知らせ", "事例紹介"];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [search, setSearch] = useState("");

  useEffect(() => {
    trackPageView("/blog");
    document.title = "ブログ｜アクロス物流株式会社 - 物流に関するお役立ち情報";
  }, []);

  const { data: articles, isLoading } = useQuery<any[]>({ queryKey: ["/api/articles"] });

  const filtered = (articles || []).filter((a) => {
    const matchCat = selectedCategory === "すべて" || a.category === selectedCategory;
    const matchSearch = !search || a.title.includes(search) || a.excerpt?.includes(search);
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="pt-16 bg-[#0f2044]">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <span className="text-amber-400 font-semibold text-sm tracking-widest">BLOG</span>
          <h1 className="text-3xl md:text-4xl font-black text-white mt-2">物流コラム・お役立ち情報</h1>
          <p className="text-blue-200 mt-3 text-sm">物流業界の最新情報から実践的なノウハウまで、役に立つ記事をお届けします。</p>
        </div>
      </section>

      <section className="py-10 bg-white border-b border-border px-4 sticky top-16 z-40">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${selectedCategory === c ? "bg-[#0f2044] text-white border-[#0f2044]" : "border-border text-muted-foreground hover:border-[#0f2044] hover:text-[#0f2044]"}`}
                  data-testid={`filter-category-${c}`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="記事を検索..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-blog-search"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 py-12 bg-slate-50 px-4">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-card-border">
                  <CardContent className="p-5">
                    <Skeleton className="h-4 w-20 mb-3" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-5 w-3/4 mb-4" />
                    <Skeleton className="h-3 w-full mb-1" />
                    <Skeleton className="h-3 w-5/6" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-2">記事が見つかりませんでした</p>
              <p className="text-muted-foreground text-sm">別のカテゴリや検索ワードをお試しください</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article: any) => (
                <Link key={article.id} href={`/blog/${article.slug}`}>
                  <Card className="border-card-border hover-elevate h-full bg-white cursor-pointer" data-testid={`card-article-${article.id}`}>
                    {article.imageUrl ? (
                      <div className="aspect-[16/9] bg-slate-100 rounded-t-lg overflow-hidden">
                        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] bg-gradient-to-br from-[#0f2044] to-[#1a3a7a] rounded-t-lg flex items-center justify-center">
                        <div className="text-blue-300 text-4xl font-black opacity-20">物</div>
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="flex gap-2 mb-3 flex-wrap">
                        <Badge variant="outline" className="text-xs" data-testid={`badge-category-${article.id}`}>{article.category}</Badge>
                        {article.tags?.slice(0, 1).map((tag: string) => (
                          <span key={tag} className="text-xs text-muted-foreground flex items-center gap-0.5">
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h2 className="font-bold text-[#0f2044] mb-2 line-clamp-2 text-sm leading-snug">{article.title}</h2>
                      <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 mb-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                          <Calendar className="w-3 h-3" />
                          {article.publishedAt ? format(new Date(article.publishedAt), "yyyy年M月d日", { locale: ja }) : ""}
                        </div>
                        <span className="text-blue-500 text-xs flex items-center gap-0.5">
                          続きを読む <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
      <Footer />
    </div>
  );
}
