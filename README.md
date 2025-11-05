"# slotswapper" 

A full-stack web application (React + Node.js + Express + MongoDB) that allows users to create events, mark them as swappable, request swaps, and accept or reject swap requests. 

---

## 🧭 Project Overview

**SlotSwapper** lets multiple users manage time-slots (“events”) and exchange them with one another.  
Key capabilities:

- User authentication (signup/login) with JWT.
- CRUD operations for personal events.
- Mark events as **SWAPPABLE** or **BUSY**.
- Request to swap another user’s available slot.
- Accept or reject incoming swap requests.

### Design choices
- A **single `Event` model** stores event details and swap status, keeping the schema simple.
- Swap logic handled via two endpoints: `swap-request` and `swap-response`.
- Lightweight frontend built with **Vite (Rolldown)** React — minimal styling, focus on functionality.
- Separated **client** and **server** folders for clear structure.

---

## 🗂️ Directory Structure

slotswapper/
├── client/ # React (Vite) frontend
│ ├── src/
│ ├── package.json
│ └── vite.config.js
├── server/ # Node/Express backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── server.js
│ ├── package.json
│ └── .env
├── .gitignore
└── README.md

---

## ⚙️ Setup and Run Locally

### Prerequisites
- Node.js ≥ 18 and npm  
- MongoDB Atlas connection (URI string)  
- GitHub account for cloning this repo  

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Nutty-Git/slotswapper.git
cd slotswapper

2️⃣ Backend Setup

cd server
npm install

Create a file named .env inside /server:
PORT=5000
MONGO_URI=<your_mongodb_url>
JWT_SECRET=slotswapper_secret

Start backend:
npm run dev
It runs at http://localhost:5000

3️⃣ Frontend Setup

cd ../client
npm install
npm run dev
It runs at http://localhost:5173

🔐 Authentication

All protected routes require a header:

Authorization: Bearer <JWT_TOKEN>
Signup and login return a valid JWT.

📡 API Endpoints
Auth Routes
Method	Endpoint	Description	Body
POST	/api/auth/signup	Register new user	{ "name": "A", "email": "a@email.com", "password": "pass" }
POST	/api/auth/login	Login existing user	{ "email": "a@email.com", "password": "pass" }

Event Routes
Method	Endpoint	Description	Body
POST	/api/events	Create event	{ "title": "Meeting", "startTime": "...", "endTime": "..." }
GET	/api/events	Get logged-in user’s events	—
PUT	/api/events/:id	Update event (status or time)
{ "status": "SWAPPABLE" }
DELETE	/api/events/:id	Delete event	—
GET	/api/events/swappable-slots	Get other users’ SWAPPABLE events	—

Swap Routes
Method	Endpoint	Description	Body
POST	/api/events/swap-request/:eventId	Request swap on another user’s event	—
POST	/api/swaps/swap-response/:eventId	Respond to swap request	{ "action": "accept" } or { "action": "reject" }

🧪 Testing Flow (Thunder Client)
1.Signup two users (User A & User B).
2.Login both separately → store their JWT tokens.
3.User A → create an event → set status: "SWAPPABLE".
4.User B → view /events/swappable-slots → send POST /swap-request/:id.
5.User A → see event as SWAP_PENDING → send POST /swaps/swap-response/:id with { "action": "accept" } or "reject".
6.Confirm MongoDB status updates (BUSY / SWAPPED / SWAPPABLE).

💡 Assumptions & Challenges
Assumptions

-A swap means both participants’ slots become BUSY (or SWAPPED) once accepted.
-Only event owners can respond to swaps.

Challenges

-Matching ObjectId vs. string IDs caused auth comparison errors — fixed via .toString().
-JWT decoding errors handled with clear logs.
-Frontend state sync after backend updates required refetching events.

🎨 UI Note
Minimal styling used intentionally — emphasis on correct API integration and data flow, not visual design.
CSS kept basic for clarity and faster loading.

🚀 Deployment
If deployment is later required:

Frontend: Vercel → root client/

Backend: Render or Railway → root server/
Add .env vars: PORT, MONGO_URI, JWT_SECRET
Update client/src/api/axios.js baseURL to deployed backend.

🧾 Credits
Developed by Shruti Hedau
For ServiceHive SDE Assignment
GitHub: https://github.com/Nutty-Git

✅ Summary

✔ Full authentication system
✔ Event management
✔ Swap request and response workflows
✔ Functional frontend + backend integration
✔ Complete documentation for local setup
