// PostsPerfil.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import AverageChart from "./AverageChart";
import styles from "./grafico.module.css";

const Grafico = () => {
  const [avgData, setAvgData] = useState({});
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://sunguard-backend.vercel.app/sensors");
      const sortedData = response.data
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 10);
      
      setData(sortedData);

      const avgData = {
        uv: sortedData.reduce((sum, item) => sum + item.uv, 0) / sortedData.length,
        temperatura: sortedData.reduce((sum, item) => sum + item.temperatura, 0) / sortedData.length,
        umidade: sortedData.reduce((sum, item) => sum + item.umidade, 0) / sortedData.length,
      };
      setAvgData(avgData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.ContainerMestre}>
      <h1>Perfil</h1>
      <AverageChart avgData={avgData} />
    </div>
  );
};

export default Grafico;
