/**
 * On-site paths only. Do not add off-site commercial URLs.
 */
import { withBase } from "./base";

export const PATHS = {
  home: "/",
  plan: "/plan/",
  contact: "/contact/",
  about: "/about/",
  privacy: "/privacy/",
  guide: "/guides/gun-store-software/",
  confirmed: "/confirmed/",
  lp: "/lp/",
  migration: "/ffl-website-migration/",
  hosting: "/managed-ffl-website-hosting/",
  homeBased: "/ffl-software-home-based-business/",
} as const;

export function planAnchor(id: string): string {
  return `${withBase("plan")}#${id}`;
}

export const linkClass =
  "underline decoration-line underline-offset-4 hover:decoration-ink";

export const btnPlan =
  "inline-flex min-h-11 items-center bg-gold px-4 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-field hover:text-paper";

export const btnSecondary =
  "inline-flex min-h-11 items-center text-sm font-medium underline decoration-line underline-offset-4 hover:decoration-ink";

export const btnSky =
  "inline-flex min-h-11 items-center bg-gold px-4 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-field hover:text-paper";
