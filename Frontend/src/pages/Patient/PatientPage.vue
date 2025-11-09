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

    <!-- Estadísticas -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-icon-container total">
          <i class="fa-solid fa-users"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ store.totalPacientes }}</div>
          <div class="stat-label">Total de Pacientes</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-container alert">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ store.pacientesConAlertas }}</div>
          <div class="stat-label">Con Alertas Clínicas</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-container city">
          <i class="fa-solid fa-map-marker-alt"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ store.ciudadesUnicas }}</div>
          <div class="stat-label">Ciudades Diferentes</div>
        </div>
      </div>
    </div>

    <!-- Búsqueda y Filtros -->
    <div class="search-section">
      <div class="search-filters">
        <q-input
          v-model="store.searchQuery"
          class="search-input"
          outlined
          type="search"
          placeholder="Buscar por nombre, CI, email, ciudad, profesión..."
          @update:model-value="store.establecerBusqueda"
          clearable
          dense
        >
          <template v-slot:prepend>
            <i class="fa-solid fa-search"></i>
          </template>
        </q-input>
        
        <q-select
          v-model="store.cityFilter"
          :options="store.opcionesCiudad"
          label="Filtrar por ciudad"
          outlined
          dense
          clearable
          class="filter-select"
          @update:model-value="store.establecerFiltroCiudad"
        />
        
        <q-select
          v-model="store.alertFilter"
          :options="store.opcionesAlerta"
          label="Filtrar por alertas"
          outlined
          dense
          clearable
          class="filter-select"
          @update:model-value="store.establecerFiltroAlerta"
        />
      </div>
    </div>

    <!-- Tabla de Pacientes -->
    <div class="table-container">
      <q-table
        class="data-table"
        flat
        :rows="store.pacientesFiltrados"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[5, 10, 15, 20]"
        :pagination="{ rowsPerPage: 10 }"
        separator="cell"
      >
        <template v-slot:top>
          <div class="table-header">
            <span class="table-title">Lista de Pacientes</span>
            <div class="table-actions">
              <q-btn
                flat
                icon="fa-solid fa-download"
                label="Exportar"
                color="primary"
                no-caps
                size="sm"
              />
            </div>
          </div>
        </template>

        <template v-slot:no-data>
          <div class="no-data-container">
            <i class="fa-solid fa-users-slash no-data-icon"></i>
            <p class="no-data-text">No se encontraron pacientes</p>
            <p class="no-data-subtext">Intenta ajustar los filtros de búsqueda</p>
          </div>
        </template>
        
        <!-- Columna: Paciente -->
        <template v-slot:body-cell-paciente="props">
          <q-td :props="props">
            <div class="patient-info">
              <div class="patient-name">
                <strong>{{ props.row.nombre }} {{ props.row.apellidoPaterno }} {{ props.row.apellidoMaterno }}</strong>
              </div>
              <div class="patient-details">
                <span class="patient-age">{{ store.calcularEdad(props.row.fechaNacimiento) }} años</span>
                <span class="patient-profession">• {{ props.row.profesion }}</span>
              </div>
            </div>
          </q-td>
        </template>
        
        <!-- Columna: Contacto -->
        <template v-slot:body-cell-contacto="props">
          <q-td :props="props">
            <div class="contact-info">
              <div class="contact-email">
                <i class="fa-solid fa-envelope"></i>
                {{ props.row.gmail }}
              </div>
              <div class="contact-phone">
                <i class="fa-solid fa-phone"></i>
                {{ props.row.telefono }}
              </div>
            </div>
          </q-td>
        </template>
        
        <!-- Columna: Ubicación -->
        <template v-slot:body-cell-ubicacion="props">
          <q-td :props="props">
            <div class="location-info">
              <div class="city-badge">
                <i class="fa-solid fa-map-marker-alt"></i>
                {{ props.row.ciudad }}
              </div>
              <div class="patient-address">
                {{ props.row.domicilio }}
              </div>
            </div>
          </q-td>
        </template>
        
        <!-- Columna: Consulta -->
        <template v-slot:body-cell-consulta="props">
          <q-td :props="props">
            <div class="consultation-info">
              <div class="consultation-reason">
                <strong>{{ props.row.motivoConsulta }}</strong>
              </div>
              <div class="consultation-date">
                Última visita: {{ store.formatearFecha(props.row.ultimaVisitaOdontologo) }}
              </div>
            </div>
          </q-td>
        </template>
        
        <!-- Columna: Alertas -->
        <template v-slot:body-cell-alertas="props">
          <q-td :props="props">
            <div v-if="props.row.alertasClinicas" class="alert-indicator">
              <q-icon name="fa-solid fa-triangle-exclamation" color="negative" />
              <div class="alert-tooltip">
                {{ props.row.alertasClinicas }}
              </div>
            </div>
            <span v-else class="no-alert">-</span>
          </q-td>
        </template>

        <!-- Columna: Acciones -->
        <template v-slot:body-cell-acciones="props">
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
                <q-tooltip>Ver detalles completos</q-tooltip>
              </q-btn>
              <q-btn
                class="action-btn recipe-btn"
                flat
                dense
                round
                icon="fa-solid fa-file-medical"
                size="sm"
                @click="openRecipeDialog(props.row)"
                color="secondary"
              >
                <q-tooltip>Recetar medicamentos</q-tooltip>
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
                <q-tooltip>Editar información</q-tooltip>
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

    <!-- Diálogos -->
    <NewPatientDialog
      v-model="showNewPatientDialog"
      @patient-created="handlePatientCreate"
    />
    <EditPatientDialog
      v-model="showEditPatientDialog"
      :patientData="store.selectedPatient"
      @patient-updated="handlePatientUpdate"
    />
    <DetailPatientDialog
      v-model="showDetailPatientDialog"
      :patientData="store.selectedPatient"
    />
    <RecipePatientDialog
      v-model="showRecipeDialog"
      :patientData="store.selectedPatient"
    />

    <!-- Diálogo de Confirmación de Eliminación -->
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
            ¿Está seguro que desea eliminar al paciente 
            <strong>{{ store.selectedPatient?.nombre }} {{ store.selectedPatient?.apellidoPaterno }}</strong>?
          </p>
          <p class="dialog-subtext">
            Esta acción no se puede deshacer y se perderá toda la información del paciente.
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
import { ref } from 'vue'
import { usePacienteStore } from 'stores/pacienteStore'
import NewPatientDialog from './NewPatientDialog.vue'
import EditPatientDialog from './EditPatientDialog.vue'
import DetailPatientDialog from './DetailPatientDialog.vue'
import RecipePatientDialog from './RecipePatientDialog.vue'

const columns = [
  {
    name: 'paciente',
    required: true,
    label: 'Paciente',
    align: 'left',
    field: row => `${row.nombre} ${row.apellidoPaterno} ${row.apellidoMaterno}`,
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
    name: 'contacto',
    label: 'Contacto',
    align: 'left',
    field: 'gmail',
    sortable: true
  },
  {
    name: 'ubicacion',
    label: 'Ubicación',
    align: 'left',
    field: 'ciudad',
    sortable: true
  },
  {
    name: 'consulta',
    label: 'Consulta',
    align: 'left',
    field: 'motivoConsulta',
    sortable: true
  },
  {
    name: 'alertas',
    label: 'Alertas',
    align: 'center',
    field: 'alertasClinicas',
    sortable: false,
    style: 'width: 80px'
  },
  {
    name: 'acciones',
    label: 'Acciones',
    field: 'acciones',
    align: 'center',
    sortable: false,
    style: 'width: 200px'
  }
]

export default {
  name: 'PatientTable',
  components: {
    NewPatientDialog,
    EditPatientDialog,
    DetailPatientDialog,
    RecipePatientDialog
  },
  setup() {
    const store = usePacienteStore()
    
    const showNewPatientDialog = ref(false)
    const showDeleteDialog = ref(false)
    const showEditPatientDialog = ref(false)
    const showDetailPatientDialog = ref(false)
    const showRecipeDialog = ref(false)

    const viewPatient = (patient) => {
      store.seleccionarPaciente(patient)
      showDetailPatientDialog.value = true
    }

    const editPatient = (patient) => {
      store.seleccionarPaciente(patient)
      showEditPatientDialog.value = true
    }

    const openRecipeDialog = (patient) => {
      store.seleccionarPaciente(patient)
      showRecipeDialog.value = true
    }

    const openNewPatientDialog = () => {
      showNewPatientDialog.value = true
    }

    const confirmDeletePatient = (patient) => {
      store.seleccionarPaciente(patient)
      showDeleteDialog.value = true
    }

    const handlePatientCreate = async (newPatient) => {
      await store.agregarPaciente(newPatient)
      showNewPatientDialog.value = false
    }

    const handlePatientUpdate = async (updatedPatient) => {
      await store.actualizarPaciente(updatedPatient)
      showEditPatientDialog.value = false
    }

    const deletePatient = () => {
      if (store.selectedPatient) {
        store.eliminarPaciente(store.selectedPatient.id)
        showDeleteDialog.value = false
        store.limpiarPacienteSeleccionado()
      }
    }

    return {
      store,
      columns,
      showNewPatientDialog,
      showDeleteDialog,
      showEditPatientDialog,
      showDetailPatientDialog,
      showRecipeDialog,
      viewPatient,
      editPatient,
      openRecipeDialog,
      openNewPatientDialog,
      confirmDeletePatient,
      handlePatientCreate,
      handlePatientUpdate,
      deletePatient
    }
  }
}
</script>