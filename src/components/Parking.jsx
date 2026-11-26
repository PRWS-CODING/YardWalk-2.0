import React, { memo } from "react";

const FenceLineOption = memo(function FenceLineOption({
  option,
  occupiedSpots,
  trailerNumber,
  fenceLinePrefix,
}) {
  // Support both { value, label } objects and plain strings like "Door 1"
  const normalized =
    typeof option === "string"
      ? { value: option, label: option }
      : option;

  if (normalized.value === "None") {
    return (
      <option key="none" value="None">
        None
      </option>
    );
  }

  const spotKey = `${fenceLinePrefix}:${normalized.value}`;
  const occupiedBy = occupiedSpots?.get(spotKey);
  const isThisTrailer = occupiedBy?.number === trailerNumber;
  const isDisabled = Boolean(occupiedBy && !isThisTrailer);

  return (
    <option
      key={normalized.value}
      value={normalized.value}
      disabled={isDisabled}
    >
      {normalized.label}{" "}
      {isDisabled ? `(Occupied: ${occupiedBy.number})` : ""}
    </option>
  );
});

const Parking = ({
  parkingZones = [],
  formData,
  onUpdate,
  occupiedSpots,
  trailerNumber,
}) => {
  if (!parkingZones.length) return null;

  const handleZoneChange = (selectedZoneId, selectedValue) => {
    const updates = { [selectedZoneId]: selectedValue };

    // Reset all other parking zones for this yard to "None" when a spot is chosen
    if (selectedValue !== "None") {
      parkingZones.forEach((zone) => {
        if (zone.id !== selectedZoneId) {
          updates[zone.id] = "None";
        }
      });
    }

    onUpdate(updates);
  };

  return (
    <>
      {parkingZones.map((zone, index) => {
        const hasNone = zone.spots.some((s) =>
          typeof s === "string" ? s === "None" : s.value === "None",
        );
        const options = hasNone
          ? zone.spots
          : [{ value: "None", label: "None" }, ...zone.spots];

        return (
          <div
            key={zone.id}
            className={`input-group ${index === 0 ? "parking-input-group" : ""}`}
          >
            <label className="input-label" htmlFor={zone.id}>
              {zone.label}
            </label>
            <select
              id={zone.id}
              className="input-fenceline"
              value={formData[zone.id] || "None"}
              onChange={(e) => handleZoneChange(zone.id, e.target.value)}
            >
              {options.map((option) => (
                <FenceLineOption
                  key={typeof option === "string" ? option : option.value}
                  option={option}
                  occupiedSpots={occupiedSpots}
                  trailerNumber={trailerNumber}
                  fenceLinePrefix={zone.shortCode}
                />
              ))}
            </select>
          </div>
        );
      })}
    </>
  );
};

export default memo(Parking);