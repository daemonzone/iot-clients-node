import 'dotenv/config';
import mqtt from 'mqtt';
import os from 'os';

// MQTT configuration from environment
const MQTT_BROKER = process.env.MQTT_BROKER;
const MQTT_USER = process.env.MQTT_USER;
const MQTT_PASS = process.env.MQTT_PASS;

// Connect options
const options = {
  username: MQTT_USER,
  password: MQTT_PASS,
  rejectUnauthorized: false // optional, depends on your cert setup
};

// Connect to MQTT broker
const client = mqtt.connect(MQTT_BROKER, options);

// Get first non-internal IPv4 address
function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '0.0.0.0';
}

const startTime = Date.now(); // record when the script starts
function getUptimeMs() {
  return Math.floor((Date.now() - startTime) / 1000);
}

function currentTimestamp() {
  // Returns local time in "YYYY-MM-DD HH:mm:ss±HHMM" format
  const now = new Date();
  const tzOffset = -now.getTimezoneOffset();
  const sign = tzOffset >= 0 ? "+" : "-";
  const pad = (n) => String(n).padStart(2, "0");
  const tz = pad(Math.floor(Math.abs(tzOffset) / 60)) + pad(Math.abs(tzOffset) % 60);

  return now.toISOString().slice(0, 19).replace("T", " ") + sign + tz;
}

function handleStatus(client, deviceId) {
  const data = {
    id: deviceId,
    status: "up",
    ip,
    led: null,
    uptime: getUptimeMs(),
    timestamp: currentTimestamp()
  };

  const payload = JSON.stringify(data);
  client.publish(statusTopic, payload);
  console.log(`Published to ${statusTopic}: ${payload}`);
}

// Device info
const deviceModel = 'MacBook Pro M2';
const deviceId = 'davidem2pro';
const statusTopic = `devices/${deviceId}/status`;
const registerTopic = `devices/${deviceId}/register`;
const ip = getLocalIp();


client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Announce this device
  const registerPayload = JSON.stringify({
    model: deviceModel,
    id: deviceId,
    ip: ip
  });

  client.publish(registerTopic, registerPayload, { qos: 1, retain: false });
  console.log(`Registered device on ${registerTopic}: ${registerPayload}`);

  setTimeout(() => {
    handleStatus(client, deviceId);
  }, 500);

  // Start sending status update at every interval
  setInterval(() => {
    handleStatus(client, deviceId);
  }, 60000);  // every minute
});

client.on('error', (err) => {
  console.error('MQTT error:', err);
});
