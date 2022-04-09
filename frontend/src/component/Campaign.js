import { ethers } from "ethers";
import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { DonationContext } from "../context/DonationContext";
import TransactionHistory from "./TransactionHistory";
export default function Campaign() {
  const { id } = useParams();
  const { allCampaigns, donationContractSigner, currentAccount } =
    useContext(DonationContext);
  const [amount, setAmount] = useState();
  const [error, setError] = useState("");
  const [transaction, setTransaction] = useState({});
  console.log(currentAccount);
  const donate = async (e) => {
    e.preventDefault();
    setError("");
    console.log(amount);
    console.log(id);
    const tx = {
      from: currentAccount,
      value: amount,
    };

    try {
      const donantiontx = await donationContractSigner.donate(id, tx);
      await donantiontx.wait(donantiontx).then((tx) => {
        console.log(tx.transactionHash, id);
        const tranx = { TransHash: tx.transactionHash, TransID: id };
        setTransaction(tranx);
        window.location.reload(true);
      });
    } catch (err) {
      console.log(err);
      setError(err.data.message.slice(77));
    }
  };

  const withdraw = async () => {
    setError("");
    try {
      const withdrawal = await donationContractSigner.withdawDonations(id);
      await withdrawal.wait(withdrawal).then((tx) => {
        window.location.reload(true);
      });
    } catch (error) {
      console.log(error.data.message);
      setError(error.data.message.slice(77));
    }
  };

  const earlywithdraw = async () => {
    setError("");
    try {
      const withdrawal = await donationContractSigner.earlyWithdawDonation(id);
      await withdrawal.wait(withdrawal).then((tx) => {
        window.location.reload();
      });
    } catch (error) {
      console.log(error.data.message);
      setError(error.data.message.slice(77));
    }
  };

  return (
    <>
      <div className="container">
        <div className="row ">
          {error && (
            <p className="text-danger text-center">
              <small>{error}</small>
            </p>
          )}
          {[...allCampaigns]
            .filter((campaign) => {
              return campaign.Position == id;
            })
            .map((camp, i) => (
              <div className="col-6 " style={{ marginTop: "60px" }} key={i}>
                <h1 className=" text-center"> Campaign Detail</h1>
                <br />
                <h3 className=" ">PROJECT TITLE: {camp.Name}</h3>
                <br />
                <div className="owner d-flex flex-row align-content-center">
                  <h6 className=""> Beneficiary:</h6>
                  <p>{camp.Beneficiary}</p>
                </div>
                <div className="camp-desc ">
                  <h6 className=""> CAMPAIGN DESCRIPTION: </h6>
                  <p>{camp.Description}</p>
                </div>
                <br />
                <div className="target d-flex flex-row align-content-center">
                  <h6 className=""> Target:</h6>
                  <p>${camp.Target}</p>
                </div>
                <div className="raised-amount d-flex flex-row align-content-center">
                  <h6 className=""> Raised Amount:</h6>
                  <p>${camp.RaisedAmount}</p>
                </div>
                <div className="deadline d-flex flex-row align-content-center ">
                  <h6 className=""> Deadline:</h6>
                  <p>{camp.Deadline}</p>
                </div>
                <div className="text-white">
                  {
                    <ProgressBar
                      now={(camp.RaisedAmount / camp.Target) * 100}
                      label={`$${camp.RaisedAmount}`}
                    />
                  }
                </div>
                <br />
                {+camp.Beneficiary == +currentAccount &&
                  camp.RaisedAmount >= camp.Target && (
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={withdraw}
                    >
                      Withdraw Donations
                    </button>
                  )}

                {+camp.Beneficiary == +currentAccount &&
                  camp.RaisedAmount >= camp.minmumAmount && (
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={earlywithdraw}
                    >
                      early Withdraw Donations
                    </button>
                  )}
              </div>
            ))}
          <div
            className="col-4 justify-content-center"
            style={{ marginTop: "60px" }}
          >
            <div>
              <form onSubmit={donate}>
                <label>
                  <span>Amount</span>
                  <input
                    type="Number"
                    onChange={(e) =>
                      setAmount(ethers.utils.parseEther(e.target.value))
                    }
                  />
                </label>
                <button className="btn btn-success" type="submit">
                  Donate
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <br />
      <TransactionHistory infoID={+id} />
    </>
  );
}
