import React, { useState, useEffect } from "react";
import TrailerInput from "./TrailerInput";
import RadioButtons from "./RadioButtons";
import Parking from "./Parking";

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

  const handleClearNumber = () => {
    setFormData({ ...formData, trailerNumber: "" });
    setSearchQuery("");
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

  return (
    <>
      {" "}
      {/* No container here, App.jsx provides it */}
      <form onSubmit={handleSubmit}>
        <TrailerInput
          trailerNumber={formData.trailerNumber}
          onNumberChange={handleNumberChange}
          onClear={handleClearNumber}
          showComments={showComments}
          onToggleComments={() => setShowComments(!showComments)}
          comments={formData.comments}
          onCommentsChange={(e) =>
            setFormData({ ...formData, comments: e.target.value })
          }
        />

        <RadioButtons
          status={formData.status}
          onStatusChange={(val) => setFormData({ ...formData, status: val })}
        />

        <div className="checkbox-group" style={{ marginTop: "2rem" }}>
          {renderHoloCheckbox("Needs Fuel?", "needsFuel")}
          {renderHoloCheckbox("Inbound?", "inbound")}
          {renderHoloCheckbox("Seasonal?", "seasonal")}
          {renderHoloCheckbox("Pallet Shuttle?", "palletShuttle")}
        </div>

        <Parking
          northFence={formData.northFence}
          southFence={formData.southFence}
          occupiedSpots={occupiedSpots}
          trailerNumber={formData.trailerNumber}
          onUpdate={(updates) =>
            setFormData((prev) => ({ ...prev, ...updates }))
          }
        />

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
