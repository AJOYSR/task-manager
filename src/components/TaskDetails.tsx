import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";
import Modal from "./Modal";
import { Spinner } from "./Spinner";

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
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

        setTask(response.data.task);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTask();
  }, [apiUrl]);

  const handleDelete = () => {
    setShowModal(true);
  };

  const confirmDelete = async () => {
    const url = "http://127.0.0.1:9001/private/tasks/";
    try {
      const authToken = localStorage.getItem("token");

      await axios.delete(url + `${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setShowModal(false);
      navigate("/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleEdit = () => {
    navigate(`/add-or-edit/${id}`);
  };

  return (
    <div>
      {task ? (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>

          <div className="edit-delete">
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </div>

          {showModal && (
            <Modal
              title="Confirm Deletion of this task"
              buttonTitle="Delete"
              deleteRecord={confirmDelete}
              closeModal={closeModal}
            />
          )}
        </>
      ) : (
        <Spinner message={"Loading task details..."} />
      )}
    </div>
  );
};

export default TaskDetails;
