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
<div className="sideSmoke left"/>
<div className="sideSmoke right"/>


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
   <>
    {/* FX layers (DOM-da görünməlidir) */}
    <div className="sideFlames left" aria-hidden="true" />
    <div className="sideFlames right" aria-hidden="true" />
    <div className="embers" aria-hidden="true" />

    {/* Sənin əsas app wrapper-in */}
    <div className="app">
      <div className="sideSmoke leftSmoke" aria-hidden="true" />
      <div className="sideSmoke rightSmoke" aria-hidden="true" />

      <div className="appRoot">
        <BackgroundArt themeId={themeId} />>

<div className="edgeFlame edgeFlameLeft" aria-hidden="true" />
<div className="edgeFlame edgeFlameRight" aria-hidden="true" />

{/* qalan hissə: TopBar, Hero, ... */}


      <div className="bgVeil" />


<div className="embersLayer" aria-hidden="true">
  {Array.from({ length: 12 }).map((_, i) => (
    <span className="ember" key={i} style={{ "--i": i }} />
  ))}
</div>


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
  </>
}
