const BODY = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="robots" content="noindex, nofollow" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Gone | FFL Accelerator</title>
    <style>
      :root { color-scheme: dark; }
      body {
        margin: 0;
        min-height: 100vh;
        background: #0a1220;
        color: #e4e4e7;
        font: 16px/1.5 "Segoe UI", ui-sans-serif, system-ui, sans-serif;
      }
      main { max-width: 40rem; margin: 0 auto; padding: 4rem 1.25rem; }
      p.kicker {
        margin: 0;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #d4a017;
      }
      h1 { margin: 0.75rem 0 0; font-size: 1.875rem; color: #fff; }
      p { margin: 1rem 0 0; color: #a1a1aa; }
      ul { margin: 1.5rem 0 0; padding: 0; list-style: none; }
      li { margin: 0.5rem 0 0; }
      a { color: #38bdf8; }
    </style>
  </head>
  <body>
    <main>
      <p class="kicker">410</p>
      <h1>This page is gone</h1>
      <p>That address was retired. It is not coming back.</p>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/plan/">What is included</a></li>
        <li><a href="/contact/">Contact</a></li>
      </ul>
    </main>
  </body>
</html>
`;

const HEADERS = {
  "content-type": "text/html; charset=utf-8",
  "cache-control": "public, max-age=0, must-revalidate",
  "x-robots-tag": "noindex, nofollow",
};

export function GET(): Response {
  return new Response(BODY, { status: 410, headers: HEADERS });
}

export function HEAD(): Response {
  return new Response(null, { status: 410, headers: HEADERS });
}
