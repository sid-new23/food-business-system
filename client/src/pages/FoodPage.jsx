import { useEffect, useState } from "react";
import API from "../services/api";


function FoodPage() {
  const [foods, setFoods] = useState([]);
const [name, setName] = useState("");
const [price, setPrice] = useState("");

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await API.get("/food");

      setFoods(response.data);
    } catch (error) {
      console.log(error);
    }
  };

//   if (!name.trim()) {
//   alert("Food name required");
//   return;
// }

// if (!price || price <= 0) {
//   alert("Enter valid price");
//   return;
// }

  const addFood = async () => {
  try {
    await API.post("/food", {
      name,
      price: Number(price),
    });

    setName("");
    setPrice("");

    fetchFoods();
  } catch (error) {
    console.log(error);
  }
};

const deleteFood = async (id) => {
  try {
    await API.delete(`/food/${id}`);

    fetchFoods();
  } catch (error) {
    console.log(error);
  }
};

const updatePrice = async (food) => {
  const newPrice = prompt(
    `Enter new price for ${food.name}`,
    food.price
  );

  if (!newPrice) return;

  try {
    await API.put(`/food/${food._id}`, {
      price: Number(newPrice),
    });

    fetchFoods();
  } catch (error) {
    console.log(error);
  }
};

  return (
  <div className="container mt-4">
    <h1>Food Management</h1>

<div className="card shadow mb-4">
  <div className="card-body">

    <h3>Add Food Item</h3>

    <input
      className="form-control mb-2"
      type="text"
      placeholder="Food Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />

    <input
      className="form-control mb-2"
      type="number"
      placeholder="Price"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
    />

    <button
      className="btn btn-primary"
      onClick={addFood}
    >
      Add Food
    </button>

  </div>
</div>
    <hr />

<table className="table table-striped">
  <thead>
    <tr>
      <th>Food Name</th>
      <th>Price</th>
      <th>Action</th>
      <th>Update Price</th>
    </tr>
  </thead>

  <tbody>
    {foods.map((food) => (
      <tr key={food._id}>
        <td>{food.name}</td>
        <td>₹{food.price}</td>
<td>
  <button
    className="btn btn-danger btn-sm"
    onClick={() => deleteFood(food._id)}
  >
    Delete
  </button>

</td>

<td>
  <button
    className="btn btn-warning btn-sm"
    onClick={() => updatePrice(food)}
  >
    Update
  </button>
</td>
      </tr>
    ))}
  </tbody>
</table>
  </div>
);
}

export default FoodPage;