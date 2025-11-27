const express = require('express');
const cors = require('cors');
const app = express();

// Permitir todo (desarrollo)
// NOTA: en producción especifica el origen en lugar de '*'
app.use(cors()); // permite cualquier origen
app.use(express.json());

// Tus rutas
app.use('/pacientes', require('./routes/pacientes'));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`API corriendo en ${PORT}`));
