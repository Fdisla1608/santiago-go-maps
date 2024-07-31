import React, { useState, useEffect } from "react";
import "../styles/card.css";

let port;
let reader;
let textDecoder;
let readableStreamClosed;

const Cards = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [output, setOutput] = useState("");
  const [CardData, setCardData] = useState({
    idCard: "",
    cod: "",
    Alias: "",
    Name: "",
    LastName: "",
    Username: "",
    Date: "",
    Balance: "",
  });

  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if ("serial" in navigator) {
      console.log("Serial Supported");
    } else {
      console.log("Serial UnSupported");
    }
    fetchData();
  }, [CardData]);

  const handleBalance = (event) => {
    const { value } = event.target;
    setBalance(value);
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
            const line = partialLine.substring(0, newlineIndex);
            await setOutput(line);
            ScanCard(line);
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

  const disconnectToSerial = async () => {
    if (reader) {
      try {
        const textEncoder = new TextEncoderStream();
        const writer = textEncoder.writable.getWriter();
        const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

        reader.cancel();
        await readableStreamClosed.catch(() => {
          /* Ignore the error */
        });

        writer.close();
        await writableStreamClosed;

        await port.close();
        DeclineTransaction();
        port = null
        console.log("Puerto Cerrado");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://maptest.ddns.net:3001/api/cards/transaction?fkTarjeta=${CardData.idCard}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setTransactions(jsonData.transactions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const ScanCard = async (params) => {
    try {
      setBalance(0);
      const response = await fetch(
        `http://maptest.ddns.net:3001/api/cards/card?cod=${params}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      setCardData({
        idCard: jsonData.results[0].id,
        cod: jsonData.results[0].cod,
        Alias: jsonData.results[0].alias,
        Name: jsonData.results[0].nombre,
        LastName: jsonData.results[0].apellido,
        Username: jsonData.results[0].usuario,
        Date: jsonData.results[0].fechaRegistro,
        Balance: jsonData.results[0].balance,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      DeclineTransaction();
    }
  };

  const InsertTransaction = async () => {
    try {
      const response = await fetch(
        `http://maptest.ddns.net:3001/api/cards/transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fkTarjeta: CardData.idCard, // ID de la tarjeta asociada
            fkTipoTransaccion: 1, // ID del tipo de transacción
            montoCredito: balance,
            montoDebito: 0.0,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      await response.json();
      ScanCard(CardData.cod);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const DeclineTransaction = () => {
    setBalance(0);
    setOutput("");
    setCardData({
      idCard: "",
      cod: "",
      Alias: "",
      Name: "",
      LastName: "",
      Username: "",
      Date: "",
      Balance: "",
    });
  };

  return (
    <>
      <div className="card-container">
        <div className="card-top-container">
          <div className="card-information-container">
            <div className="card-search-container">
              <div className="lbl-search">Scanner:</div>
              <input
                type="text"
                className="txt-search"
                value={output}
                readOnly
              />
              <button className="btn-search" onClick={connectToSerial}>
                Activar
              </button>
              <button className="btn-search-ced" onClick={disconnectToSerial}>
                Desactivar
              </button>
            </div>
            <div className="card-data-container">
              <div className="card-data-container-box">
                <label
                  htmlFor="txtUsuario"
                  className="card-data-container-label"
                >
                  Nombre:
                </label>
                <input
                  type="text"
                  className="card-data-container-text"
                  value={`${CardData.Name} ${CardData.LastName}`}
                  readOnly
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
                  className="card-data-container-text"
                  value={CardData.Username}
                  readOnly
                />
              </div>
              <div className="card-data-container-box">
                <label
                  htmlFor="txtUsuario"
                  className="card-data-container-label"
                >
                  Alias:
                </label>
                <input
                  type="text"
                  className="card-data-container-text"
                  value={CardData.Alias}
                  readOnly
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
                  className="card-data-container-text"
                  value={CardData.Date}
                  readOnly
                />
              </div>
              <div className="card-data-container-box">
                <label
                  htmlFor="txtUsuario"
                  className="card-data-container-label"
                >
                  Balance:
                </label>
                <input
                  type="text"
                  className="card-data-container-text"
                  value={CardData.Balance}
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="card-action-container">
            <input
              type="number"
              className="txt-amount"
              value={balance}
              onChange={handleBalance}
            />
            <button className="btn-action-accept" onClick={InsertTransaction}>
              Recargar
            </button>
            <button className="btn-action-decline" onClick={DeclineTransaction}>
              Declinar
            </button>
          </div>
        </div>
        <div className="card-history-container">
          <table className="card-history-table">
            <thead className="card-history-table-head">
              <tr>
                <th>#</th>
                <th>Transaccion</th>
                <th>Monto</th>
                <th>Fecha Registro</th>
              </tr>
            </thead>
            {transactions ? (
              <tbody className="card-history-table-body">
                {transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{transaction.tipoTransaccion}</td>
                    <td>
                      {transaction.montoCredito - transaction.montoDebito}
                    </td>
                    <td>{transaction.fechaRegistro}</td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody className="card-history-table-body">
                <tr></tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default Cards;
