/*
	Esp32 Websockets Client

	This sketch:
        1. Connects to a WiFi network
        2. Connects to a Websockets server
        3. Sends the websockets server a message ("Hello Server")
        4. Prints all incoming messages while the connection is open

	Hardware:
        For this sketch you only need an ESP32 board.

	Created 15/02/2019
	By Gil Maimon
	https://github.com/gilmaimon/ArduinoWebsockets

*/

#include <ArduinoWebsockets.h>
#include <WiFi.h>
#include "FastLED.h"

#define NUM_LEDS 1024
#define DATA_PIN 13

CRGB leds[NUM_LEDS];

const char* ssid = "AGA_slow"; //Enter SSID
const char* password = "enchanter"; //Enter Password
const char* websockets_server_host = "188.225.60.209"; //Enter server adress
const uint16_t websockets_server_port = 81; // Enter server port
bool canNextMessage = 1;
int jj = 0;

using namespace websockets;

void onMessageCallback(WebsocketsMessage message) {
  Serial.println(jj++);

  char *str;
  const char* conststr;
  String tmp = message.data();
  conststr = tmp.c_str();
  char *my_str = strdup(conststr);
  char *variable_to_free = my_str;


  if (!my_str) {
    return;
  }

  for (int i = 0; i < 1024; i++) {
    str = strtok_r(my_str, "a", &my_str);

    char* rgb;
    char* xzxz = str;
    int r;
    int g;
    int b;

    for (int j = 0; j < 3; j++) {
      rgb = strtok_r(xzxz, ",", &xzxz);
      
      if (j == 0) {
        r = atoi(rgb);
      }
      if (j == 1) {
        g = atoi(rgb);
      }
      if (j == 2) {
        b = atoi(rgb);
      }
    }

    leds[i] = CRGB(r,g,b);
  }

  FastLED.show();
  canNextMessage = 1;
  free(variable_to_free);
}

WebsocketsClient client;

void setup() {
    Serial.begin(115200);
    // Connect to wifi
    WiFi.begin(ssid, password);

    // Wait some time to connect to wifi
    for(int i = 0; i < 10 && WiFi.status() != WL_CONNECTED; i++) {
        Serial.print(".");
        delay(1000);
    }

    // Check if connected to wifi
    if(WiFi.status() != WL_CONNECTED) {
        Serial.println("No Wifi!");
        return;
    }

    Serial.println("Connected to Wifi, Connecting to server.");
    // try to connect to Websockets server
    bool connected = client.connect(websockets_server_host, websockets_server_port, "/");
    if(connected) {
        Serial.println("Connected!");
        client.send("Hello Server");
    } else {
        Serial.println("Not Connected!");
    }
    
    // run callback when messages are received
    client.onMessage(onMessageCallback);

    delay(2000);
    FastLED.addLeds<WS2812B, DATA_PIN, GRB>(leds, NUM_LEDS);
}

void loop() {
    if(client.available() && canNextMessage == 1) {
        client.poll();
    } else {
      Serial.println("clientNOT");
    }

    delay(250);
}