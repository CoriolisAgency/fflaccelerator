export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_HOME: FaqItem[] = [
  {
    q: "What is FFL Accelerator?",
    a: "FFL Accelerator is Coriolis’s managed WooCommerce program for FFLs ($569/mo). It includes GunSearchAgent Pro (Betsy on the dealer site). The site is yours. Betsy on it is included. That feed is what OEMs buy as Brand Intelligence.",
  },
  {
    q: "How much does FFL Accelerator cost?",
    a: "FFL Accelerator is $569/mo. Setup is $500 Basic or $2,500 Retail from Coriolis. Older $269 pricing on this domain was a lower Coriolis tier (Militia), not Accelerator.",
  },
  {
    q: "What does GunSearchAgent Pro add?",
    a: "GunSearchAgent is the Google Analytics replacement for FFL and 2A websites: on-site demand intelligence (what shoppers asked for) plus optional inventory sync. Core is free forever. GunSearchAgent Pro is included with the Coriolis FFL Accelerator plan.",
  },
  {
    q: "Do I own the website?",
    a: "Yes. The site is yours. Betsy on it is included. That feed is what OEMs buy as Brand Intelligence. Cancel anytime; Coriolis will help you migrate or send a backup.",
  },
  {
    q: "Is FFL Accelerator a separate company?",
    a: "No. FFL Accelerator is a Coriolis, LLC program — the top managed WooCommerce plan — not a separate vendor. Checkout and contracts live on coriolisagency.com.",
  },
];

export const FAQ_PLAN: FaqItem[] = [
  {
    q: "How is FFL Accelerator different from Militia or Warlord?",
    a: "Minute Man ($169) is hosting to sell your inventory. Militia ($269) adds dropshipping. Gun Runner ($369) adds VIP support. Warlord ($469) adds POS integration. FFL Accelerator ($569) includes everything in Warlord plus GunSearchAgent Pro, speed and cart work, Cloudflare, on-site SEO, and email programs.",
  },
  {
    q: "Where do I buy?",
    a: "Checkout is on Coriolis, not this site: coriolisagency.com/plans. This page explains the ladder; it is not a second cart.",
  },
  {
    q: "What are the setup fees?",
    a: "One-time setup is $500 Basic or $2,500 Retail from Coriolis. Monthly FFL Accelerator is $569.",
  },
  {
    q: "Can I start on a lower plan and upgrade?",
    a: "Yes. The Coriolis ladder is designed so you can add dropshipping, VIP support, POS, then Accelerator. Talk to Coriolis about the path that matches your inventory model.",
  },
];

export const FAQ_SWITCH: FaqItem[] = [
  {
    q: "Is this a Gearfire website alternative?",
    a: "Yes — for the retailer website. Leave a proprietary storefront (Gearfire, AmmoReady, and similar) for WooCommerce you own, with Betsy included on FFL Accelerator. This is not a request to leave RetailBI or AXIS.",
  },
  {
    q: "What happens to RetailBI if I leave a Gearfire website?",
    a: "RetailBI is Gearfire’s sell-through platform fed by register and ecommerce transactions on the Gearfire network. Leaving a rented website is not the same as leaving RetailBI. If you still report units through AXIS or another Gearfire-network path, that register series can continue. We do not ask anyone to switch off RetailBI.",
  },
  {
    q: "Do I keep my domain and data?",
    a: "Yes. The site is yours. Coriolis migrates the domain, catalog shape, and customer relationship onto open WooCommerce. Betsy on it is included on Accelerator. That feed is what OEMs buy as Brand Intelligence.",
  },
  {
    q: "How much does the switch cost?",
    a: "FFL Accelerator is $569/mo. Setup is $500 Basic or $2,500 Retail. Ask Coriolis about migration credits when you leave another platform.",
  },
];

export const FAQ_ECOMMERCE: FaqItem[] = [
  {
    q: "What is FFL ecommerce as a service?",
    a: "Coriolis builds, hosts, and supports a WooCommerce storefront designed for FFL transfers, serialized catalogs, and distributor feeds. FFL Accelerator ($569/mo) is the top plan and includes GunSearchAgent Pro.",
  },
  {
    q: "Why WooCommerce instead of a closed FFL platform?",
    a: "You own the site and the data. No vendor lock-in on cancel. The stack can take POS APIs, FFL Cockpit catalogs, FastBound coexistence, and Betsy — without renting a black box.",
  },
  {
    q: "Do you automate 4473s or ATF bound books?",
    a: "No. FFL Accelerator is not 4473 or ATF software. Transfers and bound books stay with licensed FFLs and dedicated compliance tools such as FastBound. We provide compliance-aware ecommerce, not legal advice.",
  },
  {
    q: "How much does it cost?",
    a: "FFL Accelerator is $569/mo. Setup is $500 Basic or $2,500 Retail from Coriolis. Lower Coriolis tiers start at $169/mo if you do not need the full Accelerator stack.",
  },
];

export const FAQ_DROPSHIP: FaqItem[] = [
  {
    q: "How does FFL dropshipping work on Accelerator?",
    a: "Militia and above connect 21 distributor catalogs through FFL Cockpit. Orders route to the lowest-cost distributor and ship to the customer’s chosen local FFL. Accelerator sits on top of that stack and adds Betsy.",
  },
  {
    q: "Which plan do I need to dropship?",
    a: "Dropshipping starts at Militia ($269/mo). FFL Accelerator ($569/mo) includes Militia’s catalogs plus Warlord POS options and GunSearchAgent Pro.",
  },
  {
    q: "Do I have to hold inventory?",
    a: "No. Endless-aisle catalogs let licensed dealers sell firearms and accessories without stocking every SKU. You can also sell owned inventory on the same storefront.",
  },
  {
    q: "Is this 4473 software?",
    a: "No. Bound-book and 4473 workflows stay with dedicated compliance systems. Coriolis is ecommerce infrastructure.",
  },
];

export const FAQ_GSA: FaqItem[] = [
  {
    q: "Why is GunSearchAgent in the FFL Accelerator plan?",
    a: "A dark website does not tell you what shoppers asked for. GunSearchAgent is the Google Analytics replacement for FFL and 2A websites. Pro is included so every Accelerator store is a live demand sensor.",
  },
  {
    q: "Is GunSearchAgent still free if I am not on Accelerator?",
    a: "Yes. Core is free forever on gunsearchagent.com. Pro is included with the Coriolis FFL Accelerator plan. Self-serve Pro is also available from GSA if you already have a site.",
  },
  {
    q: "What is Brand Intelligence?",
    a: "Betsy Brand Intelligence measures anonymized shopper search intent across GunSearchEngine, GunSearchAgent embeds, and floor sensors — including unmet (zero-hit) demand. The site is yours. Betsy on it is included. That feed is what OEMs buy as Brand Intelligence.",
  },
  {
    q: "Is this a POS or a sales index?",
    a: "No. It is not a POS and not a same-store unit-sales index. RetailBI’s intelligence is a byproduct of retail operations software. Betsy’s intelligence is a byproduct of product discovery.",
  },
];

export const FAQ_RETAILBI: FaqItem[] = [
  {
    q: "I already feed RetailBI through AXIS. Why does my website matter?",
    a: "AXIS and RetailBI see what rang the register. They do not see what people typed on your site and could not find. Your website is still dark unless a demand sensor is on it.",
  },
  {
    q: "Are you asking me to switch off RetailBI?",
    a: "No. Never. RetailBI is Gearfire’s sell-through platform. Keep feeding the register series if it serves the store. Add search intent on the site you own. The two numbers are not substitutes.",
  },
  {
    q: "What is the difference between Accelerator and free GunSearchAgent?",
    a: "Free GunSearchAgent puts the sensor on a site you already run. FFL Accelerator ($569/mo) is the managed WooCommerce path: Coriolis runs the storefront and includes GunSearchAgent Pro. Self-serve literacy lives at gunsearchagent.com/retailbi-and-your-gun-store.",
  },
  {
    q: "What is RetailBI?",
    a: "RetailBI is Gearfire’s shooting-sports sell-through platform. It aggregates point-of-sale and ecommerce transactions from retailers on the Gearfire network and publishes the monthly RetailBI Firearm Sales Index (same-store adjusted new firearm unit sales). Coriolis is not affiliated with Gearfire or RetailBI; marks belong to their owners.",
  },
];
