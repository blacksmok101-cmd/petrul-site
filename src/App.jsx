import { useEffect, useMemo, useState } from "react";
import { themes } from "./data/themes.js";

import TopBar from "./components/TopBar.jsx";
import TopMusicPopover from "./components/TopMusicPopover.jsx";
import MemeModeOverlay from "./components/MemeModeOverlay.jsx";

import Hero from "./sections/Hero.jsx";
import About from "./sections/About.jsx";
import BarronSimulator from "./sections/BarronSimulator.jsx";
import MemeMaker from "./sections/MemeMaker.jsx";
import Footer from "./sections/Footer.jsx";

function BackgroundArt({ themeId }) {
  return <div className={`bgArt theme${themeId}`} aria-hidden="true" />;
}

/**
 * Sample background image luminance to auto-tune hero readability plate.
 * - Bright background -> stronger plate (higher alpha)
 * - Dark background -> lighter plate (lower alpha)
 */
async function computeBgLuminance(bgUrl) {
  const img = new Image();
  img.src = bgUrl;

  await new Promise((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(new Error("bg load failed"));
  });

  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  // Center-crop area tends to represent what users see behind hero
  const crop = Math.min(img.width, img.height) * 0.65;
  const sx = (img.width - crop) / 2;
  const sy = (img.height - crop) / 2;

  ctx.drawImage(img, sx, sy, crop, crop, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  let sum = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // Perceived luminance
    sum += 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  const avg = sum / (data.length / 4); // 0..255
  return avg / 255; // 0..1
}

function clamp(x, a, b) {
  return Math.max(a, Math.min(b, x));
}

export default function App() {
  const [themeIdx, setThemeIdx] = useState(0);
  const [memeMode, setMemeMode] = useState(false);

  const theme = useMemo(() => themes[themeIdx % themes.length], [themeIdx]);
  const themeId = theme.id;

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", theme.accent);
    document.documentElement.style.setProperty("--glow", theme.glow);
    document.documentElement.style.setProperty("--font", theme.font);
  }, [theme]);

  // Adaptive hero plate based on background image brightness
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const bgUrl = `/assets/bg${themeId}.jpg`;
        const lum = await computeBgLuminance(bgUrl); // 0..1 (1 = bright)
        if (!alive) return;

        /**
         * Map luminance -> alpha:
         * bright (0.75..1.0) => higher alpha
         * dark   (0.00..0.35) => lower alpha
         */
        const strong = clamp(0.18 + lum * 0.32, 0.18, 0.50);
        const soft = clamp(0.10 + lum * 0.18, 0.10, 0.32);
        const shadow = clamp(0.55 + lum * 0.35, 0.55, 0.88);

        document.documentElement.style.setProperty("--heroPlateStrong", `rgba(0,0,0,${strong.toFixed(3)})`);
        document.documentElement.style.setProperty("--heroPlateSoft", `rgba(0,0,0,${soft.toFixed(3)})`);
        document.documentElement.style.setProperty("--heroTextShadow", `rgba(0,0,0,${shadow.toFixed(3)})`);
      } catch {
        // Safe fallback if the image isn't available yet
        document.documentElement.style.setProperty("--heroPlateStrong", "rgba(0,0,0,0.34)");
        document.documentElement.style.setProperty("--heroPlateSoft", "rgba(0,0,0,0.18)");
        document.documentElement.style.setProperty("--heroTextShadow", "rgba(0,0,0,0.75)");
      }
    })();

    return () => {
      alive = false;
    };
  }, [themeId]);

  const switchDesign = () => setThemeIdx((i) => (i + 1) % themes.length);

  return (
    <div className="app">
      <BackgroundArt themeId={themeId} />
      <div className="bgVeil" />

      <TopBar
        themeName={theme.name}
        onSwitchDesign={switchDesign}
        memeMode={memeMode}
        onToggleMeme={() => setMemeMode((v) => !v)}
        rightSlot={<TopMusicPopover theme={theme} />}
      />

      <MemeModeOverlay enabled={memeMode} theme={theme} themeId={themeId} />

      <main className="main">
        <Hero />
        <About />
        <BarronSimulator />
        <MemeMaker />
      </main>

      <Footer />
    </div>
  );
}
