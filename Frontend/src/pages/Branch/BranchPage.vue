<template>
  <div class="page-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <i class="fa-solid fa-building header-icon"></i>
          <div>
            <h1 class="page-title">Gestión de Sucursales</h1>
            <p class="page-subtitle">Administra las ubicaciones de tu empresa</p>
          </div>
        </div>
        <q-btn
          class="primary-btn"
          color="primary"
          icon="fa-solid fa-plus"
          label="Nueva Sucursal"
          @click="sucursalStore.openNewDialog()"
          unelevated
          no-caps
          size="md"
        />
      </div>
    </div>

    <!-- Estadísticas -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-icon-container active">
          <i class="fa-solid fa-store"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ sucursalStore.totalSucursales }}</div>
          <div class="stat-label">Total Sucursales</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-container admin">
          <i class="fa-solid fa-map-location-dot"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ sucursalStore.ciudadesUnicas.length }}</div>
          <div class="stat-label">Ciudades</div>
        </div>
      </div>
    </div>

    <!-- Buscador -->
    <div class="search-section">
      <q-input
        v-model="sucursalStore.search"
        class="search-input"
        outlined
        type="search"
        placeholder="Buscar por nombre o ubicación..."
        @update:model-value="sucursalStore.filterBranches"
        clearable
        dense
      >
        <template v-slot:prepend>
          <i class="fa-solid fa-search"></i>
        </template>
      </q-input>
    </div>

    <!-- Lista de Sucursales -->
    <div class="branches-grid">
      <q-card
        v-for="branch in sucursalStore.filteredBranches"
        :key="branch.id"
        class="branch-card"
      >
        <!-- Imagen -->
        <div class="branch-image-container">
          <img
            v-if="branch.imagen"
            :src="branch.imagen"
            :alt="branch.nombre"
            class="branch-image"
            @error="sucursalStore.handleImageError"
          />
          <div v-else class="branch-image-placeholder">
            <i class="fa-solid fa-building"></i>
          </div>
          <div class="branch-location-badge">
            <i class="fa-solid fa-location-dot"></i>
            {{ branch.ubicacion }}
          </div>
        </div>

        <!-- Contenido -->
        <q-card-section class="branch-content">
          <h3 class="branch-name">{{ branch.nombre }}</h3>

          <div class="branch-info-item">
            <i class="fa-solid fa-map-marker-alt"></i>
            <span>{{ branch.direccion }}</span>
          </div>

          <div class="branch-info-item">
            <i class="fa-solid fa-circle-info"></i>
            <span>{{ branch.descripcion }}</span>
          </div>

          <div class="branch-info-item">
            <i
              :class="branch.activo ? 'fa-solid fa-check-circle text-positive' : 'fa-solid fa-times-circle text-negative'"
            ></i>
            <span>{{ branch.activo ? 'Activa' : 'Inactiva' }}</span>
          </div>
        </q-card-section>

        <!-- Acciones -->
        <q-separator />
        <q-card-actions align="right">
          <q-btn
            flat
            dense
            icon="fa-solid fa-eye"
            label="Ver"
            color="primary"
            @click="sucursalStore.openDetailDialog(branch)"
            no-caps
            size="sm"
          />
          <q-btn
            flat
            dense
            icon="fa-solid fa-edit"
            label="Editar"
            color="secondary"
            @click="sucursalStore.openEditDialog(branch)"
            no-caps
            size="sm"
          />
          <q-btn
            flat
            dense
            icon="fa-solid fa-trash"
            label="Eliminar"
            color="negative"
            @click="sucursalStore.confirmDeleteBranch(branch)"
            no-caps
            size="sm"
          />
        </q-card-actions>
      </q-card>

      <!-- Si no hay resultados -->
      <div v-if="sucursalStore.filteredBranches.length === 0" class="no-results">
        <i class="fa-solid fa-store-slash"></i>
        <p>No se encontraron sucursales</p>
        <p class="no-results-subtext">Intenta ajustar los filtros de búsqueda</p>
      </div>
    </div>

    <!-- Diálogos -->
    <DetailBranchDialog
      v-model="sucursalStore.showDetailDialog"
      :branch-data="sucursalStore.selectedBranch"
      @edit-branch="sucursalStore.openEditDialog"
      @close="sucursalStore.closeDetailDialog"
    />

    <EditBranchDialog
      v-model="sucursalStore.showEditDialog"
      :branch-data="sucursalStore.selectedBranch"
      @branch-updated="sucursalStore.actualizarSucursal"
      @close="sucursalStore.closeEditDialog"
    />

    <NewBranchDialog
      v-model="sucursalStore.showNewDialog"
      @branch-created="sucursalStore.agregarSucursal"
      @close="sucursalStore.closeNewDialog"
    />

    <!-- Confirmar Eliminación -->
    <q-dialog v-model="sucursalStore.showDeleteDialog" persistent>
      <q-card class="confirm-dialog">
        <q-card-section class="dialog-header">
          <div class="dialog-icon-container">
            <i class="fa-solid fa-exclamation-triangle dialog-icon"></i>
          </div>
          <h3 class="dialog-title">Confirmar Eliminación</h3>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="dialog-text">
            ¿Está seguro que desea eliminar la sucursal
            <strong>{{ sucursalStore.selectedBranch?.nombre }}</strong>?
          </p>
          <p class="dialog-subtext">
            Esta acción no se puede deshacer.
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn 
            flat 
            label="Cancelar" 
            color="grey-7" 
            @click="sucursalStore.closeDeleteDialog" 
            no-caps 
          />
          <q-btn
            unelevated
            label="Eliminar"
            color="negative"
            @click="sucursalStore.eliminarSucursal"
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { usePublicarSucursal } from 'src/stores/publicarSucursal'
import DetailBranchDialog from './DetailBranchDialog.vue'
import EditBranchDialog from './EditBranchDialog.vue'
import NewBranchDialog from './NewBranchDialog.vue'

export default {
  name: 'BranchesPage',

  components: {
    DetailBranchDialog,
    EditBranchDialog,
    NewBranchDialog
  },

  setup() {
    const sucursalStore = usePublicarSucursal()

    onMounted(() => {
      sucursalStore.cargarSucursales()
    })

    return {
      sucursalStore
    }
  }
}
</script>