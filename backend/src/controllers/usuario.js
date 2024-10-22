import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt'; // Para hash de senha
import jwt from 'jsonwebtoken'; // Para geração de token

const controller = {}   // Objeto vazio




controller.create = async function(req, res) {
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

    // Hash da senha antes de armazená-la
    const hashedSenha = await bcrypt.hash(senha, 10);

    // Criar o novo usuário no banco de dados
    const newUser = await Usuario.create({
      nome,
      fototipo,
      senha: hashedSenha, // Armazena a senha hash
      email,
      data_nascimento
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








controller.retrieveAll = async function(req, res) {
  try {
    // Construir um objeto de consulta (query) com base nos parâmetros fornecidos
    const { nome, fototipo, data_nascimento_inicial, data_nascimento_final } = req.query;

    let query = {};

    // Adicionar filtro por nome se fornecido
    if (nome) {
      // Usar regex para buscar nomes que contenham o valor informado, ignorando maiúsculas/minúsculas
      query.nome = { $regex: nome, $options: 'i' };
    }

    // Adicionar filtro por fototipo se fornecido
    if (fototipo) {
      query.fototipo = fototipo;
    }

    // Adicionar filtro por intervalo de datas de nascimento se fornecido
    if (data_nascimento_inicial && data_nascimento_final) {
      query.data_nascimento = {
        $gte: new Date(data_nascimento_inicial),
        $lte: new Date(data_nascimento_final)
      };
    }

    // Consultar o banco de dados com os filtros definidos
    const result = await Usuario.find(query).sort({ nome: 'asc' });
    
    // Retornar os resultados
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
};






controller.retrieveOne = async function(req, res) {
  try {
    const result = await Usuario.findById(req.params.id)
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
    const result = await Usuario.findByIdAndUpdate(req.params.id, req.body)
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
    const result = await Usuario.findByIdAndDelete(req.params.id)
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