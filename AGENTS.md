<!-- BEGIN Coriolis process pointer (keep at top) -->
# Read the process first

This repo follows the Coriolis AI Studio process. At the start of every session, read these on `main` in `CoriolisAgency/coriolis` (local `C:\dev\coriolis` or `/coriolis`; `git pull` first). Read the live copy each time; don't work from a pasted or remembered copy.

1. `docs/process/coriolis-ai-studio-process.md` (and the short `docs/process/coriolis-ai-studio-quickstart.md`)
2. `docs/rules.md`: standing rules (page ownership, prices, where ads land, what we don't claim, security)
3. `docs/decisions/`: one file per decision; don't work against a `locked` one
4. `docs/board.md`: the work list

Then:
- Use the six moves: decide, lock, park, unlock, queue, ship. Only Paul locks, unlocks, queues or parks.
- Build only a board line that is `queued` or `shipping`. One item in shipping, plus one urgent fix if production is broken. If there's no line for the work, you're deciding, not building.
- Code goes on a branch and through a PR that names the decision and the board line. Never push code to `main`. Paul merges unless he says "merge N".
- Done means merged. Then set the board line to `shipped` on coriolis main and push.
- Hard stops need Paul's explicit OK: migrations or prod data writes, sends of any kind, anything that costs money, secrets or env changes, force-push, prod flag flips.

This block wins over anything below it, including any "push it" or work-on-main instructions. `BATTLEPLAN.md` and `BATTLEPLAN-ARCHIVE.md` in coriolis are a read-only archive now.
Lane for this repo: FFLA and micro-sites (board prefix FFLA).
SEO rules: coriolis/docs/seo/ARCHITECTURE.md
<!-- END Coriolis process pointer -->

## Coriolis stack and product data rules (public-safe summary)

Coriolis builds and runs a dealer-owned stack:
- **WooCommerce** on the dealer's domain, hosted on WP Engine.
- **FFL Cockpit** for distributor catalogs and FFL checkout.
- A product feed into **GunSearchEngine.com** for consumer search and FFL Analytics.
- **Managed services**: Coriolis people install, run and support it.

The dealer keeps the register they already run (GunBiz, AIM, Trident 1, Rapid Gun Systems) and their bound book.

Rules for this public repo:
- Describe only those layers. Don't add unreleased products, codenames or internal plans here; ask Paul before naming anything not already on the live site.
- Keep the existing hard-nos: no claim that Coriolis builds or sells its own POS, and no 4473/NICS/bound-book automation claims.

Product data rules (safe to state publicly):
- **UPC (GTIN) is the product key.** Match products by normalized UPC (digits only, valid check digit), never by SKU or URL.
- **Coriolis never receives serial numbers, Form 4473 data or bound-book records.** They stay in the dealer's store and bound book. Private SKUs aren't shared either. Never write copy or code that implies otherwise.
- Don't describe search-data collection beyond what the live privacy policy says, and don't claim "including empty searches" data (that copy was removed).
- Internal stack notes live in the private `CoriolisAgency/coriolis` repo.

## Studio reporting

Studio reporting: `.github/workflows/studio.yml` posts CodeFab sprint-row events only (Coding / Verification / Shipped) via `CoriolisAgency/botopticon/.github/workflows/studio-report.yml` (reporter inlined in that workflow; no private checkout). GitHub Actions never merge and never write to repos (`contents: read`, `pull-requests: read`). Merging stays with the agents/Paul. See the reporting rule in CoriolisAgency/botopticon AGENTS.md.
