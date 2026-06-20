import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function LoginPage() {
    const navigate = useNavigate();

if (localStorage.getItem("token")) {
  navigate("/");
}
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");


  const login = async () => {
    try {
      const response =
        await API.post(
          "/auth/login",
          {
            username,
            password,
          }
        );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "username",
        response.data.username
      );

      alert("Login Successful");

      navigate("/");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <div className="container mt-5">

      <div className="card shadow p-4">

        <h2>Admin Login</h2>

        <input
          className="form-control mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          className="btn btn-primary"
          onClick={login}
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default LoginPage;