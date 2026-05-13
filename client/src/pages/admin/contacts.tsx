import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const typeConfig: Record<string, { label: string }> = {
  shipper: { label: "荷主" },
  recruit: { label: "採用" },
  partner: { label: "協力会社" },
};

export default function AdminContacts() {
  const { data: contacts, isLoading } = useQuery<any[]>({ queryKey: ["/api/admin/contacts"] });

  return (
    <AdminLayout>
      <div className="space-y-4 max-w-4xl">
        <div>
          <h1 className="text-lg font-bold text-gray-900">問い合わせ一覧</h1>
          <p className="text-gray-400 text-xs mt-0.5">{contacts?.length ?? 0}件の問い合わせ</p>
        </div>

        {isLoading ? (
          <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-28 bg-gray-100" />)}</div>
        ) : !contacts?.length ? (
          <div className="text-center py-16 border border-gray-100 text-gray-400">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">問い合わせがありません</p>
          </div>
        ) : (
          <div className="space-y-1">
            {contacts.map((c: any) => {
              const config = typeConfig[c.type] || typeConfig.shipper;
              return (
                <div key={c.id} className="bg-white border border-gray-200 p-4 hover:border-gray-400 transition-colors" data-testid={`contact-card-${c.id}`}>
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] px-1.5 py-0.5 border border-gray-300 text-gray-500">
                        {config.label}
                      </span>
                      <span className="text-gray-900 font-semibold text-sm">{c.name}</span>
                      {c.company && <span className="text-gray-400 text-xs">（{c.company}）</span>}
                    </div>
                    <span className="text-gray-300 text-xs flex-shrink-0">
                      {format(new Date(c.createdAt), "yyyy年M月d日 HH:mm", { locale: ja })}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-0.5 text-xs">
                    <div><span className="text-gray-400">メール：</span><span className="text-gray-700">{c.email}</span></div>
                    {c.phone && <div><span className="text-gray-400">電話：</span><span className="text-gray-700">{c.phone}</span></div>}
                    {c.cargoType && <div><span className="text-gray-400">荷物：</span><span className="text-gray-700">{c.cargoType}</span></div>}
                    {c.route && <div><span className="text-gray-400">ルート：</span><span className="text-gray-700">{c.route}</span></div>}
                    {c.frequency && <div><span className="text-gray-400">頻度：</span><span className="text-gray-700">{c.frequency}</span></div>}
                    {c.position && <div><span className="text-gray-400">職種：</span><span className="text-gray-700">{c.position}</span></div>}
                    {c.experience && <div><span className="text-gray-400">経験：</span><span className="text-gray-700">{c.experience}</span></div>}
                    {c.vehicleType && <div><span className="text-gray-400">車両：</span><span className="text-gray-700">{c.vehicleType}</span></div>}
                    {c.vehicleCount && <div><span className="text-gray-400">台数：</span><span className="text-gray-700">{c.vehicleCount}</span></div>}
                  </div>
                  {c.message && (
                    <div className="mt-2.5 bg-gray-50 border border-gray-100 p-2.5">
                      <span className="text-gray-400 text-xs">メッセージ：</span>
                      <p className="text-gray-700 text-xs mt-0.5 leading-relaxed">{c.message}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
