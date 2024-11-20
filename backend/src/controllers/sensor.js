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


controller.retrieveAll = async function (req, res) {
  try {
    const filtro = {};
    let projeção = null; // Projeção será configurada com base nos filtros aplicados

    // Verificar se há parâmetro de data_inicio na query
    if (req.query.data_inicio) {
      const dataInicio = new Date(req.query.data_inicio); // Converte a string para Date
      filtro.data = {
        $gte: dataInicio, // Filtra data maior ou igual a data_inicio
      };
    }

    // Verificar se há parâmetro de data_fim na query
    if (req.query.data_fim) {
      const dataFim = new Date(req.query.data_fim); // Converte a string para Date
      filtro.data = {
        ...filtro.data, // Mantém o filtro anterior
        $lte: dataFim, // Filtra data menor ou igual a data_fim
      };
    }

    // Verificar se há filtros específicos sem valor (uv, temperatura, umidade)
    const camposEspecificos = ['uv', 'temperatura', 'umidade'];
    const camposPresentes = camposEspecificos.filter((campo) => req.query[campo] !== undefined);

    // Configura a projeção para campos específicos (caso existam)
    if (camposPresentes.length > 0) {
      projeção = { data: 1, hora: 1 }; // Sempre inclui "data" e "hora"

      // Adiciona os campos específicos à projeção
      camposPresentes.forEach((campo) => {
        projeção[campo] = 1;
      });
    }

    // Busca no banco com os filtros aplicados e projeção configurada
    const result = await Sensor.find(filtro, projeção).sort({ data: 1, hora: 1 });

    // Retorna os dados filtrados e projetados
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erro ao processar a solicitação' });
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