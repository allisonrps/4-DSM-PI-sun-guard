import mongoose from 'mongoose'

const esquema = mongoose.Schema({
  // _id é automático no Mongoose
  razao_social: { type: String, required: true },
  nome_fantasia: { type: String, required: true },
  cnpj: { type: String, required: true, index: { unique: true} },
  logradouro: { type: String, required: true },
  num_casa: { type: String, required: true },
  bairro: { type: String, required: true },
  complemento: { type: String, required: false },
  municipio: { type: String, required: true },
  uf: { type: String, required: true },
  telefone: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true } }
})

/* 
  Parâmetros de mongoose.model
  1º ~> Nome do model (inicial maiúscula)
  2º ~> o esquema definido acima
  3º ~> nome da collection no BD (inicial minúscula, plural)
*/
export default mongoose.model('Fornecedor', esquema, 'fornecedores')