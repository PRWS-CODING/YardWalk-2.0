import React, { useState, memo, useCallback } from "react";
import TrailerInput from "./TrailerInput";
import RadioButtons from "./RadioButtons";
import Parking from "./Parking";

const CHECKBOX_OPTIONS = [
  { name: "needsFuel", label: "Needs Fuel?" },
  { name: "inbound", label: "Inbound?" },
  { name: "seasonal", label: "Seasonal?" },
  { name: "palletShuttle", label: "Pallet Shuttle?" },
];

// Define DEFAULT_TRAILER_FORM_STATE outside the component to prevent re-creation on every render
const DEFAULT_TRAILER_FORM_STATE = {
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

const TrailerForm = ({
  onSave,
  editingTrailer,
  onCancel,
  occupiedSpots,
  setSearchQuery,
  onWarning,
}) => {
  // Initialize state
  const [formData, setFormData] = useState(DEFAULT_TRAILER_FORM_STATE);
  const [showComments, setShowComments] = useState(false);

  // 🌟 Track the previous editingTrailer ID to detect shifts on render
  const [prevEditingId, setPrevEditingId] = useState(null);

  const currentEditingId = editingTrailer ? editingTrailer.id : null;

  // 🌟 Sync state directly during render (No useEffect required!)
  if (currentEditingId !== prevEditingId) {
    setPrevEditingId(currentEditingId);
    if (editingTrailer) {
      setFormData(editingTrailer);
      setShowComments(!!editingTrailer.comments);
    } else {
      setFormData(DEFAULT_TRAILER_FORM_STATE);
      setShowComments(false);
    }
  }

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
      if (formData.trailerNumber.length !== 6)
        return onWarning("Trailer number must be exactly 6 digits.");
      onSave(formData);
      setFormData(DEFAULT_TRAILER_FORM_STATE); // Reset to default after saving
      setShowComments(false);
      setSearchQuery("");
    },
    [formData, onSave, setSearchQuery, onWarning, setShowComments],
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
        {CHECKBOX_OPTIONS.map(({ name, label }) => (
          <label key={name} className="checkbox-label" htmlFor={name}>
            <input
              type="checkbox"
              className="checkbox-input"
              id={name}
              checked={formData[name]}
              onChange={(e) => handleCheckboxChange(name, e.target.checked)}
            />
            <span>{label}</span>
          </label>
        ))}
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
