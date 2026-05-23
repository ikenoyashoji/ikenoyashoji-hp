import { Switch, Route, useLocation } from "wouter";
import { useEffect, useRef, lazy, Suspense, useState, useCallback } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { loadAnalytics, trackPageView } from "@/lib/analytics";
import NotFound from "@/pages/not-found";
import { SplashScreen } from "@/components/splash-screen";

// LP（ホーム）は静的インポート — 即座に表示
import Home from "@/pages/home";

// ヒーロー画像（スプラッシュ中に先読みするため先行インポート）
import heroTruck from "@assets/5029A6E0-F753-4C3C-9B97-E2826E325D91_1779426563754.PNG";
import heroCold from "@assets/hero_warehouse_cold.png";
import heroInterior from "@assets/hero_warehouse_interior.png";

import { SplashContext } from "@/lib/splash-context";

// 公開ページ — 遅延読み込み
const Recruit       = lazy(() => import("@/pages/recruit"));
const Partner       = lazy(() => import("@/pages/partner"));
const Blog          = lazy(() => import("@/pages/blog"));
const BlogPost      = lazy(() => import("@/pages/blog-post"));
const Company       = lazy(() => import("@/pages/company"));
const About         = lazy(() => import("@/pages/about"));
const Services      = lazy(() => import("@/pages/services"));
const Contact       = lazy(() => import("@/pages/contact"));
const Privacy       = lazy(() => import("@/pages/privacy"));
const SitemapPage   = lazy(() => import("@/pages/sitemap"));

// 管理画面 — 遅延読み込み
const AdminLogin         = lazy(() => import("@/pages/admin/login"));
const AdminDashboard     = lazy(() => import("@/pages/admin/dashboard"));
const AdminArticles      = lazy(() => import("@/pages/admin/articles"));
const ArticleEditor      = lazy(() => import("@/pages/admin/article-editor"));
const AdminKeywords      = lazy(() => import("@/pages/admin/keywords"));
const AdminSearchConsole = lazy(() => import("@/pages/admin/search-console"));
const AdminContacts      = lazy(() => import("@/pages/admin/contacts"));
const AdminManagers      = lazy(() => import("@/pages/admin/managers"));
const AdminEmailSales    = lazy(() => import("@/pages/admin/email-sales"));
const AdminLogs          = lazy(() => import("@/pages/admin/logs"));
const AdminSettings      = lazy(() => import("@/pages/admin/settings"));
const AdminAutoPublish   = lazy(() => import("@/pages/admin/auto-publish"));

// ヒーロー画像をブラウザにプリロードさせる（スプラッシュ中に裏読み）
function preloadImage(src: string) {
  const img = new window.Image();
  img.src = src;
}

// LPを見ている間に公開ページをバックグラウンドでプリフェッチ（遅延なし）
function usePrefetch() {
  const [location] = useLocation();
  useEffect(() => {
    if (location !== "/") return;
    import("@/pages/recruit");
    import("@/pages/partner");
    import("@/pages/blog");
    import("@/pages/company");
    import("@/pages/about");
    import("@/pages/services");
    import("@/pages/contact");
    import("@/pages/privacy");
    import("@/pages/blog-post");
  }, [location]);
}

// 管理画面に入った瞬間に全管理ページを先読みしてページ遷移のチカチカを防止
function usePrefetchAdmin() {
  const [location] = useLocation();
  const prefetched = useRef(false);
  useEffect(() => {
    if (!location.startsWith("/admin") || prefetched.current) return;
    prefetched.current = true;
    import("@/pages/admin/dashboard");
    import("@/pages/admin/articles");
    import("@/pages/admin/article-editor");
    import("@/pages/admin/keywords");
    import("@/pages/admin/search-console");
    import("@/pages/admin/contacts");
    import("@/pages/admin/managers");
    import("@/pages/admin/email-sales");
    import("@/pages/admin/logs");
    import("@/pages/admin/settings");
    import("@/pages/admin/auto-publish");
  }, [location]);
}

function usePageTracking() {
  const [location] = useLocation();
  useEffect(() => {
    if (!location.startsWith("/admin")) {
      trackPageView(location);
    }
  }, [location]);
}

function useScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
}

function Router() {
  usePageTracking();
  usePrefetch();
  usePrefetchAdmin();
  useScrollToTop();

  return (
    <Suspense fallback={null}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/recruit" component={Recruit} />
        <Route path="/partner" component={Partner} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/company" component={Company} />
        <Route path="/about" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/sitemap" component={SitemapPage} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />

        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/articles" component={AdminArticles} />
        <Route path="/admin/articles/:id" component={ArticleEditor} />
        <Route path="/admin/keywords" component={AdminKeywords} />
        <Route path="/admin/search-console" component={AdminSearchConsole} />
        <Route path="/admin/contacts" component={AdminContacts} />
        <Route path="/admin/managers" component={AdminManagers} />
        <Route path="/admin/email-sales" component={AdminEmailSales} />
        <Route path="/admin/logs" component={AdminLogs} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route path="/admin/auto-publish" component={AdminAutoPublish} />

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function AppInner() {
  const [splashDone, setSplashDone] = useState(false);
  const handleFinish = useCallback(() => setSplashDone(true), []);

  useEffect(() => {
    loadAnalytics();
    // スプラッシュ中にヒーロー画像を先読み → LP表示時に即座に描画
    preloadImage(heroTruck);
    preloadImage(heroCold);
    preloadImage(heroInterior);
  }, []);

  return (
    <SplashContext.Provider value={splashDone}>
      {!splashDone && <SplashScreen onFinish={handleFinish} />}
      <Router />
    </SplashContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppInner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
