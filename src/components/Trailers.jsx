import React from "react";
import StatsHeader from "./StatsHeader";
import TrailerList from "./TrailerList";

const Trailers = ({
  trailers,
  searchQuery,
  onEdit,
  onDelete,
  editingTrailer,
  activeYard,
}) => {
  return (
    <div className="trailers-section">
      <StatsHeader trailers={trailers} activeYard={activeYard} />
      <TrailerList
        trailers={trailers}
        searchQuery={searchQuery}
        onEdit={onEdit}
        onDelete={onDelete}
        editingTrailer={editingTrailer}
        activeYard={activeYard}
      />
    </div>
  );
};

export default Trailers;