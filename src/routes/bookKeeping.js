const express = require("express");
const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  viewTransactions,
} = require("../controllers/bookKeeping");
const router = express.Router();
const auth = require("../middleware/auth");

router.post("/addStatement", auth, addTransaction);
router.post("/updateStatement", auth, updateTransaction);
router.delete("/deleteStatement/:id", auth, deleteTransaction);
router.get("/viewStatement", auth, viewTransactions);

module.exports = router;
