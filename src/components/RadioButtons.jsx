import React, { memo } from "react";

function RadioButtons({ status, onStatusChange }) {
  const options = ["Empty", "Salvage", "Full"];

  return (
    <div className="radio-button-group">
      {options.map((option) => (
        <div className="radio-wrapper" key={option}>
          <input
            type="radio"
            name="status"
            className="input"
            id={`value-${option}`}
            value={option}
            checked={status === option}
            onChange={(e) => onStatusChange(e.target.value)}
          />
          <div className="btn">
            <span>{option}</span>
            <span className="btn__glitch"></span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(RadioButtons);
