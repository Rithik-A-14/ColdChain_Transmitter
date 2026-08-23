# Smart Cold Chain Temperature Monitoring System

## Overview

This IoT system is designed to continuously monitor ambient temperatures in cold storage facilities, vaccine refrigerators, and remote agricultural warehouses. By utilizing an ESP32 and an XL32-232AP1 433MHz UART module, this project provides a long-range, cost-effective monitoring solution for environments where standard Wi-Fi connectivity is unavailable or unreliable.

The system utilizes sensing nodes that periodically transmit temperature data and trigger automatic alerts when predetermined thermal limits are exceeded, preventing the spoilage of temperature-sensitive products.

## Hardware Components

- **Microcontroller:** ESP32 Development Board (e.g., XX5R69)
- **Temperature Sensor:** DS18B20 (1-Wire Digital Thermometer)
- **Wireless Transceiver:** XL32-232AP1 (433MHz UART RF Module)
- **Resistor:** 4.7kΩ (Crucial pull-up resistor for the DS18B20 data line)
- **Miscellaneous:** Breadboard, jumper wires, and 5V USB power supply

## Wiring Guide

### 1. DS18B20 Temperature Sensor

| DS18B20 Pin | ESP32 Pin | Notes                                                      |
| :---------- | :-------- | :--------------------------------------------------------- |
| VCC         | 3.3V      |                                                            |
| GND         | GND       |                                                            |
| DATA        | GPIO 4    | **Important:** Place a 4.7kΩ resistor between VCC and DATA |

### 2. XL32-232AP1 Transceiver Node

| XL32 Pin | ESP32 Pin     | Notes                                       |
| :------- | :------------ | :------------------------------------------ |
| VCC      | 3.3V / 5V     | Check module datasheet for specific voltage |
| GND      | GND           |                                             |
| TX       | GPIO 16 (RX2) | Hardware Serial 2                           |
| RX       | GPIO 17 (TX2) | Hardware Serial 2                           |

## Software & Dependencies

This project is built using **PlatformIO** via Visual Studio Code. The required libraries are automatically managed via the `platformio.ini` file.

**Required Libraries:**

- `paulstoffregen/OneWire @ ^2.3.8`
- `milesburton/DallasTemperature @ ^3.11.0`

## Installation and Usage

1. Clone this repository to your local machine.
2. Open the project folder in VS Code with the PlatformIO extension installed.
3. Allow PlatformIO to initialize and download the required board frameworks and libraries.
4. Ensure your ESP32 is connected via USB.
5. Click **Build** to compile the code, then click **Upload** to flash it to the ESP32.
6. Open the **Serial Monitor** (set to `115200` baud) to view the live temperature readings and payload broadcasts.

## Project Structure

```text
├── src/
│   └── main.cpp           # Main application code for the transmitter node
├── platformio.ini         # PlatformIO configuration and library dependencies
└── README.md              # Project documentation
```
