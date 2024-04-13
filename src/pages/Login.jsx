import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

async function loginUser(credentials) {
  return fetch("http://maptest.ddns.net:3001/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({
      userName: username,
      userPassword: password,
    });
    setToken(token);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-title">Inicio de Sesion</div>
        <div className="login-frame">
          <div className="form-frame">
            <label htmlFor="user-name" className="label-field">
              Usuario:{" "}
            </label>
            <input
              type="text"
              id="user-name"
              onChange={(e) => setUserName(e.target.value)}
              className="text-field"
            />
          </div>
          <div className="form-frame">
            <label htmlFor="user-name" className="label-field">
              Password:{" "}
            </label>
            <input
              type="password"
              id="user-name"
              onChange={(e) => setPassword(e.target.value)}
              className="text-field"
            />
          </div>
          <div className="button-frame">
            <button className="btn-login" onClick={handleSubmit}>
              Iniciar Sesion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
