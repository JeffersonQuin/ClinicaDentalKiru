<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <i class="fa-solid fa-user-injured header-icon"></i>
          <div>
            <h1 class="page-title">Gestión de Pacientes</h1>
            <p class="page-subtitle">Administra seguimiento médico dental de los pacientes</p>
          </div>
        </div>
        <q-btn
          class="primary-btn"
          color="primary"
          icon="fa-solid fa-plus"
          label="Agregar Paciente"
          @click="openNewPatientDialog"
          unelevated
          no-caps
          size="md"
        />
      </div>
    </div>
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-icon-container total">
          <i class="fa-solid fa-users"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ filteredRows.length }}</div>
          <div class="stat-label">Total de Pacientes</div>
        </div>
      </div>
    </div>
    <div class="search-section">
      <q-input
        v-model="search"
        class="search-input"
        outlined
        type="search"
        placeholder="Buscar por nombre, CI o Gmail..."
        @input="filterRows"
        clearable
        dense
      >
        <template v-slot:prepend>
          <i class="fa-solid fa-search"></i>
        </template>
      </q-input>
    </div>
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
            <i class="fa-solid fa-users-slash no-data-icon"></i>
            <p class="no-data-text">No se encontraron pacientes</p>
            <p class="no-data-subtext">Intenta ajustar los filtros de búsqueda</p>
          </div>
        </template>
        <template v-slot:body-cell-nombre="props">
          <q-td :props="props">
            <span>{{ props.row.nombre }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-apellidoPaterno="props">
          <q-td :props="props">
            <span>{{ props.row.apellidoPaterno }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-apellidoMaterno="props">
          <q-td :props="props">
            <span>{{ props.row.apellidoMaterno }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-ci="props">
          <q-td :props="props">
            <span>{{ props.row.ci }}</span>
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
                @click="viewPatient(props.row)"
                color="grey-8"
              >
                <q-tooltip>Ver detalles</q-tooltip>
              </q-btn>
              <q-btn
                class="action-btn edit-btn"
                flat
                dense
                round
                icon="fa-solid fa-edit"
                size="sm"
                @click="editPatient(props.row)"
                color="primary"
              >
                <q-tooltip>Editar paciente</q-tooltip>
              </q-btn>
              <q-btn
                class="action-btn delete-btn"
                flat
                dense
                round
                icon="fa-solid fa-trash"
                size="sm"
                @click="confirmDeletePatient(props.row)"
                color="negative"
              >
                <q-tooltip>Eliminar paciente</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <NewPatientDialog
      v-model="showNewPatientDialog"
      @patient-created="handlePatientCreate"
    />
    <EditPatientDialog
      v-model="showEditPatientDialog"
      :patientData="selectedPatient"
      @patient-updated="handlePatientUpdate"
    />
    <DetailPatientDialog
      v-model="showDetailPatientDialog"
      :patientData="selectedPatient"
    />
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
            ¿Está seguro que desea eliminar al paciente <strong>{{ selectedPatient?.nombre }}</strong>?
          </p>
          <p class="dialog-subtext">
            Esta acción no se puede deshacer y el paciente perderá acceso al sistema.
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
            label="Eliminar Paciente" 
            color="negative" 
            @click="deletePatient"
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
import pacientes from 'src/data/pacientes.json'
import Fuse from 'fuse.js'
import NewPatientDialog from './NewPatientDialog.vue'
import EditPatientDialog from './EditPatientDialog.vue'
import DetailPatientDialog from './DetailPatientDialog.vue'

const columns = [
  {
    name: 'nombre',
    required: true,
    label: 'Nombre',
    align: 'left',
    field: 'nombre',
    sortable: true
  },
  {
    name: 'apellidoPaterno',
    label: 'Apellido Paterno',
    align: 'left',
    field: 'apellidoPaterno',
    sortable: true
  },
  {
    name: 'apellidoMaterno',
    label: 'Apellido Materno',
    align: 'left',
    field: 'apellidoMaterno',
    sortable: true
  },
  {
    name: 'ci',
    label: 'CI',
    align: 'center',
    field: 'ci',
    sortable: true,
    style: 'width: 120px'
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
    style: 'width: 140px'
  }
]

const FUSE_OPTIONS = {
  keys: ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'ci', 'gmail'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 1
}

export default {
  name: 'PatientTable',
  components: {
    NewPatientDialog,
    EditPatientDialog,
    DetailPatientDialog
  },
  setup() {
    const search = ref('')
    const rows = ref([])
    const filteredRows = ref([])
    const selectedPatient = ref(null)
    const showNewPatientDialog = ref(false)
    const showDeleteDialog = ref(false)
    const showEditPatientDialog = ref(false)
    const showDetailPatientDialog = ref(false)
    let fuse = null

    const loadPacientes = () => {
      rows.value = pacientes.pacientes.map(p => ({
        ...p,
        id: Number(p.id)
      }))
      filteredRows.value = rows.value.filter(p => p.state !== 'deleted')
      fuse = new Fuse(filteredRows.value, FUSE_OPTIONS)
    }

    const rebuildFuse = () => {
      const collection = rows.value.filter(p => p.state !== 'deleted')
      if (fuse && typeof fuse.setCollection === 'function') {
        fuse.setCollection(collection)
      } else {
        fuse = new Fuse(collection, FUSE_OPTIONS)
      }
    }

    const filterRows = () => {
      if (!search.value?.trim()) {
        filteredRows.value = rows.value.filter(p => p.state !== 'deleted')
        return
      }
      const results = fuse.search(search.value.trim())
      filteredRows.value = results.map(result => result.item)
    }

    const handlePatientCreate = (newPaciente) => {
      const pacienteToAdd = {
        ...newPaciente,
        id: null
      }
      const numericIds = rows.value.map(u => Number(u.id)).filter(n => !Number.isNaN(n))
      const maxId = numericIds.length ? Math.max(...numericIds) : 0
      pacienteToAdd.id = maxId + 1
      rows.value.push(pacienteToAdd)
      rebuildFuse()
      filterRows()
    }

    const deletePatient = () => {
      const index = rows.value.findIndex(u => Number(u.id) === Number(selectedPatient.value.id))
      if (index > -1) {
        rows.value[index].state = 'deleted'
        rebuildFuse()
        filterRows()
      }
    }

    const viewPatient = (patient) => {
      selectedPatient.value = { ...patient }
      showDetailPatientDialog.value = true
    }
    const editPatient = (patient) => {
      selectedPatient.value = { ...patient }
      showEditPatientDialog.value = true
    }
    const handlePatientUpdate = (updatedPatient) => {
      const index = rows.value.findIndex(u => Number(u.id) === Number(updatedPatient.id))
      if (index > -1) {
        rows.value[index] = { ...updatedPatient }
        rebuildFuse()
        filterRows()
      }
    }
    const openNewPatientDialog = () => {
      showNewPatientDialog.value = true
    }
    const confirmDeletePatient = (patient) => {
      selectedPatient.value = { ...patient }
      showDeleteDialog.value = true
    }

    onMounted(() => {
      loadPacientes()
    })
    watch(search, () => {
      filterRows()
    })

    return {
      search,
      columns,
      rows,
      filteredRows,
      selectedPatient,
      showNewPatientDialog,
      showDeleteDialog,
      showEditPatientDialog,
      showDetailPatientDialog,
      filterRows,
      handlePatientCreate,
      deletePatient,
      viewPatient,
      editPatient,
      handlePatientUpdate,
      openNewPatientDialog,
      confirmDeletePatient
    }
  }
}
</script>
