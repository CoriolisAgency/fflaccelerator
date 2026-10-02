export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_HOME: FaqItem[] = [
  {
    q: "What is FFL Accelerator?",
    a: "A managed ecommerce website for a gun store. We build WooCommerce on your domain, connect catalogs and checkout, and run the shop with you. The site is yours.",
  },
  {
    q: "What do I pay to start?",
    a: "Setup is $500 one-time for a branded online storefront, or $2,500 one-time for a full custom website. Then $569/mo.",
  },
  {
    q: "Can I sell guns I do not stock?",
    a: "Yes. FFL Cockpit streams 21 distributor catalogs. A serialized firearm ships to a receiving FFL. You can still sell what is in the safe. This is not legal advice. We do not run your 4473, NICS, or bound book.",
  },
  {
    q: "I already have a register. Do I throw it out?",
    a: "No. Bring the register you already run. We connect it when you want the floor and the site in sync.",
  },
  {
    q: "I'm on AmmoReady or Gearfire. Can you replace the site without going dark?",
    a: "Yes. We build WooCommerce on your domain first, move what ranks, test a live cart, then cut DNS. Do not give notice until the new store is ready.",
  },
  {
    q: "Do I own it?",
    a: "Yes. It is WordPress. Cancel and the site goes with you.",
  },
  {
    q: "What if I need a lower tier?",
    a: "FFL Accelerator includes everything in Minute Man, Militia, Gun Runner, and Warlord. This site is that offer.",
  },
];

export const FAQ_PLAN: FaqItem[] = [
  {
    q: "What do I get that a template site does not?",
    a: "The website. Your domain, your pages, your checkout. If you leave, you take it.",
  },
  {
    q: "Can I sell guns I do not stock?",
    a: "Yes. FFL Cockpit streams 21 distributor catalogs. A serialized firearm ships to a receiving FFL. You can still sell what is in the safe. This is not legal advice. We do not run your 4473, NICS, or bound book.",
  },
  {
    q: "I want a smaller offer.",
    a: "This page is FFL Accelerator at $569/mo. It includes everything in Minute Man, Militia, Gun Runner, and Warlord.",
  },
  {
    q: "How do I start?",
    a: "Use the contact form. We look at the store you have, pick the $500 or $2,500 setup, and build on your domain before you give anyone notice.",
  },
];

export const FAQ_GSA: FaqItem[] = [
  {
    q: "Why is search included?",
    a: "Because a dark website does not tell you what they asked for. The offer includes GunSearchEngine.com Pro so the store can see its own search, including empty results.",
  },
  {
    q: "Is this a chatbot?",
    a: "Betsy answers people on the site. The reason she is included is the list of what they typed.",
  },
  {
    q: "Do I have to buy a second product?",
    a: "No. GunSearchEngine.com Pro is included in the $569/mo.",
  },
];
