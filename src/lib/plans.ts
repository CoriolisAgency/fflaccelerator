export type PlanId =
  | "minute-man"
  | "militia"
  | "gun-runner"
  | "warlord"
  | "ffl-accelerator";

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  hook: string;
  featured?: boolean;
  features: string[];
  includesFrom?: string;
}

/** Coriolis ladder — checkout lives on coriolisagency.com/plans. */
export const PLANS: Plan[] = [
  {
    id: "minute-man",
    name: "Minute Man",
    price: 169,
    hook: "Sell your inventory",
    features: [
      "Custom website design",
      "Your custom domain",
      "Unlimited hosting, storage, bandwidth",
      "Unlimited products and orders",
      "24×7 uptime monitoring",
      "On-demand paid support ($125/incident)",
    ],
  },
  {
    id: "militia",
    name: "Militia",
    price: 269,
    hook: "Add dropshipping",
    includesFrom: "Minute Man",
    features: [
      "FFL Cockpit license",
      "FFL Checkout license",
      "21 distributor catalogs",
      "20-minute inventory updates",
      "Automated dropshipping",
      "AmmoSeek product feed",
      "GunBroker listing automation",
      "Free email support (24h response)",
    ],
  },
  {
    id: "gun-runner",
    name: "Gun Runner",
    price: 369,
    hook: "Add VIP support",
    includesFrom: "Militia",
    features: [
      "DNS & email administration",
      "SMTP mail server",
      "Advanced search & filter",
      "Google Analytics admin",
      "VIP support for WordPress, WooCommerce, theme, feeds, plugins",
      "Email & chat support (1-hour response)",
    ],
  },
  {
    id: "warlord",
    name: "Warlord",
    price: 469,
    hook: "Add point-of-sale",
    includesFrom: "Gun Runner",
    features: [
      "API-based POS integration",
      "AIM, MicroBiz, Rapid, Trident 1, Corestore",
      "Unlimited API requests & webhooks",
      "Concierge onboarding",
    ],
  },
  {
    id: "ffl-accelerator",
    name: "FFL Accelerator",
    price: 569,
    hook: "Add jet fuel",
    featured: true,
    includesFrom: "Warlord",
    features: [
      "GunSearchAgent Pro (Betsy on your site)",
      "Page speed optimization",
      "Shopping cart optimization",
      "Advanced site monitoring",
      "Cloudflare DNS & CDN",
      "On-site technical SEO",
      "Email capture, list, and campaign management",
    ],
  },
];

export const SETUP = [
  {
    id: "basic" as const,
    name: "Basic Setup",
    price: 500,
    hook: "Branded online storefront",
    features: [
      "WooCommerce install & configuration",
      "Custom theme + homepage design",
      "Design review and revisions",
      "Advanced search, sort, and filtering",
      "Pricing, taxes, and shipping setup",
      "FFL Cockpit & FFL Checkout configuration",
      "Payment gateway installation",
      "Email capture",
      "GunSearchAgent free setup",
      "DNS configuration at launch",
    ],
  },
  {
    id: "retail" as const,
    name: "Retail Setup",
    price: 2500,
    hook: "Full custom website + email",
    features: [
      "Everything in Basic Setup",
      "Advanced theme customization & content",
      "Up to ten custom pages",
      "Unlimited revisions",
      "Complete email marketing setup",
      "CRM integration, brand kit, templates",
      "Welcome, abandoned cart, back-in-stock series",
      "Email deliverability optimization",
      "Google Analytics optimization",
    ],
  },
];
