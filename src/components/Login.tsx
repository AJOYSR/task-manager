import { useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext/LoginContext";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Login = () => {
  const { handleLoginClick } = useContext(UserContext);
  const navigate = useNavigate();
  
  console.log("🚀 ~ ErrorMessage:", ErrorMessage)
  const handleSubmit = async (values, { setSubmitting }) => {
    const backendEndpoint = "http://127.0.0.1:9001/public/login";
    try {
      const response = await axios.post(backendEndpoint, {
        email: values.email,
        password: values.password,
      });
      handleLoginClick(response.data);
      navigate("/home");
    } catch (error) {
      // navigate("/register");
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div>
      <h1>Login to TMS</h1>
      <div className="input-form">
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email("Invalid email").required("Required"),
            password: Yup.string().required("Required"),
          })}
          onSubmit={handleSubmit}
          
          >
          {({ isSubmitting }) => (
            <Form>
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
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
