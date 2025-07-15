import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Create Socket.io server
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store online users
export const onlineUsers = {}; // { userId: socketId }

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("A user connected", userId);

  if (userId) {
    onlineUsers[userId] = socket.id;
    socket.join(userId); // user joins their own room for direct messages
  }

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(onlineUsers));

  // Listen for typing event and send to the target user only
  socket.on("typing", ({ from, to }) => {
    if (onlineUsers[to]) {
      io.to(to).emit("typing", { from });
    }
  });

  // If user stops typing, tell the receiver they are back to "Online"
  socket.on("stop typing", ({ from, to }) => {
    if (onlineUsers[to]) {
      io.to(to).emit("Online", { from }); // ← key change here
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", userId);
    delete onlineUsers[userId];
    io.emit("getOnlineUsers", Object.keys(onlineUsers));
  });
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api/status", (req, res) => {
  res.send("Server is running");
});

// Routes
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB
connectDB();

// Start server
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

// Export server for Vercel
export default server;
