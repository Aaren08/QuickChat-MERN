import { useState, useContext, useEffect, useCallback } from "react";
import AuthContext from "./authContext.js";
import ChatContext from "./chatContext.js";
import toast from "react-hot-toast";

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unSeenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // Function to get all users for sidebar
  const getAllUsers = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      setUsers(data.users);
      setUnseenMessages(data.unSeenMessages);
    } catch (error) {
      toast.error(error.message);
      console.error("Error fetching users:", error);
    }
  }, [axios]);

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
          setMessages((prevMessages) => {
            const updated = [...prevMessages, newMessage];
            return updated;
          });
          axios.put(`/api/messages/mark/${newMessage._id}`);
        } else {
          setUnseenMessages((prevUnseenMessages) => ({
            ...prevUnseenMessages,
            [newMessage.sender]: prevUnseenMessages[newMessage.sender]
              ? prevUnseenMessages[newMessage.sender] + 1
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
    setUnseenMessages,
    setSelectedUser,
    getAllUsers,
    setMessages,
    sendMessage,
    getMessages,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
