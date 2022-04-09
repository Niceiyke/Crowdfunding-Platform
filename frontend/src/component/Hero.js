import "./Hero.css";
import hero1 from "../asset/hero-one-big.jpg";
import hero2 from "../asset/hero-one-small.jpg";
import hero3 from "../asset/hero-one-small-2.jpg";
import { Cards } from "./Cards";

export default function Hero() {
  return (
    <>
      <div className="hero-area container-fluid">
        <div className="hero-text">
          <div className="container-fluid">
            <div className=" row justify-content-center">
              <div className="col-xl-10">
                <h3 className="tagline text-center display-6">
                  Fundraising Platform
                </h3>
                <h1 className="title  text-center">
                  {" "}
                  Promote your Course through Decentralized Funding.{" "}
                </h1>
              </div>
              <a href="/create">
                <button type="button" className="btn btn-success">
                  Create Campaign
                </button>
              </a>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="col-md-3 ">
            <img className=" img-fluid image-small" src={hero2} alt={hero2} />
          </div>
          <div className="col-md-6 ">
            <img className=" img-fluid" src={hero1} alt={hero1} />
          </div>
          <div className="col-md-3 ">
            <img className=" img-fluid image-small" src={hero3} alt={hero3} />
          </div>
        </div>
      </div>
      <section>
        <Cards />
      </section>
    </>
  );
}
