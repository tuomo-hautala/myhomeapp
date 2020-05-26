import React, { useState } from "react";

const RoomStateIndicator = ({ state }) => {
  return (
    <div className="room-state-container">
      {[0, 1, 2, 3].map((indicatorState) => {
        return indicatorState === state ? (
          <div
            className="room-state-indicator"
            style={{ backgroundColor: "#707070" }}
          />
        ) : (
          <div className="room-state-indicator" />
        );
      })}

      {/* <div className="room-state-indicator" />
      <div className="room-state-indicator" />
      <div className="room-state-indicator" /> */}
    </div>
  );
};

export default RoomStateIndicator;
