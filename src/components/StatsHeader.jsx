import React, { memo } from "react";

const StatsHeader = ({ trailers }) => {
  const emptyCount = trailers.filter((t) => t.status === "Empty").length;
  const salvageCount = trailers.filter((t) => t.status === "Salvage").length;
  const fullCount = trailers.filter((t) => t.status === "Full").length;
  const needsFuelCount = trailers.filter(
    (t) => t.status === "Empty" && t.needsFuel,
  ).length;
  const salvageNeedsFuelCount = trailers.filter(
    (t) => t.status === "Salvage" && t.needsFuel,
  ).length;

  return (
    <>
      <div className="counts">
        <span id="empty-count" className="count-item">
          Empty: {emptyCount}
        </span>
        <span id="salvage-count" className="count-item">
          Salvage: {salvageCount}
        </span>
        <span id="full-count" className="count-item">
          Full: {fullCount}
        </span>
      </div>
      <div className="stats">
        <span className="count-item">
          Needs Fuel: <span className="needs-fuel-count">{needsFuelCount}</span>
        </span>
        <span className="count-item">
          Salvage Needs Fuel:{" "}
          <span id="salvage-needs-fuel-count" className="needs-fuel-count">
            {salvageNeedsFuelCount}
          </span>
        </span>
      </div>
    </>
  );
};

export default memo(StatsHeader);
