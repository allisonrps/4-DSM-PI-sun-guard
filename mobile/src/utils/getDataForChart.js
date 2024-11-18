const getDataForChart = (sensorData) => {
  return sensorData
    .sort((a, b) => new Date(a.hora) - new Date(b.hora)) // Ordena pela hora
    .map(item => ({
      hora: item.hora,
      uv: parseFloat(item.uv),
      temperatura: parseFloat(item.temperatura),
      umidade: parseFloat(item.umidade),
    }))
    .slice(-24); // Agora pega os últimos 24
};
