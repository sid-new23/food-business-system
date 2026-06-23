const express = require("express");
const Expense = require("../models/Expense");
const authMiddleware =
  require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const expenses =
        await Expense.find().sort({
          createdAt: -1,
        });

      res.json(expenses);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const {
  title,
  amount,
  category,
  notes,
  expenseDate,
} = req.body;

      const expense =
        await Expense.create({
  title,
  amount,
  category,
  notes,
  expenseDate,
});

      res.status(201).json(
        expense
      );
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// DELETE expense
router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      await Expense.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message: "Expense deleted",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

module.exports = router;