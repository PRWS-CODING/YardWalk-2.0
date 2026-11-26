import React, { memo } from "react";

const StatsHeader = ({ trailers = [], activeYard }) => {
  const primaryGroup = activeYard?.radioGroups?.[0];
  const primaryOptions = primaryGroup?.options || ["Empty", "Salvage", "Full"];
  const primaryField = primaryGroup?.id || "status";
  const checkboxes = activeYard?.checkboxes || [];

  const getOptionCount = (option) =>
    trailers.filter((t) => (t[primaryField] ?? t.status) === option).length;

  // Preserve Romulus's Empty vs. Salvage fuel breakdown when Salvage & needsFuel exist
  const hasSalvageAndFuel =
    primaryOptions.includes("Salvage") &&
    checkboxes.some((box) => box.id === "needsFuel");

  const emptyNeedsFuelCount = trailers.filter(
    (t) => (t[primaryField] ?? t.status) === "Empty" && t.needsFuel,
  ).length;

  const salvageNeedsFuelCount = trailers.filter(
    (t) => (t[primaryField] ?? t.status) === "Salvage" && t.needsFuel,
  ).length;

  return (
    <>
      <div className="counts">
        {primaryOptions.map((option) => (
          <span
            key={option}
            id={`${option.toLowerCase().replace(/\s+/g, "-")}-count`}
            className="count-item"
          >
            {option}: {getOptionCount(option)}
          </span>
        ))}
      </div>

      <div className="stats">
        {hasSalvageAndFuel ? (
          <>
            <span className="count-item">
              Needs Fuel:{" "}
              <span className="needs-fuel-count">{emptyNeedsFuelCount}</span>
            </span>
            <span className="count-item">
              Salvage Needs Fuel:{" "}
              <span id="salvage-needs-fuel-count" className="needs-fuel-count">
                {salvageNeedsFuelCount}
              </span>
            </span>
          </>
        ) : (
          checkboxes.map((box) => {
            const count = trailers.filter((t) => Boolean(t[box.id])).length;
            return (
              <span key={box.id} className="count-item">
                {box.label.replace(/\?$/, "")}:{" "}
                <span className="needs-fuel-count">{count}</span>
              </span>
            );
          })
        )}
      </div>
    </>
  );
};

export default memo(StatsHeader);