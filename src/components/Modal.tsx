import React from "react";

const Modal = ({ title, buttonTitle, deleteRecord, closeModal }: any) => {
  return (
    <div className="modal-container">
      <div className="modal-content">
        <h1>{title}</h1>
        <button onClick={closeModal} className="cancel-button ">
          Cancel
        </button>
        <button onClick={deleteRecord} className="delete-button">
          {buttonTitle}
        </button>
      </div>
    </div>
  );
};

export default Modal;
