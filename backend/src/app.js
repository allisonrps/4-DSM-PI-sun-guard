import dotenv from 'dotenv';
// Carrega as variáveis do arquivo .env
dotenv.config();

import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from 'cors';
import mongoose from 'mongoose';

// Importação das rotas
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import usuarioRouter from './routes/usuario.js';
import sensorRouter from './routes/sensor.js';

const app = express();

// Conexão com o banco de dados MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.log("Erro ao conectar ao MongoDB: ", err));

// Configuração de CORS
const allowedOrigins = [
  "https://www.sun-guard.vercel.app/", // URL da sua aplicação React Web
  "http://localhost:8081", // URL do seu app React Native durante desenvolvimento
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Permite a origem
    } else {
      callback(new Error("Não autorizado pela política de CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Permite o envio de cookies e credenciais
};

app.use(cors(corsOptions)); // Ativando CORS com as opções configuradas

// Middlewares
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

// Definindo as rotas
app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/sensors", sensorRouter);

// Middleware de erro - Para capturar erros não tratados
app.use((err, req, res, next) => {
  console.error(err.stack); // Loga o erro no servidor
  res.status(500).json({ error: "Algo deu errado no servidor." });
});

export default app;