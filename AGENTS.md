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
<!-- END Coriolis process pointer -->
