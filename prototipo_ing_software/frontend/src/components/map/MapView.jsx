import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import useAuth from "../../hooks/useAuth";
import { getRequests } from "../../api/requestsApi";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function normalizeRole(value) {
  return String(value ?? "").trim().toLowerCase();
}

function MapView() {
  const { user, loading } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!user) {
      setRequests([]);
      return;
    }

    let isMounted = true;

    getRequests()
      .then((allRequests) => {
        if (!isMounted) return;

        const userRole = normalizeRole(user.role);
        const isGescom = userRole === "gescom";

        const filteredRequests = isGescom
          ? allRequests
          : allRequests.filter(
              (request) => normalizeRole(request.area) === userRole
            );

        setRequests(filteredRequests);
      })
      .catch(() => {
        if (isMounted) {
          setRequests([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const penialolenCenter = [-33.49, -70.54];

  const penialolenBounds = [
    [-33.54, -70.60],
    [-33.43, -70.47],
  ];

  const visibleRequests = requests.filter(
    (request) =>
      Number.isFinite(Number(request.latitude)) &&
      Number.isFinite(Number(request.longitude))
  );

  if (loading) {
    return <div className="map-container">Cargando solicitudes...</div>;
  }

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

        {visibleRequests.map((request, index) => (
          <Marker
            key={request._id || `${request.title}-${index}`}
            position={[Number(request.latitude), Number(request.longitude)]}
          >
            <Popup>
              <strong>{request.title}</strong>
              <br />
              {request.location}
              <br />
              Área: {request.area}
              <br />
              Estado: {request.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;