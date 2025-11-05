<template>
  <div class="calendar-page-container">
    <div class="calendar-header">
      <h1>Calendario de Cita:</h1>
      <q-btn flat icon="fa-solid fa-arrow-right" label="Salir" class="exit-btn" @click="salir" />
    </div>
    <div class="calendar-controls">
      <q-btn-group>
        <q-btn flat label="&lt;&lt;" @click="prevMonth" />
        <q-btn flat label="&gt;&gt;" @click="nextMonth" />
      </q-btn-group>
      <span class="calendar-title">{{ monthYear }}</span>
      <q-btn-group>
        <q-btn
          flat
          label="Día"
          :color="view==='day' ? 'primary' : 'grey-8'"
          @click="goToDay"
        />
        <q-btn
          flat
          label="Semana"
          :color="view==='week' ? 'primary' : 'grey-8'"
          @click="goToWeek"
        />
        <q-btn
          flat
          label="Mes"
          :color="view==='month' ? 'primary' : 'grey-8'"
          @click="goToMonth"
        />
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

    <div class="calendar-grid">
      <div class="calendar-row calendar-days">
        <div v-for="day in weekDays" :key="day" class="calendar-cell day-label">{{ day }}</div>
      </div>
      <div v-for="(week, wIdx) in monthMatrix" :key="wIdx" class="calendar-row">
        <div
          v-for="(cell, dIdx) in week"
          :key="dIdx"
          class="calendar-cell"
          :class="{ 'not-current': !cell.isCurrentMonth }"
          @dragover.prevent
          @drop="onDrop(cell.date)"
        >
          <div class="cell-date">{{ cell.day }}</div>
          <div class="cell-events">
            <div
              v-for="event in cell.events"
              :key="event.id"
              class="event-card"
              draggable="true"
              @dragstart="onDragStart(event, cell.date)"
              @click="showDetail(event)"
              :title="event.type === 'cita' ? 'Cita' : 'Reserva'"
            >
              <span class="event-time">{{ event.time }}</span>
              <span class="event-title">{{ event.title }}</span>
              <span class="event-email" v-if="event.email">{{ event.email }}</span>
            </div>
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
            <span class="text-h6">¿Seguro que quieres modificar la fecha?</span>
          </div>
        </q-card-section>
        <q-card-section>
          <div>
            <b>{{ confirmEvent?.title }}</b> será movido a <b>{{ formatDate(confirmToDate) }}</b>.
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
            <div><b>Hora:</b> {{ detailEvent.time }}</div>
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
  name: 'CalendarMonthPage',
  setup() {
    const router = useRouter()
    const reserveStore = useReserveStore() // 👈 Usar el store
    
    const today = new Date()
    const currentMonth = ref(today.getMonth())
    const currentYear = ref(today.getFullYear())
    const view = ref('month')
    const draggedEvent = ref(null)
    const draggedFromDate = ref(null)
    const showConfirmDialog = ref(false)
    const confirmEvent = ref(null)
    const confirmToDate = ref('')
    const showDetailDialog = ref(false)
    const detailEvent = ref(null)
    const refreshKey = ref(0)

    // 👇 TODAS LAS RESERVAS DESDE PINIA
    const reservasCompletas = computed(() => reserveStore.reservasCompletas || [])

    const getPacienteName = (id) => {
      const paciente = pacientes.pacientes.find(p => Number(p.id) === Number(id))
      return paciente ? `${paciente.nombre} ${paciente.apellidoPaterno}` : 'No encontrado'
    }

    const weekDays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']

    const monthMatrix = computed(() => {
      refreshKey.value
      const firstDay = new Date(currentYear.value, currentMonth.value, 1)
      const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
      const firstWeekDay = (firstDay.getDay() + 6) % 7 // Lunes=0
      const daysInMonth = lastDay.getDate()
      const prevMonthDays = firstWeekDay
      const totalCells = Math.ceil((prevMonthDays + daysInMonth) / 7) * 7

      const cells = []
      for (let i = 0; i < totalCells; i++) {
        const date = new Date(currentYear.value, currentMonth.value, i - prevMonthDays + 1)
        const isCurrentMonth = date.getMonth() === currentMonth.value
        cells.push({
          day: date.getDate(),
          date: date.toISOString().slice(0, 10),
          isCurrentMonth,
          events: []
        })
      }

      // 👇 Citas (mantienes igual)
      citasData.citas.forEach(cita => {
        const cell = cells.find(c => c.date === cita.fecha)
        if (cell) {
          cell.events.push({
            id: `cita-${cita.id}`,
            type: 'cita',
            time: cita.hora,
            title: getPacienteName(cita.pacienteId),
            date: cita.fecha,
            pacienteId: cita.pacienteId
          })
        }
      })

      // 👇 RESERVAS DESDE PINIA (ACTUALIZADO)
      reservasCompletas.value.forEach(reserva => {
        const cell = cells.find(c => c.date === reserva.fechaReserva)
        if (cell) {
          cell.events.push({
            id: `reserva-${reserva.id}`,
            type: 'reserva',
            time: reserva.horaReserva,
            title: reserva.nombreCompleto,
            date: reserva.fechaReserva,
            email: reserva.gmail, // 👈 Agregar email
            servicio: reserva.servicio,
            sucursal: reserva.sucursal,
            dependiente: reserva.dependiente
          })
        }
      })

      const matrix = []
      for (let i = 0; i < cells.length; i += 7) {
        matrix.push(cells.slice(i, i + 7))
      }
      return matrix
    })

    const monthYear = computed(() => {
      const date = new Date(currentYear.value, currentMonth.value)
      return date.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(/^./, m => m.toUpperCase())
    })

    const prevMonth = () => {
      if (currentMonth.value === 0) {
        currentMonth.value = 11
        currentYear.value--
      } else {
        currentMonth.value--
      }
    }
    
    const nextMonth = () => {
      if (currentMonth.value === 11) {
        currentMonth.value = 0
        currentYear.value++
      } else {
        currentMonth.value++
      }
    }
    
    const setView = (v) => {
      view.value = v
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
    
    const salir = () => {
      router.push({ name: 'home' })
    }

    // Drag & Drop para mover eventos
    const onDragStart = (event, fromDate) => {
      draggedEvent.value = event
      draggedFromDate.value = fromDate
    }
    
    const onDrop = (toDate) => {
      if (!draggedEvent.value) return
      if (draggedFromDate.value === toDate) return
      confirmEvent.value = draggedEvent.value
      confirmToDate.value = toDate
      showConfirmDialog.value = true
    }
    
    const confirmMoveEvent = () => {
      if (!confirmEvent.value) return
      let changed = false
      
      if (confirmEvent.value.type === 'cita') {
        const cita = citasData.citas.find(c => `cita-${c.id}` === confirmEvent.value.id)
        if (cita && cita.fecha !== confirmToDate.value) {
          cita.fecha = confirmToDate.value
          changed = true
        }
      } else if (confirmEvent.value.type === 'reserva') {
        // 👇 RESERVAS DESDE PINIA (ACTUALIZADO)
        const reserva = reserveStore.reservas.find(r => `reserva-${r.id}` === confirmEvent.value.id)
        if (reserva && reserva.fechaReserva !== confirmToDate.value) {
          reserva.fechaReserva = confirmToDate.value
          changed = true
        }
      }
      
      draggedEvent.value = null
      draggedFromDate.value = null
      confirmEvent.value = null
      confirmToDate.value = ''
      if (changed) refreshKey.value++ // Fuerza el refresco del calendario
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

    // Cargar datos al montar el componente
    onMounted(() => {
      console.log('📅 Calendario Mensual cargado con TODAS las reservas:', reservasCompletas.value.length)
    })

    return {
      weekDays,
      monthMatrix,
      monthYear,
      prevMonth,
      nextMonth,
      setView,
      view,
      goToDay,
      goToWeek,
      goToMonth,
      salir,
      onDragStart,
      onDrop,
      showConfirmDialog,
      confirmEvent,
      confirmToDate,
      confirmMoveEvent,
      showDetailDialog,
      detailEvent,
      showDetail,
      formatDate,
      getPacienteName,
      reservasCompletas // 👈 Exportar para el template
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

/* Los estilos están en app.scss global */
</style>