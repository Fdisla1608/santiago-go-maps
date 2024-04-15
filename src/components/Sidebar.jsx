import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../styles/sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <div className="sidebar-title">Santiago</div>
      <div className="navigation-container">
        <Link to="/" className="navigation-item">
          Mapa
        </Link>
        <Link to="/Cards" className="navigation-item">
          Recargas
        </Link>
        <Link to="/User" className="navigation-item">
          Usuario
        </Link>
        <Link to="/Admin" className="navigation-item">
          Admin
        </Link>
        <Link to="/Vehicle" className="navigation-item">
          Vehiculos
        </Link>
        <Link to="/Driver" className="navigation-item">
          Chofer
        </Link>
        <Link to="/Routes" className="navigation-item">
          Rutas
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
