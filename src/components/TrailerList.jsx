import React, { useEffect, useRef } from "react";

const TrailerList = ({
  trailers,
  searchQuery,
  onEdit,
  onDelete,
  editingTrailer,
}) => {
  const listRef = useRef(null);

  const getSortableValue = (t) => {
    const fenceLine = t.northFence !== "None" ? t.northFence : t.southFence;
    if (fenceLine === "None") return [false, "", 0];
    const parts = fenceLine.split(" ");
    if (parts.length === 1 && !isNaN(parts[0]))
      return [true, "NF", parseInt(parts[0], 10)];
    const numericPart = parts.pop();
    return [true, parts.join(" "), parseInt(numericPart, 10)];
  };

  const sortedTrailers = [...trailers].sort((a, b) => {
    const [isAssA, prefixA, numA] = getSortableValue(a);
    const [isAssB, prefixB, numB] = getSortableValue(b);
    if (isAssA !== isAssB) return isAssB - isAssA;
    if (prefixA !== prefixB) return prefixA.localeCompare(prefixB);
    return numA - numB;
  });

  useEffect(() => {
    if (searchQuery.length === 6) {
      const element = document.querySelector(
        `[data-trailer-number="${searchQuery}"]`,
      );
      if (element)
        element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [searchQuery]);

  const categories = [
    {
      title: "Needs Fuel",
      filter: (t) => t.status === "Empty" && t.needsFuel,
    },
    {
      title: "All Salvage Trailers",
      filter: (t) => t.status === "Salvage",
    },
    {
      title: "All Empty Trailers",
      filter: (t) => t.status === "Empty" && !t.needsFuel,
    },
    { title: "All Pallet Shuttle Trailers", filter: (t) => t.palletShuttle },
    {
      title: "All Inbound & Seasonal Trailers",
      filter: (t) => t.inbound || t.seasonal,
    },
  ];

  const renderList = (category) => {
    const list = sortedTrailers
      .filter((t) => t.trailerNumber.includes(searchQuery))
      .filter(category.filter);

    if (list.length === 0) return null;

    return (
      <div key={category.title} className="container">
        <h2 className="section-title">{category.title}</h2>
        <div className="trailer-list-container" ref={listRef}>
          <ul>
            {list.map((t) => (
              <li
                key={t.id}
                data-trailer-number={t.trailerNumber}
                className={`trailer-item ${t.needsFuel ? "needs-fuel" : ""} ${
                  t.trailerNumber === searchQuery ? "selected" : ""
                }`}
              >
                <div className="trailer-info">
                  <div className="trailer-number">{t.trailerNumber}</div>
                  <div>
                    <button
                      className="edit-button"
                      onClick={() => onEdit(t)}
                      disabled={!!editingTrailer}
                    >
                      ✎
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => onDelete(t.id, t.trailerNumber)}
                    >
                      &times;
                    </button>
                  </div>
                  <div className="text-sm">
                    {[
                      t.status,
                      t.needsFuel ? "Needs Fuel" : null,
                      t.inbound ? "Inbound" : null,
                      t.seasonal ? "Seasonal" : null,
                      t.palletShuttle ? "Pallet Shuttle" : null,
                      t.northFence !== "None" ? `NF: ${t.northFence}` : null,
                      t.southFence !== "None" ? `SF: ${t.southFence}` : null,
                      t.comments ? `Note: ${t.comments}` : null,
                    ]
                      .filter(Boolean)
                      .join(" | ")}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return <>{categories.map(renderList)}</>; // No container here, App.jsx provides it
};

export default TrailerList;
