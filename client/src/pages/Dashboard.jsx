import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [sales, setSales] = useState(0);

  const [monthlySales, setMonthlySales] = useState(0);
    const [todayExpenses, setTodayExpenses] = useState(0);
  const [todayProfit, setTodayProfit] = useState(0);
  const [orders, setOrders] = useState(0);
  const [foods, setFoods] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
const [topItems, setTopItems] =
  useState([]);

  const [loading, setLoading] =
  useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {

      setLoading(true);
          const dashboardRes =
  await API.get("/dashboard");

      const salesRes = await API.get("/orders/sales/today");

      const monthRes = await API.get("/orders/sales/month");

      const foodRes = await API.get("/food/count/all");

      const recentRes =
  await API.get("/orders/recent");

    const topRes =
  await API.get(
    "/reports/top-selling"
  );

      setSales(salesRes.data.totalSales);

      setTodayExpenses(
  dashboardRes.data.todayExpenses
);

setTodayProfit(
  dashboardRes.data.todayProfit
);

      setMonthlySales(monthRes.data.totalSales);
      setOrders(salesRes.data.totalOrders);
      setFoods(foodRes.data.totalFoods);
      setRecentOrders(recentRes.data);
      setTopItems(topRes.data);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
  return (
    <div className="container mt-4">
      <h3>
        Loading Dashboard...
      </h3>
    </div>
  );
}

return (
  <div className="container mt-4">
    <h1 className="mb-4">Business Dashboard</h1>

    <div className="row">

      <div className="col-md-4 mb-3">
        <div className="card shadow">
          <div className="card-body">
            <h5 className="card-title">
              Today's Sales
            </h5>

            <h2>₹{sales.toLocaleString("en-IN")}</h2>
          </div>
        </div>
      </div>

      <div className="col-md-4 mb-3">
  <div className="card shadow">
    <div className="card-body">
      <h5 className="card-title">
        Today's Expenses
      </h5>

      <h2>₹{todayExpenses.toLocaleString("en-IN")}</h2>
    </div>
  </div>
</div>

<div className="col-md-4 mb-3">
  <div className="card shadow">
    <div className="card-body">
      <h5 className="card-title">
        Today's Profit
      </h5>

      <h2>₹{todayProfit.toLocaleString("en-IN")}</h2>
    </div>
  </div>
</div>


      <div className="col-md-4 mb-3">
        <div className="card shadow">
          <div className="card-body">
            <h5 className="card-title">
              Monthly Sales
            </h5>

            <h2>₹{monthlySales.toLocaleString("en-IN")}</h2>
          </div>
        </div>
      </div>

      <div className="col-md-4 mb-3">
        <div className="card shadow">
          <div className="card-body">
            <h5 className="card-title">
              Today's Orders
            </h5>

            <h2>{orders}</h2>
          </div>
        </div>
      </div>

      <div className="col-md-4 mb-3">
        <div className="card shadow">
          <div className="card-body">
            <h5 className="card-title">
              Total Food Items
            </h5>

            <h2>{foods}</h2>
          </div>
        </div>
      </div>

    </div>
    <div className="card shadow mt-4">
  <div className="card-body">

    <h3>Recent Orders</h3>

{recentOrders.length === 0 ? (
  <p>No recent orders found</p>
) : (
  recentOrders.map((order) => (
      <div
        key={order._id}
        className="border-bottom mb-2"
      >
        <strong>
          {order.customerName}
        </strong>

        <br />

        ₹{order.totalAmount}
      </div>
    ))
)}

  </div>
</div>

<div className="card shadow mt-4">
  <div className="card-body">

    <h3>
      Top Selling Items
    </h3>

    {topItems.map(
      (item, index) => (
        <div
          key={index}
          className="border-bottom py-2"
        >
          <strong>
            {index + 1}.
            {" "}
            {item.foodName}
          </strong>

          <span className="float-end">
            {item.quantity} sold
          </span>
        </div>
      )
    )}

  </div>
</div>

  </div>
);
}

export default Dashboard;