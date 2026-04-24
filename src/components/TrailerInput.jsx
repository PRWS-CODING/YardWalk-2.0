import React, { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

const TrailerInput = ({
  trailerNumber,
  onNumberChange,
  onClear,
  showComments,
  onToggleComments,
  comments,
  onCommentsChange,
}) => {
  return (
    <>
      <div className="input-group">
        <label className="input-label" htmlFor="trailer-number">
          Trailer Number
        </label>
        <div className="trailer-number-input-wrapper">
          <input
            type="text"
            className="input-field trailer-number-input"
            id="trailer-number"
            value={trailerNumber}
            onChange={onNumberChange}
            placeholder="3XXXXX"
            inputMode="numeric"
            pattern="[0-9]*"
          />
          {trailerNumber && (
            <button type="button" onClick={onClear} className="clear-button">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
          <div className="search-spyglass">
            <FontAwesomeIcon icon={faSearch} />
          </div>
        </div>
      </div>

      <button
        type="button"
        className="add-comment-button button"
        onClick={onToggleComments}
      >
        {showComments ? "- Remove Comment" : "+ Add Comment"}
      </button>

      {showComments && (
        <div className="input-group">
          <textarea
            className="input-field textarea-field comments-textarea"
            value={comments}
            onChange={onCommentsChange}
            placeholder="Enter notes..."
          />
        </div>
      )}
    </>
  );
};

export default memo(TrailerInput);
