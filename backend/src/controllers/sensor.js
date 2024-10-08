import Sensor from '../models/Sensor.js'

const controller = {}   // Objeto vazio

controller.create = async function(req, res) {
  try {
    await Sensor.create(req.body)

    // Envia uma resposta de sucesso ao front-end
    // HTTP 201: Created
    res.status(201).end()
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
    res.status(500).end()
  }
}

controller.retrieveAll = async function(req, res) {
  try {
    const filtro = {};
    
    // Verificar se há parâmetro de data_hora na query
    if (req.query.data_hora) {
      const dataInicial = new Date(`${req.query.data_hora}T00:00:00Z`);
      const dataFinal = new Date(`${req.query.data_hora}T23:59:59Z`);
      
      // Adiciona o filtro de intervalo de data
      filtro.data_hora = {
        $gte: dataInicial,
        $lte: dataFinal
      };
    }

    const result = await Sensor.find(filtro).sort({ data_hora: 1 }); // Ordena em ordem crescente
    res.send(result);
  } catch(error) {
    console.error(error);
    res.status(500).end();
  }
};


controller.retrieveOne = async function(req, res) {
  try {
    const result = await Sensor.findById(req.params.id)
    // Documento encontrado ~> HTTP 200: OK (implícito)
    if(result) res.send(result)
    // Documento não encontrado ~> HTTP 404: Not Found
    else res.status(404).end()  
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
    res.status(500).end()
  }
}

controller.update = async function(req, res) {
  try {
    const result = await Sensor.findByIdAndUpdate(req.params.id, req.body)
    // Documento encontrado e atualizado ~> HTTP 204: No Content
    if(result) res.status(204).end()
    // Documento não encontrado (e não atualizado) ~> HTTP 404: Not Found
    else res.status(404).end()
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
    res.status(500).end()
  }
}

controller.delete = async function(req, res) {
  try {
    const result = await Sensor.findByIdAndDelete(req.params.id)
    // Documento encontrado e excluído ~> HTTP 204: No Content
    if(result) res.status(204).end()
    // Documento não encontrado (e não excluído) ~> HTTP 404: Not Found
    else res.status(404).end()
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
    res.status(500).end()
  }
}

export default controller