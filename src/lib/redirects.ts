/**
 * FFL Accelerator origin redirects.
 *
 * Every destination stays on this host. Astro `redirects` is the in-repo
 * mechanism. `_redirects` is emitted at build for Cloudflare Pages / hosts
 * that read that file. GitHub Pages cannot emit HTTP 410. On Vercel, gone
 * paths rewrite to /api/gone (HTTP 410).
 *
 * www to apex is Vercel domain config, not a rule in this file.
 */

export const ON_SITE = {
  home: "/",
  plan: "/plan/",
  dropshipping: "/plan/#inventory-dropshipping",
  guide: "/guides/gun-store-software/",
  about: "/about/",
  trendsQ1: "/trends/2025-q1/",
  trendsQ2: "/trends/2025-q2/",
} as const;

/** Do not 301 these (or anything under /trends/). */
export const KEEP_PREFIXES = [
  "/",
  "/plan",
  "/about",
  "/contact",
  "/privacy",
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

/** Permanent 301s. Slash and slashless both go to an on-site destination. */
export const PERMANENT_REDIRECTS: RedirectRule[] = [
  ...pair("/ffl-ecommerce", ON_SITE.plan),
  ...pair("/ffl-dropshipping", ON_SITE.dropshipping),
  ...pair("/switch", ON_SITE.home),
  ...pair("/retailbi-and-axis", ON_SITE.home),
  ...pair("/pricing", ON_SITE.plan),

  ...pair("/switch-n-save", ON_SITE.home),
  ...pair(
    "/how-to-start-a-gun-store-essential-tips-for-new-firearms-dealers",
    ON_SITE.guide,
  ),
  ...pair("/firearm-and-accessory-sales-trends-in-q1-2025", ON_SITE.trendsQ1),
  ...pair("/firearm-and-accessory-sales-trends-in-q2-2025", ON_SITE.trendsQ2),
  ...pair(
    "/best-software-for-managing-your-gun-store-and-ffl-records",
    ON_SITE.guide,
  ),
  ...pair("/category/4473", ON_SITE.guide),
  ...pair(
    "/top-5-reasons-firearms-retailers-should-switch-to-electronic-4473-storage",
    ON_SITE.guide,
  ),
  ...pair("/step-by-step-guide-to-obtaining-your-federal-firearms-license-ffl", "/"),
  ...pair("/top-5-common-mistakes-to-avoid-when-applying-for-your-ffl", "/"),
  ...pair("/understanding-the-different-types-of-ffls", "/"),
  ...pair("/author/devopscoriolisagency-com", ON_SITE.about),
];

function gonePair(from: string): [string, string] {
  const bare = from.replace(/\/+$/, "");
  if (!bare) {
    throw new Error("Refusing to 410 /");
  }
  return [bare, `${bare}/`];
}

/**
 * Leftover slugs that named a POS vendor. 410. Do not 301 these, and do
 * not emit an Astro HTML refresh (that 200s and prints the slug).
 */
const GONE_VENDOR_WP = [
  ...gonePair("/get-your-ffl-sot-with-orchids-ffl-university"),
  ...gonePair("/orchid"),
  ...gonePair("/orchid-advisors"),
  ...gonePair("/orchid-estate"),
  ...gonePair("/ebound"),
  ...gonePair("/orchids-ffl-university"),
  ...gonePair("/orchid-ffl-university"),
  ...gonePair("/category/orchid"),
  ...gonePair("/tag/orchid"),
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

/** Prefixes to 410. More-specific 301s (for example /category/4473) are listed first. */
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
  if (bare === "/contact") return true;
  if (bare === "/privacy") return true;
  if (bare === "/gunsearchagent-included") return true;
  if (bare === "/guides/gun-store-software") return true;
  if (bare === "/confirmed") return true;
  if (bare === "/trends" || bare.startsWith("/trends/")) return true;
  return false;
}

for (const rule of PERMANENT_REDIRECTS) {
  if (!rule.to.startsWith("/")) {
    throw new Error(`Redirect must stay on this site: ${rule.from} -> ${rule.to}`);
  }
  if (isKept(rule.from)) {
    throw new Error(`Do not 301 a keep path: ${rule.from}`);
  }
}

for (const path of GONE_EXACT) {
  if (isKept(path)) {
    throw new Error(`Do not 410 a keep path: ${path}`);
  }
}

const goneSet = new Set<string>(GONE_EXACT);
for (const rule of PERMANENT_REDIRECTS) {
  if (goneSet.has(rule.from)) {
    throw new Error(`Path is both 301 and 410: ${rule.from}`);
  }
}

export function astroRedirects(): Record<
  string,
  { status: 301; destination: string }
> {
  // trailingSlash: "always" collapses /path and /path/ into one route.
  // Register the slashed form; slashless is covered by _redirects and Vercel.
  return Object.fromEntries(
    PERMANENT_REDIRECTS.filter((rule) => rule.from.endsWith("/")).map((rule) => [
      rule.from,
      { status: 301 as const, destination: rule.to },
    ]),
  );
}

/** URLs that must not appear in the sitemap. */
export function isSitemapExcluded(pageUrl: string): boolean {
  let pathname = pageUrl;
  try {
    pathname = new URL(pageUrl).pathname;
  } catch {
    /* already a path */
  }
  if (pathname === "/trends" || pathname.startsWith("/trends/")) return true;
  const skip = [
    "/ffl-ecommerce",
    "/ffl-dropshipping",
    "/switch",
    "/switch-n-save",
    "/retailbi-and-axis",
    "/pricing",
    "/how-to-start-a-gun-store-essential-tips-for-new-firearms-dealers",
  ];
  return skip.some(
    (p) => pathname === p || pathname === `${p}/` || pathname.startsWith(`${p}/`),
  );
}

/**
 * Cloudflare / Netlify `_redirects`.
 * Query strings follow on hosts that honor this file.
 * More-specific 301s are listed before prefix 410s.
 */
export function toCloudflareRedirects(): string {
  const lines = [
    "# FFL Accelerator redirects. Generated from src/lib/redirects.ts",
    "# Do not 301 / or /plan/. The campaign door stays on this host.",
    "# Destinations stay on this host.",
    "",
  ];
  for (const rule of PERMANENT_REDIRECTS) {
    lines.push(`${rule.from} ${rule.to} ${rule.status}`);
  }
  lines.push("");
  lines.push("# Leftover WordPress / Woo junk with no real destination. 410 Gone");
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
    const target = `https://fflaccelerator.com${rule.to}`;
    return `${source},${target},301,TRUE,FALSE,FALSE,FALSE`;
  });
  for (const path of GONE_VENDOR_WP) {
    const source = `fflaccelerator.com${path}`;
    rows.push(`${source},https://${source},410,TRUE,FALSE,FALSE,FALSE`);
  }
  return `${[header, ...rows].join("\n")}\n`;
}

export const VERCEL_INSTALL_COMMAND =
  'if [ -n "$LEAD_FORM_READ_TOKEN" ]; then u="https://x-access-token:$LEAD_FORM_READ_TOKEN@github.com/"; git config --global --add url."$u".insteadOf https://github.com/; git config --global --add url."$u".insteadOf ssh://git@github.com/; fi; npm install';

if (VERCEL_INSTALL_COMMAND.length >= 256) {
  throw new Error(
    `installCommand is ${VERCEL_INSTALL_COMMAND.length} characters (max 255)`,
  );
}
