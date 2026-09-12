import motivationGirl from "../assets/motivation banner girl.png";

function MotivationBanner() {
  return (
    <section className="motivation-banner">
      <div className="motivation-text">
        <h2>Keep going!</h2>

        <p>
          Every application gets you closer to
          <br />
          your dream job. 💜
        </p>
      </div>

      <img
        src={motivationGirl}
        className="motivation-girl"
        alt="Girl working on a laptop"
      />
    </section>
  );
}

export default MotivationBanner;