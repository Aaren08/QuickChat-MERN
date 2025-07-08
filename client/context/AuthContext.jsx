import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import AuthContext from "./authContext.js";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [socket, setSocket] = useState(null);

  // Connect socket function to handle socket connection and online users update

  const connectSocket = useCallback(
    (userData) => {
      if (!userData || socket?.connected) return;

      const newSocket = io(backendUrl, {
        query: {
          userId: userData._id,
        },
      });

      newSocket.connect();
      setSocket(newSocket);

      newSocket.on("onlineUsers", (users) => {
        setOnlineUsers(users);
      });
    },
    [socket, setSocket, setOnlineUsers]
  );

  // Check if user is authenticated, if so, set user data and connect socket
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/auth/check");

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [setAuthUser, connectSocket]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth();
  }, [checkAuth, token]);

  // Login function to handle user authentication and socket connection

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setToken(data.token);
        setAuthUser(data.user);
        connectSocket(data.user);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["token"] = data.token;
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Logout function to handle user logout and socket disconnection

  const logout = async () => {
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    socket?.disconnect();
    localStorage.removeItem("token");
    axios.defaults.headers.common["token"] = null;
    toast.success("Logout successful");
  };

  // Update user profile function to handle user profile update

  const updateUserProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/updateProfile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
