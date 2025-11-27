// stores/pacienteStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Fuse from 'fuse.js'
import axios from 'axios'

// 🔗 Ajusta tu backend aquí
const API_URL = 'http://localhost:5050/pacientes'

// Configuración Fuse.js
const FUSE_OPTIONS = {
  keys: [
    'nombre',
    'apellidoPaterno',
    'apellidoMaterno',
    'ci',
    'gmail',
    'ciudad',
    'profesion',
    'motivoConsulta',
    'domicilio',
    'estadoCivil'
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2
}

export const usePacienteStore = defineStore('paciente', () => {

  // State
  const pacientes = ref([])
  const searchQuery = ref('')
  const cityFilter = ref(null)
  const alertFilter = ref(null)
  const selectedPatient = ref(null)
  const loading = ref(false)
  let fuse = null

  // Getters Computed
  const pacientesFiltrados = computed(() => {
    let result = pacientes.value.filter(p => p.state !== 'deleted')

    if (cityFilter.value) {
      result = result.filter(p => p.ciudad === cityFilter.value)
    }

    if (alertFilter.value === 'with') {
      result = result.filter(p => p.alertasClinicas && p.alertasClinicas.trim() !== '')
    }

    if (alertFilter.value === 'without') {
      result = result.filter(p => !p.alertasClinicas || p.alertasClinicas.trim() === '')
    }

    if (searchQuery.value.trim()) {
      const fuseResults = fuse.search(searchQuery.value)
      const matched = fuseResults.map(r => r.item.id)
      result = result.filter(p => matched.includes(p.id))
    }

    return result
  })

  const totalPacientes = computed(() => pacientesFiltrados.value.length)

  const ciudadesUnicas = computed(() => {
    return Array.from(
      new Set(
        pacientes.value.filter(p => p.state !== 'deleted').map(p => p.ciudad)
      )
    )
  })

  // 🔹 Inicializar Fuse
  const inicializarFuse = () => {
    fuse = new Fuse(
      pacientes.value.filter(p => p.state !== 'deleted'),
      FUSE_OPTIONS
    )
  }

  const actualizarFuse = () => inicializarFuse()

  // ────────────────────────────────
  // 🔥 1. GET → cargar desde la API
  // ────────────────────────────────
  const cargarPacientes = async () => {
    loading.value = true
    try {
      const { data } = await axios.get(API_URL)
      pacientes.value = data.data
      inicializarFuse()
    } catch (error) {
      console.error('Error cargando pacientes:', error)
    } finally {
      loading.value = false
    }
  }

  // ────────────────────────────────
  // 🔥 2. POST → crear paciente
  // ────────────────────────────────
  const agregarPaciente = async (nuevoPaciente) => {
    loading.value = true
    try {
      const { data } = await axios.post(API_URL, nuevoPaciente)
      pacientes.value.push(data.data)
      actualizarFuse()
      return data.data
    } catch (error) {
      console.error('Error agregando paciente:', error)
    } finally {
      loading.value = false
    }
  }

  // ────────────────────────────────
  // 🔥 3. PUT → actualizar paciente
  // ────────────────────────────────
  const actualizarPaciente = async (paciente) => {
    loading.value = true
    try {
      const { data } = await axios.put(`${API_URL}/${paciente.id}`, paciente)

      const index = pacientes.value.findIndex(p => p.id === paciente.id)
      if (index > -1) pacientes.value[index] = data.data

      actualizarFuse()
      return data.data
    } catch (error) {
      console.error('Error actualizando paciente:', error)
    } finally {
      loading.value = false
    }
  }

  // ────────────────────────────────
  // 🔥 4. DELETE → eliminar paciente
  // ────────────────────────────────
  const eliminarPaciente = async (pacienteId) => {
    try {
      await axios.delete(`${API_URL}/${pacienteId}`)

      const index = pacientes.value.findIndex(p => p.id === pacienteId)
      if (index > -1) pacientes.value[index].state = 'deleted'

      actualizarFuse()
    } catch (error) {
      console.error('Error eliminando paciente:', error)
    }
  }

  // seleccionar/limpiar etc
  const seleccionarPaciente = (p) => selectedPatient.value = { ...p }
  const limpiarPacienteSeleccionado = () => selectedPatient.value = null

  const establecerBusqueda = q => searchQuery.value = q
  const establecerFiltroCiudad = c => cityFilter.value = c
  const establecerFiltroAlerta = a => alertFilter.value = a

  const limpiarFiltros = () => {
    searchQuery.value = ''
    cityFilter.value = null
    alertFilter.value = null
  }

  // Helpers útiles
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return '--'

    const birth = new Date(fechaNacimiento)
    const today = new Date()

    let edad = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) edad--

    return edad
  }

  const formatearFecha = (d) => {
    if (!d) return 'Nunca'
    try {
      return new Date(d).toLocaleDateString('es-ES')
    } catch {
      return 'Inválida'
    }
  }

  // 📌 IMPORTANT: cargar desde la API al iniciar el store
  cargarPacientes()

  return {
    pacientes,
    pacientesFiltrados,
    totalPacientes,
    ciudadesUnicas,
    searchQuery,
    cityFilter,
    alertFilter,
    selectedPatient,
    loading,

    cargarPacientes,
    agregarPaciente,
    actualizarPaciente,
    eliminarPaciente,

    seleccionarPaciente,
    limpiarPacienteSeleccionado,

    establecerBusqueda,
    establecerFiltroCiudad,
    establecerFiltroAlerta,
    limpiarFiltros,

    calcularEdad,
    formatearFecha
  }
})
