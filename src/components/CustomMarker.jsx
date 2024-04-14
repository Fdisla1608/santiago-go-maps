import React from "react";

const CustomMarker = ({ options, icon, rotation }) => {
  const [marker, setMarker] = React.useState();

  React.useEffect(() => {
    // Ensure the Google Maps API is loaded
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API is not loaded.");
      return;
    }

    // Create the marker if it doesn't exist
    if (!marker) {
      setMarker(new window.google.maps.Marker());
    }

    // Cleanup function to remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null); // Directly set the map to null
      }
    };
  }, [marker]); // Dependency added to avoid unnecessary recreations

  React.useEffect(() => {
    // Update marker options when the marker or options change
    if (marker) {
      marker.setOptions({
        ...options,
        icon,
        // Set rotation angle if provided
        rotation: rotation ? rotation : 0
      });
    }
  }, [marker, options, icon, rotation]); // Dependency added for options, icon, and rotation

  return null;
};

export default CustomMarker;
