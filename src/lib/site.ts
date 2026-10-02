export const SITE = {
  name: "FFL Accelerator",
  legalName: "Coriolis, LLC",
  /** Social and document titles must not include a price or a tier name. */
  titleDefault: "A store website you own | FFL Accelerator",
  description:
    "Managed ecommerce for a store on your domain. Hosting, design, checkout, catalogs, email, and analytics.",
  role: "A store website you own",
  origin: "Greenville, SC",
  street: "109 Brennan Place",
  locality: "Greenville",
  region: "SC",
  postal: "29609",
  phone: "828-290-9005",
  phoneHref: "tel:828-290-9005",
} as const;

/** Visible footer identity. Same string on every page. No email. */
export const FOOTER_IDENTITY =
  "Coriolis, LLC · 109 Brennan Place, Greenville, SC 29609 · 828-290-9005";

export const TRADEMARK_LINE =
  "Google Analytics and Google Search Console are trademarks of Google LLC. WordPress is a trademark of the WordPress Foundation. WooCommerce is a trademark of Automattic Inc. Cloudflare is a trademark of Cloudflare, Inc. Other product and marketplace names are trademarks of their owners.";

export const SITE_ORIGIN = "https://fflaccelerator.com";

export const CANON_PATHS = {
  logo: "brand/ffl-accelerator-logo.png",
  icon: "brand/ffl-accelerator-icon.png",
  sales: "brand/sales-accelerator.jpg",
} as const;
