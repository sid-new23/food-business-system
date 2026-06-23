//wait
import { useEffect, useState } from "react";
import API from "../services/api";


function ExpensePage() {
const [expenses, setExpenses] = useState([]);
const [title, setTitle] = useState("");
const [amount, setAmount] = useState("");

const [category, setCategory] = useState("");
const [expenseDate,
  setExpenseDate] =
  useState("");
const [notes, setNotes] = useState("");

  useEffect(() => {
  fetchExpenses();
}, []);

  const fetchExpenses = async () => {
  try {
    const response = await API.get("/expenses");
    setExpenses(response.data);
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

  const addExpense = async () => {
  try {
    if (!title.trim()) {
  alert("Expense name required");
  return;
}

if (!amount || amount <= 0) {
  alert("Enter valid amount");
  return;
}

if (!expenseDate) {
  alert("Select expense date");
  return;
}
    await API.post("/expenses", {
      title,
      amount: Number(amount),
      category,
      notes,
      expenseDate,
    });

    setTitle("");
    setAmount("");
    setCategory("");
    setNotes("");
    setExpenseDate("");

    fetchExpenses();
  } catch (error) {
    console.log(error);
  }
};

const deleteExpense = async (id) => {
  try {
    await API.delete(`/expenses/${id}`);
    fetchExpenses();
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
    <h1>Expense Management</h1>

<div className="card shadow mb-4">
  <div className="card-body">

    <h3>Add Food Item</h3>

<input
  className="form-control mb-2"
  type="text"
  placeholder="Expense Name"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>

<input
  className="form-control mb-2"
  type="number"
  placeholder="Amount"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
/>

<input
  className="form-control mb-2"
  type="text"
  placeholder="Category"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
/>

<input
  type="date"
  className="form-control mb-2"
  value={expenseDate}
  onChange={(e) =>
    setExpenseDate(
      e.target.value
    )
  }
/>

<input
  className="form-control mb-2"
  type="text"
  placeholder="Notes"
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
/>


    <button
      className="btn btn-primary"
      onClick={addExpense}
    >
      Add Expense
    </button>

  </div>
</div>
    <hr />

<table className="table table-striped">
  <thead>
    <tr>
      <th>Expense</th>
<th>Amount</th>
<th>Category</th>
<th>Notes</th>
<th>Action</th>
    </tr>
  </thead>

<tbody>
  {expenses.map((expense) => (
    <tr key={expense._id}>
      <td>{expense.title}</td>
      <td>₹{expense.amount.toLocaleString("en-IN")}</td>
      <td>{expense.category}</td>
      <td>{expense.notes}</td>

      <td>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => {
  if (
    window.confirm(
      "Are you sure you want to delete this expense?"
    )
  ) {
    deleteExpense(expense._id);
  }
}}
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

export default ExpensePage;