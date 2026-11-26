import React, { useState, memo, useCallback } from "react";
import TrailerInput from "./TrailerInput";
import RadioButtons from "./RadioButtons";
import Parking from "./Parking";

const buildDefaultFormState = (yard) => {
  const defaults = {
    trailerNumber: "",
    comments: "",
  };

  (yard?.radioGroups || []).forEach((group) => {
    defaults[group.id] = group.options?.[0] || "";
  });

  (yard?.checkboxes || []).forEach((box) => {
    defaults[box.id] = false;
  });

  (yard?.parkingZones || []).forEach((zone) => {
    defaults[zone.id] = "None";
  });

  return defaults;
};

const TrailerForm = ({
  onSave,
  editingTrailer,
  onCancel,
  occupiedSpots,
  setSearchQuery,
  onWarning,
  activeYard,
}) => {
  const [formData, setFormData] = useState(() =>
    buildDefaultFormState(activeYard),
  );
  const [showComments, setShowComments] = useState(false);

  // Sync state during render when editingTrailer or activeYard changes
  const [prevEditingId, setPrevEditingId] = useState(null);
  const [prevYardId, setPrevYardId] = useState(activeYard?.id || null);

  const currentEditingId = editingTrailer ? editingTrailer.id : null;
  const currentYardId = activeYard?.id || null;

  if (currentEditingId !== prevEditingId || currentYardId !== prevYardId) {
    setPrevEditingId(currentEditingId);
    setPrevYardId(currentYardId);
    if (editingTrailer && currentYardId === prevYardId) {
      setFormData({
        ...buildDefaultFormState(activeYard),
        ...editingTrailer,
      });
      setShowComments(!!editingTrailer.comments);
    } else {
      setFormData(buildDefaultFormState(activeYard));
      setShowComments(false);
    }
  }

  const trailerPrefix = activeYard?.trailerPrefix ?? "";
  const trailerLength = activeYard?.trailerLength ?? null;

  const handleNumberChange = useCallback(
    (e) => {
      let val = e.target.value.replace(/\D/g, "");
      if (trailerPrefix && val.length > 0 && !val.startsWith(trailerPrefix)) {
        val = trailerPrefix + val;
      }
      if (trailerLength) {
        val = val.substring(0, trailerLength);
      }
      setFormData((prev) => ({ ...prev, trailerNumber: val }));
      setSearchQuery(val);
    },
    [trailerPrefix, trailerLength, setSearchQuery],
  );

  const handleClearNumber = useCallback(() => {
    setFormData((prev) => ({ ...prev, trailerNumber: "" }));
    setSearchQuery("");
  }, [setSearchQuery]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!formData.trailerNumber) {
        return onWarning("Please enter a trailer number.");
      }
      if (trailerLength && formData.trailerNumber.length !== trailerLength) {
        return onWarning(
          `Trailer number must be exactly ${trailerLength} digits.`,
        );
      }
      onSave(formData);
      setFormData(buildDefaultFormState(activeYard));
      setShowComments(false);
      setSearchQuery("");
    },
    [formData, trailerLength, onSave, activeYard, setSearchQuery, onWarning],
  );

  const handleCheckboxChange = useCallback((id, checked) => {
    setFormData((prev) => ({ ...prev, [id]: checked }));
  }, []);

  const handleRadioChange = useCallback((groupId, val) => {
    setFormData((prev) => ({ ...prev, [groupId]: val }));
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

  const checkboxes = activeYard?.checkboxes || [];

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
        trailerLength={trailerLength}
        trailerPrefix={trailerPrefix}
      />

      <RadioButtons
        radioGroups={activeYard?.radioGroups || []}
        formData={formData}
        onRadioChange={handleRadioChange}
      />

      {checkboxes.length > 0 && (
        <div className="checkbox-group trailer-form-checkbox-group">
          {checkboxes.map(({ id, label }) => (
            <label key={id} className="checkbox-label" htmlFor={id}>
              <input
                type="checkbox"
                className="checkbox-input"
                id={id}
                checked={Boolean(formData[id])}
                onChange={(e) => handleCheckboxChange(id, e.target.checked)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      )}

      <Parking
        parkingZones={activeYard?.parkingZones || []}
        formData={formData}
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