import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const LoginEvent = () => {
    navigate("client", {
      state: {
        userId: 1,
        name: "Fernando",
        lastName: "Disla",
        cards: [
          { cod: "1001", balance: 100 },
          { cod: "1002", balance: 50 },
        ],
      },
    });
  };

  return (
    <div>
      <div className="login-title">Iniciar Sesion</div>
      <div className="login-frame">
        <div className="username-frame">
          <label htmlFor="user-name">Usuario: </label>
          <input
            type="text"
            id="user-name"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="password-frame">
          <label htmlFor="user-name">Password: </label>
          <input
            type="password"
            id="user-name"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="button-frame">
          <button className="btn-login" onClick={LoginEvent}>
            Iniciar Sesion
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
