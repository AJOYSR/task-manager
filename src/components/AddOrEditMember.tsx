import React, { useEffect, useState } from "react";
import { useParams , useNavigate} from "react-router-dom";
import axios from "axios";

const AddOrEditMember = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const navigte = useNavigate();
  useEffect(() => {
    if (id) {
      // Fetch existing member details if in edit mode
      const authToken = localStorage.getItem("token");
      const backendEndpoint = `http://127.0.0.1:9001/private/members/${id}`;
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };

      axios
        .get(backendEndpoint, { headers })
        .then((response) => {
          setName(response.data.member.name);
        })
        .catch((error) => {
          console.error("Error fetching member details:", error);
        });
    }
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const authToken = localStorage.getItem("token");
    const backendEndpoint = id
      ? `http://127.0.0.1:9001/private/members/${id}`
      : "http://127.0.0.1:9001/private/members";
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    try {
      const response = id
        ? await axios.patch(backendEndpoint, { name }, { headers })
        : await axios.post(backendEndpoint, { name }, { headers });

      console.log("Response from server:", response.data);

      navigte('/members')
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="input-name"
          placeholder="Enter Name of Member"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          className="submit-button"
          style={{ marginLeft: "10px" }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddOrEditMember;
