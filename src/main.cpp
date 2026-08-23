#include "Arduino.h"
#include "WiFi.h"
#include "WebServer.h"
#include "LittleFS.h"
#include "OneWire.h"
#include "DallasTemperature.h"
#include "ArduinoJson.h"

const char *ssid = "Realme 11 5G(Rithik)";
const char *password = "1234567890";

const int oneWireBus = 4;
const int ledPin = 22;

OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);
WebServer server(80);

const int MAX_HISTORY = 30;
float tempHistory[MAX_HISTORY];
int historyIndex = 0;
int totalReadings = 0;

// Default to Vaccine Storage Thresholds
float currentMin = 2.0;
float currentMax = 8.0;

unsigned long lastReadTime = 0;
const unsigned long readInterval = 5000;

void handleAPI()
{
  StaticJsonDocument<1024> doc;
  float currentTemp = sensors.getTempCByIndex(0);
  doc["current"] = currentTemp;

  JsonArray histArray = doc.createNestedArray("history");
  int count = min(totalReadings, MAX_HISTORY);

  for (int i = 0; i < count; i++)
  {
    int idx = (totalReadings >= MAX_HISTORY) ? (historyIndex + i) % MAX_HISTORY : i;
    histArray.add(tempHistory[idx]);
  }

  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}

// New Endpoint: Receives threshold updates from the Web UI
void handleSetThreshold()
{
  if (server.hasArg("min") && server.hasArg("max"))
  {
    currentMin = server.arg("min").toFloat();
    currentMax = server.arg("max").toFloat();
    Serial.printf("New Thresholds Set - Min: %.2f, Max: %.2f\n", currentMin, currentMax);
    server.send(200, "text/plain", "OK");
  }
  else
  {
    server.send(400, "text/plain", "Bad Request");
  }
}

void setup()
{
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  if (!LittleFS.begin(true))
  {
    Serial.println("An Error has occurred while mounting LittleFS");
    return;
  }
  pinMode(oneWireBus, INPUT_PULLUP);
  sensors.begin();
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.print("\nWeb Server IP Address: ");
  Serial.println(WiFi.localIP());

  server.on("/", HTTP_GET, []()
            {
    server.sendHeader("Connection", "close");
    File file = LittleFS.open("/index.html", "r");
    server.streamFile(file, "text/html");
    file.close(); });

  server.on("/style.css", HTTP_GET, []()
            {
    server.sendHeader("Connection", "close");
    File file = LittleFS.open("/style.css", "r");
    server.streamFile(file, "text/css");
    file.close(); });

  server.on("/script.js", HTTP_GET, []()
            {
    server.sendHeader("Connection", "close");
    File file = LittleFS.open("/script.js", "r");
    server.streamFile(file, "application/javascript");
    file.close(); });

  server.on("/api/data", HTTP_GET, handleAPI);
  server.on("/api/setThreshold", HTTP_POST, handleSetThreshold);

  Serial.println("--- Files in LittleFS ---");
  File root = LittleFS.open("/");
  File file = root.openNextFile();
  while (file)
  {
    Serial.print("Found File: ");
    Serial.println(file.name());
    file = root.openNextFile();
  }
  Serial.println("-------------------------");

  server.begin();
}

void loop()
{
  server.handleClient();

  if (millis() - lastReadTime >= readInterval)
  {
    lastReadTime = millis();
    sensors.requestTemperatures();
    float temp = sensors.getTempCByIndex(0);

    if (temp != DEVICE_DISCONNECTED_C)
    {
      // --- ADDED THESE LINES TO PRINT TO SERIAL MONITOR ---
      Serial.print("Current Temperature: ");
      Serial.print(temp);
      Serial.println(" °C");
      // ----------------------------------------------------

      tempHistory[historyIndex] = temp;
      historyIndex = (historyIndex + 1) % MAX_HISTORY;
      totalReadings++;

      // Dynamic LED Alarm Logic (Triggers if too hot OR too cold)
      if (temp < currentMin || temp > currentMax)
      {
        digitalWrite(ledPin, HIGH);
      }
      else
      {
        digitalWrite(ledPin, LOW);
      }
    }
    else
    {
      // --- ADDED THIS ERROR MESSAGE FOR DEBUGGING ---
      Serial.println("Error: Could not read temperature data (-127.00). Check sensor wiring!");
    }
  }
}
