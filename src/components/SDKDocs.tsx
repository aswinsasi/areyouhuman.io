"use client";

import React, { useState } from "react";
import { COLORS } from "@/lib/constants";

function CodeBlock({ code, language, filename }: { code: string; language: string; filename?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(code).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="rounded-lg border overflow-hidden mb-4" style={{ backgroundColor: "#080C14", borderColor: "#1A2030" }}>
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "#1A2030", backgroundColor: "#0A0E18" }}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: COLORS.cyan + "15", color: COLORS.cyan }}>{language}</span>
            <span className="text-xs font-mono" style={{ color: "#667788" }}>{filename}</span>
          </div>
          <button onClick={handleCopy} className="text-[10px] font-mono px-2 py-1 rounded transition-all hover:brightness-125"
            style={{ color: copied ? COLORS.green : "#667788", backgroundColor: copied ? COLORS.green + "15" : "transparent" }}>
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed" style={{ color: "#C8D0DC" }}><code>{code}</code></pre>
    </div>
  );
}

function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex gap-1 mb-4 p-1 rounded-lg" style={{ backgroundColor: "#0A0E18" }}>
      {tabs.map((t) => (
        <button key={t} onClick={() => onChange(t)} className="px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all"
          style={{ backgroundColor: active === t ? COLORS.cyan + "15" : "transparent", color: active === t ? COLORS.cyan : "#667788" }}>{t}</button>
      ))}
    </div>
  );
}

const NAV = [
  { id: "quickstart", label: "Quick Start" },
  { id: "installation", label: "Installation" },
  { id: "integration", label: "Integration" },
  { id: "api", label: "API Reference" },
  { id: "events", label: "Events & Callbacks" },
  { id: "config", label: "Configuration" },
  { id: "server", label: "Server Verification" },
  { id: "examples", label: "Examples" },
];

export default function SDKDocs() {
  const [fw, setFw] = useState("React");
  const [sec, setSec] = useState("quickstart");

  return (
    <main className="relative z-10 max-w-5xl mx-auto px-4 py-6 sm:px-6">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3 hover:brightness-125 transition-all">
            <span className="text-2xl" style={{ color: COLORS.cyan }}>◉</span>
            <span className="font-display text-lg font-bold tracking-tight text-cyber-text">AREYOUHUMAN</span>
          </a>
          <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: COLORS.green + "15", color: COLORS.green }}>SDK</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://github.com/AreYouHuman/sdk" target="_blank" rel="noopener noreferrer"
            className="text-xs font-mono px-3 py-1.5 rounded-lg transition-all hover:brightness-125"
            style={{ backgroundColor: "#1A2030", color: "#E0E8F0", border: "1px solid #2A3040" }}>GitHub ↗</a>
          <a href="https://www.npmjs.com/package/@areyouhuman/sdk" target="_blank" rel="noopener noreferrer"
            className="text-xs font-mono px-3 py-1.5 rounded-lg transition-all hover:brightness-125"
            style={{ backgroundColor: COLORS.cyan + "15", color: COLORS.cyan, border: `1px solid ${COLORS.cyan}30` }}>npm ↗</a>
        </div>
      </header>

      <section className="text-center mb-10">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
          AreYouHuman <span style={{ color: COLORS.cyan }}>SDK</span>
        </h1>
        <p className="text-sm font-mono max-w-lg mx-auto mb-4" style={{ color: "#667788" }}>
          Replace CAPTCHAs with passive behavioral verification. Drop-in integration — 3 lines of code.
        </p>
        <div className="flex items-center justify-center gap-4 text-[10px] font-mono" style={{ color: COLORS.cyan + "80" }}>
          <span>📦 12kb gzipped</span><span>•</span><span>⚡ Zero dependencies</span><span>•</span><span>🔒 Privacy-first</span>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8">
        <nav className="hidden md:block sticky top-6 self-start">
          <div className="flex flex-col gap-1">
            {NAV.map((item) => (
              <button key={item.id} onClick={() => setSec(item.id)} className="text-left text-xs font-mono px-3 py-2 rounded-md transition-all"
                style={{ backgroundColor: sec === item.id ? COLORS.cyan + "10" : "transparent", color: sec === item.id ? COLORS.cyan : "#667788",
                  borderLeft: sec === item.id ? `2px solid ${COLORS.cyan}` : "2px solid transparent" }}>{item.label}</button>
            ))}
          </div>
        </nav>

        {/* Mobile nav */}
        <div className="md:hidden flex gap-1 flex-wrap mb-4">
          {NAV.map((item) => (
            <button key={item.id} onClick={() => setSec(item.id)} className="text-[10px] font-mono px-2 py-1 rounded-md"
              style={{ backgroundColor: sec === item.id ? COLORS.cyan + "15" : "#0C1018", color: sec === item.id ? COLORS.cyan : "#667788" }}>{item.label}</button>
          ))}
        </div>

        <div className="min-w-0">
          {sec === "quickstart" && (<section className="mb-12">
            <h2 className="font-display text-xl font-bold mb-4"><span style={{ color: COLORS.cyan }}>⚡</span> Quick Start</h2>
            <p className="text-sm font-mono mb-4" style={{ color: "#667788" }}>Verify humans in under 5 minutes.</p>
            <CodeBlock language="bash" filename="Terminal" code="npm install @areyouhuman/sdk" />
            <Tabs tabs={["React", "Vue", "Vanilla JS"]} active={fw} onChange={setFw} />
            {fw === "React" && <CodeBlock language="tsx" filename="App.tsx" code={`import { AreYouHuman } from '@areyouhuman/sdk/react';

function LoginPage() {
  const handleVerified = (token: string, score: number) => {
    console.log('Human verified!', { token, score });
    fetch('/api/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  };

  return (
    <div>
      <h1>Sign In</h1>
      <AreYouHuman
        siteKey="ayh_live_xxxxxxxxxxxxxxxx"
        onVerified={handleVerified}
        onError={(err) => console.error(err)}
        theme="dark"
      />
      <button type="submit">Continue</button>
    </div>
  );
}`} />}
            {fw === "Vue" && <CodeBlock language="vue" filename="LoginPage.vue" code={`<template>
  <div>
    <h1>Sign In</h1>
    <AreYouHuman
      site-key="ayh_live_xxxxxxxxxxxxxxxx"
      @verified="onVerified"
      @error="onError"
      theme="dark"
    />
  </div>
</template>

<script setup>
import { AreYouHuman } from '@areyouhuman/sdk/vue';

function onVerified(token, score) {
  fetch('/api/verify', { method: 'POST', body: JSON.stringify({ token }) });
}
function onError(err) { console.error(err); }
</script>`} />}
            {fw === "Vanilla JS" && <CodeBlock language="html" filename="index.html" code={`<script src="https://cdn.areyouhuman.io/sdk/v1.js"><\/script>
<div id="ayh-container"></div>
<script>
  AreYouHuman.render('#ayh-container', {
    siteKey: 'ayh_live_xxxxxxxxxxxxxxxx',
    theme: 'dark',
    onVerified: function(token, score) {
      console.log('Human verified!', token, score);
    }
  });
<\/script>`} />}
          </section>)}

          {sec === "installation" && (<section className="mb-12">
            <h2 className="font-display text-xl font-bold mb-4"><span style={{ color: COLORS.green }}>📦</span> Installation</h2>
            <CodeBlock language="bash" filename="Terminal" code={`# npm\nnpm install @areyouhuman/sdk\n\n# yarn\nyarn add @areyouhuman/sdk\n\n# pnpm\npnpm add @areyouhuman/sdk`} />
            <h3 className="text-sm font-mono font-bold mb-2 mt-6 text-cyber-text">CDN</h3>
            <CodeBlock language="html" filename="index.html" code={`<script src="https://cdn.areyouhuman.io/sdk/v1.min.js"><\/script>`} />
            <h3 className="text-sm font-mono font-bold mb-2 mt-6 text-cyber-text">Requirements</h3>
            <div className="rounded-lg border p-4" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
              <div className="text-xs font-mono space-y-2" style={{ color: "#667788" }}>
                {["Chrome 80+, Firefox 78+, Safari 14+, Edge 80+","React 16.8+ / Vue 3+ / vanilla JS","HTTPS required in production","No cookies or local storage needed"].map(r => (
                  <div key={r} className="flex items-center gap-2"><span style={{ color: COLORS.green }}>✓</span>{r}</div>
                ))}
              </div>
            </div>
          </section>)}

          {sec === "integration" && (<section className="mb-12">
            <h2 className="font-display text-xl font-bold mb-4"><span style={{ color: COLORS.magenta }}>🔗</span> Integration Guide</h2>
            <h3 className="text-sm font-mono font-bold mb-2 text-cyber-text">1. Get Your Site Key</h3>
            <p className="text-xs font-mono mb-4" style={{ color: "#667788" }}>Sign up at <span style={{ color: COLORS.cyan }}>dashboard.areyouhuman.io</span> to get your API keys.</p>
            <div className="rounded-lg border p-4 mb-6" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div><div className="font-bold mb-1" style={{ color: COLORS.green }}>Site Key (public)</div><div style={{ color: "#667788" }}>ayh_live_xxx... — safe for frontend</div></div>
                <div><div className="font-bold mb-1" style={{ color: COLORS.magenta }}>Secret Key (private)</div><div style={{ color: "#667788" }}>ayh_secret_xxx... — server only!</div></div>
              </div>
            </div>
            <h3 className="text-sm font-mono font-bold mb-2 text-cyber-text">2. Add the Component</h3>
            <CodeBlock language="tsx" filename="ProtectedForm.tsx" code={`import { AreYouHuman } from '@areyouhuman/sdk/react';
import { useState } from 'react';

export function ProtectedForm() {
  const [token, setToken] = useState<string | null>(null);
  return (
    <form onSubmit={(e) => { e.preventDefault(); /* submit with token */ }}>
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <AreYouHuman
        siteKey={process.env.NEXT_PUBLIC_AYH_SITE_KEY!}
        onVerified={(t) => setToken(t)}
        mode="inline"
        theme="dark"
      />
      <button disabled={!token}>
        {token ? '✓ Sign In' : 'Verify to continue'}
      </button>
    </form>
  );
}`} />
            <h3 className="text-sm font-mono font-bold mb-2 mt-6 text-cyber-text">3. Verify Server-Side</h3>
            <CodeBlock language="typescript" filename="api/verify.ts" code={`export async function POST(req: Request) {
  const { token } = await req.json();
  const response = await fetch('https://api.areyouhuman.io/v1/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${process.env.AYH_SECRET_KEY}\`,
    },
    body: JSON.stringify({ token }),
  });
  const result = await response.json();
  if (result.success && result.score >= 0.5) {
    return Response.json({ verified: true });
  }
  return Response.json({ verified: false }, { status: 403 });
}`} />
          </section>)}

          {sec === "api" && (<section className="mb-12">
            <h2 className="font-display text-xl font-bold mb-4"><span style={{ color: COLORS.amber }}>📘</span> API Reference</h2>
            <h3 className="text-sm font-mono font-bold mb-3 text-cyber-text">Component Props</h3>
            <div className="rounded-lg border overflow-hidden mb-6" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
              <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead><tr style={{ borderBottom: "1px solid #1A2030", backgroundColor: "#0A0E18" }}>
                  <th className="text-left p-3" style={{ color: COLORS.cyan }}>Prop</th>
                  <th className="text-left p-3" style={{ color: "#667788" }}>Type</th>
                  <th className="text-left p-3" style={{ color: "#667788" }}>Default</th>
                  <th className="text-left p-3" style={{ color: "#667788" }}>Description</th>
                </tr></thead>
                <tbody>
                  {([["siteKey","string","required","Your public site key"],["onVerified","(token, score) => void","required","Success callback"],
                    ["onError","(error) => void","—","Error callback"],["mode","'inline'|'modal'|'invisible'","'inline'","Display mode"],
                    ["theme","'dark'|'light'|'auto'","'auto'","Color theme"],["timeout","number","8000","Analysis duration (ms)"],
                    ["minScore","number","0.5","Minimum score to verify"],["language","string","'en'","Locale code"],
                  ] as const).map(([p,t,d,desc]) => (
                    <tr key={p} style={{ borderBottom: "1px solid #1A203060" }}>
                      <td className="p-3" style={{ color: COLORS.cyan }}>{p}</td>
                      <td className="p-3" style={{ color: COLORS.amber }}>{t}</td>
                      <td className="p-3" style={{ color: "#667788" }}>{d}</td>
                      <td className="p-3" style={{ color: "#667788" }}>{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
            <h3 className="text-sm font-mono font-bold mb-3 text-cyber-text">Server API — POST /v1/verify</h3>
            <CodeBlock language="json" filename="Response" code={`{
  "success": true,
  "score": 0.87,
  "channels": {
    "pointer": 0.72, "scroll": 0.65,
    "keystroke": 0.81, "tremor": 0.69, "coherence": 0.74
  },
  "timestamp": "2026-02-23T14:30:00Z",
  "hostname": "yoursite.com"
}`} />
          </section>)}

          {sec === "events" && (<section className="mb-12">
            <h2 className="font-display text-xl font-bold mb-4"><span style={{ color: COLORS.violet }}>🎯</span> Events & Callbacks</h2>
            <CodeBlock language="tsx" filename="AllEvents.tsx" code={`<AreYouHuman
  siteKey="ayh_live_xxx"
  onVerified={(token, score) => {
    // token: string — send to backend
    // score: 0.0–1.0 human confidence
  }}
  onError={(error) => {
    // error.code: 'TIMEOUT'|'NETWORK'|'INVALID_KEY'|'RATE_LIMITED'
  }}
  onStart={() => { /* analysis began */ }}
  onProgress={(progress, channels) => {
    // progress: 0.0–1.0
    // channels: { pointer: 0.3, scroll: 0.7, ... }
  }}
  onComplete={(result) => {
    // result.verified, result.score, result.token,
    // result.channels, result.duration
  }}
  onExpired={() => { /* token expired — re-verify */ }}
/>`} />
          </section>)}

          {sec === "config" && (<section className="mb-12">
            <h2 className="font-display text-xl font-bold mb-4"><span style={{ color: COLORS.green }}>⚙</span> Configuration</h2>
            <h3 className="text-sm font-mono font-bold mb-2 text-cyber-text">Display Modes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {[{m:"inline",d:"Embeds in your form. Shows waveform while scanning.",c:COLORS.cyan},
                {m:"modal",d:"Centered overlay. Clear verification flow.",c:COLORS.green},
                {m:"invisible",d:"No UI. Silent background analysis. Lowest friction.",c:COLORS.violet}].map(x=>(
                <div key={x.m} className="rounded-lg border p-4" style={{ backgroundColor:"#0C1018",borderColor:"#1A2030",borderLeftWidth:3,borderLeftColor:x.c }}>
                  <div className="text-xs font-mono font-bold mb-1" style={{ color:x.c }}>{x.m}</div>
                  <p className="text-[11px] font-mono" style={{ color:"#667788" }}>{x.d}</p>
                </div>))}
            </div>
            <CodeBlock language="typescript" filename="config.ts" code={`import { configure } from '@areyouhuman/sdk';

configure({
  debug: process.env.NODE_ENV === 'development',
  sampleRate: 60,
  bufferSize: 300,
  channels: ['pointer', 'scroll', 'keystroke', 'tremor', 'coherence'],
  minScore: 0.5,
  timeout: 8000,
  theme: 'dark',
  sounds: true,
  haptics: true,
});`} />
            <h3 className="text-sm font-mono font-bold mb-2 mt-6 text-cyber-text">Environment Variables</h3>
            <CodeBlock language="bash" filename=".env" code={`NEXT_PUBLIC_AYH_SITE_KEY=ayh_live_xxxxxxxxxxxxxxxx\nAYH_SECRET_KEY=ayh_secret_xxxxxxxxxxxxxxxx`} />
          </section>)}

          {sec === "server" && (<section className="mb-12">
            <h2 className="font-display text-xl font-bold mb-4"><span style={{ color: COLORS.magenta }}>🔐</span> Server Verification</h2>
            <div className="rounded-lg border p-4 mb-6" style={{ backgroundColor: COLORS.amber+"08", borderColor: COLORS.amber+"30" }}>
              <div className="text-xs font-mono font-bold mb-1" style={{ color: COLORS.amber }}>⚠ IMPORTANT</div>
              <p className="text-xs font-mono" style={{ color:"#667788" }}>Always verify tokens server-side. Client-side scores can be manipulated.</p>
            </div>
            <Tabs tabs={["Node.js","Python","cURL"]} active={fw} onChange={setFw} />
            {fw === "Node.js" && <CodeBlock language="typescript" filename="server.ts" code={`const res = await fetch('https://api.areyouhuman.io/v1/verify', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${process.env.AYH_SECRET_KEY}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ token: req.body.token }),
});
const data = await res.json();
if (data.success && data.score >= 0.5) { /* human! */ }`} />}
            {fw === "Python" && <CodeBlock language="python" filename="server.py" code={`import requests, os

def verify_human(token):
    r = requests.post('https://api.areyouhuman.io/v1/verify',
        headers={'Authorization': f'Bearer {os.environ["AYH_SECRET_KEY"]}'},
        json={'token': token})
    result = r.json()
    return result['success'] and result['score'] >= 0.5`} />}
            {fw === "cURL" && <CodeBlock language="bash" filename="Terminal" code={`curl -X POST https://api.areyouhuman.io/v1/verify \\
  -H "Authorization: Bearer ayh_secret_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{"token": "ayh_tok_xxx"}'`} />}
          </section>)}

          {sec === "examples" && (<section className="mb-12">
            <h2 className="font-display text-xl font-bold mb-4"><span style={{ color: COLORS.cyan }}>💡</span> Examples</h2>
            <h3 className="text-sm font-mono font-bold mb-2 text-cyber-text">Next.js Login Form</h3>
            <CodeBlock language="tsx" filename="app/login/page.tsx" code={`'use client';
import { AreYouHuman } from '@areyouhuman/sdk/react';
import { useState } from 'react';

export default function LoginPage() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    const form = new FormData(e.currentTarget as HTMLFormElement);
    await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: form.get('email'),
        password: form.get('password'),
        humanToken: token,
      }),
    });
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <AreYouHuman
        siteKey={process.env.NEXT_PUBLIC_AYH_SITE_KEY!}
        onVerified={(t) => setToken(t)}
        mode="inline"
        theme="dark"
      />
      <button disabled={!token || loading}>
        {loading ? 'Signing in...' : token ? '✓ Sign In' : 'Verify first'}
      </button>
    </form>
  );
}`} />
            <h3 className="text-sm font-mono font-bold mb-2 mt-6 text-cyber-text">Invisible Mode (Zero UI)</h3>
            <CodeBlock language="tsx" filename="CheckoutButton.tsx" code={`import { useAreYouHuman } from '@areyouhuman/sdk/react';

export function CheckoutButton() {
  const { verify, isVerifying } = useAreYouHuman({
    siteKey: process.env.NEXT_PUBLIC_AYH_SITE_KEY!,
    mode: 'invisible',
  });

  async function handleCheckout() {
    const result = await verify();
    if (result.verified) await processPayment(result.token);
  }

  return (
    <button onClick={handleCheckout} disabled={isVerifying}>
      {isVerifying ? 'Verifying...' : 'Complete Purchase'}
    </button>
  );
}`} />
          </section>)}

          <div className="rounded-lg border p-6 text-center" style={{ backgroundColor: "#0C1018", borderColor: "#1A2030" }}>
            <h3 className="font-display font-bold text-sm mb-2 text-cyber-text">Need help integrating?</h3>
            <p className="text-xs font-mono mb-4" style={{ color: "#667788" }}>Join the community or reach out to the team.</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a href="https://github.com/AreYouHuman/sdk/issues" target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg font-mono text-xs font-bold hover:brightness-125"
                style={{ backgroundColor: "#1A2030", color: "#E0E8F0", border: "1px solid #2A3040" }}>GitHub Issues</a>
              <a href="https://discord.gg/areyouhuman" target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg font-mono text-xs font-bold hover:brightness-125"
                style={{ backgroundColor: COLORS.violet+"20", color: COLORS.violet, border: `1px solid ${COLORS.violet}30` }}>Discord</a>
              <a href="mailto:sdk@areyouhuman.io"
                className="px-4 py-2 rounded-lg font-mono text-xs font-bold hover:brightness-125"
                style={{ backgroundColor: COLORS.cyan+"15", color: COLORS.cyan, border: `1px solid ${COLORS.cyan}30` }}>Email Support</a>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center py-6 mt-12 border-t" style={{ borderColor: "#1A2030" }}>
        <p className="text-[11px] font-mono text-cyber-muted">© 2026 HumanSign Protocol — Proving humanity through behavioral micro-signals</p>
      </footer>
    </main>
  );
}
