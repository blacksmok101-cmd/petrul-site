import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function rand(min, max) { return Math.random() * (max - min) + min; }

function posterize(v, levels) {
  const step = 255 / (levels - 1);
  return Math.round(Math.round(v / step) * step);
}

async function makeSpritesFromBackground(bgUrl, count) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = bgUrl;

  await new Promise((res, rej) => {
    img.onload = () => res();
    img.onerror = () => rej(new Error("Failed to load background image for meme sprites"));
  });

  const sprites = [];
  for (let i = 0; i < count; i++) {
    const size = 96;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const crop = rand(140, Math.min(img.width, img.height) * 0.5);
    const sx = rand(0, img.width - crop);
    const sy = rand(0, img.height - crop);

    // balloon / bubble mask
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 3, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(img, sx, sy, crop, crop, 0, 0, size, size);

    // meme-ish filter
    const imd = ctx.getImageData(0, 0, size, size);
    const d = imd.data;
    for (let p = 0; p < d.length; p += 4) {
      let r = d[p], g = d[p + 1], b = d[p + 2];

      // contrast
      const c = 1.32;
      r = (r - 128) * c + 128;
      g = (g - 128) * c + 128;
      b = (b - 128) * c + 128;

      // tint
      r *= 1.05;
      b *= 1.03;

      // clamp
      r = Math.max(0, Math.min(255, r));
      g = Math.max(0, Math.min(255, g));
      b = Math.max(0, Math.min(255, b));

      // posterize
      r = posterize(r, 7);
      g = posterize(g, 7);
      b = posterize(b, 7);

      d[p] = r; d[p + 1] = g; d[p + 2] = b;
      d[p + 3] = 200; // transparency
    }
    ctx.putImageData(imd, 0, 0);

    // glossy highlight
    const grad = ctx.createRadialGradient(28, 26, 6, 28, 26, 56);
    grad.addColorStop(0, "rgba(255,255,255,0.40)");
    grad.addColorStop(1, "rgba(255,255,255,0.00)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    ctx.restore();

    sprites.push(canvas.toDataURL("image/png"));
  }
  return sprites;
}

export default function MemeModeOverlay({ enabled, theme, themeId }) {
  const count = 14;
  const bgUrl = useMemo(() => `/assets/bg${themeId}.jpg`, [themeId]);

  const [sprites, setSprites] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!enabled) return;

    let alive = true;
    (async () => {
      try {
        const out = await makeSpritesFromBackground(bgUrl, count);
        if (!alive) return;
        setSprites(out);

        // movement paths (full screen drifting)
        const its = Array.from({ length: count }).map((_, i) => {
          const x0 = rand(5, 95), y0 = rand(10, 90);
          const x1 = rand(5, 95), y1 = rand(10, 90);
          const x2 = rand(5, 95), y2 = rand(10, 90);
          return { id: i, s: rand(0.80, 1.12), d: rand(12, 22), r: rand(-8, 8), x: [x0, x1, x2, x0], y: [y0, y1, y2, y0] };
        });
        setItems(its);
      } catch {
        // If bg is missing, keep empty sprites to avoid breaking UI.
        setSprites([]);
        setItems([]);
      }
    })();

    return () => { alive = false; };
  }, [enabled, bgUrl]);

  return (
    <AnimatePresence>
      {enabled && (
        <motion.div
          className="memeOverlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          aria-hidden="true"
        >
          {items.map((it) => (
            <motion.div
              key={it.id}
              className="memeBubble"
              style={{ left: `${it.x[0]}%`, top: `${it.y[0]}%`, boxShadow: `0 0 18px ${theme.glow}` }}
              initial={{ scale: it.s, rotate: it.r }}
              animate={{
                left: it.x.map((v) => `${v}%`),
                top: it.y.map((v) => `${v}%`),
                rotate: [it.r, it.r + 6, it.r - 6, it.r],
              }}
              transition={{ duration: it.d, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="memeBubbleInner" />
              {sprites[it.id] ? <img src={sprites[it.id]} alt="" /> : null}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
