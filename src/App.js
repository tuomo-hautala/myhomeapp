import React, { useState, useEffect } from "react";
import "./App.css";
import mqttClient from "./mqttClient.js";
import OnlineStatus from "./components/OnlineStatus";
import Wallpanel from "./components/Wallpanel";
import SubscriptionSwitch from "./components/SubscriptionSwitch";
import RoomStateIndicator from "./components/RoomStateIndicator";

import { ReactComponent as WifiDisconnectedIcon } from "./assets/icons/wifi_disconnected.svg";
import { ReactComponent as WifiConnectedIcon } from "./assets/icons/wifi_connected.svg";
import { ReactComponent as WallpanelIcon } from "./assets/icons/wallpanel.svg";
import { ReactComponent as LightBulbIcon } from "./assets/icons/lightbulb.svg";
import { ReactComponent as DeleteIcon } from "./assets/icons/delete.svg";

import styled from "styled-components";

function App() {
  const [isAppOnline, setIsAppOnline] = useState(false);
  const [rooms, setRooms] = useState(null);
  const [clients, setClients] = useState(null);
  const [configuration, setConfiguration] = useState({});
  const [newRoomName, setNewRoomName] = useState("");

  useEffect(() => {
    mqttClient.on("connect", function () {
      console.log("CLIENT CONNECTED");
      setIsAppOnline(true);
      //subscribe to listen to the channels in which arduinos will be publishing
      mqttClient.subscribe("APPDATA");
      //mqttClient.subscribe("CONFIGURATION");
      // mqttClient.publish("CONFIGURATION", JSON.stringify(clientData));
    });

    mqttClient.on("reconnect", function () {
      setIsAppOnline(false);
      console.log("CLIENT RECONNECTING");
    });

    mqttClient.on("disconnect", function () {
      setIsAppOnline(false);
      console.log("CLIENT DISCONNECTED");
    });

    mqttClient.on("offline", function () {
      setIsAppOnline(false);
      console.log("CLIENT OFFLINE");
    });

    mqttClient.on("message", (topic, message) => {
      // console.log("topic: ", topic);
      console.log("message: ", message.toString());
      switch (topic) {
        case "CONFIGURATION":
          try {
            const msg = JSON.parse(message.toString());
            console.log(msg);
            if (msg.hasOwnProperty("method")) {
              switch (msg.method) {
                case "configuration":
                  setConfiguration(msg.params);
                  break;

                default:
                  break;
              }
            }
          } catch (error) {
            console.log("Error parsing CONFIGURATION data");
            //  Block of code to handle errors
          }
          break;
        case "APPDATA":
          // try {
          const msg = JSON.parse(message.toString());
          if (msg.hasOwnProperty("method")) {
            switch (msg.method) {
              case "roomsStates":
                setRooms(msg.params);
                break;
              case "clientStates":
                //console.log(msg);
                setClients(msg.params);
                break;
              case "clientState":
                let clientData = msg.params;
                var newClientsData = clients;
                newClientsData[clientData.id] = clientData;
                console.log(newClientsData);
                // setClients({newClientsData});
                break;
              default:
                break;
            }
          }
          // } catch (error) {
          //   console.log("Error parsing APPDATA data");
          //   //  Block of code to handle errors
          // }
          break;
        default:
          break;
      }
      // try {
      //   const msg = JSON.parse(message.toString("utf-8"));
      //   console.log(msg);

      //   if (msg.hasOwnProperty("lights")) {
      //     setLights(msg.lights);
      //   }
      //   if (msg.hasOwnProperty("wallpanels")) {
      //     setWallpanels(msg.wallpanels);
      //   }
      // } catch (error) {
      //   console.log("Error parsing data");
      //   //  Block of code to handle errors
      // }
    });
  }, []);

  const handleAddRoom = () => {
    console.log(
      "CREATE ROOM BUTTON PUSHED -> CREATE ROOM WITH KEY",
      newRoomName
    );
    const payload = {
      method: "addRoom",
      params: { name: newRoomName },
    };
    mqttClient.publish("APPDATA", JSON.stringify(payload));
    setNewRoomName("");
  };

  const handleDeleteRoom = (roomName) => {
    const payload = {
      method: "deleteRoom",
      params: { name: roomName },
    };
    mqttClient.publish("APPDATA", JSON.stringify(payload));
  };

  const handleSubscribe = (clientId, topic) => {
    const payload = {
      method: "setSubscription",
      params: { id: clientId, topic: topic.toUpperCase() },
    };

    mqttClient.publish("CONFIGURATION", JSON.stringify(payload));
  };

  const handleUnSubscribe = (clientId, topic) => {
    const payload = {
      method: "setUnSubscription",
      params: { id: clientId, topic: topic },
    };

    mqttClient.publish("CONFIGURATION", JSON.stringify(payload));
  };

  const handleSetState = () => {
    console.log("HANDLE WALLPANEL PUSH FUNCTIONS HERE");
  };

  return (
    <div className="App">
      <OnlineStatus isAppOnline={isAppOnline} />
      <h1 className="title">MY HOME</h1>
      <div className="rooms-container">
        <h2 className="room-name">ROOMS</h2>
        <div className="card create-room-container">
          <button
            disabled={newRoomName === ""}
            className="create-room-button"
            onClick={() => handleAddRoom()}
          >
            <i className="material-icons">add</i>
          </button>
          <div className="create-room-name-container">
            <h4>ROOM NAME</h4>
            <input
              id="create-room-name-input"
              className="create-room-name"
              type="text"
              value={newRoomName}
              onChange={(event) => {
                setNewRoomName(event.target.value.toUpperCase());
              }}
            ></input>
          </div>
        </div>
        <div className="rooms">
          {rooms &&
            Object.keys(rooms).map((room) => {
              return (
                <div key={rooms[room].id} className="card room">
                  <div className="room-lighting-state">
                    <LightBulbIcon
                      style={{
                        fill: rooms[room].state.lightingState
                          ? "rgb(251, 255, 35)"
                          : "#707070",
                      }}
                    />
                  </div>
                  <button
                    className="delete-room-button"
                    onClick={() => handleDeleteRoom(room)}
                  >
                    <DeleteIcon />
                  </button>
                  <h4>{room}</h4>
                  {Object.keys(rooms[room].subscribers).map((subscriber) => {
                    return (
                      <div className="room-subscriber-item">
                        <h4>
                          {rooms[room].subscribers[subscriber].type === "wp" &&
                            "WALLPANEL"}
                          {rooms[room].subscribers[subscriber].type ===
                            "ws2812" && "LIGHT"}
                        </h4>
                        <h5>{rooms[room].subscribers[subscriber].id}</h5>
                        {rooms[room].subscribers[subscriber].type === "wp" && (
                          <WallpanelIcon />
                        )}
                        {rooms[room].subscribers[subscriber].type ===
                          "ws2812" && <LightBulbIcon />}
                      </div>
                    );
                  })}
                  <RoomStateIndicator state={rooms[room].state} />
                </div>
              );
            })}
        </div>
      </div>
      <h2>DEVICES</h2>
      <div className="devices-container">
        {clients &&
          Object.keys(clients).map((client) => {
            return (
              <div className="card device">
                <div className="online-status">
                  {clients[client].online ? (
                    <WifiConnectedIcon className="wifiConnected" />
                  ) : (
                    <WifiDisconnectedIcon className="wifiDisconnected" />
                  )}
                </div>
                <div className="device-name">
                  <h4> {clients[client].type === "wp" && "WALLPANEL"}</h4>
                  <h5>{clients[client].id}</h5>
                </div>
                {clients[client].type === "wp" && <Wallpanel />}
                {rooms &&
                  Object.keys(rooms).map((room) => {
                    return (
                      <SubscriptionSwitch
                        clientId={clients[client].id}
                        roomName={room}
                        state={clients[client].subscribedTo.includes(room)}
                        handleSubscribe={handleSubscribe}
                        handleUnSubscribe={handleUnSubscribe}
                      />
                    );
                  })}
              </div>
            );
          })}
        {/*clients &&
          Object.keys(clients).map((client) => {
            return (
              <div className="card device">
                <div className="online-status">
                  {clients[client].online ? (
                    <WifiConnectedIcon className="wifiConnected" />
                  ) : (
                    <WifiDisconnectedIcon className="wifiDisconnected" />
                  )}
                </div>
                <div className="device-name">
                  <h4> {clients[client].type === "wp" && "WALLPANEL"}</h4>
                  <h5>{clients[client].id}</h5>
                </div>

                {clients[client].type === "wp" && <Wallpanel />}
                {Object.keys(rooms).map((room) => {
                  return (
                    <SubscriptionSwitch
                      clientId={clients[client].id}
                      roomName={room}
                      state={clients[client].subscribedTo.includes(room)}
                      handleSubscribe={handleSubscribe}
                      handleUnSubscribe={handleUnSubscribe}
                    />
                  );
                })}
              </div>
            );
          })*/}
      </div>
    </div>
  );
}

export default App;
