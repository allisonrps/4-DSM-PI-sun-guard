import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { login } from '../service/api'; // Importa a função de login
import styles from '../styles'; // Mantém os estilos gerais

const LoginScreen = ({ navigation }) => {
  const [loginInput, setLoginInput] = useState(''); // Alterado de 'email' para 'loginInput'
  const [password, setPassword] = useState('');
  const [loginInputFocused, setLoginInputFocused] = useState(false); // Alterado de 'emailFocused' para 'loginInputFocused'
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!loginInput || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
  
    try {
      const response = await login(loginInput, password); // Função de login
      console.log('Resposta da API:', response); // Verifique os dados aqui
      if (response.success) {
        // Navegação para a tela 'User' com os parâmetros necessários
        navigation.navigate('User', { userId: response.user._id, userName: response.user.nome });
      } else {
        Alert.alert('Erro', response.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha na autenticação, tente novamente.');
    }
  };
  
  
  
  
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/logoSunGuard.png')}
        style={styles.logo} 
        resizeMode="contain"
      />
      <TextInput 
        style={[styles.input, loginInputFocused && styles.inputFocused]} 
        placeholder="E-mail ou Nome de Usuário" // Alterado para indicar que pode ser email ou nome
        placeholderTextColor="#aaaaaa"
        value={loginInput}
        onChangeText={setLoginInput}
        onFocus={() => setLoginInputFocused(true)} 
        onBlur={() => setLoginInputFocused(false)} 
      />
      <TextInput 
        style={[styles.input, passwordFocused && styles.inputFocused]} 
        placeholder="Senha" 
        secureTextEntry 
        placeholderTextColor="#aaaaaa"
        value={password}
        onChangeText={setPassword}
        onFocus={() => setPasswordFocused(true)} 
        onBlur={() => setPasswordFocused(false)}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Cadastrar-se</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
