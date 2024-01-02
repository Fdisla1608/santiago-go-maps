import { BrowserRouter, Route, Routes } from "react-router-dom";
import Client from "./pages/Client.jsx";
import Driver from "./pages/Driver.jsx";
import Login from "./pages/Login.jsx";

function App() {
  return (
    <div className="App" style={{margin:'0px'}}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="client" element={<Client />} />
          <Route path="driver" element={<Driver />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
