const express = require("express");
const FoodItem = require("../models/FoodItem");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();




// GET all food items
router.get(
  "/",
  authMiddleware,
  async (req, res) => {
  try {
    const foods = await FoodItem.find();

    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// ADD food item
router.post("/", authMiddleware, async (req, res) => {
  console.log("POST HIT");
  console.log(req.body);

  try {
    const { name, price } = req.body;

    const food = new FoodItem({
      name,
      price,
    });

//prevent duplicate food names
    const existingFood =
  await FoodItem.findOne({
    name,
  });

if (existingFood) {
  return res.status(400).json({
    message:
      "Food already exists",
  });
}


    const savedFood = await food.save();

    res.status(201).json(savedFood);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

//test
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Food route working"
  });
});

//put
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedFood = await FoodItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedFood) {
      return res.status(404).json({
        message: "Food item not found",
      });
    }

    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//delete
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedFood = await FoodItem.findByIdAndDelete(req.params.id);

    if (!deletedFood) {
      return res.status(404).json({
        message: "Food item not found",
      });
    }

    res.status(200).json({
      message: "Food item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/count/all", async (req, res) => {
  try {
    const count = await FoodItem.countDocuments();

    res.json({
      totalFoods: count,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;