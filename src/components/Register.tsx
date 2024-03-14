import { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate()

  const handleSubmit = async (values, { setSubmitting }) => {
    const backendEndpoint = "http://127.0.0.1:9001/public/register";
    try {
      const response = await axios.post(backendEndpoint, {
        name: values.username,
        email: values.email,
        password: values.password,
        password2: values.password,
      });

      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
      navigate("/home")
    }
  };

  return (
    <div>
      <h1>Register to TMS</h1>
      <div className="input-form">
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
          }}
          validationSchema={Yup.object().shape({
            username: Yup.string().required("Required"),
            email: Yup.string().email("Invalid email").required("Required"),
            password: Yup.string().required("Required"),
          })}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div>
                <Field
                  type="text"
                  name="username"
                  placeholder="Enter Name"
                  className="input-name"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="error"
                />
              </div>
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  className="input-name"
                />
                <ErrorMessage name="email" component="div" className="error" />
              </div>
              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  className="input-name"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
