import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const url = "http://127.0.0.1:9001/private/tasks/";

  useEffect(() => {
    // Assuming you have the token stored in your state or context
    const authToken = localStorage.getItem("token");

    // Set up headers with the Authorization token
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    axios
      .get(url, { headers })
      .then((response) => {
        console.log(response.data.tasks);
        setTasks(response.data.tasks);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  return (
    <div>
      <h1>Tasks</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="task-list">
            <p>
              <Link to={`/task-details/${task.id}`}>
                {task.id}. {task.title}
              </Link>
            </p>
            <p>{task.Member.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
