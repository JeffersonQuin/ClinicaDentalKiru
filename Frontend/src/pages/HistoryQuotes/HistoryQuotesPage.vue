<template>
  <div class="page-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <i class="fa-solid fa-calendar-days header-icon"></i>
          <div>
            <h1 class="page-title">Historial de Citas</h1>
            <p class="page-subtitle">Consulta las citas y reservas en el rango de fechas seleccionado</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtro por rango de fechas -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <label class="filter-label">Fecha de Inicio</label>
          <q-input
            v-model="fechaInicio"
            type="date"
            filled
            dense
            class="filter-input"
          />
        </div>
        <div class="filter-group">
          <label class="filter-label">Fecha Final</label>
          <q-input
            v-model="fechaFinal"
            type="date"
            filled
            dense
            class="filter-input"
          />
        </div>
        <q-btn
          label="Buscar"
          icon="fa-solid fa-search"
          color="primary"
          @click="filtrarHistorial"
          class="search-btn"
        />
      </div>
    </div>

    <!-- Resultados de Citas -->
    <div class="results-section">
      <h2 class="results-title">Citas</h2>
      <div class="cards-container">
        <template v-if="citasFiltradas.length">
          <div
            v-for="cita in citasFiltradas"
            :key="cita.id"
            class="info-card"
          >
            <div class="card-header">
              <i class="fa-solid fa-calendar-check card-icon"></i>
              <span class="card-title">{{ cita.asunto }}</span>
            </div>
            <div class="card-content">
              <div><b>Dentista:</b> {{ getDentistaName(cita.dentistaId) }}</div>
              <div><b>Paciente:</b> {{ getPacienteName(cita.pacienteId) }}</div>
              <div><b>Fecha:</b> {{ cita.fecha }}</div>
              <div><b>Hora:</b> {{ cita.hora }}</div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="no-data-container">
            <i class="fa-solid fa-calendar-xmark no-data-icon"></i>
            <p class="no-data-text">No se encontraron citas en el rango seleccionado</p>
          </div>
        </template>
      </div>
    </div>

    <!-- Resultados de Reservas -->
    <div class="results-section">
      <h2 class="results-title">Reservas</h2>
      <div class="cards-container">
        <template v-if="reservasFiltradas.length">
          <div
            v-for="reserva in reservasFiltradas"
            :key="reserva.id"
            class="info-card"
          >
            <div class="card-header">
              <i class="fa-solid fa-calendar-day card-icon"></i>
              <span class="card-title">Reserva de {{ reserva.nombreCompleto }}</span>
            </div>
            <div class="card-content">
              <div><b>Fecha Reserva:</b> {{ reserva.fechaReserva }}</div>
              <div><b>Hora Reserva:</b> {{ reserva.horaReserva }}</div>
              <div><b>Gmail:</b> {{ reserva.gmail }}</div>
              <div v-if="reserva.dependiente">
                <b>Dependiente:</b> {{ reserva.dependiente.nombreCompleto }}<br>
                <b>Género:</b> {{ reserva.dependiente.genero }}<br>
                <b>Parentesco:</b> {{ reserva.dependiente.parentesco }}<br>
                <b>Teléfono:</b> {{ reserva.dependiente.telefono }}
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="no-data-container">
            <i class="fa-solid fa-calendar-xmark no-data-icon"></i>
            <p class="no-data-text">No se encontraron reservas en el rango seleccionado</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import citasData from 'src/data/citas.json'
import reservasData from 'src/data/reservas.json'
import pacientes from 'src/data/pacientes.json'
import dentistas from 'src/data/dentistas.json'

export default {
  name: 'HistoryQuotesPage',
  setup() {
    const fechaInicio = ref('')
    const fechaFinal = ref('')
    const citasFiltradas = ref([])
    const reservasFiltradas = ref([])

    // Utilidades para mostrar nombres
    const getPacienteName = (id) => {
      const paciente = pacientes.pacientes.find(p => Number(p.id) === Number(id))
      return paciente ? `${paciente.nombre} ${paciente.apellidoPaterno}` : 'No encontrado'
    }
    const getDentistaName = (id) => {
      const dentista = dentistas.dentistas.find(d => Number(d.id) === Number(id))
      return dentista ? `${dentista.nombre} ${dentista.apellidoPaterno}` : 'No encontrado'
    }

    const filtrarHistorial = () => {
      // Filtrar citas
      citasFiltradas.value = citasData.citas.filter(cita => {
        if (!fechaInicio.value || !fechaFinal.value) return false
        const fechaCita = new Date(cita.fecha)
        const inicio = new Date(fechaInicio.value)
        const fin = new Date(fechaFinal.value)
        return fechaCita >= inicio && fechaCita <= fin
      })

      // Filtrar reservas
      reservasFiltradas.value = reservasData.reservas.filter(reserva => {
        if (!fechaInicio.value || !fechaFinal.value) return false
        const fechaReserva = new Date(reserva.fechaReserva)
        const inicio = new Date(fechaInicio.value)
        const fin = new Date(fechaFinal.value)
        return fechaReserva >= inicio && fechaReserva <= fin
      })
    }

    return {
      fechaInicio,
      fechaFinal,
      citasFiltradas,
      reservasFiltradas,
      filtrarHistorial,
      getPacienteName,
      getDentistaName
    }
  }
}
</script>

<style scoped>
.filter-section {
  margin-bottom: 24px;
}
.filter-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}
.filter-group {
  display: flex;
  flex-direction: column;
}
.filter-label {
  font-weight: 500;
  margin-bottom: 4px;
}
.filter-input {
  min-width: 140px;
}
.search-btn {
  margin-top: 18px;
}
.results-section {
  margin-bottom: 32px;
}
.results-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
}
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
.info-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.card-header {
  background: #f5f5f5;
  padding: 16px;
  display: flex;
  align-items: center;
}
.card-icon {
  font-size: 1.5rem;
  margin-right: 12px;
  color: #007bff;
}
.card-title {
  font-size: 1.1rem;
  font-weight: 500;
}
.card-content {
  padding: 16px;
  font-size: 0.9rem;
  color: #333;
}
.no-data-container {
  text-align: center;
  padding: 24px 0;
  color: #888;
}
.no-data-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}
body.body--dark .info-card {
  background: #222;
  color: #fafafa;
}
body.body--dark .card-header {
  background: #18181b;
  color: #fafafa;
}
body.body--dark .card-title,
body.body--dark .card-content {
  color: #fafafa;
}
body.body--dark .card-icon {
  color: #FF8C61;
}
body.body--dark .no-data-container {
  color: #bbb;
}
</style>
