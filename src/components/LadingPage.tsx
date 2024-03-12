import { useEffect } from "react";
import { productImages } from "../utils/image";
import { Link, useNavigate } from "react-router-dom";
const LadingPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/home");
  }, []);
  return (
    <div>
      <div className="image-tile">
        <img src={productImages.phoenix} alt="logo" className="logo" />
        <h1>Task Management</h1>
      </div>

      <div className="login-register">
        <Link to={"/login"}>
          <button className="submit-button">Login</button>
        </Link>
        <Link to={"/register"}>
          <button className="submit-button">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default LadingPage;
