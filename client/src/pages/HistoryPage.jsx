import { useEffect, useState } from "react";
import API from "../services/api";

function HistoryPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get("/orders");

      setOrders(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredOrders = orders.filter((order) =>
  order.customerName
    .toLowerCase()
    .includes(search.toLowerCase())
);

  const deleteOrder = async (id) => {
     if (!window.confirm("Delete this order?"))
    return;
  try {
    await API.delete(`/orders/${id}`);

    fetchOrders();
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="container mt-4">
      <h1>Order History</h1>

    <input
    className="form-control mb-4"
  type="text"
  placeholder="Search Customer"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

<hr />

      {filteredOrders.map((order) => (
        <div
          key={order._id}
        //   style={{
        //     border: "1px solid black",
        //     padding: "10px",
        //     marginBottom: "10px",
        //   }}
        className="card shadow mb-4"
        >
            <div className="card-body">

<div className="d-flex justify-content-between">

  <h4>
    {order.customerName}
  </h4>

  <span className="text-muted">
    {new Date(
      order.createdAt
    ).toLocaleString()}
  </span>

</div>

<hr />

          <table className="table">

  <thead>
    <tr>
      <th>Item</th>
      <th>Qty</th>
      <th>Amount</th>
    </tr>
  </thead>

  <tbody>
    {order.items.map((item, index) => (
      <tr key={index}>

        <td>
  {item.foodItem?.name ||
    "Deleted Food Item"}
</td>

        <td>
          {item.quantity}
        </td>

        <td>
          ₹{item.subtotal.toLocaleString("en-IN")}
        </td>

      </tr>
    ))}
  </tbody>

</table>

          <hr />

          <div className="alert alert-success">

  <strong>
    Total: ₹{order.totalAmount.toLocaleString("en-IN")}
  </strong>

</div>

<button
  className="btn btn-danger"
  onClick={() =>
    deleteOrder(order._id)
  }
>
  Delete Order
</button>

          <small>
            {new Date(order.createdAt).toLocaleString()}
          </small>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HistoryPage;