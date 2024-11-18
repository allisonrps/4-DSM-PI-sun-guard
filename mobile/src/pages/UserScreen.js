import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import { fetchUserData, fetchSensorData } from '../service/api';

const UserScreen = ({ route, navigation }) => {
  const { userId, userName } = route.params || {};

  if (!userId || !userName) {
    Alert.alert('Erro', 'Dados do usuário não encontrados.');
    return null;
  }

  const [user, setUser] = useState({
    nome: userName,
    fototipo: "",
    idade: 0,
  });

  const [sensorData, setSensorData] = useState(null);
  const [riskMessage, setRiskMessage] = useState("");
  const [riskStyle, setRiskStyle] = useState({});
  const [lastMeasurement, setLastMeasurement] = useState(""); // Para armazenar a data e hora da última medição

  useEffect(() => {
    const fetchUserAndSensorData = async () => {
      try {
        const responseUser = await fetchUserData(userId);
        if (responseUser && responseUser._id) {
          const userData = responseUser;
          const birthDate = new Date(userData.data_nascimento);
          const currentDate = new Date();

          let age = currentDate.getFullYear() - birthDate.getFullYear();
          const monthDifference = currentDate.getMonth() - birthDate.getMonth();
          const dayDifference = currentDate.getDate() - birthDate.getDate();
          if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
            age--;
          }

          setUser({
            nome: userData.nome,
            fototipo: userData.fototipo,
            idade: age,
          });

          const responseSensor = await fetchSensorData();
          if (responseSensor && responseSensor.length > 0) {
            const latestSensorData = responseSensor[responseSensor.length - 1];
            const { data, hora, uv, temperatura, umidade } = latestSensorData;

            // Atualiza o estado com os dados mais recentes do sensor
            setSensorData(latestSensorData);

            // Formata a data e hora da última medição
            const formattedDate = new Date(data).toLocaleDateString('pt-BR');  // Formato dd/mm/aaaa
            const formattedTime = hora;  // Já vem no formato correto HH:mm

            setLastMeasurement(`${formattedDate} às ${formattedTime}`);

            // Análise de risco baseado no fototipo e UV
            const uvLevel = parseFloat(uv);
            setRiskMessage(analyzeSkinRisk(userData.fototipo, uvLevel));
            setRiskStyle(getRiskStyle(uvLevel));
          } else {
            console.error('Dados do sensor não encontrados.');
            Alert.alert('Erro', 'Não foi possível carregar os dados do sensor.');
          }
        } else {
          Alert.alert('Erro', 'Usuário não encontrado.');
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        Alert.alert('Erro', 'Não foi possível carregar os dados.');
      }
    };

    fetchUserAndSensorData();
  }, [userId]);

  const analyzeSkinRisk = (fototipo, uvLevel) => {
    let risk = "Risco desconhecido";

    if (fototipo.includes("Tipo I")) {
      risk = uvLevel > 3 ? "Alto risco de queimadura" : uvLevel > 0 ? "Risco baixo" : "Sem risco";
    } else if (fototipo.includes("Tipo II")) {
      risk = uvLevel > 4 ? "Risco moderado" : uvLevel > 0 ? "Risco baixo" : "Sem risco";
    } else if (fototipo.includes("Tipo III")) {
      risk = uvLevel > 5 ? "Risco moderado" : uvLevel > 0 ? "Risco baixo" : "Sem risco";
    } else if (fototipo.includes("Tipo IV")) {
      risk = uvLevel > 6 ? "Risco baixo" : uvLevel > 0 ? "Risco muito baixo" : "Sem risco";
    } else if (fototipo.includes("Tipo V")) {
      risk = uvLevel > 7 ? "Risco muito baixo" : uvLevel > 0 ? "Risco muito baixo" : "Sem risco";
    } else if (fototipo.includes("Tipo VI")) {
      risk = uvLevel > 8 ? "Risco muito baixo" : uvLevel > 0 ? "Risco muito baixo" : "Sem risco";
    }

    return risk;
  };

  const getRiskStyle = (uvLevel) => {
    if (uvLevel <= 0) {
      return { backgroundColor: '#d2f5d2', color: '#2d7a2d' };
    } else if (uvLevel > 0 && uvLevel <= 3) {
      return { backgroundColor: '#f3e1a4', color: '#9b7b20' };
    } else if (uvLevel > 3 && uvLevel <= 5) {
      return { backgroundColor: '#f9c57e', color: '#d17e18' };
    } else if (uvLevel > 5 && uvLevel <= 7) {
      return { backgroundColor: '#f57d7d', color: '#b13c3c' };
    } else {
      return { backgroundColor: '#a2c7f0', color: '#316a94' };
    }
  };

  const getTemperatureStyle = (temp) => {
    if (temp <= 15) {
      return { backgroundColor: '#a2c7f0', color: '#316a94' }; // Frio
    } else if (temp > 15 && temp <= 25) {
      return { backgroundColor: '#d9e8a3', color: '#6e7e2e' }; // Temperatura amena
    } else {
      return { backgroundColor: '#f57d7d', color: '#b13c3c' }; // Quente
    }
  };

  const getHumidityStyle = (humidity) => {
    if (humidity < 30) {
      return { backgroundColor: '#f57d7d', color: '#b13c3c' }; // Baixa Umidade
    } else if (humidity >= 30 && humidity <= 60) {
      return { backgroundColor: '#d2f5d2', color: '#2d7a2d' }; // Normal
    } else {
      return { backgroundColor: '#f3e1a4', color: '#9b7b20' }; // Alta Umidade
    }
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const handleViewCharts = () => {
    navigation.navigate('Charts', { sensorData });
  };

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={require('../assets/logoSunGuard.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>{user.nome}</Text>
        <Text style={styles.userAge}>Idade: {user.idade} anos</Text>
        <Text style={styles.userFototipo}>Fototipo: {user.fototipo}</Text>
      </View>

      {/* Exibindo a última medição de data e hora */}
      {lastMeasurement && (
        <View style={styles.lastMeasurementContainer}>
          <Text style={styles.lastMeasurementText}>Última Medição: {lastMeasurement}</Text>
        </View>
      )}

      {sensorData && (
        <View style={styles.sensorDataWrapper}>
          <View style={styles.cardsContainer}>
            {/* Quadro de UV */}
            <View style={[styles.sensorDataContainer, riskStyle]}>
              <Text style={[styles.sensorTitle, { color: riskStyle.color }]}>UV</Text>
              <Text style={[styles.sensorData, { color: riskStyle.color }]}>Valor: {sensorData.uv}</Text>
              <Text style={[styles.riskMessage, { color: riskStyle.color }]}>{riskMessage}</Text>
            </View>

            {/* Quadro de Temperatura */}
            <View style={[styles.sensorDataContainer, getTemperatureStyle(sensorData.temperatura)]}>
              <Text style={[styles.sensorTitle, { color: getTemperatureStyle(sensorData.temperatura).color }]}>Temperatura</Text>
              <Text style={[styles.sensorData, { color: getTemperatureStyle(sensorData.temperatura).color }]}>{sensorData.temperatura} °C</Text>
            </View>

            {/* Quadro de Umidade */}
            <View style={[styles.sensorDataContainer, getHumidityStyle(sensorData.umidade)]}>
              <Text style={[styles.sensorTitle, { color: getHumidityStyle(sensorData.umidade).color }]}>Umidade</Text>
              <Text style={[styles.sensorData, { color: getHumidityStyle(sensorData.umidade).color }]}>{sensorData.umidade} %</Text>
            </View>
          </View>
        </View>
      )}

      {/* Botões de Logout e Ver Gráficos */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewChartsButton} onPress={handleViewCharts}>
          <Text style={styles.viewChartsButtonText}>Ver Gráficos</Text>
        </TouchableOpacity>
      </View>

      {/* Rodapé */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 SunGuard - Todos os direitos reservados</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff6e1',
    padding: 20,
  },
  logo: {
    width: 300,
    height: 100,
    marginBottom: 20,
    alignSelf: 'center',
  },
  userInfoContainer: {
    marginBottom: 10,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000080',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000080',
    textAlign: 'center',
  },
  userAge: {
    fontSize: 20,
    color: '#000080',
    textAlign: 'center',
  },
  userFototipo: {
    fontSize: 20,
    color: '#000080',
    textAlign: 'center',
  },
  lastMeasurementContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff6e1',
    borderRadius: 12,
    alignItems: 'center',
  },
  lastMeasurementText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000080',
  },
  sensorDataWrapper: {
    marginBottom: 10,
  },
  cardsContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  sensorDataContainer: {
    width: '100%',
    height: 160,
    padding: 18,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000080',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'center',
  },
  sensorTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sensorData: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
  },
  riskMessage: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#ff7f2a',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  viewChartsButton: {
    backgroundColor: '#FFcc00FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#000080',
    fontWeight: 'bold',
  },
  viewChartsButtonText: {
    color: '#000080',
    fontWeight: 'bold',
  },
  footer: {
    padding: 10,
    backgroundColor: '#f3f3f3',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#000080',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default UserScreen;
