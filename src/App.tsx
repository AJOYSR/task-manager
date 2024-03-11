import React from "react";
import { productImages } from "./utils/image";
const App = () => {
  return (
    <div>
      <div className="image-tile">
        <img src={productImages.phoenix} alt="logo" className="logo" />
        <h1>Task Mangement</h1>
      </div>
      <div className="input-form">
        <form>
          <div>
            <input
              type="text"
              placeholder="Enter Name"
              className="input-name"
            />
          </div>
          <div>
            <button type="submit" className="submit-button">
              Sumbit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
