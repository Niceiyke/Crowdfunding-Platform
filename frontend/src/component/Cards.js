import { useContext } from "react";
import { shortenAddress } from "../utils/ShortenAddress";
import { DonationContext } from "../context/DonationContext";
import { ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";
import profile from "../asset/1.webp";
import "./Card.css";

export const Cards = () => {
  const { allCampaigns } = useContext(DonationContext);

  return (
    <>
      {allCampaigns && (
        <h3 className="text-center display-3"> Ongoing Campaign</h3>
      )}
      <>
        {allCampaigns && (
          <div className="row ">
            {[...allCampaigns]
              .filter((tx) => {
                return tx.Status == true;
              })

              .map((tx, i) => (
                <div className="col-lg-4 col-md-6 col sm-10 my-3" key={i}>
                  <Link to={`/campaigns/${tx.Position}`}>
                    <div
                      style={{
                        width: "24rem",
                        height: "25rem",
                        backgroundColor: "#2D5D35",
                      }}
                    >
                      <img src={profile} className="card-img-top" alt="..." />
                      <div className="card-body">
                        <h5 className="card-title text-white">
                          Title:{tx.Name}
                        </h5>
                        <div className="card-text text-white">
                          Description: {tx.Description}
                        </div>
                        <p className="text-white">
                          Benefeciary:{shortenAddress(`${tx.Beneficiary}`)}
                        </p>
                        <p className="text-white">${tx.Target}</p>
                        <div className="text-white">
                          {
                            <ProgressBar
                              now={(tx.RaisedAmount / tx.Target) * 100}
                              label={`$${tx.RaisedAmount}`}
                            />
                          }
                        </div>
                        <p className="text-white">Deadline:{tx.Deadline}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        )}
      </>
    </>
  );
};
