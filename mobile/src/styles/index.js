// src/styles/index.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff6f2', // Cor de fundo
  },
  logo: {
    width: '80%', // Ajusta a largura para 80% da tela
    height: undefined, // Permite que a altura se ajuste automaticamente
    aspectRatio: 1, // Mantém a proporção da imagem (ajuste conforme necessário)
    marginBottom: 20,
  },
  input: {
    height: 50, // Altura da caixa
    borderColor: '#000080ff', // Cor da borda
    borderWidth: 3, // Espessura da borda
    borderRadius: 8, // Bordas arredondadas
    paddingHorizontal: 15, // Espaçamento interno horizontal
    marginBottom: 15, // Espaçamento entre as caixas
    backgroundColor: '#f8f8f8', // Cor de fundo clara
    fontSize: 16, // Tamanho da fonte
    color: '#333333', // Cor do texto
    width: '80%', // Largura do input para coincidir com o botão
    elevation: 2, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 1 }, // Offset da sombra
    shadowOpacity: 0.1, // Opacidade da sombra
    shadowRadius: 1, // Raio da sombra
  },
  inputFocused: {
    borderColor: '#000080ff', // Cor da borda quando o input está focado
  },
  button: {
    backgroundColor: '#ff7f2a', // Cor de fundo
    borderRadius: 8, // Bordas arredondadas
    paddingVertical: 12, // Espaçamento vertical
    paddingHorizontal: 20, // Espaçamento horizontal
    alignItems: 'center', // Centraliza o texto
    justifyContent: 'center', // Centraliza o texto
    width: '80%', // Largura do botão
    marginVertical: 10, // Margem vertical
    elevation: 3, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 }, // Offset da sombra
    shadowOpacity: 0.2, // Opacidade da sombra
    shadowRadius: 2, // Raio da sombra
  },
  buttonText: {
    color: '#000080ff', // Cor do texto
    fontSize: 16, // Tamanho da fonte
    fontWeight: 'bold', // Negrito
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#ff7f2aff', // Definindo a cor do texto
  },
  pickerContainer: {
    height: 50,
    width: '80%',
    borderColor: '#000080ff', // Cor da borda
    borderWidth: 3, // Espessura da borda
    borderRadius: 8, // Bordas arredondadas
    marginBottom: 15, // Margem inferior
    backgroundColor: '#f8f8f8', // Cor de fundo
    elevation: 2, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 1 }, // Offset da sombra
    shadowOpacity: 0.1, // Opacidade da sombra
    shadowRadius: 1, // Raio da sombra
  }
  
});

export default styles;
