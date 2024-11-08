import mongoose from 'mongoose';

// Definir o esquema de Usuário
const esquema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  fototipo: {
    type: String,
    required: true
  },
  senha: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  data_nascimento: {
    type: Date,
    required: true
  }
});


// Exportar o modelo baseado no esquema
export default mongoose.model('Usuario', esquema, 'usuarios');








