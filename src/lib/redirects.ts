/**
 * FFL Accelerator origin redirects.
 *
 * Campaign door stays on this host: `/` and `/plan/`.
 * Ranking host for the moved commercial pillars is Coriolis (www).
 *
 * Astro `redirects` is the in-repo mechanism. `_redirects` is emitted at
 * build for Cloudflare Pages / hosts that read that file. GitHub Pages
 * cannot emit HTTP 410; leftover WP junk we cannot map is listed as gone
 * so a Cloudflare rule or Pages `_redirects` can apply it.
 */

export const CORIOLIS_WWW = {
  ecommerce: "https://www.coriolisagency.com/ecommerce",
  dropshipping: "https://www.coriolisagency.com/firearms-dropshipping",
  switch: "https://www.coriolisagency.com/ammoready-alternative",
  demand: "https://www.coriolisagency.com/demand-intelligence",
  contact: "https://www.coriolisagency.com/contact",
} as const;

/** Do not 301 these (or anything under /trends/). */
export const KEEP_PREFIXES = [
  "/",
  "/plan",
  "/about",
  "/gunsearchagent-included",
  "/guides/gun-store-software",
  "/trends",
  "/confirmed",
] as const;

export type RedirectRule = {
  from: string;
  to: string;
  status: 301;
};

function pair(from: string, to: string): RedirectRule[] {
  const bare = from.replace(/\/+$/, "");
  if (!bare) {
    throw new Error("Refusing to redirect /");
  }
  return [
    { from: bare, to, status: 301 },
    { from: `${bare}/`, to, status: 301 },
  ];
}

/** Permanent 301s — slash and slashless both go to the destination. */
export const PERMANENT_REDIRECTS: RedirectRule[] = [
  ...pair("/ffl-ecommerce", CORIOLIS_WWW.ecommerce),
  ...pair("/ffl-dropshipping", CORIOLIS_WWW.dropshipping),
  ...pair("/switch", CORIOLIS_WWW.switch),
  ...pair("/retailbi-and-axis", CORIOLIS_WWW.demand),
  ...pair("/pricing", CORIOLIS_WWW.ecommerce),
  ...pair("/contact", CORIOLIS_WWW.contact),

  // Leftover WordPress permalinks we can map to a real Coriolis or FFL URL.
  ...pair("/switch-n-save", CORIOLIS_WWW.switch),
  ...pair(
    "/how-to-start-a-gun-store-essential-tips-for-new-firearms-dealers",
    CORIOLIS_WWW.ecommerce,
  ),
  ...pair(
    "/firearm-and-accessory-sales-trends-in-q1-2025",
    "/trends/2025-q1/",
  ),
  ...pair(
    "/firearm-and-accessory-sales-trends-in-q2-2025",
    "/trends/2025-q2/",
  ),
  ...pair(
    "/step-by-step-guide-to-obtaining-your-federal-firearms-license-ffl",
    "/",
  ),
  ...pair("/top-5-common-mistakes-to-avoid-when-applying-for-your-ffl", "/"),
  ...pair("/understanding-the-different-types-of-ffls", "/"),
  ...pair("/author/devopscoriolisagency-com", "/about/"),
];

function gonePair(from: string): [string, string] {
  const bare = from.replace(/\/+$/, "");
  if (!bare) {
    throw new Error("Refusing to 410 /");
  }
  return [bare, `${bare}/`];
}

/**
 * Leftover WP that named a POS vendor (slug or body). 410 — do not 301
 * these to `/`, `/plan/`, or a keep page.
 */
const GONE_VENDOR_WP = [
  ...gonePair("/get-your-ffl-sot-with-orchids-ffl-university"),
  ...gonePair("/best-software-for-managing-your-gun-store-and-ffl-records"),
  ...gonePair("/category/4473"),
  ...gonePair(
    "/top-5-reasons-firearms-retailers-should-switch-to-electronic-4473-storage",
  ),
  ...gonePair(
    "/what-to-expect-during-an-atf-inspection-of-your-firearms-business",
  ),
  ...gonePair("/ffl-renewal-process-what-you-need-to-know-to-stay-compliant"),
  ...gonePair("/ffl-news"),
] as const;

/** Exact paths to 410 (gone). Do not invent replacement pages. */
export const GONE_EXACT = [
  ...GONE_VENDOR_WP,
  "/wp-login.php",
  "/xmlrpc.php",
  "/wp-admin",
  "/wp-admin/",
  "/wp-json",
  "/wp-json/",
  "/feed",
  "/feed/",
  "/comments/feed",
  "/comments/feed/",
  "/blog",
  "/blog/",
  "/category",
  "/category/",
  "/tag",
  "/tag/",
  "/sample-page",
  "/sample-page/",
  "/cart",
  "/cart/",
  "/shop",
  "/shop/",
  "/my-account",
  "/my-account/",
  "/checkout",
  "/checkout/",
] as const;

/** Prefixes to 410. More-specific 301s must be listed first. */
export const GONE_PREFIXES = [
  "/wp-admin/",
  "/wp-content/",
  "/wp-includes/",
  "/wp-json/",
  "/tag/",
] as const;

function isKept(from: string): boolean {
  if (from === "/") return true;
  const bare = from.replace(/\/+$/, "") || "/";
  if (bare === "/plan") return true;
  if (bare === "/about") return true;
  if (bare === "/gunsearchagent-included") return true;
  if (bare === "/guides/gun-store-software") return true;
  if (bare === "/confirmed") return true;
  if (bare === "/trends" || bare.startsWith("/trends/")) return true;
  return false;
}

for (const rule of PERMANENT_REDIRECTS) {
  if (isKept(rule.from)) {
    throw new Error(`Do not 301 a keep path: ${rule.from}`);
  }
}

for (const path of GONE_EXACT) {
  if (isKept(path)) {
    throw new Error(`Do not 410 a keep path: ${path}`);
  }
}

export function astroRedirects(): Record<
  string,
  { status: 301; destination: string }
> {
  // trailingSlash: "always" collapses /path and /path/ into one route.
  // Register the slashed form; slashless is covered by _redirects + GH Pages.
  return Object.fromEntries(
    PERMANENT_REDIRECTS.filter((rule) => rule.from.endsWith("/")).map((rule) => [
      rule.from,
      { status: 301 as const, destination: rule.to },
    ]),
  );
}

/** URLs that must not appear in the FFL sitemap after the 301s. */
export function isSitemapExcluded(pageUrl: string): boolean {
  let pathname = pageUrl;
  try {
    pathname = new URL(pageUrl).pathname;
  } catch {
    /* already a path */
  }
  const skip = [
    "/ffl-ecommerce",
    "/ffl-dropshipping",
    "/switch",
    "/retailbi-and-axis",
    "/pricing",
    "/contact",
  ];
  return skip.some(
    (p) => pathname === p || pathname === `${p}/` || pathname.startsWith(`${p}/`),
  );
}

/**
 * Cloudflare / Netlify `_redirects`.
 * Query strings follow on hosts that honor this file (CF Pages, Netlify).
 * More-specific 301s are listed before prefix 410s.
 */
export function toCloudflareRedirects(): string {
  const lines = [
    "# FFL Accelerator redirects. Generated from src/lib/redirects.ts",
    "# Do not 301 / or /plan/ — campaign door stays on this host.",
    "",
  ];
  for (const rule of PERMANENT_REDIRECTS) {
    lines.push(`${rule.from} ${rule.to} ${rule.status}`);
  }
  lines.push("");
  lines.push("# Leftover WordPress / Woo junk with no real destination — 410 Gone");
  for (const path of GONE_EXACT) {
    lines.push(`${path} 410`);
  }
  for (const prefix of GONE_PREFIXES) {
    lines.push(`${prefix}* 410`);
  }
  lines.push("/category/* 410");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

/** Cloudflare Bulk Redirects CSV (dashboard import). Query string follows. */
export function toBulkRedirectCsv(): string {
  const header =
    "source,target,status,preserve_query_string,include_subdomains,subpath_matching,preserve_path_suffix";
  const rows = PERMANENT_REDIRECTS.map((rule) => {
    const source = `fflaccelerator.com${rule.from}`;
    const target = rule.to.startsWith("http")
      ? rule.to
      : `https://fflaccelerator.com${rule.to}`;
    return `${source},${target},301,TRUE,FALSE,FALSE,FALSE`;
  });
  return `${[header, ...rows].join("\n")}\n`;
}
