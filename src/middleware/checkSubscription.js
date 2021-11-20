const SellerProfile = require("../models/sellerModel");
const SubscriptionPack = require("../models/sellerSubscriptionModel");
const { response } = require("express");

const vaildateSubs = async function (username, res) {
  var datetime = new Date();
  var sellerSubs = await SellerProfile.findOne(
    { username: username },
    "subscription"
  );
  // console.log(sellerSubs);
  if (sellerSubs == null) {
    return false;
  }

  //   console.log(sellerSubs);
  activationTime =
    sellerSubs.subscription[sellerSubs.subscription.length - 1].activationDate;
  //   console.log("activationTime" , typeof(activationTime) , );

  var subDetails = await SubscriptionPack.findOne({
    _id: sellerSubs.subscription[sellerSubs.subscription.length - 1].sub_id,
  }).exec();

  console.log("subDetails", subDetails);
  if (subDetails === null) return false;

  var endTime = subDetails.endtime;

  console.log("Activation date is: " + activationTime.toLocaleString());

  var endDate = new Date(activationTime.getTime());
  endDate.setMonth(activationTime.getMonth() + endTime);

  const todayDate = new Date();
  console.log("endate", endDate);

  if (todayDate - endDate > 0) {
    console.log("false");
    return false;
  } else {
    console.log("true");
    return true;
  }
};

module.exports = vaildateSubs;
