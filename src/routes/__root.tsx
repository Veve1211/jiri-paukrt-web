import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  retainSearchParams,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { BlueprintBackdrop } from "@/components/site/BlueprintBackdrop";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LangProvider } from "@/components/site/LangProvider";
import { useLang, type Lang } from "@/lib/i18n";

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
  validateSearch: (search: Record<string, unknown>): { lang?: Lang } =>
    search["lang"] === "cs" || search["lang"] === "en" ? { lang: search["lang"] } : {},
  search: { middlewares: [retainSearchParams(["lang"])] },
  head: ({ match }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: match.search.lang === "cs" ? "Jiří Paukrt" : "Jiri Paukrt" },
      { name: "author", content: "Jiří Paukrt" },
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
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "icon", href: "/favicon-48.png", type: "image/png", sizes: "48x48" },
      { rel: "icon", href: "/favicon-96.png", type: "image/png", sizes: "96x96" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
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

function RootShell({ children }: { children: ReactNode }) {
  const lang = useRouterState({ select: (s) => s.matches[0]?.search.lang }) ?? "en";
  return (
    <html lang={lang} className="dark">
      <head>
        <HeadContent />
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
        <Toaster theme="dark" position="bottom-right" />
      </LangProvider>
    </QueryClientProvider>
  );
}
