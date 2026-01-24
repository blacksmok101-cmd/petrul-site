import Section from "../components/Section.jsx";

export default function Hero() {
  return (
    <Section id="home" title="">
      <div className="heroStage">
        <div className="heroHeadline">Welcome to PETRUL</div>
        <div className="heroSub">A mystical journey through the ancient world of petroleum and entertainment</div>
        <div className="heroCtas">
          <a className="btn primary" href="#game">Play Barron Simulator →</a>
          <a className="btn" href="#about">Learn More</a>
        </div>
      </div>
    </Section>
  );
}
