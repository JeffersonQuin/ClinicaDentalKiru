<template>
  <q-dialog maximized v-model="showDialog" persistent>
    <q-card class="edit-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-tooth"></i>
            <span>Editar Especialidad</span>
          </div>
          <q-btn
            flat
            round
            dense
            icon="fa-solid fa-times"
            @click="closeDialog"
            class="close-btn"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-form @submit="saveSpeciality" class="form-container">
        <q-card-section class="dialog-content">
          <div class="form-fields">
            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-tag"></i>
                <span>Nombre de la Especialidad</span>
                <span class="required">*</span>
              </label>
              <q-input
                v-model="form.name"
                filled
                dense
                :rules="[val => !!val || 'El nombre de la especialidad es requerido']"
                class="form-input"
                placeholder="Ingrese el nombre de la especialidad"
              />
            </div>

            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-align-left"></i>
                <span>Descripción</span>
                <span class="required">*</span>
              </label>
              <q-input
                v-model="form.description"
                filled
                dense
                type="textarea"
                rows="5"
                :rules="[val => !!val || 'La descripción es requerida']"
                class="form-input"
                placeholder="Ingrese una descripción detallada de la especialidad"
              />
            </div>

            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-image"></i>
                <span>URL de la Imagen</span>
              </label>
              <q-input
                v-model="form.image"
                filled
                dense
                type="url"
                class="form-input"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              
              <div v-if="form.image" class="image-preview">
                <q-img
                  :src="form.image"
                  :ratio="16/9"
                  spinner-color="primary"
                  class="preview-img"
                  @error="handleImageError"
                >
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-negative text-white">
                      <i class="fa-solid fa-image-slash"></i>
                      <span class="q-ml-sm">Error al cargar imagen</span>
                    </div>
                  </template>
                </q-img>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions class="dialog-actions">
          <q-btn
            flat
            label="Cancelar"
            @click="closeDialog"
            class="secondary-btn"
          />
          <q-btn
            type="submit"
            label="Guardar Cambios"
            icon="fa-solid fa-save"
            :loading="loading"
            class="primary-btn"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'EditSpecialityDialog',
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
  emits: ['update:modelValue', 'speciality-updated'],
  setup(props, { emit }) {
    const $q = useQuasar()
    const loading = ref(false)
    const form = ref({
      id: null,
      name: '',
      description: '',
      image: ''
    })

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const initializeForm = () => {
      if (props.specialityData) {
        form.value = {
          id: props.specialityData.id,
          name: props.specialityData.name || '',
          description: props.specialityData.description || '',
          image: props.specialityData.image || ''
        }
      }
    }

    const resetForm = () => {
      form.value = {
        id: null,
        name: '',
        description: '',
        image: ''
      }
    }

    const closeDialog = () => {
      showDialog.value = false
      resetForm()
    }

    const handleImageError = () => {
      console.warn('Error loading image preview')
    }

    const saveSpeciality = async () => {
      loading.value = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const updatedSpeciality = {
          ...props.specialityData,
          name: form.value.name,
          description: form.value.description,
          image: form.value.image,
          updatedAt: new Date().toISOString()
        }

        emit('speciality-updated', updatedSpeciality)
        
        $q.notify({
          type: 'positive',
          message: 'Especialidad actualizada correctamente',
          icon: 'fa-solid fa-check-circle'
        })

        closeDialog()
      } catch (error) {
        console.error('Error updating speciality:', error)
        
        $q.notify({
          type: 'negative',
          message: 'Error al actualizar la especialidad',
          icon: 'fa-solid fa-exclamation-triangle'
        })
      } finally {
        loading.value = false
      }
    }

    watch(() => props.specialityData, (newData) => {
      if (newData) {
        initializeForm()
      }
    }, { immediate: true })

    watch(() => props.modelValue, (newValue) => {
      if (newValue) {
        initializeForm()
      }
    })

    return {
      showDialog,
      form,
      loading,
      closeDialog,
      handleImageError,
      saveSpeciality
    }
  }
}
</script>

<style lang="scss" scoped>
.image-preview {
  margin-top: 12px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-img {
  max-width: 100%;
}
</style>