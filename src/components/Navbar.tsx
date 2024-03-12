import { Link } from "react-router-dom";
import { productImages } from "../utils/image";
import { useContext } from "react";
import { UserContext } from "../context/userContext/LoginContext";

const Navbar = () => {
  const { isLoggedIn, userName, handleLogoutClick } = useContext(UserContext);

  return (
    <div className="navbar">
      <div className="title-logo">
        <Link to="/">
          <img src={productImages.phoenix} alt="logo" />
        </Link>
        <h2>Task Management</h2>
      </div>
      <div className="new">
        <div>
          {isLoggedIn ? (
            <p>
              Mr. {userName} <button className="logout-button" onClick={
                () => handleLogoutClick( {
                    token : localStorage.getItem('token'),
                    userName : localStorage.getItem('userName')
                })
              }> Logout</button>
            </p>
          ) : null}
        </div>
        <div className="list">
          <li>
            <Link to="/home" className="navlink">
              Home
            </Link>
          </li>
          <li>
            <Link to="/tasks" className="navlink">
              Tasks
            </Link>
          </li>
          <li>
            <Link to="/members" className="navlink">
              Members
            </Link>
          </li>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
