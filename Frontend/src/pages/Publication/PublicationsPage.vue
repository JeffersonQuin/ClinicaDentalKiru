<template>
  <div class="page-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <i class="fa-solid fa-newspaper header-icon"></i>
          <div>
            <h1 class="page-title">Gestión de Publicaciones</h1>
            <p class="page-subtitle">Administra el contenido educativo de tu clínica</p>
          </div>
        </div>
        <q-btn
          class="primary-btn"
          color="primary"
          icon="fa-solid fa-plus"
          label="Nueva Publicación"
          @click="openNewPublicationDialog"
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
          <div class="stat-value">{{ activePublicationsCount }}</div>
          <div class="stat-label">Publicaciones Activas</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon-container inactive">
          <i class="fa-solid fa-circle-xmark"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ inactivePublicationsCount }}</div>
          <div class="stat-label">Publicaciones Inactivas</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon-container admin">
          <i class="fa-solid fa-images"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalImages }}</div>
          <div class="stat-label">Imágenes Totales</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon-container total">
          <i class="fa-solid fa-file-lines"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ filteredRows.length }}</div>
          <div class="stat-label">Total de Publicaciones</div>
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
        placeholder="Buscar por título, descripción o autor..."
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
            <i class="fa-solid fa-newspaper no-data-icon"></i>
            <p class="no-data-text">No se encontraron publicaciones</p>
            <p class="no-data-subtext">Intenta ajustar los filtros de búsqueda</p>
          </div>
        </template>

        <template v-slot:body-cell-imagenes="props">
          <q-td :props="props">
            <div class="table-carousel-container">
              <q-carousel
                v-model="carouselModels[props.row.id]"
                animated
                arrows
                control-color="primary"
                height="60px"
                class="table-carousel"
              >
                <q-carousel-slide
                  v-for="(img, index) in props.row.imagenes"
                  :key="index"
                  :name="index"
                  :img-src="img"
                  class="table-carousel-slide"
                />
              </q-carousel>
              <div class="image-counter">
                {{ (carouselModels[props.row.id] || 0) + 1 }}/{{ props.row.imagenes.length }}
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-titulo="props">
          <q-td :props="props">
            <div class="publication-title">
              <span class="title-text">{{ props.row.titulo }}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-userId="props">
          <q-td :props="props">
            <q-chip
              dense
              icon="fa-solid fa-user"
              class="type-chip type-moderator"
              size="sm"
            >
              {{ getUserName(props.row.userId) }}
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
                @click="viewPublication(props.row)"
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
                @click="editPublication(props.row)"
                color="primary"
              >
                <q-tooltip>Editar publicación</q-tooltip>
              </q-btn>
              
              <q-btn
                class="action-btn delete-btn"
                flat
                dense
                round
                icon="fa-solid fa-trash"
                size="sm"
                @click="confirmDeletePublication(props.row)"
                color="negative"
              >
                <q-tooltip>Eliminar publicación</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialogs -->
    <DetailPublicationDialog
      v-model="showDetailDialog"
      :publication-data="selectedPublication"
      @edit-publication="editPublication"
    />

    <EditPublicationDialog
      v-model="showEditDialog"
      :publication-data="selectedPublication"
      @publication-updated="handlePublicationUpdate"
    />

    <NewPublicationDialog
      v-model="showNewDialog"
      @publication-created="handlePublicationCreate"
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
            ¿Está seguro que desea eliminar la publicación <strong>{{ selectedPublication?.titulo }}</strong>?
          </p>
          <p class="dialog-subtext">
            Esta acción no se puede deshacer y la publicación dejará de ser visible.
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
            label="Eliminar Publicación" 
            color="negative" 
            @click="deletePublication"
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
import publicaciones from 'src/data/publicaciones.json'
import users from 'src/data/users.json'
import Fuse from 'fuse.js'
import DetailPublicationDialog from './DetailPublicationDialog.vue'
import EditPublicationDialog from './EditPublicationDialog.vue'
import NewPublicationDialog from './NewPublicationDialog.vue'

const columns = [
  {
    name: 'imagenes',
    required: true,
    label: 'Imágenes',
    align: 'center',
    field: 'imagenes',
    sortable: false,
    style: 'width: 120px'
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
    name: 'userId',
    label: 'Autor',
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
  keys: ['titulo', 'descripcion'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 1
}

const STATE_TRANSLATIONS = {
  active: 'Activa',
  inactive: 'Inactiva'
}

const STATE_CLASSES = {
  active: 'state-active',
  inactive: 'state-inactive'
}

export default {
  name: 'PublicationsPage',
  
  components: {
    DetailPublicationDialog,
    EditPublicationDialog,
    NewPublicationDialog
  },
  
  setup() {
    const search = ref('')
    const rows = ref([])
    const filteredRows = ref([])
    const selectedPublication = ref(null)
    const showDetailDialog = ref(false)
    const showEditDialog = ref(false)
    const showNewDialog = ref(false)
    const showDeleteDialog = ref(false)
    const carouselModels = ref({})
    const usersMap = ref({})
    let fuse = null

    const activePublicationsCount = computed(() => 
      filteredRows.value.filter(p => p.state === 'active').length
    )

    const inactivePublicationsCount = computed(() => 
      filteredRows.value.filter(p => p.state === 'inactive').length
    )

    const totalImages = computed(() => {
      return filteredRows.value.reduce((sum, p) => sum + (p.imagenes?.length || 0), 0)
    })

    const truncateText = (text, length) => {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    }

    const getUserName = (userId) => {
      return usersMap.value[userId] || `Usuario ${userId}`
    }

    const formatState = (state) => STATE_TRANSLATIONS[state] || state
    const getStateClass = (state) => STATE_CLASSES[state] || 'state-default'

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

    const loadPublications = () => {
      rows.value = publicaciones.publicaciones.map(p => ({ 
        ...p, 
        id: Number(p.id) 
      }))
      
      // Inicializar carousels en 0
      rows.value.forEach(p => {
        carouselModels.value[p.id] = 0
      })
      
      filteredRows.value = rows.value.filter(p => p.state !== 'deleted')
      fuse = new Fuse(filteredRows.value, FUSE_OPTIONS)
    }

    const loadUsers = () => {
      users.users.forEach(user => {
        usersMap.value[user.id] = user.username
      })
    }

    const handlePublicationCreate = (newPublication) => {
      const publicationToAdd = {
        titulo: newPublication.titulo || '',
        imagenes: newPublication.imagenes || [],
        descripcion: newPublication.descripcion || '',
        userId: newPublication.userId || null,
        state: newPublication.state || 'active'
      }

      const numericIds = rows.value
        .map(p => Number(p.id))
        .filter(n => !Number.isNaN(n))
      
      const maxId = numericIds.length ? Math.max(...numericIds) : 0
      publicationToAdd.id = maxId + 1

      carouselModels.value[publicationToAdd.id] = 0

      rows.value.push(publicationToAdd)
      rebuildFuse()
      filterRows()
    }

    const handlePublicationUpdate = (updatedPublication) => {
      const index = rows.value.findIndex(
        p => Number(p.id) === Number(updatedPublication.id)
      )
      
      if (index > -1) {
        rows.value[index] = { 
          ...updatedPublication, 
          id: Number(updatedPublication.id) 
        }
        carouselModels.value[updatedPublication.id] = 0
        rebuildFuse()
        filterRows()
      }
    }

    const deletePublication = () => {
      const index = rows.value.findIndex(
        p => Number(p.id) === Number(selectedPublication.value.id)
      )
      
      if (index > -1) {
        rows.value[index].state = 'deleted'
        rebuildFuse()
        filterRows()
      }
    }

    const viewPublication = (publication) => {
      selectedPublication.value = { ...publication }
      showDetailDialog.value = true
    }

    const editPublication = (publication) => {
      selectedPublication.value = { ...publication }
      showEditDialog.value = true
      showDetailDialog.value = false
    }

    const openNewPublicationDialog = () => {
      showNewDialog.value = true
    }

    const confirmDeletePublication = (publication) => {
      selectedPublication.value = { ...publication }
      showDeleteDialog.value = true
    }

    onMounted(() => {
      loadUsers()
      loadPublications()
    })

    watch(search, () => {
      filterRows()
    })

    return {
      search,
      columns,
      rows,
      filteredRows,
      selectedPublication,
      showDetailDialog,
      showEditDialog,
      showNewDialog,
      showDeleteDialog,
      carouselModels,
      activePublicationsCount,
      inactivePublicationsCount,
      totalImages,
      filterRows,
      handlePublicationCreate,
      handlePublicationUpdate,
      deletePublication,
      viewPublication,
      editPublication,
      openNewPublicationDialog,
      confirmDeletePublication,
      formatState,
      getStateClass,
      getUserName,
      truncateText
    }
  }
}
</script>

<style scoped>
.table-carousel-container {
  position: relative;
  width: 100px;
  margin: 0 auto;
}

.table-carousel {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-carousel-slide {
  background-size: cover;
  background-position: center;
}

.image-counter {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}

.publication-title {
  font-weight: 600;
  color: #2c3e50;
}

.title-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.publication-description {
  color: #7f8c8d;
  font-size: 13px;
  line-height: 1.4;
}
</style>