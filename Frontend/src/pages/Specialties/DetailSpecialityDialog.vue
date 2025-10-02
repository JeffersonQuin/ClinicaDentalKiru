<template>
  <q-dialog maximized v-model="showDialog" persistent>
    <q-card class="detail-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-tooth"></i>
            <span>Detalles de la Especialidad</span>
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

      <q-card-section class="dialog-content">
        <div class="speciality-image-section">
          <div class="image-container">
            <q-img
              :src="specialityData?.image || 'https://cdn.quasar.dev/img/parallax2.jpg'"
              :ratio="16/9"
              spinner-color="primary"
              class="speciality-image"
              @error="handleImageError"
            >
              <div class="absolute-bottom image-overlay">
                <div class="text-h5">{{ specialityData?.name }}</div>
              </div>
            </q-img>
          </div>
        </div>
        
        <div class="user-details">
          <div class="detail-row">
            <div class="detail-label">
              <i class="fa-solid fa-id-badge"></i>
              <span>ID de Especialidad</span>
            </div>
            <div class="detail-value">{{ specialityData?.id ?? 'No disponible' }}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">
              <i class="fa-solid fa-tag"></i>
              <span>Nombre de la Especialidad</span>
            </div>
            <div class="detail-value">{{ specialityData?.name ?? 'No disponible' }}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">
              <i class="fa-solid fa-align-left"></i>
              <span>Descripción</span>
            </div>
            <div class="detail-value description-text">
              {{ specialityData?.description ?? 'No disponible' }}
            </div>
          </div>

          <div class="detail-row" v-if="specialityData?.createdAt">
            <div class="detail-label">
              <i class="fa-solid fa-calendar-plus"></i>
              <span>Fecha de Creación</span>
            </div>
            <div class="detail-value">{{ formatDate(specialityData?.createdAt) }}</div>
          </div>

          <div class="detail-row" v-if="specialityData?.updatedAt">
            <div class="detail-label">
              <i class="fa-solid fa-clock"></i>
              <span>Última Actualización</span>
            </div>
            <div class="detail-value">{{ formatDate(specialityData?.updatedAt) }}</div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions class="dialog-actions">
        <q-btn
          flat
          label="Cerrar"
          v-close-popup
          class="secondary-btn"
        />
        <q-btn
          flat
          label="Editar Especialidad"
          icon="fa-solid fa-edit"
          @click="editSpeciality"
          class="primary-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'DetailSpecialityDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    specialityData: {
      type: Object,
      default: () => null
    }
  },
  emits: ['update:modelValue', 'edit-speciality'],
  setup(props, { emit }) {
    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const imageErrored = ref(false)

    const handleImageError = (event) => {
      imageErrored.value = true
      event.target.src = 'https://cdn.quasar.dev/img/parallax2.jpg'
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'No disponible'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch (error) {
        console.error(error)
        return 'Fecha inválida'
      }
    }

    const editSpeciality = () => {
      emit('edit-speciality', props.specialityData)
      showDialog.value = false
      imageErrored.value = false
    }

    return {
      showDialog,
      imageErrored,
      handleImageError,
      formatDate,
      editSpeciality
    }
  }
}
</script>

<style lang="scss" scoped>
.speciality-image-section {
  margin-bottom: 24px;
}

.image-container {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.speciality-image {
  width: 100%;
}

.image-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 16px;
}

.description-text {
  line-height: 1.6;
  text-align: justify;
}
</style>