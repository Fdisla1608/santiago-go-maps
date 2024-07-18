import React, { useState, useEffect } from "react";
import "../styles/vehicle.css";

const Vehicle = () => {
  const [data, setData] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [vehicleData, setVehicleData] = useState({
    id: -1,
    ficha:"",
    marca: "",
    modelo: "",
    anio: "",
    placa: "",
    color: "",
    fkChofer: -1,
    fkRuta: -1,
  });

  useEffect(() => {
    fetchData();
    fetchDrivers();
    fetchRoutes();
  }, []);

  const server = "maptest.ddns.net";

  const handleSearch = async (event) => {
    const { value } = event.target;
    try {
      const response = await fetch(
        `http://${server}:3005/api/vehicle?param=${value}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setData(jsonData.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://${server}:3005/api/vehicle?param=${""}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      console.log(jsonData.results)
      setData(jsonData.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await fetch(
        `http://${server}:3005/api/driver?param=${""}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setDrivers(jsonData.results);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await fetch(`http://${server}:3005/api/routes/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setRoutes(jsonData.results);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  async function SelectVehicle(id) {
    let vehicle = data.find((v) => v.id === id);
    console.log(vehicle);
    setVehicleData(vehicle);
  }

  async function UpdateVehicle() {
    let method;
    console.log(vehicleData.id);
    if (vehicleData.id > 0) {
      method = "PUT";
    } else {
      method = "POST";
    }

    try {
      const response = await fetch(
        `http://${server}:3005/api/vehicle?id=${vehicleData.id}`,
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vehicleData),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      console.log(jsonData);
      newRegister();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function DeleteVehicle(id) {
    try {
      const response = await fetch(
        `http://${server}:3005/api/vehicle?id=${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      newRegister();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const newRegister = () => {
    setVehicleData({
      id: -1,
      ficha: "",
      marca: "",
      modelo: "",
      anio: "",
      placa: "",
      color: "",
      fkChofer: -1,
      fkRuta: -1,
    });
  };

  return (
    <>
      <div className="vehicle-container">
        <div className="vehicle-top-container">
          <div className="vehicle-information-container">
            <div className="vehicle-search-container">
              <div className="lbl-search">Buscar:</div>
              <input
                type="text"
                className="txt-search"
                onChange={handleSearch}
              />
              <button className="btn-search">Buscar</button>
              <button className="btn-search-cancel" onClick={newRegister}>
                Nuevo
              </button>
            </div>
            <div className="vehicle-data-container">
              <div className="card-data-container-box">
                <label
                  htmlFor="fichaInput"
                  className="card-data-container-label"
                >
                  Ficha:
                </label>
                <input
                  type="text"
                  name="ficha"
                  className="card-data-container-text"
                  value={vehicleData.ficha}
                  onChange={handleChange}
                />
              </div>
              <div className="card-data-container-box">
                <label htmlFor="txtMarca" className="card-data-container-label">
                  Marca:
                </label>
                <input
                  type="text"
                  name="marca"
                  className="card-data-container-text"
                  value={vehicleData.marca}
                  onChange={handleChange}
                />
              </div>
              <div className="card-data-container-box">
                <label
                  htmlFor="txtModelo"
                  className="card-data-container-label"
                >
                  Modelo:
                </label>
                <input
                  type="text"
                  name="modelo"
                  className="card-data-container-text"
                  value={vehicleData.modelo}
                  onChange={handleChange}
                />
              </div>

              <div className="card-data-container-box">
                <label htmlFor="txtAño" className="card-data-container-label">
                  Año:
                </label>
                <input
                  type="text"
                  name="anio"
                  className="card-data-container-text"
                  value={vehicleData.anio}
                  onChange={handleChange}
                />
              </div>
              <div className="card-data-container-box">
                <label htmlFor="txtPlaca" className="card-data-container-label">
                  Placa:
                </label>
                <input
                  type="text"
                  name="placa"
                  className="card-data-container-text"
                  value={vehicleData.placa}
                  onChange={handleChange}
                />
              </div>

              <div className="card-data-container-box">
                <label htmlFor="txtColor" className="card-data-container-label">
                  Color:
                </label>
                <input
                  type="text"
                  name="color"
                  className="card-data-container-text"
                  value={vehicleData.color}
                  onChange={handleChange}
                />
              </div>

              <div className="card-data-container-box">
                <label
                  htmlFor="driverSelect"
                  className="card-data-container-label"
                >
                  Conductor:
                </label>
                <select
                  name="fkChofer"
                  id="driverSelect"
                  className="card-data-container-text"
                  value={vehicleData.fkChofer}
                  onChange={handleChange}
                >
                  <option value={-1}>Seleccionar Conductor</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.nombre} {driver.apellido}
                    </option>
                  ))}
                </select>
              </div>

              <div className="card-data-container-box">
                <label
                  htmlFor="routeSelect"
                  className="card-data-container-label"
                >
                  Ruta:
                </label>
                <select
                  name="fkRuta"
                  id="routeSelect"
                  className="card-data-container-text"
                  value={vehicleData.fkRuta}
                  onChange={handleChange}
                >
                  <option value={-1}>Seleccionar Ruta</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>
                      {route.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="vehicle-action-container">
            <button className="btn-action-update" onClick={UpdateVehicle}>
              Registrar/Actualizar
            </button>
          </div>
        </div>
        <div className="vehicle-list-container">
          {data ? (
            <table className="card-history-table">
              <thead className="card-history-table-head">
                <tr>
                  <th>ID</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Año</th>
                  <th>Placa</th>
                  <th>Color</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className="card-history-table-body">
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.marca}</td>
                    <td>{item.modelo}</td>
                    <td>{item.anio}</td>
                    <td>{item.placa}</td>
                    <td>{item.color}</td>
                    <td>
                      <button
                        className="btn-table-select"
                        onClick={() => SelectVehicle(item.id)}
                      >
                        Seleccionar
                      </button>

                      <button
                        className="btn-table-decline"
                        onClick={() => DeleteVehicle(item.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h1>Cargando</h1>
          )}
        </div>
      </div>
    </>
  );
};

export default Vehicle;
