import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner } from "./Spinner";

const AddOrEditMember = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      // Fetch existing member details if in edit mode
      const authToken = localStorage.getItem("token");
      const backendEndpoint = `http://127.0.0.1:9001/private/members/${id}`;
      const headers = {
        Authorization: `Bearer ${authToken}`,
      };
      setIsLoading(true);
      axios
        .get(backendEndpoint, { headers })
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        ? await axios.patch(backendEndpoint, { name }, { headers })
        : await axios.post(backendEndpoint, { name }, { headers });

      console.log("Response from server:", response.data);

      navigate('/members');
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {isLoading ? (
        <Spinner message={"Loading ....."}/>
      ) : (
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
      )}
    </div>
  );
};

export default AddOrEditMember;
