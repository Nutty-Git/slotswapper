import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const fetchEvents = async () => {
    const { data } = await api.get("/events");
    setEvents(data.events || data);
  };

  const createEvent = async (e) => {
    e.preventDefault();
    await api.post("/events", { title, startTime, endTime });
    setTitle("");
    setStartTime("");
    setEndTime("");
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", textAlign: "center" }}>
      <h2>Dashboard</h2>

      <form onSubmit={createEvent}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
        <button type="submit">Create Event</button>
      </form>

      <h3>Your Events</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {events.map((ev) => (
          <li
            key={ev._id}
            style={{
              background: "#e3e3e3",
              color: "#000",
              margin: "10px 0",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: "500",
            }}
          >
            <strong>{ev.title}</strong> — {ev.status || "BUSY"}
          </li>
        ))}
      </ul>
    </div>
  );
}
