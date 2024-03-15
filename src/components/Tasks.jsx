import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "./Spinner";
import { UserContext } from "../context/userContext/LoginContext";

const Tasks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { tasks, updateTasks } = useContext(UserContext);
  const [error, setError] = useState(null);

  if (isLoading) {
    return <Spinner message={"Loading ......."} />;
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
