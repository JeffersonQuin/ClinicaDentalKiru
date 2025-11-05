<template>
  <div class="calendar-page-container">
    <div class="calendar-header">
      <h1>Calendario de Cita:</h1>
      <q-btn flat icon="fa-solid fa-arrow-right" label="Salir" class="exit-btn" @click="salir" />
    </div>
    <div class="calendar-controls">
      <q-btn-group>
        <q-btn flat label="&lt;&lt;" @click="prevWeek" />
        <q-btn flat label="&gt;&gt;" @click="nextWeek" />
      </q-btn-group>
      <span class="calendar-title">{{ weekTitle }}</span>
      <q-btn-group>
        <q-btn flat label="Día" @click="goToDay" :color="view==='day' ? 'primary' : 'grey-8'" />
        <q-btn flat label="Semana" @click="goToWeek" :color="view==='week' ? 'primary' : 'grey-8'" />
        <q-btn flat label="Mes" @click="goToMonth" :color="view==='month' ? 'primary' : 'grey-8'" />
      </q-btn-group>
    </div>

    <!-- 👇 INFO DE RESERVAS CARGADAS -->
    <div class="reservas-info">
      <q-banner class="bg-primary text-white">
        <template v-slot:avatar>
          <q-icon name="fa-solid fa-calendar-check" />
        </template>
        Mostrando {{ reservasCompletas.length }} reservas en el calendario
      </q-banner>
    </div>

    <div class="calendar-grid week-grid">
      <div class="calendar-row week-header">
        <div class="calendar-cell hour-label">Hor</div>
        <div v-for="(day, idx) in weekDays" :key="idx" class="calendar-cell day-label">
          {{ day }} {{ weekDates[idx].getDate() }}
        </div>
      </div>
      <div v-for="hour in hours" :key="hour" class="calendar-row">
        <div class="calendar-cell hour-label">{{ hour }}</div>
        <div
          v-for="(date, dIdx) in weekDates"
          :key="dIdx"
          class="calendar-cell"
          :class="{ 
            'not-current': !isCurrentMonth(date),
            'bloqueado': estaHorarioBloqueado(date.toISOString().slice(0, 10), hour)
          }"
          @dragover.prevent
          @drop="onDrop(date, hour)"
          @click="handleCellClick(date, hour)"
        >
          <div class="cell-events">
            <template v-if="getEvents(date, hour).length">
              <div
                v-for="event in getEvents(date, hour)"
                :key="event.id"
                class="event-card"
                draggable="true"
                @dragstart="onDragStart(event, date, hour)"
                @click.stop="showDetail(event)"
                :title="event.type === 'cita' ? 'Cita' : 'Reserva'"
              >
                <span class="event-title">{{ event.title }}</span>
                <span class="event-type">{{ event.type === 'cita' ? 'Cita' : 'Reserva' }}</span>
                <span class="event-email" v-if="event.email">{{ event.email }}</span>
              </div>
            </template>
            <template v-else>
              <span 
                class="libre-label"
                :class="{ 'bloqueado-label': estaHorarioBloqueado(date.toISOString().slice(0, 10), hour) }"
              >
                {{ estaHorarioBloqueado(date.toISOString().slice(0, 10), hour) ? 'Bloqueado' : 'libre' }}
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para mover evento -->
    <q-dialog v-model="showConfirmDialog">
      <q-card>
        <q-card-section>
          <div class="row items-center">
            <i class="fa-solid fa-exclamation-triangle q-mr-sm" style="color:#e53935;font-size:2rem"></i>
            <span class="text-h6">¿Seguro que quieres modificar la fecha y hora?</span>
          </div>
        </q-card-section>
        <q-card-section>
          <div>
            <b>{{ confirmEvent?.title }}</b> será movido a <b>{{ formatDate(confirmToDate) }}</b> a las <b>{{ confirmToHour }}</b>.
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Confirmar" @click="confirmMoveEvent" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de detalle de evento -->
    <q-dialog v-model="showDetailDialog">
      <q-card>
        <q-card-section>
          <div class="row items-center">
            <i class="fa-solid fa-info-circle q-mr-sm" style="color:#1976d2;font-size:2rem"></i>
            <span class="text-h6">Detalle {{ detailEvent?.type === 'cita' ? 'Cita' : 'Reserva' }}</span>
          </div>
        </q-card-section>
        <q-card-section>
          <div v-if="detailEvent">
            <div><b>Fecha:</b> {{ formatDate(detailEvent.date) }}</div>
            <div><b>Hora:</b> {{ detailEvent.hour }}</div>
            <div v-if="detailEvent.type === 'cita'">
              <div><b>Paciente:</b> {{ getPacienteName(detailEvent.pacienteId) }}</div>
            </div>
            <div v-else>
              <div><b>Nombre:</b> {{ detailEvent.title }}</div>
              <div v-if="detailEvent.email"><b>Email:</b> {{ detailEvent.email }}</div>
              <div v-if="detailEvent.servicio"><b>Servicio:</b> {{ detailEvent.servicio }}</div>
              <div v-if="detailEvent.sucursal"><b>Sucursal:</b> {{ detailEvent.sucursal }}</div>
              <div v-if="detailEvent.dependiente">
                <b>Dependiente:</b> {{ detailEvent.dependiente.nombreCompleto }} ({{ detailEvent.dependiente.parentesco }})
              </div>
            </div>
            <div><b>Tipo:</b> {{ detailEvent.type === 'cita' ? 'Cita' : 'Reserva' }}</div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReserveStore } from 'src/stores/reserva' // 👈 Importar el store
import citasData from 'src/data/citas.json'
import pacientes from 'src/data/pacientes.json'

export default {
  name: 'CalendarWeekPage',
  setup() {
    const router = useRouter()
    const reserveStore = useReserveStore() // 👈 Usar el store
    
    const today = new Date()
    const currentWeekStart = ref(getStartOfWeek(today))
    const view = ref('week')
    const draggedEvent = ref(null)
    const draggedFromDate = ref(null)
    const draggedFromHour = ref(null)
    const showConfirmDialog = ref(false)
    const confirmEvent = ref(null)
    const confirmToDate = ref('')
    const confirmToHour = ref('')
    const showDetailDialog = ref(false)
    const detailEvent = ref(null)

    // 👇 TODAS LAS RESERVAS DESDE PINIA
    const reservasCompletas = computed(() => reserveStore.reservasCompletas || [])

    // Genera todas las horas del día en formato HH:00
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)

    function getStartOfWeek(date) {
      const d = new Date(date)
      const day = d.getDay() === 0 ? 7 : d.getDay()
      d.setDate(d.getDate() - (day - 1))
      d.setHours(0, 0, 0, 0)
      return d
    }

    const weekDays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']

    const weekDates = computed(() => {
      const dates = []
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart.value)
        date.setDate(date.getDate() + i)
        dates.push(date)
      }
      return dates
    })

    const weekTitle = computed(() => {
      const start = weekDates.value[0]
      const end = weekDates.value[6]
      return `${start.getDate()}-${end.getDate()} de ${start.toLocaleString('es-ES', { month: 'long' })} de ${start.getFullYear()}`
    })

    const isCurrentMonth = (date) => {
      const now = new Date()
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }

    const getPacienteName = (id) => {
      const paciente = pacientes.pacientes.find(p => Number(p.id) === Number(id))
      return paciente ? `${paciente.nombre} ${paciente.apellidoPaterno}` : 'No encontrado'
    }

    function getEvents(date, hour) {
      const dateStr = date.toISOString().slice(0, 10)
      const events = []
      
      // 👇 Citas (mantienes igual)
      citasData.citas.forEach(cita => {
        if (cita.fecha === dateStr && cita.hora === hour) {
          events.push({
            id: `cita-${cita.id}`,
            type: 'cita',
            title: getPacienteName(cita.pacienteId),
            date: cita.fecha,
            hour: cita.hora,
            pacienteId: cita.pacienteId
          })
        }
      })

      // 👇 RESERVAS DESDE PINIA (ACTUALIZADO)
      reservasCompletas.value.forEach(reserva => {
        if (reserva.fechaReserva === dateStr && reserva.horaReserva === hour) {
          events.push({
            id: `reserva-${reserva.id}`,
            type: 'reserva',
            title: reserva.nombreCompleto,
            date: reserva.fechaReserva,
            hour: reserva.horaReserva,
            email: reserva.gmail, // 👈 Agregar email
            servicio: reserva.servicio,
            sucursal: reserva.sucursal,
            dependiente: reserva.dependiente
          })
        }
      })
      
      return events
    }

    const prevWeek = () => {
      currentWeekStart.value.setDate(currentWeekStart.value.getDate() - 7)
      currentWeekStart.value = new Date(currentWeekStart.value)
    }
    
    const nextWeek = () => {
      currentWeekStart.value.setDate(currentWeekStart.value.getDate() + 7)
      currentWeekStart.value = new Date(currentWeekStart.value)
    }
    
    const setView = (v) => {
      view.value = v
      if (v === 'day') {
        router.push('/Calendar-Day')
      } else if (v === 'week') {
        router.push('/Calendar-Week')
      } else if (v === 'month') {
        router.push('/Calendar-Month')
      }
    }
    
    const salir = () => {
      // Implementa la navegación según tu router
    }

    // Drag & Drop para mover eventos
    const onDragStart = (event, fromDate, fromHour) => {
      draggedEvent.value = event
      draggedFromDate.value = fromDate
      draggedFromHour.value = fromHour
    }
    
    const onDrop = (toDate, toHour) => {
      if (!draggedEvent.value) return
      if (
        draggedFromDate.value.toISOString().slice(0, 10) === toDate.toISOString().slice(0, 10) &&
        draggedFromHour.value === toHour
      ) return
      confirmEvent.value = draggedEvent.value
      confirmToDate.value = toDate.toISOString().slice(0, 10)
      confirmToHour.value = toHour
      showConfirmDialog.value = true
    }
    
    const confirmMoveEvent = () => {
      if (!confirmEvent.value) return
      
      if (confirmEvent.value.type === 'cita') {
        const cita = citasData.citas.find(c => `cita-${c.id}` === confirmEvent.value.id)
        if (cita) {
          cita.fecha = confirmToDate.value
          cita.hora = confirmToHour.value
        }
      } else if (confirmEvent.value.type === 'reserva') {
        // 👇 RESERVAS DESDE PINIA (ACTUALIZADO)
        const reserva = reserveStore.reservas.find(r => `reserva-${r.id}` === confirmEvent.value.id)
        if (reserva) {
          reserva.fechaReserva = confirmToDate.value
          reserva.horaReserva = confirmToHour.value
        }
      }
      
      draggedEvent.value = null
      draggedFromDate.value = null
      draggedFromHour.value = null
      confirmEvent.value = null
      confirmToDate.value = ''
      confirmToHour.value = ''
    }

    // Modal de detalle
    const showDetail = (event) => {
      detailEvent.value = event
      showDetailDialog.value = true
    }

    // 👇 NUEVO: Manejar click en celda libre para bloquear/desbloquear
    const handleCellClick = (date, hour) => {
      // Solo permitir bloquear/desbloquear si no hay eventos (reservas o citas)
      const events = getEvents(date, hour)
      if (events.length > 0) {
        return // No hacer nada si hay eventos
      }

      const dateStr = date.toISOString().slice(0, 10)
      const estaBloqueado = reserveStore.estaHorarioBloqueado(dateStr, hour)

      if (estaBloqueado) {
        // Desbloquear
        reserveStore.desbloquearHorario(dateStr, hour)
      } else {
        // Bloquear
        reserveStore.bloquearHorario(dateStr, hour)
      }
    }

    // 👇 NUEVO: Verificar si un horario está bloqueado
    const estaHorarioBloqueado = (fecha, hora) => {
      return reserveStore.estaHorarioBloqueado(fecha, hora)
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'No disponible'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      } catch {
        return 'Fecha inválida'
      }
    }

    const goToDay = () => {
      router.push('/Calendar-Day')
    }
    
    const goToWeek = () => {
      router.push('/Calendar-Week')
    }
    
    const goToMonth = () => {
      router.push('/Calendar-Month')
    }

    // Cargar datos al montar el componente
    onMounted(() => {
      console.log('📅 Calendario Semanal cargado con TODAS las reservas:', reservasCompletas.value.length)
    })

    return {
      weekDays,
      weekDates,
      weekTitle,
      hours,
      prevWeek,
      nextWeek,
      setView,
      view,
      salir,
      getEvents,
      isCurrentMonth,
      onDragStart,
      onDrop,
      showConfirmDialog,
      confirmEvent,
      confirmToDate,
      confirmToHour,
      confirmMoveEvent,
      showDetailDialog,
      detailEvent,
      showDetail,
      formatDate,
      getPacienteName,
      goToDay,
      goToWeek,
      goToMonth,
      reservasCompletas, // 👈 Exportar para el template
      handleCellClick, // 👈 Funciones para bloquear/desbloquear
      estaHorarioBloqueado
    }
  }
}
</script>

<style scoped>
.reservas-info {
  margin: 10px 0;
}

.event-email {
  font-size: 0.7rem;
  color: #666;
  display: block;
  margin-top: 2px;
}

.calendar-cell.bloqueado {
  background-color: #ffebee !important;
  cursor: pointer;
}

.calendar-cell.bloqueado:hover {
  background-color: #ffcdd2 !important;
}

.bloqueado-label {
  color: #c62828;
  font-weight: bold;
}

/* Los estilos están en app.scss global */
</style>