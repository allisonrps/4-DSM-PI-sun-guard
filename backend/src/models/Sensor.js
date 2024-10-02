import mongoose from 'mongoose'

const esquema = mongoose.Schema({
  // _id é automático no Mongoose
  data_hora: { type: Date, required: false },
  uv: { type: String, required: true },
  temperatura: { type: String, required: true },
  umidade: { type: String, required: true }
})

/* 
  Parâmetros de mongoose.model
  1º ~> Nome do model (inicial maiúscula)
  2º ~> o esquema definido acima
  3º ~> nome da collection no BD (inicial minúscula, plural)
*/
export default mongoose.model('Sensor', esquema, 'sensors')