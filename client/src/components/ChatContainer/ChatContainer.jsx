import { useEffect, useRef, useContext, useState } from "react";
import { toast } from "react-hot-toast";
import assets from "../../assets/assets.js";
import ChatContext from "../../../context/chatContext.js";
import AuthContext from "../../../context/authContext.js";
import { formatMessageTime } from "../../lib/utils.js";
import "./chatContainer.css";

const ChatContainer = () => {
  const { authUser, onlineUsers } = useContext(AuthContext);
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } =
    useContext(ChatContext);

  const [input, setInput] = useState("");
  const scrollEnd = useRef();

  // Function to send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({
      text: input.trim(),
    });
    setInput("");
  };

  // Function to send an image in a chat
  const handleSendImage = async (e) => {
    e.preventDefault();
    const imageFile = e.target.files[0];
    if (!imageFile || !imageFile.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(imageFile);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div className="chatContainer">
      {/* HEADER */}
      <div className="headerContent">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt="image"
          className="avatar"
        />
        <p>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id)}
          <span className="connectionIndicator"></span>
        </p>

        {/* INFO ICON & ADD ICON */}

        <img
          src={assets.arrow_icon}
          alt="image"
          className="arrowIcon"
          onClick={() => setSelectedUser(null)}
        />
        <img src={assets.help_icon} alt="image" className="helpIcon" />
      </div>

      {/* MESSAGING AREA */}
      <div className="messagesContainer">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`conversation ${
              message?.sender !== authUser._id && "msg-received"
            }`}
          >
            {message?.image ? (
              <img src={message.image} alt="image" className="inChatImage" />
            ) : (
              <p
                className={`userMessage ${
                  message?.sender === authUser._id
                    ? "userMessageSent"
                    : "userMessageReceived"
                }`}
              >
                {message?.text}
              </p>
            )}

            {/* MESSAGE TIME & USER AVATAR*/}
            <div className="messageTime">
              <img
                src={
                  message?.sender === authUser._id
                    ? authUser?.profilePic || assets.avatar_icon
                    : selectedUser?.profilePic || assets.avatar_icon
                }
                alt="image"
              />
              <p style={{ color: "#6b7280" }}>
                {formatMessageTime(message?.createdAt)}
              </p>
            </div>
          </div>
        ))}

        {/* SENDING NEW MESSAGE*/}
        <div ref={scrollEnd}></div>
      </div>

      {/* INPUT BAR */}
      <div className="inputField">
        <div className="inputFieldWrapper">
          <input
            type="text"
            placeholder="Send a message"
            className="inputBar"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/*"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="image"
              className="inputImageIcon"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt="image"
          className="sendMessageIcon"
        />
      </div>
    </div>
  ) : (
    <div className="chatContainer2">
      <img src={assets.logo_icon} alt="image" style={{ maxWidth: "4rem" }} />
      <p>Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
