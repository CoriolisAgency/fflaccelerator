export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_HOME: FaqItem[] = [
  {
    q: "What is FFL Accelerator?",
    a: "A managed WooCommerce website for FFL dealers. We build WooCommerce on your domain, connect catalogs and checkout, and run the shop with you. The site is yours.",
  },
  {
    q: "What do I pay to start?",
    a: "Setup is $500 one-time for a branded online storefront, or $2,500 one-time for a full custom website. Then $569/mo.",
  },
  {
    q: "Can I sell distributor catalog items I do not stock?",
    a: "Yes. You can sell distributor catalog items you do not stock. FFL Cockpit streams 21 distributor catalogs, and compliance is handled at checkout. You can still sell what you already have on the shelf. This is not legal advice. We do not run your 4473, NICS, or records.",
  },
  {
    q: "I already have a register. Do I throw it out?",
    a: "No. Bring the register you already run. We connect it when you want the floor and the site in sync.",
  },
  {
    q: "I'm on a hosted catalog platform. Can you replace the site without going dark?",
    a: "Yes. We build WooCommerce on your domain first, move what ranks, test a live cart, then cut DNS. Do not give notice until the new store is ready.",
  },
  {
    q: "Do I own it?",
    a: "Yes. It is WordPress. Cancel and the site goes with you.",
  },
  {
    q: "What if I need a lower tier?",
    a: "FFL Accelerator includes everything in the lower plans. This site is that offer.",
  },
];

export const FAQ_PLAN: FaqItem[] = [
  {
    q: "What do I get that a template site does not?",
    a: "The website. Your domain, your pages, your checkout. If you leave, you take it.",
  },
  {
    q: "Can I sell distributor catalog items I do not stock?",
    a: "Yes. You can sell distributor catalog items you do not stock. FFL Cockpit streams 21 distributor catalogs, and compliance is handled at checkout. You can still sell what you already have on the shelf. This is not legal advice. We do not run your 4473, NICS, or records.",
  },
  {
    q: "I want a smaller offer.",
    a: "This page is FFL Accelerator at $569/mo. It includes everything in the lower plans.",
  },
  {
    q: "How do I start?",
    a: "Use the contact form. We look at the store you have, pick the $500 or $2,500 setup, and build on your domain before you give anyone notice.",
  },
];

export const FAQ_GUIDE: FaqItem[] = [
  {
    q: "What is FFL software?",
    a: "It is three jobs sold under one name. Records software keeps your bound book. A register runs the counter. A website sells online. They are usually separate products.",
  },
  {
    q: "What is the best FFL software?",
    a: "The best one for each job. Pick records software for accuracy, a register your staff likes, and a website you own on your own domain. FFL Accelerator only does the website.",
  },
  {
    q: "Do I need a new register to get a new website?",
    a: "No. Keep the register you already run. FFL Accelerator connects to it by API if you want the counter and the site to share inventory.",
  },
  {
    q: "Does FFL Accelerator keep my records?",
    a: "No. Records belong to your records vendor and your counsel. We don't run your records, and this is not legal advice.",
  },
  {
    q: "What should I ask an FFL website vendor?",
    a: "Ask who owns the site if you leave, whether it runs on your domain, whether you have to change registers, how many distributor catalogs it carries, who fixes it when it breaks, and whether it is month to month.",
  },
  {
    q: "Can I sell products I don't stock?",
    a: "Yes. FFL Accelerator carries 21 distributor catalogs, with inventory updates every 20 minutes and automated dropshipping. Sell your own stock, the catalogs, or both.",
  },
];
