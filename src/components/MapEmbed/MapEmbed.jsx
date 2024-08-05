import React from 'react';

const API_KEY = 'AIzaSyDgsO1fpcQWpFMByZnAeRskAg4T22_Fl38'; // Replace with your actual API key

const MapEmbed = ({ latitude, longitude, zoom = 15, width = "100%", height = "100%" }) => {
  // Generate the URL for the Google Maps Embed API with a marker
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${latitude},${longitude}&zoom=${zoom}`;

  return (
    <iframe
      src={mapUrl}
      width={width}
      height={height}
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Google Maps"
    ></iframe>
  );
};

export default MapEmbed;
