#include <DHT.h>

// Configuração do sensor DHT11
#define DHTPIN 2        // Pino onde o DHT11 está conectado
#define DHTTYPE DHT11   // Tipo do sensor DHT
DHT dht(DHTPIN, DHTTYPE);

// Configuração do sensor GUVA S12D
#define UV_PIN A0       // Pino onde o GUVA S12D está conectado

// Defina um multiplicador para calibrar o índice UV
const float UV_MULTIPLICADOR = 1.5;  // Ajuste

void setup() {
  Serial.begin(9600);
  dht.begin();
  Serial.println("Iniciando leitura dos sensores...");
}

void loop() {
  // Leitura do sensor DHT11
  float temperatura = dht.readTemperature();
  float umidade = dht.readHumidity();

  // Leitura do sensor GUVA S12D
  int uvValue = analogRead(UV_PIN);
  float uvIntensity = (uvValue / 1023.0) * 5.0;  // Converte para tensão (0 a 5V)
  float uvIndex = uvIntensity * UV_MULTIPLICADOR;  // Aplica o multiplicador - índice UV

  // Exibe os dados no monitor serial
  if (isnan(temperatura) || isnan(umidade)) {
    Serial.println("Falha ao ler o sensor DHT11!");
  } else {
    Serial.print("Temperatura: ");
    Serial.print(temperatura);
    Serial.print(" °C, ");
    Serial.print("Umidade: ");
    Serial.print(umidade);
    Serial.print(" %, ");
  }

  Serial.print("Intensidade UV (tensão):  ");
  Serial.print(uvIntensity);
  Serial.print("V -> Índice UV estimado: ");
  Serial.println(uvIndex);

  // Aguarda 2 segundos antes de enviar os próximos dados
  delay(2000);
}
