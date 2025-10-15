<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="recipe-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-file-medical"></i>
            <span>Receta Médica</span>
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

      <q-form @submit="saveRecipe" class="form-container">
        <q-card-section class="dialog-content">
          <div class="form-fields">
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-calendar-plus"></i>
                  <span>Fecha</span>
                </label>
                <q-input
                  v-model="form.fecha"
                  filled
                  dense
                  readonly
                  class="form-input"
                />
              </div>
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-user"></i>
                  <span>Paciente</span>
                </label>
                <q-input
                  :model-value="pacienteNombre"
                  filled
                  dense
                  readonly
                  class="form-input"
                />
              </div>
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-id-card"></i>
                  <span>C.I.</span>
                </label>
                <q-input
                  :model-value="patientData?.ci"
                  filled
                  dense
                  readonly
                  class="form-input"
                />
              </div>
            </div>
            <div class="field-row">
              <div class="field-group full-width">
                <label class="field-label">
                  <i class="fa-solid fa-stethoscope"></i>
                  <span>Diagnóstico</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.diagnostico"
                  filled
                  dense
                  type="textarea"
                  rows="2"
                  :rules="[val => !!val || 'El diagnóstico es requerido']"
                  class="form-input"
                  placeholder="Ingrese el diagnóstico"
                />
              </div>
            </div>
            <div class="field-row">
              <div class="field-group full-width">
                <label class="field-label">
                  <i class="fa-solid fa-prescription-bottle-alt"></i>
                  <span>Receta</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.receta"
                  filled
                  dense
                  type="textarea"
                  rows="3"
                  :rules="[val => !!val || 'La receta es requerida']"
                  class="form-input"
                  placeholder="Ingrese la receta médica"
                />
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
            label="Guardar Receta"
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

export default {
  name: 'RecipePatientDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    patientData: {
      type: Object,
      default: () => null
    }
  },
  emits: ['update:modelValue', 'recipe-saved'],
  setup(props, { emit }) {
    const loading = ref(false)
    const today = new Date().toISOString().slice(0, 10)
    const form = ref({
      fecha: today,
      diagnostico: '',
      receta: ''
    })

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const pacienteNombre = computed(() => {
      if (!props.patientData) return ''
      return `${props.patientData.nombre || ''} ${props.patientData.apellidoPaterno || ''} ${props.patientData.apellidoMaterno || ''}`.trim()
    })

    const resetForm = () => {
      form.value = {
        fecha: today,
        diagnostico: '',
        receta: ''
      }
    }

    const closeDialog = () => {
      showDialog.value = false
      resetForm()
    }

    const saveRecipe = async () => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        emit('recipe-saved', { ...form.value, pacienteId: props.patientData?.id })
        closeDialog()
      } catch {
        // error handling opcional
      } finally {
        loading.value = false
      }
    }

    watch(() => props.modelValue, (newValue) => {
      if (newValue) resetForm()
    })

    return {
      showDialog,
      form,
      pacienteNombre,
      loading,
      closeDialog,
      saveRecipe
    }
  }
}
</script>