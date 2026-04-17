import React from "react";
import StatsHeader from "./StatsHeader";
import TrailerList from "./TrailerList";

const Trailers = ({
  trailers,
  searchQuery,
  onEdit,
  onDelete,
  editingTrailer,
}) => {
  return (
    <div className="trailers-section">
      <StatsHeader trailers={trailers} />
      <TrailerList
        trailers={trailers}
        searchQuery={searchQuery}
        onEdit={onEdit}
        onDelete={onDelete}
        editingTrailer={editingTrailer}
      />
    </div>
  );
};

export default Trailers;
