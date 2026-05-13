import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { trackPageView } from "@/lib/analytics";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

import topicImg1 from "@assets/スクリーンショット_2026-05-13_2.44.31_1778607953004.png";
import topicImg2 from "@assets/スクリーンショット_2026-05-13_2.44.44_1778607963000.png";
import topicImg3 from "@assets/スクリーンショット_2026-05-13_2.44.54_1778607966295.png";
import topicImg4 from "@assets/スクリーンショット_2026-05-13_2.45.03_1778607970643.png";

const categories = ["すべて", "物流コラム", "採用情報", "協力会社情報", "お知らせ", "事例紹介"];

const staticTopics = [
  {
    id: "s1",
    imageUrl: topicImg1,
    category: "採用情報",
    date: "2026.05.12",
    title: "WORK STYLE｜ドライバーのリアルな働き方と想いをお届けします。",
    excerpt: "現場で働くドライバーたちの声、仕事への誇り、日々の工夫をリアルにお伝えします。",
    href: "/recruit",
    isStatic: true,
  },
  {
    id: "s2",
    imageUrl: topicImg2,
    category: "物流コラム",
    date: "2026.05.10",
    title: "物流の裏側｜現場の工夫や課題解決の取り組みを発信します。",
    excerpt: "物流現場で生まれる知恵と改善の取り組みを、わかりやすくお伝えするコラムシリーズ。",
    href: "/blog",
    isStatic: true,
  },
  {
    id: "s3",
    imageUrl: topicImg3,
    category: "採用情報",
    date: "2026.05.08",
    title: "人を大切にする会社 池ノ谷商事の魅力｜女性スタッフも多数活躍中！",
    excerpt: "育児と両立しながら活躍する女性スタッフや、未経験から成長したドライバーの声を紹介。",
    href: "/recruit",
    isStatic: true,
  },
  {
    id: "s4",
    imageUrl: topicImg4,
    category: "お知らせ",
    date: "2026.05.06",
    title: "MOVE THE CITY｜街をつなぎ、未来を支える。現場から見える物流の今とこれから。",
    excerpt: "物流が支える街の暮らし、そして変化する物流業界の現在地についてお届けします。",
    href: "/blog",
    isStatic: true,
  },
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [search, setSearch] = useState("");

  useEffect(() => {
    trackPageView("/blog");
    document.title = "お知らせ｜株式会社池ノ谷商事";
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

  const allArticles = [...staticTopics, ...dbArticles];

  const filtered = allArticles.filter((a) => {
    const matchCat = selectedCategory === "すべて" || a.category === selectedCategory;
    const matchSearch = !search || a.title.includes(search) || (a.excerpt || "").includes(search);
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero */}
      <section className="relative mt-[100px] overflow-hidden flex items-end pb-16 px-8" style={{ minHeight: "320px", background: "linear-gradient(135deg, #0f2044 0%, #1a4b99 60%, #1d4ed8 100%)" }}>
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,1) 39px,rgba(255,255,255,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,1) 39px,rgba(255,255,255,1) 40px)" }} />
        <div className="relative max-w-5xl mx-auto w-full">
          <AnimateIn>
            <p className="text-[#7eb3ff] text-xs tracking-[0.5em] uppercase mb-3">LATEST NEWS</p>
            <h1 className="text-5xl font-extralight text-white tracking-[0.15em] mb-4">お知らせ</h1>
            <div className="w-12 h-0.5 bg-[#1d4ed8]" />
          </AnimateIn>
        </div>
      </section>

      {/* Filter bar */}
      <section className="bg-white border-b border-gray-100 sticky top-[100px] z-40 px-8 py-4">
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

      <section className="flex-1 py-16 bg-white px-8">
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
                      <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative mb-4">
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
