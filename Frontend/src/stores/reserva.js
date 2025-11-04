// src/stores/reserva.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useReserveStore = defineStore('reserva', () => {
  // Estado general
  const estaAbierto = ref(false)
  const citas = ref([
    { id: 1, nombrePaciente: 'Pablo Martinez Valle', nombreSucursal: 'Sucursal 1', fecha: '17/9/2025', hora: '13:00', servicio: 'Limpieza Dental' },
    { id: 2, nombrePaciente: 'Maria Garcia Lopez', nombreSucursal: 'Sucursal 2', fecha: '20/9/2025', hora: '10:00', servicio: 'Ortodoncia' }
  ])
  const correoUsuario = ref('Cliente@gmail.com')

  const cargandoNuevaReserva = ref(false)
  const cargandoHistorial = ref(false)

  // --- NUEVA RESERVA ---
  const nuevaReserva = ref({
    patientType: 'me',
    service: null,
    clinic: null,
    date: '',
    time: ''
  })

  const pacienteOtro = ref({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    genero: '',
    parentesco: '',
    fechaNacimiento: '',
    telefono: ''
  })

  const currentStep = ref(0)
  const steps = ['Motivo', 'Clínica', 'Fecha y Hora', 'Validación']

  // --- Métodos ---
  const abrirModal = () => { estaAbierto.value = true }
  const cerrarModal = () => { 
    estaAbierto.value = false 
    resetForm()
  }

  const eliminarCita = (idCita) => {
    const indice = citas.value.findIndex(cita => cita.id === idCita)
    if (indice > -1) citas.value.splice(indice, 1)
  }

  const resetForm = () => {
    currentStep.value = 0
    nuevaReserva.value = { patientType: 'me', service: null, clinic: null, date: '', time: '' }
    pacienteOtro.value = { nombre: '', apellidoPaterno: '', apellidoMaterno: '', genero: '', parentesco: '', fechaNacimiento: '', telefono: '' }
  }

  const siguientePaso = () => { if (currentStep.value < 3) currentStep.value++ }
  const pasoAnterior = () => { if (currentStep.value > 0) currentStep.value-- }

  const seleccionarServicio = (id) => { nuevaReserva.value.service = id }
  const seleccionarClinica = (id) => { nuevaReserva.value.clinic = id }

  const simularCarga = () => new Promise(resolve => setTimeout(resolve, 1000))

  const enviarReserva = () => {
    citas.value.push({
      id: citas.value.length + 1,
      nombrePaciente: nuevaReserva.value.patientType === 'me' 
        ? 'Yo mismo' 
        : `${pacienteOtro.value.nombre} ${pacienteOtro.value.apellidoPaterno}`,
      nombreSucursal: nuevaReserva.value.clinic === 1 ? 'Sucursal 1' : 'Sucursal 2',
      fecha: nuevaReserva.value.date,
      hora: nuevaReserva.value.time,
      servicio: ['Limpieza Dental','Extracción','Ortodoncia','Endodoncia','Prótesis','Blanqueamiento'][nuevaReserva.value.service - 1] || 'Sin servicio'
    })
    cerrarModal()
  }

  // --- Computadas ---
  const modalAbierto = computed({
    get: () => estaAbierto.value,
    set: (valor) => (estaAbierto.value = valor)
  })

  return {
    correoUsuario,
    citas,
    estaAbierto,
    modalAbierto,
    cargandoNuevaReserva,
    cargandoHistorial,
    abrirModal,
    cerrarModal,
    eliminarCita,
    simularCarga,
    // Nueva reserva
    nuevaReserva,
    pacienteOtro,
    currentStep,
    steps,
    resetForm,
    siguientePaso,
    pasoAnterior,
    seleccionarServicio,
    seleccionarClinica,
    enviarReserva
  }
})
