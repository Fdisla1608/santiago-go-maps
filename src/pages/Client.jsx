import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GoogleMapReact from "google-map-react";

import "../styles/client.css";
import MyPositionMarker from "../components/MyPositionMarker";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const Client = () => {
  const location = useLocation();
  const [user, setUser] = useState();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [lat, setLat] = useState(40.330982);
  const [lgn, setLgn] = useState(-75.9261621);

  const CloseNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  useEffect(() => {
    const { state } = location;
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLat(latitude);
            setLgn(longitude);
          },
          (error) => {
            console.error("Error getting location:", error.message);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };
    setUser(state);
    getLocation();
  }, [location, lat, lgn]);

  return (
    <div className="container">
      <button
        className={
          navbarOpen ? "floating-button-closed" : "floating-button-open"
        }
        onClick={CloseNavbar}
      >
        ≡
      </button>

      <div className={navbarOpen ? "navbar-open" : "navbar-closed"}>
        <div className="navbar-title-container">
          <p className="navbar-title">SantiaGO!</p>
          <button className="navbar-button-close" onClick={CloseNavbar}>
            x
          </button>
        </div>
        <p className="user-name">
          {user && user.name} {user && user.lastName}
        </p>
        {user?.cards?.map((card, i) => (
          <div key={i} className="card-container">
            <p className="card-title">Tarjeta # {i + 1}</p>
            <p className="card-cod">Cod: {card.cod}</p>
            <p className="card-balance">Balance: {card.balance}</p>
          </div>
        ))}
      </div>
      <div className="map-container">
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyARFCccvBa5znIAbFaMotUz6MfPh_doCrg" }}
          center={{
            lat: lat,
            lng: lgn,
          }}
          defaultZoom={19}
        >
          <MyPositionMarker lat={40.330982} lng={-75.9261621} text={"^"} />
        </GoogleMapReact>
      </div>
    </div>
  );
};

export default Client;
