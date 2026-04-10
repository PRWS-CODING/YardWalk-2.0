import React, { useState, useEffect } from "react";

// Define the specific fence line options from your original HTML
const NORTH_FENCE_OPTIONS = [
  { value: "None", label: "None" },
  { value: "TA 01", label: "TA 1" },
  { value: "TA 02", label: "TA 2" },
  { value: "TA 03", label: "TA 3" },
  { value: "TA 04", label: "TA 4" },
  { value: "TA 05", label: "TA 5" },
  { value: "TA 06", label: "TA 6" },
  ...Array.from({ length: 25 }, (_, i) => ({
    value: `${i + 1}`,
    label: `${i + 1}`,
  })),
  { value: "NP 1", label: "NP-NF 1" },
  { value: "NP 2", label: "NP-NF 2" },
  ...Array.from({ length: 31 }, (_, i) => ({
    value: `${i + 26}`,
    label: `${i + 26}`,
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    value: `Curb ${i + 1}`,
    label: `Curb ${i + 1}`,
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    value: `WT ${i + 1}`,
    label: `WT ${i + 1}`,
  })),
  { value: "B 1", label: "B-NF 1" },
  { value: "B 2", label: "B-NF 2" },
  { value: "B 3", label: "B-NF 3" },
];

const SOUTH_FENCE_OPTIONS = [
  { value: "None", label: "None" },
  { value: "Bs 1", label: "B-SF 1" },
  { value: "Bs 2", label: "B-SF 2" },
  { value: "Bs 3", label: "B-SF 3" },
  { value: "Bs 4", label: "B-SF 4" },
  ...Array.from({ length: 29 }, (_, i) => ({
    value: `${i + 301}`,
    label: `${i + 301}`,
  })),
  { value: "NPs 1", label: "NP-SF 1" },
  ...Array.from({ length: 30 }, (_, i) => ({
    value: `${i + 330}`,
    label: `${i + 330}`,
  })),
  { value: "NPs 2", label: "NP-SF 2" },
  { value: "NPs 3", label: "NP-SF 3" },
  ...Array.from({ length: 40 }, (_, i) => ({
    value: `${i + 360}`,
    label: `${i + 360}`,
  })),
  ...Array.from({ length: 9 }, (_, i) => ({
    value: `Bs ${i + 5}`,
    label: `B-SF ${i + 5}`,
  })),
];

const TrailerForm = ({
  onSave,
  editingTrailer,
  onCancel,
  occupiedSpots,
  setSearchQuery,
}) => {
  const initialState = {
    trailerNumber: "",
    status: "Empty",
    needsFuel: false,
    inbound: false,
    seasonal: false,
    palletShuttle: false,
    northFence: "None",
    southFence: "None",
    comments: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (editingTrailer) {
      setFormData(editingTrailer);
      setShowComments(!!editingTrailer.comments);
    } else {
      setFormData(initialState);
    }
  }, [editingTrailer]);

  const handleNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 0 && !val.startsWith("3")) val = "3" + val;
    val = val.substring(0, 6);
    setFormData({ ...formData, trailerNumber: val });
    setSearchQuery(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.trailerNumber.length < 4)
      return alert("Enter a valid trailer number");
    onSave(formData);
    setFormData(initialState);
    setSearchQuery("");
  };

  const renderHoloCheckbox = (label, name) => (
    <div className="checkbox-container">
      <input
        type="checkbox"
        className="holo-checkbox-input"
        id={name}
        checked={formData[name]}
        onChange={(e) => setFormData({ ...formData, [name]: e.target.checked })}
      />
      <label className="holo-checkbox" htmlFor={name}>
        <div className="holo-box">
          <div className="holo-inner"></div>
          <div className="scan-effect"></div>
          <div className="holo-particles">
            <div className="holo-particle"></div>
            <div className="holo-particle"></div>
            <div className="holo-particle"></div>
            <div className="holo-particle"></div>
            <div className="holo-particle"></div>
            <div className="holo-particle"></div>
          </div>
          <div className="activation-rings">
            <div className="activation-ring"></div>
            <div className="activation-ring"></div>
            <div className="activation-ring"></div>
          </div>
          <div className="cube-transform">
            <div className="cube-face"></div>
            <div className="cube-face"></div>
            <div className="cube-face"></div>
            <div className="cube-face"></div>
            <div className="cube-face"></div>
            <div className="cube-face"></div>
          </div>
        </div>
        <div className="corner-accent"></div>
        <div className="corner-accent"></div>
        <div className="corner-accent"></div>
        <div className="corner-accent"></div>
        <div className="holo-glow"></div>
      </label>
      <span className="status-text">{label}</span>
    </div>
  );

  const renderGlitchRadio = (label) => (
    <div className="radio-wrapper">
      <input
        type="radio"
        name="status"
        className="input"
        id={`value-${label}`} // Unique ID for each radio
        value={label}
        checked={formData.status === label}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
      />
      <div className="btn">
        <span>{label}</span>
        <span className="btn__glitch"></span>
      </div>
    </div>
  );

  return (
    <>
      {" "}
      {/* No container here, App.jsx provides it */}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">Trailer Number</label>
          <input
            type="text"
            className="input-field"
            id="trailer-number"
            value={formData.trailerNumber}
            onChange={handleNumberChange}
            placeholder="3XXXXX"
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>

        <button
          type="button"
          className="add-comment-button button"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? "- Remove Comment" : "+ Add Comment"}
        </button>

        {showComments && (
          <div className="input-group">
            <textarea
              className="input-field textarea-field"
              value={formData.comments}
              onChange={(e) =>
                setFormData({ ...formData, comments: e.target.value })
              }
              placeholder="Enter notes..."
            />
          </div>
        )}

        <div className="radio-button-group">
          {["Empty", "Salvage", "Full"].map(renderGlitchRadio)}
        </div>

        <div className="checkbox-group" style={{ marginTop: "2rem" }}>
          {renderHoloCheckbox("Needs Fuel?", "needsFuel")}
          {renderHoloCheckbox("Inbound?", "inbound")}
          {renderHoloCheckbox("Seasonal?", "seasonal")}
          {renderHoloCheckbox("Pallet Shuttle?", "palletShuttle")}
        </div>

        <div className="input-group" style={{ marginTop: "2rem" }}>
          <label className="input-label">North Fence Line</label>
          <select
            className="input-fenceline"
            value={formData.northFence}
            onChange={(e) =>
              setFormData({
                ...formData,
                northFence: e.target.value,
                southFence: "None",
              })
            }
          >
            {NORTH_FENCE_OPTIONS.map((option) => {
              if (option.value === "None")
                return (
                  <option key="none" value="None">
                    None
                  </option>
                );
              const occ = occupiedSpots.get(`NF:${option.value}`);
              const isThisTrailer = occ?.number === formData.trailerNumber;
              return (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={occ && !isThisTrailer}
                >
                  {option.label}{" "}
                  {occ && !isThisTrailer ? `(Occupied: ${occ.number})` : ""}
                </option>
              );
            })}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">South Fence Line</label>
          <select
            className="input-fenceline"
            value={formData.southFence}
            onChange={(e) =>
              setFormData({
                ...formData,
                southFence: e.target.value,
                northFence: "None",
              })
            }
          >
            {SOUTH_FENCE_OPTIONS.map((option) => {
              if (option.value === "None")
                return (
                  <option key="none" value="None">
                    None
                  </option>
                );
              const occ = occupiedSpots.get(`SF:${option.value}`);
              const isThisTrailer = occ?.number === formData.trailerNumber;
              return (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={occ && !isThisTrailer}
                >
                  {option.label}{" "}
                  {occ && !isThisTrailer ? `(Occupied: ${occ.number})` : ""}
                </option>
              );
            })}
          </select>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit" className="button">
            {editingTrailer ? "Update" : "Enter"}
          </button>
          {editingTrailer && (
            <button
              type="button"
              className="button disabled"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default TrailerForm;
