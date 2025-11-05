import { useEffect, useState } from "react";
import api from "../api/axios";

export default function SwapResponse() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const { data } = await api.get("/events");
    const pending = data.filter((e) => e.status === "SWAP_PENDING");
    setRequests(pending);
  };

  const handleResponse = async (id, action) => {
    try {
      await api.post(`/swaps/swap-response/${id}`, { action });
      alert(`Swap ${action}ed successfully!`);
      fetchRequests();
    } catch (err) {
      alert("Failed to respond to swap");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", textAlign: "center" }}>
      <h2>Swap Requests</h2>
      {requests.length === 0 ? (
        <p>No pending swap requests</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {requests.map((r) => (
            <li
              key={r._id}
              style={{
                background: "#f0f0f0",
                margin: "10px 0",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <strong>{r.title}</strong> — {r.status}
              <br />
              <button onClick={() => handleResponse(r._id, "ACCEPT")}>
                Accept
              </button>
              <button onClick={() => handleResponse(r._id, "REJECT")}>
                Reject
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
