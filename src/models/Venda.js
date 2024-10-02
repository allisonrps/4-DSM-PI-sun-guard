import mongoose from 'mongoose'

const esquema = mongoose.Schema({
  // _id é automático no Mongoose
  num: { type: Number, required: true },
  data_venda: { type: Date, required: true },
  cliente: {
    type: mongoose.ObjectId,
    ref: 'Cliente',   // Nome do model referenciado
    required: true
  },
  // Itens da venda como subdocumentos
  itens: [{
    num_item: { type: Number, required: true },
    produto: {
      type: mongoose.ObjectId,
      ref: 'Produto',
      required: true
    },
    quantidade: { type: Number, required: true}
  }]
})

/* 
  Parâmetros de mongoose.model
  1º ~> Nome do model (inicial maiúscula)
  2º ~> o esquema definido acima
  3º ~> nome da collection no BD (inicial minúscula, plural)
*/
export default mongoose.model('Venda', esquema, 'vendas')