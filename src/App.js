import { BrowserRouter, Route, Routes } from "react-router-dom";
import Client from "./pages/Client.jsx";
import Driver from "./pages/Driver.jsx";
import Login from "./pages/Login.jsx";
import "./styles/app.css";
import Sidebar from "./components/Sidebar.jsx";
import Cards from "./pages/Cards.jsx";
import Navbar from "./components/Navbar.jsx";
import User from "./pages/User.jsx";

function App() {
  return (
    <div className="App">
      <div className="header">
        <Navbar />
      </div>
      <div className="body">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="section">
          <Routes>
            <Route index element={<Login />} />
            <Route path="/Map" element={<Client />} />
            <Route path="/Driver" element={<Driver />} />
            <Route path="/User" element={<User />} />
            <Route path="/Cards" element={<Cards />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
