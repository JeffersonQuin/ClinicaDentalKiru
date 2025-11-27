// routes/pacientes.js
const express = require('express');
const router = express.Router();

const cpacientes = require('../controllers/pacientes');

router.get('/', cpacientes.listar);
router.get('/:id', cpacientes.obtener);
router.post('/', cpacientes.crear);
router.put('/:id', cpacientes.actualizar);
router.delete('/:id', cpacientes.eliminar);

module.exports = router;
