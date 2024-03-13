import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext({
  isLoggedIn: false,
  handleLoginClick: (_: any) => null,
  userName: "",
  handleLogoutClick: (_: any) => null,
});

export const LoginContextProvider = (props: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<null | string>(() => {
    const storedUserName = localStorage.getItem("userName");
    return storedUserName !== null ? storedUserName : "";
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
      setUserName(localStorage.getItem("userName"));
    }
  }, []);

  const handleLoginClick = (data: any) => {
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user.name);
      setIsLoggedIn(true);
      console.log(data.user.name, "checklo");
      setUserName(data.user.name);
    }
    return null;
  };

  const handleLogoutClick = (data: any) => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserName(null);
    navigate("/login");
    return null;
  };

  return (
    <UserContext.Provider
      value={{ isLoggedIn, handleLoginClick, userName, handleLogoutClick }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
