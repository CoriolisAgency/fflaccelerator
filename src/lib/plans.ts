export type FeatureLine =
  | string
  | { label: string; items: readonly string[] };

export interface FeatureGroup {
  /** Section id on /plan/. One id per group, matching the social plan. */
  id: string;
  title: string;
  features: readonly FeatureLine[];
}

export const PLAN = {
  eyebrow: "Add Jet Fuel",
  name: "FFL Accelerator",
  badge: "Webmaster Included",
  priceLabel: "$569/mo",
  description:
    "A single, all-in-one, managed ecommerce plan. It includes hosting, site design (Basic or Retail), VIP support, POS integration (any POS), email automation, and analytics (Google Analytics, Google Search Console, on-site search, and email/SMS).",
  includes:
    "Everything in Minute Man, Militia, and Warlord, plus the FFL Accelerator features.",
} as const;

/** Plain-text marketplace names. Never render these as links. */
export const MARKETPLACE_NAMES = [
  "GunBroker.com",
  "AmmoSeek.com",
  "Gun.Deals",
  "WikiArms.com",
  "AmmoBuy.com",
  "ArmsAgora.com",
  "GunAmmo.deals",
  "AmmoBrowser.com",
  "GunMade.com",
  "CaliberKing.com",
  "BulletScout.com",
  "Guns.com",
  "BulletBlaster.com",
] as const;

if (MARKETPLACE_NAMES.length !== 13) {
  throw new Error(
    `Expected 13 marketplace names, found ${MARKETPLACE_NAMES.length}`,
  );
}

/** Cumulative card lines. Superseded support lines are omitted. */
export const GROUPS: readonly FeatureGroup[] = [
  {
    id: "store-hosting",
    title: "Store and hosting",
    features: [
      "Custom website design",
      "Your custom domain",
      "Unlimited hosting",
      "Unlimited storage",
      "Unlimited bandwidth",
      "Unlimited products",
      "Unlimited orders",
      "DNS & Email Administration",
      "SMTP Mail Server",
      "Advanced Search & Filter",
    ],
  },
  {
    id: "inventory-dropshipping",
    title: "Inventory and dropshipping",
    features: [
      "FFL Cockpit license",
      "FFL Checkout license",
      "21 distributor catalogs",
      "20-minute inventory updates",
      "Automated dropshipping",
    ],
  },
  {
    id: "marketplaces",
    title: "Marketplaces",
    features: [
      {
        label: "Marketplace Integrations:",
        items: MARKETPLACE_NAMES,
      },
    ],
  },
  {
    id: "support",
    title: "Support",
    features: [
      "Webmaster Included",
      {
        label: "VIP Support for:",
        items: [
          "WordPress",
          "WooCommerce",
          "Custom Theme",
          "All Other Plugins",
        ],
      },
      "Free Email & Chat Support — One Hour Response Time",
      "Concierge Onboarding",
    ],
  },
  {
    id: "pos",
    title: "POS",
    features: [
      {
        label: "API Based POS Integration:",
        items: [
          "AIM Point of Sale",
          "MicroBiz POS",
          "Trident 1 POS",
          "Corestore POS",
          "and other registers",
        ],
      },
      "Unlimited API Requests",
      "Unlimited Webhooks",
    ],
  },
  {
    id: "performance-monitoring",
    title: "Performance and monitoring",
    features: [
      "24×7 uptime monitoring",
      "Page speed optimization (EverCache)",
      "Shopping cart optimization (LiveCart)",
      "Advanced site monitoring (Uptime Robot)",
      "Cloudflare Web Rules (bot mitigation)",
    ],
  },
  {
    id: "email-marketing",
    title: "Email marketing",
    features: [
      "On-site email capture optimization",
      {
        label: "Automated email campaigns:",
        items: [
          "Welcome",
          "Back In Stock",
          "Browse Abandonment",
          "Thank You for Purchase",
          "Abandoned Cart",
        ],
      },
    ],
  },
  {
    id: "analytics",
    title: "Analytics",
    features: ["Google Analytics Admin", "On-site search"],
  },
  {
    id: "sla",
    title: "SLA",
    features: ["SLA with 99.95% uptime guarantee"],
  },
];

export const SETUP = [
  {
    id: "basic" as const,
    name: "Basic Setup",
    price: 500,
    hook: "Branded Online Storefront",
    features: [
      "WooCommerce Installation",
      "WooCommerce Configuration",
      "WooCommerce Custom Theme",
      "Custom Homepage Design",
      "Design Review and Revisions",
      "Advanced Search, Sort, and Filtering",
      "Pricing, Taxes, and Shipping Setup",
      "FFL Cockpit License & Configuration",
      "FFL Checkout License & Configuration",
      "Payment Gateway Installation",
      "Email Capture Implementation",
      "On-site search setup (free plan)",
      "DNS Configuration (Launch)",
      "Additional custom pages $125 each",
    ],
  },
  {
    id: "retail" as const,
    name: "Retail Setup",
    price: 2500,
    hook: "Full Custom Website",
    features: [
      "Everything in Basic Setup",
      "Advanced Theme Customization & Content",
      "Up to ten (10) custom pages",
      "Unlimited revisions",
      "Complete Email Marketing Setup",
      "Email/CRM Platform Integration",
      "Custom Email Brand Kit",
      "Custom Email Template",
      "Welcome Email Series",
      "Abandoned Cart Series",
      "Back-In-Stock Notifications",
      "Email Deliverability Optimization",
      "Google Analytics Optimization",
    ],
  },
];

export const SWITCH_STEPS = [
  "Keep your domain. We build the new WooCommerce store on it before you give notice.",
  "Move the catalog you care about (your stock, the distributor feeds, or both) and redirect the pages that already rank.",
  "Turn on FFL Checkout, payments, and tax. Buy a mixed cart yourself and make sure it clears.",
  "Connect the register only if you want the counter and the site to share inventory.",
  "Point the domain. You leave with the site.",
] as const;

export function featureText(line: FeatureLine): string[] {
  if (typeof line === "string") return [line];
  return [line.label, ...line.items];
}
