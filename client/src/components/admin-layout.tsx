import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Truck, LayoutDashboard, FileText, Tag, BarChart2, LogOut, ChevronRight, Users } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const navItems = [
  { href: "/admin", label: "ダッシュボード", icon: LayoutDashboard, exact: true },
  { href: "/admin/articles", label: "記事管理", icon: FileText },
  { href: "/admin/keywords", label: "キーワード管理", icon: Tag },
  { href: "/admin/contacts", label: "問い合わせ", icon: Users },
  { href: "/admin/search-console", label: "サーチコンソール", icon: BarChart2 },
];

function AdminSidebar() {
  const [location] = useLocation();

  const handleLogout = async () => {
    await apiRequest("POST", "/api/admin/logout", {});
    queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
    window.location.href = "/admin/login";
  };

  return (
    <Sidebar className="border-r border-blue-900">
      <SidebarContent className="bg-[#0f2044]">
        <div className="px-4 py-4 border-b border-blue-900">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 rounded p-1">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-white text-sm font-bold">アクロス物流</div>
              <div className="text-blue-400 text-[10px]">管理画面</div>
            </div>
          </div>
        </div>
        <SidebarGroup className="pt-4">
          <SidebarGroupLabel className="text-blue-400 text-xs px-4 mb-1">メニュー</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = item.exact ? location === item.href : location.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-md mx-2 transition-colors ${active ? "bg-blue-700/60 text-white font-semibold" : "text-blue-200 hover:bg-white/10 hover:text-white"}`}
                        data-testid={`link-admin-nav-${item.label}`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto px-4 py-4 border-t border-blue-900">
          <div className="flex gap-2">
            <Link href="/" className="flex-1">
              <button className="w-full text-xs text-blue-300 py-2 px-3 rounded border border-blue-800 hover:bg-white/5 transition-colors text-left">
                サイトを表示
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-red-300 py-2 px-3 rounded border border-red-900/50 hover:bg-red-900/20 transition-colors flex items-center gap-1"
              data-testid="button-admin-logout"
            >
              <LogOut className="w-3 h-3" />
              ログアウト
            </button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: me, isLoading } = useQuery({
    queryKey: ["/api/admin/me"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a1628]">
        <div className="text-white text-sm">読み込み中...</div>
      </div>
    );
  }

  if (!(me as any)?.isAdmin) {
    window.location.href = "/admin/login";
    return null;
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full bg-[#0a1628]">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between px-4 h-12 border-b border-blue-900 bg-[#0f2044]">
            <SidebarTrigger className="text-white" data-testid="button-sidebar-toggle" />
            <span className="text-blue-300 text-xs">アクロス物流 管理画面</span>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
