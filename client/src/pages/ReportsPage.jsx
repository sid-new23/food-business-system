import { useEffect, useState } from "react";
import API from "../services/api";

function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [monthlySales, setMonthlySales] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await API.get("/reports/daily");
        const summaryRes =
  await API.get("/reports/summary");

      setReports(response.data);
        setSummary(summaryRes.data);

      let sales = 0;
      let expenses = 0;

      response.data.forEach((day) => {
        sales += day.sales;
        expenses += day.expenses;
      });

      setMonthlySales(sales);
      setMonthlyExpenses(expenses);
      setMonthlyProfit(sales - expenses);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Reports</h1>

      <div className="row">

        <div className="col-md-4 mb-3">
          <div className="card shadow">
            <div className="card-body">
              <h5>Monthly Sales</h5>
              <h2>₹{monthlySales.toLocaleString("en-IN")}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow">
            <div className="card-body">
              <h5>Monthly Expenses</h5>
              <h2>₹{monthlyExpenses.toLocaleString("en-IN")}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow">
            <div className="card-body">
              <h5>Monthly Profit</h5>
              <h2>₹{monthlyProfit.toLocaleString("en-IN")}</h2>
            </div>
          </div>
        </div>

      </div>

{/* ..... */}

        {summary && (
  <div className="row">

    <div className="col-md-4 mb-3">
      <div className="card shadow">
        <div className="card-body">
          <h5>Weekly Profit</h5>
          <h2>
            ₹{summary.week.profit.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>
    </div>

    <div className="col-md-4 mb-3">
      <div className="card shadow">
        <div className="card-body">
          <h5>Monthly Profit</h5>
          <h2>
            ₹{summary.month.profit.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>
    </div>

    <div className="col-md-4 mb-3">
      <div className="card shadow">
        <div className="card-body">
          <h5>Yearly Profit</h5>
          <h2>
            ₹{summary.year.profit.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>
    </div>

  </div>
)}

      <div className="card shadow">
        <div className="card-body">

          <h3 className="mb-3">
            Daily Profit / Loss Report
          </h3>

          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Sales</th>
                <th>Expenses</th>
                <th>Profit</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((day) => (
                <tr key={day.date}>
                  <td>{day.date}</td>
                  <td>₹{day.sales.toLocaleString("en-IN")}</td>
                  <td>₹{day.expenses.toLocaleString("en-IN")}</td>
                  <td>₹{day.profit.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default ReportsPage;