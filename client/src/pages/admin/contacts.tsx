import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Package, Truck } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const typeConfig: Record<string, { label: string; icon: any; color: string }> = {
  shipper: { label: "荷主", icon: Package, color: "bg-blue-900 text-blue-300 border-blue-700" },
  recruit: { label: "採用", icon: Users, color: "bg-green-900 text-green-300 border-green-700" },
  partner: { label: "協力会社", icon: Truck, color: "bg-amber-900 text-amber-300 border-amber-700" },
};

export default function AdminContacts() {
  const { data: contacts, isLoading } = useQuery<any[]>({ queryKey: ["/api/admin/contacts"] });

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-black text-white">問い合わせ一覧</h1>
          <p className="text-blue-400 text-xs mt-0.5">{contacts?.length ?? 0}件の問い合わせ</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i=><Skeleton key={i} className="h-32 bg-[#0f2044]" />)}</div>
        ) : !contacts?.length ? (
          <div className="text-center py-16 text-blue-500">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">問い合わせがありません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((c: any) => {
              const config = typeConfig[c.type] || typeConfig.shipper;
              return (
                <Card key={c.id} className="bg-[#0f2044] border-blue-900" data-testid={`contact-card-${c.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={`text-xs px-2 ${config.color}`}>
                          <config.icon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                        <span className="text-white font-semibold text-sm">{c.name}</span>
                        {c.company && <span className="text-blue-400 text-xs">（{c.company}）</span>}
                      </div>
                      <span className="text-blue-500 text-xs flex-shrink-0">
                        {format(new Date(c.createdAt), "yyyy年M月d日 HH:mm", { locale: ja })}
                      </span>
                    </div>
                    <div className="mt-2 grid sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <div><span className="text-blue-500">メール：</span><span className="text-blue-200">{c.email}</span></div>
                      {c.phone && <div><span className="text-blue-500">電話：</span><span className="text-blue-200">{c.phone}</span></div>}
                      {c.cargoType && <div><span className="text-blue-500">荷物：</span><span className="text-blue-200">{c.cargoType}</span></div>}
                      {c.route && <div><span className="text-blue-500">ルート：</span><span className="text-blue-200">{c.route}</span></div>}
                      {c.frequency && <div><span className="text-blue-500">頻度：</span><span className="text-blue-200">{c.frequency}</span></div>}
                      {c.position && <div><span className="text-blue-500">職種：</span><span className="text-blue-200">{c.position}</span></div>}
                      {c.experience && <div><span className="text-blue-500">経験：</span><span className="text-blue-200">{c.experience}</span></div>}
                      {c.vehicleType && <div><span className="text-blue-500">車両：</span><span className="text-blue-200">{c.vehicleType}</span></div>}
                      {c.vehicleCount && <div><span className="text-blue-500">台数：</span><span className="text-blue-200">{c.vehicleCount}</span></div>}
                    </div>
                    {c.message && (
                      <div className="mt-2 bg-blue-900/20 rounded p-2">
                        <span className="text-blue-500 text-xs">メッセージ：</span>
                        <p className="text-blue-200 text-xs mt-0.5 leading-relaxed">{c.message}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
