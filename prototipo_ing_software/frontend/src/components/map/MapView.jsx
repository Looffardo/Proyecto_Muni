import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapView() {
  const penialolenCenter = [-33.49, -70.54];

  const penialolenBounds = [
    [-33.54, -70.60], // esquina suroeste aproximada
    [-33.43, -70.47], // esquina noreste aproximada
  ];

  return (
    <div className="map-container">
      <MapContainer
        center={penialolenCenter}
        zoom={13}
        minZoom={12}
        maxZoom={18}
        maxBounds={penialolenBounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        className="leaflet-map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={penialolenCenter}>
          <Popup>Peñalolén, Región Metropolitana</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapView;