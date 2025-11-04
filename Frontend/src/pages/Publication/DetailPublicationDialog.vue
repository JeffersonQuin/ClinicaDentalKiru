<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="detail-dialog publication-detail-card" style="max-width: 700px">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-newspaper"></i>
            <span>Detalles de la Publicación</span>
          </div>
          <q-btn
            flat
            round
            dense
            icon="fa-solid fa-times"
            v-close-popup
            class="close-btn"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="dialog-content" style="padding: 0">
        <!-- Carrusel de Imágenes Grande -->
        <div class="publication-carousel-container">
          <q-carousel
            v-model="currentSlide"
            animated
            arrows
            navigation
            infinite
            control-color="primary"
            control-type="flat"
            navigation-icon="fa-solid fa-circle"
            prev-icon="fa-solid fa-chevron-left"
            next-icon="fa-solid fa-chevron-right"
            height="350px"
            class="publication-carousel"
          >
            <q-carousel-slide
              v-for="(img, index) in (publicationData?.imagenes || [])"
              :key="index"
              :name="index"
              :img-src="img"
              class="carousel-slide-large"
            />
          </q-carousel>
          
          <div class="carousel-image-counter">
            <i class="fa-solid fa-images"></i>
            {{ currentSlide + 1 }} / {{ publicationData?.imagenes?.length || 0 }}
          </div>
        </div>

        <!-- Información de la Publicación -->
        <div class="publication-info-section">
          <div class="publication-header-info">
            <h3 class="publication-title-detail">{{ publicationData?.titulo || 'Sin título' }}</h3>
            <q-badge
              :class="['state-badge-large', getStateClass(publicationData?.state)]"
              :label="formatState(publicationData?.state)"
            />
          </div>

          <div class="publication-meta">
            <div class="meta-item">
              <i class="fa-solid fa-user"></i>
              <span class="meta-label">Autor:</span>
              <q-chip
                dense
                icon="fa-solid fa-user-circle"
                class="type-chip type-moderator"
                size="sm"
              >
                {{ getUserName(publicationData?.userId) }}
              </q-chip>
            </div>

            <div class="meta-item">
              <i class="fa-solid fa-hashtag"></i>
              <span class="meta-label">ID:</span>
              <span class="meta-value">{{ publicationData?.id || 'N/A' }}</span>
            </div>
          </div>

          <q-separator class="publication-separator" />

          <div class="publication-description-section">
            <div class="section-title">
              <i class="fa-solid fa-align-left"></i>
              <span>Descripción</span>
            </div>
            <p class="publication-description-text">
              {{ publicationData?.descripcion || 'Sin descripción disponible' }}
            </p>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions class="dialog-actions">
        <q-btn
          flat
          label="Cerrar"
          icon="fa-solid fa-times"
          v-close-popup
          class="secondary-btn"
          no-caps
        />
        <q-btn
          unelevated
          label="Editar Publicación"
          icon="fa-solid fa-edit"
          @click="editPublication"
          class="primary-btn"
          color="primary"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, ref } from 'vue'
import users from 'src/data/users.json'

export default {
  name: 'DetailPublicationDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    publicationData: {
      type: Object,
      default: () => null
    }
  },
  emits: ['update:modelValue', 'edit-publication'],
  setup(props, { emit }) {
    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const currentSlide = ref(0)
    const usersMap = ref({})

    // Cargar mapa de usuarios
    users.users.forEach(user => {
      usersMap.value[user.id] = user.username
    })

    const getUserName = (userId) => {
      return usersMap.value[userId] || `Usuario ${userId}`
    }

    const formatState = (state) => {
      const s = String(state || '').toLowerCase()
      const states = {
        active: 'Activa',
        inactive: 'Inactiva'
      }
      return states[s] || (state ? String(state) : 'No disponible')
    }

    const getStateClass = (state) => {
      const s = String(state || '').toLowerCase()
      const classes = {
        active: 'state-active',
        inactive: 'state-inactive'
      }
      return classes[s] || 'state-default'
    }

    const editPublication = () => {
      emit('edit-publication', props.publicationData)
      showDialog.value = false
      currentSlide.value = 0
    }

    return {
      showDialog,
      currentSlide,
      formatState,
      getStateClass,
      editPublication,
      getUserName
    }
  }
}
</script>

<!-- Los estilos están en app.scss global -->