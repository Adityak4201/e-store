const express = require("express");
const router = express.Router();
const Profile = require("../models/sellerModel");
const ShopProduct = require("../models/shoppingModel");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

router.get("/", auth, async (req, res) => {
  res.send({ msg: "Get Your profile", roll: req.user.roll });
});

const storage = multer.diskStorage({
  destination: (req, files, cb) => {
    cb(null, "./uploads/sellerprofile");
  },
  filename: (req, file, cb) => {
    cb(null, req.user._id + path.extname(file.originalname));
  },
});

const filefilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,

  filefilter,
});

router
  .route("/add/image")
  .patch(auth, upload.single("profileimg"), (req, res) => {
    console.log("user is is ", req.user._id);
    if (req.user.roll != "admin") {
      return res
        .status(404)
        .send({ msg: "You can't add profile create a seller account" });
    }

    Profile.findOneAndUpdate(
      { username: req.user.username },
      {
        $set: {
          profileimg: req.file.filename,
        },
      },
      { new: true },
      (err, profile) => {
        if (err) return res.status(500).send(err);
        const response = {
          message: "image added successfully updated",
          data: profile,
        };
        return res.status(200).send(response);
      }
    );
  });

router.route("/add").post(auth, (req, res) => {
  if (req.user.roll != "admin") {
    return res
      .status(404)
      .json({ error: "You can't add profile create a seller account" });
  }

  const profiledata = Profile({
    username: req.user.username,
    ...req.body,
  });
  profiledata
    .save()
    .then((result) => {
      res.json({ result });
    })
    .catch((err) => {
      console.log(err), res.json({ err });
    });
});

router.get("/profile", auth, async (req, res) => {
  if (req.user.roll !== "admin")
    return res
      .status(403)
      .json({ error: "Log in as Seller to view your profile" });

  const username = req.user.username;
  await Profile.findOne({ username }, function (err, docs) {
    if (err) {
      console.log(err);
      return res.status(404).json({ error: err });
    } else {
      console.log("Result : ", docs);
      return res.json(docs);
    }
  });
});

router.route("/getAllMessages/").get(auth, (req, res) => {
  if (req.user.roll != "admin") {
    return res
      .status(404)
      .send({ msg: "You can't add profile create a seller account" });
  }

  Profile.find({ username: req.user.username }, "message", (err, result) => {
    if (err) return res.status(403).send(err);
    return res.json(result);
  });
});

router.route("/getUserMessage/:username").get(auth, (req, res) => {
  if (req.user.roll != "admin") {
    return res.status(404).send({ msg: "create a seller account" });
  }

  var paramsUsername = req.params.username;

  var messages = {};
  Profile.find({ username: req.user.username }, "message", (err, result) => {
    if (err) return res.status(403).send(err);

    var i = 0;
    for (x in result[0]["message"]) {
      if (
        result[0]["message"][x]["by"] == paramsUsername ||
        result[0]["message"][x]["to"] == paramsUsername
      ) {
        messages[i] = result[0]["message"][x];
        i++;
      }
    }
    return res.json(messages);
  });
});

router.post("/addStaff", auth, async (req, res) => {
  if (req.user.roll != "admin") {
    return res.status(404).send({ msg: "Login to add staff" });
  }
  let { s_position, s_username, s_password } = req.body;
  const { username } = req.user;
  if (!s_position || s_position == "") s_position = "staff";
  // const staffFound = await Profile.findOne({
  //   username,
  //   "staff.s_username": s_username,
  // });
  // if (staffFound) throw "Staff username already exists";
  await Profile.findOneAndUpdate(
    {
      username,
      "staff.s_username": { $ne: s_username },
    },
    { $addToSet: { staff: { s_position, s_username, s_password } } },
    { new: true }
  )
    .then((staffAdded) => {
      // console.log(staffAdded);
      if (!staffAdded)
        return res.status(404).json({ error: "Staff username already exists" });
      return res.send({ staffAdded });
    })
    .catch((error) => {
      return res.status(404).json({ error: "No Seller Found" });
    });
});

router.post("/updateStaff", auth, async (req, res) => {
  if (req.user.roll != "admin") {
    return res.status(404).send({ msg: "Login to update staff details" });
  }

  const { s_position, s_username, s_password } = req.body;
  const { username } = req.user;
  await Profile.findOneAndUpdate(
    {
      username,
      "staff.s_username": s_username,
    },
    { $set: { "staff.$": { s_username, s_position, s_password } } },
    { new: true }
  )
    .then((staffUpdated) => {
      // console.log(staffUpdated);
      if (!staffUpdated)
        return res
          .status(404)
          .json({ error: "Staff not found with given username" });
      return res.send({ staffUpdated });
    })
    .catch((error) => {
      return res.status(404).json({ error: "No Seller Found" });
    });
});

router.post("/deleteStaff", auth, async (req, res) => {
  if (req.user.roll != "admin") {
    return res
      .status(404)
      .send({ msg: "Login to delete staff member details" });
  }

  const { s_username } = req.body;
  const { username } = req.user;
  await Profile.updateOne(
    {
      username,
    },
    { $pull: { staff: { s_username } } }
  )
    .then((deleted) => {
      // console.log(deleted);
      return res.json({ msg: "Staff with given username deleted" });
    })
    .catch((error) => {
      return res.status(403).json({ error });
    });
});

router.get("/viewStaff", auth, async (req, res) => {
  if (req.user.roll != "admin") {
    return res.status(404).send({ msg: "Login to see staff list" });
  }
  try {
    const { username } = req.user;
    const seller = await Profile.findOne({ username });
    if (!seller) throw "Seller Profile is missing";
    return res.json({ staff: seller.staff });
  } catch (error) {
    return res.status(403).json({ error });
  }
});

router.post("/addAbout", auth, async (req, res) => {
  if (req.user.roll != "admin") {
    return res.status(404).send({ msg: "Login to see staff list" });
  }
  const { username } = req.user;
  const { about, return_policy } = req.body;
  await Profile.findOneAndUpdate(
    { username },
    { $set: { details: { about, return_policy } } },
    { new: true }
  )
    .then((updatedSeller) => {
      if (!updatedSeller)
        return res
          .status(404)
          .json({ error: "Seller Username does not exists!!" });
      return res.send({ updatedSeller });
    })
    .catch((error) => {
      return res.status(403).json({ error });
    });
});

router.get("/showAbout", auth, async (req, res) => {
  if (req.user.roll != "admin") {
    return res.status(404).send({ msg: "Login to see staff list" });
  }
  try {
    const { username } = req.user;
    const seller = await Profile.findOne({ username });
    if (!seller) throw "Seller Profile is missing";
    return res.json({ details: seller.details });
  } catch (error) {
    return res.status(403).json({ error });
  }
});

router.get("/getBuyersList", auth, async (req, res) => {
  if (req.user.roll != "admin") {
    return res.status(404).send({ msg: "Login to see buyers' list" });
  }
  try {
    const { username } = req.user;
    const seller = await Profile.findOne({ username });
    // console.log(seller);
    const buyersList = await ShopProduct.find(
      { sellerid: seller._id },
      { buyerid: 1, buyername: 1, buyerphone: 1, date: 1, _id: 0 }
    );
    if (!buyersList || buyersList.length === 0) throw "No Buyers";
    // console.log(buyersList);
    return res.json({ buyersList });
  } catch (error) {
    return res.status(403).json({ error });
  }
});

module.exports = router;
