// stores/pacienteStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Fuse from 'fuse.js'
import pacientesData from 'src/data/pacientes.json'

// Opciones de configuración para Fuse.js (búsqueda difusa)
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

  // Getters (Computed)
  const pacientesFiltrados = computed(() => {
    let result = pacientes.value.filter(p => p.state !== 'deleted')

    // Aplicar filtro de ciudad
    if (cityFilter.value) {
      result = result.filter(p => p.ciudad === cityFilter.value)
    }

    // Aplicar filtro de alertas
    if (alertFilter.value) {
      if (alertFilter.value === 'with') {
        result = result.filter(p => p.alertasClinicas && p.alertasClinicas.trim() !== '')
      } else if (alertFilter.value === 'without') {
        result = result.filter(p => !p.alertasClinicas || p.alertasClinicas.trim() === '')
      }
    }

    // Aplicar búsqueda si existe
    if (searchQuery.value?.trim()) {
      const results = fuse.search(searchQuery.value.trim())
      const resultItems = results.map(result => result.item)
      result = result.filter(patient => 
        resultItems.some(item => item.id === patient.id)
      )
    }

    return result
  })

  const totalPacientes = computed(() => pacientesFiltrados.value.length)

  const pacientesConAlertas = computed(() => {
    return pacientes.value.filter(p => 
      p.alertasClinicas && 
      p.alertasClinicas.trim() !== '' && 
      p.state !== 'deleted'
    ).length
  })

  const ciudadesUnicas = computed(() => {
    const cities = new Set(pacientes.value
      .filter(p => p.state !== 'deleted')
      .map(p => p.ciudad)
    )
    return cities.size
  })

  const opcionesCiudad = computed(() => {
    const cities = new Set(pacientes.value
      .filter(p => p.state !== 'deleted')
      .map(p => p.ciudad)
    )
    return Array.from(cities).sort()
  })

  const opcionesAlerta = computed(() => [
    { label: 'Con alertas', value: 'with' },
    { label: 'Sin alertas', value: 'without' }
  ])

  // Actions
  const cargarPacientes = () => {
    pacientes.value = pacientesData.pacientes.map(p => ({
      ...p,
      id: Number(p.id)
    }))
    inicializarFuse()
  }

  const inicializarFuse = () => {
    const collection = pacientes.value.filter(p => p.state !== 'deleted')
    fuse = new Fuse(collection, FUSE_OPTIONS)
  }

  const actualizarFuse = () => {
    const collection = pacientes.value.filter(p => p.state !== 'deleted')
    if (fuse && typeof fuse.setCollection === 'function') {
      fuse.setCollection(collection)
    } else {
      fuse = new Fuse(collection, FUSE_OPTIONS)
    }
  }

  const agregarPaciente = (nuevoPaciente) => {
    loading.value = true
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const pacienteToAdd = {
          ...nuevoPaciente,
          id: generarNuevoId()
        }
        
        pacientes.value.push(pacienteToAdd)
        actualizarFuse()
        loading.value = false
        resolve(pacienteToAdd)
      }, 1000)
    })
  }

  const actualizarPaciente = (pacienteActualizado) => {
    loading.value = true
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = pacientes.value.findIndex(p => 
          Number(p.id) === Number(pacienteActualizado.id)
        )
        
        if (index > -1) {
          pacientes.value[index] = { ...pacienteActualizado }
          actualizarFuse()
        }
        
        loading.value = false
        resolve(pacienteActualizado)
      }, 1000)
    })
  }

  const eliminarPaciente = (pacienteId) => {
    const index = pacientes.value.findIndex(p => Number(p.id) === Number(pacienteId))
    if (index > -1) {
      pacientes.value[index].state = 'deleted'
      actualizarFuse()
    }
  }

  const seleccionarPaciente = (paciente) => {
    selectedPatient.value = { ...paciente }
  }

  const limpiarPacienteSeleccionado = () => {
    selectedPatient.value = null
  }

  const establecerBusqueda = (query) => {
    searchQuery.value = query
  }

  const establecerFiltroCiudad = (ciudad) => {
    cityFilter.value = ciudad
  }

  const establecerFiltroAlerta = (alerta) => {
    alertFilter.value = alerta
  }

  const limpiarFiltros = () => {
    searchQuery.value = ''
    cityFilter.value = null
    alertFilter.value = null
  }

  // Helper functions
  const generarNuevoId = () => {
    const numericIds = pacientes.value
      .map(p => Number(p.id))
      .filter(n => !Number.isNaN(n))
    
    const maxId = numericIds.length ? Math.max(...numericIds) : 0
    return maxId + 1
  }

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return '--'
    
    const birthDate = new Date(fechaNacimiento)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const formatearFecha = (dateString) => {
    if (!dateString) return 'Nunca'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES')
    } catch {
      return 'Fecha inválida'
    }
  }

  // Inicializar store
  cargarPacientes()

  return {
    // State
    pacientes,
    searchQuery,
    cityFilter,
    alertFilter,
    selectedPatient,
    loading,

    // Getters
    pacientesFiltrados,
    totalPacientes,
    pacientesConAlertas,
    ciudadesUnicas,
    opcionesCiudad,
    opcionesAlerta,

    // Actions
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

    // Helper functions
    calcularEdad,
    formatearFecha
  }
})