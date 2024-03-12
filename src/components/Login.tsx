import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext/LoginContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { isLoggedIn, handleLoginClick } = useContext(UserContext);

  const navigate = useNavigate();

  const userExistorNot = async () => {
    const backendEndpoint = "http://127.0.0.1:9001/public/login";
    try {
      const response = await axios.post(backendEndpoint, {
        email: email,
        password: password,
      });
      handleLoginClick(response.data);
      navigate("/home");
    } catch (error) {
      navigate("/register");
      console.error("Error:", error);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (localStorage.getItem("token")) {
      userExistorNot();
    } else {
      try {
        userExistorNot();
      } catch (error) {
        navigate("/register");
        console.error("Error:", error);
      }
    }
  };

  return (
    <div>
      <h1>Login to TMS</h1>
      <div className="input-form">
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Enter Email"
              className="input-name"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Enter password"
              className="input-name"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" className="submit-button">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
