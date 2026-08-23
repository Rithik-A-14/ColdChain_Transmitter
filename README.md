<div align="center">
  <h1>🧊 ColdChain Core Telemetry System</h1>
  <p>An IoT-enabled smart cold chain temperature monitoring and telemetry dashboard powered by ESP32, LittleFS, and the DS18B20 digital thermal sensor.</p>
  
  <!-- Badges -->
  <img src="https://img.shields.io/badge/C%2B%2B-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white" alt="C++" />
  <img src="https://img.shields.io/badge/PlatformIO-F9A31B?style=for-the-badge&logo=PlatformIO&logoColor=white" alt="PlatformIO" />
  <img src="https://img.shields.io/badge/Espressif-ESP32-E7352C?style=for-the-badge&logo=espressif&logoColor=white" alt="ESP32" />
  <img src="https://img.shields.io/badge/Filesystem-LittleFS-339933?style=for-the-badge&logo=buffer&logoColor=white" alt="LittleFS" />
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Chart.js" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="MIT License" />
</div>

---

## 🌟 Project Overview

The **ColdChain Core Telemetry System** is a standalone, real-time temperature tracking and automated alarm system tailored for cold storage logistics, pharmaceutical refrigerators, vaccine distribution, milk chilling centers, and food preservation facilities.

Driven by an **ESP32 microcontroller** and a **DS18B20 digital temperature sensor**, the system hosts a high-performance embedded web server streaming responsive, dark-mode web telemetry directly from on-chip **LittleFS flash storage**. It eliminates the need for external cloud brokers while offering real-time data streaming, dynamic industry-standard profile switching, bidirectional threshold tuning, and hardware LED excursion alarms.

---

## ✨ Key Features

- 🌡️ **High-Precision Thermal Monitoring:** Reads ambient and core temperatures via DS18B20 1-Wire sensor at configurable sampling intervals (default: 5 seconds).
- 💾 **Embedded LittleFS Web Server:** Static web assets (`HTML5`, `CSS3`, `JavaScript`) are stored directly on the ESP32 flash memory and served over HTTP (Port 80).
- 📊 **Real-Time Interactive Telemetry (Chart.js):**
  - **Live History Line Chart:** Rolling 150-second stream (30 data points) with color-coded gradients (Blue = Normal, Red = Excursion).
  - **Thermal Stability Doughnut Chart:** Real-time distribution breakdown (_Safe Range_, _Too Cold_, _Too Hot_).
  - **Limit Comparison Bar Chart:** Live comparison between Minimum Limit, Current Temperature, and Maximum Limit.
- 🎯 **Preset Storage Profiles:** One-click switching between international cold chain standards:
  - **Vaccine Storage:** `+2.0°C` to `+8.0°C` (Default / WHO Guidelines)
  - **Raw Milk Storage:** `0.0°C` to `+4.0°C` (FAO Dairy Guidelines)
  - **Food Cold Room:** `0.0°C` to `+5.0°C` (FDA Food Code)
  - **Frozen Food Storage:** `-30.0°C` to `-15.0°C` (Codex Alimentarius)
  - **Pharma Medicines:** `+2.0°C` to `+8.0°C` (WHO Good Distribution Practices)
  - **Blood Bank Refrigeration:** `+2.0°C` to `+6.0°C` (WHO Blood Cold Chain)
  - **Ice Cream Storage:** `-30.0°C` to `-18.0°C` (IDF Standards)
- 🚨 **Dynamic Hardware Alarm (LED Indicator):** Automatically drives **GPIO 22** `HIGH` on thermal violation (under-temperature or over-temperature) and `LOW` during safe operation.
- 🔄 **Bidirectional REST API:**
  - `GET /api/data`: Returns live temperature and circular historical buffer in JSON format.
  - `POST /api/setThreshold`: Dynamically updates min/max alarm boundaries directly from the web interface without restarting the microcontroller.
- 🖥️ **Event Console & SOG Table:** Monospace live event log stream and built-in WHO / FDA / CODEX standard operating reference table.
- 🧪 **Offline Simulation Fallback:** Automatic graceful fallback to client-side simulated data if disconnected from the hardware during dashboard testing.

---

## 📂 Project Structure & File System

This project is built using PlatformIO with the **LittleFS** file system configured in `platformio.ini`:

```text
ColdChain_Transmitter/
├── data/                         # Web assets uploaded to ESP32 LittleFS flash partition
│   ├── index.html                # Telemetry Control Center web interface & layout
│   ├── script.js                 # Chart.js visualizations, REST API fetcher & profile logic
│   └── style.css                 # Industrial dark-theme telemetry stylesheet
├── include/                      # Custom C++ header files (.h)
│   └── README
├── lib/                          # Project-specific private libraries
│   └── README
├── src/
│   └── main.cpp                  # Firmware: Wi-Fi, WebServer, LittleFS, DS18B20 & REST API
├── .gitignore                    # Git ignore file for build artifacts and temp files
├── LICENSE                       # MIT Open-Source License
├── platformio.ini                # PlatformIO build settings, LittleFS config & dependencies
└── README.md                     # Project documentation
```

---

## 🛠️ Hardware Requirements & Pinout

### Component List

| Component                | Description                                           | Qty |
| :----------------------- | :---------------------------------------------------- | :-: |
| **ESP32 Dev Module**     | ESP-WROOM-32 30-pin / 38-pin Microcontroller Board    |  1  |
| **DS18B20 Sensor**       | Waterproof or TO-92 1-Wire Digital Temperature Sensor |  1  |
| **LED Indicator**        | Excursion Alarm Visual Alert (5mm LED)                |  1  |
| **4.7kΩ Resistor**       | Pull-up resistor for DS18B20 Data line                |  1  |
| **220Ω - 330Ω Resistor** | Current-limiting resistor for Alarm LED               |  1  |
| **Breadboard & Jumpers** | Prototyping wires and breadboard                      |  1  |
| **Micro-USB Cable**      | 5V Power and Serial Data connection                   |  1  |

### Wiring Connections

#### 1. DS18B20 Temperature Sensor Wiring

| DS18B20 Pin / Wire        | ESP32 Pin      | Notes                                                                 |
| :------------------------ | :------------- | :-------------------------------------------------------------------- |
| **VCC (Red)**             | `3.3V` / `VIN` | Connect to ESP32 3.3V (or 5V)                                         |
| **GND (Black / Blue)**    | `GND`          | Common Ground                                                         |
| **DATA (Yellow / White)** | `GPIO 4`       | **Required:** Connect 4.7kΩ pull-up resistor between `VCC` and `DATA` |

#### 2. Excursion Alarm LED Wiring

| LED Pin                   | ESP32 Pin | Notes                                           |
| :------------------------ | :-------- | :---------------------------------------------- |
| **Anode (+ Long Leg)**    | `GPIO 22` | Connect via 220Ω/330Ω current-limiting resistor |
| **Cathode (- Short Leg)** | `GND`     | Connect to Common Ground                        |

> [!IMPORTANT]
> A 4.7kΩ pull-up resistor between `VCC` and `DATA` (`GPIO 4`) is essential for reliable 1-Wire communication. Without it, the sensor will return `-127.00°C` (Disconnected status).

---

## 🔌 Software Dependencies

Managed automatically via [platformio.ini](file:///home/coredev/Documents/PlatformIO/Projects/ColdChain_Transmitter/platformio.ini):

```ini
[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
monitor_speed = 115200

; Define filesystem for web server
board_build.filesystem = littlefs

lib_deps =
    paulstoffregen/OneWire @ ^2.3.7
    milesburton/DallasTemperature @ ^3.11.0
    bblanchon/ArduinoJson @ ^6.21.3
```

---

## 📡 REST API Documentation

The ESP32 firmware exposes the following lightweight HTTP endpoints:

### 1. `GET /api/data`

Fetches the current temperature and rolling history buffer.

- **Response:** `200 OK` (`application/json`)
- **Example Payload:**
  ```json
  {
    "current": 4.5,
    "history": [4.2, 4.3, 4.5, 4.6, 4.5]
  }
  ```

### 2. `POST /api/setThreshold`

Updates the firmware's active minimum and maximum threshold limits on the fly without rebooting.

- **Query / Form Parameters:**
  - `min` _(float)_: Lower temperature bound in °C (e.g. `2.0`)
  - `max` _(float)_: Upper temperature bound in °C (e.g. `8.0`)
- **Example Request:**
  ```http
  POST /api/setThreshold?min=2.0&max=8.0 HTTP/1.1
  ```
- **Response:** `200 OK` (`text/plain: OK`)

---

## 🚀 Setup & Flashing Instructions

### Prerequisites

1. Install [VS Code](https://code.visualstudio.com/) and the [PlatformIO IDE Extension](https://platformio.org/).
2. Clone this repository to your local workspace.

### Step 1: Configure Wi-Fi Credentials

Open [src/main.cpp](file:///home/coredev/Documents/PlatformIO/Projects/ColdChain_Transmitter/src/main.cpp) and update your Wi-Fi SSID and Password:

```cpp
const char *ssid = "YOUR_WIFI_SSID";
const char *password = "YOUR_WIFI_PASSWORD";
```

### Step 2: Upload the LittleFS Web Assets (Crucial Step)

Before accessing the dashboard, the static web files in the `data/` folder must be flashed to the ESP32 LittleFS flash partition:

- In VS Code, click the **PlatformIO** icon in the sidebar.
- Expand `env:esp32dev` -> **Platform**.
- Click **Upload Filesystem Image** (or run `pio run --target uploadfs` in the PlatformIO CLI).

### Step 3: Build & Flash Firmware

- Click the **Build** (`✓`) icon in the PlatformIO bottom toolbar to compile the project.
- Connect the ESP32 via USB and click **Upload** (`→`) to flash the firmware.

### Step 4: Open Web Dashboard

1. Open the **Serial Monitor** at `115200` baud to observe the boot logs and obtain the assigned IP address:
   ```text
   Web Server IP Address: 192.168.1.105
   --- Files in LittleFS ---
   Found File: /index.html
   Found File: /script.js
   Found File: /style.css
   -------------------------
   ```
2. Open any web browser on a device connected to the same Wi-Fi network and navigate to:
   `http://<ESP32_IP_ADDRESS>` (e.g., `http://192.168.1.105`).

---

## 📋 Cold Chain Thermal Guidelines (WHO / FDA / CODEX)

| Application                  | Standard Range | Excursion Alert Threshold | Reference Standard                     |
| :--------------------------- | :------------- | :------------------------ | :------------------------------------- |
| **Vaccine Storage**          | `+2°C to +8°C` | `< 2°C` or `> 8°C`        | WHO Vaccine Management Handbook (2020) |
| **Raw Milk Storage**         | `0°C to +4°C`  | `> 4°C`                   | FAO Dairy Processing Guide             |
| **Food Cold Room (Fresh)**   | `0°C to +5°C`  | `> 5°C`                   | U.S. FDA Food Code, ASHRAE             |
| **Frozen Food Storage**      | `≤ -18°C`      | `> -15°C` (Warning)       | Codex Alimentarius CAC/RCP 1-1969      |
| **Pharma Medicines**         | `+2°C to +8°C` | `< 2°C` or `> 8°C`        | WHO Good Distribution Practices (GDP)  |
| **Blood Bank Refrigeration** | `+2°C to +6°C` | `< 2°C` or `> 6°C`        | WHO Blood Cold Chain Guidelines        |
| **Ice Cream Storage**        | `≤ -18°C`      | `> -15°C`                 | International Dairy Federation (IDF)   |

---

## 📄 License

This project is licensed under the [MIT License](file:///home/coredev/Documents/PlatformIO/Projects/ColdChain_Transmitter/LICENSE) - see the LICENSE file for details.
