# QuickChat 

QuickChat is a lightweight real-time chat application built with the MERN stack (MongoDB, Express, React, Node) and Socket.IO for real-time features. It supports user signup/login, profile editing (with image upload via Cloudinary), one-to-one messaging with image support, typing indicators, presence (online/offline), and unseen message counts.

This README documents the repository structure, installation and run instructions, API endpoints, data models, socket events, and deployment/maintenance notes.

---

## Table of contents

- Project snapshot
- Tech stack
- Repository layout
- Quick start (dev)
- Environment variables (.env)
- Backend: install & run
- Frontend: install & run
- API reference (endpoints, request/response)
- Data models
- Socket events (real-time behavior)
- File uploads (Cloudinary)
- Security & auth
- Troubleshooting
- Next steps / recommendations

## Project snapshot

- Backend: Express app (ES Modules) with Socket.IO and MongoDB (mongoose). Server is in `backend/server.js`.
- Frontend: React + Vite, organized under `client/` with context providers for auth, chat, typing and theme.
- Realtime: Socket.IO used for presence, typing notifications and delivery of new messages.

## Tech stack

- Node.js, Express
- MongoDB (mongoose)
- Socket.IO (server & client)
- React (Vite) with Context API
- Cloudinary for image hosting
- JWT for authentication

## Repository layout (important files)

- `backend/`

  - `server.js` — Express app + Socket.IO server and connection logic
  - `lib/db.js` — MongoDB connection helper
  - `lib/generateToken.js` — JWT generation
  - `lib/cloudinary.js` — Cloudinary config
  - `controllers/` — `userController.js`, `messageController.js`
  - `models/` — `userModel.js`, `messageModel.js`
  - `routes/` — `userRoutes.js`, `messageRoutes.js`
  - `middleware/auth.js` — route protection middleware

- `client/`
  - `package.json`, `vite.config.js` — client config
  - `context/` — `ContexedAuth.jsx`, `ContexedChat.jsx`, `ContexedTyping.jsx`, `ContexedTheme.jsx` and small context files
  - `src/` — React app (pages, components, utilities)

## Quick start (prerequisites)

- Node.js (v18+ recommended)
- npm (or yarn)
- MongoDB instance (local or cloud)
- Cloudinary account (for profile & message image uploads)

Create a `.env` file for the backend (see next section).

## Environment variables (.env)

Create a `.env` file in `backend/` with at least the following variables:

```
MONGODB_URI=mongodb://localhost:27017
PORT=5000
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

For the frontend (client), Vite expects environment variables prefixed with `VITE_`. Create a `.env` in `client/` or set in your shell:

```
VITE_BACKEND_URL=http://localhost:5000
```

Make sure the backend URL matches where you run the server.

## Backend: install & run

1. Open a terminal in `backend/`.
2. Install dependencies:

```powershell
npm install
```

3. Run server in development (uses nodemon):

```powershell
npm run server
```

Or run in production mode:

```powershell
npm start
```

The server listens on `PORT` (default 5000). The server file exports the HTTP server (useful for serverless or hosting platforms).

## Frontend: install & run

1. Open a terminal in `client/`.
2. Install dependencies:

```powershell
npm install
```

3. Start the dev server:

```powershell
npm run dev
```

The client reads backend base URL from `import.meta.env.VITE_BACKEND_URL` (configured in `client/context/ContexedAuth.jsx`). Axios is configured to use that base URL.

## API reference

All backend routes are prefixed with `/api`.

Authentication

- POST /api/auth/signUp

  - Body: { fullName, email, password, bio }
  - Response: { success, token, user, message }
  - Creates new user, returns JWT token.

- POST /api/auth/logIn

  - Body: { email, password }
  - Response: { success, token, user, message }

- PUT /api/auth/updateProfile (protected)

  - Headers: token: <JWT>
  - Body: { fullName, bio, profilePic? }
    - `profilePic` may be a base64 data URL (client sends FileReader result); server uploads to Cloudinary.
  - Response: { success, user }

- GET /api/auth/check (protected)
  - Headers: token: <JWT>
  - Response: { success, user }

Messaging

- GET /api/messages/users (protected)

  - Returns: { success, users, unSeenMessages }

- GET /api/messages/:id (protected)

  - Returns messages between logged-in user and :id. Marks them as seen.

- POST /api/messages/:id (protected)

  - Body: { text?, image? }
    - `image` may be a base64 data URL — server uploads to Cloudinary and stores secure_url
  - Creates a Message document and emits real-time events.

- PUT /api/messages/mark/:id (protected)
  - Marks the message (by id) as seen.

Note: The server expects the JWT in the request header named `token`. Axios in the client sets this automatically when present in localStorage.

## Data models (short)

User (Mongoose)

- fullName: String (required)
- email: String (required, unique)
- password: String (hashed, required)
- profilePic: String (Cloudinary URL)
- bio: String

Message (Mongoose)

- sender: ObjectId -> User (required)
- receiver: ObjectId -> User (required)
- text: String
- image: String (Cloudinary URL)
- seen: Boolean (default: false)

## Socket / real-time behavior

- Client connects to Socket.IO using the backend URL with a `userId` query param (see `ContexedAuth.jsx`).
- Server stores an `onlineUsers` map: { userId: socketId } and emits `getOnlineUsers` (array of online userIds) to all clients when connections change.

Events (server -> client, client -> server):

- client -> server: `typing` { from, to }

  - server -> target: `typing` { from }

- client -> server: `stop typing` { from, to }

  - server -> target: `Online` { from } // server emits `Online` when stop-typing occurs

- server emits `newMessage` when a message is created (to both sender and receiver sockets if connected).

Client-side behavior

- The Chat context subscribes to `newMessage` and either appends to the active conversation (and marks message seen via API) or increments unseen counts.
- The Typing provider emits `typing` on user input and emits `stop typing` after a timeout (~1.5s).

## File uploads (Cloudinary)

- The app sends image data as base64 Data URLs to the backend (profile pics and message images). The backend uses `cloudinary.uploader.upload` to upload and stores `secure_url` on the resource.
- Configure Cloudinary credentials via `.env` (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).

## Security & auth

- Passwords are hashed with bcrypt on signup.
- JWTs are used for authentication. The server's `protectRoute` middleware expects the token in the `token` header and verifies it using `JWT_SECRET`.

Important: Keep `JWT_SECRET` and Cloudinary keys private. Never commit `.env` to git.

## Troubleshooting

- Socket connection issues:

  - Ensure `VITE_BACKEND_URL` points to the running server.
  - If dev server runs on a different port, allow CORS and Socket.IO origins in server config.

- Authentication errors:

  - Ensure `JWT_SECRET` is identical in server env across restarts.
  - Axios attaches `token` header from localStorage — confirm it exists.

- MongoDB connection errors:
  - Check `MONGODB_URI` and network connectivity.

## Commands quick reference

Backend (in `backend/`):

```powershell
npm install
npm run server   # development (nodemon)
npm start        # node server.js (production)
```

Frontend (in `client/`):

```powershell
npm install
npm run dev
npm run build    # production build
```

## Next steps & recommendations

- Add unit and integration tests (Jest / Supertest for backend; React Testing Library for frontend).
- Add server-side input validation (e.g., celebrate/Joi) to harden APIs.
- Add rate limiting and request-size limits for uploads.
- Add CI linting and test runs for PRs.

## Contributing

1. Fork the repo and create a branch for your feature.
2. Add tests for new behavior.
3. Open a PR with clear description and screenshots if UI changes.

---
