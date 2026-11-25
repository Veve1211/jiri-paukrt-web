import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { BlueprintBackdrop } from "@/components/site/BlueprintBackdrop";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LangProvider } from "@/components/site/LangProvider";
import { useLang } from "@/lib/i18n";
import { useContent } from "@/data/useContent";

function NotFoundComponent() {
  const { t } = useLang();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          {t("Page not found", "Stránka nenalezena")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t(
            "The page you're looking for doesn't exist or has been moved.",
            "Hledaná stránka neexistuje nebo byla přesunuta.",
          )}
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("Go home", "Na úvod")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  const { t } = useLang();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {t("This page didn't load", "Stránku se nepodařilo načíst")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t(
            "Something went wrong on our end. You can try refreshing or head back home.",
            "Něco se pokazilo. Zkuste stránku obnovit nebo se vraťte na úvod.",
          )}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("Try again", "Zkusit znovu")}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {t("Go home", "Na úvod")}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    // Replace these placeholders with the app's name and description when first building the app.
    // Each content route, / included, must still set its own head(). Never add og:image or
    // twitter:image here: every page without its own would inherit the root's preview image.
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Jiri Paukrt — Principal Transportation Engineer" },
      {
        name: "description",
        content:
          "Jiri Paukrt, Principal Transportation Engineer at SYSTRA in Dublin: 27+ years of travel demand modelling, traffic microsimulation, scheme evaluation and road safety.",
      },
      { name: "author", content: "Jiri Paukrt" },
      { property: "og:title", content: "Jiri Paukrt — Principal Transportation Engineer" },
      {
        property: "og:description",
        content:
          "27+ years of transport demand modelling, microsimulation and GIS across Ireland, the UK, Australia and Europe.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      // Google Search Console ownership proof — keep permanently, removing it unverifies the site.
      {
        name: "google-site-verification",
        content: "Ctgx3MlIJJWdodU5RKD0QqkVdI_yZhYH0Ax9UxsskUY",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// The published address; copies of the site (e.g. on Vercel) point search engines here.
const CANONICAL_ORIGIN = "https://paukrt.lovable.app";

function RootShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const canonicalPath = pathname.replace(/\/+$/, "") || "/";
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
        <link rel="canonical" href={`${CANONICAL_ORIGIN}${canonicalPath}`} />
        {/* Google Search Console token for the Vercel address (jiri-paukrt-web-eytb.vercel.app) —
            keep permanently. Written here, not in head(): HeadContent keeps only one meta per name. */}
        <meta
          name="google-site-verification"
          content="I1BdPvOxBZ2Xa9qqwYhdoJhEafmc3PIXcCgCenOrBPw"
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <BlueprintBackdrop />
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <main className="relative z-10 flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
        <CzechDocumentTitle />
        <Toaster theme="dark" position="bottom-right" />
      </LangProvider>
    </QueryClientProvider>
  );
}

const TITLE_CS: Record<string, string> = {
  "/": "Ing. Jiří Paukrt — hlavní dopravní inženýr | Dopravní modelování",
  "/career": "Kariéra 1999–dosud — Jiří Paukrt",
  "/projects": "Projekty a publikace — Jiří Paukrt",
  "/network": "Mapa projektů — Jiří Paukrt",
  "/expertise": "Odbornost a nástroje — Jiří Paukrt",
  "/contact": "Kontakt — Jiří Paukrt",
  "/cv": "Životopis — Ing. Jiří Paukrt, hlavní dopravní inženýr",
  "/privacy": "Ochrana osobních údajů — Jiří Paukrt",
};

/**
 * Page titles in <head> come from each route and are English (the server render).
 * In the Czech version the browser tab gets the Czech title instead.
 */
function CzechDocumentTitle() {
  const { lang } = useLang();
  const { getProject } = useContent();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const czechTitle = useRef<string | null>(null);
  useEffect(() => {
    if (lang !== "cs") {
      // switching back to English: put the route's English title back
      if (czechTitle.current && document.title === czechTitle.current) {
        const el = document.querySelector("title");
        if (el?.dataset["en"]) document.title = el.dataset["en"];
      }
      czechTitle.current = null;
      return;
    }
    const path = pathname.replace(/\/$/, "") || "/";
    const slug = path.startsWith("/projects/") ? path.slice("/projects/".length) : undefined;
    const project = slug ? getProject(slug) : undefined;
    const title = project
      ? `${project.title} — Jiří Paukrt`
      : (TITLE_CS[path] ?? "Stránka nenalezena — Jiří Paukrt");
    // run after the router has written its own (English) title
    const id = window.setTimeout(() => {
      const el = document.querySelector("title");
      if (el && document.title !== czechTitle.current) el.dataset["en"] = document.title;
      document.title = title;
      czechTitle.current = title;
    }, 0);
    return () => window.clearTimeout(id);
  }, [lang, pathname, getProject]);
  return null;
}
