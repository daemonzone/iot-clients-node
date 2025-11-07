# 🌐 IoT NodeJs Clients

## ⚙️ Overview

This project combines firmware and software for microcontrollers, backend services, and monitoring tools.

### 💻 NodeJs Clients

Node.js based client code available for micro-computers (like Raspberry or Orange Pi)

### Requirements / Tech Stack
- **Node.js**,
- **MQTT**

---

## 📁 Repositories

The whole project is based on different components, split on several repositories

| Component                                                                            | Description                                                              |
|--------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| [iot-monitor-service](https://github.com/daemonzone/iot-monitor-service)             | Node.js **monitoring and control service**, interacting with the backend |  
| [iot-clients-esp8266-esp32](https://github.com/daemonzone/iot-clients-esp8266-esp32) | esp8266 / esp32 **C++ client sketches**                          |
| [iot-clients-node](https://github.com/daemonzone/iot-clients-node)                   | **Node.js clients** for newer Raspberry/OrangePi devices                 | 
| [iot-clients-node-legacy](https://github.com/daemonzone/iot-clients-node-legacy)     | Node.js clients for **older devices** (Armbian v3, mqtt4)                | 
| [iot-monitor-api](https://github.com/daemonzone/iot-monitor-api)                     | **API interface** to retrieve devices and telemetry from TimescaleDB     |
| [iot-monitor-dashboard](https://github.com/daemonzone/iot-monitor-dashboard)         | React **Web Dashboard** for device charts                                |

### 🛰️ IoT Monitor Service

A **Node.js service** responsible for:
- Identifying devices connected and allowed to send telemetry data
- Receiving telemetry from devices
- Persisting data into TimescaleDB
- Initializing database tables and hypertables
- _Sending commands to devices (wip)_

### 🧠 Wemos / esp8266 / esp32 Clients
- For IoT nodes based on **esp8266 / esp32** microcontrollers (i.e Wemos D1 mini)
- Each device has its own unique identifier
- Each device announces itself on a MQTT queue, being identified by the monitoring service.
- Each device periodically publishes telemetry and status (e.g. temperature, humidity, status) to a per-device MQTT queue

### 🕹️ NodeJs Clients (legacy)
Node.js v10 based client code available for older micro-computers (running Armbian v3.4.113)

### 🌐 IoT Monitor API
A **Node.js service** responsible for:
- Collecting and storing device telemetry into TimescaleDB
- Exposing REST endpoints to query device data and status

### 🖥️ IoT Monitor Dashboard
**React Web Interface** to:
- Visualize real-time device status and historical telemetry
- Display charts for temperature, humidity, uptime, and other metrics
- Filter, sort, and explore devices and their readings

---

## 🧰 Tech Stack

| Component | Technology             | Provider (with free plan) |
|------------|------------------------|---------------------------|
| Firmware | C++ (Arduino, ESP-IDF) | -                         |
| Backend / Monitor | Node.js                | -                         |
| Database | PostgreSQL + TimescaleDB | [Neon](https://neon.com/) | 
| Messaging | MQTT / Mosquitto      | [HiveMQ](https://www.hivemq.com/) |
| Dashboard | Node.js client or web app | -                         |

---

## 🚀 Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/daemonzone/iot-clients-node.git
   cd iot-clients-node


2. Install **iot-clients-node** dependencies

   _**Requires node >= 20_
   ```
   cd iot-clients-node
   npm install
   ```

3. Configure the environment
   Copy .env.example to .env and fill in the MQTT parameters:

   ```
   DEVICE_NAME=Your Device Name
   DEVICE_ID=unique_device_id
   MQTT_USER=mqtt_user
   MQTT_PASS=mqtt_user  
   MQTT_BROKER_URL=mqtt://localhost
   ```

4. Run the iot-clients-node
   ```
   npm start
   ```

### 🚀 Console output (with terminal set to 115200 baud)

   ```
   > device-service@1.0.0 start
   > node service.js && exit 0
   
   Connected to MQTT broker
   Registered device on devices/davidem2pro/register: {"model":"Generic IoT device","id":"iot-device-4d67b2","ip":"10.94.176.171"}
   Published to devices/davidem2pro/status: {"id":"davidem2pro","status":"up","ip":"10.94.176.171","led":null,"uptime":0,"timestamp":"2025-11-06 19:47:57+0100"}
   ...
   ```
---

## 🧑‍💻 Author

**Davide V.**

IoT enthusiast and full-stack developer

📍 Italy  
📫 **GitHub:** [@daemonzone](https://github.com/daemonzone)  
📧 **Email:** daemonzone@users.noreply.github.com
