import { useEffect, useMemo, useState } from "react";
import Section from "../components/Section.jsx";
import { storage } from "../utils/storage.js";

function dataUrlFromFile(file){
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(new Error("read failed"));
    r.readAsDataURL(file);
  });
}

export default function MemeMaker() {
  const [memeName, setMemeName] = useState("");
  const [creator, setCreator] = useState("");
  const [file, setFile] = useState(null);

  const [pinned, setPinned] = useState(storage.get("petrul_pinned_meme", null));
  const [album, setAlbum] = useState(storage.get("petrul_meme_album", []));

  useEffect(() => storage.set("petrul_pinned_meme", pinned), [pinned]);
  useEffect(() => storage.set("petrul_meme_album", album), [album]);

  const submit = async () => {
    if(!file || !memeName.trim() || !creator.trim()) return;
    const img = await dataUrlFromFile(file);
    const meme = { id: Date.now(), memeName: memeName.trim(), creator: creator.trim(), img };
    setPinned(meme);
    setAlbum((v) => [meme, ...v]);
    setMemeName(""); setCreator(""); setFile(null);
  };

  return (
    <Section id="meme" title="Meme Creator">
      <div className="memeGrid">
        <div className="memePanel">
          <div className="memePanelTitle">Create a Meme</div>
          <div className="formRow">
            <input className="input" placeholder="Meme name" value={memeName} onChange={(e)=>setMemeName(e.target.value)} />
          </div>
          <div className="formRow">
            <input className="input" placeholder="Creator name" value={creator} onChange={(e)=>setCreator(e.target.value)} />
          </div>
          <div className="formRow">
            <input className="input" type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
          </div>
          <button className="btn primary" onClick={submit}>Create Meme</button>
          <div className="memeHint">Created meme is pinned and added to the album (new → old).</div>
        </div>

        <div className="memePinned">
          <div className="memePanelTitle">Pinned Meme</div>
          {!pinned ? (
            <div className="muted">No pinned meme yet.</div>
          ) : (
            <>
              <div className="pinnedWrap"><img src={pinned.img} alt={pinned.memeName} /></div>
              <div className="pinnedMeta">
                <div>
                  <div className="pinnedTitle">{pinned.memeName}</div>
                  <div className="pinnedSub">by {pinned.creator}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="album">
        <div className="albumTitle">Meme Album</div>
        {album.length === 0 ? (
          <div className="muted">No memes yet.</div>
        ) : (
          <div className="albumGrid">
            {album.map((m)=>(
              <div className="albumItem" key={m.id}>
                <img src={m.img} alt={m.memeName} />
                <div className="albumMeta">
                  <div className="albumName">{m.memeName}</div>
                  <div className="albumCreator">by {m.creator}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
