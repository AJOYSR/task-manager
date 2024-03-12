import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const apiUrl = `http://127.0.0.1:9001/private/tasks/${id}`;

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const authToken = localStorage.getItem("token");

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log(response.data.task);
        setTask(response.data.task);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTask();
  }, [apiUrl]);

  return (
    <div>
      {task ? (
        <>
          <h3> {task.title}</h3>
          <p>{task.description}</p>
        </>
      ) : (
        <p>Loading task details...</p>
      )}
    </div>
  );
};

export default TaskDetails;
