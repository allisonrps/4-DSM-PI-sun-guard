import Usuario from '../models/Usuario.js';

import jwt from 'jsonwebtoken'; // Para geração de token

const controller = {}   // Objeto vazio


controller.create = async function (req, res) {
  try {
    // Desestruturar os dados recebidos do corpo da requisição
    const { nome, fototipo, senha, email, data_nascimento } = req.body;

    // Verificar se todos os campos obrigatórios foram preenchidos
    if (!nome || !fototipo || !senha || !email || !data_nascimento) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    // Verificar se o email já está em uso
    const userExists = await Usuario.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'O email já está em uso.' });
    }

    // Criar o novo usuário no banco de dados com a senha sem hash
    const newUser = await Usuario.create({
      nome,
      fototipo,
      senha, // Armazena a senha em texto claro (não recomendável)
      email,
      data_nascimento,
    });

    // Gerar um token de autenticação (JWT)
    const token = jwt.sign({ id: newUser._id }, 'seu_segredo_jwt', { expiresIn: '1h' });

    // Responder com o token e mensagem de sucesso
    res.status(201).json({ message: 'Usuário criado com sucesso!', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar o usuário.' });
  }
};








controller.retrieveAll = async function (req, res) {
  try {
    const { nome, fototipo, data_nascimento_inicial, data_nascimento_final } = req.query;
    let query = {};

    if (nome) {
      query.nome = { $regex: nome, $options: 'i' };
    }
    if (fototipo) {
      query.fototipo = fototipo;
    }
    if (data_nascimento_inicial && data_nascimento_final) {
      query.data_nascimento = {
        $gte: new Date(data_nascimento_inicial),
        $lte: new Date(data_nascimento_final),
      };
    }

    // Consultar o banco de dados sem o campo 'senha'
    const result = await Usuario.find(query).select('-senha').sort({ nome: 'asc' });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
};

controller.retrieveOne = async function (req, res) {
  try {
    // Consultar o banco de dados sem o campo 'senha'
    const result = await Usuario.findById(req.params.id).select('-senha');
    if (result) res.send(result);
    else res.status(404).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
};

controller.update = async function (req, res) {
  try {
    const result = await Usuario.findByIdAndUpdate(req.params.id, req.body);
    if (result) res.status(204).end();
    else res.status(404).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
};

controller.delete = async function (req, res) {
  try {
    const result = await Usuario.findByIdAndDelete(req.params.id);
    if (result) res.status(204).end();
    else res.status(404).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
};

export default controller;
