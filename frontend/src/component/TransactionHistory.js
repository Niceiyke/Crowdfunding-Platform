import React from "react";
import { info } from "../context/DonationContext";
export default function TransactionHistory(infoID) {
  console.log(info);
  return (
    <div>
      <table className="table table-light" style={{ maxWidth: "480px" }}>
        <thead>
          <tr>
            <th scope="col">index</th>
            <th scope="col">TimeStamp</th>
            <th scope="col">Donor</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>

        <tbody>
          {info
            .filter((info) => {
              return info.Position == infoID.infoID;
            })
            .reverse()
            .map((tx, i) => (
              <tr key={i}>
                <th scope="row">{tx.id}</th>
                <td>{tx.Date}</td>
                <td>{tx.From}</td>
                <td>{tx.Amount} USDT</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
