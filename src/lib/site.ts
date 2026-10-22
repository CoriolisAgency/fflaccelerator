export const SITE = {
  name: "FFL Accelerator",
  legalName: "Coriolis, LLC",
  /** Social and document titles must not include a price or a tier name. */
  titleDefault: "Managed FFL Website You Own | FFL Accelerator",
  description:
    "A managed WooCommerce website for FFL dealers, on your domain. Hosting, design, checkout, catalogs, email, and analytics.",
  role: "A store website you own",
  origin: "Greenville, SC",
  locality: "Greenville",
  region: "SC",
  phone: "(279) 258-6771",
  phoneHref: "tel:+12792586771",
} as const;

/** Visible footer identity. Same string on every page. No email. */
export const FOOTER_IDENTITY =
  "Coriolis, LLC · Greenville, SC · (279) 258-6771";

export const TRADEMARK_LINE =
  "Google Analytics and Google Search Console are trademarks of Google LLC. WordPress is a trademark of the WordPress Foundation. WooCommerce is a trademark of Automattic Inc. Cloudflare is a trademark of Cloudflare, Inc. Other product and marketplace names are trademarks of their owners.";

export const SITE_ORIGIN = "https://fflaccelerator.com";

/** Public GSE observe sensor. Not a secret. No shopper href. */
export const GSE_EMBED = {
  src: "https://www.gunsearchengine.com/embed.js",
  siteKey: "pk_live_87fae3f0e1b11b555706fd4216fe44fa",
  mode: "observe",
} as const;

export const CANON_PATHS = {
  logo: "brand/ffl-accelerator-logo.png",
  icon: "brand/ffl-accelerator-icon.png",
  sales: "brand/sales-accelerator.jpg",
} as const;

/** Site-wide default share image (og:image, twitter:image). 1200x630 crop of the homepage hero. */
export const DEFAULT_OG_IMAGE = {
  path: "og/ffla-hero-og.jpg",
  width: 1200,
  height: 630,
  alt: "FFL Accelerator: FFL Ecommerce as a Service. Your online store, run for you.",
} as const;
