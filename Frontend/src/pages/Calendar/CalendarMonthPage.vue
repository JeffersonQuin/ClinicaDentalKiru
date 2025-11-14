<template>
  <div class="page-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <i class="fa-solid fa-calendar-alt header-icon"></i>
          <div>
            <h1 class="page-title">Calendario Mensual</h1>
            <p class="page-subtitle">{{ monthYear }}</p>
          </div>
        </div>
        <q-btn
          flat
          icon="fa-solid fa-arrow-left"
          label="Volver"
          color="grey-8"
          @click="salir"
          no-caps
          size="md"
        />
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-icon-container total">
          <i class="fa-solid fa-calendar-check"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ reservasCompletas.length }}</div>
          <div class="stat-label">Reservas Totales</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-container alert">
          <i class="fa-solid fa-clock"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ getMonthEventsCount() }}</div>
          <div class="stat-label">Eventos este Mes</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-container city">
          <i class="fa-solid fa-calendar-days"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ new Date(currentYear, currentMonth + 1, 0).getDate() }}</div>
          <div class="stat-label">Días del Mes</div>
        </div>
      </div>
    </div>

    <!-- Navegación -->
    <div class="search-section">
      <div class="search-filters">
        <q-btn-group outline>
          <q-btn
            outline
            icon="fa-solid fa-chevron-left"
            label="Mes Anterior"
            @click="prevMonth"
            color="primary"
            no-caps
          />
          <q-btn
            outline
            icon="fa-solid fa-chevron-right"
            label="Mes Siguiente"
            @click="nextMonth"
            color="primary"
            no-caps
          />
        </q-btn-group>
        
        <q-btn-group outline>
          <q-btn
            outline
            label="Día"
            @click="goToDay"
            :color="view==='day' ? 'primary' : 'grey-8'"
            no-caps
          />
          <q-btn
            outline
            label="Semana"
            @click="goToWeek"
            :color="view==='week' ? 'primary' : 'grey-8'"
            no-caps
          />
          <q-btn
            outline
            label="Mes"
            @click="goToMonth"
            :color="view==='month' ? 'primary' : 'grey-8'"
            no-caps
          />
        </q-btn-group>
      </div>
    </div>

    <!-- Calendario -->
    <div class="table-container">
      <div class="table-header">
        <span class="table-title">Vista Mensual</span>
        <div class="table-actions">
          <q-btn
            flat
            icon="fa-solid fa-info-circle"
            color="primary"
            no-caps
            size="sm"
          >
            <q-tooltip>Arrastra eventos para cambiar fechas</q-tooltip>
          </q-btn>
        </div>
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
    </div>

    <!-- Modal de confirmación -->
    <q-dialog v-model="showConfirmDialog" persistent>
      <q-card class="confirm-dialog">
        <q-card-section class="dialog-header">
          <div class="dialog-icon-container">
            <i class="fa-solid fa-exclamation-triangle dialog-icon"></i>
          </div>
          <h3 class="dialog-title">¿Seguro que quieres modificar la fecha?</h3>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <p class="dialog-text">
            <b>{{ confirmEvent?.title }}</b> será movido a <b>{{ formatDate(confirmToDate) }}</b>.
          </p>
        </q-card-section>
        <q-card-actions class="dialog-actions">
          <q-btn 
            flat 
            label="Cancelar" 
            color="grey-7" 
            v-close-popup 
            no-caps
            class="dialog-btn"
          />
          <q-btn 
            unelevated
            label="Confirmar" 
            color="primary" 
            @click="confirmMoveEvent"
            v-close-popup 
            no-caps
            class="dialog-btn"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de detalle -->
    <q-dialog v-model="showDetailDialog">
      <q-card class="confirm-dialog">
        <q-card-section class="dialog-header">
          <div class="dialog-icon-container" :class="detailEvent?.type === 'cita' ? 'total' : 'alert'">
            <i :class="detailEvent?.type === 'cita' ? 'fa-solid fa-user-doctor' : 'fa-solid fa-calendar-check'"></i>
          </div>
          <h3 class="dialog-title">Detalle {{ detailEvent?.type === 'cita' ? 'Cita' : 'Reserva' }}</h3>
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
        <q-card-actions class="dialog-actions">
          <q-btn 
            flat 
            label="Cerrar" 
            color="primary" 
            v-close-popup 
            no-caps
            class="dialog-btn"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReserveStore } from 'src/stores/reserva'
import citasData from 'src/data/citas.json'
import pacientes from 'src/data/pacientes.json'

export default {
  name: 'CalendarMonthPage',
  setup() {
    const router = useRouter()
    const reserveStore = useReserveStore()
    
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

    const reservasCompletas = computed(() => reserveStore.reservasCompletas || [])

    const getPacienteName = (id) => {
      const paciente = pacientes.pacientes.find(p => Number(p.id) === Number(id))
      return paciente ? `${paciente.nombre} ${paciente.apellidoPaterno}` : 'No encontrado'
    }

    const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

    const monthMatrix = computed(() => {
      refreshKey.value
      const firstDay = new Date(currentYear.value, currentMonth.value, 1)
      const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
      const firstWeekDay = (firstDay.getDay() + 6) % 7
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

      reservasCompletas.value.forEach(reserva => {
        const cell = cells.find(c => c.date === reserva.fechaReserva)
        if (cell) {
          cell.events.push({
            id: `reserva-${reserva.id}`,
            type: 'reserva',
            time: reserva.horaReserva,
            title: reserva.nombreCompleto,
            date: reserva.fechaReserva,
            email: reserva.gmail,
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

    const getMonthEventsCount = () => {
      let count = 0
      monthMatrix.value.forEach(week => {
        week.forEach(cell => {
          if (cell.isCurrentMonth) {
            count += cell.events.length
          }
        })
      })
      return count
    }

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
    
    const goToDay = () => router.push('/Calendar-Day')
    const goToWeek = () => router.push('/Calendar-Week')
    const goToMonth = () => router.push('/Calendar-Month')
    
    const salir = () => {
      router.push({ name: 'home' })
    }

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
      if (changed) refreshKey.value++
    }

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
          month: 'long',
          day: 'numeric'
        })
      } catch {
        return 'Fecha inválida'
      }
    }

    onMounted(() => {
      console.log('📅 Calendario Mensual cargado con TODAS las reservas:', reservasCompletas.value.length)
    })

    return {
      weekDays,
      monthMatrix,
      monthYear,
      currentMonth,
      currentYear,
      prevMonth,
      nextMonth,
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
      reservasCompletas,
      getMonthEventsCount
    }
  }
}
</script>

<style scoped>
/* Los estilos están en app.scss global */
.event-email {
  font-size: 0.7rem;
  color: #666;
  display: block;
  margin-top: 2px;
}
</style>