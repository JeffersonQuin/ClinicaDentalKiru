<template>
  <div class="page-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <i class="fa-solid fa-calendar-check header-icon"></i>
          <div>
            <h1 class="page-title">Citas</h1>
            <p class="page-subtitle">Gestión de citas en la Clínica Dental Kiru</p>
          </div>
        </div>
        <q-btn
          class="primary-btn"
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

    <!-- Search Section -->
    <div class="search-section">
      <q-input
        v-model="search"
        class="search-input"
        outlined
        type="search"
        placeholder="Buscar por asunto, dentista, paciente..."
        @input="filterRows"
        clearable
        dense
      >
        <template v-slot:prepend>
          <i class="fa-solid fa-search"></i>
        </template>
      </q-input>
      <q-btn
        flat
        label="Buscar"
        icon="fa-solid fa-search"
        @click="filterRows"
        class="search-btn"
      />
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
            <p class="no-data-text">No se encontraron citas</p>
            <p class="no-data-subtext">Intenta ajustar los filtros de búsqueda</p>
          </div>
        </template>

        <template v-slot:body-cell-asunto="props">
          <q-td :props="props">
            <span>{{ props.row.asunto }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-dentista="props">
          <q-td :props="props">
            <span>{{ getDentistaName(props.row.dentistaId) }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-paciente="props">
          <q-td :props="props">
            <span>{{ getPacienteName(props.row.pacienteId) }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-fecha="props">
          <q-td :props="props">
            <span>{{ formatDate(props.row.fecha) }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-hora="props">
          <q-td :props="props">
            <span>{{ props.row.hora }}</span>
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
                label="Det"
                size="sm"
                @click="viewQuote(props.row)"
                color="grey-8"
              />
              <q-btn
                class="action-btn edit-btn"
                flat
                dense
                round
                label="Edit"
                size="sm"
                @click="editQuote(props.row)"
                color="primary"
              />
              <q-btn
                class="action-btn delete-btn"
                flat
                dense
                round
                label="Elimi"
                size="sm"
                @click="confirmDeleteQuote(props.row)"
                color="negative"
              />
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
      <q-card class="confirm-dialog">
        <q-card-section class="dialog-header">
          <div class="dialog-icon-container">
            <i class="fa-solid fa-exclamation-triangle dialog-icon"></i>
          </div>
          <h3 class="dialog-title">Confirmar Eliminación</h3>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="dialog-text">
            ¿Está seguro que desea eliminar la cita de <strong>{{ getPacienteName(selectedQuote?.pacienteId) }}</strong>?
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
            label="Eliminar Cita" 
            color="negative" 
            @click="deleteQuote"
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
import citas from 'src/data/citas.json'
import pacientes from 'src/data/pacientes.json'
import dentistas from 'src/data/dentistas.json'
import Fuse from 'fuse.js'
import DetailQuoteDialog from './DetailQuoteDialog.vue'
import EditQuoteDialog from './EditQuoteDialog.vue'
import NewQuoteDialog from './NewQuoteDialog.vue'

const columns = [
  { name: 'asunto', label: 'Asunto', field: 'asunto', align: 'left', sortable: true },
  { name: 'dentista', label: 'Dentista', field: 'dentistaId', align: 'left', sortable: true },
  { name: 'paciente', label: 'Paciente', field: 'pacienteId', align: 'left', sortable: true },
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'center', sortable: true, style: 'width: 120px' },
  { name: 'hora', label: 'Hora', field: 'hora', align: 'center', sortable: true, style: 'width: 100px' },
  { name: 'actions', label: 'Opciones', field: 'actions', align: 'center', sortable: false, style: 'width: 160px' }
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

    // Utilidades para mostrar nombres
    const getPacienteName = (id) => {
      const paciente = pacientes.pacientes.find(p => Number(p.id) === Number(id))
      return paciente ? `${paciente.nombre} ${paciente.apellidoPaterno}` : 'No encontrado'
    }
    const getDentistaName = (id) => {
      const dentista = dentistas.dentistas.find(d => Number(d.id) === Number(id))
      return dentista ? `${dentista.nombre} ${dentista.apellidoPaterno}` : 'No encontrado'
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
      getDentistaName
    }
  }
}
</script>
