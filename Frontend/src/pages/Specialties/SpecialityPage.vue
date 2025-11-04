<template>
  <div class="page-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <i class="fa-solid fa-tooth header-icon"></i>
          <div>
            <h1 class="page-title">Gestión de Especialidades</h1>
            <p class="page-subtitle">Configure y administre los servicios odontológicos de su clínica</p>
          </div>
        </div>
        <q-btn
          class="primary-btn"
          color="primary"
          icon="fa-solid fa-plus"
          label="Agregar Especialidad"
          @click="openNewSpecialityDialog"
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
        placeholder="Buscar especialidades por nombre o descripción..."
        @input="filterSpecialities"
        clearable
        dense
      >
        <template v-slot:prepend>
          <i class="fa-solid fa-search"></i>
        </template>
      </q-input>
    </div>

    <!-- Main Content Section -->
    <div class="content-layout">
      <!-- Left Side - Info and Stats -->
      <div class="info-section">
        <div class="info-card">
          <div class="info-header">
            <h2 class="info-title">Panel de Especialidades</h2>
          </div>
          <div class="info-content">
            <p class="info-description">
              Administre el catálogo completo de especialidades odontológicas disponibles 
              en su clínica. Cada especialidad puede ser editada, visualizada o eliminada 
              según las necesidades de su práctica dental.
            </p>
            
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ filteredSpecialities.length }}</div>
                <div class="stat-label">Especialidades Registradas</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ totalPages }}</div>
                <div class="stat-label">Páginas Disponibles</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Branding Circle -->
        <div class="branding-card">
          <div class="branding-circle">
            <q-img
              src="/KiruIMG/speciality.png"
              spinner-color="primary"
              fit="contain"
              class="brand-image"
            />
          </div>
          <p class="branding-text">Sistema de Gestión Dental</p>
        </div>
      </div>

      <!-- Right Side - Specialities Grid -->
      <div class="specialities-section">
        <div class="section-header">
          <h3 class="section-title">Catálogo de Especialidades</h3>
          <div class="results-count">
            <span class="count-badge">{{ filteredSpecialities.length }} especialidad{{ filteredSpecialities.length !== 1 ? 'es' : '' }}</span>
          </div>
        </div>

        <div class="cards-container">
          <div v-if="filteredSpecialities.length === 0" class="no-data-container">
            <i class="fa-solid fa-tooth no-data-icon"></i>
            <p class="no-data-text">No se encontraron especialidades</p>
            <p class="no-data-subtext">Intenta ajustar los filtros de búsqueda o agrega una nueva especialidad</p>
          </div>
          
          <transition-group v-else name="card-fade" tag="div" class="cards-grid">
            <div 
              v-for="speciality in currentPageSpecialities" 
              :key="speciality.id"
              class="speciality-card"
            >
              <div class="card-image-container">
                <q-img 
                  :src="speciality.image || 'https://cdn.quasar.dev/img/parallax2.jpg'"
                  :ratio="4/3"
                  spinner-color="primary"
                  @error="handleImageError"
                  class="card-image"
                >
                  <div class="image-overlay"></div>
                </q-img>
              </div>
              
              <div class="card-content">
                <h4 class="card-title">{{ speciality.name }}</h4>
                <p class="card-description">{{ truncateText(speciality.description, 80) }}</p>
                
                <div class="card-actions">
                  <q-btn 
                    flat 
                    dense
                    icon="fa-solid fa-eye"
                    label="Ver"
                    @click="viewSpeciality(speciality)"
                    class="action-btn view-btn"
                    color="grey-8"
                  />
                  <q-btn 
                    flat 
                    dense
                    icon="fa-solid fa-edit"
                    label="Editar"
                    color="primary"
                    @click="editSpeciality(speciality)"
                    class="action-btn edit-btn"
                  />
                  <q-btn 
                    flat 
                    dense
                    icon="fa-solid fa-trash"
                    label="Eliminar"
                    color="negative"
                    @click="confirmDeleteSpeciality(speciality)"
                    class="action-btn delete-btn"
                  />
                </div>
              </div>
            </div>
          </transition-group>
        </div>

        <!-- Pagination Controls -->
        <div class="pagination-section" v-if="totalPages > 1">
          <div class="pagination-controls">
            <q-btn
              flat
              round
              dense
              icon="fa-solid fa-chevron-left"
              :disable="currentPage === 0"
              @click="previousPage"
              class="pagination-btn"
              color="primary"
            />
            
            <div class="pagination-pages">
              <q-btn
                v-for="page in visiblePages"
                :key="page"
                flat
                dense
                :label="page + 1"
                @click="goToPage(page)"
                :class="['page-btn', { active: currentPage === page }]"
                :color="currentPage === page ? 'primary' : 'grey-7'"
              />
            </div>
            
            <q-btn
              flat
              round
              dense
              icon="fa-solid fa-chevron-right"
              :disable="currentPage === totalPages - 1"
              @click="nextPage"
              class="pagination-btn"
              color="primary"
            />
          </div>
          
          <div class="pagination-info">
            Página {{ currentPage + 1 }} de {{ totalPages }} • Mostrando {{ currentPageSpecialities.length }} de {{ filteredSpecialities.length }}
          </div>
        </div>
      </div>
    </div>

    <!-- Dialogs -->
    <DetailSpecialityDialog
      v-model="showDetailDialog"
      :speciality-data="selectedSpeciality"
      @edit-speciality="editSpeciality"
    />

    <EditSpecialityDialog
      v-model="showEditDialog"
      :speciality-data="selectedSpeciality"
      @speciality-updated="handleSpecialityUpdate"
    />

    <NewSpecialityDialog
      v-model="showNewDialog"
      @speciality-created="handleSpecialityCreate"
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
            ¿Está seguro que desea eliminar la especialidad <strong>{{ selectedSpeciality?.name }}</strong>?
          </p>
          <p class="dialog-subtext">
            Esta acción no se puede deshacer y la especialidad dejará de estar disponible en el sistema.
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
            label="Eliminar Especialidad" 
            color="negative" 
            @click="deleteSpeciality"      
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
import especialidades from 'src/data/especialidades.json'
import Fuse from 'fuse.js'
import DetailSpecialityDialog from './DetailSpecialityDialog.vue'
import EditSpecialityDialog from './EditSpecialityDialog.vue'
import NewSpecialityDialog from './NewSpecialityDialog.vue'

export default {
  name: 'SpecialityPage',
  components: {
    DetailSpecialityDialog,
    EditSpecialityDialog,
    NewSpecialityDialog
  },
  setup() {
    const search = ref('')
    const specialities = ref([])
    const filteredSpecialities = ref([])
    const selectedSpeciality = ref(null)
    const showDetailDialog = ref(false)
    const showEditDialog = ref(false)
    const showNewDialog = ref(false)
    const showDeleteDialog = ref(false)
    const currentPage = ref(0)
    const itemsPerPage = 4
    let fuse = null

    const fuseOptions = {
      keys: ['name', 'description'],
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 1
    }

    const totalPages = computed(() => {
      return Math.ceil(filteredSpecialities.value.length / itemsPerPage)
    })

    const currentPageSpecialities = computed(() => {
      const start = currentPage.value * itemsPerPage
      const end = start + itemsPerPage
      return filteredSpecialities.value.slice(start, end)
    })

    const visiblePages = computed(() => {
      const total = totalPages.value
      const current = currentPage.value
      const pages = []
      
      if (total <= 7) {
        for (let i = 0; i < total; i++) {
          pages.push(i)
        }
      } else {
        if (current <= 3) {
          for (let i = 0; i < 5; i++) pages.push(i)
          pages.push('...')
          pages.push(total - 1)
        } else if (current >= total - 4) {
          pages.push(0)
          pages.push('...')
          for (let i = total - 5; i < total; i++) pages.push(i)
        } else {
          pages.push(0)
          pages.push('...')
          for (let i = current - 1; i <= current + 1; i++) pages.push(i)
          pages.push('...')
          pages.push(total - 1)
        }
      }
      
      return pages
    })

    const loadSpecialities = () => {
      specialities.value = especialidades.especialidades || []
      filteredSpecialities.value = specialities.value.filter(s => s.state !== 'deleted')
      fuse = new Fuse(filteredSpecialities.value, fuseOptions)
    }

    const filterSpecialities = () => {
      currentPage.value = 0
      if (!search.value || search.value.trim() === '') {
        filteredSpecialities.value = specialities.value.filter(s => s.state !== 'deleted')
      } else {
        const results = fuse.search(search.value.trim())
        filteredSpecialities.value = results.map(result => result.item)
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value - 1) {
        currentPage.value++
      }
    }

    const previousPage = () => {
      if (currentPage.value > 0) {
        currentPage.value--
      }
    }

    const goToPage = (page) => {
      if (page !== '...' && page >= 0 && page < totalPages.value) {
        currentPage.value = page
      }
    }

    const truncateText = (text, maxLength) => {
      if (!text) return ''
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    }

    const handleImageError = (event) => {
      event.target.src = 'https://cdn.quasar.dev/img/parallax2.jpg'
    }

    const viewSpeciality = (speciality) => {
      selectedSpeciality.value = { ...speciality }
      showDetailDialog.value = true
    }

    const editSpeciality = (speciality) => {
      selectedSpeciality.value = { ...speciality }
      showEditDialog.value = true
      showDetailDialog.value = false
    }

    const openNewSpecialityDialog = () => {
      showNewDialog.value = true
    }

    const confirmDeleteSpeciality = (speciality) => {
      selectedSpeciality.value = { ...speciality }
      showDeleteDialog.value = true
    }

    const deleteSpeciality = () => {
      const index = specialities.value.findIndex(s => s.id === selectedSpeciality.value.id)
      if (index > -1) {
        specialities.value[index].state = 'deleted'
        filterSpecialities()
      }
    }

    const handleSpecialityUpdate = (updatedSpeciality) => {
      const index = specialities.value.findIndex(s => s.id === updatedSpeciality.id)
      if (index > -1) {
        specialities.value[index] = { ...updatedSpeciality }
        filterSpecialities()
      }
    }

    const handleSpecialityCreate = (newSpeciality) => {
      const maxId = specialities.value.length > 0 
        ? Math.max(...specialities.value.map(s => s.id)) 
        : 0
      newSpeciality.id = maxId + 1
      newSpeciality.state = 'active'
      specialities.value.push(newSpeciality)
      filterSpecialities()
    }

    onMounted(() => {
      loadSpecialities()
    })

    watch(search, () => {
      filterSpecialities()
    })

    return {
      search,
      specialities,
      filteredSpecialities,
      selectedSpeciality,
      showDetailDialog,
      showEditDialog,
      showNewDialog,
      showDeleteDialog,
      currentPage,
      totalPages,
      currentPageSpecialities,
      visiblePages,
      filterSpecialities,
      nextPage,
      previousPage,
      goToPage,
      truncateText,
      handleImageError,
      viewSpeciality,
      editSpeciality,
      openNewSpecialityDialog,
      confirmDeleteSpeciality,
      deleteSpeciality,
      handleSpecialityUpdate,
      handleSpecialityCreate
    }
  }
}
</script>

<style lang="scss" scoped>

</style>