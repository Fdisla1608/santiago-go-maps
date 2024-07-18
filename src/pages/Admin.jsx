import React, { useState, useEffect } from "react";
import "../styles/user.css";

const Admin = () => {
  const [data, setData] = useState([]);

  const [driverData, setDriverData] = useState({
    id: -1,
    nombre: "",
    apellido: "",
    userName: "",
    userPassword: "",
    fechaNacimiento: new Date(),
    telefono: "",
    tipoSesion: 1,
  });

  useEffect(() => {
    fetchData();
  }, [driverData]);

  //  const server = "maptest.ddns.net";
  const server = "maptest.ddns.net";

  const handleSearch = async (event) => {
    const { value } = event.target;
    try {
      const response = await fetch(
        `http://${server}:3005/api/driver?param=${value}`
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
    setDriverData({ ...driverData, [name]: value });
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://${server}:3005/api/admin?param=${""}`
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

  async function SelectUser(id) {
    let driver = data.find((us) => us.id === id);
    driver.userPassword = "";
    setDriverData(driver);
  }

  async function UpdateDriver() {
    let method;
    if (driverData.userPassword.length > 0 && driverData.userName.length > 0) {
      if (driverData.id > 0) {
        method = "PUT";
      } else {
        method = "POST";
      }

      try {
        const response = await fetch(
          `http://${server}:3005/api/admin?id=${driverData.id}`,
          {
            method: method,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(driverData),
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
    } else {
      alert("Ingrese los datos correctamente");
    }
  }

  async function DeleteDriver(id) {
    try {
      const response = await fetch(`http://${server}:3005/api/admin?id=${id}`, {
        method: "DELETE",
      });
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
    setDriverData({
      id: -1,
      nombre: "",
      apellido: "",
      userName: "",
      userPassword: "",
      telefono: "",
      fechaNacimiento: "",
      tipoSesion: 1,
    });
  };

  return (
    <>
      <div className="user-container">
        <div className="user-top-container">
          <div className="user-information-container">
            <div className="user-search-container">
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
            <div className="user-data-container">
              <div className="card-data-container-box">
                <label
                  htmlFor="txtUsuario"
                  className="card-data-container-label"
                >
                  Nombre:
                </label>
                <input
                  type="text"
                  name="nombre"
                  className="card-data-container-text"
                  value={driverData.nombre}
                  onChange={handleChange}
                />
              </div>
              <div className="card-data-container-box">
                <label
                  htmlFor="txtUsuario"
                  className="card-data-container-label"
                >
                  Apellido:
                </label>
                <input
                  type="text"
                  name="apellido"
                  className="card-data-container-text"
                  value={driverData.apellido}
                  onChange={handleChange}
                />
              </div>

              <div className="card-data-container-box">
                <label
                  htmlFor="txtUsuario"
                  className="card-data-container-label"
                >
                  Fecha:
                </label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  className="card-data-container-text"
                  value={driverData.fechaNacimiento}
                  onChange={handleChange}
                />
              </div>
              <div className="card-data-container-box">
                <label
                  htmlFor="txtUsuario"
                  className="card-data-container-label"
                >
                  Telefono:
                </label>
                <input
                  type="text"
                  name="telefono"
                  className="card-data-container-text"
                  value={driverData.telefono}
                  onChange={handleChange}
                />
              </div>

              <div className="card-data-container-box">
                <label
                  htmlFor="txtUsuario"
                  className="card-data-container-label"
                >
                  Usuario:
                </label>
                <input
                  type="text"
                  name="userName"
                  className="card-data-container-text"
                  value={driverData.userName}
                  onChange={handleChange}
                />
              </div>
              <div className="card-data-container-box">
                <label htmlFor="userName" className="card-data-container-label">
                  Contraseña:
                </label>
                <input
                  type="password"
                  name="userPassword"
                  className="card-data-container-text"
                  value={driverData.userPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="card-data-container-box">
                <label htmlFor="userName" className="card-data-container-label">
                  Tipo Sesion:
                </label>
                <select
                  name="tipoSesion"
                  className="card-data-container-text"
                  value={driverData.tipoSesion}
                  onChange={handleChange}
                >
                  <option value={1}>Administrador</option>
                  <option value={2}>Operario</option>
                </select>
              </div>
            </div>
          </div>
          <div className="user-action-container">
            <button className="btn-action-update" onClick={UpdateDriver}>
              Registrar/Actualizar
            </button>
          </div>
        </div>
        <div className="user-list-container">
          {data ? (
            <table className="card-history-table">
              <thead className="card-history-table-head">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>usuario</th>
                  <th>Fecha Nacimiento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className="card-history-table-body">
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.nombre}</td>
                    <td>{item.apellido}</td>
                    <td>{item.userName}</td>
                    <td>{item.fechaNacimiento}</td>
                    <td>
                      <button
                        className="btn-table-select"
                        onClick={() => SelectUser(item.id)}
                      >
                        Seleccionar
                      </button>

                      <button
                        className="btn-table-decline"
                        onClick={() => DeleteDriver(item.id)}
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

export default Admin;
