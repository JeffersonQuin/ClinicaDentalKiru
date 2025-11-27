// controllers/pacientes.js
const Pacientes = require('../models/pacientes');

module.exports = {
  
  // GET /pacientes
  async listar(req, res) {
    try {
      const data = await Pacientes.listar();
      return res.json({ success: true, data });
    } catch (err) {
      console.error('Error listar pacientes:', err);
      return res.status(500).json({ success: false, message: 'Error interno' });
    }
  },

  // GET /pacientes/:id
  async obtener(req, res) {
    try {
      const id = Number(req.params.id);
      const paciente = await Pacientes.obtenerPorId(id);

      if (!paciente) {
        return res.status(404).json({ success: false, message: 'Paciente no encontrado' });
      }

      return res.json({ success: true, data: paciente });

    } catch (err) {
      console.error('Error obtener paciente:', err);
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  },

  // POST /pacientes
  async crear(req, res) {
    try {
      const paciente = await Pacientes.crear(req.body);
      return res.json({ success: true, data: paciente });
    } catch (err) {
      console.error('Error crear paciente:', err);
      return res.status(500).json({ success: false, message: 'Error interno' });
    }
  },

  // PUT /pacientes/:id
  async actualizar(req, res) {
    try {
      const id = Number(req.params.id);
      const paciente = await Pacientes.actualizar(id, req.body);

      return res.json({ success: true, data: paciente });
    } catch (err) {
      console.error('Error actualizar paciente:', err);
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  },

  // DELETE /pacientes/:id
  async eliminar(req, res) {
    try {
      const id = Number(req.params.id);
      const paciente = await Pacientes.eliminar(id);

      return res.json({ success: true, data: paciente });
    } catch (err) {
      console.error('Error eliminar paciente:', err);
      res.status(500).json({ success: false, message: 'Error interno' });
    }
  }
};
