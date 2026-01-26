import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopMusicPopover({ theme }) {
  const tracks = useMemo(() => ([
    { name: "Track 1", public: "/assets/track1.mp3" },
    { name: "Track 2", public: "/assets/track2.mp3" },
    { name: "Track 3", public: "/assets/track3.mp3" },
    { name: "Track 4", public: "/assets/track4.mp3" },
    { name: "Track 5", public: "/assets/track5.mp3" },
{ name: "Track 6", public: "/assets/track6.mp3" },
{ name: "Track 7", public: "/assets/track7.mp3" },
{ name: "Track 8", public: "/assets/track8.mp3" },
{ name: "Track 9", public: "/assets/track9.mp3" },
{ name: "Track 10", public: "/assets/track10.mp3"},

  ]), []);

  const audioRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [vol, setVol] = useState(0.75);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = vol;
  }, [vol]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.src = tracks[idx].src;
    if (playing) a.play().catch(() => {});
  }, [idx, tracks, playing]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnded = () => setIdx((v) => (v + 1) % tracks.length);
    a.addEventListener("ended", onEnded);
    return () => a.removeEventListener("ended", onEnded);
  }, [tracks.length]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (!playing) {
      try { await a.play(); setPlaying(true); } catch {}
    } else {
      a.pause(); setPlaying(false);
    }
  };
  const next = () => setIdx((v) => (v + 1) % tracks.length);
  const prev = () => setIdx((v) => (v - 1 + tracks.length) % tracks.length);

  return (
    <div className="topPlayer" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <audio ref={audioRef} preload="auto" />
      <button className="iconBtn" aria-label="Music" title="Music">♪</button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="topPlayerPopover"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            style={{ borderColor: theme.glow }}
          >
            <div className="tpRow">
              <div className="tpTitle">Music</div>
              <div className="tpTrack" title="Current track">{tracks[idx].name}</div>
            </div>

            <div className="tpControls">
              <button className="btn" onClick={prev} title="Previous">⟲</button>
              <button className="btn primary" onClick={toggle} title="Play / Pause">{playing ? "⏸" : "▶"}</button>
              <button className="btn" onClick={next} title="Next">⟳</button>
            </div>

            <div className="tpVol">
              <div className="smallLabel">Volume</div>
              <div className="volBar">
                <motion.div className="volFill"
                  animate={{ width: `${Math.round(vol * 100)}%` }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  style={{ boxShadow: `0 0 14px ${theme.glow}` }}
                />
              </div>
              <input className="volInput" type="range" min="0" max="1" step="0.01" value={vol} onChange={(e) => setVol(Number(e.target.value))} />
            </div>

            <div className="tpHint">Hover to keep open. Click play to start.</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
