import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { fetchSensorData } from '../service/api.js';  // Ajuste o caminho conforme necessário
import { LineChart } from 'react-native-chart-kit'; // Exemplo de gráfico com ChartKit

const ChartsScreen = () => {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar os dados do sensor
  useEffect(() => {
    const getSensorData = async () => {
      try {
        console.log("Iniciando a busca dos dados...");
        const response = await fetchSensorData();  // Busca os dados do sensor
        console.log("Dados do sensor recebidos:", response);  // Verifique a resposta

        if (response && response.length > 0) {
          // Limita para os últimos 10 dados
          const latestData = response.slice(-10);  // Pega os últimos 10 dados
          console.log("Últimos 10 dados:", latestData);  // Verifique os últimos 10 dados
          setSensorData(latestData);  // Armazena os últimos 10 dados
        } else {
          console.log("Não há dados suficientes no backend");
          setError("Não há dados suficientes.");
        }

        setLoading(false);  // Desativa o carregamento
      } catch (err) {
        console.error('Erro ao buscar dados do sensor:', err);  // Log de erro
        setError('Erro ao buscar dados do sensor');
        setLoading(false);  // Desativa o carregamento em caso de erro
      }
    };

    getSensorData();
  }, []);

  // Se os dados ainda estiverem carregando
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Se ocorrer um erro
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  // Se os dados forem carregados corretamente, organiza os dados para o gráfico
  const uvData = sensorData.map((data) => parseFloat(data.uv));
  const temperaturaData = sensorData.map((data) => parseFloat(data.temperatura));
  const umidadeData = sensorData.map((data) => parseInt(data.umidade, 10));

  // Função para configurar os gráficos
  const getChartConfig = (label, color) => ({
    labels: sensorData.map((data) => data.hora),  // Usando a hora como rótulo no eixo X
    datasets: [
      {
        data: label,
        color: (opacity = 1) => color(opacity),  // Cor dinâmica para cada gráfico
        strokeWidth: 3,
      },
    ],
  });

  // Configuração comum dos gráficos
  const chartConfig = {
    backgroundGradientFrom: '#fff6f2ff', // Cor de fundo do gráfico (rosa claro)
    backgroundGradientTo: '#fff6f2ff',
    decimalPlaces: 1,  // Número de casas decimais
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,  // Cor do texto
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Gráficos de Dados dos Sensores</Text>

        {/* Gráfico de UV */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Nível de UV</Text>
          <LineChart
            data={getChartConfig(uvData, (opacity) => `rgba(255, 0, 0, ${opacity})`)}  // Cor vermelha para UV
            width={360} // Largura do gráfico
            height={300} // Altura do gráfico
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            fromZero={true}
            xAxisLabelRotation={-45}  // Rota 45 graus para melhorar a legibilidade
            yAxisSuffix="°C"
            xAxisInterval={2}  // Exibe uma label a cada 2 dados
          />
        </View>

        {/* Gráfico de Temperatura */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Temperatura</Text>
          <LineChart
            data={getChartConfig(temperaturaData, (opacity) => `rgba(0, 128, 0, ${opacity})`)}  // Cor verde para Temperatura
            width={360} // Largura do gráfico
            height={300} // Altura do gráfico
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            fromZero={true}
            xAxisLabelRotation={-45}  // Rota 45 graus para melhorar a legibilidade
            yAxisSuffix="°C"
            xAxisInterval={2}  // Exibe uma label a cada 2 dados
          />
        </View>

        {/* Gráfico de Umidade */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Umidade</Text>
          <LineChart
            data={getChartConfig(umidadeData, (opacity) => `rgba(0, 0, 128, ${opacity})`)}  // Cor azul para Umidade
            width={360} // Largura do gráfico
            height={300} // Altura do gráfico
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            fromZero={true}
            xAxisLabelRotation={-45}  // Rota 45 graus para melhorar a legibilidade
            yAxisSuffix="%"
            xAxisInterval={2}  // Exibe uma label a cada 2 dados
          />
        </View>
      </ScrollView>

      {/* Rodapé com a legenda */}
      <View style={styles.footer}>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColorBox, { backgroundColor: 'rgba(255, 0, 0, 1)' }]} />
            <Text style={styles.legendText}>UV</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColorBox, { backgroundColor: 'rgba(0, 128, 0, 1)' }]} />
            <Text style={styles.legendText}>Temperatura</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColorBox, { backgroundColor: 'rgba(0, 0, 128, 1)' }]} />
            <Text style={styles.legendText}>Umidade</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff6f2ff',  // Cor de fundo geral da tela (rosa claro)
  },
  scrollContainer: {
    flexGrow: 1,  // Permite que o conteúdo da ScrollView ocupe o máximo de espaço disponível
    padding: 20,
    paddingBottom: 80,  // Garantir que o conteúdo não sobreponha o rodapé
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000080ff',  // Cor do título (azul)
  },
  chartContainer: {
    borderWidth: 3,  // Borda ao redor do gráfico
    borderColor: '#ffcc00ff',  // Cor da borda (amarelo)
    borderRadius: 16,
    marginBottom: 20,  // Espaçamento abaixo do gráfico
  },
  chart: {
    marginVertical: 20,
    borderRadius: 16,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000080ff',
    textAlign: 'center',
    marginBottom: 10,
  },
  footer: {
    backgroundColor: '#fff6f2ff',
    padding: 20,
    borderTopWidth: 2,
    borderTopColor: '#ccc',
    justifyContent: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  legendColorBox: {
    width: 20,
    height: 20,
    marginRight: 8,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 16,
  },
});

export default ChartsScreen;
