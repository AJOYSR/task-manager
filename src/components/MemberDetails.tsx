import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "./Modal";
import { Spinner } from "./Spinner";
import { UserContext } from "../context/userContext/LoginContext";

const MemberDetails = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { handleDeleteMember } = useContext(UserContext);

  const apiUrl = `http://127.0.0.1:9001/private/members/${id}`;
  const url = "http://127.0.0.1:9001/private/tasks/";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const authToken = localStorage.getItem("token");
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log(response.data.tasks);
        setTasks(response.data.tasks);

        // Filter tasks based on the memberId
        const memberTasks = response.data.tasks.filter(
          (task) => task.Member?.id === parseInt(id)
        );
        console.log(memberTasks);
        setUserTasks(memberTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [url, id]);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const authToken = localStorage.getItem("token");

        // Fetch member details
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log(response.data.member);
        setMember(response.data.member);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchMember();
  }, [apiUrl, tasks, id]);

  const handleDelete = () => {
    setShowModal(true);
  };

  const confirmDelete = async () => {
    await handleDeleteMember(id);
    setShowModal(false);
    navigate("/members");
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const handleEdit = () => {
    navigate(`/add-or-edit-member/${id}`);
  };

  return (
    <div className="member-detail">
      <div>
        {member ? (
          <>
            <h3>{member.name}</h3>
            <h4>Tasks:</h4>
            <ul>
              {userTasks.map((task) => (
                <li key={task.id}>
                  <Link to={`/task-details/${task.id}`}>{task.title}</Link>
                </li>
              ))}
            </ul>
            {showModal && (
              <Modal
                title="Confirm Deletion of this member"
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
      <div className="edit-delete">
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default MemberDetails;
