import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sunguard-backend.vercel.app', // A URL base do backend
});

// Função de login
export const login = async (loginInput, password) => {
  try {
    const response = await api.get('/usuarios'); // Aqui estamos buscando todos os usuários cadastrados
    const usuarios = response.data;

    const usuarioAutenticado = usuarios.find(
      (usuario) =>
        (usuario.email === loginInput || usuario.nome === loginInput) && usuario.senha === password
    );

    if (usuarioAutenticado) {
      return { success: true, user: usuarioAutenticado }; // Retorna os dados do usuário autenticado
    } else {
      return { success: false, message: 'Email, nome ou senha incorretos' }; // Retorna falha de autenticação
    }
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
};

// Função de cadastro
export const register = async ({ name, email, dataNascimento, fototipo, password }) => {
  try {
    const response = await api.post('/usuarios', {
      nome: name,
      email,
      data_nascimento: dataNascimento,
      fototipo,
      senha: password,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    throw error;
  }
};

// Função de buscar dados do usuário
export const fetchUserData = async (userId) => {
  try {
    const response = await api.get(`/usuarios/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    throw error;
  }
};

// Função para buscar os dados do sensor
export const fetchSensorData = async () => {
  try {
    const response = await api.get('/sensors'); // Buscar todos os sensores
    return response.data; // Retorna os dados do sensor
  } catch (error) {
    console.error('Erro ao buscar dados do sensor:', error);
    throw error;
  }
};
