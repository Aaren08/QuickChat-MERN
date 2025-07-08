import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login/Login";
import Profile from "./pages//Profile/Profile";
import AuthContext from "../context/authContext.js";

const App = () => {
  const { authUser } = useContext(AuthContext);

  return (
    <div className="App">
      <Toaster />
      <Routes>
        {/* Updating routes for authentication */}
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
