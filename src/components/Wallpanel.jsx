import React from "react";

const Wallpanel = ({ handleSetState }) => {
  return (
    <div className="wallpanel-device">
      <button
        className="wallpanel-device-button"
        onClick={() => handleSetState()}
      />
    </div>
  );
};

export default Wallpanel;
