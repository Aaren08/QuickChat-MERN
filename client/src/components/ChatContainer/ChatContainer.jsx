import { useEffect, useRef } from "react";
import assets, { messagesDummyData } from "../../assets/assets";
import "./chatContainer.css";
import { formatMessageTime } from "../../lib/utils";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedUser]);

  return selectedUser ? (
    <div className="chatContainer">
      {/* HEADER */}
      <div className="headerContent">
        <img src={assets.profile_martin} alt="image" className="avatar" />
        <p>
          Martin Johnson
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
        {messagesDummyData.map((message, index) => (
          <div
            key={index}
            className={`conversation ${
              message.senderId !== "680f50e4f10f3cd28382ecf9" && "msg-received"
            }`}
          >
            {message.image ? (
              <img src={message.image} alt="image" className="inChatImage" />
            ) : (
              <p
                className={`userMessage ${
                  message.senderId !== "680f50e4f10f3cd28382ecf9"
                    ? "userMessageReceived"
                    : "userMessageSent"
                }`}
              >
                {message.text}
              </p>
            )}

            {/* MESSAGE TIME */}
            <div className="messageTime">
              <img
                src={
                  message.senderId === "680f50e4f10f3cd28382ecf9"
                    ? assets.avatar_icon
                    : assets.profile_martin
                }
                alt="image"
              />
              <p style={{ color: "#6b7280" }}>
                {formatMessageTime(message.createdAt)}
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
          />
          <input type="file" id="image" accept="image/*" hidden />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="image"
              className="inputImageIcon"
            />
          </label>
        </div>
        <img src={assets.send_button} alt="image" className="sendMessageIcon" />
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
