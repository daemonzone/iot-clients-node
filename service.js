import 'dotenv/config';
import mqtt from 'mqtt';
import os from 'os';
import path from 'path';
import { randomWord, shortId, deviceImage } from './utils/device-utils.js';
import * as sensorsModule from './utils/sensors-data.js';

// Device info
const ip = getLocalIp();
const deviceModel = process.env.DEVICE_NAME || randomWord();
const deviceId = process.env.DEVICE_ID || `unknown-${shortId()}`;
const deviceImagePath = path.join(process.cwd(), 'images/orange_pi_one_thumb.jpg');

// MQTT configuration from environment
const MQTT_BROKER = process.env.MQTT_BROKER;
const MQTT_USER = process.env.MQTT_USER;
const MQTT_PASS = process.env.MQTT_PASS;

const sensors = process.env.SENSORS
  .split(',')          // split by comma
  .map(s => s.trim()); // trim each element

// MQTT topics configuration
const statusTopic = `devices/${deviceId}/status`;
const registerTopic = `devices/${deviceId}/register`;

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
  const now = new Date();
  const iso = now.toISOString();
  const ts = iso.slice(0, 19).replace("T", " ") + "+00:00";

  return ts;
}

function handleStatus(client, deviceId) {
  const data = {
    id: deviceId,
    status: "up",
    ip,
    sensors_data: sensorsModule.getSensorsData(sensors), // check libs/sensors-data.js for specific functions
    uptime: getUptimeMs(),
    timestamp: currentTimestamp()
  };

  const payload = JSON.stringify(data);
  client.publish(statusTopic, payload);
  console.log(`Published to ${statusTopic}: ${payload}`);
}

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Announce this device
  const registerPayload = JSON.stringify({
    model: deviceModel,
    id: deviceId,
    ip,
    sensors,    
    image: deviceImage(deviceImagePath)
  });

  client.publish(registerTopic, registerPayload, { qos: 1, retain: false });
  const loggedPayload = JSON.parse(registerPayload);
  if (loggedPayload.image) loggedPayload.image = '[base64 image omitted]';
  console.log(`Registered device on ${registerTopic}: ${JSON.stringify(loggedPayload)}`);

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
