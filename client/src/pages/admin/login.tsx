import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Truck, Lock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function AdminLogin() {
  const [error, setError] = useState("");

  const { data: me } = useQuery({ queryKey: ["/api/admin/me"] });
  useEffect(() => {
    if ((me as any)?.isAdmin) window.location.href = "/admin";
  }, [me]);

  const form = useForm({ defaultValues: { username: "", password: "" } });

  const mutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/login", data),
    onSuccess: () => { window.location.href = "/admin"; },
    onError: () => setError("ユーザー名またはパスワードが間違っています"),
  });

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-amber-500 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Truck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">池ノ谷商事</h1>
          <p className="text-blue-400 text-sm mt-1">管理画面ログイン</p>
        </div>

        <div className="bg-[#0f2044] rounded-xl border border-blue-900 p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((d) => { setError(""); mutation.mutate(d); })} className="space-y-4">
              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-200 text-sm">ユーザー名</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="admin"
                      className="bg-[#0a1628] border-blue-800 text-white placeholder:text-blue-600"
                      {...field}
                      data-testid="input-admin-username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-200 text-sm">パスワード</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-[#0a1628] border-blue-800 text-white placeholder:text-blue-600"
                      {...field}
                      data-testid="input-admin-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-amber-500 text-white font-bold border-amber-400 mt-2"
                data-testid="button-admin-login"
              >
                <Lock className="w-4 h-4 mr-2" />
                {mutation.isPending ? "ログイン中..." : "ログイン"}
              </Button>
            </form>
          </Form>
          <p className="text-blue-500 text-xs text-center mt-4">
            デフォルト: admin / admin123（環境変数 ADMIN_USER/ADMIN_PASS で変更可）
          </p>
        </div>
      </div>
    </div>
  );
}
