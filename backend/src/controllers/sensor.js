import Sensor from '../models/Sensor.js'

const controller = {}   // Objeto vazio

controller.create = async function(req, res) {
  try {
    await Sensor.create(req.body)

    // Envia uma resposta de sucesso ao front-end
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

    // Verificar se há parâmetro de data na query
    if (req.query.data) {
      const data = new Date(req.query.data);  // Converte a string de data para Date
      filtro.data = data.toISOString().split('T')[0];  // Filtra apenas pela data (formato YYYY-MM-DD)
    }

    // Verificar se há parâmetro de hora na query
    if (req.query.hora) {
      filtro.hora = req.query.hora;  // Filtra pela hora exata no formato HH:MM
    }

    // Verificar se há parâmetro de UV na query
    if (req.query.uv) {
      filtro.uv = req.query.uv;  // Filtra pelo valor de UV
    }

    // Verificar se há parâmetro de temperatura na query
    if (req.query.temperatura) {
      filtro.temperatura = req.query.temperatura;  // Filtra pelo valor de temperatura
    }

    // Verificar se há parâmetro de umidade na query
    if (req.query.umidade) {
      filtro.umidade = req.query.umidade;  // Filtra pelo valor de umidade
    }

    // Busca no banco com os filtros aplicados e ordena por data e hora (ordem crescente)
    const result = await Sensor.find(filtro).sort({ data: 1, hora: 1 });  // Ordena por data e depois hora

    // Retorna os dados filtrados e ordenados
    res.send(result);
  } catch(error) {
    console.error(error);
    res.status(500).end();
  }
}

controller.retrieveOne = async function(req, res) {
  try {
    const result = await Sensor.findById(req.params.id);
    if (result) res.send(result);
    else res.status(404).end();  // Documento não encontrado
  }
  catch(error) {
    console.error(error);
    res.status(500).end();
  }
}

controller.update = async function(req, res) {
  try {
    const result = await Sensor.findByIdAndUpdate(req.params.id, req.body);
    if (result) res.status(204).end();  // Documento encontrado e atualizado
    else res.status(404).end();  // Documento não encontrado
  }
  catch(error) {
    console.error(error);
    res.status(500).end();
  }
}



controller.updateMany = async function(req, res) {
  try {
    // Verifica se o corpo da requisição contém um array de dados
    if (!Array.isArray(req.body)) {
      return res.status(400).send({ error: "Esperado um array de objetos de dados para atualização" });
    }

    // Itera sobre cada objeto no array
    for (const dataEntry of req.body) {
      const { data, hora, temperatura, umidade, uv } = dataEntry;

      // Verifica se data e hora estão presentes
      if (!data || !hora) {
        return res.status(400).send({ error: "Cada entrada deve conter 'data' e 'hora'" });
      }

      // Atualiza o documento que corresponde à data e hora específicas
      await Sensor.updateOne(
        { data: data, hora: hora },  // Filtro por data e hora específicas
        { temperatura, umidade, uv } // Campos a serem atualizados
      );
    }

    // Responde com sucesso se todos os documentos foram processados
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}




controller.delete = async function(req, res) {
  try {
    const result = await Sensor.findByIdAndDelete(req.params.id);
    if (result) res.status(204).end();  // Documento encontrado e excluído
    else res.status(404).end();  // Documento não encontrado
  }
  catch(error) {
    console.error(error);
    res.status(500).end();
  }
}

export default controller;
