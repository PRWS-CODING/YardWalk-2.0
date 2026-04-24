import React, { useEffect, useRef, useState, useCallback, memo } from "react";

const TrailerList = ({
  trailers,
  searchQuery,
  onEdit,
  onDelete,
  editingTrailer,
}) => {
  const listRef = useRef(null);
  const [expandedCategories, setExpandedCategories] = useState({});

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
    {
      title: "All Trailers",
      filter: () => true,
    },
  ];

  const getSortableValue = (t) => {
    const nf = t.northFence || "None";
    const sf = t.southFence || "None";

    // 1. North Fence Logic
    if (nf !== "None") {
      const parts = nf.split(" ");
      let group, num;
      if (parts.length === 1 && !isNaN(parts[0])) {
        num = parseInt(parts[0], 10);
        group = num <= 25 ? "NF_NUM_LOW" : "NF_NUM_HIGH";
      } else {
        num = parseInt(parts.pop(), 10);
        group = parts.join(" ");
      }
      const sequence = [
        "TA",
        "NF_NUM_LOW",
        "NP",
        "NF_NUM_HIGH",
        "Curb",
        "WT",
        "B",
      ];
      return [0, sequence.indexOf(group), num];
    }

    // 2. South Fence Logic
    if (sf !== "None") {
      const parts = sf.split(" ");
      let group, num;
      if (parts.length === 1 && !isNaN(parts[0])) {
        num = parseInt(parts[0], 10);
        if (num <= 329) group = "SF_NUM1";
        else if (num <= 359) group = "SF_NUM2";
        else group = "SF_NUM3";
      } else {
        num = parseInt(parts.pop(), 10);
        group = parts.join(" ");
        // Distinguish between the split prefix locations (Bs 1-4 vs Bs 5-13)
        if (group === "Bs") group = num <= 4 ? "Bs_START" : "Bs_END";
        if (group === "NPs") group = num === 1 ? "NPs_START" : "NPs_END";
      }
      const sequence = [
        "Bs_START",
        "SF_NUM1",
        "NPs_START",
        "SF_NUM2",
        "NPs_END",
        "SF_NUM3",
        "Bs_END",
      ];
      return [1, sequence.indexOf(group), num];
    }

    // 3. Not Parked (None)
    return [2, 0, parseInt(t.trailerNumber, 10) || 0];
  };

  const sortedTrailers = [...trailers].sort((a, b) => {
    const [sideA, groupA, numA] = getSortableValue(a);
    const [sideB, groupB, numB] = getSortableValue(b);

    if (sideA !== sideB) return sideA - sideB;
    if (groupA !== groupB) return groupA - groupB;
    return numA - numB;
  });

  const scrollToTrailer = useCallback(() => {
    if (searchQuery.length === 6) {
      const element = document.querySelector(
        `[data-trailer-number="${searchQuery}"]`,
      );
      if (element)
        element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [searchQuery]); // Dependency on searchQuery

  useEffect(() => {
    scrollToTrailer();
  }, [scrollToTrailer]); // Dependency on memoized scrollToTrailer

  const toggleCategory = useCallback((title) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }, []); // No dependencies, as it uses functional update

  /**
   * Renders a single trailer item.
   * @param {object} t The trailer object.
   * @param {function} onEdit Callback to edit a trailer.
   * @param {function} onDelete Callback to delete a trailer.
   * @param {object|null} editingTrailer The trailer currently being edited.
   * @param {string} searchQuery The current search query.
   * @returns {JSX.Element} The trailer list item.
   */
  const TrailerItem = memo(function TrailerItem({
    t,
    onEdit,
    onDelete,
    editingTrailer,
    searchQuery,
  }) {
    return (
      <li
        key={t.id}
        data-trailer-number={t.trailerNumber}
        className={`trailer-item ${
          t.needsFuel ? "needs-fuel" : "no-fuel-needed"
        } ${t.trailerNumber === searchQuery ? "selected" : ""}`}
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
    );
  });

  const renderList = (category) => {
    const list = sortedTrailers
      .filter((t) => t.trailerNumber.includes(searchQuery))
      .filter(category.filter);

    if (list.length === 0) return null;

    // Auto-expand if the search matches a trailer in this list, otherwise use toggle state
    const isExpanded =
      expandedCategories[category.title] ||
      (searchQuery.length > 0 &&
        list.some((t) => t.trailerNumber === searchQuery));

    return (
      <div key={category.title} className="category-group">
        <h2
          className="section-title"
          onClick={() => toggleCategory(category.title)}
          // Moved inline styles to CSS class `section-title-header`
          className="section-title section-title-header"
        >
          {category.title}
          <span>{isExpanded ? "−" : "+"}</span>
        </h2>
        {isExpanded && (
          <div className="trailer-list-container" ref={listRef}>
            <ul className="trailer-items-list">
              {list.map(
                (
                  t, // Pass necessary props to TrailerItem
                ) => (
                  <TrailerItem
                    key={t.id}
                    t={t}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    editingTrailer={editingTrailer}
                    searchQuery={searchQuery}
                  />
                ),
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="trailer-list-sections">{categories.map(renderList)}</div>
  );
};

export default memo(TrailerList);
