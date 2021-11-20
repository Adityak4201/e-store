const express = require("express");
const {
  addVisitor,
  getVisitorsForSeller,
  getAllVisitors,
} = require("../controllers/visitor");
const router = express.Router();
const auth = require("../middleware/auth");

router.post("/addVisitor", auth, addVisitor);
router.get("/getVisitorsBySeller", auth, getVisitorsForSeller);
router.get("/getAllVisitors", auth, getAllVisitors);

module.exports = router;
