import { useContext, useEffect } from "react";
import { productImages } from "../utils/image";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext/LoginContext";
import '../../src/landingPage.css'



const LandingPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(UserContext);

  useEffect(() => {
    if (isLoggedIn) navigate("/home");
  }, [isLoggedIn]);

  return (
    <div className="landing-page-container">
      <div className="image-tile">
        <img src={productImages.phoenix} alt="logo" className="logo" />
        <h1>Task Management</h1>
      </div>

      <div className="button-container">
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

export default LandingPage;
