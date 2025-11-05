<template>
  <div class="page-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <i class="fa-solid fa-calendar-check header-icon"></i>
          <div>
            <h1 class="page-title">Gestión de Reservas</h1>
            <p class="page-subtitle">Administra las reservas de pacientes y sus dependientes</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-icon-container total">
          <i class="fa-solid fa-calendar-days"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ filteredRows.length }}</div>
          <div class="stat-label">Total de Reservas</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-container dependientes">
          <i class="fa-solid fa-users"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ reservasConDependientes }}</div>
          <div class="stat-label">Con Dependientes</div>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <q-input
        v-model="search"
        class="search-input"
        outlined
        type="search"
        placeholder="Buscar por nombre, email, dependiente o fecha..."
        @input="filterRows"
        clearable
        dense
      >
        <template v-slot:prepend>
          <i class="fa-solid fa-search"></i>
        </template>
      </q-input>
    </div>

    <!-- Table Section -->
    <div class="table-container">
      <q-table
        class="data-table"
        flat
        :rows="filteredRows"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[5, 10, 15, 20, 0]"
        :pagination="{ rowsPerPage: 10 }"
        separator="cell"
      >
        <template v-slot:no-data>
          <div class="no-data-container">
            <i class="fa-solid fa-calendar-xmark no-data-icon"></i>
            <p class="no-data-text">No se encontraron reservas</p>
            <p class="no-data-subtext">Intenta ajustar los filtros de búsqueda</p>
          </div>
        </template>

        <template v-slot:body-cell-fechaReserva="props">
          <q-td :props="props">
            <span>{{ formatDate(props.row.fechaReserva) }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-horaReserva="props">
          <q-td :props="props">
            <span>{{ props.row.horaReserva }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-nombreCompleto="props">
          <q-td :props="props">
            <div>
              <div>{{ props.row.nombreCompleto }}</div>
              <div v-if="props.row.dependiente" class="dependiente-badge">
                <i class="fa-solid fa-user-friends"></i>
                {{ props.row.dependiente.nombreCompleto }} ({{ props.row.dependiente.parentesco }})
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-gmail="props">
          <q-td :props="props">
            <span>{{ props.row.gmail }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-servicio="props">
          <q-td :props="props">
            <span>{{ props.row.servicio }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-sucursal="props">
          <q-td :props="props">
            <span>{{ props.row.sucursal }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="action-buttons">
              <q-btn
                class="action-btn view-btn"
                flat
                dense
                round
                icon="fa-solid fa-eye"
                size="sm"
                @click="viewReserve(props.row)"
                color="grey-8"
              >
                <q-tooltip>Ver detalles</q-tooltip>
              </q-btn>
              <q-btn
                class="action-btn delete-btn"
                flat
                dense
                round
                icon="fa-solid fa-ban"
                size="sm"
                @click="confirmRejectReserve(props.row)"
                color="negative"
              >
                <q-tooltip>Rechazar reserva</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialogs -->
    <DetailReserveDialog
      v-model="showDetailDialog"
      :reserveData="selectedReserve"
    />

    <!-- Reject Confirmation Dialog -->
    <q-dialog v-model="showRejectDialog" persistent>
      <q-card class="confirm-dialog">
        <q-card-section class="dialog-header">
          <div class="dialog-icon-container">
            <i class="fa-solid fa-exclamation-triangle dialog-icon"></i>
          </div>
          <h3 class="dialog-title">Confirmar Rechazo</h3>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="dialog-text">
            ¿Está seguro que desea rechazar la reserva de <strong>{{ selectedReserve?.nombreCompleto }}</strong>?
          </p>
          <p class="dialog-subtext" v-if="selectedReserve?.dependiente">
            También se rechazará la reserva del dependiente: <strong>{{ selectedReserve.dependiente.nombreCompleto }}</strong>
          </p>
          <p class="dialog-subtext">
            Esta acción no se puede deshacer.
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
            label="Rechazar Reserva" 
            color="negative" 
            @click="rejectReserve"
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
import { ref, onMounted, watch, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useReserveStore } from 'src/stores/reserva' // 👈 Importar el store
import Fuse from 'fuse.js'
import DetailReserveDialog from './DetailReserveDialog.vue'

const columns = [
  {
    name: 'fechaReserva',
    label: 'Fecha Reserva',
    align: 'center',
    field: 'fechaReserva',
    sortable: true,
    style: 'width: 120px'
  },
  {
    name: 'horaReserva',
    label: 'Hora Reserva',
    align: 'center',
    field: 'horaReserva',
    sortable: true,
    style: 'width: 100px'
  },
  {
    name: 'nombreCompleto',
    label: 'Paciente',
    align: 'left',
    field: 'nombreCompleto',
    sortable: true
  },
  {
    name: 'gmail',
    label: 'Email',
    align: 'left',
    field: 'gmail',
    sortable: true
  },
  {
    name: 'servicio',
    label: 'Servicio',
    align: 'left',
    field: 'servicio',
    sortable: true
  },
  {
    name: 'sucursal',
    label: 'Sucursal',
    align: 'left',
    field: 'sucursal',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Acciones',
    field: 'actions',
    align: 'center',
    sortable: false,
    style: 'width: 120px'
  }
]

const FUSE_OPTIONS = {
  keys: [
    'nombreCompleto', 
    'gmail', 
    'fechaReserva', 
    'horaReserva',
    'servicio',
    'sucursal',
    'dependiente.nombreCompleto',
    'dependiente.parentesco'
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 1
}

export default {
  name: 'ReserveTable',
  components: {
    DetailReserveDialog,
  },
  setup() {
    const $q = useQuasar()
    const reservaStore = useReserveStore() // 👈 Usar el store

    const search = ref('')
    const selectedReserve = ref(null)
    const showDetailDialog = ref(false)
    const showRejectDialog = ref(false)
    let fuse = null

    // 👇 DATOS DESDE PINIA (MUCHO MÁS SIMPLE)
    const allReservas = computed(() => reservaStore.reservasCompletas || [])
    const filteredRows = ref([])

    // 👇 Estadísticas
    const reservasConDependientes = computed(() => {
      return allReservas.value.filter(row => row.dependiente).length
    })

    const loadReservas = () => {
      // Los datos ya vienen del store, solo inicializar Fuse
      filteredRows.value = allReservas.value
      initializeFuse()
    }

    const initializeFuse = () => {
      fuse = new Fuse(allReservas.value, FUSE_OPTIONS)
    }

    const filterRows = () => {
      if (!search.value?.trim()) {
        filteredRows.value = allReservas.value
        return
      }
      const results = fuse.search(search.value.trim())
      filteredRows.value = results.map(result => result.item)
    }

    const rejectReserve = () => {
      if (!selectedReserve.value) return
      
      // 👇 Usar el método del store
      reservaStore.eliminarReserva(selectedReserve.value.id)
      
      $q.notify({
        type: 'positive',
        message: 'Reserva eliminada exitosamente',
        position: 'top'
      })
    }

    const viewReserve = (reserve) => {
      selectedReserve.value = { ...reserve }
      showDetailDialog.value = true
    }

    const confirmRejectReserve = (reserve) => {
      selectedReserve.value = { ...reserve }
      showRejectDialog.value = true
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'No disponible'
      try {
        // Manejar formato YYYY-MM-DD
        if (dateString.includes('-')) {
          const [year, month, day] = dateString.split('-')
          return `${day}/${month}/${year}`
        }
        // Si ya está en formato DD/MM/YYYY
        return dateString
      } catch {
        return 'Fecha inválida'
      }
    }

    onMounted(() => {
      loadReservas()
    })

    watch(search, () => {
      filterRows()
    })

    // 👇 Recargar cuando cambien los datos del store
    watch(allReservas, () => {
      loadReservas()
    })

    return {
      search,
      columns,
      filteredRows,
      selectedReserve,
      showDetailDialog,
      showRejectDialog,
      reservasConDependientes,
      filterRows,
      rejectReserve,
      viewReserve,
      confirmRejectReserve,
      formatDate
    }
  }
}
</script>