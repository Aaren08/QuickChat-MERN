import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/ContexedAuth.jsx";
import { ChatProvider } from "../context/ContexedChat.jsx";
import { TypingProvider } from "../context/ContexedTyping.jsx";
import { ThemeProvider } from "../context/ContexedTheme.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <TypingProvider>
            <App />
          </TypingProvider>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
