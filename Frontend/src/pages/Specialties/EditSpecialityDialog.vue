<template>
  <q-dialog v-model="showDialog" persistent>
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

      <q-form ref="formRef" @submit="saveSpeciality" class="form-container">
        <q-card-section class="dialog-content">
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
                  val => val && val.length >= 3 || 'Mínimo 3 caracteres'
                ]"
                class="form-input"
                placeholder="Ingrese el nombre de la especialidad"
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
                  val => val && val.length >= 20 || 'Mínimo 20 caracteres'
                ]"
                class="form-input"
                placeholder="Ingrese una descripción detallada de la especialidad"
              />
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
            type="button"
          />
          <q-btn
            type="submit"
            label="Guardar Cambios"
            icon="fa-solid fa-save"
            :loading="loading"
            class="primary-btn"
            :disable="!form.name || !form.description"
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
    const formRef = ref(null)
    
    const form = ref({
      id: null,
      name: '',
      description: ''
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
          description: props.specialityData.description || ''
        }
      }
    }

    const resetForm = () => {
      form.value = {
        id: null,
        name: '',
        description: ''
      }
      if (formRef.value) {
        formRef.value.resetValidation()
      }
    }

    const closeDialog = () => {
      showDialog.value = false
      resetForm()
    }

    const saveSpeciality = async () => {
      // Validar el formulario antes de proceder
      const isValid = await formRef.value.validate()
      
      if (!isValid) {
        $q.notify({
          type: 'warning',
          message: 'Por favor, complete todos los campos requeridos correctamente',
          icon: 'fa-solid fa-exclamation-triangle',
          timeout: 3000
        })
        return
      }

      loading.value = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const updatedSpeciality = {
          ...props.specialityData,
          name: form.value.name.trim(),
          description: form.value.description.trim()
          // Mantenemos el id y state originales del store
        }

        emit('speciality-updated', updatedSpeciality)

        // Mostrar mensaje de éxito
        $q.notify({
          type: 'positive',
          message: `Especialidad "${updatedSpeciality.name}" actualizada correctamente`,
          icon: 'fa-solid fa-check-circle',
          timeout: 3000
        })

        closeDialog()
      } catch (error) {
        console.error('Error updating speciality:', error)
        
        $q.notify({
          type: 'negative',
          message: 'Error al actualizar la especialidad. Inténtelo nuevamente.',
          icon: 'fa-solid fa-exclamation-triangle',
          timeout: 4000
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
      formRef,
      closeDialog,
      saveSpeciality
    }
  }
}
</script>