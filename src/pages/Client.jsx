import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker, Polyline } from "@react-google-maps/api";
import axios from "axios";
import mqtt from "mqtt";
import "../styles/client.css";
import bus from "../images/bus.png";

const libraries = ["places"];
const mapContainerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 19.441261067653702, lng: -70.68447494396473 };
const protocol = "ws";
const host = "maptest.ddns.net";
const port = "8083";
const path = "/mqtt";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const topic = "mqtt/map";
const connectUrl = `${protocol}://${host}:${port}${path}`;

const App = () => {
  const [trucks, setTrucks] = useState({});
  const [rutas, setRutas] = useState([]);
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
      .get(`http://maptest.ddns.net:3001/api/maps/rutax`) 
      .then((res) => {
        setRutas(res.data);
      })
      .catch((error) => {
        console.error("Error fetching routes data:", error);
      });

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={currentLocation || defaultCenter}
      >
        {trucks && showTrucks()}
        {rutas.map((ruta, index) => (
          <Polyline
            key={index}
            path={ruta.coordinates}
            strokeColor={ruta.colorRutas}
            strokeOpacity={0.8}
            strokeWeight={2}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default App;
