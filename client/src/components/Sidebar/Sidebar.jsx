import { useNavigate } from "react-router-dom";
import assets, { userDummyData } from "../../assets/assets.js";
import "./Sidebar.css";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
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
              <p>Logout</p>
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
          <input type="text" className="search" placeholder="Search User..." />
        </div>
      </div>

      {/* USER LIST */}

      <div className="userList">
        {userDummyData.map((user, index) => (
          <div
            key={index}
            onClick={() => setSelectedUser(user)}
            className={`user ${selectedUser?._id === user._id && "active"}`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt="profile image"
              className="profilePic"
            />

            {/* USER NAME & MESSAGES */}
            <div className="userName">
              <p>{user?.fullName}</p>
              {index < 3 ? (
                <span className="online">Online</span>
              ) : (
                <span className="offline">Offline</span>
              )}
            </div>

            {/* MESSAGE STATUS */}
            {index > 2 && <p className="messageStatus">{index}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
