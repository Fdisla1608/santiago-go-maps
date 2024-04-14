import React, { useEffect, useRef } from "react";

function MyMapComponent({ center, zoom }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
    });
  }, []); // Adding an empty dependency array to run this effect only once

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100%", zIndex: 0, opacity: 0.1 }}
    />
  );
}

export default MyMapComponent;
