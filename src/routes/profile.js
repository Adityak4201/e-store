const express = require("express");
const router = express.Router();
const BuyerController = require("../controllers/buyerProfile");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, files, cb) => {
    cb(null, "./uploads/profile");
  },
  filename: (req, file, cb) =>
    cb(null, req.user._id + path.extname(file.originalname)),
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

router.get("/", auth, BuyerController.homeRoute);
router.patch(
  "/add/image",
  auth,
  upload.single("profileimg"),
  BuyerController.uploadProfileImg
);
router.post("/add", auth, BuyerController.addProfileInfo);
router.post("/editAddress", auth, BuyerController.editAddress);
router.get("/getAddress", auth, BuyerController.getAddressDetails);
router.get("/shopsByLimit", BuyerController.getShopsByLim);
router.get("/shops", BuyerController.getAllShops);
router.post("/cancelOrder", auth, BuyerController.cancelOrder);
router.get("/getProfileImg/:username", BuyerController.getProfileImg);

// filters
router.post("/filterBySellerCategory", BuyerController.filterBySellerCategory);
router.post("/filterShopsByLocation", BuyerController.filterShopsByLocation);

//search
router.post("/searchByProduct", BuyerController.searchByProduct);
router.post("/searchByShops", BuyerController.searchByShops);

//Reviews and ratings
router.post("/addShopReview", auth, BuyerController.addShopReview);
router.post("/updateShopReview", auth, BuyerController.updateShopReview);
router.post("/getRatings", BuyerController.getShopRatings);

router.post("/message", auth, BuyerController.sendMsgToSeller);
router.get("/userMessage", auth, BuyerController.findBuyerMsg); // all chats of a user whoever he messaged or from whoever he recived message
router.post("/chatWithUser", auth, BuyerController.findBuyerSellerMsg); // user message to any other particular user
router.post("/recentChat", auth, BuyerController.recentChats); // all recent chats
router.post("/messagedTo", auth, BuyerController.distinctChatUsers); // all user who logged in user have messaged

module.exports = router;
