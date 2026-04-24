import React, { useEffect, memo } from "react";

const Warning = ({ message, onClear }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClear, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div className="warning-banner">
      {message}
    </div>
  );
};

export default memo(Warning);
