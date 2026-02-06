/**
 * UtilitÃ¡rio para captura e gerenciamento de parÃ¢metros UTM
 * Usado na integraÃ§Ã£o com UTMify para rastreamento de conversÃµes
 */

export interface TrackingParameters {
  src?: string | null;
  sck?: string | null;
  utm_source?: string | null;
  utm_campaign?: string | null;
  utm_medium?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
}

const STORAGE_KEY = "utm_params";
const LOCAL_STORAGE_KEY = "utm_params_local";

function generateSessionId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function captureUtmFromUrl(): TrackingParameters {
  const urlParams = new URLSearchParams(window.location.search);
  const getCookie = (name: string) => {
    const match = document.cookie
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
  };
  
  return {
    // src pode vir como 'src' ou 'xcod' (gerado pelo UTMify)
    src: urlParams.get("src") || urlParams.get("xcod") || getCookie("src") || getCookie("xcod") || null,
    // sck pode vir como 'sck' ou '_sck'
    sck: urlParams.get("sck") || urlParams.get("_sck") || getCookie("sck") || getCookie("_sck") || null,
    utm_source: urlParams.get("utm_source") || getCookie("utm_source"),
    utm_campaign: urlParams.get("utm_campaign") || getCookie("utm_campaign"),
    utm_medium: urlParams.get("utm_medium") || getCookie("utm_medium"),
    utm_content: urlParams.get("utm_content") || getCookie("utm_content"),
    utm_term: urlParams.get("utm_term") || getCookie("utm_term"),
  };
}

export function getStoredTrackingParameters(): TrackingParameters {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    const storedLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedLocal ? JSON.parse(storedLocal) : {};
  } catch {
    return {};
  }
}

export function saveTrackingParameters(params: TrackingParameters): void {
  const existing = getStoredTrackingParameters();

  const withFallback = {
    ...params,
    src: params.src || params.utm_source || existing.src || "direct",
    sck: params.sck || existing.sck || generateSessionId(),
  };

  const filtered = Object.fromEntries(
    Object.entries(withFallback).filter(([_, v]) => v != null && v !== "")
  );

  if (Object.keys(filtered).length > 0) {
    const merged = { ...existing, ...filtered };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
  }
}

export function getTrackingParameters(): TrackingParameters {
  const urlParams = captureUtmFromUrl();
  const stored = getStoredTrackingParameters();

  let sck = urlParams.sck || stored.sck;
  if (!sck) {
    sck = generateSessionId();
    const updatedStored = { ...stored, sck };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStored));
  }

  return {
    src:
      urlParams.src ||
      stored.src ||
      urlParams.utm_source ||
      stored.utm_source ||
      "direct",
    sck,
    utm_source: urlParams.utm_source || stored.utm_source || null,
    utm_campaign: urlParams.utm_campaign || stored.utm_campaign || null,
    utm_medium: urlParams.utm_medium || stored.utm_medium || null,
    utm_content: urlParams.utm_content || stored.utm_content || null,
    utm_term: urlParams.utm_term || stored.utm_term || null,
  };
}

export function buildUrlWithTracking(path: string): string {
  const params = getStoredTrackingParameters();
  const filtered = Object.entries(params).filter(([_, v]) => v != null && v !== "");

  if (filtered.length === 0) {
    return path;
  }

  const queryString = new URLSearchParams(filtered as [string, string][]).toString();
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${queryString}`;
}

export function navigateWithTracking(
  navigate: (path: string, options?: { replace?: boolean }) => void,
  path: string,
  options?: { replace?: boolean }
): void {
  const urlWithTracking = buildUrlWithTracking(path);
  navigate(urlWithTracking, options);
}
