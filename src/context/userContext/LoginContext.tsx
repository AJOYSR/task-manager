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
  members: [],
  fetchMembers: () => null,
  fetchTaskCount: () => null,
  handleEditMember: () => null,
  handleDeleteMember: (_: any) => null,
});

export const LoginContextProvider = (props: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<null | string>(() => {
    const storedUserName = localStorage.getItem("userName");
    return storedUserName !== null ? storedUserName : "";
  });
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
      setUserName(localStorage.getItem("userName"));
      fetchTasks();
      fetchMembers();
    }
  }, []);

  const fetchMembers = async () => {
    const authToken = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    try {
      const response = await axios.get(
        "http://127.0.0.1:9001/private/members/",
        {
          headers,
        }
      );
      setMembers(response.data.members);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };


  const handleEditMember = async (id, name) => {
    const authToken = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    try {
      const endpoint = id ? `http://127.0.0.1:9001/private/members/${id}` : "http://127.0.0.1:9001/private/members";
      const method = id ? axios.patch : axios.post;

      const response = await method(endpoint, { name }, { headers });

      console.log("Response from server:", response.data);

      fetchMembers();

      navigate("/members");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  
  const handleDeleteMember = async (memberId) => {
    const url = `http://127.0.0.1:9001/private/members/${memberId}`;
    try {
      const authToken = localStorage.getItem("token");

      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Filter out the deleted member from members array
      fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };


  const fetchTasksCount = async (currentId) => {
    try {
      const authToken = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };

      const response = await axios.get("http://127.0.0.1:9001/private/tasks/", {
        headers,
      });

      const memberTasks = response.data.tasks.filter(
        (task) => task.memberId === currentId
      );

      return memberTasks.length;
    } catch (error) {
      console.error("Error fetching tasks count:", error);
      return 0;
    }
  };

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
      fetchMembers();
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
        members,
        fetchMembers,
        fetchTasksCount,
        handleEditMember,
        handleDeleteMember,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
