#include <WiFi.h>
#include <DHT.h>
#include <ArduinoJson.h>

// Configuração do Wi-Fi
const char* ssid = "XD Fi";
const char* password = "meupalmeiras";

// Configuração do sensor DHT11
#define DHTPIN 2        // Pino onde o DHT11 está conectado
#define DHTTYPE DHT11   // Tipo do sensor DHT
DHT dht(DHTPIN, DHTTYPE);

// Configuração do sensor GUVA S12D
#define UV_PIN A0       // Pino onde o GUVA S12D está conectado

// URL da API para enviar os dados
const String url = "https://sunguard-backend.vercel.app/sensors";

// Defina um multiplicador para calibrar o índice UV
const float UV_MULTIPLICADOR = 1.5;  // Ajuste este valor conforme necessário

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  // Conectando ao Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando ao Wi-Fi...");
  }
  Serial.println("Conectado ao Wi-Fi!");
}

void loop() {
  // Leitura do sensor DHT11
  float temperatura = dht.readTemperature();
  float umidade = dht.readHumidity();

  // Leitura do sensor GUVA S12D
  int uvValue = analogRead(UV_PIN);
  float uvIntensity = (uvValue / 1023.0) * 5.0;  // Converte para tensão (0 a 5V)
  float uvIndex = uvIntensity * UV_MULTIPLICADOR;  // Aplica o multiplicador para estimar o índice UV

  // Enviando os dados para a API
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;

    http.begin(client, url);  // Conecta ao endpoint da API
    http.addHeader("Content-Type", "application/json");

    // Criando o JSON para enviar
    String jsonData = "{\"data\":\"2024-10-01T00:00:00.000Z\",\"hora\":\"00:00\",\"uv\":\"" + String(uvIndex) + "\",\"temperatura\":\"" + String(temperatura) + "\",\"umidade\":\"" + String(umidade) + "\"}";

    int httpResponseCode = http.PUT(jsonData);  // Envia os dados via POST

    Serial.print("Código da resposta HTTP: ");
    Serial.println(httpResponseCode);

    http.end();  // Finaliza a requisição
  } else {
    Serial.println("Falha ao conectar no Wi-Fi");
  }

  delay(5000);  // Aguardar 5 segundos antes de enviar novamente
}
