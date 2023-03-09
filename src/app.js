require('dotenv').config(); // Carga las variables de entorno desde .env

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoSanitize = require('mongo-sanitize');
const cluster = require('cluster');
const os = require('os');

const app = express();

// Utiliza las variables de entorno definidas en .env
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 27017;

// Conéctate a la base de datos de MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Conexión exitosa a la base de datos de MongoDB');
  })
  .catch((error) => {
    console.error('Error al conectarse a la base de datos de MongoDB', error);
  });

// Configurando las rutas de la aplicación
app.get('/', (req, res) => {
  res.send('Bienvenido a mi aplicación de notas');
});

// Iniciando el servidor utilizando el módulo cluster
if (cluster.isMaster) {
  // Proceso maestro
  console.log(`Proceso maestro iniciado (PID ${process.pid})`);

  const numCPUs = os.cpus().length;
  console.log(`Número de núcleos del CPU: ${numCPUs}`);

  // Crear un proceso hijo por cada núcleo del CPU
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Manejar eventos de la muerte de los procesos hijos
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Proceso hijo ${worker.process.pid} ha terminado (code ${code}, signal ${signal})`);
    cluster.fork(); // Iniciar un nuevo proceso hijo
  });

} else {
  // Procesos hijos
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT} (PID ${process.pid})`);
  });
}
