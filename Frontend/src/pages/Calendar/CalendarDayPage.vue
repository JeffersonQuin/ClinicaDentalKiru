<template>
  <div class="page-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <i class="fa-solid fa-calendar-day header-icon"></i>
          <div>
            <h1 class="page-title">Calendario Diario</h1>
            <p class="page-subtitle">{{ dayTitle }}</p>
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
          <div class="stat-value">{{ getTodayEventsCount() }}</div>
          <div class="stat-label">Eventos del Día</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-container city">
          <i class="fa-solid fa-calendar-alt"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ dayName }}</div>
          <div class="stat-label">Día de la Semana</div>
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
            label="Anterior"
            @click="prevDay"
            color="primary"
            no-caps
          />
          <q-btn
            outline
            icon="fa-solid fa-chevron-right"
            label="Siguiente"
            @click="nextDay"
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
        <span class="table-title">Horario del Día</span>
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
      
      <div class="calendar-grid day-grid">
        <div class="calendar-row day-header">
          <div class="calendar-cell hour-label"><strong>Hora</strong></div>
          <div class="calendar-cell day-label"><strong>{{ dayName }}</strong></div>
        </div>
        
        <div v-for="hour in hours" :key="hour" class="calendar-row">
          <div class="calendar-cell hour-label">
            {{ hour }}
          </div>
          <div
            class="calendar-cell"
            :class="{ 'bloqueado': estaHorarioBloqueado(currentDateStr, hour) }"
            @dragover.prevent
            @drop="onDrop(hour)"
            @click="handleCellClick(hour)"
          >
            <div class="cell-events">
              <template v-if="getEvents(hour).length">
                <div
                  v-for="event in getEvents(hour)"
                  :key="event.id"
                  class="event-card"
                  draggable="true"
                  @dragstart="onDragStart(event, hour)"
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
                  :class="{ 'bloqueado-label': estaHorarioBloqueado(currentDateStr, hour) }"
                >
                  {{ estaHorarioBloqueado(currentDateStr, hour) ? 'Bloqueado' : 'Libre' }}
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
          <h3 class="dialog-title">¿Seguro que quieres modificar la hora?</h3>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <p class="dialog-text">
            <b>{{ confirmEvent?.title }}</b> será movido a las <b>{{ confirmToHour }}</b>.
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
            <div><b>Fecha:</b> {{ formatDate(currentDateStr) }}</div>
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
  name: 'CalendarDayPage',
  setup() {
    const router = useRouter()
    const reserveStore = useReserveStore()
    
    const today = new Date()
    const currentDate = ref(new Date(today.getFullYear(), today.getMonth(), today.getDate()))
    const view = ref('day')
    const draggedEvent = ref(null)
    const draggedFromHour = ref(null)
    const showConfirmDialog = ref(false)
    const confirmEvent = ref(null)
    const confirmToHour = ref('')
    const showDetailDialog = ref(false)
    const detailEvent = ref(null)

    const reservasCompletas = computed(() => reserveStore.reservasCompletas || [])
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)
    const currentDateStr = computed(() => currentDate.value.toISOString().slice(0, 10))

    const dayName = computed(() => {
      const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
      return days[currentDate.value.getDay()]
    })

    const dayTitle = computed(() => {
      return `${currentDate.value.getDate()} de ${currentDate.value.toLocaleString('es-ES', { month: 'long' })} de ${currentDate.value.getFullYear()}`
    })

    const getPacienteName = (id) => {
      const paciente = pacientes.pacientes.find(p => Number(p.id) === Number(id))
      return paciente ? `${paciente.nombre} ${paciente.apellidoPaterno}` : 'No encontrado'
    }

    function getEvents(hour) {
      const dateStr = currentDateStr.value
      const events = []
      
      citasData.citas.forEach(cita => {
        if (cita.fecha === dateStr && cita.hora === hour) {
          events.push({
            id: `cita-${cita.id}`,
            type: 'cita',
            title: getPacienteName(cita.pacienteId),
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

    const prevDay = () => {
      currentDate.value.setDate(currentDate.value.getDate() - 1)
      currentDate.value = new Date(currentDate.value)
    }
    
    const nextDay = () => {
      currentDate.value.setDate(currentDate.value.getDate() + 1)
      currentDate.value = new Date(currentDate.value)
    }
    
    const salir = () => {
      router.push({ name: 'home' })
    }

    const goToDay = () => router.push('/Calendar-Day')
    const goToWeek = () => router.push('/Calendar-Week')
    const goToMonth = () => router.push('/Calendar-Month')

    const onDragStart = (event, fromHour) => {
      draggedEvent.value = event
      draggedFromHour.value = fromHour
    }
    
    const onDrop = (toHour) => {
      if (!draggedEvent.value) return
      if (draggedFromHour.value === toHour) return
      confirmEvent.value = draggedEvent.value
      confirmToHour.value = toHour
      showConfirmDialog.value = true
    }
    
    const confirmMoveEvent = () => {
      if (!confirmEvent.value) return
      const dateStr = currentDateStr.value
      
      if (confirmEvent.value.type === 'cita') {
        const cita = citasData.citas.find(c => `cita-${c.id}` === confirmEvent.value.id)
        if (cita) {
          cita.fecha = dateStr
          cita.hora = confirmToHour.value
        }
      } else if (confirmEvent.value.type === 'reserva') {
        const reserva = reserveStore.reservas.find(r => `reserva-${r.id}` === confirmEvent.value.id)
        if (reserva) {
          reserva.fechaReserva = dateStr
          reserva.horaReserva = confirmToHour.value
        }
      }
      
      draggedEvent.value = null
      draggedFromHour.value = null
      confirmEvent.value = null
      confirmToHour.value = ''
    }

    const showDetail = (event) => {
      detailEvent.value = event
      showDetailDialog.value = true
    }

    const handleCellClick = (hour) => {
      const events = getEvents(hour)
      if (events.length > 0) return

      const dateStr = currentDateStr.value
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

    const getTodayEventsCount = () => {
      let count = 0
      hours.forEach(hour => {
        count += getEvents(hour).length
      })
      return count
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
      console.log('📅 Calendario cargado con TODAS las reservas:', reservasCompletas.value.length)
    })

    return {
      hours,
      dayName,
      dayTitle,
      prevDay,
      nextDay,
      view,
      salir,
      getEvents,
      getTodayEventsCount,
      onDragStart,
      onDrop,
      showConfirmDialog,
      confirmEvent,
      confirmToHour,
      confirmMoveEvent,
      showDetailDialog,
      detailEvent,
      showDetail,
      formatDate,
      currentDateStr,
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