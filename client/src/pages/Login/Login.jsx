import { useState, useContext } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import AuthContext from "../../../context/authContext.js";
import assets from "../../assets/assets.js";
import "./Login.css";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (currentState === "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    login(currentState === "Sign Up" ? "signUp" : "logIn", {
      fullName,
      email,
      password,
      bio,
    });
  };

  return (
    <div className="loginPage">
      {/* LEFT */}
      <div className="logoWrapper">
        <img src={assets.logo} alt="image" className="leftLoginImage" />
        <span className="logoText">QuickChat</span>
      </div>

      {/* RIGHT */}
      <form onSubmit={onSubmitHandler} className="loginForm">
        <h2>
          {currentState}

          {/* CONDITION FOR BACK AND FORTH TRANSITION */}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt="image"
            />
          )}
        </h2>

        {currentState === "Sign Up" && !isDataSubmitted && (
          <input
            type="text"
            name="fullName"
            id="fullName"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type={revealPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setRevealPassword((prev) => !prev)}
              className="togglePasswordIcon"
              aria-label="Toggle password visibility"
            >
              {revealPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
          </>
        )}

        {currentState === "Sign Up" && isDataSubmitted && (
          <textarea
            rows={6}
            id="bio"
            placeholder="Provide a short bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          ></textarea>
        )}

        <button type="submit" className="formBtn">
          {currentState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        <div className="terms">
          <input type="checkbox" />
          <p>Agree to Terms of Use & Privacy Policy</p>
        </div>

        <div className="conditionalAuth">
          {currentState === "Sign Up" ? (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrentState("Login Now");
                  setIsDataSubmitted(false);
                }}
              >
                Login Here
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <span
                onClick={() => {
                  setCurrentState("Sign Up");
                  setIsDataSubmitted(false);
                }}
              >
                Sign Up
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
