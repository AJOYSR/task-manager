import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Spinner } from "./Spinner";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [tasksCount, setTasksCount] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const url = "http://127.0.0.1:9001/private/members/";

  useEffect(() => {
    setIsLoading(true);

    const authToken = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    axios
      .get(url, { headers })
      .then((response) => {
        setMembers(response.data.members);

        // Fetch tasks count for each member
        const tasksCountPromises = response.data.members.map((member) =>
          fetchTasksCount(member.id)
        );

        // Wait for all promises to resolve and update tasks count state
        Promise.all(tasksCountPromises)
          .then((counts) => {
            const tasksCountMap = {};
            response.data.members.forEach((member, index) => {
              tasksCountMap[member.id] = counts[index];
            });
            setTasksCount(tasksCountMap);
          })
          .catch((error) => {
            setError("Error fetching tasks count. Please try again later.");
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error fetching members:", error);
        setError("Error fetching members. Please try again later.");
        setIsLoading(false);
      });
  }, []);

  const fetchTasksCount = async (currentId) => {
    try {
      const authToken = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };

      // Fetch all tasks from the server
      const response = await axios.get("http://127.0.0.1:9001/private/tasks/", {
        headers,
      });

      // Filter tasks based on the memberId
      const memberTasks = response.data.tasks.filter(
        (task) => task.memberId === currentId
      );

      // Return the count of tasks for the member
      return memberTasks.length;
    } catch (error) {
      console.error("Error fetching tasks count:", error);
      return 0;
    }
  };

  if (isLoading) {
    return (<Spinner message={"Loading ......."}/>);
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="info">
        <h1>List of Members</h1>{" "}
        <button className="info-button">
          <Link to={"/add-or-edit-member"} className="link-style ">
            {" "}
            Add new
          </Link>
        </button>
      </div>
      <ul>
        {members.map((member) => (
          <li className="task-list" key={member.id}>
            <p>
              <Link to={`/member-details/${member.id}`}>
                {member.id}. {member.name}
              </Link>
              <span style={{ marginLeft: "10px" }}>
                (Tasks: {tasksCount[member.id]})
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Members;
