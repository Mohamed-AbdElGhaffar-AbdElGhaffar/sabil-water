import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  height: "270px",
  width: "100%"
};

const LocationPicker = ({ onLocationChange }) => {
  const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentPosition({ lat: latitude, lng: longitude });
      setSelectedPosition({ lat: latitude, lng: longitude }); 
      onLocationChange({ lat: latitude, lng: longitude });
    }, (error) => {
      console.error('Error fetching location:', error);
      onLocationChange(null); 
    });
  }, [onLocationChange]);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedPosition({ lat, lng });
    onLocationChange({ lat, lng });
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyDgsO1fpcQWpFMByZnAeRskAg4T22_Fl38">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={currentPosition}
        zoom={14}
        onClick={handleMapClick}
      >
        {selectedPosition && (
          <Marker position={selectedPosition} />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default LocationPicker;
