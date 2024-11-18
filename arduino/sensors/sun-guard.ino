#include <DHT.h>

// Configuração do sensor DHT11
#define DHTPIN 2        // Pino onde o DHT11 está conectado
#define DHTTYPE DHT11   // Tipo do sensor DHT
DHT dht(DHTPIN, DHTTYPE);

// Configuração do sensor DUVA S12D
#define UV_PIN A0       // Pino onde o GUVA S12D está conectado

void setup() {
  Serial.begin(9600);
  dht.begin();
  Serial.println("Iniciando leitura dos sensores...");
}

void loop() {
  // Leitura do sensor DHT11
  float temperatura = dht.readTemperature();
  float umidade = dht.readHumidity();

  // Leitura do sensor DUVA S12D
  int uvValue = analogRead(UV_PIN);
  float uvIntensity = (uvValue / 1023.0) * 5.0;  // Converte para tensão (0 a 5V)

  // Exibe os dados no monitor serial
  if (isnan(temperatura) || isnan(umidade)) {
    Serial.println("Falha ao ler o sensor DHT11!");
  } else {
    Serial.print("Temperatura: ");
    Serial.print(temperatura);
    Serial.println(" °C");

    Serial.print("Umidade: ");
    Serial.print(umidade);
    Serial.println(" %");
  }

  Serial.print("Intensidade UV (tensão): ");
  Serial.print(uvIntensity);
  Serial.println(" V");

  delay(2000);  // Aguarda 2 segundos antes da próxima leitura
}

