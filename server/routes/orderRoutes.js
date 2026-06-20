const express = require("express");
const Order = require("../models/Order");
const FoodItem = require("../models/FoodItem");

const router = express.Router();

//post
router.post("/", async (req, res) => {
  try {
    const { customerName, items } = req.body;

    let orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const food = await FoodItem.findById(item.foodItemId);

      if (!food) {
        return res.status(404).json({
          message: "Food item not found",
        });
      }

      const subtotal = food.price * item.quantity;

      totalAmount += subtotal;

      orderItems.push({
        foodItem: food._id,
        quantity: item.quantity,
        price: food.price,
        subtotal,
      });
    }

    const order = new Order({
      customerName,
      items: orderItems,
      totalAmount,
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//get
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.foodItem", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//get sales
router.get("/sales/today", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      createdAt: {
        $gte: today,
      },
    });

    const totalSales = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    res.json({
      totalOrders: orders.length,
      totalSales,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(
      req.params.id
    );

    if (!deletedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/sales/month", async (req, res) => {
  try {
    const now = new Date();

    const firstDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const orders = await Order.find({
      createdAt: {
        $gte: firstDay,
      },
    });

    const totalSales = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    res.json({
      totalOrders: orders.length,
      totalSales,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/recent", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;