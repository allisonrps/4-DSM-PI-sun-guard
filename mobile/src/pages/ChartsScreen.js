import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { fetchSensorData } from '../service/api.js';  // Ajuste o caminho conforme necessário
import { LineChart, BarChart } from 'react-native-chart-kit';  // Mantendo o gráfico de linha e barra

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

  // Função para calcular a média de um array de números
  const calcularMedia = (dados) => {
    const soma = dados.reduce((acc, valor) => acc + valor, 0);
    return soma / dados.length;
  };

  // Função para calcular o desvio padrão de um array de números
  const calcularDesvioPadrao = (dados) => {
    const media = calcularMedia(dados);
    const variancia = dados.reduce((acc, valor) => acc + Math.pow(valor - media, 2), 0) / dados.length;
    return Math.sqrt(variancia);
  };

  // Calcular as médias e os desvios padrões
  const mediaUV = calcularMedia(uvData);
  const mediaTemperatura = calcularMedia(temperaturaData);
  const mediaUmidade = calcularMedia(umidadeData);
  const desvioPadraoUV = calcularDesvioPadrao(uvData);
  const desvioPadraoTemperatura = calcularDesvioPadrao(temperaturaData);
  const desvioPadraoUmidade = calcularDesvioPadrao(umidadeData);

  // Dados do gráfico de barras para o desvio padrão
  const desvioPadraoBarChartData = {
    labels: ['UV', 'Temperatura', 'Umidade'],
    datasets: [
      {
        data: [desvioPadraoUV, desvioPadraoTemperatura, desvioPadraoUmidade],
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,  // Cor das barras
      },
    ],
  };

  // Dados para o gráfico de correlação entre Temperatura e Umidade (Gráfico de Dispersão Simulado)
  const correlationChartData = {
    labels: temperaturaData.map((_, index) => index + 1),  // Número de amostras
    datasets: [
      {
        data: umidadeData, // Umidade como valores do eixo Y
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,  // Cor azul para umidade
        strokeWidth: 2,
      },
    ],
  };

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
            data={{
              labels: uvData.map((_, index) => index + 1),
              datasets: [
                {
                  data: uvData,
                  color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,  // Cor vermelha para UV
                  strokeWidth: 2,
                },
              ],
            }}
            width={360} // Largura do gráfico
            height={300} // Altura do gráfico
            chartConfig={chartConfig}
            bezier
            style={[styles.chart, styles.chartWithBorder]}  // Borda amarela
            withHorizontalLabels={true}
            withVerticalLabels={true}
            fromZero={true}
            xAxisLabelRotation={-45}  // Rota 45 graus para melhorar a legibilidade
            yAxisSuffix="°C"
            xAxisInterval={2}  // Exibe uma label a cada 2 dados
          />
          <Text style={styles.averageText}>Média de UV: {mediaUV.toFixed(2)}</Text>
        </View>

        {/* Gráfico de Temperatura */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Temperatura</Text>
          <LineChart
            data={{
              labels: temperaturaData.map((_, index) => index + 1),
              datasets: [
                {
                  data: temperaturaData,
                  color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,  // Cor verde para Temperatura
                  strokeWidth: 2,
                },
              ],
            }}
            width={360} // Largura do gráfico
            height={300} // Altura do gráfico
            chartConfig={chartConfig}
            bezier
            style={[styles.chart, styles.chartWithBorder]}  // Borda amarela
            withHorizontalLabels={true}
            withVerticalLabels={true}
            fromZero={true}
            xAxisLabelRotation={-45}  // Rota 45 graus para melhorar a legibilidade
            yAxisSuffix="°C"
            xAxisInterval={2}  // Exibe uma label a cada 2 dados
          />
          <Text style={styles.averageText}>Média de Temperatura: {mediaTemperatura.toFixed(2)}</Text>
        </View>

        {/* Gráfico de Umidade */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Umidade</Text>
          <LineChart
            data={{
              labels: umidadeData.map((_, index) => index + 1),
              datasets: [
                {
                  data: umidadeData,
                  color: (opacity = 1) => `rgba(0, 0, 128, ${opacity})`,  // Cor azul para Umidade
                  strokeWidth: 2,
                },
              ],
            }}
            width={360} // Largura do gráfico
            height={300} // Altura do gráfico
            chartConfig={chartConfig}
            bezier
            style={[styles.chart, styles.chartWithBorder]}  // Borda amarela
            withHorizontalLabels={true}
            withVerticalLabels={true}
            fromZero={true}
            xAxisLabelRotation={-45}  // Rota 45 graus para melhorar a legibilidade
            yAxisSuffix="%"
            xAxisInterval={2}  // Exibe uma label a cada 2 dados
          />
          <Text style={styles.averageText}>Média de Umidade: {mediaUmidade.toFixed(2)}</Text>
        </View>

        {/* Gráfico de Correlação (Temperatura x Umidade) */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Correlação entre Temperatura e Umidade</Text>
          <LineChart
            data={correlationChartData}  // Dados para o gráfico de correlação
            width={360} // Largura do gráfico
            height={300} // Altura do gráfico
            chartConfig={chartConfig}
            bezier
            style={[styles.chart, styles.chartWithBorder]}  // Borda amarela
            withHorizontalLabels={true}
            withVerticalLabels={true}
            fromZero={true}
            xAxisLabelRotation={-45}  // Rota 45 graus para melhorar a legibilidade
            yAxisSuffix="%"
            xAxisInterval={2}  // Exibe uma label a cada 2 dados
          />
        </View>

        {/* Gráfico de Desvio Padrão */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Desvio Padrão</Text>
          <BarChart
            data={desvioPadraoBarChartData}
            width={360}  // Largura do gráfico
            height={300}  // Altura do gráfico
            chartConfig={chartConfig}
            style={[styles.chart, styles.chartWithBorder]}  // Borda amarela
          />
          <Text style={styles.averageText}>Desvio Padrão UV: {desvioPadraoUV.toFixed(2)}</Text>
          <Text style={styles.averageText}>Desvio Padrão Temperatura: {desvioPadraoTemperatura.toFixed(2)}</Text>
          <Text style={styles.averageText}>Desvio Padrão Umidade: {desvioPadraoUmidade.toFixed(2)}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff6f2ff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000080ff',
  },
  chartContainer: {
    borderWidth: 3,
    borderColor: '#ffcc00ff',
    borderRadius: 16,
    marginBottom: 20,
  },
  chart: {
    marginVertical: 20,
    borderRadius: 16,
  },
  chartWithBorder: {
    borderColor: '#ffcc00ff',
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000080ff',
    textAlign: 'center',
    marginBottom: 10,
  },
  averageText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000080ff',
    marginBottom: 10,
  },
});

export default ChartsScreen;