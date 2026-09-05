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

/**
 * Full Coriolis ladder lives on coriolisagency.com/ecommerce.
 * Kept here for any legacy PlanCard imports — do not paste onto FFA pages.
 */
export const PLANS: Plan[] = [
  {
    id: "ffl-accelerator",
    name: "FFL Accelerator",
    price: 569,
    hook: "Add Jet Fuel",
    featured: true,
    features: [],
  },
];

/** Locked What’s included bullets for home + /plan (Paul approved 2026-09-04). */
export const INCLUDED: string[] = [
  "WooCommerce store on your domain",
  "FFL Checkout for serialized firearms",
  "FFL Cockpit with 21 distributor catalogs",
  "Connect the register you already run (AIM, MicroBiz, Rapid, Trident 1, Corestore) when you want inventory in sync",
  "GunSearchAgent.com Pro (Betsy on the shop) — writes down what people searched for, including empty searches",
  "Faster pages (Core Web Vitals watched)",
  "Cart fixes that raise completed checkouts",
  "Uptime and error monitoring",
  "Cloudflare DNS & CDN",
  "On-site technical SEO",
  "Email capture, list management, and campaigns (welcome, abandoned cart, back in stock, thank you)",
  "Unlimited hosting on WP Engine (Coriolis is a WP Engine agency partner)",
  "99.95% SLA",
  "VIP support Monday through Friday",
];

export const SETUP = [
  {
    id: "basic" as const,
    name: "Basic Setup",
    price: 500,
    hook: "Branded Online Storefront",
    features: [
      "WooCommerce on your domain, themed for a gun shop, ready for inventory and checkout",
      "Custom Homepage Design",
      "Design Review and Revisions",
      "Advanced Search, Sort, and Filtering",
      "Pricing, Taxes, and Shipping Setup",
      "FFL Cockpit License & Configuration",
      "FFL Checkout License & Configuration",
      "Payment Gateway Installation",
      "Email Capture Implementation",
      "GunSearchAgent.com Setup (Free plan)",
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
