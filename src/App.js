import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import Client from "./pages/Client.jsx";
import Driver from "./pages/Driver.jsx";
import Login from "./pages/Login.jsx";
import "./styles/app.css";
import Sidebar from "./components/Sidebar.jsx";
import Cards from "./pages/Cards.jsx";
import Navbar from "./components/Navbar.jsx";
import User from "./pages/User.jsx";
import Admin from "./pages/Admin.jsx";
import RoutesMap from "./pages/RoutesMap.jsx";
import Vehicle from "./pages/Vehicle.jsx";

function App() {
  const [token, setToken] = useState(sessionStorage.getItem("token"));

  const handleLogin = (token) => {
    if (token.token) {
      setToken(token);
      sessionStorage.setItem("token", token.token);
    } else {
      alert("Usuario/Contraseña Invalida");
    }
  };

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem("token");
  };

  if (!token) {
    return (
      <div className="App">
        <div className="header">
          <Navbar onLogout={handleLogout} isLogged={false} />
        </div>
        <div className="body">
          <div className="section">
            <Login setToken={handleLogin} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="header">
        <Navbar onLogout={handleLogout} isLogged={true} />
      </div>
      <div className="body">
        <div className="sidebar">
          <Sidebar onLogout={handleLogout} userProfile={2} />
        </div>
        <div className="section">
          <Routes>
            <Route index element={<Client />} />
            <Route path="/Driver" element={<Driver />} />
            <Route path="/User" element={<User />} />
            <Route path="/Cards" element={<Cards />} />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/Vehicle" element={<Vehicle />} />
            <Route path="/Routes" element={<RoutesMap />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
