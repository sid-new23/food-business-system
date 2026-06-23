const express = require("express");
const Order = require("../models/Order");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const today = new Date();

      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const orders = await Order.find({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      const expenses = await Expense.find({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });

      const todaySales = orders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );

      const todayExpenses = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const todayProfit =
        todaySales - todayExpenses;

      res.json({
        todaySales,
        todayExpenses,
        todayProfit,
        todayOrders: orders.length,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;