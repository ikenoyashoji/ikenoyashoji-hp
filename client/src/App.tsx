import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/cookie-banner";
import { hasConsent, loadAnalytics, trackPageView } from "@/lib/analytics";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Recruit from "@/pages/recruit";
import Partner from "@/pages/partner";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Company from "@/pages/company";
import Contact from "@/pages/contact";
import Privacy from "@/pages/privacy";

import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminArticles from "@/pages/admin/articles";
import ArticleEditor from "@/pages/admin/article-editor";
import AdminKeywords from "@/pages/admin/keywords";
import AdminSearchConsole from "@/pages/admin/search-console";
import AdminContacts from "@/pages/admin/contacts";

function usePageTracking() {
  const [location] = useLocation();
  useEffect(() => {
    if (!location.startsWith("/admin")) {
      trackPageView(location);
    }
  }, [location]);
}

function Router() {
  usePageTracking();

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/recruit" component={Recruit} />
      <Route path="/partner" component={Partner} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/company" component={Company} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={Privacy} />

      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/articles" component={AdminArticles} />
      <Route path="/admin/articles/:id" component={ArticleEditor} />
      <Route path="/admin/keywords" component={AdminKeywords} />
      <Route path="/admin/search-console" component={AdminSearchConsole} />
      <Route path="/admin/contacts" component={AdminContacts} />

      <Route component={NotFound} />
    </Switch>
  );
}

function AppInner() {
  useEffect(() => {
    if (hasConsent()) loadAnalytics();
  }, []);

  return (
    <>
      <Router />
      <CookieBanner />
    </>
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
