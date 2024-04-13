import React from "react";
import "../styles/navbar.css";

const Navbar = ({ onLogout, isLogged }) => {
  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="navbar-container">
      <div className="logo">SantiaGo</div>
      {isLogged && <button onClick={handleLogout} className="btn-logout">Cerrar sesión</button>}
    </div>
  );
};

export default Navbar;
