import { defineStore } from 'pinia'
import sucursales from 'src/data/sucursales.json'

export const usePublicarSucursal = defineStore('publicarSucursal', {
  state: () => ({
    listaSucursales: []
  }),

  actions: {
    cargarSucursales() {
      // Carga los datos del JSON
      this.listaSucursales = sucursales.sucursales.map(s => ({
        id: s.id,
        nombre: s.nombre,
        ubicacion: s.ubicacion,
        direccion: s.direccion,
        descripcion: s.descripcion,
        imagen: s.imagen,
        latitud: s.latitud,
        longitud: s.longitud,
        activo: s.activo,
      }))
    },

    agregarSucursal(nueva) {
      const maxId = Math.max(0, ...this.listaSucursales.map(s => s.id))
      this.listaSucursales.push({ ...nueva, id: maxId + 1 })
    },

    actualizarSucursal(actualizada) {
      const index = this.listaSucursales.findIndex(s => s.id === actualizada.id)
      if (index !== -1) this.listaSucursales[index] = { ...actualizada }
    },

    eliminarSucursal(id) {
      const index = this.listaSucursales.findIndex(s => s.id === id)
      if (index !== -1) this.listaSucursales.splice(index, 1)
    }
  },

  getters: {
    totalSucursales: (state) => state.listaSucursales.length,
    ciudadesUnicas: (state) => [...new Set(state.listaSucursales.map(s => s.ubicacion))]
  }
})
