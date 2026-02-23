# AreYouHuman.io

> Prove your humanity through involuntary behavioral micro-signals. No CAPTCHA. No biometrics. Part of the [HumanSign Protocol](https://humansignprotocol.org).

![AreYouHuman](https://areyouhuman.io/api/og)

## How It Works

AreYouHuman captures and analyzes **5 behavioral signal channels** in real-time:

| Channel | What It Measures |
|---------|-----------------|
| **Pointer Dynamics** | Velocity acceleration and path curvature from involuntary micro-corrections |
| **Scroll Entropy** | Shannon entropy of scroll velocity distribution |
| **Keystroke Rhythm** | Coefficient of variation in inter-key timing intervals |
| **Micro-Tremor** | Sub-pixel oscillation patterns from neuromotor activity |
| **Temporal Coherence** | Cross-channel Pearson correlation proving signals share a biological source |

Individual signals can be faked. The physiological **correlation between all channels simultaneously** cannot.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Signals**: Web APIs (PointerEvent, WheelEvent, KeyboardEvent, DeviceMotion)
- **Math**: Custom signal processing (EMA smoothing, Shannon entropy, Pearson correlation)
- **Visualization**: SVG waveforms, canvas share cards
- **Deploy**: Vercel

## Getting Started

```bash
git clone https://github.com/aswinsasi/areyouhuman.io.git
cd areyouhuman.io
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — move your mouse, scroll, or type to begin the scan.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dynamic import wrapper (SSR-safe)
│   ├── layout.tsx            # SEO metadata
│   ├── globals.css           # Cyberpunk theme
│   └── api/og/route.tsx      # OG image generation
├── components/
│   ├── ClientApp.tsx         # Main interactive experience
│   ├── WaveformDisplay.tsx   # Animated signal waveforms
│   ├── CoherenceRing.tsx     # Central score visualization
│   ├── Fingerprint.tsx       # Behavioral fingerprint radial
│   ├── BotComparison.tsx     # Human vs bot signal comparison
│   └── ShareCard.tsx         # Canvas-rendered share image
├── hooks/
│   ├── useSignalCapture.ts   # Raw event listeners
│   ├── useAnalysis.ts        # 60fps signal processing loop
│   └── useDeviceMotion.ts    # Mobile accelerometer
└── lib/
    ├── math.ts               # Signal processing algorithms
    ├── signals.ts            # Types and ring buffers
    ├── constants.ts          # Configuration
    └── analytics.ts          # Event tracking
```

## How Scoring Works

1. **Raw signals** are captured via browser events at 60fps
2. **Instantaneous values** are computed using windowed statistics (last 8–60 samples)
3. **EMA smoothing** produces stable score percentages per channel
4. **Cross-channel coherence** measures Pearson correlation between active channels
5. **Human Score** = weighted combination of channel averages, coherence, time, and active channel bonus
6. After 8 seconds, the result is finalized with a shareable card

## License

MIT © 2026 HumanSign Protocol
