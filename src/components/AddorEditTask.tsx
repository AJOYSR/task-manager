import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Spinner } from "./Spinner";
import { Formik, Form, Field } from "formik";

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

  const handleSubmit = async (values: any) => {
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
            title: values.title,
            description: values.description,
            memberId: values.memberId,
          },
          { headers }
        );
      } else {
        // Add mode: Create new task
        await axios.post(
          "http://127.0.0.1:9001/private/tasks",
          {
            title: values.title,
            description: values.description,
            memberId: values.memberId,
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
        <Spinner message={"Loading edit/add page"} />
      ) : (
        <Formik
          initialValues={{
            title: title || "",
            description: description || "",
            memberId: -1,
          }}
          onSubmit={(values) => {
            handleSubmit(values);
            console.log(values);
          }}
        >
          {() => (
            <Form>
              <Field
                name="title"
                placeholder="Enter title"
                className="input-name"
              />
              <Field
                name="description"
                placeholder="Enter Description"
                className="input-name"
              />
              <Field as="select" name="memberId" className="input-name">
                <option value="-1">Select a member</option>
                {memberList.map((member) => (
                  <option key={member.value} value={member.value}>
                    {member.label}
                  </option>
                ))}
              </Field>
              <button
                type="submit"
                className="submit-button"
                style={{ marginLeft: "10px" }}
              >
                Submit
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default AddorEditTask;
