import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { Spinner } from "./Spinner";

const AddorEditTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [memberList, setMemberList] = useState([]);
  const [memberId, setMemberId] = useState(-1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state for loading spinner
  const navigate = useNavigate();
  const { id } = useParams();
  const taskUrl = `http://127.0.0.1:9001/private/tasks/${id}`;
  const membersUrl = "http://127.0.0.1:9001/private/members/";

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    setIsLoading(true); // Start loading
    axios
      .get(membersUrl, { headers })
      .then((response) => {
        const newMemList = response.data.members.map((indMember) => {
          return {
            value: indMember.id,
            label: indMember.name,
          };
        });
        setMemberList(newMemList);
      })
      .catch((error) => {
        console.error("Error fetching members:", error);
      })
      .finally(() => {
        setIsLoading(false); // Stop loading
      });

    if (id) {
      setIsEditMode(true);

      setIsLoading(true); // Start loading
      axios
        .get(taskUrl, { headers })
        .then((response) => {
          const taskDetails = response.data.task;
          setTitle(taskDetails.title);
          setDescription(taskDetails.description);
          setMemberId(taskDetails.memberId);
        })
        .catch((error) => {
          console.error("Error fetching task details:", error);
        })
        .finally(() => {
          setIsLoading(false); // Stop loading
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    setIsLoading(true); // Start loading
    try {
      if (isEditMode) {
        await axios.patch(
          taskUrl,
          {
            title,
            description,
            memberId,
          },
          { headers }
        );
      } else {
        // Add mode: Create new task
        await axios.post(
          "http://127.0.0.1:9001/private/tasks",
          {
            title,
            description,
            memberId,
          },
          { headers }
        );
      }
      navigate("/tasks");
      console.log("Task submitted successfully!");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <br />
      {isLoading ? ( 
        <Spinner message={"Loading edit/add page"}/>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <input
                type="text"
                className="input-name"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <input
                type="textarea"
                className="input-name"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <Select
                placeholder="Assigned to"
                options={memberList}
                onChange={(selectedOption) => {
                  setMemberId(selectedOption.value);
                }}
                value={memberList.find((member) => member.value === memberId)}
              />
            </div>
          </div>
          <button className="submit-button" type="submit">
            {isEditMode ? "Update" : "Add"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddorEditTask;
