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


controller.delete = async (req, res) => {
  try {
    const result = await Sensor.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(204).end();  // Documento encontrado e excluído
    } else {
      res.status(404).send({ error: 'Documento não encontrado' });  // Documento não encontrado
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};





// Recupera apenas os dados de temperatura para uma data específica
controller.retrieveTemperaturaByDate = async (req, res) => {
  try {
    const { data } = req.query;

    if (!data) {
      return res.status(400).send({ error: 'O parâmetro "data" é obrigatório.' });
    }

    const formattedDate = new Date(data).toISOString().split('T')[0];

    const result = await Sensor.find(
      { data: formattedDate },
      { temperatura: 1, data: 1, hora: 1, _id: 1 } // Inclui hora
    );
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erro interno do servidor.' });
  }
};

// Recupera apenas os dados de umidade para uma data específica
controller.retrieveUmidadeByDate = async (req, res) => {
  try {
    const { data } = req.query;

    if (!data) {
      return res.status(400).send({ error: 'O parâmetro "data" é obrigatório.' });
    }

    const formattedDate = new Date(data).toISOString().split('T')[0];

    const result = await Sensor.find(
      { data: formattedDate },
      { umidade: 1, data: 1, hora: 1, _id: 1 } // Inclui hora e exclui _id
    );
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erro interno do servidor.' });
  }
};

// Recupera apenas os dados de UV para uma data específica
controller.retrieveUvByDate = async (req, res) => {
  try {
    const { data } = req.query;

    if (!data) {
      return res.status(400).send({ error: 'O parâmetro "data" é obrigatório.' });
    }

    const formattedDate = new Date(data).toISOString().split('T')[0];

    const result = await Sensor.find(
      { data: formattedDate },
      { uv: 1, data: 1, hora: 1, _id: 1 } // Inclui hora 
    );
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erro interno do servidor.' });
  }
};



controller.retrieveAll = async function(req, res) {
  try {
    const filtro = {};
    const campos = { data: 1, hora: 1 }; // Projeção inicial (data e hora)

    // Verificar se há parâmetro de data na query
    if (req.query.data) {
      const data = new Date(req.query.data); // Converte a string de data para Date
      filtro.data = data.toISOString().split('T')[0]; // Filtra apenas pela data (formato YYYY-MM-DD)
    }

    // Verificar se há parâmetro de temperatura na query
    if (req.query.temperatura) {
      filtro.temperatura = req.query.temperatura; // Filtra pelo valor de temperatura
      campos.temperatura = 1; // Inclui temperatura nos campos de retorno
    }

    // Verificar se há parâmetro de umidade na query
    if (req.query.umidade) {
      filtro.umidade = req.query.umidade; // Filtra pelo valor de umidade
      campos.umidade = 1; // Inclui umidade nos campos de retorno
    }

    // Verificar se há parâmetro de UV na query
    if (req.query.uv) {
      filtro.uv = req.query.uv; // Filtra pelo valor de UV
      campos.uv = 1; // Inclui UV nos campos de retorno
    }

    // Busca no banco com os filtros aplicados e ordena por data e hora (ordem crescente)
    const result = await Sensor.find(filtro, campos).sort({ data: 1, hora: 1 });

    // Retorna os dados filtrados e ordenados
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
};






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

    // Cria um array para armazenar as promessas de atualização
    const updatePromises = req.body.map(async (dataEntry) => {
      let { data, hora, temperatura, umidade, uv } = dataEntry;

      // Verifica se a entrada contém 'data' e 'hora'
      if (!data || !hora) {
        throw new Error("Cada entrada deve conter 'data' e 'hora'");
      }

      // Converte 'data' para o formato `YYYY-MM-DD` apenas
      const formattedDate = new Date(data).toISOString().split('T')[0];

      // Atualiza o documento que corresponde à data e hora específicas
      const result = await Sensor.updateOne(
        { data: formattedDate, hora },  // Filtro por data (somente dia) e hora específicas
        { temperatura, umidade, uv } // Campos a serem atualizados
      );

      if (result.matchedCount === 0) {
        console.log(`Nenhum documento encontrado para data: ${formattedDate} e hora: ${hora}`);
      }
    });

    // Aguarda todas as promessas de atualização serem resolvidas
    await Promise.all(updatePromises);

    // Responde com sucesso se todos os documentos foram processados
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message || "Erro ao atualizar os documentos" });
  }
}


export default controller;
