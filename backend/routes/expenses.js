const express = require("express");
const router = express.Router();
const isVerified = require("../middleware/isVerified");

const {
  addExpense,
  getCategories,
  getExpense,
  getExpenseByCategory,
  getExpenseByMonth,
  spendingPerMonth,
  spendingPerCategory,
  getReport
} = require("../controllers/expenseController");

//to add a spending
router.post("/addExpense", isVerified, addExpense);

//to get the id and respective category name, so that you can send the id 
// of the category the person has clicked to backend for the apis
// in react while doing res.map , store the id from category as 
// their key to help you while doing useState
router.get("/getCategories", isVerified, getCategories);

//to get all spendiongs of a user
router.get("/getExpense", isVerified, getExpense);

//to get specific category spending 
router.get("/getExpense/category/:category", isVerified, getExpenseByCategory);

//to get specific month spending
router.get("/getExpense/month/:month", isVerified, getExpenseByMonth);

//use for line graph making to show month wise spending
router.get("/spendingPerMonth", isVerified, spendingPerMonth);

//use for pie-chat->category wise spending
router.get("/spendingPerCategory", isVerified, spendingPerCategory);

//to get llm report on spending
router.get("/getReport", isVerified, getReport);

module.exports = router;