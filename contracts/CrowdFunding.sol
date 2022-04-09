// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.11;

contract CrowdFunding{

  event LogDonation (uint amount,uint date, address donor);
  event LogNewFundraiser( string name, uint target, uint deadline, address owner,uint id);
  event LogWithdawDonation(uint amount, uint date, address owner);
  event LogClaimRefunds(uint amount, address claimer);

  address public owner; // variable that will contain the address of the contract deployer

    constructor() {
        owner = msg.sender; // setting the owner the contract deployer
    }

modifier onlyOwner() {
    require(msg.sender == owner, "Ownable: caller is not the owner");
    _;
}
uint public minimumPercentageWithdrawal =75;
uint public fee =20;
uint public  numCampaigns;

address payable public feeAddress = payable(0xdD870fA1b7C4700F2BD7f44238821C26f7392148);

mapping(address => bool) public whitelistedAddresses;
mapping(uint => Campaign) public campaign;

struct Donors{
    uint amount;
    address donorAddress;
    uint donationDate;
    }

struct Campaign{
    string campaignName;
    string campaignDescription;
    uint  campaignDeadline;
    uint campaignMinimumDonation;
    uint  campaignTarget;
    uint campaignRaisedAmount;
    uint campaignMinimunTarget;
    address payable campaignOwner;
    bool campaignStatus;
    mapping(address => Donors) donors;
    address[]funders; 
  }



function createCampaign(string calldata _name,string calldata _description, uint _deadline, uint _target,uint _minimumDonation) external returns(uint campaignID) {
campaignID =numCampaigns++;
Campaign storage box = campaign[campaignID];
  box.campaignName= _name;
  box.campaignDescription=_description;
  box.campaignMinimumDonation=_minimumDonation;
 box.campaignDeadline =_deadline;
 box.campaignTarget =_target ;
 box.campaignOwner =payable(msg.sender);
 box.campaignStatus =true;
 box.campaignMinimunTarget= _target*(minimumPercentageWithdrawal/100);

 emit LogNewFundraiser(_name,_target,_deadline,msg.sender,campaignID);
 }


function donate(uint _campaignID)  external payable{
Campaign storage box = campaign[_campaignID];
require(box.campaignStatus == true,"Funding period has ended");
require(block.timestamp < box.campaignDeadline, "Funding period has ended");
require(msg.value>=box.campaignMinimumDonation, " your donation is lower than the required minimum donation");
box.campaignRaisedAmount += msg.value;
if(box.donors[msg.sender].amount !=0){
box.donors[msg.sender].amount+=msg.value;
}
else{
    box.donors[msg.sender].amount=msg.value;
    box.donors[msg.sender].donorAddress=msg.sender;
    box.donors[msg.sender].donationDate=block.timestamp;
    box.funders.push(msg.sender);
}
emit LogDonation(msg.value,block.timestamp,msg.sender);
}

function withdawDonations(uint _campaignID) external {
  Campaign storage box = campaign[_campaignID];
    require(box.campaignStatus == true,"No active Donation");
    require(box.campaignOwner==msg.sender, "your Not The Owner of this Donation");
    require(box.campaignRaisedAmount >= box.campaignTarget, " target has not been met");
    box.campaignStatus =false;
    uint  amount= box.campaignRaisedAmount;
     box.campaignRaisedAmount =0;
    if(whitelistedAddresses[msg.sender]){
        box.campaignOwner.transfer(amount);
        emit LogWithdawDonation (amount,block.timestamp,msg.sender);
    }
    else{
      if(!whitelistedAddresses[msg.sender]){
          uint serviceFee= amount*fee/100;
          uint donatedAmount =amount-serviceFee;
        
         box.campaignOwner.transfer(donatedAmount);
          (feeAddress).transfer(serviceFee);
          emit LogWithdawDonation (amount,block.timestamp,msg.sender);
      }
       
    }

  
}


function claimRefund(uint _campaignID) external {
   Campaign storage box = campaign[_campaignID];
    require(box.campaignStatus == true,"No active campaign to claimAddress refund from");
    require(block.timestamp > box.campaignDeadline,"deadline have not elapsed");
    require(box.campaignRaisedAmount < box.campaignTarget, "raisedAmount has  exceed target");
    require(box.donors[msg.sender].amount > 0, "you have no active Donation");
    uint amount= box.donors[msg.sender].amount;
   box.campaignRaisedAmount -=amount;
    if(box.campaignRaisedAmount ==0){
    box.campaignStatus =false;
    }
    box.donors[msg.sender].amount =0;
    payable(msg.sender).transfer(amount);
  emit LogClaimRefunds (amount,msg.sender);
    
}

// function unclaimedDonation() external onlyOwner{
// require(block.timestamp > unclaimed_deadline, "unclaimed_deadline not yet met");
// require( raisedAmount > 0, "no fund to claim");
// status =false;
// uint amount =raisedAmount;
// raisedAmount =0;
// payable(feeAddress).transfer(amount);

// }

 function getDonorInfo(uint _campaignID, address _donor) external view returns(Donors memory){
  Campaign storage box = campaign[_campaignID];
  return box.donors[_donor];
}

function getDonors(uint _campaignID) external view returns (address[] memory){
    Campaign storage box = campaign[_campaignID];
    return box.funders;

}
function getCampaignCount() external  view returns(uint){
  return numCampaigns;
}

function addUserToWhiteList(address _addressToWhitelist) public onlyOwner {
    whitelistedAddresses[_addressToWhitelist] = true;
}

function removeUserFromWhiteList(address _addressToWhitelist) public onlyOwner {
    whitelistedAddresses[_addressToWhitelist] = false;
}

function verifyIfUserIsWhitListed(address _whitelistedAddress) public view returns(bool) {
    bool userIsWhitelisted = whitelistedAddresses[_whitelistedAddress];
    return userIsWhitelisted;
}

function changeFeeAddress(address _feeAddress) public onlyOwner{
  feeAddress=payable(_feeAddress);
}

}
