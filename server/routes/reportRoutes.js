const express = require("express");
const Order = require("../models/Order");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/daily",
  authMiddleware,
  async (req, res) => {
    try {
      const result = [];

      for (let i = 0; i < 30; i++) {
        const day = new Date();

        day.setDate(day.getDate() - i);

        const start = new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate()
        );

        const end = new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate() + 1
        );

        const orders = await Order.find({
          createdAt: {
            $gte: start,
            $lt: end,
          },
        });

        const expenses = await Expense.find({
  expenseDate: {
    $gte: start,
    $lt: end,
  },
});

        const sales = orders.reduce(
          (sum, order) =>
            sum + order.totalAmount,
          0
        );

        const expenseTotal =
          expenses.reduce(
            (sum, expense) =>
              sum + expense.amount,
            0
          );

        result.push({
          date: start.toISOString().split("T")[0],
          sales,
          expenses: expenseTotal,
          profit:
            sales - expenseTotal,
        });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

router.get(
  "/top-selling",
  authMiddleware,
  async (req, res) => {
    try {
      const orders = await Order.find();

      const itemMap = {};

      orders.forEach((order) => {
        order.items.forEach((item) => {
          const name = item.foodName;

          if (!itemMap[name]) {
            itemMap[name] = 0;
          }

          itemMap[name] += item.quantity;
        });
      });

      const result = Object.entries(itemMap)
        .map(([foodName, quantity]) => ({
          foodName,
          quantity,
        }))
        .sort(
          (a, b) =>
            b.quantity - a.quantity
        )
        .slice(0, 5);

      res.json(result);

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

router.get(
  "/summary",
  authMiddleware,
  async (req, res) => {
    try {
      const now = new Date();

      const startToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      const startWeek = new Date(startToday);
      startWeek.setDate(
        startWeek.getDate() - startWeek.getDay()
      );

      const startMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

      const startYear = new Date(
        now.getFullYear(),
        0,
        1
      );

      async function getData(startDate) {
        const orders = await Order.find({
          createdAt: { $gte: startDate }
        });

        const expenses = await Expense.find({
          expenseDate: { $gte: startDate }
        });

        const sales = orders.reduce(
          (sum, order) =>
            sum + order.totalAmount,
          0
        );

        const expenseTotal =
          expenses.reduce(
            (sum, expense) =>
              sum + expense.amount,
            0
          );

        return {
          sales,
          expenses: expenseTotal,
          profit:
            sales - expenseTotal,
        };
      }

      res.json({
        today: await getData(startToday),
        week: await getData(startWeek),
        month: await getData(startMonth),
        year: await getData(startYear),
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;