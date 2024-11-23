import Sensor from '../models/Sensor.js';

const controller = {}; // Objeto vazio

// Método para criar um novo sensor
controller.create = async function (req, res) {
  try {
    await Sensor.create(req.body);
    res.status(201).end(); // Sucesso
  } catch (error) {
    console.error(error);
    res.status(500).end(); // Erro interno
  }
};

// Método para deletar um sensor por ID
controller.delete = async (req, res) => {
  try {
    const result = await Sensor.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(204).end(); // Documento excluído
    } else {
      res.status(404).send({ error: 'Documento não encontrado' }); // Documento não encontrado
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erro interno do servidor' });
  }
};

// Método para retornar todos os sensores com filtros opcionais
controller.retrieveAll = async function (req, res) {
  try {
    const filtro = {};
    let projeção = null; // Projeção nula para retornar todos os campos

    // Filtro por data de início
    if (req.query.data_inicio) {
      const dataInicio = new Date(req.query.data_inicio);
      filtro.data = { $gte: dataInicio };
    }

    // Filtro por data de fim
    if (req.query.data_fim) {
      const dataFim = new Date(req.query.data_fim);
      filtro.data = {
        ...filtro.data,
        $lte: dataFim,
      };
    }

    // Filtro por hora
    if (req.query.hora) {
      filtro.hora = req.query.hora;
    }

    // Configura projeção apenas se campos específicos forem solicitados
    const camposEspecificos = ['temperatura', 'umidade', 'uv'];
    const camposPresentes = camposEspecificos.filter((campo) => campo in req.query);

    if (camposPresentes.length > 0) {
      projeção = { data: 1, hora: 1 }; // Sempre inclui data e hora
      camposPresente.forEach((campo) => (projeção[campo] = 1)); // Adiciona campos solicitados
    }

    // Busca no banco
    const result = await Sensor.find(filtro, projeção).sort({ data: 1, hora: 1 });
    res.send(result); // Retorna os dados
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Erro ao processar a solicitação' });
  }
};

// Método para retornar um único sensor por ID
controller.retrieveOne = async function (req, res) {
  try {
    const result = await Sensor.findById(req.params.id);
    if (result) res.send(result);
    else res.status(404).end(); // Documento não encontrado
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
};

// Método para atualizar um sensor por ID
controller.update = async function (req, res) {
  try {
    const result = await Sensor.findByIdAndUpdate(req.params.id, req.body);
    if (result) res.status(204).end(); // Documento atualizado
    else res.status(404).end(); // Documento não encontrado
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
};

// Método para atualizar vários sensores
controller.updateMany = async function (req, res) {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).send({ error: 'Esperado um array de objetos de dados para atualização' });
    }

    const updatePromises = req.body.map(async (dataEntry) => {
      const { data, hora, temperatura, umidade, uv } = dataEntry;

      if (!data || !hora) {
        throw new Error("Cada entrada deve conter 'data' e 'hora'");
      }

      const formattedDate = new Date(data).toISOString().split('T')[0];

      const result = await Sensor.updateOne(
        { data: formattedDate, hora }, // Filtro por data e hora
        { temperatura, umidade, uv } // Campos para atualizar
      );

      if (result.matchedCount === 0) {
        console.log(`Nenhum documento encontrado para data: ${formattedDate} e hora: ${hora}`);
      }
    });

    await Promise.all(updatePromises);
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message || 'Erro ao atualizar os documentos' });
  }
};

export default controller;
