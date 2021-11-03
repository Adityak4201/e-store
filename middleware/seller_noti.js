const Profile = require("../models/sellerModel");

var sellernoti = async function (sellername, type, notification) {
  var datetime = new Date();
  Profile.findOneAndUpdate(
    { username: sellername },
    { $push: { noti: { noti: notification, type, date: datetime } } },
    function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("successfully send noti", success);
      }
    }
  );
};

module.exports = sellernoti;
