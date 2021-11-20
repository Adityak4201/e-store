const express = require("express");
const router = express.Router();
const SellerProfile = require("../controllers/sellerProfile");
const auth = require("../middleware/auth");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, files, cb) => {
    cb(null, "./uploads/sellerprofile");
  },
  filename: (req, file, cb) => {
    // console.log(req.user, file);
    cb(null, req.user._id + file.originalname);
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

router.get("/", auth, SellerProfile.getRole);
router.get("/profile", auth, SellerProfile.getProfile);
router.get("/getBuyersList", auth, SellerProfile.getBuyersList);
router.get("/getBuyersListByLimit", auth, SellerProfile.getBuyersListByLim);
router.get("/getSellerOrders", auth, SellerProfile.getSellerOrders);
router.get("/getSellerOrdersByLimit", auth, SellerProfile.getSellerOrdersByLim);
router.post(
  "/add/image",
  auth,
  upload.single("profileimg"),
  SellerProfile.uploadProfileImg
);
router.post(
  "/coverImg",
  auth,
  upload.single("coverimg"),
  SellerProfile.uploadCoverImg
);
router.post("/add", auth, SellerProfile.addProfile);

//Extra Charges API
router.post("/addExtraCharges", auth, SellerProfile.addExtraCharges);
router.post("/updateExtraCharges", auth, SellerProfile.updateExtraCharges);
router.post("/deleteExtraCharges", auth, SellerProfile.deleteExtraCharges);
router.get("/viewExtraCharges", auth, SellerProfile.viewExtraCharges);

//Staff APIs
router.post("/addStaff", auth, SellerProfile.addStaff);
router.post("/updateStaff", auth, SellerProfile.updateStaff);
router.post("/deleteStaff", auth, SellerProfile.deleteStaff);
router.get("/viewStaff", auth, SellerProfile.viewStaff);

//Search APIs
router.post("/searchByExtraCharges", auth, SellerProfile.searchByExtraCharges);
router.post(
  "/searchByStaffUsername",
  auth,
  SellerProfile.searchByStaffUsername
);

//About APIs
router.post("/addAbout", auth, SellerProfile.addAbout);
router.get("/showAbout", auth, SellerProfile.showAbout);

//Analytics APIs
router.post(
  "/getOrdersForSellerByLimit",
  auth,
  SellerProfile.getBuyerOrdersForSellersByLim
);
router.post("/getBuyersRatio", auth, SellerProfile.getBuyersRatio);
router.get("/latestReviews", auth, SellerProfile.getLatestReviews);

//Payment APIs
router.post("/createOrder", SellerProfile.createPaymentOrder);
router.post("/verifyOrder", auth, SellerProfile.verifyPaymentOrder);

module.exports = router;
