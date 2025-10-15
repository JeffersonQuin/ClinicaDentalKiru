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
        <!-- Eliminar el botón de agregar reserva -->
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
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <q-input
        v-model="search"
        class="search-input"
        outlined
        type="search"
        placeholder="Buscar por nombre, email o fecha..."
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
        :pagination="{ rowsPerPage: 5 }"
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
            <span>{{ props.row.nombreCompleto }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-gmail="props">
          <q-td :props="props">
            <span>{{ props.row.gmail }}</span>
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

    <!-- Eliminar el dialog de nueva reserva -->
    <!--
    <NewReserveDialog
      v-model="showNewDialog"
      @reserve-created="handleReserveCreate"
    />
    -->

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
import { ref, onMounted, watch } from 'vue'
import reservas from 'src/data/reservas.json'
import Fuse from 'fuse.js'
import DetailReserveDialog from './DetailReserveDialog.vue'
//import NewReserveDialog from './NewReserveDialog.vue'

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
    label: 'Nombre Completo',
    align: 'left',
    field: 'nombreCompleto',
    sortable: true
  },
  {
    name: 'gmail',
    label: 'Gmail',
    align: 'left',
    field: 'gmail',
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
  keys: ['nombreCompleto', 'gmail', 'fechaReserva', 'horaReserva'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 1
}

export default {
  name: 'ReserveTable',
  components: {
    DetailReserveDialog,
    //NewReserveDialog
  },
  setup() {
    const search = ref('')
    const rows = ref([])
    const filteredRows = ref([])
    const selectedReserve = ref(null)
    const showDetailDialog = ref(false)
    const showNewDialog = ref(false)
    const showRejectDialog = ref(false)
    let fuse = null

    const loadReservas = () => {
      rows.value = reservas.reservas.map(r => ({
        ...r,
        id: Number(r.id)
      }))
      filteredRows.value = rows.value.filter(r => r.state !== 'rejected')
      fuse = new Fuse(filteredRows.value, FUSE_OPTIONS)
    }

    const rebuildFuse = () => {
      const collection = rows.value.filter(r => r.state !== 'rejected')
      if (fuse && typeof fuse.setCollection === 'function') {
        fuse.setCollection(collection)
      } else {
        fuse = new Fuse(collection, FUSE_OPTIONS)
      }
    }

    const filterRows = () => {
      if (!search.value?.trim()) {
        filteredRows.value = rows.value.filter(r => r.state !== 'rejected')
        return
      }
      const results = fuse.search(search.value.trim())
      filteredRows.value = results.map(result => result.item)
    }

    const handleReserveCreate = (newReserve) => {
      const reserveToAdd = {
        ...newReserve,
        id: null
      }
      const numericIds = rows.value.map(r => Number(r.id)).filter(n => !Number.isNaN(n))
      const maxId = numericIds.length ? Math.max(...numericIds) : 0
      reserveToAdd.id = maxId + 1
      rows.value.push(reserveToAdd)
      rebuildFuse()
      filterRows()
    }

    const rejectReserve = () => {
      const index = rows.value.findIndex(r => Number(r.id) === Number(selectedReserve.value.id))
      if (index > -1) {
        rows.value[index].state = 'rejected'
        rebuildFuse()
        filterRows()
      }
    }

    const viewReserve = (reserve) => {
      selectedReserve.value = { ...reserve }
      showDetailDialog.value = true
    }

    const openNewReserveDialog = () => {
      showNewDialog.value = true
    }

    const confirmRejectReserve = (reserve) => {
      selectedReserve.value = { ...reserve }
      showRejectDialog.value = true
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

    onMounted(() => {
      loadReservas()
    })
    watch(search, () => {
      filterRows()
    })

    return {
      search,
      columns,
      rows,
      filteredRows,
      selectedReserve,
      showDetailDialog,
      showNewDialog,
      showRejectDialog,
      filterRows,
      handleReserveCreate,
      rejectReserve,
      viewReserve,
      openNewReserveDialog,
      confirmRejectReserve,
      formatDate
    }
  }
}
</script>
