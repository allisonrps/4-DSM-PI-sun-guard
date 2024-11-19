import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Perfil.module.css";
import logo from "../../assets/logo.png";
import { parseISO, compareDesc } from "date-fns";

const PostsPerfil = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const carregarUsuarioLogado = async () => {
    try {
      const response = await axios.get(
        "https://sunguard-backend.vercel.app/usuarios"
      );
      const emailLogado = localStorage.getItem("userEmail");
      const usuarioLogado = response.data.find(
        (user) => user.email === emailLogado
      );
      setUser(usuarioLogado);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://sunguard-backend.vercel.app/sensors"
      );

      const sortedData = response.data
        .sort((a, b) => compareDesc(parseISO(b.data), parseISO(a.data)))
        .slice(0, 3);

      if (JSON.stringify(sortedData) !== JSON.stringify(data)) {
        setData(sortedData);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    carregarUsuarioLogado();
    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.ContainerMestre}>
      <div className={styles.container}>
        <div className={styles.titulo}>
          <h1>Perfil</h1>
          <img className={styles.logo} src={logo} alt="Logo" />
          <div className={styles.buttons}>
            <div className={styles.actionButtons}>
              <button
                className={styles.button2}
                onClick={() => navigate("/Painel")}
              >
                Ver Mais Gráficos
              </button>
              <button
                className={styles.button2}
                onClick={() => navigate("/DashboardEstatistica")}
              >
                Estatística Completa
              </button>
            </div>
            <button
              className={`${styles.button} ${styles.logoutButton}`}
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        </div>

        <div className={styles.infos}>
          {user ? (
            <div>
              <h3>{user.nome}</h3>
              <p>Email: {user.email}</p>
              <p>Fototipo: {user.fototipo}</p>
            </div>
          ) : (
            <p>Carregando dados do usuário...</p>
          )}
        </div>
      </div>

      <h1>Dados dos Sensores e Recomendações de Proteção Solar</h1>
      <div className={styles.containerCards}>
        {data.map((item) => (
         <div key={item._id} className={styles.card}>
         <p><span>Data:</span> <span className={styles.value}>{new Date(item.data).toLocaleDateString()}</span></p>
         <p><span>Hora:</span> <span className={styles.value}>{item.hora}</span></p>
         <p><span>UV:</span> <span className={styles.value}>{item.uv}</span></p>
         <p><span>Temperatura:</span> <span className={styles.value}>{item.temperatura}°C</span></p>
         <p><span>Umidade:</span> <span className={styles.value}>{item.umidade}%</span></p>
         <p className={styles.recommendation}>
           Recomendação: {avaliarProtecaoUV(user?.fototipo, item.uv)}
         </p>
       </div>
       
        ))}
      </div>
    </div>
  );
};

const numeroFototipo = (fototipo) => {
  if (fototipo === "Muito Claro") return 1;
  if (fototipo === "Claro") return 2;
  if (fototipo === "Moreno Claro") return 3;
  if (fototipo === "Moreno") return 4;
  if (fototipo === "Moreno Escuro") return 5;
  return 6;
};

const avaliarProtecaoUV = (fototipo, valorUV) => {
  const numero = numeroFototipo(fototipo);
  if (valorUV <= 2) return "Baixo risco. Proteção mínima necessária.";
  if (valorUV <= 5)
    return "Risco moderado. Use óculos de sol e protetor solar.";
  if (valorUV <= 7)
    return "Risco alto. Use protetor solar, óculos de sol e evite exposição prolongada.";
  if (valorUV <= 10)
    return "Risco muito alto. Evite exposição ao sol entre 10h e 16h.";
  return "Risco extremo. Evite o sol, use proteção máxima.";
};

export default PostsPerfil;
