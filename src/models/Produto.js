import mongoose from 'mongoose'

const esquema = mongoose.Schema({
  // _id é automático no Mongoose
  descricao: { type: String, required: true },
  unidade_medida: { type: String, required: true },
  quantidade: { type: Number, required: true },
  valor_unitario: { type: Number, required: true },
  fornecedor: {
    type: mongoose.ObjectId,
    ref: 'Fornecedor',      // Nome do model referenciado
    required: true
  }
})

/* 
  Parâmetros de mongoose.model
  1º ~> Nome do model (inicial maiúscula)
  2º ~> o esquema definido acima
  3º ~> nome da collection no BD (inicial minúscula, plural)
*/
export default mongoose.model('Produto', esquema, 'produtos')