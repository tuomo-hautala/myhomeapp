import React from "react";
import { ReactComponent as WifiDisconnectedIcon } from "../assets/icons/wifi_disconnected.svg";
import { ReactComponent as WifiConnectedIcon } from "../assets/icons/wifi_connected.svg";

const OnlineStatus = ({ isAppOnline }) => {
  return (
    <div className="online-status">
      {isAppOnline ? (
        <WifiConnectedIcon className="wifiConnected" />
      ) : (
        <WifiDisconnectedIcon className="wifiDisconnected" />
      )}
    </div>
  );
};

export default OnlineStatus;
