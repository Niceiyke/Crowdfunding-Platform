import React, { useState, useContext } from "react";
import { ethers } from "ethers";
import { DonationContext } from "../../context/DonationContext";

export default function Donate() {
  const [amount, setAmount] = useState("");
  const [donateID, setdonateID] = useState("");
  const { donationContractSigner } = useContext(DonationContext);

  const donate = async (donationID, amount) => {
    try {
      await donationContractSigner.donate(donationID).then((tx) => {
        console.log(tx);
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmitAmount = (e) => {
    e.preventDefault();
    console.log(amount);
    donate(donateID, amount);
  };
  return (
    <div>
      <form onSubmit={handleSubmitAmount}>
        <label>
          <span>DonationID</span>
          <input type="Number" onChange={(e) => setdonateID(e.target.value)} />
        </label>
        <label>
          <span>Amount</span>
          <input
            type="Number"
            onChange={(e) => setAmount(ethers.utils.parseEther(e.target.value))}
          />
        </label>
        <button type="Submit">Donate</button>
      </form>
    </div>
  );
}
