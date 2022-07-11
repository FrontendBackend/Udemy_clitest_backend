require('dotenv').config();

const express = require('express');
var cors = require('cors');

const {dbConnection} = require('./db/config');

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Lectura y paerseo del body
app.use(express.json());

// Base de datos
dbConnection();

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/login', require('./routes/auth'))

// Configuración del puerto
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});