import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker, Polyline } from "@react-google-maps/api";
import axios from "axios";
import mqtt from "mqtt";
import "../styles/routesMap.css";
import bus from "../images/bus.png";

const libraries = ["places"];
const mapContainerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 19.441261067653702, lng: -70.68447494396473 };
const protocol = "ws";
const host = "swift-agro.ddns.net";
const port = "8083";
const path = "/mqtt";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const topic = "mqtt/map";
const connectUrl = `${protocol}://${host}:${port}${path}`;

const RoutesMap = () => {
  const [trucks, setTrucks] = useState({});
  const [rutas, setRutas] = useState([]);
  const [routesData, setRoutesData] = useState({
    description: "",
    color: "#000000",
    coordinates: [],
  });

  const [client, setClient] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyARFCccvBa5znIAbFaMotUz6MfPh_doCrg",
    libraries,
  });

  const mqttConnect = () => {
    const newClient = mqtt.connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      username: "emqx",
      password: "public",
      reconnectPeriod: 1000,
    });

    newClient.on("connect", () => {
      newClient.subscribe(topic, (err) => {
        if (err) console.error("Error subscribing to MQTT topic:", err);
      });
    });

    newClient.on("message", async (topic, message) => {
      const newTruck = JSON.parse(message.toString());

      await setTrucks((prevTrucks) => {
        const updatedTrucks = { ...prevTrucks };
        updatedTrucks[newTruck.ficha] = newTruck;
        return updatedTrucks;
      });
    });

    newClient.on("error", (err) => {
      console.error("MQTT connection error:", err);
      newClient.end();
    });

    setClient(newClient);
  };

  const onMapClick = async (e) => {
    setRoutesData((prevRoutesData) => ({
      ...prevRoutesData,
      coordinates: [...prevRoutesData.coordinates, { lat: e.latLng.lat(), lng: e.latLng.lng() }],
    }));
  };

  function seleccionar(index) {
    const selectedRoute = rutas[index];
    setRoutesData({
      id: selectedRoute.id,
      description: selectedRoute.descripcion,
      color: selectedRoute.colorRutas,
      coordinates: selectedRoute.polygon,
    });
  }

  const showTrucks = () => {
    return Object.values(trucks).map((truck, index) => (
      <Marker
        key={index}
        position={{
          lat: truck.position.latitude,
          lng: truck.position.longitude,
        }}
        icon={{
          url: bus,
          scaledSize: new window.google.maps.Size(40, 40),
          labelOrigin: new window.google.maps.Point(40, 15),
        }}
      />
    ));
  };

  async function UpdateRoute() {
    let method = "POST";
    if (routesData.id > 0) {
      method = "PUT";
    }
    try {
      const response = await fetch(`http://swift-agro.ddns.net:3001/api/routes?id=${routesData.id}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(routesData),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const jsonData = await response.json();
      console.log(jsonData);
      setRoutesData({
        id: -1,
        description: "",
        color: "#000000",
        coordinates: [],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function DeleteRoute(id) {
    if (routesData.id > 0) {
      try {
        const response = await fetch(`http://swift-agro.ddns.net:3001/api/routes?id=${routesData.id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        console.log(jsonData);
        setRoutesData({
          id: -1,
          description: "",
          color: "#000000",
          coordinates: [],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      setRoutesData({
        id: -1,
        description: "",
        color: "#000000",
        coordinates: [],
      });
    }
  }

  useEffect(() => {
    mqttConnect();

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error("Error getting location:", error.message);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    axios
      .get(`http://${host}:3001/api/routes/`)
      .then((res) => {
        setRutas(res.data.results);
      })
      .catch((error) => {
        console.error("Error fetching routes data:", error);
      });

    return () => {
      if (client) {
        client.end();
      }
    };
  }, [routesData]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div className="container">
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={currentLocation || defaultCenter}
          onClick={onMapClick}
        >
          {trucks && showTrucks()}
          {rutas.map((ruta, index) => (
            <Polyline
              key={index}
              path={ruta.polygon}
              options={{
                strokeColor: ruta.colorRutas,
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
          ))}
          {routesData.coordinates.length > 1 && (
            <Polyline
              key={1}
              options={{
                strokeColor: routesData.color,
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
              path={routesData.coordinates}
            />
          )}
        </GoogleMap>
      </div>

      <div className="footer-container">
        <div className="routes-container">
          <table className="routes-table">
            <thead>
              <tr>
                <td>#</td>
                <td>Descripcion</td>
                <td>Color</td>
                <td>Accion</td>
              </tr>
            </thead>
            <tbody>
              {rutas.map((ruta, index) => (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{ruta.descripcion}</td>
                  <td style={{ backgroundColor: ruta.colorRutas }}>{ruta.colorRutas}</td>
                  <td>
                    <button onClick={() => seleccionar(index)}>Seleccionar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="coordinates-container">
          <div className="coordinate-input">
            <div className="coordinate-information">
              <label className="coordinate-label">Nombre de la Ruta:</label>
              <input
                type="text"
                className="coordinate-label"
                value={routesData.description}
                onChange={(event) =>
                  setRoutesData((prevData) => ({
                    ...prevData,
                    description: event.target.value,
                  }))
                }
              ></input>
            </div>
            <div className="coordinate-information">
              <label className="coordinate-label">Color:</label>
              <input
                type="color"
                className="coordinate-label"
                value={routesData.color}
                onChange={(event) =>
                  setRoutesData((prevData) => ({
                    ...prevData,
                    color: event.target.value,
                  }))
                }
              ></input>
            </div>
          </div>

          <table className="coordinate-table">
            <thead>
              <tr>
                <td>Coordenadas</td>
              </tr>
            </thead>
            <tbody className="coordinate-table--body">
              {routesData.coordinates.map((coordinate, index) => (
                <tr key={index}>
                  <td>{coordinate.lat}</td>
                  <td>{coordinate.lng}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="action-container">
            <button className="btn-save" onClick={UpdateRoute}>
              Guardar
            </button>
            <button className="btn-cancel" onClick={DeleteRoute}>
              Borrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutesMap;
