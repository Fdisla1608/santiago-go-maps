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
        <Link to="/Driver" className="navigation-item">
          Chofer
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
