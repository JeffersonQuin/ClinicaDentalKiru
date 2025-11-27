<template>
  <div class="patient-page-container">
    <!-- Header Section -->
    <div class="patient-page-header">
      <div class="patient-header-background">
        <div class="patient-header-shape patient-header-shape-1"></div>
        <div class="patient-header-shape patient-header-shape-2"></div>
      </div>
      <div class="patient-header-content">
        <div class="patient-title-section">
          <div class="patient-icon-wrapper">
            <i class="fa-solid fa-user-injured patient-header-icon"></i>
          </div>
          <div>
            <h1 class="patient-page-title">Gestión de Pacientes</h1>
            <p class="patient-page-subtitle">Administra seguimiento médico dental de los pacientes</p>
          </div>
        </div>
        <q-btn
          class="patient-primary-btn"
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

    <!-- Stats Section -->
    <div class="patient-stats-section">
      <div class="patient-stat-card">
        <div class="patient-stat-icon-container total">
          <i class="fa-solid fa-users"></i>
        </div>
        <div class="patient-stat-content">
          <div class="patient-stat-value">{{ store.totalPacientes }}</div>
          <div class="patient-stat-label">Total de Pacientes</div>
        </div>
        <div class="patient-stat-glow total"></div>
      </div>
      <div class="patient-stat-card">
        <div class="patient-stat-icon-container alert">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div class="patient-stat-content">
          <div class="patient-stat-value">{{ store.pacientesConAlertas }}</div>
          <div class="patient-stat-label">Con Alertas Clínicas</div>
        </div>
        <div class="patient-stat-glow alert"></div>
      </div>
      <div class="patient-stat-card">
        <div class="patient-stat-icon-container city">
          <i class="fa-solid fa-map-marker-alt"></i>
        </div>
        <div class="patient-stat-content">
          <div class="patient-stat-value">{{ store.ciudadesUnicas }}</div>
          <div class="patient-stat-label">Ciudades Diferentes</div>
        </div>
        <div class="patient-stat-glow city"></div>
      </div>
      <div class="patient-stat-card">
        <div class="patient-stat-icon-container consultation">
          <i class="fa-solid fa-calendar-check"></i>
        </div>
        <div class="patient-stat-content">
          <div class="patient-stat-value">{{ recentPatientsCount }}</div>
          <div class="patient-stat-label">Visitas Recientes</div>
        </div>
        <div class="patient-stat-glow consultation"></div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="patient-search-section">
      <div class="patient-search-container">
        <div class="patient-search-header">
          <h3 class="patient-search-title">Búsqueda y Filtros</h3>
          <div class="patient-search-underline"></div>
        </div>
        <div class="patient-search-filters">
          <div class="patient-search-main">
            <q-input
              v-model="store.searchQuery"
              class="patient-search-input"
              outlined
              type="search"
              placeholder="Buscar por nombre, CI, email, ciudad, profesión..."
              @update:model-value="store.establecerBusqueda"
              clearable
            >
              <template v-slot:prepend>
                <i class="fa-solid fa-search patient-search-icon"></i>
              </template>
              <template v-slot:append>
                <q-icon 
                  v-if="store.searchQuery" 
                  name="fa-solid fa-filter" 
                  class="text-primary"
                />
              </template>
            </q-input>
          </div>
          
          <div class="patient-filter-group">
            <q-select
              v-model="store.cityFilter"
              :options="store.opcionesCiudad"
              label="Filtrar por ciudad"
              outlined
              dense
              clearable
              class="patient-filter-select"
              @update:model-value="store.establecerFiltroCiudad"
            >
              <template v-slot:prepend>
                <i class="fa-solid fa-map-marker-alt"></i>
              </template>
            </q-select>
            
            <q-select
              v-model="store.alertFilter"
              :options="store.opcionesAlerta"
              label="Filtrar por alertas"
              outlined
              dense
              clearable
              class="patient-filter-select"
              @update:model-value="store.establecerFiltroAlerta"
            >
              <template v-slot:prepend>
                <i class="fa-solid fa-triangle-exclamation"></i>
              </template>
            </q-select>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="patient-table-container">
      <div class="patient-table-header">
        <div class="patient-table-title-section">
          <h3 class="patient-table-title">Lista de Pacientes</h3>
          <div class="patient-table-underline"></div>
        </div>
        <div class="patient-table-actions">
          <div class="patient-results-count">
            <span class="patient-count-badge">
              <i class="fa-solid fa-list-check"></i>
              {{ store.pacientesFiltrados.length }} paciente{{ store.pacientesFiltrados.length !== 1 ? 's' : '' }}
            </span>
          </div>
          <q-btn
            flat
            icon="fa-solid fa-download"
            label="Exportar"
            color="primary"
            no-caps
            size="sm"
            class="patient-export-btn"
          />
        </div>
      </div>

      <q-table
        class="patient-data-table"
        flat
        :rows="store.pacientesFiltrados"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[5, 10, 15, 20]"
        :pagination="{ rowsPerPage: 10 }"
        separator="cell"
      >
        <template v-slot:no-data>
          <div class="patient-no-data-container">
            <div class="patient-no-data-illustration">
              <i class="fa-solid fa-users-slash patient-no-data-icon"></i>
              <div class="patient-no-data-circle patient-no-data-circle-1"></div>
              <div class="patient-no-data-circle patient-no-data-circle-2"></div>
            </div>
            <p class="patient-no-data-text">No se encontraron pacientes</p>
            <p class="patient-no-data-subtext">Intenta ajustar los filtros de búsqueda o agrega un nuevo paciente</p>
          </div>
        </template>
        
        <!-- Columna: Paciente -->
        <template v-slot:body-cell-paciente="props">
          <q-td :props="props">
            <div class="patient-info-card">
              <div class="patient-avatar-container">
                <div class="patient-avatar">
                  {{ getPatientInitials(props.row) }}
                </div>
              </div>
              <div class="patient-info-content">
                <div class="patient-name">
                  <strong>{{ props.row.nombre }} {{ props.row.apellidoPaterno }} {{ props.row.apellidoMaterno }}</strong>
                </div>
                <div class="patient-details">
                  <span class="patient-age">
                    <i class="fa-solid fa-cake-candles"></i>
                    {{ store.calcularEdad(props.row.fechaNacimiento) }} años
                  </span>
                  <span class="patient-profession">
                    <i class="fa-solid fa-briefcase"></i>
                    {{ props.row.profesion || 'No especificado' }}
                  </span>
                </div>
              </div>
            </div>
          </q-td>
        </template>
        
        <!-- Columna: CI -->
        <template v-slot:body-cell-ci="props">
          <q-td :props="props">
            <div class="patient-ci-badge">
              <i class="fa-solid fa-id-card"></i>
              {{ props.row.ci || 'N/A' }}
            </div>
          </q-td>
        </template>
        
        <!-- Columna: Contacto -->
        <template v-slot:body-cell-contacto="props">
          <q-td :props="props">
            <div class="patient-contact-info">
              <div class="patient-contact-item">
                <div class="patient-contact-icon">
                  <i class="fa-solid fa-envelope"></i>
                </div>
                <div class="patient-contact-content">
                  <div class="patient-contact-label">Email</div>
                  <div class="patient-contact-value">{{ props.row.gmail || 'No especificado' }}</div>
                </div>
              </div>
              <div class="patient-contact-item">
                <div class="patient-contact-icon">
                  <i class="fa-solid fa-phone"></i>
                </div>
                <div class="patient-contact-content">
                  <div class="patient-contact-label">Teléfono</div>
                  <div class="patient-contact-value">{{ props.row.telefono || 'No especificado' }}</div>
                </div>
              </div>
            </div>
          </q-td>
        </template>
        
        <!-- Columna: Ubicación -->
        <template v-slot:body-cell-ubicacion="props">
          <q-td :props="props">
            <div class="patient-location-info">
              <div class="patient-location-header">
                <div class="patient-city-badge">
                  <i class="fa-solid fa-map-marker-alt"></i>
                  {{ props.row.ciudad || 'No especificada' }}
                </div>
              </div>
              <div class="patient-address">
                {{ props.row.domicilio || 'Dirección no especificada' }}
              </div>
            </div>
          </q-td>
        </template>
        
        <!-- Columna: Consulta -->
        <template v-slot:body-cell-consulta="props">
          <q-td :props="props">
            <div class="patient-consultation-info">
              <div class="patient-consultation-reason">
                <div class="patient-consultation-icon">
                  <i class="fa-solid fa-stethoscope"></i>
                </div>
                <div class="patient-consultation-content">
                  <div class="patient-consultation-label">Motivo</div>
                  <div class="patient-consultation-value">{{ props.row.motivoConsulta || 'No especificado' }}</div>
                </div>
              </div>
              <div class="patient-last-visit">
                <i class="fa-solid fa-calendar-day"></i>
                Última visita: {{ store.formatearFecha(props.row.ultimaVisitaOdontologo) || 'Sin registro' }}
              </div>
            </div>
          </q-td>
        </template>
        
        <!-- Columna: Alertas -->
        <template v-slot:body-cell-alertas="props">
          <q-td :props="props">
            <div v-if="props.row.alertasClinicas" class="patient-alert-indicator">
              <div class="patient-alert-badge">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div class="patient-alert-tooltip">
                  {{ props.row.alertasClinicas }}
                </div>
              </div>
            </div>
            <div v-else class="patient-no-alert">
              <i class="fa-solid fa-circle-check"></i>
              <span>Sin alertas</span>
            </div>
          </q-td>
        </template>

        <!-- Columna: Acciones -->
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <div class="patient-action-buttons">
              <q-btn
                class="patient-action-btn patient-view-btn"
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
                class="patient-action-btn patient-recipe-btn"
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
                class="patient-action-btn patient-edit-btn"
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
                class="patient-action-btn patient-delete-btn"
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
      <q-card class="patient-confirm-dialog">
        <q-card-section class="patient-dialog-header">
          <div class="patient-dialog-icon-container">
            <i class="fa-solid fa-exclamation-triangle patient-dialog-icon"></i>
          </div>
          <h3 class="patient-dialog-title">Confirmar Eliminación</h3>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <p class="patient-dialog-text">
            ¿Está seguro que desea eliminar al paciente 
            <strong>{{ store.selectedPatient?.nombre }} {{ store.selectedPatient?.apellidoPaterno }}</strong>?
          </p>
          <p class="patient-dialog-subtext">
            Esta acción no se puede deshacer y se perderá toda la información del paciente.
          </p>
        </q-card-section>
        <q-card-actions class="patient-dialog-actions">
          <q-btn 
            flat 
            label="Cancelar" 
            color="grey-7" 
            v-close-popup 
            no-caps
            class="patient-dialog-btn"
          />
          <q-btn 
            unelevated
            label="Eliminar Paciente" 
            color="negative" 
            @click="deletePatient"
            v-close-popup 
            no-caps
            class="patient-dialog-btn patient-dialog-delete-btn"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
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
    style: 'width: 140px'
  },
  {
    name: 'contacto',
    label: 'Contacto',
    align: 'left',
    field: 'gmail',
    sortable: true,
    style: 'min-width: 200px'
  },
  {
    name: 'ubicacion',
    label: 'Ubicación',
    align: 'left',
    field: 'ciudad',
    sortable: true,
    style: 'min-width: 180px'
  },
  {
    name: 'consulta',
    label: 'Consulta',
    align: 'left',
    field: 'motivoConsulta',
    sortable: true,
    style: 'min-width: 200px'
  },
  {
    name: 'alertas',
    label: 'Alertas',
    align: 'center',
    field: 'alertasClinicas',
    sortable: false,
    style: 'width: 120px'
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

    // Computed para pacientes con visitas recientes
    const recentPatientsCount = computed(() => {
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      return store.pacientesFiltrados.filter(patient => {
        if (!patient.ultimaVisitaOdontologo) return false
        const lastVisit = new Date(patient.ultimaVisitaOdontologo)
        return lastVisit > oneMonthAgo
      }).length
    })

    // Función para obtener iniciales del paciente
    const getPatientInitials = (patient) => {
      const firstName = patient.nombre?.charAt(0) || ''
      const lastName = patient.apellidoPaterno?.charAt(0) || ''
      return (firstName + lastName).toUpperCase() || 'P'
    }

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
      recentPatientsCount,
      getPatientInitials,
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

