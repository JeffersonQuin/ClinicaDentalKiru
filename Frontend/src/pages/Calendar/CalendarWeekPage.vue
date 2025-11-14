<template>
  <div class="page-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <i class="fa-solid fa-calendar-week header-icon"></i>
          <div>
            <h1 class="page-title">Calendario Semanal</h1>
            <p class="page-subtitle">{{ weekTitle }}</p>
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
          <div class="stat-value">{{ getWeekEventsCount() }}</div>
          <div class="stat-label">Eventos esta Semana</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-container city">
          <i class="fa-solid fa-calendar-alt"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">7</div>
          <div class="stat-label">Días Visualizados</div>
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
            label="Semana Anterior"
            @click="prevWeek"
            color="primary"
            no-caps
          />
          <q-btn
            outline
            icon="fa-solid fa-chevron-right"
            label="Semana Siguiente"
            @click="nextWeek"
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
        <span class="table-title">Horario Semanal</span>
        <div class="table-actions">
          <q-btn
            flat
            icon="fa-solid fa-info-circle"
            color="primary"
            no-caps
            size="sm"
          >
            <q-tooltip>Click en celdas vacías para bloquear/desbloquear</q-tooltip>
          </q-btn>
        </div>
      </div>
      
      <div class="calendar-grid week-grid">
        <div class="calendar-row week-header">
          <div class="calendar-cell hour-label"><strong>Hora</strong></div>
          <div v-for="(day, idx) in weekDays" :key="idx" class="calendar-cell day-label">
            {{ day }} {{ weekDates[idx].getDate() }}
          </div>
        </div>
        
        <div v-for="hour in hours" :key="hour" class="calendar-row">
          <div class="calendar-cell hour-label">
            {{ hour }}
          </div>
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
    </div>

    <!-- Modal de confirmación -->
    <q-dialog v-model="showConfirmDialog" persistent>
      <q-card class="confirm-dialog">
        <q-card-section class="dialog-header">
          <div class="dialog-icon-container">
            <i class="fa-solid fa-exclamation-triangle dialog-icon"></i>
          </div>
          <h3 class="dialog-title">¿Seguro que quieres modificar la fecha y hora?</h3>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <p class="dialog-text">
            <b>{{ confirmEvent?.title }}</b> será movido a <b>{{ formatDate(confirmToDate) }}</b> a las <b>{{ confirmToHour }}</b>.
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
  name: 'CalendarWeekPage',
  setup() {
    const router = useRouter()
    const reserveStore = useReserveStore()
    
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

    const reservasCompletas = computed(() => reserveStore.reservasCompletas || [])
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)

    function getStartOfWeek(date) {
      const d = new Date(date)
      const day = d.getDay() === 0 ? 7 : d.getDay()
      d.setDate(d.getDate() - (day - 1))
      d.setHours(0, 0, 0, 0)
      return d
    }

    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

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

      reservasCompletas.value.forEach(reserva => {
        if (reserva.fechaReserva === dateStr && reserva.horaReserva === hour) {
          events.push({
            id: `reserva-${reserva.id}`,
            type: 'reserva',
            title: reserva.nombreCompleto,
            date: reserva.fechaReserva,
            hour: reserva.horaReserva,
            email: reserva.gmail,
            servicio: reserva.servicio,
            sucursal: reserva.sucursal,
            dependiente: reserva.dependiente
          })
        }
      })
      
      return events
    }

    const getWeekEventsCount = () => {
      let count = 0
      weekDates.value.forEach(date => {
        hours.forEach(hour => {
          count += getEvents(date, hour).length
        })
      })
      return count
    }

    const prevWeek = () => {
      currentWeekStart.value.setDate(currentWeekStart.value.getDate() - 7)
      currentWeekStart.value = new Date(currentWeekStart.value)
    }
    
    const nextWeek = () => {
      currentWeekStart.value.setDate(currentWeekStart.value.getDate() + 7)
      currentWeekStart.value = new Date(currentWeekStart.value)
    }
    
    const salir = () => {
      router.push({ name: 'home' })
    }

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

    const showDetail = (event) => {
      detailEvent.value = event
      showDetailDialog.value = true
    }

    const handleCellClick = (date, hour) => {
      const events = getEvents(date, hour)
      if (events.length > 0) return

      const dateStr = date.toISOString().slice(0, 10)
      const estaBloqueado = reserveStore.estaHorarioBloqueado(dateStr, hour)

      if (estaBloqueado) {
        reserveStore.desbloquearHorario(dateStr, hour)
      } else {
        reserveStore.bloquearHorario(dateStr, hour)
      }
    }

    const estaHorarioBloqueado = (fecha, hora) => {
      return reserveStore.estaHorarioBloqueado(fecha, hora)
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

    const goToDay = () => router.push('/Calendar-Day')
    const goToWeek = () => router.push('/Calendar-Week')
    const goToMonth = () => router.push('/Calendar-Month')

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
      view,
      salir,
      getEvents,
      getWeekEventsCount,
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
      reservasCompletas,
      handleCellClick,
      estaHorarioBloqueado
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