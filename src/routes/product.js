const express = require("express");
const app = express();
const router = express.Router();
const auth = require("../middleware/auth");
const ProductController = require("../controllers/product");

app.use(express.static("uploads"));

router.get("/products", ProductController.getAllProducts);
router.get("/getProductsByLimit", ProductController.getProductsByLimit);
router.get("/IdProduct/:id", ProductController.getProductById);
router.get("/getProdImg/:id", ProductController.getProductImg);
router.get("/SellerProduct/:username", ProductController.getSellersAllProducts);
router.get(
  "/SellerProductByLimit/:username",
  ProductController.getSellerProdByLim
);
router.get("/getOtherProduct", auth, ProductController.getOtherSellerProd);
router.get(
  "/getOtherProductByLimit",
  auth,
  ProductController.getOtherSellerProdByLim
);
router.post("/AddToCart", auth, ProductController.addProdToCart);
router.post("/RemoveFromCart", auth, ProductController.removeProdFromCart);
router.post("/buyProduct", auth, ProductController.buyProduct);
router.post("/filterProductByCategory", ProductController.filterProdByCategory);

// Product Review APIs
router.post("/addProductReview", auth, ProductController.addProdReview);
router.post("/getRatings", ProductController.getRatings);
router.post("/updateProductReview", auth, ProductController.updateProdReview);

// Payment APIs
router.post("/createOrder", ProductController.createPaymentOrder);
router.post("/verifyOrder", auth, ProductController.verifyPaymentOrder);

module.exports = router;
