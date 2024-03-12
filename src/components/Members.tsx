import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Members = () => {
  const [members, setMembers] = useState([]);
  const url = "http://127.0.0.1:9001/private/members/";

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
        console.log(response.data.members);
        setMembers(response.data.members);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, []);

  return (
    <div>
      <h1>Members</h1>
      <ul>
        {members.map((member) => (
          <li className="task-list" key={member.id}>
            <p>
              <Link to={`/member-details/${member.id}`}>
                {member.id}. {member.name}
              </Link>
            </p>
            {/* <p>{task.member.name}</p> */}

          </li>
        ))}
      </ul>
    </div>
  );
};

export default Members;
