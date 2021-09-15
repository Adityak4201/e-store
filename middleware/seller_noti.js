

const Profile = require('../models/sellerModel');


var sellernoti = async function (sellerid, notification) {
  var datetime = new Date();

  Profile.findOneAndUpdate(
    { _id: sellerid },
    { $push: { noti: {"noti": notification, "date": datetime } } },
    function (error, success) {
      if (error) {
        console.log(error);
      } else {
        // io.emit("s_noti", {"username" : c_username, "s_noti" : notification});
        console.log("successfully send noti");
        // return res.send(success);
      }
    }
  );
}

module.exports = sellernoti;
