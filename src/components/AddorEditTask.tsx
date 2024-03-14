import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Spinner } from "./Spinner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // Import Yup for validation

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

  const handleSubmit = async (values) => {
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
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .required("Title is required")
              .min(10, "Minimum 10 characters")
              .max(255, "Maximum 255 characters"),
            description: Yup.string()
              .required("Description is required")
              .min(15, "Minimum 15 characters")
              .max(255, "Maximum 255 characters"),
            memberId: Yup.number()
              .required("Member selection is required")
              .positive("Member selection is required")
              .integer("Member selection is required"),
          })}
          onSubmit={(values) => {
            handleSubmit(values);
            console.log(values);
          }}
        >
          {({ errors, touched }) => (
            <Form
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                maxWidth: "500px",
                margin: "auto",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <Field
                name="title"
                placeholder="Enter title"
                className={`input-name ${
                  touched.title && errors.title ? "error" : ""
                }`}
              />
              {touched.title && errors.title && (
                <div className="error">{errors.title}</div>
              )}

              <Field
                name="description"
                placeholder="Enter Description"
                className={`input-name ${
                  touched.description && errors.description ? "error" : ""
                }`}
              />
              {touched.description && errors.description && (
                <div className="error">{errors.description}</div>
              )}

              <Field
                as="select"
                name="memberId"
                className={`input-name ${
                  touched.memberId && errors.memberId ? "error" : ""
                }`}
              >
                <option value="-1">Select a member</option>
                {memberList.map((member) => (
                  <option key={member.value} value={member.value}>
                    {member.label}
                  </option>
                ))}
              </Field>
              {touched.memberId && errors.memberId && (
                <div className="error">{errors.memberId}</div>
              )}

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
