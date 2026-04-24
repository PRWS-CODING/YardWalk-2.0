import React, { memo } from "react";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3
          style={{
            color: "#fca5a5",
            marginBottom: "1rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          System Warning
        </h3>
        <p
          style={{
            marginBottom: "1.5rem",
            color: "#ffffff",
            fontSize: "1.1rem",
          }}
        >
          {message}
        </p>
        <div className="modal-buttons">
          <button className="button button-confirm" onClick={onConfirm}>
            Confirm Delete
          </button>
          <button className="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ConfirmationModal);
