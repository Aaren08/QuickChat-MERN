import { useState, useEffect, useContext } from "react";
import TypingContext from "./typingCon.js";
import AuthContext from "./authCon.js";

export const TypingProvider = ({ children }) => {
  const { authUser, socket } = useContext(AuthContext);
  const [typingUsers, setTypingUsers] = useState({});
  let typingTimeouts = {};

  useEffect(() => {
    if (socket) {
      socket.on("typing", ({ from }) => {
        setTypingUsers((prev) => ({ ...prev, [from]: true }));
      });

      socket.on("Online", ({ from }) => {
        setTypingUsers((prev) => {
          const updated = { ...prev };
          delete updated[from];
          return updated;
        });
      });

      return () => {
        socket.off("typing");
        socket.off("Online");
      };
    }
  }, [socket]);

  // This can be used inside input handlers
  const emitTyping = (to) => {
    if (!authUser?._id) return;

    socket.emit("typing", {
      from: authUser._id,
      to,
    });

    clearTimeout(typingTimeouts[to]);
    typingTimeouts[to] = setTimeout(() => {
      socket.emit("stop typing", {
        from: authUser._id,
        to,
      });
    }, 1500);
  };

  return (
    <TypingContext.Provider value={{ typingUsers, emitTyping }}>
      {children}
    </TypingContext.Provider>
  );
};

export default TypingContext;
