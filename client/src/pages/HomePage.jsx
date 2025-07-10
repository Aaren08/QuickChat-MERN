import { useState } from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import ChatContainer from "../components/ChatContainer/ChatContainer";
import RightSidebar from "../components/RightSidebar/RightSidebar";

const HomePage = () => {
  const [selectedUser, setSelectedUser] = useState(false);

  return (
    <div
      className={`homePage-wrapper ${
        selectedUser ? "userSelected" : "noUserSelected"
      }`}
    >
      <Sidebar />
      <ChatContainer />
      <RightSidebar
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
    </div>
  );
};

export default HomePage;
