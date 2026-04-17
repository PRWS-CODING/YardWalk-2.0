import React from "react";

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
        <label className="input-label">Trailer Number</label>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            className="input-field"
            id="trailer-number"
            value={trailerNumber}
            onChange={onNumberChange}
            placeholder="3XXXXX"
            inputMode="numeric"
            pattern="[0-9]*"
            style={{ width: "100%", paddingRight: "65px" }}
          />
          {trailerNumber && (
            <button
              type="button"
              onClick={onClear}
              style={{
                position: "absolute",
                right: "38px",
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.8,
                zIndex: 10,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
          <svg
            className="search-spyglass"
            style={{
              position: "absolute",
              right: "12px",
              width: "20px",
              height: "20px",
              pointerEvents: "none",
              opacity: 0.8,
              zIndex: 10,
            }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
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
            className="input-field textarea-field"
            value={comments}
            onChange={onCommentsChange}
            placeholder="Enter notes..."
          />
        </div>
      )}
    </>
  );
};

export default TrailerInput;
