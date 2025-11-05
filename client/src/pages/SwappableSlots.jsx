import { useEffect, useState } from "react";
import api from "../api/axios";

export default function SwappableSlots() {
  const [slots, setSlots] = useState([]);

  const fetchSlots = async () => {
    try {
      const { data } = await api.get("/events/swappable-slots");
      console.log("Swappable slots API response:", data);
      setSlots(data.events || data);
    } catch (err) {
      console.error("Swappable slots fetch error:", err);
    }
  };

  const handleSwapRequest = async (id) => {
    try {
      await api.post(`/events/swap-request/${id}`);
      alert("Swap request sent!");
      fetchSlots();
    } catch (err) {
      alert("Failed to send swap request");
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", textAlign: "center" }}>
      <h2>Swappable Slots</h2>
      <pre>{JSON.stringify(slots, null, 2)}</pre>
      {slots.length === 0 ? (
        <p>No swappable events available</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {slots.map((s) => (
            <li
              key={s._id}
              style={{
                background: "#f0f0f0",
                margin: "10px 0",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <strong>{s.title}</strong> — {s.status}
              <br />
              <button onClick={() => handleSwapRequest(s._id)}>
                Request Swap
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
