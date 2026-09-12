/**
 * Consent-aware analytics and attribution.
 *
 * Visitors can opt out from the privacy page. Until they do, analytics and
 * attribution remain enabled so advertising conversions can be measured
 * without interrupting the LP with a consent banner.
 */
const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID as string | undefined;
const GOOGLE_ADS_ID = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_ID as string | undefined;
const GOOGLE_ADS_PHONE_LABEL = import.meta.env.VITE_GOOGLE_ADS_PHONE_CONVERSION_LABEL as string | undefined;
const GOOGLE_ADS_FORM_LABEL = import.meta.env.VITE_GOOGLE_ADS_FORM_CONVERSION_LABEL as string | undefined;

type AttributionValues = {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

export type Attribution = {
  firstTouch: AttributionValues;
  currentTouch: AttributionValues;
  firstTouchAt?: string;
  currentTouchAt?: string;
};

const FIRST_TOUCH_KEY = "_attribution_first";
const SESSION_TOUCH_KEY = "_attribution_session";
const LEGACY_ATTRIBUTION_KEY = "_attribution";
const ATTRIBUTION_KEYS: (keyof AttributionValues)[] = [
  "gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
];
const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1000;
let pendingAttribution: Attribution | null = null;

function consentAccepted() {
  return typeof localStorage !== "undefined" && localStorage.getItem("cookie_consent") !== "declined";
}

function readJson<T>(storage: Storage, key: string, fallback: T): T {
  try {
    return JSON.parse(storage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
}

function queryTouch(): AttributionValues {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const current: AttributionValues = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key);
    if (value) current[key] = value.slice(0, 500);
  }
  return current;
}

function captureAttribution(): Attribution {
  if (typeof window === "undefined") return { firstTouch: {}, currentTouch: {} };
  const now = Date.now();
  const query = queryTouch();
  if (!consentAccepted()) {
    if (localStorage.getItem("cookie_consent") === "declined") {
      pendingAttribution = null;
      return { firstTouch: {}, currentTouch: {} };
    }
    if (Object.keys(query).length) {
      const capturedAt = new Date(now).toISOString();
      pendingAttribution = {
        firstTouch: pendingAttribution?.firstTouch || query,
        currentTouch: query,
        firstTouchAt: pendingAttribution?.firstTouchAt || capturedAt,
        currentTouchAt: capturedAt,
      };
    }
    return pendingAttribution || { firstTouch: {}, currentTouch: {} };
  }
  const session = readJson<{ firstTouch?: AttributionValues; currentTouch?: AttributionValues; firstTouchAt?: string; currentTouchAt?: string }>(
    sessionStorage, SESSION_TOUCH_KEY, {},
  );
  const storedFirst = consentAccepted()
    ? readJson<{ values?: AttributionValues; capturedAt?: string }>(localStorage, FIRST_TOUCH_KEY, {})
    : {};
  const firstExpired = !storedFirst.capturedAt || now - new Date(storedFirst.capturedAt).getTime() > ATTRIBUTION_TTL_MS;
  const sessionExpired = !!session.firstTouchAt && now - new Date(session.firstTouchAt).getTime() > ATTRIBUTION_TTL_MS;
  if (storedFirst.capturedAt && firstExpired) {
    localStorage.removeItem(FIRST_TOUCH_KEY);
  }

  let currentTouch = sessionExpired ? {} : (session.currentTouch || {});
  let currentTouchAt = sessionExpired ? undefined : session.currentTouchAt;
  let firstTouch = (!firstExpired && storedFirst.values) || (sessionExpired ? {} : session.firstTouch) || {};
  let firstTouchAt = (!firstExpired && storedFirst.capturedAt) || (sessionExpired ? undefined : session.firstTouchAt);
  const acquisition = Object.keys(query).length ? query : pendingAttribution?.currentTouch;
  if (acquisition && Object.keys(acquisition).length) {
    currentTouch = acquisition;
    currentTouchAt = new Date(now).toISOString();
    if (!Object.keys(firstTouch).length) {
      firstTouch = pendingAttribution?.firstTouch || acquisition;
      firstTouchAt = pendingAttribution?.firstTouchAt || currentTouchAt;
    }
    sessionStorage.setItem(SESSION_TOUCH_KEY, JSON.stringify({ firstTouch, currentTouch, firstTouchAt, currentTouchAt }));
    if (consentAccepted() && Object.keys(firstTouch).length && !storedFirst.values) {
      localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify({ values: firstTouch, capturedAt: firstTouchAt || new Date(now).toISOString() }));
    }
  }
  pendingAttribution = null;
  return { firstTouch, currentTouch, firstTouchAt, currentTouchAt };
}

let attribution = captureAttribution();

function shareableAttribution(): Attribution {
  return consentAccepted() ? attribution : { firstTouch: {}, currentTouch: {} };
}

// Consent Mode v2 default must execute before adding gtag.js.
if (typeof window !== "undefined") {
  const win = window as any;
  win.dataLayer = win.dataLayer || [];
  win.gtag = win.gtag || function (...args: unknown[]) { win.dataLayer.push(args); };
  const consent = consentAccepted() ? "granted" : "denied";
  win.gtag("consent", "default", {
    ad_storage: consent,
    analytics_storage: consent,
    ad_user_data: consent,
    ad_personalization: consent,
    wait_for_update: 500,
  });
}

let analyticsLoaded = false;

export function loadAnalytics() {
  if (analyticsLoaded || !consentAccepted()) return;
  analyticsLoaded = true;
  const win = typeof window !== "undefined" ? window as any : undefined;
  win?.gtag?.("consent", "update", {
    ad_storage: "granted", analytics_storage: "granted", ad_user_data: "granted", ad_personalization: "granted",
  });
  const googleTagId = GA4_ID || GOOGLE_ADS_ID;
  if (googleTagId) {
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleTagId)}`;
    document.head.appendChild(script1);
    const script2 = document.createElement("script");
    const configs = [
      GA4_ID ? `gtag('config','${GA4_ID.replace(/'/g, "")}',{send_page_view:false});` : "",
      GOOGLE_ADS_ID && GOOGLE_ADS_ID !== GA4_ID ? `gtag('config','${GOOGLE_ADS_ID.replace(/'/g, "")}');` : "",
    ].join("");
    script2.innerHTML = `window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments)};gtag('js',new Date());${configs}`;
    document.head.appendChild(script2);
  }
  if (CLARITY_ID) {
    const script = document.createElement("script");
    script.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${CLARITY_ID.replace(/"/g, "")}");`;
    document.head.appendChild(script);
  }
}

export function trackGA4Event(eventName: string, params?: Record<string, string>) {
  if (consentAccepted() && typeof window !== "undefined" && (window as any).gtag) {
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

export function getAttribution(): Attribution {
  attribution = captureAttribution();
  return shareableAttribution();
}

export function trackPageView(path: string) {
  const current = getAttribution();
  trackGA4Event("page_view", { page_path: path });
  fetch("/api/analytics/pageview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path, sessionId: getSessionId(), userAgent: navigator.userAgent, referrer: document.referrer || "",
      attribution: JSON.stringify(current), firstTouchAt: current.firstTouchAt, currentTouchAt: current.currentTouchAt,
    }),
  }).then((response) => {
    if (!response.ok) console.warn("[analytics] pageview rejected", response.status);
  }).catch((error) => console.warn("[analytics] pageview failed", error));
}

export function trackEvent(eventName: string, properties?: Record<string, string>) {
  const current = getAttribution();
  trackGA4Event(eventName, properties);
  fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName, path: window.location.pathname, sessionId: getSessionId(),
      properties: JSON.stringify(properties || {}), attribution: JSON.stringify(current),
      firstTouchAt: current.firstTouchAt, currentTouchAt: current.currentTouchAt,
    }),
  }).then((response) => {
    if (!response.ok) console.warn("[analytics] event rejected", response.status);
  }).catch((error) => console.warn("[analytics] event failed", error));
}

export function trackGoogleAdsConversion(kind: "phone" | "form", callback?: () => void): boolean {
  if (!consentAccepted() || !GOOGLE_ADS_ID || typeof window === "undefined" || !(window as any).gtag) return false;
  const label = kind === "phone" ? GOOGLE_ADS_PHONE_LABEL : GOOGLE_ADS_FORM_LABEL;
  if (!label) return false;
  (window as any).gtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${label}`,
    event_callback: callback,
    event_timeout: 800,
  });
  return true;
}

export function resetConsent() {
  if (typeof window === "undefined") return;
  localStorage.setItem("cookie_consent", "declined");
  localStorage.removeItem(FIRST_TOUCH_KEY);
  localStorage.removeItem(LEGACY_ATTRIBUTION_KEY);
  sessionStorage.removeItem(SESSION_TOUCH_KEY);
  for (const storage of [localStorage, sessionStorage]) {
    for (let i = storage.length - 1; i >= 0; i--) {
      const key = storage.key(i);
      if (key && /^_cl/i.test(key)) storage.removeItem(key);
    }
  }
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (name && /^_cl/i.test(name)) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    }
  }
  (window as any).gtag?.("consent", "update", {
    ad_storage: "denied", analytics_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
  });
}

export const hasConsent = consentAccepted;
export const setConsent = (v: boolean) => {
  const wasAccepted = consentAccepted();
  localStorage.setItem("cookie_consent", v ? "accepted" : "declined");
  if (v) {
    if (attribution.firstTouch && Object.keys(attribution.firstTouch).length) {
      localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify({ values: attribution.firstTouch, capturedAt: attribution.firstTouchAt || new Date().toISOString() }));
    }
    attribution = captureAttribution();
  } else {
    localStorage.removeItem(FIRST_TOUCH_KEY);
    sessionStorage.removeItem(SESSION_TOUCH_KEY);
    pendingAttribution = null;
    attribution = { firstTouch: {}, currentTouch: {} };
  }
  (window as any)?.gtag?.("consent", "update", {
    ad_storage: v ? "granted" : "denied", analytics_storage: v ? "granted" : "denied",
    ad_user_data: v ? "granted" : "denied", ad_personalization: v ? "granted" : "denied",
  });
  if (v) {
    loadAnalytics();
    if (!wasAccepted) {
      trackGA4Event("page_view", { page_path: window.location.pathname });
      trackEvent("attribution_consent", { page_path: window.location.pathname });
    }
  }
};
export const hasDecided = () => typeof localStorage !== "undefined" && localStorage.getItem("cookie_consent") !== null;