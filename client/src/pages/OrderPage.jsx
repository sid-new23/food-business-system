import { useEffect, useState } from "react";
import API from "../services/api";

function OrderPage() {
  const [foods, setFoods] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [foodItemId, setFoodItemId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await API.get("/food");
      setFoods(response.data);

      if (response.data.length > 0) {
        setFoodItemId(response.data[0]._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addItem = () => {
  const newItem = {
    foodItemId,
    quantity: Number(quantity),
  };

  setOrderItems([...orderItems, newItem]);

  setQuantity(1);
};

const createOrder = async () => {
    if (!customerName.trim()) {
  alert("Enter Customer Name");
  return;
}

if (orderItems.length === 0) {
  alert("Add at least one item");
  return;
}
  try {
    await API.post("/orders", {
      customerName,
      items: orderItems,
    });

    alert("Order Saved Successfully");

    setCustomerName("");

    setFoodItemId(
      foods.length > 0 ? foods[0]._id : ""
    );

    setQuantity(1);

    setOrderItems([]);

  } catch (error) {
    console.log(error);
  }
};

  const total = orderItems.reduce((sum, item) => {
  const food = foods.find(
    (f) => f._id === item.foodItemId
  );

  if (!food) return sum;

  return sum + food.price * item.quantity;
}, 0);

  return (
    <div className="container mt-4">
        <div className="card shadow mb-4">
        <div className="card-body">
      <h1>Create Order</h1>

      <input
        className="form-control mb-3"
        type="text"
        placeholder="Customer Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />

      <br />
      <br />

      <select
        className="form-select mb-3"
        value={foodItemId}
        onChange={(e) => setFoodItemId(e.target.value)}
      >
        {foods.map((food) => (
          <option key={food._id} value={food._id}>
            {food.name} - ₹{food.price}
          </option>
        ))}
      </select>

      <br />
      <br />

      <input
        className="form-control mb-3"
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <br />
      <br />

<button onClick={addItem} className="btn btn-primary">
  Add Item
</button>
</div>
</div>
<hr />



<div className="card shadow mb-4">
    <div className="card-body">

<h3>Order Summary</h3>

{orderItems.map((item, index) => {
  const food = foods.find(
    (f) => f._id === item.foodItemId
  );

  if (!food) return null;

  return (
    <div key={index} >
      {food.name} x {item.quantity}
      {" = ₹"}
      {food.price * item.quantity}

      <button
        onClick={() => {
          const updated = orderItems.filter(
            (_, i) => i !== index
          );

          setOrderItems(updated);
        }}
      >
        Remove
      </button>
    </div>
  );
})}

    </div>
</div>

<hr />

<div className="alert alert-success">
  <h4>Total = ₹{total}</h4>
</div>

<button
  className="btn btn-success"
  onClick={createOrder}
>

  Save Order
</button>
    </div>
  );
}

export default OrderPage;