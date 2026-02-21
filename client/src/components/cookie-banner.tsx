import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { hasDecided, setConsent } from "@/lib/analytics";
import { Cookie } from "lucide-react";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!hasDecided()) {
      const t = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  if (!show) return null;

  const accept = () => {
    setConsent(true);
    setShow(false);
  };

  const decline = () => {
    setConsent(false);
    setShow(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-lg mx-auto md:left-auto md:right-4 md:mx-0">
      <div className="bg-[#0f2044] border border-blue-800 rounded-lg p-4 shadow-xl">
        <div className="flex items-start gap-3 mb-3">
          <Cookie className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white text-sm font-semibold mb-1">Cookie・計測ツールについて</p>
            <p className="text-blue-300 text-xs leading-relaxed">
              当サイトではGA4（Google Analytics）およびMicrosoft Clarityを使用して、サービス改善のためにアクセス情報を収集しています。
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="ghost" className="text-blue-300 text-xs" onClick={decline} data-testid="button-cookie-decline">
            拒否する
          </Button>
          <Button size="sm" className="bg-amber-500 text-white text-xs border-amber-400 font-bold" onClick={accept} data-testid="button-cookie-accept">
            同意して続ける
          </Button>
        </div>
      </div>
    </div>
  );
}
