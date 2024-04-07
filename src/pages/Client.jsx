import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polyline,
  InfoWindow,
} from "@react-google-maps/api";
import axios from "axios";
import mqtt from "mqtt";
import "../styles/client.css";
import car from "../images/car-gray.png";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};
const defaultCenter = {
  lat: 19.441261067653702,
  lng: -70.68447494396473,
};

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
      console.log("MQTT connected successfully");
      newClient.subscribe(topic, (err) => {
        if (err) console.error("Error subscribing to MQTT topic:", err);
      });
    });

    newClient.on("message", async (topic, message) => {
      const newTruck = JSON.parse(message.toString());

      await setTrucks((prevTrucks) => {
        const updatedTrucks = { ...prevTrucks };
        if (newTruck.ficha in updatedTrucks) {
          updatedTrucks[newTruck.ficha] = newTruck;
        } else {
          updatedTrucks[newTruck.ficha] = newTruck;
        }
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
    return Object.values(trucks).map((truck, index) => {
      // Calculate bearing between current location and truck's position
      let bearing = 0; // Default to North
      if (currentLocation) {
        const lat1 = currentLocation.lat;
        const lon1 = currentLocation.lng;
        const lat2 = truck.position.latitude;
        const lon2 = truck.position.longitude;
        bearing = calculateInitialCompassBearing(lat1, lon1, lat2, lon2);
      }

      return (
        <Marker
          key={index}
          position={{
            lat: truck.position.latitude,
            lng: truck.position.longitude,
          }}
          icon={{
            url: car,
            scaledSize: new window.google.maps.Size(80, 45), // Tamaño del icono
            rotation: bearing, // Rotate the marker based on bearing
          }}
        />
      );
    });
  };

  const calculateInitialCompassBearing = (lat1, lon1, lat2, lon2) => {
    const deg2rad = (degrees) => {
      return degrees * (Math.PI / 180);
    };

    const rad2deg = (radians) => {
      return (radians * 180) / Math.PI;
    };

    lat1 = deg2rad(lat1);
    lon1 = deg2rad(lon1);
    lat2 = deg2rad(lat2);
    lon2 = deg2rad(lon2);

    const dLon = lon2 - lon1;

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    let initialBearing = Math.atan2(y, x);
    initialBearing = rad2deg(initialBearing);
    initialBearing = (initialBearing + 360) % 360;

    return initialBearing;
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
        console.log(res.data);
        setRutas(res.data);
      })
      .catch((error) => {
        console.error("Error fetching routes data:", error);
      });

    getLocation();

    return () => {
      if (client) {
        client.end();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        zoom={18}
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
