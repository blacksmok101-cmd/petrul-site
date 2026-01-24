export default function TopBar({ themeName, onSwitchDesign, memeMode, onToggleMeme, rightSlot }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brandDot" />
        <div>
          <div className="brandTitle">PETRUL</div>
          <div className="logoSub">
  Mystic Community <span className="mcBadge">mC</span>
</div>

        </div>
      </div>

      <nav className="nav">
        <a href="#home">Home</a>
        <a href="#about">About Us</a>
        <a href="#game">Game</a>
        <a href="#meme">Petrul</a>
      </nav>

      <div className="topbarRight">
        <button className="iconBtn" onClick={onSwitchDesign} title="Switch Design" aria-label="Switch Design">✦</button>
        <button className={`iconBtn ${memeMode ? "iconBtnOn" : ""}`} onClick={onToggleMeme} title="Meme Mode" aria-label="Meme Mode">☄</button>
        {rightSlot}
      </div>
    </header>
  );
}
