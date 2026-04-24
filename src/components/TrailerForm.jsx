import React, { useState, useEffect, memo, useCallback } from "react";
import TrailerInput from "./TrailerInput";
import RadioButtons from "./RadioButtons";
import Parking from "./Parking";

/**
 * HoloCheckbox component extracted from TrailerForm.
 * @param {object} props
 * @param {string} props.label The label for the checkbox.
 * @param {string} props.name The name attribute for the checkbox input.
 * @param {boolean} props.checked The checked state of the checkbox.
 * @param {function(boolean): void} props.onChange The change handler for the checkbox.
 * @returns {JSX.Element} The HoloCheckbox component.
 */
const HoloCheckbox = memo(function HoloCheckbox({
  label,
  name,
  checked,
  onChange,
}) {
  return (
    <div className="checkbox-container">
      <input
        type="checkbox"
        className="holo-checkbox-input"
        id={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label className="holo-checkbox" htmlFor={name}>
        <div className="holo-box">
          <div className="holo-inner" />
          <div className="scan-effect" />
          <div className="holo-particles">
            <div className="holo-particle" />
            <div className="holo-particle" />
            <div className="holo-particle" />
            <div className="holo-particle" />
            <div className="holo-particle" />
            <div className="holo-particle" />
          </div>
          <div className="activation-rings">
            <div className="activation-ring" />
            <div className="activation-ring" />
            <div className="activation-ring" />
          </div>
          <div className="cube-transform">
            <div className="cube-face" />
            <div className="cube-face" />
            <div className="cube-face" />
            <div className="cube-face" />
            <div className="cube-face" />
            <div className="cube-face" />
          </div>
        </div>
        <div className="corner-accent" />
        <div className="corner-accent" />
        <div className="corner-accent" />
        <div className="corner-accent" />
        <div className="holo-glow" />
      </label>
      <span className="status-text">{label}</span>
    </div>
  );
});

const TrailerForm = ({
  onSave,
  editingTrailer,
  onCancel,
  occupiedSpots,
  setSearchQuery,
  onWarning,
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

  const handleNumberChange = useCallback(
    (e) => {
      let val = e.target.value.replace(/\D/g, "");
      if (val.length > 0 && !val.startsWith("3")) val = "3" + val;
      val = val.substring(0, 6);
      setFormData((prev) => ({ ...prev, trailerNumber: val }));
      setSearchQuery(val);
    },
    [setSearchQuery],
  );

  const handleClearNumber = useCallback(() => {
    setFormData((prev) => ({ ...prev, trailerNumber: "" }));
    setSearchQuery("");
  }, [setSearchQuery]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (formData.trailerNumber.length < 4)
        return onWarning("Enter a valid trailer number");
      onSave(formData);
      setFormData(initialState);
      setSearchQuery("");
    },
    [formData, onSave, setSearchQuery, onWarning],
  );

  const handleCheckboxChange = useCallback((name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  }, []);

  const handleStatusChange = useCallback((val) => {
    setFormData((prev) => ({ ...prev, status: val }));
  }, []);

  const handleParkingUpdate = useCallback((updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleCommentsChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, comments: e.target.value }));
  }, []);

  const handleToggleComments = useCallback(() => {
    setShowComments((prev) => !prev);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="trailer-form">
      <TrailerInput
        trailerNumber={formData.trailerNumber}
        onNumberChange={handleNumberChange}
        onClear={handleClearNumber}
        showComments={showComments}
        onToggleComments={handleToggleComments}
        comments={formData.comments}
        onCommentsChange={handleCommentsChange}
      />

      <RadioButtons
        status={formData.status}
        onStatusChange={handleStatusChange}
      />

      <div className="checkbox-group trailer-form-checkbox-group">
        <HoloCheckbox
          label="Needs Fuel?"
          name="needsFuel"
          checked={formData.needsFuel}
          onChange={(checked) => handleCheckboxChange("needsFuel", checked)}
        />
        <HoloCheckbox
          label="Inbound?"
          name="inbound"
          checked={formData.inbound}
          onChange={(checked) => handleCheckboxChange("inbound", checked)}
        />
        <HoloCheckbox
          label="Seasonal?"
          name="seasonal"
          checked={formData.seasonal}
          onChange={(checked) => handleCheckboxChange("seasonal", checked)}
        />
        <HoloCheckbox
          label="Pallet Shuttle?"
          name="palletShuttle"
          checked={formData.palletShuttle}
          onChange={(checked) => handleCheckboxChange("palletShuttle", checked)}
        />
      </div>

      <Parking
        northFence={formData.northFence}
        southFence={formData.southFence}
        occupiedSpots={occupiedSpots}
        trailerNumber={formData.trailerNumber}
        onUpdate={handleParkingUpdate}
      />

      <div className="form-buttons-group">
        <button type="submit" className="button">
          {editingTrailer ? "Update" : "Enter"}
        </button>
        {editingTrailer && (
          <button type="button" className="button disabled" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default memo(TrailerForm);
