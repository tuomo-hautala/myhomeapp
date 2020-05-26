import mqtt from "mqtt";

const clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);

const clientData = {
  method: "setClientData",
  params: {
    id: clientId,
    type: "ui",
  },
};

// connect to the Moscar broker server
//const brokerUrl = "ws:192.168.1.110:8000";
const brokerUrl = "ws:raspberrypi.local:8000";

const mqttClient = mqtt.connect(brokerUrl, { clientId: clientId }); // your broker server ip here

export default mqttClient;
