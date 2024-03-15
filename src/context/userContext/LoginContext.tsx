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
  handleEditTasks: (_: any) => null,
  handleDeleteTask: (_: any) => null,
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
    fetchTasks();
  };

  const handleEditTasks = async (data) => {
    const authToken = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    try {
      if (data.id) {
        // Edit mode
        const taskUrl = `http://127.0.0.1:9001/private/tasks/${data.id}`;
        await axios.patch(
          taskUrl,
          {
            title: data.title,
            description: data.description,
            memberId: data.memberId,
          },
          { headers }
        );

        // for updating tasks
        fetchTasks();
      } else {
        // Add mode
        await axios.post(
          "http://127.0.0.1:9001/private/tasks",
          {
            title: data.title,
            description: data.description,
            memberId: data.memberId,
          },
          { headers }
        );

        // Fetch updated tasks and update tasks array
        fetchTasks();
      }
    } catch (error) {
      console.error("Error editing/adding task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const authToken = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    try {
      await axios.delete(`http://127.0.0.1:9001/private/tasks/${taskId}`, {
        headers,
      });

      // Filter out the deleted task from tasks array
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
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
        handleEditTasks,
        handleDeleteTask,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
