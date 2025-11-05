// src/stores/reserva.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Importar ambos JSONs
import reservasData from '../data/reservas.json'
import dependientesData from '../data/dependientes.json'
import citasData from '../data/citas.json'

export const useReserveStore = defineStore('reserva', () => {
  // Estado general
  const estaAbierto = ref(false)
  const correoUsuario = ref('Pedro@gmail.com')// Simulación de usuario logueado
  const cargandoNuevaReserva = ref(false)
  const cargandoHistorial = ref(false)

  // 👇 NUEVO: Estados separados para reservas y dependientes
  const reservas = ref([])
  const dependientes = ref([])

  // 👇 NUEVO: Horarios bloqueados (formato: { "2025-10-16": ["10:00", "14:00"], ... })
  const horariosBloqueados = ref({})

  // --- NUEVA RESERVA --- (mantienes esta parte igual)
  const nuevaReserva = ref({
    patientType: 'me',
    service: null,
    clinic: null,
    date: '',
    time: ''
  })

  const pacienteOtro = ref({
    nombreCompleto: '', // 👈 Cambiado para coincidir con tu JSON
    genero: '',
    parentesco: '',
    telefono: ''
  })

  const currentStep = ref(0)
  const steps = ['Motivo', 'Clínica', 'Fecha y Hora', 'Validación']

  // --- MÉTODOS DE CARGA DE DATOS ---
  const cargarDatos = () => {
    try {
      console.log('📥 Cargando datos desde JSONs...')
      reservas.value = reservasData.reservas || []
      dependientes.value = dependientesData.dependientes || []
      console.log('✅ Datos cargados:', {
        reservas: reservas.value.length,
        dependientes: dependientes.value.length
      })
    } catch (error) {
      console.error('❌ Error cargando datos:', error)
      reservas.value = []
      dependientes.value = []
    }
  }

  // --- COMPUTED PARA RELACIONES ---
  // 👇 RELACIÓN: Reservas con información completa de dependientes
  const reservasCompletas = computed(() => {
    return reservas.value.map(reserva => {
      const dependiente = reserva.dependienteId 
        ? dependientes.value.find(d => d.id === reserva.dependienteId)
        : null
      
      return {
        ...reserva,
        dependiente: dependiente || null
      }
    })
  })

  // 👇 Obtener dependientes de un usuario específico
  const dependientesDelUsuario = computed(() => {
    return (emailTitular) => {
      return dependientes.value.filter(d => d.emailTitular === emailTitular)
    }
  })

  // 👇 Reservas del usuario actual
  const reservasDelUsuario = computed(() => {
    return reservasCompletas.value.filter(reserva => 
      reserva.gmail === correoUsuario.value
    )
  })

  // --- MÉTODOS EXISTENTES (actualizados) ---
  const abrirModal = () => { estaAbierto.value = true }
  
  const cerrarModal = () => { 
    estaAbierto.value = false 
    resetForm()
  }

  // 👇 ACTUALIZADO: eliminar reserva
  const eliminarReserva = (idReserva) => {
    const indice = reservas.value.findIndex(reserva => reserva.id === idReserva)
    if (indice > -1) {
      reservas.value.splice(indice, 1)
      console.log('🗑️ Reserva eliminada:', idReserva)
    }
  }

  const resetForm = () => {
    currentStep.value = 0
    nuevaReserva.value = { 
      patientType: 'me', 
      service: null, 
      clinic: null, 
      date: '', 
      time: '' 
    }
    pacienteOtro.value = { 
      nombreCompleto: '', 
      genero: '', 
      parentesco: '', 
      telefono: '' 
    }
  }

  const siguientePaso = () => { 
    if (currentStep.value < steps.length - 1) currentStep.value++ 
  }
  
  const pasoAnterior = () => { 
    if (currentStep.value > 0) currentStep.value-- 
  }

  const seleccionarServicio = (id) => { nuevaReserva.value.service = id }
  const seleccionarClinica = (id) => { nuevaReserva.value.clinic = id }

  const simularCarga = () => new Promise(resolve => setTimeout(resolve, 1000))

  // 👇 ACTUALIZADO: enviar reserva con nueva estructura
  const enviarReserva = async () => {
    try {
      cargandoNuevaReserva.value = true
      await simularCarga()

      let dependienteId = null

      // Si es para otro paciente, crear dependiente primero
      if (nuevaReserva.value.patientType === 'other') {
        const nuevoDependiente = {
          id: generarNuevoIdDependiente(),
          nombreCompleto: pacienteOtro.value.nombreCompleto,
          genero: pacienteOtro.value.genero,
          parentesco: pacienteOtro.value.parentesco,
          telefono: pacienteOtro.value.telefono,
          emailTitular: correoUsuario.value
        }
        
        dependientes.value.push(nuevoDependiente)
        dependienteId = nuevoDependiente.id
        console.log('👨‍👦 Nuevo dependiente creado:', nuevoDependiente)
      }

      // Crear la reserva
      const nuevaReservaData = {
        id: generarNuevoIdReserva(),
        fechaReserva: formatearFechaParaJSON(nuevaReserva.value.date),
        horaReserva: nuevaReserva.value.time,
        nombreCompleto: nuevaReserva.value.patientType === 'me' 
          ? 'Yo mismo' 
          : pacienteOtro.value.nombreCompleto,
        gmail: correoUsuario.value,
        dependienteId: dependienteId,
        servicio: obtenerNombreServicio(nuevaReserva.value.service),
        sucursal: obtenerNombreClinica(nuevaReserva.value.clinic)
      }

      reservas.value.push(nuevaReservaData)
      console.log('✅ Nueva reserva creada:', nuevaReservaData)
      
      cerrarModal()
      return true
      
    } catch (error) {
      console.error('❌ Error al enviar reserva:', error)
      return false
    } finally {
      cargandoNuevaReserva.value = false
    }
  }

  // --- MÉTODOS AUXILIARES ---
  const generarNuevoIdReserva = () => {
    return reservas.value.length > 0 
      ? Math.max(...reservas.value.map(r => r.id)) + 1 
      : 1
  }

  const generarNuevoIdDependiente = () => {
    return dependientes.value.length > 0 
      ? Math.max(...dependientes.value.map(d => d.id)) + 1 
      : 1
  }

  const formatearFechaParaJSON = (fecha) => {
  if (!fecha) return ''
  
  console.log('📅 Fecha original:', fecha) // Para debugging
  
  // Si ya está en formato YYYY-MM-DD, dejarlo igual
  if (fecha.includes('-') && fecha.split('-')[0].length === 4) {
    return fecha
  }
  
  // Si viene de q-date: "YYYY/MM/DD" → convertir a "YYYY-MM-DD"
  if (fecha.includes('/') && fecha.split('/')[0].length === 4) {
    const [year, month, day] = fecha.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }
  
  // Si está en formato DD/MM/YYYY
  if (fecha.includes('/') && fecha.split('/')[0].length === 2) {
    const [day, month, year] = fecha.split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }
  
  console.warn('⚠️ Formato de fecha no reconocido:', fecha)
  return fecha
}

  const obtenerNombreServicio = (id) => {
    const servicios = [
      'Limpieza Dental', 'Extracción', 'Ortodoncia', 
      'Endodoncia', 'Prótesis', 'Blanqueamiento'
    ]
    return servicios[id - 1] || 'Sin servicio'
  }

  const obtenerNombreClinica = (id) => {
    return id === 1 ? 'Sucursal 1' : 'Sucursal 2'
  }

  // 👇 NUEVO: Funciones para bloquear/desbloquear horarios
  const bloquearHorario = (fecha, hora) => {
    // Normalizar la fecha al formato YYYY-MM-DD
    let fechaNormalizada = fecha
    if (fecha.includes('/')) {
      const [year, month, day] = fecha.split('/')
      fechaNormalizada = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    if (!horariosBloqueados.value[fechaNormalizada]) {
      horariosBloqueados.value[fechaNormalizada] = []
    }

    // Agregar el horario si no está ya bloqueado
    if (!horariosBloqueados.value[fechaNormalizada].includes(hora)) {
      horariosBloqueados.value[fechaNormalizada].push(hora)
      console.log(`🔒 Horario bloqueado: ${fechaNormalizada} ${hora}`)
    }
  }

  const desbloquearHorario = (fecha, hora) => {
    // Normalizar la fecha al formato YYYY-MM-DD
    let fechaNormalizada = fecha
    if (fecha.includes('/')) {
      const [year, month, day] = fecha.split('/')
      fechaNormalizada = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    if (horariosBloqueados.value[fechaNormalizada]) {
      const index = horariosBloqueados.value[fechaNormalizada].indexOf(hora)
      if (index > -1) {
        horariosBloqueados.value[fechaNormalizada].splice(index, 1)
        console.log(`🔓 Horario desbloqueado: ${fechaNormalizada} ${hora}`)
        
        // Si no quedan horarios bloqueados para esa fecha, eliminar la clave
        if (horariosBloqueados.value[fechaNormalizada].length === 0) {
          delete horariosBloqueados.value[fechaNormalizada]
        }
      }
    }
  }

  const estaHorarioBloqueado = (fecha, hora) => {
    // Normalizar la fecha al formato YYYY-MM-DD
    let fechaNormalizada = fecha
    if (fecha.includes('/')) {
      const [year, month, day] = fecha.split('/')
      fechaNormalizada = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    return horariosBloqueados.value[fechaNormalizada]?.includes(hora) || false
  }

  // 👇 NUEVO: Función para obtener horarios disponibles para una fecha
  // Esta función verifica tanto reservas como citas para determinar qué horarios están ocupados
  // Usa el mismo rango de horarios que CalendarDayPage.vue (00:00 hasta 23:00 - 24 horas completas)
  const obtenerHorariosDisponibles = (fecha) => {
    // Genera todas las horas del día en formato HH:00 (igual que CalendarDayPage.vue)
    const todosLosHorarios = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)
    
    if (!fecha) {
      // Si no hay fecha seleccionada, retornar todos los horarios disponibles (00:00 a 23:00)
      return todosLosHorarios
    }

    // Normalizar la fecha al formato YYYY-MM-DD
    let fechaNormalizada = fecha
    if (fecha.includes('/')) {
      // Si viene de q-date: "YYYY/MM/DD" → convertir a "YYYY-MM-DD"
      const [year, month, day] = fecha.split('/')
      fechaNormalizada = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    // Obtener horarios ocupados de las reservas
    // Las reservas ya están en formato HH:00, así que coinciden directamente
    const horariosOcupadosReservas = reservasCompletas.value
      .filter(reserva => reserva.fechaReserva === fechaNormalizada)
      .map(reserva => reserva.horaReserva)

    // Obtener horarios ocupados de las citas
    // Las citas pueden tener formato HH:00 o HH:30, etc.
    const horariosOcupadosCitas = citasData.citas
      .filter(cita => cita.fecha === fechaNormalizada)
      .map(cita => {
        const hora = cita.hora
        const [horaNum, minutos] = hora.split(':')
        const horaEnFormato = `${horaNum.padStart(2, '0')}:00` // Convertir a formato HH:00
        
        // Si la cita tiene minutos diferentes a :00 (ej: "15:30"), 
        // también bloquear la hora exacta (ej: "15:00") para evitar conflictos
        // ya que las citas típicamente duran al menos 30 minutos
        if (minutos !== '00') {
          return [horaEnFormato, hora] // Bloquear tanto "15:00" como "15:30"
        }
        return horaEnFormato
      })
      .flat() // Aplanar el array si hay múltiples valores

    // Obtener horarios bloqueados para esta fecha
    const horariosBloqueadosFecha = horariosBloqueados.value[fechaNormalizada] || []

    // Combinar todos los horarios ocupados (reservas + citas + bloqueados) y eliminar duplicados
    const horariosOcupados = [...new Set([...horariosOcupadosReservas, ...horariosOcupadosCitas, ...horariosBloqueadosFecha])]

    // Filtrar los horarios disponibles (excluir los ocupados)
    // Verificar coincidencia exacta o si el horario ocupado tiene la misma hora base
    const horariosDisponibles = todosLosHorarios.filter(horario => {
      // Verificar coincidencia exacta
      if (horariosOcupados.includes(horario)) {
        return false
      }
      // Verificar si algún horario ocupado tiene la misma hora base pero diferentes minutos
      // (ej: "15:30" bloquea "15:00")
      const horaDelHorario = horario.split(':')[0]
      const estaOcupadoPorMinutos = horariosOcupados.some(ocupado => {
        const horaOcupada = ocupado.split(':')[0]
        return horaDelHorario === horaOcupada && ocupado !== horario
      })
      return !estaOcupadoPorMinutos
    })

    return horariosDisponibles
  }

  // --- COMPUTADAS EXISTENTES ---
  const modalAbierto = computed({
    get: () => estaAbierto.value,
    set: (valor) => (estaAbierto.value = valor)
  })

  // Cargar datos al inicializar el store
  cargarDatos()

  return {
    // Estado general
    correoUsuario,
    estaAbierto,
    modalAbierto,
    cargandoNuevaReserva,
    cargandoHistorial,
    
    // 👇 NUEVO: Estados de datos
    reservas,
    dependientes,
    reservasCompletas, // 👈 Esta es la que usarás en componentes
    reservasDelUsuario,
    dependientesDelUsuario,
    
    // Métodos de datos
    cargarDatos,
    eliminarReserva, // 👈 Cambiado de eliminarCita
    
    // Nueva reserva (mantienes igual)
    nuevaReserva,
    pacienteOtro,
    currentStep,
    steps,
    abrirModal,
    cerrarModal,
    resetForm,
    siguientePaso,
    pasoAnterior,
    seleccionarServicio,
    seleccionarClinica,
    enviarReserva,
    simularCarga,
    obtenerHorariosDisponibles, // 👈 Nueva función exportada
    bloquearHorario, // 👈 Funciones para bloquear/desbloquear horarios
    desbloquearHorario,
    estaHorarioBloqueado,
    horariosBloqueados // 👈 Estado de horarios bloqueados
  }
})