import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../styles';
import { register } from '../service/api'; // Certifique-se de que o caminho de importação está correto

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [fototipo, setFototipo] = useState('');
  const [password, setPassword] = useState('');

  const fototipos = [
    "Tipo I - Muito Claro",
    "Tipo II - Claro",
    "Tipo III - Moreno Claro",
    "Tipo IV - Moreno",
    "Tipo V - Moreno Escuro",
    "Tipo VI - Negro"
  ];

  // Função para converter a data de nascimento para o formato ISO
  const convertDateToISO = (dateString) => {
    const date = new Date(dateString);
    console.log("Data criada a partir da string:", date);
    return date.toISOString(); // Converte para o formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ)
  };
  

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex para verificar o formato YYYY-MM-DD
    return regex.test(dateString);
  };
  
  const handleRegister = async () => {
    if (!name || !email || !dataNascimento || !fototipo || !password) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }
  
    if (!isValidDate(dataNascimento)) {
      Alert.alert('Erro', 'Data de nascimento inválida. Use o formato YYYY-MM-DD.');
      return;
    }
  
    const formattedDataNascimento = convertDateToISO(dataNascimento);
  
    console.log("Data formatada para envio:", formattedDataNascimento);
  
    try {
      const response = await register({
        name,
        email,
        dataNascimento: formattedDataNascimento,
        fototipo,
        password,
      });
  
      if (response && response.message === 'Usuário criado com sucesso!') {
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erro', 'Erro no cadastro: ' + (response.message || 'Erro desconhecido.'));
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário', error);
      Alert.alert('Erro', 'Não foi possível cadastrar o usuário. Tente novamente.');
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuário</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento (YYYY-MM-DD)"
        value={dataNascimento}
        onChangeText={setDataNascimento}
      />
      
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={fototipo}
          onValueChange={(itemValue) => setFototipo(itemValue)}
          dropdownIconColor="#000080"
        >
          <Picker.Item label="Selecione o fototipo" value="" />
          {fototipos.map((type, index) => (
            <Picker.Item key={index} label={type} value={type} />
          ))}
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;
