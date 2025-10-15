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
          :class="{ 'not-current': !isCurrentMonth(date) }"
          @dragover.prevent
          @drop="onDrop(date, hour)"
        >
          <div class="cell-events">
            <template v-if="getEvents(date, hour).length">
              <div
                v-for="event in getEvents(date, hour)"
                :key="event.id"
                class="event-card"
                draggable="true"
                @dragstart="onDragStart(event, date, hour)"
                @click="showDetail(event)"
                :title="event.type === 'cita' ? 'Cita' : 'Reserva'"
              >
                <span class="event-title">{{ event.title }}</span>
                <span class="event-type">{{ event.type === 'cita' ? 'Cita' : 'Reserva' }}</span>
              </div>
            </template>
            <template v-else>
              <span class="libre-label">libre</span>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import citasData from 'src/data/citas.json'
import reservasData from 'src/data/reservas.json'
import pacientes from 'src/data/pacientes.json'

export default {
  name: 'CalendarWeekPage',
  setup() {
    const router = useRouter()
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
      reservasData.reservas.forEach(reserva => {
        if (reserva.fechaReserva === dateStr && reserva.horaReserva === hour) {
          events.push({
            id: `reserva-${reserva.id}`,
            type: 'reserva',
            title: reserva.nombreCompleto,
            date: reserva.fechaReserva,
            hour: reserva.horaReserva
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
        const reserva = reservasData.reservas.find(r => `reserva-${r.id}` === confirmEvent.value.id)
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
      goToMonth
    }
  }
}
</script>

<style scoped>
.calendar-page-container {
  padding: 16px;
}
.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.calendar-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
}
.calendar-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 16px;
}
.week-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.week-header {
  font-weight: 600;
}
.calendar-row {
  display: flex;
}
.calendar-cell {
  flex: 1;
  min-height: 48px;
  border: 1px solid #222;
  position: relative;
  background: #f5f5f5;
  padding: 2px 4px;
  box-sizing: border-box;
}
.hour-label {
  min-width: 60px;
  background: #e0e0e0;
  text-align: center;
  font-weight: bold;
}
.day-label {
  background: #f5f5f5;
  text-align: center;
  border-bottom: 2px solid #222;
}
.not-current {
  background: #f0f0f0;
  color: #bbb;
}
.cell-events {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-height: 32px;
}
.event-card {
  background: #b2cfff;
  color: #222;
  border-radius: 4px;
  padding: 2px 6px;
  margin-bottom: 2px;
  font-size: 0.85rem;
  cursor: grab;
  border: 1px solid #1976d2;
  display: flex;
  gap: 4px;
  align-items: center;
}
.event-title {
  font-weight: bold;
}
.event-type {
  margin-left: 6px;
  font-size: 0.8em;
  color: #1976d2;
}
.libre-label {
  color: #888;
  font-size: 0.9em;
  font-weight: bold;
}
.exit-btn {
  align-self: flex-end;
}
body.body--dark .calendar-cell {
  background: #222;
  color: #fafafa;
  border-color: #444;
}
body.body--dark .hour-label {
  background: #18181b;
  color: #fafafa;
}
body.body--dark .day-label {
  background: #18181b;
  color: #fafafa;
  border-bottom: 2px solid #444;
}
body.body--dark .not-current {
  background: #18181b;
  color: #888;
}
body.body--dark .event-card {
  background: #1976d2;
  color: #fafafa;
  border-color: #90caf9;
}
</style>