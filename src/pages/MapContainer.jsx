import React from "react";
import { Wrapper, Status, Marker } from "@googlemaps/react-wrapper";
import MyMapComponent from "../components/MyMapComponent";
import carIcon from "../images/car-gray.png"; // Importing the car icon image
import CustomMarker from "../components/CustomMarker";

const center = { lat: -34.397, lng: 150.644 };
const zoom = 4;

const MarkerAT = ({ options }) => {
  const [marker, setMarker] = React.useState();

  React.useEffect(() => {
    if (!marker) {
      setMarker(new Marker());
    }
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);
  
  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);
  
  return null;
};

const render = (status) => {
  switch (status) {
    case Status.LOADING:
      return <div>Loading map...</div>;
    case Status.FAILURE:
      return <div>Failed to load map. Please try again later.</div>;
    case Status.SUCCESS:
      return null;
    default:
      throw new Error("Unexpected map status"); // Or display a generic message
  }
};

function MapContainer() {
  return (
    <Wrapper apiKey={"AIzaSyARFCccvBa5znIAbFaMotUz6MfPh_doCrg"} render={render}>
      <MyMapComponent center={center} zoom={zoom}>
        <CustomMarker options={{ position: center }} icon={carIcon} rotation={45} />
      </MyMapComponent>
    </Wrapper>
  );
}

export default MapContainer;
