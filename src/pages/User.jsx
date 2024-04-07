import React, { useState, useEffect } from "react";
import "../styles/user.css";

let port;
let reader;
let textDecoder;
let readableStreamClosed;

const User = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tarjetaCod, setTarjetaCod] = useState("");
  const [data, setData] = useState([]);

  const [userData, setUserData] = useState({
    id: -1,
    nombre: "",
    apellido: "",
    userName: "",
    userPassword: "",
    ced: "",
    fechaNacimiento: "",
    cards: {
      count: 0,
      list: [],
    },
  });

  useEffect(() => {
    fetchData();
  }, [userData]);

  const handleCard = (event) => {
    const { value } = event.target;
    setTarjetaCod(value);
  };

  const handleSearch = async (event) => {
    const { value } = event.target;
    try {
      const response = await fetch(
        `http://maptest.ddns.net:3001/api/user?param=${value}`
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
    setUserData({ ...userData, [name]: value });
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://maptest.ddns.net:3001/api/user?param=${""}`
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

  const openModal = () => {
    if (userData.id > 0) {
      setIsModalVisible(true);
    } else {
      alert("Seleccione un Usuario");
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const connectToSerial = async () => {
    try {
      if (!port) {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });

        textDecoder = new TextDecoderStream();
        readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        reader = textDecoder.readable.getReader();
        let partialLine = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            console.log({ value, done });
            break;
          }

          partialLine += value;

          const newlineIndex = partialLine.indexOf("\n");
          if (newlineIndex !== -1) {
            const lineWithCarriageReturn = partialLine.substring(
              0,
              newlineIndex
            );
            const line = lineWithCarriageReturn.replace(/\r/g, "");
            if (line.length >= 10) {
              console.log(line.length);
              await setTarjetaCod(line);
            } else {
              alert("Tarjeta Invalida");
            }
            partialLine = partialLine.substring(newlineIndex + 1);
          }
        }
        console.log("Puerto Cerrado");
        await reader.releaseLock();
      } else {
        console.log("El Puerto esta abierto");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  async function SelectUser(id) {
    let user = data.find((us) => us.id === id);
    user.cards = { count: 0, list: [] };
    user.ced = "";
    user.userPassword = "";
    setUserData(user);
    try {
      const response = await fetch(
        `http://maptest.ddns.net:3001/api/cards?userId=${user.id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      console.log(data);
      setUserData((prevState) => ({
        ...prevState,
        cards: {
          ...prevState.cards,
          list: jsonData.results,
          count: jsonData.results.length,
        },
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function UpdateUser() {
    let method;
    console.log(userData.id);
    if (userData.id > 0) {
      method = "PUT";
    } else {
      method = "POST";
    }

    try {
      const response = await fetch(
        `http://maptest.ddns.net:3001/api/user?id=${userData.id}`,
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
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

  async function DeleteCard(id) {
    try {
      const response = await fetch(
        `http://maptest.ddns.net:3001/api/cards?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const jsonData = await response.json();
      if (!response.ok) {
        throw new Error(jsonData.error);
      }
      alert(jsonData.status);
      newRegister();
    } catch (error) {
      alert(error);
    }
  }

  async function DeleteUser(id) {
    try {
      const response = await fetch(`http://maptest.ddns.net:3001/api/user?id=${id}`, {
        method: "DELETE",
      });
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

  const RegisterCard = async () => {
    try {
      if (tarjetaCod.length < 10) {
        throw new Error("Tarjeta Invalida");
      }
      const response = await fetch(
        `http://maptest.ddns.net:3001/api/cards?id=${userData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cod: tarjetaCod,
            fkUsuario: userData.id,
            alias: "Principal",
          }),
        }
      );
      if (!response.ok) {
        const jsonError = await response.json();
        throw new Error(jsonError.error);
      }
      const jsonData = await response.json();
      newRegister();
    } catch (error) {
      alert(error);
    }
  };

  const newRegister = () => {
    setUserData({
      id: -1,
      nombre: "",
      apellido: "",
      userName: "",
      userPassword: "",
      ced: "",
      fechaNacimiento: "",
      cards: {
        count: 0,
        list: [],
      },
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
                  value={userData.nombre}
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
                  value={userData.apellido}
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
                  value={userData.userName}
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
                  value={userData.userPassword}
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
                  type="text"
                  name="fechaNacimiento"
                  className="card-data-container-text"
                  value={userData.fechaNacimiento}
                  onChange={handleChange}
                />
              </div>
              <div className="card-data-container-box">
                <label
                  htmlFor="txtUsuario"
                  className="card-data-container-label"
                >
                  Tarjetas:
                </label>
                <input
                  type="text"
                  className="card-data-container-text"
                  value={userData.cards.count}
                  readOnly
                />
                <button className="btn-table-select" onClick={openModal}>
                  Mostrar
                </button>
              </div>
            </div>
          </div>
          <div className="user-action-container">
            <button className="btn-action-update" onClick={UpdateUser}>
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
                        onClick={() => DeleteUser(item.id)}
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
      {isModalVisible && (
        <div className="modal-search-screen" id="modal-search-screen">
          <div className="modal-search-container">
            <div className="user-modal-information-container">
              <div className="user-modal-search-container">
                <div className="lbl-search">Codigo:</div>
                <input
                  type="text"
                  className="txt-search"
                  value={tarjetaCod}
                  onChange={handleCard}
                />
                <button className="btn-search" onClick={connectToSerial}>
                  Scannear
                </button>
              </div>
              <div className="user-modal-action-container">
                <button
                  className="btn-search"
                  onClick={RegisterCard}
                  style={{ backgroundColor: "dodgerblue" }}
                >
                  Agregar
                </button>
              </div>
            </div>
            <div className="card-history-container">
              <table className="card-history-table">
                <thead className="card-history-table-head">
                  <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Alias</th>
                    <th>Balance</th>
                    <th>Fecha Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody className="card-history-table-body">
                  {userData.cards.list.map((item, index) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.cod}</td>
                      <td>{item.alias}</td>
                      <td>{item.diferencia}</td>
                      <td>{item.fechaRegistro.substring(0, 10)}</td>
                      <td>
                        <button
                          className="btn-table-decline"
                          onClick={() => DeleteCard(item.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn-search-cancel" onClick={closeModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default User;
