import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Task Management system</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. At expedita
        minima repellendus ea sapiente sit cum, odit eos nobis saepe
        voluptatibus ex nihil corrupti delectus inventore nam explicabo atque
        velit! Veritatis ullam illo odit expedita dicta sapiente amet aperiam
        beatae quis molestiae reprehenderit iste velit saepe, mollitia rerum
        distinctio pariatur corrupti. Ratione sit reiciendis aut sed in? Optio,
        quasi dolores.
      </p>
      <div className="homepage">
        <div>
          <Link to={"/members"} className="link-style-home">Members</Link>
        </div>
        <div>
          <Link to={"/tasks"} className="link-style-home">
            Tasks
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
