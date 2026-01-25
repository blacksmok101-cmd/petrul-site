import { useEffect, useMemo, useState } from "react";
import { themes } from "./data/themes.js";
import { storage } from "./utils/storage.js";

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

export default function App() {
  const [themeIdx, setThemeIdx] = useState(storage.get("petrul_theme_idx", 0));
  const [memeMode, setMemeMode] = useState(storage.get("petrul_meme_mode", false));

  const theme = useMemo(() => themes[themeIdx % themes.length], [themeIdx]);
  const themeId = theme.id;

  useEffect(() => storage.set("petrul_theme_idx", themeIdx), [themeIdx]);
  useEffect(() => storage.set("petrul_meme_mode", memeMode), [memeMode]);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", theme.accent);
    document.documentElement.style.setProperty("--glow", theme.glow);
    document.documentElement.style.setProperty("--font", theme.font);
  }, [theme]);

  const switchDesign = () => setThemeIdx((i) => (i + 1) % themes.length);

  return (
    <div className="app">

      <BackgroundArt themeId={themeId} />
<div className="sideFlame leftFlame"></div>
<div className="sideFlame rightFlame"></div>

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
        <BarronSimulator theme={theme} />
        <MemeMaker />
      </main>

      <Footer />
    </div>
  );
}
