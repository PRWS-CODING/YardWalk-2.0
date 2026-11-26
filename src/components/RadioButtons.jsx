import React, { memo } from "react";

const RadioButtons = ({ radioGroups = [], formData, onRadioChange }) => {
  if (!radioGroups.length) return null;

  return (
    <>
      {radioGroups.map((group) => (
        <div key={group.id} className="category-group">
          {group.label && (
            <label className="input-label">{group.label}</label>
          )}
          <div className="radio-button-group">
            {group.options.map((option) => {
              const inputId = `${group.id}-${option}`;
              return (
                <div key={option} className="radio-wrapper">
                  <input
                    type="radio"
                    id={inputId}
                    className="input"
                    name={group.id}
                    value={option}
                    checked={formData[group.id] === option}
                    onChange={() => onRadioChange(group.id, option)}
                  />
                  <label htmlFor={inputId} className="btn">
                    {option}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};

export default memo(RadioButtons);