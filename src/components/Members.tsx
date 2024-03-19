import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "./Spinner";
import { UserContext } from "../context/userContext/LoginContext";

interface Member {
  id: number;
  name: string;
}

interface TasksCount {
  [key: number]: number;
}

const Members = () => {
  const { fetchTasksCount, members } = useContext(UserContext);
  const [tasksCount, setTasksCount] = useState<TasksCount>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);

    const fetchTasksCounts = async () => {
      try {
        const tasksCountMap: TasksCount = {};
        const tasksCountPromises = members.map((member: Member) =>
          fetchTasksCount(member.id)
        );

        const counts = await Promise.all(tasksCountPromises);
        members.forEach((member, index) => {
          tasksCountMap[member.id] = counts[index];
        });

        setTasksCount(tasksCountMap);
      } catch (error) {
        setError("Error fetching tasks count. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasksCounts();
  }, [members, fetchTasksCount]);

  if (isLoading) {
    return <Spinner message={"Loading ......."} />;
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
        {members.map((member: Member) => (
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
