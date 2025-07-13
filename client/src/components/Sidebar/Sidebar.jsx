import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../../context/authContext.js";
import ChatContext from "../../../context/chatContext.js";
import TypingContext from "../../../context/typingContext.js";
import assets from "../../assets/assets.js";
import "./Sidebar.css";

const Sidebar = () => {
  const {
    getAllUsers,
    users,
    selectedUser,
    setSelectedUser,
    unSeenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const { typingUsers } = useContext(TypingContext);

  const [input, setInput] = useState(false);

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getAllUsers();
  }, [onlineUsers, getAllUsers]);

  const navigate = useNavigate();
  return (
    <div className={`sidebar-container ${selectedUser ? "shouldHide" : ""}`}>
      <div style={{ paddingBottom: "5px" }}>
        <div className="sidebar-wrapper">
          <img src={assets.logo} alt="logo" style={{ maxWidth: "10rem" }} />
          <div className="menu group">
            <img
              src={assets.menu_icon}
              alt="menu"
              style={{
                maxHeight: "1.25rem",
                cursor: "pointer",
              }}
            />
            <div className="subMenu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr className="subMenuDivider" />
              <p onClick={() => logout()}>Logout</p>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}

        <div className="searchBar">
          <img
            src={assets.search_icon}
            alt="search"
            style={{ width: "0.75rem" }}
          />
          <input
            type="text"
            className="search"
            placeholder="Search User..."
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>

      {/* USER LIST */}

      <div className="userList">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}
            className={`user ${selectedUser?._id === user._id && "active"}`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt="profile image"
              className="profilePic"
            />

            {/* USER NAME & CONNECTION STATUS */}
            <div className="userName">
              <p>{user?.fullName}</p>
              {typingUsers[user._id] ? (
                <span className="typing">typing...</span>
              ) : onlineUsers.includes(user._id) ? (
                <span className="online">Online</span>
              ) : (
                <span className="offline">Offline</span>
              )}
            </div>

            {/* MESSAGE STATUS */}
            {unSeenMessages[user._id] > 0 && (
              <p className="messageStatus">{unSeenMessages[user._id]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
