import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Spinner } from "./Spinner";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const url = "http://127.0.0.1:9001/private/tasks/";

  useEffect(() => {
    setIsLoading(true);

    const authToken = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    axios
      .get(url, { headers })
      .then((response) => {
        setTasks(response.data.tasks);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setError("Error fetching tasks. Please try again later.");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (<Spinner message={"Loading ......."}/>);
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="info">
        <h1>List of Tasks</h1>{" "}
        <button className="info-button">
          <Link to={"/add-or-edit"} className="link-style ">
            {" "}
            Add new
          </Link>
        </button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="task-list">
            <p>
              <Link to={`/task-details/${task.id}`}>
                {task.id && task.title
                  ? ` ${task.title}`
                  : "Task Title Not Available"}
              </Link>
            </p>
            <p>
              {task.Member?.name ? (
                <Link to={`/member-details/${task.Member.id}`}>
                  {task.Member.name}
                </Link>
              ) : (
                <span>Member N/A</span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
