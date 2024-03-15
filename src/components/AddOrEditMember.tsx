import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner } from "./Spinner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { UserContext } from "../context/userContext/LoginContext";

const AddOrEditMember = () => {
  const { id } = useParams();
  const { isLoggedIn } = useContext(UserContext);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      // Fetch existing member details if in edit mode
      setIsLoading(true);
      axios
        .get(`http://127.0.0.1:9001/private/members/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setName(response.data.member.name);
        })
        .catch((error) => {
          console.error("Error fetching member details:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (values: any) => {
    const authToken = localStorage.getItem("token");
    const backendEndpoint = id
      ? `http://127.0.0.1:9001/private/members/${id}`
      : "http://127.0.0.1:9001/private/members";
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    try {
      setIsLoading(true); // Start loading
      const response = id
        ? await axios.patch(backendEndpoint, { name: values.name }, { headers })
        : await axios.post(backendEndpoint, { name: values.name }, { headers });

      console.log("Response from server:", response.data);

      navigate("/members");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {isLoading ? (
        <Spinner message={"Loading ....."} />
      ) : (
        <Formik
          initialValues={{
            name: name || "",
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string()
              .required("Name is required")
              .min(2, "Name must be at least 2 characters")
              .max(50, "Name must be at most 50 characters"),
          })}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ touched, errors }) => (
            <Form>
              <Field
                name="name"
                placeholder="Enter Name of Member"
                className={`input-name ${touched.name && errors.name ? "error" : ""}`}
              />
              {touched.name && errors.name && <div className="error">{errors.name}</div>}
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

export default AddOrEditMember;
