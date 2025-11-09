<template>
  <q-dialog v-model="showDialog" persistent>
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
        <div class="speciality-header">
          <div class="header-icon">
            <i class="fa-solid fa-tooth"></i>
          </div>
          <div class="header-info">
            <h3 class="speciality-name">{{ specialityData?.name }}</h3>
            <p class="speciality-id">ID: {{ specialityData?.id ?? 'No disponible' }}</p>
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

          <div class="detail-row">
            <div class="detail-label">
              <i class="fa-solid fa-circle-check"></i>
              <span>Estado</span>
            </div>
            <div class="detail-value">
              <q-badge 
                :color="specialityData?.state === 'active' ? 'positive' : 'negative'"
                class="status-badge"
              >
                {{ specialityData?.state === 'active' ? 'Activa' : 'Inactiva' }}
              </q-badge>
            </div>
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
import { computed } from 'vue'

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

    const editSpeciality = () => {
      emit('edit-speciality', props.specialityData)
      showDialog.value = false
    }

    return {
      showDialog,
      editSpeciality
    }
  }
}
</script>

