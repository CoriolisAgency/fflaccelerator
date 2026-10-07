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
} as const;

export function planAnchor(id: string): string {
  return `${withBase("plan")}#${id}`;
}

export const linkClass =
  "font-medium text-sky-400 hover:underline underline-offset-2";

export const btnPlan =
  "inline-flex w-full sm:w-auto items-center justify-center rounded-sm border border-gold/70 bg-gold px-5 py-3 text-sm font-semibold text-ink transition hover:bg-amber-300";

export const btnSecondary =
  "inline-flex w-full sm:w-auto items-center justify-center rounded-sm border border-zinc-500 bg-transparent px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-800";

export const btnSky =
  "inline-flex w-full sm:w-auto items-center justify-center rounded-sm border border-sky-400 bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400";
