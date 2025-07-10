import { useState, useContext, useEffect } from "react";
import AuthContext from "./authContext.js";
import ChatContext from "./ChatContext";
import toast from "react-hot-toast";

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unSeenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // Function to get all users for sidebar
  const getAllUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      setUsers(data.users);
      setUnseenMessages(data.unSeenMessages);
    } catch (error) {
      toast.error(error.message);
      console.error("Error fetching users:", error);
    }
  };

  // Function to get messages for the selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      setMessages(data.messages);
    } catch (error) {
      toast.error(error.message);
      console.error("Error fetching messages:", error);
    }
  };

  // Function to send message to selected user
  const sendMessage = async (message) => {
    try {
      const { data } = await axios.post(
        `/api/messages/${selectedUser._id}`,
        message
      );
      setMessages((prevMessages) => [...prevMessages, data.newMessage]);
    } catch (error) {
      toast.error(error.message);
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    // Function to subscribe to messages for selected user (getting new messages)
    const subscribeToMessages = async () => {
      if (!socket) return;

      socket.on("newMessage", (newMessage) => {
        if (selectedUser && newMessage.sender === selectedUser._id) {
          newMessage.seen = true;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          axios.put(`/api/messages/mark/${newMessage._id}`);
        } else {
          setUnseenMessages((prevUnseenMessages) => ({
            ...prevUnseenMessages,
            [newMessage.sender]: prevUnseenMessages[newMessage.senderId]
              ? prevUnseenMessages[newMessage.senderId] + 1
              : 1,
          }));
        }
      });
    };

    // Function to unsubscribe from messages for selected user
    const unsubscribeFromMessages = async () => {
      if (!socket) return;
      socket.off("newMessage");
    };

    subscribeToMessages();
    return () => {
      unsubscribeFromMessages();
    };
  }, [socket, selectedUser, axios]);

  const value = {
    messages,
    users,
    selectedUser,
    unSeenMessages,
    setSelectedUser,
    getAllUsers,
    setMessages,
    sendMessage,
    getMessages,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
