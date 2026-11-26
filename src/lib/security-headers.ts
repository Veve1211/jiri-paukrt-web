import { SITE_ORIGIN } from "./site-origin";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
};

// Only on the published site: the Lovable editor shows previews inside an iframe.
const PRODUCTION_HOSTS = new Set(["paukrt.lovable.app", new URL(SITE_ORIGIN).hostname]);
const NO_FRAMING_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": "frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
};

/** Adds security headers to a response; framing is blocked only on the published site. */
export function withSecurityHeaders(request: Request, response: Response): Response {
  const secured = new Response(response.body, response);
  const host = new URL(request.url).hostname;
  const headers = PRODUCTION_HOSTS.has(host)
    ? { ...SECURITY_HEADERS, ...NO_FRAMING_HEADERS }
    : SECURITY_HEADERS;
  for (const [name, value] of Object.entries(headers)) {
    if (!secured.headers.has(name)) secured.headers.set(name, value);
  }
  return secured;
}
