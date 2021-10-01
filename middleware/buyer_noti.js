
const Profile = require('../models/profileModel');


var buyernoti = async function (buyername, notification) {
  var datetime = new Date();

  Profile.findOneAndUpdate(
    { username: buyername },
    { $push: { noti: {"noti": notification, "date": datetime } } },
    function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("successfully send noti");
        // return res.send(success);
      }
    }
  );
}

module.exports = buyernoti;
