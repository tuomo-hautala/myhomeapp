import React, { useState } from "react";

const SubscriptionSwitch = ({
  clientId,
  roomName,
  state,
  handleSubscribe,
  handleUnSubscribe,
}) => {
  return (
    <div className="subscription-switch-container">
      <div className="subscription-switch-name">
        <h5>{roomName}</h5>
      </div>
      <div
        className="subscription-switch"
        onClick={() => {
          state
            ? handleUnSubscribe(clientId, roomName)
            : handleSubscribe(clientId, roomName);
        }}
        style={{
          backgroundColor: `${state ? "#DEDEDE" : "#707070"}`,
        }}
      >
        <div
          className="subscription-switch-button"
          style={{
            transform: `${state ? "translateX(100%)" : "translateX(0%)"}`,
          }}
        />
      </div>

      {/* <div
                        className="room"
                        key={configuration.roomStates[room].id}
                      >
                        <div className="room-name">{room}</div>
                        <div>
                          <button
                            onClick={() =>
                              handleSubscribe(
                                configuration.clients[client].id,
                                room
                              )
                            }
                          >
                            <h4>SUBSCRIBE</h4>
                          </button>
                          <button
                            onClick={() =>
                              handleUnSubscribe(
                                configuration.clients[client].id,
                                room
                              )
                            }
                          >
                            <h4>UNSUBSCRIBE</h4>
                          </button>
                        </div>
                      </div> */}
    </div>
  );
};

export default SubscriptionSwitch;
