<template>
  <div class="page-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <i class="fa-solid fa-tooth header-icon"></i>
          <div>
            <h1 class="page-title">Gestión de Dentistas</h1>
            <p class="page-subtitle">Administra el equipo odontológico de tu clínica</p>
          </div>
        </div>
        <q-btn
          class="primary-btn"
          color="primary"
          icon="fa-solid fa-plus"
          label="Agregar Dentista"
          @click="openNewDentistDialog"
          unelevated
          no-caps
          size="md"
        />
      </div>
    </div>

    <!-- Stats Section -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-icon-container active">
          <i class="fa-solid fa-user-doctor"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ activeDentistsCount }}</div>
          <div class="stat-label">Dentistas Activos</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon-container inactive">
          <i class="fa-solid fa-user-slash"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ inactiveDentistsCount }}</div>
          <div class="stat-label">Dentistas Inactivos</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon-container admin">
          <i class="fa-solid fa-graduation-cap"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalSpecialties }}</div>
          <div class="stat-label">Especialidades Totales</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon-container total">
          <i class="fa-solid fa-users"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ filteredRows.length }}</div>
          <div class="stat-label">Total de Dentistas</div>
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
        placeholder="Buscar por nombre, apellido o especialidad..."
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
            <i class="fa-solid fa-user-doctor-slash no-data-icon"></i>
            <p class="no-data-text">No se encontraron dentistas</p>
            <p class="no-data-subtext">Intenta ajustar los filtros de búsqueda</p>
          </div>
        </template>

        <template v-slot:body-cell-img="props">
          <q-td :props="props">
            <div class="avatar-container">
              <q-avatar 
                size="48px"
                class="user-avatar"
                :color="props.row.img ? 'transparent' : getAvatarColor(props.row.name)"
                :text-color="props.row.img ? 'transparent' : 'white'"
              >
                <img 
                  v-if="props.row.img" 
                  :src="props.row.img" 
                  :alt="getFullName(props.row)"
                  @error="handleImageError"
                />
                <span v-else class="avatar-initials">{{ getInitials(props.row) }}</span>
              </q-avatar>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-fullName="props">
          <q-td :props="props">
            <div class="user-info">
              <span class="user-name">{{ getFullName(props.row) }}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-speciality="props">
          <q-td :props="props">
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
              <q-chip
                v-for="specId in props.row.speciality"
                :key="specId"
                dense
                class="type-chip type-user"
                size="sm"
              >
                {{ getSpecialtyName(specId) }}
              </q-chip>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-userId="props">
          <q-td :props="props">
            <q-chip
              dense
              icon="fa-solid fa-user"
              class="type-chip type-moderator"
            >
              ID: {{ props.row.userId }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-state="props">
          <q-td :props="props">
            <q-badge
              :class="['state-badge', getStateClass(props.row.state)]"
              :label="formatState(props.row.state)"
            />
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
                @click="viewDentist(props.row)"
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
                @click="editDentist(props.row)"
                color="primary"
              >
                <q-tooltip>Editar dentista</q-tooltip>
              </q-btn>
              
              <q-btn
                class="action-btn delete-btn"
                flat
                dense
                round
                icon="fa-solid fa-trash"
                size="sm"
                @click="confirmDeleteDentist(props.row)"
                color="negative"
              >
                <q-tooltip>Eliminar dentista</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialogs -->
    <DetailDentistDialog
      v-model="showDetailDialog"
      :dentist-data="selectedDentist"
      @edit-dentist="editDentist"
    />

    <EditDentistDialog
      v-model="showEditDialog"
      :dentist-data="selectedDentist"
      @dentist-updated="handleDentistUpdate"
    />

    <NewDentistDialog
      v-model="showNewDialog"
      @dentist-created="handleDentistCreate"
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
            ¿Está seguro que desea eliminar al dentista <strong>{{ getFullName(selectedDentist) }}</strong>?
          </p>
          <p class="dialog-subtext">
            Esta acción no se puede deshacer y el dentista perderá acceso al sistema.
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
            label="Eliminar Dentista" 
            color="negative" 
            @click="deleteDentist"
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
import dentistas from 'src/data/dentistas.json'
import especialidades from 'src/data/especialidades.json'
import Fuse from 'fuse.js'
import DetailDentistDialog from './DetailDentistDialog.vue'
import EditDentistDialog from './EditDentistDialog.vue'
import NewDentistDialog from './NewDentistDialog.vue'

const columns = [
  {
    name: 'img',
    required: true,
    label: 'Foto',
    align: 'center',
    field: 'img',
    sortable: false,
    style: 'width: 70px'
  },
  {
    name: 'fullName',
    required: true,
    label: 'Nombre Completo',
    align: 'left',
    field: row => `${row.name} ${row.father_last_name}`,
    sortable: true
  },
  {
    name: 'speciality',
    label: 'Especialidades',
    field: 'speciality',
    sortable: false,
    align: 'left',
    style: 'min-width: 200px'
  },
  {
    name: 'userId',
    label: 'Usuario Asignado',
    field: 'userId',
    sortable: true,
    align: 'center',
    style: 'width: 150px'
  },
  {
    name: 'state',
    label: 'Estado',
    field: 'state',
    sortable: true,
    align: 'center',
    style: 'width: 120px'
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
  keys: ['name', 'second_name', 'father_last_name', 'mother_last_name'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 1
}

const STATE_TRANSLATIONS = {
  active: 'Activo',
  inactive: 'Inactivo',
  pending: 'Pendiente'
}

const STATE_CLASSES = {
  active: 'state-active',
  inactive: 'state-inactive',
  pending: 'state-pending'
}

export default {
  name: 'DentistPage',
  
  components: {
    DetailDentistDialog,
    EditDentistDialog,
    NewDentistDialog
  },
  
  setup() {
    const search = ref('')
    const rows = ref([])
    const filteredRows = ref([])
    const selectedDentist = ref(null)
    const showDetailDialog = ref(false)
    const showEditDialog = ref(false)
    const showNewDialog = ref(false)
    const showDeleteDialog = ref(false)
    const specialtiesMap = ref({})
    let fuse = null

    const activeDentistsCount = computed(() => 
      filteredRows.value.filter(d => d.state === 'active').length
    )

    const inactiveDentistsCount = computed(() => 
      filteredRows.value.filter(d => d.state === 'inactive').length
    )

    const totalSpecialties = computed(() => {
      const uniqueSpecs = new Set()
      filteredRows.value.forEach(d => {
        d.speciality?.forEach(s => uniqueSpecs.add(s))
      })
      return uniqueSpecs.size
    })

    const getAvatarColor = (name) => {
      if (!name) return '#9e9e9e'
      
      const colors = [
        '#f44336', '#e91e63', '#9c27b0', '#673ab7',
        '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
        '#009688', '#4caf50', '#8bc34a', '#cddc39',
        '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
      ]
      
      let hash = 0
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
      }
      
      return colors[Math.abs(hash) % colors.length]
    }

    const getFullName = (dentist) => {
      if (!dentist) return ''
      return `${dentist.name || ''} ${dentist.second_name || ''} ${dentist.father_last_name || ''} ${dentist.mother_last_name || ''}`.trim()
    }

    const getInitials = (dentist) => {
      if (!dentist) return '?'
      const firstName = dentist.name?.charAt(0) || ''
      const lastName = dentist.father_last_name?.charAt(0) || ''
      return (firstName + lastName).toUpperCase() || '?'
    }

    const getSpecialtyName = (id) => {
      return specialtiesMap.value[id] || `Especialidad ${id}`
    }

    const handleImageError = (event) => {
      event.target.style.display = 'none'
    }

    const formatState = (state) => STATE_TRANSLATIONS[state] || state
    const getStateClass = (state) => STATE_CLASSES[state] || 'state-default'

    const rebuildFuse = () => {
      const collection = rows.value.filter(d => d.state !== 'deleted')
      
      if (fuse && typeof fuse.setCollection === 'function') {
        fuse.setCollection(collection)
      } else {
        fuse = new Fuse(collection, FUSE_OPTIONS)
      }
    }

    const filterRows = () => {
      if (!search.value?.trim()) {
        filteredRows.value = rows.value.filter(d => d.state !== 'deleted')
        return
      }

      const results = fuse.search(search.value.trim())
      filteredRows.value = results.map(result => result.item)
    }

    const loadDentists = () => {
      rows.value = dentistas.dentistas.map(d => ({ 
        ...d, 
        id: Number(d.id) 
      }))
      
      filteredRows.value = rows.value.filter(d => d.state !== 'deleted')
      fuse = new Fuse(filteredRows.value, FUSE_OPTIONS)
    }

    const loadSpecialties = () => {
      especialidades.especialidades.forEach(spec => {
        specialtiesMap.value[spec.id] = spec.name
      })
    }

    const handleDentistCreate = (newDentist) => {
      const dentistToAdd = {
        name: newDentist.name || '',
        second_name: newDentist.second_name || '',
        father_last_name: newDentist.father_last_name || '',
        mother_last_name: newDentist.mother_last_name || '',
        speciality: newDentist.speciality || [],
        userId: newDentist.userId || null,
        img: newDentist.img || null,
        state: newDentist.state || 'active'
      }

      const numericIds = rows.value
        .map(d => Number(d.id))
        .filter(n => !Number.isNaN(n))
      
      const maxId = numericIds.length ? Math.max(...numericIds) : 0
      dentistToAdd.id = maxId + 1

      rows.value.push(dentistToAdd)
      rebuildFuse()
      filterRows()
    }

    const handleDentistUpdate = (updatedDentist) => {
      const index = rows.value.findIndex(
        d => Number(d.id) === Number(updatedDentist.id)
      )
      
      if (index > -1) {
        rows.value[index] = { 
          ...updatedDentist, 
          id: Number(updatedDentist.id) 
        }
        rebuildFuse()
        filterRows()
      }
    }

    const deleteDentist = () => {
      const index = rows.value.findIndex(
        d => Number(d.id) === Number(selectedDentist.value.id)
      )
      
      if (index > -1) {
        rows.value[index].state = 'deleted'
        rebuildFuse()
        filterRows()
      }
    }

    const viewDentist = (dentist) => {
      selectedDentist.value = { ...dentist }
      showDetailDialog.value = true
    }

    const editDentist = (dentist) => {
      selectedDentist.value = { ...dentist }
      showEditDialog.value = true
      showDetailDialog.value = false
    }

    const openNewDentistDialog = () => {
      showNewDialog.value = true
    }

    const confirmDeleteDentist = (dentist) => {
      selectedDentist.value = { ...dentist }
      showDeleteDialog.value = true
    }

    onMounted(() => {
      loadSpecialties()
      loadDentists()
    })

    watch(search, () => {
      filterRows()
    })

    return {
      search,
      columns,
      rows,
      filteredRows,
      selectedDentist,
      showDetailDialog,
      showEditDialog,
      showNewDialog,
      showDeleteDialog,
      activeDentistsCount,
      inactiveDentistsCount,
      totalSpecialties,
      filterRows,
      handleDentistCreate,
      handleDentistUpdate,
      deleteDentist,
      viewDentist,
      editDentist,
      openNewDentistDialog,
      confirmDeleteDentist,
      getFullName,
      getInitials,
      handleImageError,
      formatState,
      getStateClass,
      getSpecialtyName,
      getAvatarColor
    }
  }
}
</script>