import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo mark */}
        <div className="text-center mb-10">
          <img src="/logo-mark.png" alt="池ノ谷商事" className="w-16 h-16 object-contain mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 tracking-wider">株式会社池ノ谷商事</h1>
          <p className="text-gray-400 text-xs mt-1 tracking-widest uppercase">Admin Panel</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => { setError(""); mutation.mutate(d); })} className="space-y-4">
            <FormField control={form.control} name="username" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-gray-600 font-medium tracking-wide">ユーザー名</FormLabel>
                <FormControl>
                  <Input
                    placeholder="admin"
                    className="border-gray-300 bg-white text-gray-900 placeholder:text-gray-300 focus:border-black focus:ring-black rounded-none h-10"
                    {...field}
                    data-testid="input-admin-username"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-gray-600 font-medium tracking-wide">パスワード</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="border-gray-300 bg-white text-gray-900 placeholder:text-gray-300 focus:border-black focus:ring-black rounded-none h-10"
                    {...field}
                    data-testid="input-admin-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {error && (
              <p className="text-red-500 text-xs border border-red-200 bg-red-50 px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-black text-white text-sm py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50 mt-2"
              data-testid="button-admin-login"
            >
              {mutation.isPending ? "ログイン中..." : "ログイン"}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
}
