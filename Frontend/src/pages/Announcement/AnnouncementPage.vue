<template>
  <div class="page-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <i class="fa-solid fa-bullhorn header-icon"></i>
          <div>
            <h1 class="page-title">Gestión de Anuncios</h1>
            <p class="page-subtitle">Administra las promociones y eventos de tu clínica</p>
          </div>
        </div>
        <q-btn
          class="primary-btn"
          color="primary"
          icon="fa-solid fa-plus"
          label="Nuevo Anuncio"
          @click="anuncioStore.openNewDialog()"
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
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ anuncioStore.activeAnunciosCount }}</div>
          <div class="stat-label">Anuncios Activos</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon-container inactive">
          <i class="fa-solid fa-circle-xmark"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ anuncioStore.inactiveAnunciosCount }}</div>
          <div class="stat-label">Anuncios Inactivos</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon-container admin">
          <i class="fa-solid fa-tags"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ anuncioStore.uniqueCategories.length }}</div>
          <div class="stat-label">Categorías</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon-container total">
          <i class="fa-solid fa-bullhorn"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ anuncioStore.totalAnuncios }}</div>
          <div class="stat-label">Total de Anuncios</div>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <q-input
        v-model="anuncioStore.search"
        class="search-input"
        outlined
        type="search"
        placeholder="Buscar por título, descripción o categoría..."
        @update:model-value="anuncioStore.rebuildFuse" 
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
        :rows="displayedRows"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[5, 10, 15, 20, 0]"
        :pagination="{ rowsPerPage: 10 }"
        separator="cell"
      >
        <template v-slot:no-data>
          <div class="no-data-container">
            <i class="fa-solid fa-bullhorn no-data-icon"></i>
            <p class="no-data-text">No se encontraron anuncios</p>
            <p class="no-data-subtext">Intenta ajustar los filtros de búsqueda</p>
          </div>
        </template>

        <template v-slot:body-cell-imagen="props">
          <q-td :props="props">
            <div class="image-container">
              <q-img
                v-if="props.row.imagen"
                :src="props.row.imagen"
                :alt="props.row.titulo"
                class="table-image"
                style="height: 60px; width: 80px;"
                @error="anuncioStore.handleImageError"
              />
              <div v-else class="no-image-placeholder">
                <i class="fa-solid fa-image"></i>
                <span>Sin imagen</span>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-titulo="props">
          <q-td :props="props">
            <div class="anuncio-title">
              <span class="title-text">{{ props.row.titulo }}</span>
              <div class="categoria-badge">
                {{ props.row.categoria }}
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-fechas="props">
          <q-td :props="props">
            <div class="fechas-info">
              <div class="fecha-item">
                <i class="fa-solid fa-calendar-plus q-mr-xs"></i>
                <span>{{ anuncioStore.formatDate(props.row.fecha_publicacion) }}</span>
              </div>
              <div class="fecha-item">
                <i class="fa-solid fa-calendar-minus q-mr-xs"></i>
                <span>{{ anuncioStore.formatDate(props.row.fecha_expiracion) }}</span>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-badge
              :class="['state-badge', anuncioStore.getStateClass(props.row.estado)]"
              :label="anuncioStore.formatState(props.row.estado)"
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
                @click="anuncioStore.openDetailDialog(props.row)"
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
                @click="anuncioStore.openEditDialog(props.row)"
                color="primary"
              >
                <q-tooltip>Editar anuncio</q-tooltip>
              </q-btn>
              
              <q-btn
                class="action-btn delete-btn"
                flat
                dense
                round
                icon="fa-solid fa-trash"
                size="sm"
                @click="anuncioStore.confirmDeleteAnuncio(props.row)"
                color="negative"
              >
                <q-tooltip>Eliminar anuncio</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialogs -->
    <DetailAnuncioDialog
      v-model="anuncioStore.showDetailDialog"
      :anuncio-data="anuncioStore.selectedAnuncio"
      @edit-anuncio="anuncioStore.openEditDialog"
    />

    <EditAnuncioDialog
      v-model="anuncioStore.showEditDialog"
      :anuncio-data="anuncioStore.selectedAnuncio"
      @anuncio-updated="anuncioStore.actualizarAnuncio"
    />

    <NewAnuncioDialog
      v-model="anuncioStore.showNewDialog"
      @anuncio-created="anuncioStore.agregarAnuncio"
    />

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="anuncioStore.showDeleteDialog" persistent>
      <q-card class="confirm-dialog">
        <q-card-section class="dialog-header">
          <div class="dialog-icon-container">
            <i class="fa-solid fa-exclamation-triangle dialog-icon"></i>
          </div>
          <h3 class="dialog-title">Confirmar Eliminación</h3>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="dialog-text">
            ¿Está seguro que desea eliminar el anuncio <strong>{{ anuncioStore.selectedAnuncio?.titulo }}</strong>?
          </p>
          <p class="dialog-subtext">
            Esta acción no se puede deshacer y el anuncio dejará de ser visible.
          </p>
        </q-card-section>

        <q-card-actions class="dialog-actions">
          <q-btn 
            flat 
            label="Cancelar" 
            color="grey-7" 
            @click="anuncioStore.closeDeleteDialog" 
            no-caps
            class="dialog-btn"
          />
          <q-btn 
            unelevated
            label="Eliminar Anuncio" 
            color="negative" 
            @click="anuncioStore.eliminarAnuncio"
            no-caps
            class="dialog-btn"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue' 
import { usePublicarAnuncio } from 'src/stores/publicarAnuncio'
import DetailAnuncioDialog from './DetailAnnouncementDialog.vue'
import EditAnuncioDialog from './EditAnnouncementDialog.vue'
import NewAnuncioDialog from './NewAnnouncementDialog.vue'

const columns = [
  {
    name: 'imagen',
    required: true,
    label: 'Imagen',
    align: 'center',
    field: 'imagen',
    sortable: false,
    style: 'width: 100px'
  },
  {
    name: 'titulo',
    required: true,
    label: 'Título',
    align: 'left',
    field: 'titulo',
    sortable: true
  },
  {
    name: 'categoria',
    label: 'Categoría',
    field: 'categoria',
    sortable: true,
    align: 'center',
    style: 'width: 120px'
  },
  {
    name: 'fechas',
    label: 'Fechas',
    field: 'fechas',
    sortable: false,
    align: 'left',
    style: 'width: 180px'
  },
  {
    name: 'estado',
    label: 'Estado',
    field: 'estado',
    sortable: true,
    align: 'center',
    style: 'width: 100px'
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

export default {
  name: 'AnunciosPage',
  
  components: {
    DetailAnuncioDialog,
    EditAnuncioDialog,
    NewAnuncioDialog
  },
  
  setup() {
    const anuncioStore = usePublicarAnuncio()

    // Computed property para las filas a mostrar
    const displayedRows = computed(() => {
      return anuncioStore.searchResults
    })

    onMounted(() => {
      anuncioStore.initialize()
    })

    return {
      anuncioStore,
      columns,
      displayedRows // AGREGADO
    }
  }
}
</script>