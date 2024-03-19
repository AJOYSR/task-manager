import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchMembersAsync, fetchTasksAsync } from "../../slices/mainSlice";
import { IStoreState } from "../../types/store";
import store from "./../../store/store";

interface IUserContext {
  isLoggedIn: boolean;
  handleLoginClick: (data: any) => void;
  userName: string | null;
  handleLogoutClick: () => void;
  tasks: any[]; // Define appropriate type for tasks
  updateTasks: () => void;
  handleEditTasks: (data: any) => void;
  handleDeleteTask: (taskId: any) => void;
  members: any[]; // Define appropriate type for members
  fetchMembers: () => void;
  fetchTasksCount: (currentId: any) => Promise<number>;
  handleEditMember: (id: any, name: string) => void;
  handleDeleteMember: (memberId: any) => void;
}

export const UserContext = createContext<IUserContext>({
  isLoggedIn: false,
  handleLoginClick: (_: any) => {},
  userName: "",
  handleLogoutClick: () => {},
  tasks: [],
  updateTasks: () => {},
  handleEditTasks: (_: any) => {},
  handleDeleteTask: (_: any) => {},
  members: [],
  fetchMembers: () => {},
  fetchTasksCount: async () => 0,
  handleEditMember: (_: any, __: string) => {},
  handleDeleteMember: (_: any) => {},
});

export const LoginContextProvider = (props: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<null | string>(() => {
    const storedUserName = localStorage.getItem("userName");
    return storedUserName !== null ? storedUserName : "";
  });
  const tasks = useSelector((state: IStoreState) => state.app.tasks);
  const members = useSelector((state: IStoreState) => state.app.members);
  const navigate = useNavigate();

  const dispatch: typeof store.dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
      setUserName(localStorage.getItem("userName"));
      fetchTasks();
      fetchMembers();
    }
  }, []);

  const fetchTasks = async () => {
    dispatch(fetchTasksAsync());
  };

  const fetchMembers = async () => {
    dispatch(fetchMembersAsync());
  };

  const handleEditMember = async (id: any, name: string) => {
    const authToken = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    try {
      const endpoint = id
        ? `http://127.0.0.1:9001/private/members/${id}`
        : "http://127.0.0.1:9001/private/members";
      const method = id ? axios.patch : axios.post;

      const response = await method(endpoint, { name }, { headers });

      console.log("Response from server:", response.data);

      fetchMembers();

      navigate("/members");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteMember = async (memberId: any) => {
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

  const fetchTasksCount = async (currentId: any) => {
    try {
      const authToken = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };

      const response = await axios.get("http://127.0.0.1:9001/private/tasks/", {
        headers,
      });

      const memberTasks = response.data.tasks.filter(
        (task: any) => task.memberId === currentId
      );

      return memberTasks.length;
    } catch (error) {
      console.error("Error fetching tasks count:", error);
      return 0;
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

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserName(null);
    navigate("/login");
    return null;
  };

  const updateTasks = () => {
    fetchTasks();
  };

  const handleEditTasks = async (data: any) => {
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

  const handleDeleteTask = async (taskId: any) => {
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
