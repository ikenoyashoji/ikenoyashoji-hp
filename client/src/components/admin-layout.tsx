import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard, FileText, Tag, BarChart2, LogOut, Users, ExternalLink, Menu } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

const navItems = [
  { href: "/admin", label: "ダッシュボード", icon: LayoutDashboard, exact: true },
  { href: "/admin/articles", label: "記事管理", icon: FileText },
  { href: "/admin/keywords", label: "キーワード管理", icon: Tag },
  { href: "/admin/contacts", label: "問い合わせ", icon: Users },
  { href: "/admin/search-console", label: "サーチコンソール", icon: BarChart2 },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const { data: me, isLoading } = useQuery({ queryKey: ["/api/admin/me"] });

  const handleLogout = async () => {
    await apiRequest("POST", "/api/admin/logout", {});
    queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
    window.location.href = "/admin/login";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-gray-400 text-sm">読み込み中...</div>
      </div>
    );
  }

  if (!(me as any)?.isAdmin) {
    window.location.href = "/admin/login";
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-black flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
          <img src="/logo-mark.png" alt="池ノ谷商事" className="w-8 h-8 object-contain flex-shrink-0" />
          <div>
            <div className="text-white font-bold text-xs leading-tight">株式会社</div>
            <div className="text-white font-bold text-sm leading-tight">池ノ谷商事</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {navItems.map((item) => {
            const active = item.exact ? location === item.href : location.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={`flex items-center gap-3 px-3 py-2 text-xs rounded transition-colors cursor-pointer ${
                    active
                      ? "bg-white text-black font-semibold"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                  data-testid={`link-admin-nav-${item.label}`}
                >
                  <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link href="/">
            <span className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-white transition-colors rounded hover:bg-white/10 cursor-pointer">
              <ExternalLink className="w-3.5 h-3.5" />
              サイトを表示
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-red-400 transition-colors rounded hover:bg-white/10"
            data-testid="button-admin-logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            ログアウト
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="flex items-center px-6 h-12 border-b border-gray-200 bg-white flex-shrink-0">
          <span className="text-gray-400 text-xs">管理画面</span>
          <span className="mx-2 text-gray-200">/</span>
          <span className="text-gray-700 text-xs font-medium">
            {navItems.find((n) => n.exact ? location === n.href : location.startsWith(n.href))?.label ?? "ページ"}
          </span>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
