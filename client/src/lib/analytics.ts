const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID as string | undefined;

let analyticsLoaded = false;

export function loadAnalytics() {
  if (analyticsLoaded) return;
  analyticsLoaded = true;

  if (GA4_ID) {
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.innerHTML = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA4_ID}');`;
    document.head.appendChild(script2);
  }

  if (CLARITY_ID) {
    const script = document.createElement("script");
    script.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${CLARITY_ID}");`;
    document.head.appendChild(script);
  }
}

export function trackGA4Event(eventName: string, params?: Record<string, string>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, params);
  }
}

function getSessionId(): string {
  let sid = sessionStorage.getItem("_sid");
  if (!sid) {
    sid = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("_sid", sid);
  }
  return sid;
}

export function trackPageView(path: string) {
  trackGA4Event("page_view", { page_path: path });

  fetch("/api/analytics/pageview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, sessionId: getSessionId(), userAgent: navigator.userAgent }),
  }).catch(() => {});
}

export function trackEvent(eventName: string, properties?: Record<string, string>) {
  trackGA4Event(eventName, properties);

  fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      path: window.location.pathname,
      sessionId: getSessionId(),
      properties: JSON.stringify(properties || {}),
    }),
  }).catch(() => {});
}

export const hasConsent = () => localStorage.getItem("cookie_consent") === "accepted";
export const setConsent = (v: boolean) => {
  localStorage.setItem("cookie_consent", v ? "accepted" : "declined");
  if (v) loadAnalytics();
};
export const hasDecided = () => localStorage.getItem("cookie_consent") !== null;
