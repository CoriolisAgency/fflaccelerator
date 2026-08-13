/**
 * Outbound lattice. Checkout lives on Coriolis. Commercial GSA SERPs stay on GSA.
 */
export const LINKS = {
  home: "https://fflaccelerator.com",
  plans: "https://coriolisagency.com/plans",
  coriolis: "https://coriolisagency.com",
  coriolisSwitch: "https://coriolisagency.com/switch",
  contact: "https://coriolisagency.com/contact",
  coriolisContact: "https://coriolisagency.com/contact",
  msa: "https://docs.google.com/document/d/18FcRaIjiZURO5nztD2Tldz9nuZj-cmXwjdcObcjRP3I/edit?usp=sharing",
  gsa: "https://gunsearchagent.com",
  gsaGa: "https://gunsearchagent.com/google-analytics-alternative-for-ffls",
  gsaRetailBi: "https://gunsearchagent.com/retailbi-and-your-gun-store",
  gse: "https://www.gunsearchengine.com",
  betsyVsRetailBi: "https://www.gunsearchengine.com/betsy-vs-retailbi",
  retailBiIndex: "https://www.gunsearchengine.com/retailbi-firearm-sales-index",
  nicsVsSales: "https://www.gunsearchengine.com/nics-vs-firearm-sales",
  brandIntel: "https://www.gunsearchengine.com/betsy/enterprise",
  oemDemand: "https://www.gunsearchengine.com/oem-firearms-demand-analytics",
  copilot: "https://www.gunsearchengine.com/betsy/enterprise-copilot",
  betsyLive: "https://www.gunsearchengine.com/betsy-live",
  betsy: "https://2abetsy.com",
  artOfDemand: "https://2abetsy.com/art-of-demand-retailbi",
  fflintel: "https://fflintel.com",
  fflintelMethodology: "https://fflintel.com/methodology",
  acceleratorAxis: "https://fflaccelerator.com/retailbi-and-axis",
  x: "https://x.com/2ABetsy",
  youtube: "https://www.youtube.com/@BetsyAI",
  fflCockpit: "https://fflcockpit.com",
  fastBound: "https://fastbound.com",
} as const;

export const SAME_AS = [
  "https://coriolisagency.com",
  "https://www.gunsearchengine.com",
  "https://gunsearchagent.com",
  "https://2abetsy.com",
  "https://fflintel.com",
  "https://fflaccelerator.com",
  "https://x.com/2ABetsy",
  "https://www.youtube.com/@BetsyAI",
] as const;

export const linkClass =
  "font-medium text-sky-400 hover:underline underline-offset-2";

export const btnPlan =
  "inline-flex w-full sm:w-auto items-center justify-center rounded-sm border border-gold/70 bg-gold px-5 py-3 text-sm font-semibold text-ink transition hover:bg-amber-300";

export const btnSecondary =
  "inline-flex w-full sm:w-auto items-center justify-center rounded-sm border border-zinc-500 bg-transparent px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-800";

export const btnSky =
  "inline-flex w-full sm:w-auto items-center justify-center rounded-sm border border-sky-400 bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400";
