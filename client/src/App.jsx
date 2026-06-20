import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import FoodPage from "./pages/FoodPage";
import OrderPage from "./pages/OrderPage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  const isLoggedIn =
  localStorage.getItem("token");

  return (
    <BrowserRouter>
     {
  isLoggedIn && (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">       
        

  <div className="container">

    <span className="navbar-text">
  Welcome,
  {localStorage.getItem("username")}
</span>

    <span className="navbar-brand">
      Food Business
    </span>

    <div className="navbar-nav">

      <Link
        className="nav-link"
        to="/"
      >
        Dashboard
      </Link>

      <Link
        className="nav-link"
        to="/foods"
      >
        Foods
      </Link>

      <Link
        className="nav-link"
        to="/orders"
      >
        Orders
      </Link>

      <Link
        className="nav-link"
        to="/history"
      >
        History
      </Link>

    </div>
  </div>
<button
  className="btn btn-danger ms-3"
  onClick={() => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "username"
    );

    window.location.href =
      "/login";
  }}
>
  Logout
</button>
</nav>
  )
}
      <hr />

      <Routes>
        <Route path="/login" element={<LoginPage />}/>
        <Route
         path="/"
         element={
         <ProtectedRoute>
          <Dashboard />
          </ProtectedRoute>}
          />

        <Route
  path="/foods"
  element={
    <ProtectedRoute>
      <FoodPage />
    </ProtectedRoute>
  }
/>

        <Route
  path="/orders"
  element={
    <ProtectedRoute>
      <OrderPage />
    </ProtectedRoute>
  }
/>

        <Route
  path="/history"
  element={
    <ProtectedRoute>
      <HistoryPage />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;