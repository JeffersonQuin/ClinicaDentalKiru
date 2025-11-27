<template>
  <div class="quotes-page-container">
    <!-- Header Section -->
    <div class="quotes-page-header">
      <div class="quotes-header-background">
        <div class="quotes-header-shape quotes-header-shape-1"></div>
        <div class="quotes-header-shape quotes-header-shape-2"></div>
      </div>
      <div class="quotes-header-content">
        <div class="quotes-title-section">
          <div class="quotes-icon-wrapper">
            <i class="fa-solid fa-calendar-check quotes-header-icon"></i>
          </div>
          <div>
            <h1 class="quotes-page-title">Gestión de Citas</h1>
            <p class="quotes-page-subtitle">Administra las citas de la Clínica Dental Kiru</p>
          </div>
        </div>
        <q-btn
          class="quotes-primary-btn"
          color="primary"
          icon="fa-solid fa-plus"
          label="Nueva Cita"
          @click="openNewQuoteDialog"
          unelevated
          no-caps
          size="md"
        />
      </div>
    </div>

    <!-- Stats Section -->
    <div class="quotes-stats-section">
      <div class="quotes-stat-card">
        <div class="quotes-stat-icon-container total">
          <i class="fa-solid fa-calendar-days"></i>
        </div>
        <div class="quotes-stat-content">
          <div class="quotes-stat-value">{{ filteredRows.length }}</div>
          <div class="quotes-stat-label">Total Citas</div>
        </div>
        <div class="quotes-stat-glow total"></div>
      </div>
      <div class="quotes-stat-card">
        <div class="quotes-stat-icon-container today">
          <i class="fa-solid fa-clock"></i>
        </div>
        <div class="quotes-stat-content">
          <div class="quotes-stat-value">{{ todayQuotesCount }}</div>
          <div class="quotes-stat-label">Citas Hoy</div>
        </div>
        <div class="quotes-stat-glow today"></div>
      </div>
      <div class="quotes-stat-card">
        <div class="quotes-stat-icon-container upcoming">
          <i class="fa-solid fa-calendar-plus"></i>
        </div>
        <div class="quotes-stat-content">
          <div class="quotes-stat-value">{{ upcomingQuotesCount }}</div>
          <div class="quotes-stat-label">Próximas</div>
        </div>
        <div class="quotes-stat-glow upcoming"></div>
      </div>
      <div class="quotes-stat-card">
        <div class="quotes-stat-icon-container completed">
          <i class="fa-solid fa-check-circle"></i>
        </div>
        <div class="quotes-stat-content">
          <div class="quotes-stat-value">{{ completedQuotesCount }}</div>
          <div class="quotes-stat-label">Completadas</div>
        </div>
        <div class="quotes-stat-glow completed"></div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="quotes-search-section">
      <div class="quotes-search-container">
        <q-input
          v-model="search"
          class="quotes-search-input"
          outlined
          type="search"
          placeholder="Buscar por asunto, dentista, paciente..."
          @input="filterRows"
          clearable
        >
          <template v-slot:prepend>
            <i class="fa-solid fa-search quotes-search-icon"></i>
          </template>
          <template v-slot:append>
            <q-icon 
              v-if="search" 
              name="fa-solid fa-filter" 
              class="text-primary"
            />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Table Section -->
    <div class="quotes-table-container">
      <div class="quotes-table-header">
        <div class="quotes-table-title-section">
          <h3 class="quotes-table-title">Lista de Citas</h3>
          <div class="quotes-table-underline"></div>
        </div>
        <div class="quotes-results-count">
          <span class="quotes-count-badge">
            <i class="fa-solid fa-list-check"></i>
            {{ filteredRows.length }} cita{{ filteredRows.length !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>

      <q-table
        class="quotes-data-table"
        flat
        :rows="filteredRows"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[5, 10, 15, 20, 0]"
        :pagination="{ rowsPerPage: 5 }"
        separator="cell"
      >
        <template v-slot:no-data>
          <div class="quotes-no-data-container">
            <div class="quotes-no-data-illustration">
              <i class="fa-solid fa-calendar-xmark quotes-no-data-icon"></i>
              <div class="quotes-no-data-circle quotes-no-data-circle-1"></div>
              <div class="quotes-no-data-circle quotes-no-data-circle-2"></div>
            </div>
            <p class="quotes-no-data-text">No se encontraron citas</p>
            <p class="quotes-no-data-subtext">Intenta ajustar los filtros de búsqueda o agrega una nueva cita</p>
          </div>
        </template>

        <template v-slot:body-cell-asunto="props">
          <q-td :props="props">
            <div class="quotes-subject-info">
              <div class="quotes-subject-icon">
                <i class="fa-solid fa-stethoscope"></i>
              </div>
              <div class="quotes-subject-content">
                <div class="quotes-subject-label">Asunto</div>
                <div class="quotes-subject-value">{{ props.row.asunto }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-dentista="props">
          <q-td :props="props">
            <div class="quotes-dentist-info">
              <div class="quotes-dentist-avatar">
                {{ getDentistInitials(props.row.dentistaId) }}
              </div>
              <div class="quotes-dentist-content">
                <div class="quotes-dentist-name">{{ getDentistaName(props.row.dentistaId) }}</div>
                <div class="quotes-dentist-role">
                  <i class="fa-solid fa-user-md"></i>
                  Dentista
                </div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-paciente="props">
          <q-td :props="props">
            <div class="quotes-patient-info">
              <div class="quotes-patient-avatar">
                {{ getPatientInitials(props.row.pacienteId) }}
              </div>
              <div class="quotes-patient-content">
                <div class="quotes-patient-name">{{ getPacienteName(props.row.pacienteId) }}</div>
                <div class="quotes-patient-role">
                  <i class="fa-solid fa-user-injured"></i>
                  Paciente
                </div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-fecha="props">
          <q-td :props="props">
            <div class="quotes-date-info">
              <div class="quotes-date-icon">
                <i class="fa-solid fa-calendar-day"></i>
              </div>
              <div class="quotes-date-content">
                <div class="quotes-date-label">Fecha</div>
                <div class="quotes-date-value">{{ formatDate(props.row.fecha) }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-hora="props">
          <q-td :props="props">
            <div class="quotes-time-info">
              <div class="quotes-time-icon">
                <i class="fa-solid fa-clock"></i>
              </div>
              <div class="quotes-time-content">
                <div class="quotes-time-label">Hora</div>
                <div class="quotes-time-value">{{ props.row.hora }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="quotes-action-buttons">
              <q-btn
                class="quotes-action-btn quotes-view-btn"
                flat
                dense
                round
                icon="fa-solid fa-eye"
                size="sm"
                @click="viewQuote(props.row)"
                color="grey-8"
              >
                <q-tooltip>Ver detalles</q-tooltip>
              </q-btn>
              <q-btn
                class="quotes-action-btn quotes-edit-btn"
                flat
                dense
                round
                icon="fa-solid fa-edit"
                size="sm"
                @click="editQuote(props.row)"
                color="primary"
              >
                <q-tooltip>Editar cita</q-tooltip>
              </q-btn>
              <q-btn
                class="quotes-action-btn quotes-delete-btn"
                flat
                dense
                round
                icon="fa-solid fa-trash"
                size="sm"
                @click="confirmDeleteQuote(props.row)"
                color="negative"
              >
                <q-tooltip>Eliminar cita</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialogs -->
    <DetailQuoteDialog
      v-model="showDetailDialog"
      :quote-data="selectedQuote"
      :getDentistaName="getDentistaName"
      :getPacienteName="getPacienteName"
    />

    <EditQuoteDialog
      v-model="showEditDialog"
      :quote-data="selectedQuote"
      :getDentistaName="getDentistaName"
      :getPacienteName="getPacienteName"
      @quote-updated="handleQuoteUpdate"
    />

    <NewQuoteDialog
      v-model="showNewDialog"
      @quote-created="handleQuoteCreate"
    />

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card class="quotes-confirm-dialog">
        <q-card-section class="quotes-dialog-header">
          <div class="quotes-dialog-icon-container">
            <i class="fa-solid fa-exclamation-triangle quotes-dialog-icon"></i>
          </div>
          <h3 class="quotes-dialog-title">Confirmar Eliminación</h3>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="quotes-dialog-text">
            ¿Está seguro que desea eliminar la cita de <strong>{{ getPacienteName(selectedQuote?.pacienteId) }}</strong>?
          </p>
          <div class="quotes-dialog-details">
            <div class="quotes-detail-item">
              <i class="fa-solid fa-stethoscope"></i>
              <span>Asunto: {{ selectedQuote?.asunto }}</span>
            </div>
            <div class="quotes-detail-item">
              <i class="fa-solid fa-user-md"></i>
              <span>Dentista: {{ getDentistaName(selectedQuote?.dentistaId) }}</span>
            </div>
            <div class="quotes-detail-item">
              <i class="fa-solid fa-calendar-day"></i>
              <span>Fecha: {{ formatDate(selectedQuote?.fecha) }}</span>
            </div>
            <div class="quotes-detail-item">
              <i class="fa-solid fa-clock"></i>
              <span>Hora: {{ selectedQuote?.hora }}</span>
            </div>
          </div>
          <p class="quotes-dialog-subtext">
            Esta acción no se puede deshacer.
          </p>
        </q-card-section>

        <q-card-actions class="quotes-dialog-actions">
          <q-btn 
            flat 
            label="Cancelar" 
            color="grey-7" 
            v-close-popup 
            no-caps
            class="quotes-dialog-btn"
          />
          <q-btn 
            unelevated
            label="Eliminar Cita" 
            color="negative" 
            @click="deleteQuote"
            v-close-popup 
            no-caps
            class="quotes-dialog-btn quotes-dialog-delete-btn"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue'
import citas from 'src/data/citas.json'
import pacientes from 'src/data/pacientes.json'
import dentistas from 'src/data/dentistas.json'
import Fuse from 'fuse.js'
import DetailQuoteDialog from './DetailQuoteDialog.vue'
import EditQuoteDialog from './EditQuoteDialog.vue'
import NewQuoteDialog from './NewQuoteDialog.vue'

const columns = [
  { 
    name: 'asunto', 
    label: 'Asunto', 
    field: 'asunto', 
    align: 'left', 
    sortable: true,
    style: 'min-width: 200px'
  },
  { 
    name: 'dentista', 
    label: 'Dentista', 
    field: 'dentistaId', 
    align: 'left', 
    sortable: true,
    style: 'min-width: 180px'
  },
  { 
    name: 'paciente', 
    label: 'Paciente', 
    field: 'pacienteId', 
    align: 'left', 
    sortable: true,
    style: 'min-width: 180px'
  },
  { 
    name: 'fecha', 
    label: 'Fecha', 
    field: 'fecha', 
    align: 'center', 
    sortable: true, 
    style: 'width: 140px' 
  },
  { 
    name: 'hora', 
    label: 'Hora', 
    field: 'hora', 
    align: 'center', 
    sortable: true, 
    style: 'width: 120px' 
  },
  { 
    name: 'actions', 
    label: 'Acciones', 
    field: 'actions', 
    align: 'center', 
    sortable: false, 
    style: 'width: 150px' 
  }
]

const FUSE_OPTIONS = {
  keys: ['asunto', 'fecha', 'hora'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 1
}

export default {
  name: 'QuotesTable',
  components: {
    DetailQuoteDialog,
    EditQuoteDialog,
    NewQuoteDialog
  },
  setup() {
    const search = ref('')
    const rows = ref([])
    const filteredRows = ref([])
    const selectedQuote = ref(null)
    const showDetailDialog = ref(false)
    const showEditDialog = ref(false)
    const showNewDialog = ref(false)
    const showDeleteDialog = ref(false)
    let fuse = null

    // Computed properties for statistics
    const todayQuotesCount = computed(() => {
      const today = new Date().toISOString().split('T')[0]
      return filteredRows.value.filter(quote => {
        const quoteDate = formatDateForFilter(quote.fecha)
        return quoteDate === today
      }).length
    })

    const upcomingQuotesCount = computed(() => {
      const today = new Date().toISOString().split('T')[0]
      return filteredRows.value.filter(quote => {
        const quoteDate = formatDateForFilter(quote.fecha)
        return quoteDate > today
      }).length
    })

    const completedQuotesCount = computed(() => {
      const today = new Date().toISOString().split('T')[0]
      return filteredRows.value.filter(quote => {
        const quoteDate = formatDateForFilter(quote.fecha)
        return quoteDate < today
      }).length
    })

    // Utilidades para mostrar nombres
    const getPacienteName = (id) => {
      const paciente = pacientes.pacientes.find(p => Number(p.id) === Number(id))
      return paciente ? `${paciente.nombre} ${paciente.apellidoPaterno}` : 'No encontrado'
    }

    const getDentistaName = (id) => {
      const dentista = dentistas.dentistas.find(d => Number(d.id) === Number(id))
      return dentista ? `${dentista.nombre} ${dentista.apellidoPaterno}` : 'No encontrado'
    }

    // Funciones para obtener iniciales
    const getPatientInitials = (id) => {
      const paciente = pacientes.pacientes.find(p => Number(p.id) === Number(id))
      if (!paciente) return '?'
      const firstName = paciente.nombre?.charAt(0) || ''
      const lastName = paciente.apellidoPaterno?.charAt(0) || ''
      return (firstName + lastName).toUpperCase() || 'P'
    }

    const getDentistInitials = (id) => {
      const dentista = dentistas.dentistas.find(d => Number(d.id) === Number(id))
      if (!dentista) return '?'
      const firstName = dentista.nombre?.charAt(0) || ''
      const lastName = dentista.apellidoPaterno?.charAt(0) || ''
      return (firstName + lastName).toUpperCase() || 'D'
    }

    const loadQuotes = () => {
      rows.value = citas.citas.map(c => ({
        ...c,
        id: Number(c.id)
      }))
      filteredRows.value = rows.value
      fuse = new Fuse(filteredRows.value, FUSE_OPTIONS)
    }

    const rebuildFuse = () => {
      if (fuse && typeof fuse.setCollection === 'function') {
        fuse.setCollection(rows.value)
      } else {
        fuse = new Fuse(rows.value, FUSE_OPTIONS)
      }
    }

    const filterRows = () => {
      if (!search.value?.trim()) {
        filteredRows.value = rows.value
        return
      }
      const results = fuse.search(search.value.trim())
      filteredRows.value = results.map(result => result.item)
    }

    const handleQuoteCreate = (newQuote) => {
      const quoteToAdd = {
        ...newQuote,
        id: null
      }
      const numericIds = rows.value.map(q => Number(q.id)).filter(n => !Number.isNaN(n))
      const maxId = numericIds.length ? Math.max(...numericIds) : 0
      quoteToAdd.id = maxId + 1
      rows.value.push(quoteToAdd)
      rebuildFuse()
      filterRows()
    }

    const handleQuoteUpdate = (updatedQuote) => {
      const index = rows.value.findIndex(q => Number(q.id) === Number(updatedQuote.id))
      if (index > -1) {
        rows.value[index] = { ...updatedQuote }
        rebuildFuse()
        filterRows()
      }
    }

    const deleteQuote = () => {
      const index = rows.value.findIndex(q => Number(q.id) === Number(selectedQuote.value.id))
      if (index > -1) {
        rows.value.splice(index, 1)
        rebuildFuse()
        filterRows()
      }
    }

    const viewQuote = (quote) => {
      selectedQuote.value = { ...quote }
      showDetailDialog.value = true
    }

    const editQuote = (quote) => {
      selectedQuote.value = { ...quote }
      showEditDialog.value = true
    }

    const openNewQuoteDialog = () => {
      showNewDialog.value = true
    }

    const confirmDeleteQuote = (quote) => {
      selectedQuote.value = { ...quote }
      showDeleteDialog.value = true
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

    const formatDateForFilter = (dateString) => {
      if (!dateString) return ''
      try {
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      } catch {
        return ''
      }
    }

    onMounted(() => {
      loadQuotes()
    })
    watch(search, () => {
      filterRows()
    })

    return {
      search,
      columns,
      rows,
      filteredRows,
      selectedQuote,
      showDetailDialog,
      showEditDialog,
      showNewDialog,
      showDeleteDialog,
      todayQuotesCount,
      upcomingQuotesCount,
      completedQuotesCount,
      filterRows,
      handleQuoteCreate,
      handleQuoteUpdate,
      deleteQuote,
      viewQuote,
      editQuote,
      openNewQuoteDialog,
      confirmDeleteQuote,
      formatDate,
      getPacienteName,
      getDentistaName,
      getPatientInitials,
      getDentistInitials
    }
  }
}
</script>

