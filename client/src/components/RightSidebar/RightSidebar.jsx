import { useContext, useEffect, useState } from "react";
import ChatContext from "../../../context/chatCon.js";
import AuthContext from "../../../context/authCon.js";
import assets from "../../assets/assets.js";
import "./RightSidebar.css";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  const [messageImages, setMessageImages] = useState([]);

  // Get all images from images present in chat and set them to state
  useEffect(() => {
    setMessageImages(
      messages.filter((index) => index?.image).map((index) => index.image)
    );
  }, [messages]);

  return (
    selectedUser && (
      <div
        className={`userProfileContainer ${selectedUser ? "notDisplay" : ""}`}
      >
        {/* USER PROFILE */}
        <div className="userProfileWrapper">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt="image"
            className="userProfileImage"
          />
          <h1 className="selectedUserName">
            {onlineUsers?.includes(selectedUser?._id) && (
              <p className="connectionIndicator"></p>
            )}
            {selectedUser?.fullName}
          </h1>

          {/*  USER BIO */}
          <p className="userBio">{selectedUser?.bio}</p>
        </div>

        {/* USER MEDIA */}
        <hr style={{ borderColor: "#FFFFFF50", margin: "1rem 0" }} />
        <div className="userMediaWrapper">
          <p>Media</p>
          <div className="userMedia">
            {messageImages.map((url, index) => (
              <div
                key={index}
                style={{
                  cursor: "pointer",
                  borderRadius: "0.25rem",
                }}
                onClick={() => window.open(url)}
              >
                <img src={url} alt="image" className="userMediaImage" />
              </div>
            ))}
          </div>
        </div>

        {/* LOGOUT */}
        <button onClick={() => logout()} className="logOutBtn">
          Logout
        </button>
      </div>
    )
  );
};

export default RightSidebar;
