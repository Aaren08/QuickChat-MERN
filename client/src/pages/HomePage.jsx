import { useContext } from "react";
import ChatContext from "../../context/chatContext.js";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatContainer from "../components/ChatContainer/ChatContainer";
import RightSidebar from "../components/RightSidebar/RightSidebar";

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);
  return (
    <div
      className={`homePage-wrapper ${
        selectedUser ? "userSelected" : "noUserSelected"
      }`}
    >
      <Sidebar />
      <ChatContainer />
      <RightSidebar />
    </div>
  );
};

export default HomePage;
