<template>
  <div class="page-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <i class="fa-solid fa-building header-icon"></i>
          <div>
            <h1 class="page-title">Gestión de Sucursales</h1>
            <p class="page-subtitle">Administra las ubicaciones de tu clínica dental</p>
          </div>
        </div>
        <q-btn
          class="primary-btn"
          color="primary"
          icon="fa-solid fa-plus"
          label="Nueva Sucursal"
          @click="openNewBranchDialog"
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
          <i class="fa-solid fa-store"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalBranches }}</div>
          <div class="stat-label">Total Sucursales</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon-container admin">
          <i class="fa-solid fa-map-location-dot"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalLocations }}</div>
          <div class="stat-label">Ciudades</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon-container total">
          <i class="fa-solid fa-briefcase-medical"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalServices }}</div>
          <div class="stat-label">Servicios Totales</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon-container inactive">
          <i class="fa-solid fa-star"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalFeatures }}</div>
          <div class="stat-label">Características</div>
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
        placeholder="Buscar por nombre, ubicación o servicios..."
        @input="filterBranches"
        clearable
        dense
      >
        <template v-slot:prepend>
          <i class="fa-solid fa-search"></i>
        </template>
      </q-input>
    </div>

    <!-- Branches Cards Grid -->
    <div class="branches-grid">
      <q-card
        v-for="branch in filteredBranches"
        :key="branch.id"
        class="branch-card"
      >
        <!-- Image Header -->
        <div class="branch-image-container">
          <img
            v-if="branch.image"
            :src="branch.image"
            :alt="branch.name"
            class="branch-image"
            @error="handleImageError"
          />
          <div v-else class="branch-image-placeholder">
            <i class="fa-solid fa-building"></i>
          </div>
          <div class="branch-location-badge">
            <i class="fa-solid fa-location-dot"></i>
            {{ branch.location }}
          </div>
        </div>

        <!-- Card Content -->
        <q-card-section class="branch-content">
          <h3 class="branch-name">{{ branch.name }}</h3>
          
          <div class="branch-info-item">
            <i class="fa-solid fa-map-marker-alt"></i>
            <span>{{ branch.address }}</span>
          </div>

          <div class="branch-contact-row">
            <div class="branch-info-item">
              <i class="fa-solid fa-phone"></i>
              <span>{{ branch.phone }}</span>
            </div>
            <div class="branch-info-item">
              <i class="fa-solid fa-envelope"></i>
              <span>{{ branch.email }}</span>
            </div>
          </div>

          <!-- Services -->
          <div class="branch-services">
            <div class="services-title">
              <i class="fa-solid fa-hand-holding-medical"></i>
              Servicios
            </div>
            <div class="services-chips">
              <q-chip
                v-for="(service, index) in branch.services.slice(0, 3)"
                :key="index"
                dense
                size="sm"
                color="primary"
                text-color="white"
                class="service-chip"
              >
                {{ service }}
              </q-chip>
              <q-chip
                v-if="branch.services.length > 3"
                dense
                size="sm"
                outline
                color="primary"
                class="service-chip"
              >
                +{{ branch.services.length - 3 }} más
              </q-chip>
            </div>
          </div>

          <!-- Schedule Preview -->
          <div class="branch-schedule-preview">
            <i class="fa-solid fa-clock"></i>
            <span>{{ getSchedulePreview(branch.schedule) }}</span>
          </div>
        </q-card-section>

        <!-- Card Actions -->
        <q-separator />
        <q-card-actions class="branch-actions">
          <q-btn
            flat
            dense
            icon="fa-solid fa-eye"
            label="Ver Detalles"
            color="primary"
            @click="viewBranch(branch)"
            no-caps
            size="sm"
          />
          <q-space />
          <q-btn
            flat
            dense
            round
            icon="fa-solid fa-edit"
            color="primary"
            @click="editBranch(branch)"
          >
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            round
            icon="fa-solid fa-trash"
            color="negative"
            @click="confirmDeleteBranch(branch)"
          >
            <q-tooltip>Eliminar</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>

      <!-- No Results -->
      <div v-if="filteredBranches.length === 0" class="no-results">
        <i class="fa-solid fa-store-slash"></i>
        <p>No se encontraron sucursales</p>
        <p class="no-results-subtext">Intenta ajustar los filtros de búsqueda</p>
      </div>
    </div>

    <!-- Dialogs -->
    <DetailBranchDialog
      v-model="showDetailDialog"
      :branch-data="selectedBranch"
      @edit-branch="editBranch"
    />

    <EditBranchDialog
      v-model="showEditDialog"
      :branch-data="selectedBranch"
      @branch-updated="handleBranchUpdate"
    />

    <NewBranchDialog
      v-model="showNewDialog"
      @branch-created="handleBranchCreate"
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
            ¿Está seguro que desea eliminar la sucursal <strong>{{ selectedBranch?.name }}</strong>?
          </p>
          <p class="dialog-subtext">
            Esta acción no se puede deshacer y la sucursal dejará de aparecer en el sistema.
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
            label="Eliminar Sucursal" 
            color="negative" 
            @click="deleteBranch"
            v-close-popup 
            no-caps
            class="dialog-btn"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <Tooth
      :pieza="miPieza"
      posicion="superior"
      escala="0.25"
      @select-face="handleSelectFace"
    />

  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue'
import sucursales from 'src/data/sucursales.json'
import Fuse from 'fuse.js'
import DetailBranchDialog from './DetailBranchDialog.vue'
import EditBranchDialog from './EditBranchDialog.vue'
import NewBranchDialog from './NewBranchDialog.vue'
import Tooth from 'src/components/Tooth.vue'

const FUSE_OPTIONS = {
  keys: ['name', 'location', 'address', 'services'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 1
}

export default {
  name: 'BranchesPage',
  
  components: {
    DetailBranchDialog,
    EditBranchDialog,
    NewBranchDialog,
    Tooth
  },
  
  setup() {
    const search = ref('')
    const branches = ref([])
    const filteredBranches = ref([])
    const selectedBranch = ref(null)
    const showDetailDialog = ref(false)
    const showEditDialog = ref(false)
    const showNewDialog = ref(false)
    const showDeleteDialog = ref(false)
    let fuse = null

    const totalBranches = computed(() => filteredBranches.value.length)

    const totalLocations = computed(() => {
      const locations = new Set(filteredBranches.value.map(b => b.location))
      return locations.size
    })

    const totalServices = computed(() => {
      const services = new Set()
      filteredBranches.value.forEach(b => {
        b.services?.forEach(s => services.add(s))
      })
      return services.size
    })

    const totalFeatures = computed(() => {
      return filteredBranches.value.reduce((sum, b) => sum + (b.features?.length || 0), 0)
    })

    const getSchedulePreview = (schedule) => {
      if (!schedule) return 'Horario no disponible'
      return schedule.monday || 'No especificado'
    }

    const handleImageError = (event) => {
      event.target.style.display = 'none'
    }

    const rebuildFuse = () => {
      const collection = branches.value.filter(b => b.state !== 'deleted')
      
      if (fuse && typeof fuse.setCollection === 'function') {
        fuse.setCollection(collection)
      } else {
        fuse = new Fuse(collection, FUSE_OPTIONS)
      }
    }

    const filterBranches = () => {
      if (!search.value?.trim()) {
        filteredBranches.value = branches.value.filter(b => b.state !== 'deleted')
        return
      }

      const results = fuse.search(search.value.trim())
      filteredBranches.value = results.map(result => result.item)
    }

    const loadBranches = () => {
      branches.value = sucursales.sucursales.map(b => ({ 
        ...b, 
        id: Number(b.id),
        state: b.state || 'active'
      }))
      
      filteredBranches.value = branches.value.filter(b => b.state !== 'deleted')
      fuse = new Fuse(filteredBranches.value, FUSE_OPTIONS)
    }

    const handleBranchCreate = (newBranch) => {
      const branchToAdd = {
        ...newBranch,
        state: newBranch.state || 'active'
      }

      const numericIds = branches.value
        .map(b => Number(b.id))
        .filter(n => !Number.isNaN(n))
      
      const maxId = numericIds.length ? Math.max(...numericIds) : 0
      branchToAdd.id = maxId + 1

      branches.value.push(branchToAdd)
      rebuildFuse()
      filterBranches()
    }

    const handleBranchUpdate = (updatedBranch) => {
      const index = branches.value.findIndex(
        b => Number(b.id) === Number(updatedBranch.id)
      )
      
      if (index > -1) {
        branches.value[index] = { 
          ...updatedBranch, 
          id: Number(updatedBranch.id) 
        }
        rebuildFuse()
        filterBranches()
      }
    }

    const deleteBranch = () => {
      const index = branches.value.findIndex(
        b => Number(b.id) === Number(selectedBranch.value.id)
      )
      
      if (index > -1) {
        branches.value[index].state = 'deleted'
        rebuildFuse()
        filterBranches()
      }
    }

    const viewBranch = (branch) => {
      selectedBranch.value = { ...branch }
      showDetailDialog.value = true
    }

    const editBranch = (branch) => {
      selectedBranch.value = { ...branch }
      showEditDialog.value = true
      showDetailDialog.value = false
    }

    const openNewBranchDialog = () => {
      showNewDialog.value = true
    }

    const confirmDeleteBranch = (branch) => {
      selectedBranch.value = { ...branch }
      showDeleteDialog.value = true
    }

    onMounted(() => {
      loadBranches()
    })

    watch(search, () => {
      filterBranches()
    })

    return {
      search,
      branches,
      filteredBranches,
      selectedBranch,
      showDetailDialog,
      showEditDialog,
      showNewDialog,
      showDeleteDialog,
      totalBranches,
      totalLocations,
      totalServices,
      totalFeatures,
      filterBranches,
      handleBranchCreate,
      handleBranchUpdate,
      deleteBranch,
      viewBranch,
      editBranch,
      openNewBranchDialog,
      confirmDeleteBranch,
      getSchedulePreview,
      handleImageError
    }
  }
}
</script>

<!-- Los estilos están en app.scss global -->