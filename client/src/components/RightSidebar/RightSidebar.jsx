import assets, { imagesDummyData } from "../../assets/assets.js";
import "./RightSidebar.css";

const RightSidebar = ({ selectedUser }) => {
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
            <p className="connectionIndicator"></p>
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
            {imagesDummyData.map((url, index) => (
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
        <button className="logOutBtn">Logout</button>
      </div>
    )
  );
};

export default RightSidebar;
