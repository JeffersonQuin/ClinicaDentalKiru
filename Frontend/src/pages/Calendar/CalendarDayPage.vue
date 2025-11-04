<template>
  <div class="calendar-page-container">
    <div class="calendar-header">
      <h1>Calendario de Cita:</h1>
      <q-btn flat icon="fa-solid fa-arrow-right" label="Salir" class="exit-btn" @click="salir" />
    </div>
    <div class="calendar-controls">
      <q-btn-group>
        <q-btn flat label="&lt;&lt;" @click="prevDay" />
        <q-btn flat label="&gt;&gt;" @click="nextDay" />
      </q-btn-group>
      <span class="calendar-title">{{ dayTitle }}</span>
      <q-btn-group>
        <q-btn flat label="Día" @click="goToDay" :color="view==='day' ? 'primary' : 'grey-8'" />
        <q-btn flat label="Semana" @click="goToWeek" :color="view==='week' ? 'primary' : 'grey-8'" />
        <q-btn flat label="Mes" @click="goToMonth" :color="view==='month' ? 'primary' : 'grey-8'" />
      </q-btn-group>
    </div>
    <div class="calendar-grid day-grid">
      <div class="calendar-row day-header">
        <div class="calendar-cell hour-label">Hor</div>
        <div class="calendar-cell day-label">{{ dayName }}</div>
      </div>
      <div v-for="hour in hours" :key="hour" class="calendar-row">
        <div class="calendar-cell hour-label">{{ hour }}</div>
        <div
          class="calendar-cell"
          @dragover.prevent
          @drop="onDrop(hour)"
        >
          <div class="cell-events">
            <template v-if="getEvents(hour).length">
              <div
                v-for="event in getEvents(hour)"
                :key="event.id"
                class="event-card"
                draggable="true"
                @dragstart="onDragStart(event, hour)"
                @click="showDetail(event)"
                :title="event.type === 'cita' ? 'Cita' : 'Reserva'"
              >
                <span class="event-title">{{ event.title }}</span>
                <span class="event-type">{{ event.type === 'cita' ? 'Cita' : 'Reserva' }}</span>
              </div>
            </template>
            <template v-else>
              <span class="libre-label">Libre</span>
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
            <span class="text-h6">¿Seguro que quieres modificar la hora?</span>
          </div>
        </q-card-section>
        <q-card-section>
          <div>
            <b>{{ confirmEvent?.title }}</b> será movido a las <b>{{ confirmToHour }}</b>.
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
            <div><b>Fecha:</b> {{ formatDate(currentDateStr) }}</div>
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
  name: 'CalendarDayPage',
  setup() {
    const router = useRouter()
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

    // Genera todas las horas del día en formato HH:00
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)

    const currentDateStr = computed(() => currentDate.value.toISOString().slice(0, 10))

    const dayName = computed(() => {
      const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
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
      reservasData.reservas.forEach(reserva => {
        if (reserva.fechaReserva === dateStr && reserva.horaReserva === hour) {
          events.push({
            id: `reserva-${reserva.id}`,
            type: 'reserva',
            title: reserva.nombreCompleto,
            hour: reserva.horaReserva
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
    const setView = (v) => {
      view.value = v
    }
    const salir = () => {
      // Implementa la navegación según tu router
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

    // Drag & Drop para mover eventos
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
        const reserva = reservasData.reservas.find(r => `reserva-${r.id}` === confirmEvent.value.id)
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

    return {
      hours,
      dayName,
      dayTitle,
      prevDay,
      nextDay,
      setView,
      view,
      salir,
      getEvents,
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
      goToMonth
    }
  }
}
</script>

<!-- Los estilos están en app.scss global -->