import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";
import { useState, useEffect } from "react";
import axios from "axios";
import L from "leaflet";
import "bootstrap/dist/css/bootstrap.min.css";

// =======================
// ICONS
// =======================
const tempIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  iconSize: [25, 25],
});

const savedIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [25, 25],
});

// =======================
// MAIN COMPONENT
// =======================
export default function MapComponent() {
  const [points, setPoints] = useState([]);
  const [tempMarker, setTempMarker] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    Branch: "",
    tracks: "",
    lng: "",
    lat: "",
  });

  // =======================
  // FETCH DATA
  // =======================
  const fetchPoints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/iti_branches");
      setPoints(res.data.features);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  // =======================
  // MAP CLICK
  // =======================
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;

        setForm((prev) => ({
          ...prev,
          lat,
          lng,
        }));

        setTempMarker([lat, lng]);
      },
    });

    return null;
  }

  // =======================
  // SAVE POINT
  // =======================
  const savePoint = async () => {
    try {
      setLoading(true);

      await axios.post("http://localhost:5000/iti_branches", {
        Branch: form.Branch,
        tracks: form.tracks,
        Longitude: form.lng,
        Latitude: form.lat,
      });

      await fetchPoints();

      setTempMarker(null);

      setForm({
        Branch: "",
        tracks: "",
        lng: "",
        lat: "",
      });
    } catch (err) {
      console.log("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  // =======================
  // UI
  // =======================
  return (
    <div className="bg-dark text-light vh-100 p-2">
      <div className="d-flex h-100" style={{ gap: "3px" }}>
        {/* ================= MAP ================= */}
        <div style={{ width: "70%", height: "100%" }}>
          <div className="bg-secondary rounded-4 shadow h-100 p-2">
            <MapContainer
              center={[30.0444, 31.2357]}
              zoom={7}
              className="rounded-4 h-100 w-100"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <MapClickHandler />

              {tempMarker && <Marker position={tempMarker} icon={tempIcon} />}

              {points?.map((p) => (
                <Marker
                  key={p.id}
                  position={[
                    p.geometry.coordinates[1],
                    p.geometry.coordinates[0],
                  ]}
                  icon={savedIcon}
                >
                  <Popup>
                    <b>{p.properties.Branch}</b>
                    <br />
                    Tracks:{" "}
                    {p.properties.tracks ? p.properties.tracks : "No tracks"}
                    <br />
                    Lat: {p.properties.Latitude}
                    <br />
                    Lng: {p.properties.Longitude}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* ================= SIDEBAR ================= */}
        <div style={{ width: "30%", height: "100%" }}>
          <div className="card bg-secondary text-light shadow-lg border-0 rounded-4 h-100">
            <div className="card-body p-4 d-flex flex-column">
              <h4 className="mb-4 text-center fw-bold">Add New Branch</h4>

              <div className="mb-3">
                <label className="form-label">Branch Name</label>
                <input
                  className="form-control bg-dark text-light border-0"
                  value={form.Branch}
                  onChange={(e) => setForm({ ...form, Branch: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Tracks</label>
                <input
                  className="form-control bg-dark text-light border-0"
                  value={form.tracks}
                  onChange={(e) => setForm({ ...form, tracks: e.target.value })}
                />
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label">Longitude</label>
                  <input
                    className="form-control bg-dark text-light border-0"
                    value={form.lng}
                    onChange={(e) => setForm({ ...form, lng: e.target.value })}
                  />
                </div>

                <div className="col-6 mb-3">
                  <label className="form-label">Latitude</label>
                  <input
                    className="form-control bg-dark text-light border-0"
                    value={form.lat}
                    onChange={(e) => setForm({ ...form, lat: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-auto d-grid">
                <button
                  className="btn btn-primary btn-lg rounded-3"
                  onClick={savePoint}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Branch"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
