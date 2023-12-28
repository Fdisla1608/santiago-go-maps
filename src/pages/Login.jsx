import React from "react";
import '../styles/login.css'

const login = () => {
  return (
    <div>
      <div className="login-title">Iniciar Sesion</div>
      <div className="login-frame">
        <div className="username-frame">
          <label htmlFor="user-name">Usuario: </label>
          <input type="text" id="user-name" />
        </div>
        <div className="password-frame">
          <label htmlFor="user-name">Password: </label>
          <input type="password" id="user-name" />
        </div>
        <div className="button-frame">
            <button className="btn-login" onClick={alert("Hello!")}>Iniciar Sesion</button>
        </div>
      </div>
    </div>
  );
};

export default login;
