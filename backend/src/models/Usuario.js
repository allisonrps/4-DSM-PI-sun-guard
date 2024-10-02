import mongoose from 'mongoose'

const esquema = mongoose.Schema({
  // _id é automático no Mongoose
  nome: { type: String, required: true },
  cpf: { type: String, required: true, index: { unique: true} },
  data_nascimento: { type: Date, required: false },
  pele: { type: String, required: true },
  senha: { type: String, required: true }
})

/* 
  Parâmetros de mongoose.model
  1º ~> Nome do model (inicial maiúscula)
  2º ~> o esquema definido acima
  3º ~> nome da collection no BD (inicial minúscula, plural)
*/
export default mongoose.model('Usuario', esquema, 'usuarios')