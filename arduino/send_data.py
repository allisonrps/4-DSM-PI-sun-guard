import serial
import requests
import time

# Conectar à porta serial do Arduino (ajuste conforme necessário para seu sistema)
arduino = serial.Serial('COM7', 9600)  # Para Windows, ou '/dev/ttyUSB0' para Linux/Mac
time.sleep(2)  # Espera a conexão estabilizar

# URL da API onde você deseja enviar os dados
url = 'https://sunguard-backend.vercel.app/sensors'

while True:
    if arduino.in_waiting > 0:
        # Lê dados do Arduino
        data = arduino.readline().decode('utf-8').strip()

        # Exemplo de dados: "Temperatura: 23.5, Umidade: 45, Intensidade UV: 0.75"
        print(f"Dados recebidos: {data}")
        
        # Extração de valores do dado recebido
        temp = float(data.split(",")[0].split(":")[1].strip())
        humidity = float(data.split(",")[1].split(":")[1].strip())
        uv_intensity = float(data.split(",")[2].split(":")[1].strip().split(" ")[0])

        # Formatar os dados para enviar como JSON para a API
        json_data = {
            'data': '2024-10-01T00:00:00.000Z',  # Use a data atual ou dinâmica
            'hora': '00:00',  # Formate a hora conforme necessário
            'uv': str(uv_intensity),
            'temperatura': str(temp),
            'umidade': str(humidity),
        }

        # Enviar dados via POST para a API
        response = requests.post(url, json=json_data)
        print(f"Status da resposta: {response.status_code}")
        
        # Aguardar antes de fazer outra requisição
        time.sleep(5)
