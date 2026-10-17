const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Conexión a MongoDB Atlas o local
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quiz_gustos';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Esquema del documento
const RespuestaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  preferencias: { type: Object, required: true }
});

const Respuesta = mongoose.model('Respuesta', RespuestaSchema);

// Endpoint para recibir las respuestas desde la web
app.post('/api/guardar', async (req, res) => {
  try {
    const { nombre, respuestas } = req.body;

    const nuevaRespuesta = new Respuesta({
      nombre,
      preferencias: respuestas
    });

    await nuevaRespuesta.save();
    res.status(201).json({ status: 'ok', mensaje: 'Respuestas guardadas con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', mensaje: 'No se pudieron guardar las respuestas' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor listo en http://localhost:${PORT}`));