import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const MemberDetails = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [userTasks, setUserTasks] = useState([]);

  const apiUrl = `http://127.0.0.1:9001/private/members/${id}`;
  const url = "http://127.0.0.1:9001/private/tasks/";

  useEffect(() => {
    const authToken = localStorage.getItem("token");

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setTasks(response.data.tasks);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, [url]);

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

        const memberTasks = tasks.filter(
          (task) => task.Member.id === member.id
        );

        console.log(memberTasks);

        setUserTasks(memberTasks);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchMember();
  }, [apiUrl, tasks, id]);

  return (
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
        </>
      ) : (
        <p>Loading member details...</p>
      )}
    </div>
  );
};

export default MemberDetails;
