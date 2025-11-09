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
                  :src="speciality.image || 'https://i.pinimg.com/originals/ea/d5/5a/ead55a380087931b94a3968f54d8fbda.jpg'"
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
import { ref, onMounted, computed } from 'vue'
import { useSpecialityStore } from 'src/stores/especialidadStore'
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
    const store = useSpecialityStore()

    const search = ref('')
    const showDetailDialog = ref(false)
    const showEditDialog = ref(false)
    const showNewDialog = ref(false)
    const showDeleteDialog = ref(false)
    const selectedSpeciality = ref(null)

    // Computed properties from store
    const totalPages = computed(() => store.totalPages)
    const currentPageSpecialities = computed(() => store.currentPageSpecialities)
    const filteredSpecialities = computed(() => store.filteredSpecialities)
    const visiblePages = computed(() => store.visiblePages)
    const currentPage = computed(() => store.currentPage)
    
    // Store actions
    const loadSpecialities = () => store.loadSpecialities()
    const filterSpecialities = () => store.filterSpecialities(search.value)
    const nextPage = () => store.nextPage()
    const previousPage = () => store.previousPage()
    const goToPage = (page) => store.goToPage(page)

    // UI functions
    const truncateText = (text, maxLength) => {
      if (!text) return ''
      return text.length <= maxLength ? text : text.substring(0, maxLength) + '...'
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
      if (selectedSpeciality.value) {
        store.deleteSpeciality(selectedSpeciality.value.id)
      }
    }

    const handleSpecialityUpdate = (updatedSpeciality) => {
      store.updateSpeciality(updatedSpeciality)
    }

    const handleSpecialityCreate = (newSpeciality) => {
      store.createSpeciality(newSpeciality)
    }

    onMounted(() => {
      loadSpecialities()
    })

    return {
      search,
      selectedSpeciality,
      showDetailDialog,
      showEditDialog,
      showNewDialog,
      showDeleteDialog,
      totalPages,
      currentPageSpecialities,
      filteredSpecialities,
      visiblePages,
      currentPage,
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

<style scoped>
/* Agrega tus estilos aquí */
</style>