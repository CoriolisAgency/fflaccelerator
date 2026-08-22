/**
 * Prefix site-relative paths for GitHub project Pages or custom domain.
 * Always join with a single slash (BASE_URL may or may not end with `/`).
 *
 * Page paths get a trailing slash to match live pretty URLs (`/plan/` etc.).
 * Asset paths (file extension) stay slashless.
 */
export function withBase(path = ""): string {
  let base = import.meta.env.BASE_URL || "/";
  if (!base.startsWith("/")) base = `/${base}`;
  if (!base.endsWith("/")) base = `${base}/`;

  if (!path || path === "/") {
    return base === "/" ? "/" : base;
  }

  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
  const last = clean.split("/").pop() || "";
  const hasExt = /\.[a-zA-Z0-9]{1,8}$/.test(last);
  return hasExt ? `${base}${clean}` : `${base}${clean}/`;
}
