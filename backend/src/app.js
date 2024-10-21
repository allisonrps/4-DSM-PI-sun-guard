import dotenv from 'dotenv'
// Carrega as variáveis do arquivo .env
// no objeto global process.env
dotenv.config()

import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import cors from 'cors';

app.use(cors({
    origin: 'http://localhost:3000', // Permitir solicitações deste frontend específico
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  }));

app.use(express.json());

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const app = express();

import mongoose from 'mongoose'
mongoose.connect(process.env.DATABASE_URL)

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", usersRouter);

/***************************************************
 * ROTAS
***************************************************/

import usuarioRouter from './routes/usuario.js'
app.use('/usuarios', usuarioRouter)

import sensorRouter from './routes/sensor.js'
app.use('/sensors', sensorRouter)

export default app;
