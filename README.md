<div align="center">
  <h1>🧊 Smart Cold Chain Temperature Monitor</h1>
  <p>An IoT-based long-range temperature tracking system using ESP32 and UART RF transceivers.</p>
  
  <!-- Tool Icons -->
  <img src="https://img.shields.io/badge/C%2B%2B-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white" alt="C++" />
  <img src="https://img.shields.io/badge/PlatformIO-F9A31B?style=for-the-badge&logo=PlatformIO&logoColor=white" alt="PlatformIO" />
  <img src="https://img.shields.io/badge/Espressif-E7352C?style=for-the-badge&logo=espressif&logoColor=white" alt="ESP32" />
  <img src="https://img.shields.io/badge/VS_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white" alt="VS Code" />
</div>

## 🌟 Project Overview & Features

This project provides an affordable, long-range monitoring solution for cold storage facilities, vaccine refrigerators, and food warehouses where standard Wi-Fi is unavailable or unreliable.

- **Long-Range Transmission:** Utilizes the XL32-232AP1 433MHz module to broadcast data over long distances.
- **High Precision:** Uses the DS18B20 1-Wire digital sensor for highly accurate ambient thermal readings.
- **Automated Alerts:** Generates automatic payload warnings whenever temperatures exceed the predefined 8.0°C threshold.

## 📂 Project Structure

This repository follows the standard PlatformIO directory structure:

```text
├── .pio/               # Auto-generated PlatformIO build environment files
├── include/            # Custom C++ header files (.h)
├── lib/                # Project-specific private libraries
├── src/
│   └── main.cpp        # Main application source code for the node
├── .gitignore          # Git ignore rules for build artifacts
├── platformio.ini      # PlatformIO configuration & dependency management
└── README.md           # Project documentation
```

## 🛠️ Hardware Requirements

| Component           | Function                     | Qty |
| :------------------ | :--------------------------- | :-: |
| **ESP32 Dev Board** | System Microcontroller       |  2  |
| **DS18B20**         | 1-Wire Temperature Sensor    |  1  |
| **XL32-232AP1**     | 433MHz UART Transceiver      |  2  |
| **4.7kΩ Resistor**  | Pull-up resistor for DS18B20 |  1  |

## 🔌 Wiring & Assembly

> **Warning:** Ensure your ESP32 is completely disconnected from USB power before making any hardware connections.

**1. DS18B20 Sensor Wiring**
Connect `VCC` to the ESP32 `3.3V` pin, `GND` to `GND`, and `DATA` to `GPIO 4`. You must place the 4.7kΩ resistor bridging the `VCC` and `DATA` wires to ensure the 1-Wire protocol functions correctly.

**2. XL32-232AP1 Module Wiring**
Connect `VCC` to the ESP32 `3.3V` (or 5V, depending on your specific module), and `GND` to `GND`. For UART communication, connect the module's `TX` pin to ESP32 `GPIO 16` (RX2), and the `RX` pin to ESP32 `GPIO 17` (TX2).

## 🚀 Setup with PlatformIO

1. Clone this repository to your local machine and open the directory in **Visual Studio Code**.
2. Ensure the **PlatformIO** extension is installed.
3. Connect your Transmitter Node ESP32 to your computer via USB.
4. Click the **Build** (✓) icon in the bottom status bar. PlatformIO will automatically read the `platformio.ini` file and download the required `OneWire` and `DallasTemperature` dependencies.
5. Click the **Upload** (→) icon to flash the firmware, then open the **Serial Monitor** (plug icon) at `115200` baud to view the live temperature broadcasts.

---

## Data Payload Format

The transmitter continuously evaluates the temperature against a predefined threshold (default: 8.0°C). Data is broadcast sequentially via UART in the following format:
`NODE_1,TEMP:[Value],ALERT:[Status]`
