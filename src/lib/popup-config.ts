/** Inline window.CORIOLIS_POPUP for the FFLA site. Copy is from the shared SPEC. */

export const FFLA_POPUP_CONFIG = {
  site: "ffla",
  lane: "ffla-managed",
  endpoint: "/api/popup",
  privacyUrl: "/privacy/",
  denyPaths: ["/contact"],
  copy: {
    eyebrow: "FFL Accelerator",
    headline: "Your store, fully managed.",
    body: "We build, host and run your FFL ecommerce store. You sell. Leave your email and we'll send the setup steps.",
    button: "Send the setup steps",
    consent:
      "By signing up you agree to get email from FFL Accelerator. Unsubscribe anytime. Privacy policy.",
    success: {
      headline: "Sent. Check your inbox.",
      body: "Want to talk now? Use the form or call.",
    },
  },
  fields: [{ name: "company", label: "Store name (optional)", type: "text" }],
  ctas: [
    { label: "Start Basic setup", href: "/plan/#setup", kind: "setup" },
    { label: "Start Retail setup", href: "/plan/#setup", kind: "setup" },
    { label: "Talk to us", href: "/contact/", kind: "lead" },
    { label: "Call us", href: "tel:+12792586771", kind: "call" },
  ],
} as const;
