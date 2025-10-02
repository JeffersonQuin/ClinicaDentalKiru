<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="new-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-tooth"></i>
            <span>Crear Nueva Especialidad</span>
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

      <q-form @submit="createSpeciality" class="form-container">
        <q-card-section class="dialog-content">
          <div class="welcome-message">
            <i class="fa-solid fa-info-circle"></i>
            <p>Complete los siguientes datos para crear una nueva especialidad en el sistema.</p>
          </div>

          <div class="form-fields">
            <div class="field-group full-width">
              <label class="field-label">
                <i class="fa-solid fa-tag"></i>
                <span>Nombre de la Especialidad</span>
                <span class="required">*</span>
              </label>
              <q-input
                v-model="form.name"
                filled
                dense
                :rules="[
                  val => !!val || 'El nombre de la especialidad es requerido',
                  val => val.length >= 3 || 'Mínimo 3 caracteres'
                ]"
                class="form-input"
                placeholder="Ej: Ortodoncia, Endodoncia, Periodoncia..."
              />
            </div>

            <div class="field-group full-width">
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
                rows="6"
                :rules="[
                  val => !!val || 'La descripción es requerida',
                  val => val.length >= 20 || 'Mínimo 20 caracteres'
                ]"
                class="form-input"
                placeholder="Ingrese una descripción detallada de la especialidad, sus características y procedimientos principales..."
              />
            </div>

            <div class="field-group full-width">
              <label class="field-label">
                <i class="fa-solid fa-image"></i>
                <span>URL de la Imagen</span>
                <span class="optional">(opcional)</span>
              </label>
              <q-input
                v-model="form.image"
                filled
                dense
                type="url"
                :rules="[
                  val => !val || /^https?:\/\/.+/.test(val) || 'Ingrese una URL válida'
                ]"
                class="form-input"
                placeholder="https://ejemplo.com/imagen.jpg"
              >
                <template v-slot:hint>
                  Si no proporciona una imagen, se usará una imagen predeterminada
                </template>
              </q-input>
              
              <div v-if="form.image" class="image-preview">
                <div class="preview-label">Vista previa de la imagen:</div>
                <q-img
                  :src="form.image"
                  :ratio="16/9"
                  spinner-color="primary"
                  class="preview-img"
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
            label="Crear Especialidad"
            icon="fa-solid fa-tooth"
            :loading="loading"
            class="primary-btn"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'NewSpecialityDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'speciality-created'],
  setup(props, { emit }) {
    const $q = useQuasar()
    const loading = ref(false)
    
    const form = ref({
      name: '',
      description: '',
      image: ''
    })

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const resetForm = () => {
      form.value = {
        name: '',
        description: '',
        image: ''
      }
    }

    const closeDialog = () => {
      showDialog.value = false
      resetForm()
    }

    const createSpeciality = async () => {
      loading.value = true
      
      try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const newSpeciality = {
          name: form.value.name,
          description: form.value.description,
          image: form.value.image || 'https://cdn.quasar.dev/img/parallax2.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: null
        }

        emit('speciality-created', newSpeciality)
        
        // Mostrar mensaje de éxito
        $q.notify({
          type: 'positive',
          message: `Especialidad "${newSpeciality.name}" creada correctamente`,
          icon: 'fa-solid fa-check-circle',
          timeout: 3000
        })

        closeDialog()
      } catch (error) {
        console.error('Error creating speciality:', error)
        
        $q.notify({
          type: 'negative',
          message: 'Error al crear la especialidad. Inténtelo nuevamente.',
          icon: 'fa-solid fa-exclamation-triangle',
          timeout: 4000
        })
      } finally {
        loading.value = false
      }
    }

    return {
      showDialog,
      form,
      loading,
      closeDialog,
      createSpeciality
    }
  }
}
</script>

