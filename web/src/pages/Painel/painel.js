import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Necessário para o Chart.js
import styles from "./Painel.module.css";
import { useNavigate } from "react-router-dom";

const ChartsScreen = () => {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getSensorData = async () => {
      try {
        const response = await axios.get(
          "https://sunguard-backend.vercel.app/sensors"
        );

        const sortedData = response.data
          .sort((a, b) => new Date(b.data) - new Date(a.data))
          .slice(0, 10);

        setSensorData(sortedData);
        setLoading(false);
      } catch (err) {
        setError("Erro ao buscar dados.");
        setLoading(false);
      }
    };

    getSensorData();
  }, []);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Preparar dados para os gráficos
  const labels = sensorData.map((data) => data.hora);
  const uvData = sensorData.map((data) => parseFloat(data.uv));
  const temperaturaData = sensorData.map((data) =>
    parseFloat(data.temperatura)
  );
  const umidadeData = sensorData.map((data) => parseInt(data.umidade, 10));

  const createChartData = (label, data, borderColor, backgroundColor) => ({
    labels,
    datasets: [
      {
        label,
        data,
        borderColor,
        backgroundColor,
        borderWidth: 2,
        fill: true,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Permite ajustar altura e largura dentro do contêiner
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Hora",
        },
      },
      y: {
        title: {
          display: true,
          text: "Valores",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={styles.charts}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gráficos de Dados dos Sensores</h1>
        <button className={styles.button2} onClick={() => navigate("/Perfil")}>
          Voltar
        </button>
      </div>

      <div className={styles.gridContainer}>
        {/* Gráfico de UV */}
        <div className={styles.chartWrapper}>
          <h2>UV</h2>
          <Line
            data={createChartData(
              "UV",
              uvData,
              "rgba(255, 0, 0, 1)",
              "rgba(255, 0, 0, 0.3)"
            )}
            options={chartOptions}
          />
        </div>

        {/* Gráfico de Temperatura */}
        <div className={styles.chartWrapper}>
          <h2>Temperatura</h2>
          <Line
            data={createChartData(
              "Temperatura",
              temperaturaData,
              "rgba(0, 128, 0, 1)",
              "rgba(0, 128, 0, 0.3)"
            )}
            options={chartOptions}
          />
        </div>

        {/* Gráfico de Umidade */}
        <div className={styles.chartWrapper}>
          <h2>Umidade</h2>
          <Line
            data={createChartData(
              "Umidade",
              umidadeData,
              "rgba(0, 0, 128, 1)",
              "rgba(0, 0, 128, 0.3)"
            )}
            options={chartOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartsScreen;
