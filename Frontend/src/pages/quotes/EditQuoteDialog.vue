<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="edit-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-calendar-day"></i>
            <span>Editar Cita</span>
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

      <q-form @submit="saveQuote" class="form-container">
        <q-card-section class="dialog-content">
          <div class="form-fields">
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">
                  <span>Asunto</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.asunto"
                  filled
                  dense
                  :rules="[val => !!val || 'El asunto es requerido']"
                  class="form-input"
                  placeholder="Motivo de la cita"
                />
              </div>
              <div class="field-group">
                <label class="field-label">
                  <span>Dentista</span>
                  <span class="required">*</span>
                </label>
                <q-select
                  v-model="form.dentistaId"
                  filled
                  dense
                  :options="dentistaOptions"
                  class="form-input"
                  placeholder="Seleccione dentista"
                  emit-value
                  map-options
                />
              </div>
              <div class="field-group">
                <label class="field-label">
                  <span>Paciente</span>
                  <span class="required">*</span>
                </label>
                <q-select
                  v-model="form.pacienteId"
                  filled
                  dense
                  :options="pacienteOptions"
                  class="form-input"
                  placeholder="Seleccione paciente"
                  emit-value
                  map-options
                />
              </div>
            </div>
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">
                  <span>Fecha</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.fecha"
                  filled
                  dense
                  type="date"
                  class="form-input"
                  :rules="[val => !!val || 'La fecha es requerida']"
                />
              </div>
              <div class="field-group">
                <label class="field-label">
                  <span>Hora</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.hora"
                  filled
                  dense
                  type="time"
                  class="form-input"
                  :rules="[val => !!val || 'La hora es requerida']"
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
import pacientes from 'src/data/pacientes.json'
import dentistas from 'src/data/dentistas.json'

export default {
  name: 'EditQuoteDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    quoteData: {
      type: Object,
      default: () => null
    }
  },
  emits: ['update:modelValue', 'quote-updated'],
  setup(props, { emit }) {
    const loading = ref(false)
    const form = ref({
      id: null,
      asunto: '',
      dentistaId: '',
      pacienteId: '',
      fecha: '',
      hora: ''
    })

    const dentistaOptions = dentistas.dentistas.map(d => ({
      label: `${d.nombre} ${d.apellidoPaterno}${d.apellidoMaterno ? ' ' + d.apellidoMaterno : ''}`,
      value: d.id
    }))
    const pacienteOptions = pacientes.pacientes.map(p => ({
      label: `${p.nombre} ${p.apellidoPaterno}${p.apellidoMaterno ? ' ' + p.apellidoMaterno : ''}`,
      value: p.id
    }))

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const initializeForm = () => {
      if (props.quoteData) {
        form.value = {
          id: props.quoteData.id,
          asunto: props.quoteData.asunto || '',
          dentistaId: props.quoteData.dentistaId || '',
          pacienteId: props.quoteData.pacienteId || '',
          fecha: props.quoteData.fecha || '',
          hora: props.quoteData.hora || ''
        }
      }
    }

    const resetForm = () => {
      form.value = {
        id: null,
        asunto: '',
        dentistaId: '',
        pacienteId: '',
        fecha: '',
        hora: ''
      }
    }

    const closeDialog = () => {
      showDialog.value = false
      resetForm()
    }

    const saveQuote = async () => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const updatedQuote = {
          ...props.quoteData,
          asunto: form.value.asunto,
          dentistaId: form.value.dentistaId,
          pacienteId: form.value.pacienteId,
          fecha: form.value.fecha,
          hora: form.value.hora,
          updatedAt: new Date().toISOString()
        }
        emit('quote-updated', updatedQuote)
        closeDialog()
      } catch (error) {
        console.error('Error updating quote:', error)
      } finally {
        loading.value = false
      }
    }

    watch(() => props.quoteData, (newData) => {
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
      dentistaOptions,
      pacienteOptions,
      loading,
      closeDialog,
      saveQuote
    }
  }
}
</script>

<style lang="scss" scoped>
/* Puedes agregar estilos personalizados aquí si lo necesitas */
</style>