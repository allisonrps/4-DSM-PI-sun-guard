import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AverageChart = ({ avgData }) => {
  const data = [
    { name: "Média", uv: avgData.uv, temperatura: avgData.temperatura, umidade: avgData.umidade },
  ];

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h2>Média dos Dados dos Sensores</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="uv" fill="#ff7f2a" name="UV" />
          <Bar dataKey="temperatura" fill="#ffcc00" name="Temperatura" />
          <Bar dataKey="umidade" fill="#000080" name="Umidade" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AverageChart;
