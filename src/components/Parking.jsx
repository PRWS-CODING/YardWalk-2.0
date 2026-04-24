import React, { memo } from "react";

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

/**
 * Renders a single option for the fence line select dropdown.
 * @param {object} props
 * @param {object} props.option The option object { value, label }.
 * @param {Map<string, { number: string }>} props.occupiedSpots A map of occupied spots.
 * @param {string} props.trailerNumber The current trailer number being edited.
 * @param {string} props.fenceLinePrefix The prefix for the fence line (e.g., "NF", "SF").
 * @returns {JSX.Element} The option element.
 */
const FenceLineOption = memo(function FenceLineOption({
  option,
  occupiedSpots,
  trailerNumber,
  fenceLinePrefix,
}) {
  if (option.value === "None") {
    return (
      <option key="none" value="None">
        None
      </option>
    );
  }
  const spotKey = `${fenceLinePrefix}:${option.value}`;
  const occupiedBy = occupiedSpots.get(spotKey);
  const isThisTrailer = occupiedBy?.number === trailerNumber;
  const isDisabled = occupiedBy && !isThisTrailer;

  return (
    <option key={option.value} value={option.value} disabled={isDisabled}>
      {option.label} {isDisabled ? `(Occupied: ${occupiedBy.number})` : ""}
    </option>
  );
});

const Parking = ({
  northFence,
  southFence,
  onUpdate,
  occupiedSpots,
  trailerNumber,
}) => (
  <>
    <div className="input-group parking-input-group">
      <label className="input-label">North Fence Line</label>
      <select
        className="input-fenceline"
        value={northFence}
        onChange={(e) =>
          onUpdate({
            northFence: e.target.value,
            southFence: "None",
          })
        }
      >
        {NORTH_FENCE_OPTIONS.map((option) => (
          <FenceLineOption
            key={option.value}
            option={option}
            occupiedSpots={occupiedSpots}
            trailerNumber={trailerNumber}
            fenceLinePrefix="NF"
          />
        ))}
      </select>
    </div>

    <div className="input-group">
      <label className="input-label">South Fence Line</label>
      <select
        className="input-fenceline"
        value={southFence}
        onChange={(e) =>
          onUpdate({
            southFence: e.target.value,
            northFence: "None",
          })
        }
      >
        {SOUTH_FENCE_OPTIONS.map((option) => (
          <FenceLineOption
            key={option.value}
            option={option}
            occupiedSpots={occupiedSpots}
            trailerNumber={trailerNumber}
            fenceLinePrefix="SF"
          />
        ))}
      </select>
    </div>
  </>
);

export default memo(Parking);
