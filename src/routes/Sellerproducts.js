const express = require("express");
const app = express();
const router = express.Router();
const SellerProductsController = require("../controllers/sellerProducts");
const auth = require("../middleware/auth");
const path = require("path");
const multer = require("multer");

app.use(express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, "./noncompress");
    cb(null, "./uploads/products");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.id + file.originalname);
  },
});

const filefilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// path.extname(file.originalname)
const upload = multer({
  storage,
  filefilter,
});

router.get("/", auth, SellerProductsController.getSellerUsername);
router.post(
  "/add/coverImage",
  auth,
  upload.array("coverImage", 6),
  SellerProductsController.uploadProductImages
);
router.post("/deleteCoverImage", auth, SellerProductsController.deleteCoverImg);
router.post("/Add", auth, SellerProductsController.addProduct);
router.get("/getOwnProducts", auth, SellerProductsController.getProductsList);
router.get("/getByLimit", SellerProductsController.getProdByLimit);
router.delete(
  "/deleteSellerProduct/:id",
  auth,
  SellerProductsController.deleteProduct
);
router.post("/updateStatus", auth, SellerProductsController.updateStatus);
router.post(
  "/editProductDetails",
  auth,
  SellerProductsController.editProductDetails
);
router.post("/active", auth, SellerProductsController.toggleActive);

//add SKU
router.post("/addSKU/:id", auth, SellerProductsController.addSKU);
router.get("/getSKU/:id", auth, SellerProductsController.getSKU);

//search APIs
router.post(
  "/searchOrdersByDate",
  auth,
  SellerProductsController.searchOrdersByDate
);
router.post(
  "/searchOrdersByName",
  auth,
  SellerProductsController.searchOrdersByBuyerName
);

//Only to be used for testing purpose
router.get("/allActive", auth, SellerProductsController.activeAll);

module.exports = router;
