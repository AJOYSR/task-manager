import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext/LoginContext";


const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  
  const { isLoggedIn, handleLoginClick} = useContext(UserContext) 

  console.log(isLoggedIn);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const backendEndpoint = "http://127.0.0.1:9001/public/register";

    try {
      console.log(username);
      const response = await axios.post(backendEndpoint, {
        name: username,
        email: email,
        password: password,
        password2: password,
      });

      console.log("Response from server:", response.data);
      handleLoginClick(response.data)
      // console.log( localStorage.getItem("token"), isLoggedIn)
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Register to TMS</h1>
      <div className="input-form">
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Enter Name"
              className="input-name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
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
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
