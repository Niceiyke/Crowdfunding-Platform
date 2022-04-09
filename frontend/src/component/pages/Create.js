import { ethers } from "ethers";
import React, { useState, useContext } from "react";
import { DonationContext } from "../../context/DonationContext";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { ref } from "firebase/storage";

export default function Create() {
  const navigate = useNavigate();
  const { donationContractSigner, getAllCampaign } =
    useContext(DonationContext);
  const [name, setName] = useState("");
  const [deadline, setdeadline] = useState("");
  const [target, settarget] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [Image, setImage] = useState("");
  const [miniAmount, setMiniAmount] = useState();
  const [hash, sethash] = useState("");
  let campaignid;

  console.log(hash);
  const uploadPath = `thumbnails/${hash}`;
  const newDonationHandler = async (e) => {
    e.preventDefault();
    setisLoading(true);
    console.log(miniAmount);
    const tx = await donationContractSigner.createCampaign(
      name,
      description,
      deadline,
      target,
      miniAmount
    );
    console.log(tx);
    await tx.wait().then((txv) => {
      console.log(txv);
      sethash(txv.transactionHash);
      campaignid = parseInt(txv.events[0].args.id);

      addToDb();

      setisLoading(false);
      getAllCampaign();

      //window.location.reload(true);
    });
  };

  const addToDb = async () => {
    const img = ref(storage, uploadPath, Image);
    console.log(img);
    const refs = collection(db, "campaign");
    await addDoc(refs, {
      name: name,
      description: description,
      deadline: deadline,
      target: target,
      campaignid: campaignid,
      Image: Image,
      hash: hash,
    });
    // navigate("/");
  };

  return (
    <>
      <div className="creat-card">
        <form onSubmit={newDonationHandler}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              rows="3"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <div className="mb-3">
              <label htmlFor="formFile" className="form-label">
                Image
              </label>
              <input
                className="form-control"
                type="file"
                id="formFile"
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              Deadline
            </label>
            <input
              type="date"
              className="form-control"
              id="date"
              onChange={(e) => {
                setdeadline(
                  parseInt(
                    (new Date(e.target.value).getTime() / 1000).toFixed(0)
                  )
                );
              }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="target" className="form-label">
              Target
            </label>
            <input
              type="number"
              className="form-control"
              id="target"
              onChange={(e) => settarget(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="minimum" className="form-label">
              Minimum Amunt
            </label>
            <input
              type="number"
              className="form-control"
              id="minimum"
              onChange={(e) =>
                setMiniAmount(ethers.utils.parseEther(e.target.value))
              }
            />
          </div>
          {!isLoading && <button type="submit">Create Campaign</button>}
          {isLoading && <button type="submit">loading ...</button>}
        </form>
      </div>
    </>
  );
}
