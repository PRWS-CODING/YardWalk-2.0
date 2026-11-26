import React, { useEffect, useRef, useState, useCallback, memo, useMemo } from "react";

const TrailerList = ({
  trailers = [],
  searchQuery = "",
  onEdit,
  onDelete,
  editingTrailer,
  activeYard,
}) => {
  // Track each category's scrollable container independently
  const listRefs = useRef({});
  const [expandedCategories, setExpandedCategories] = useState({});

  // Build category accordions dynamically per yard (while keeping Romulus's exact groups)
  const categories = useMemo(() => {
    const primaryGroup = activeYard?.radioGroups?.[0];
    const primaryField = primaryGroup?.id || "status";
    const checkboxes = activeYard?.checkboxes || [];

    const isRomulus =
      !activeYard ||
      activeYard.id === "default-app-id" ||
      (primaryGroup?.options?.includes("Salvage") &&
        checkboxes.some((b) => b.id === "needsFuel"));

    if (isRomulus) {
      return [
        {
          title: "Needs Fuel",
          filter: (t) =>
            (t[primaryField] ?? t.status) === "Empty" && Boolean(t.needsFuel),
        },
        {
          title: "All Salvage Trailers",
          filter: (t) => (t[primaryField] ?? t.status) === "Salvage",
        },
        {
          title: "All Empty Trailers",
          filter: (t) =>
            (t[primaryField] ?? t.status) === "Empty" && !t.needsFuel,
        },
        {
          title: "All Pallet Shuttle Trailers",
          filter: (t) => Boolean(t.palletShuttle),
        },
        {
          title: "All Inbound & Seasonal Trailers",
          filter: (t) => Boolean(t.inbound || t.seasonal),
        },
        {
          title: "All Trailers",
          filter: () => true,
        },
      ];
    }

    const dynamicCategories = [];

    (primaryGroup?.options || []).forEach((option) => {
      dynamicCategories.push({
        title: `All ${option} Trailers`,
        filter: (t) => (t[primaryField] ?? t.status) === option,
      });
    });

    checkboxes.forEach((box) => {
      const cleanLabel = box.label.replace(/\?$/, "");
      dynamicCategories.push({
        title: cleanLabel,
        filter: (t) => Boolean(t[box.id]),
      });
    });

    dynamicCategories.push({
      title: "All Trailers",
      filter: () => true,
    });

    return dynamicCategories;
  }, [activeYard]);

  // Sort trailers in physical yard-walk order using the active yard's parkingZones array
  const getSortableValue = useCallback(
    (t) => {
      const zones = activeYard?.parkingZones || [];

      for (let zIdx = 0; zIdx < zones.length; zIdx++) {
        const zone = zones[zIdx];
        const parkedVal = t[zone.id];

        if (parkedVal && parkedVal !== "None") {
          const spotIndex = zone.spots.findIndex((s) =>
            typeof s === "string" ? s === parkedVal : s.value === parkedVal,
          );
          return [
            zIdx,
            spotIndex >= 0 ? spotIndex : 999,
            parseInt(t.trailerNumber, 10) || 0,
          ];
        }
      }

      // Not parked in any zone
      return [999, 0, parseInt(t.trailerNumber, 10) || 0];
    },
    [activeYard],
  );

  const sortedTrailers = useMemo(() => {
    return [...trailers].sort((a, b) => {
      const [zoneA, spotA, numA] = getSortableValue(a);
      const [zoneB, spotB, numB] = getSortableValue(b);

      if (zoneA !== zoneB) return zoneA - zoneB;
      if (spotA !== spotB) return spotA - spotB;
      return numA - numB;
    });
  }, [trailers, getSortableValue]);

  const scrollToTrailer = useCallback(() => {
    if (!searchQuery) return;
    const element = document.querySelector(
      `[data-trailer-number="${searchQuery}"]`,
    );
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [searchQuery]);

  useEffect(() => {
    scrollToTrailer();
  }, [scrollToTrailer]);

  const toggleCategory = useCallback((title) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }, []);

  const primaryField = activeYard?.radioGroups?.[0]?.id || "status";

  const renderTrailerItem = (t, categoryTitle) => {
    const primaryStatus = t[primaryField] ?? t.status;

    const classNames = [
      "trailer-item",
      t.palletShuttle ? "pallet-shuttle" : "",
      t.palletShuttle
        ? primaryStatus === "Empty"
          ? "pallet-shuttle-empty"
          : "pallet-shuttle-full"
        : t.needsFuel
          ? "needs-fuel"
          : "no-fuel-needed",
      t.trailerNumber === searchQuery ? "selected" : "",
    ]
      .filter(Boolean)
      .join(" ");

    // Intercept delete to lock scroll position before DOM shifts
    const handleLocalDelete = () => {
      const container = listRefs.current[categoryTitle];
      const savedScrollTop = container ? container.scrollTop : 0;

      onDelete(t.id, t.trailerNumber);

      if (container) {
        requestAnimationFrame(() => {
          container.scrollTop = savedScrollTop;
        });
      }
    };

    // Build dynamic details line from activeYard config
    const radioBadges = (activeYard?.radioGroups || []).map(
      (group, idx) => t[group.id] ?? (idx === 0 ? t.status : null),
    );

    const checkboxBadges = (activeYard?.checkboxes || []).map((box) =>
      t[box.id] ? box.label.replace(/\?$/, "") : null,
    );

    const parkingBadges = (activeYard?.parkingZones || []).map((zone) => {
      const val = t[zone.id];
      if (!val || val === "None") return null;

      const matchedSpot = zone.spots.find((s) =>
        typeof s === "string" ? s === val : s.value === val,
      );
      const displaySpot =
        typeof matchedSpot === "object" ? matchedSpot.label : val;

      return `${zone.shortCode}: ${displaySpot}`;
    });

    const detailsText = [
      ...radioBadges,
      ...checkboxBadges,
      ...parkingBadges,
      t.comments ? `Note: ${t.comments}` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    return (
      <li
        key={t.id}
        data-trailer-number={t.trailerNumber}
        className={classNames}
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
            <button className="delete-button" onClick={handleLocalDelete}>
              &times;
            </button>
          </div>
          <div className="text-sm">{detailsText}</div>
        </div>
      </li>
    );
  };

  const renderList = (category) => {
    const list = sortedTrailers
      .filter((t) => t.trailerNumber.includes(searchQuery))
      .filter(category.filter);

    if (list.length === 0) return null;

    const isExpanded =
      expandedCategories[category.title] ||
      (searchQuery.length > 0 &&
        list.some((t) => t.trailerNumber === searchQuery));

    return (
      <div key={category.title} className="category-group">
        <h2
          onClick={() => toggleCategory(category.title)}
          className="section-title section-title-header"
        >
          {category.title}
          <span>{isExpanded ? "−" : "+"}</span>
        </h2>
        {isExpanded && (
          <div
            className="trailer-list-container"
            ref={(el) => (listRefs.current[category.title] = el)}
          >
            <ul className="trailer-items-list">
              {list.map((t) => renderTrailerItem(t, category.title))}
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