import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const UserContext = createContext({
  isLoggedIn: false,
  handleLoginClick: (_: any) => null,
  userName: "",
  handleLogoutClick: (_: any) => null,
  tasks: [],
  updateTasks: (_: any) => null,
});

export const LoginContextProvider = (props: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<null | string>(() => {
    const storedUserName = localStorage.getItem("userName");
    return storedUserName !== null ? storedUserName : "";
  });
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
      setUserName(localStorage.getItem("userName"));
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    const authToken = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    try {
      const response = await axios.get("http://127.0.0.1:9001/private/tasks/", {
        headers,
      });
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleLoginClick = (data: any) => {
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user.name);
      setIsLoggedIn(true);
      setUserName(data.user.name);
      fetchTasks();
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

  const updateTasks = (newTasks: any) => {
    setTasks(newTasks);
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        handleLoginClick,
        userName,
        handleLogoutClick,
        tasks,
        updateTasks,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
