import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractAbi } from "../component/Constant";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

export const donationContractSigner = new ethers.Contract(
  contractAddress,
  contractAbi,
  signer
);
export const donationContractProvider = new ethers.Contract(
  contractAddress,
  contractAbi,
  provider
);

const campaigns = [];
export const info = [];

export const DonationContext = React.createContext();

export const DonationProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allCampaigns, setallCampaigns] = useState([]);
  const [allInfo, setAllInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alldocs, setalldocs] = useState([]);

  const checkWalletExist = async () => {
    if (window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length) {
          setCurrentAccount(accounts[0]);
        }
      } catch (error) {
        console.log("error");
        alert("Login to Metamask first");
      }
    }
  };
  const getAllCampaign = async () => {
    try {
      if (window.ethereum !== "undefined") {
        const numCampaign = await donationContractProvider.getCampaignCount();
        for (let i = 0; i < numCampaign.toNumber(); i++) {
          const tx = await donationContractProvider.campaign(i);
          console.log(parseInt(tx.campaignTarget));

          const structuredCampaigns = {
            Position: i,
            Name: tx.campaignName,
            Description: tx.campaignDescription,
            Deadline: new Date(
              tx.campaignDeadline.toNumber() * 1000
            ).toLocaleString(),
            Beneficiary: tx.campaignOwner,
            Target: parseInt(tx.campaignTarget),
            RaisedAmount: parseInt(tx.campaignRaisedAmount) / 10 ** 18,
            MinimumTarget: parseInt(tx.campaignMinimunTarget),
            MinimumDonation: tx.campaignMinimunDonation,

            Status: tx.campaignStatus,
          };
          campaigns.push(structuredCampaigns);
          console.log(structuredCampaigns);
        }
        setallCampaigns(campaigns);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getDonorInfo = async () => {
    try {
      if (window.ethereum !== "undefined") {
        const numCampaign = await donationContractProvider.getCampaignCount();
        for (let i = 0; i < numCampaign.toNumber(); i++) {
          const td = await donationContractProvider.getDonors(i);
          for (let d = 0; d < td.length; d++) {
            const tb = await donationContractProvider.getDonorInfo(i, td[d]);

            const structuredInfo = {
              Position: i,
              From: tb.donorAddress,
              Date: new Date(
                tb.donationDate.toNumber() * 1000
              ).toLocaleString(),

              Amount: parseInt(tb.amount) / 10 ** 18,
            };
            info.push(structuredInfo);
          }
        }

        console.log(info);
      }
      setAllInfo(info);
      console.log(allInfo);
    } catch (error) {}
  };

  const getFirebaseDocs = async () => {
    const ref = collection(db, "campaign");

    getDocs(ref).then((snapshot) => {
      let results = [];
      snapshot.docs.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setalldocs(results);
    });
  };

  useEffect(() => {
    checkWalletExist();
    getAllCampaign();
    getFirebaseDocs();
    getDonorInfo();
  }, []);
  return (
    <DonationContext.Provider
      value={{
        currentAccount,
        donationContractProvider,
        donationContractSigner,
        allCampaigns,
        isLoading,
        setIsLoading,
        getAllCampaign,
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};
