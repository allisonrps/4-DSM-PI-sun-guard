import Venda from '../models/Venda.js'

const controller = {}   // Objeto vazio

controller.create = async function(req, res) {
  try {
    await Venda.create(req.body)

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
    const query = Venda.find().sort({ num: 'asc' })

    // Verifica se o parâmetro 'pop_cliente' foi passado na URL
    // e, em caso positivo, acrescenta o populate() à consulta
    if('pop_cliente' in req.query) query.populate('cliente')

    // Verifica se o parâmetro 'pop_produto' foi passado na URL
    // e, em caso positivo, acrescenta o populate() à consulta
    if('pop_produto' in req.query) query.populate('itens.produto')

    const result = await query.exec()

    // HTTP 200: OK (implícito)
    res.send(result)
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
    res.status(500).end()
  }
}

controller.retrieveOne = async function(req, res) {
  try {
    const query = Venda.findById(req.params.id)

    // Verifica se o parâmetro 'pop_cliente' foi passado na URL
    // e, em caso positivo, acrescenta o populate() à consulta
    if('pop_cliente' in req.query) query.populate('cliente')

    // Verifica se o parâmetro 'pop_produto' foi passado na URL
    // e, em caso positivo, acrescenta o populate() à consulta
    if('pop_produto' in req.query) query.populate('itens.produto')

    const result = await query.exec()

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
    const result = await Venda.findByIdAndUpdate(req.params.id, req.body)
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
    const result = await Venda.findByIdAndDelete(req.params.id)
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

controller.createItem = async function(req, res) {
  try {
    // 1) Procurando pela venda na qual o novo item será inserido
    const venda = await Venda.findById(req.params.id)

    // 2) Se a venda não for encontrada, retorna HTTP 404: Not Found
    if(! venda) return res.status(404).end()

    // 3) Adiciona o novo item ao vetor de itens da venda
    venda.itens.push(req.body)
    venda.markModified('itens')
    await venda.save()

    // 4) Em caso de sucesso, retorna HTTP 201: Created
    return res.status(201).end()
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
    res.status(500).end()
  }
}

controller.retrieveAllItems = async function(req, res) {
  try {
    // 1) Procurando pela venda na qual o novo item será inserido
    const venda = await Venda.findById(req.params.id)

    // 2) Se a venda não for encontrada, retorna HTTP 404: Not Found
    if(! venda) return res.status(404).end()
    // Senão, retorna o vetor venda.itens com HTTP 200: Ok (implícito)
    else res.send(venda.itens)
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
    res.status(500).end()
  }
}

controller.retrieveOneItem = async function(req, res) {
  try {
    // 1) Procurando pela venda na qual o novo item será inserido
    const venda = await Venda.findById(req.params.id)

    // 2) Se a venda não for encontrada, retorna HTTP 404: Not Found
    if(! venda) return res.status(404).end()
    
    // 3) Procura o item específico dentro do vetor venda.itens
    const item = venda.itens.id(req.params.itemId)

    // 4) Se item for encontrado, retorna-o com HTTP 200: Ok (implícito)
    if(item) res.send(item)
    // Senão, retorna HTTP 404: Not Found
    else res.status(404).end()
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
    res.status(500).end()
  }
}

controller.updateItem = async function(req, res) {
  try {
    // 1) Procurando pela venda na qual o novo item será inserido
    const venda = await Venda.findById(req.params.id)

    // 2) Se a venda não for encontrada, retorna HTTP 404: Not Found
    if(! venda) return res.status(404).end()

    // 3) Percorre cada um dos campos de req.body e atualiza o
    //    valor do campo correspondente no item
    for(let field in req.body) {
      venda.itens.id(req.params.itemId)[field] = req.body[field]
    }
    venda.markModified('itens')

    // 4) Salva a venda com o item atualizado
    await venda.save()

    // 5) Em caso de sucesso ~> HTTP 204: No Content
    res.status(204).end()
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
    res.status(500).end()
  }
}

controller.deleteItem = async function(req, res) {
  try {
    // 1) Procurando pela venda na qual o novo item será inserido
    const venda = await Venda.findById(req.params.id)

    // 2) Se a venda não for encontrada, retorna HTTP 404: Not Found
    if(! venda) return res.status(404).end()

    // Item não existe ~> HTTP 404: Not Found
    if(! venda.itens.id(req.params.itemId)) return res.status(404).end()

    // 3) (Tenta) Exclui o item
    venda.itens.id(req.params.itemId).deleteOne()
    venda.markModified('itens')

    await venda.save()

    // HTTP 204: No Content
    res.status(204).end()
  }
  catch(error) {
    console.error(error)
    // HTTP 500: Internal Server Error
    res.status(500).end()
  }
}

export default controller