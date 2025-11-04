<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="new-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-calendar-plus"></i>
            <span>Registrar nueva cita</span>
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

      <q-form @submit="createQuote" class="form-container">
        <q-card-section class="dialog-content">
          <div class="form-fields">
            <!-- Buscar paciente por CI -->
            <div class="field-row">
              <div class="field-group" style="flex: 2;">
                <label class="field-label">
                  <span>Paciente:</span>
                </label>
                <q-input
                  v-model="searchCI"
                  filled
                  dense
                  placeholder="C.I."
                  class="form-input"
                  style="max-width: 180px;"
                />
                <q-btn
                  flat
                  label="Buscar"
                  icon="fa-solid fa-search"
                  @click="buscarPaciente"
                  class="search-btn"
                  style="margin-left: 8px;"
                />
              </div>
            </div>
            <div class="field-row">
              <div class="field-group full-width">
                <span>
                  Nombre:
                  <b v-if="pacienteEncontrado">
                    {{ pacienteEncontrado.nombre }} {{ pacienteEncontrado.apellidoPaterno }}
                    {{ pacienteEncontrado.apellidoMaterno }}
                  </b>
                  <span v-else>No encontrado</span>
                </span>
              </div>
            </div>
            <!-- Datos de la cita -->
            <div class="field-row bordered-row">
              <div class="field-group">
                <label class="field-label">
                  <span>Asunto:</span>
                </label>
                <q-input
                  v-model="form.asunto"
                  filled
                  dense
                  class="form-input"
                  placeholder="Motivo de la cita"
                  :rules="[val => !!val || 'El asunto es requerido']"
                  style="max-width: 140px;"
                />
              </div>
              <div class="field-group">
                <label class="field-label">
                  <span>Dentista:</span>
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
                  style="min-width: 180px;"
                />
              </div>
            </div>
            <div class="field-row bordered-row">
              <div class="field-group">
                <label class="field-label">
                  <span>Fecha:</span>
                </label>
                <q-input
                  v-model="form.fecha"
                  filled
                  dense
                  type="date"
                  class="form-input"
                  :rules="[val => !!val || 'La fecha es requerida']"
                  style="max-width: 140px;"
                />
              </div>
              <div class="field-group">
                <label class="field-label">
                  <span>Hora:</span>
                </label>
                <q-input
                  v-model="form.hora"
                  filled
                  dense
                  type="time"
                  class="form-input"
                  :rules="[val => !!val || 'La hora es requerida']"
                  style="max-width: 100px;"
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
            label="Aceptar"
            icon="fa-solid fa-calendar-plus"
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
import pacientes from 'src/data/pacientes.json'
import dentistas from 'src/data/dentistas.json'

export default {
  name: 'NewQuoteDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'quote-created'],
  setup(props, { emit }) {
    const loading = ref(false)
    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const searchCI = ref('')
    const pacienteEncontrado = ref(null)

    const form = ref({
      pacienteId: null,
      asunto: '',
      dentistaId: '',
      fecha: '',
      hora: ''
    })

    const dentistaOptions = dentistas.dentistas.map(d => ({
      label: `${d.name} ${d.father_last_name}${d.mother_last_name }`,
      value: d.id
    }))

    const buscarPaciente = () => {
      const paciente = pacientes.pacientes.find(p => String(p.ci) === String(searchCI.value))
      pacienteEncontrado.value = paciente || null
      form.value.pacienteId = paciente ? paciente.id : null
    }

    const resetForm = () => {
      searchCI.value = ''
      pacienteEncontrado.value = null
      form.value = {
        pacienteId: null,
        asunto: '',
        dentistaId: '',
        fecha: '',
        hora: ''
      }
    }

    const closeDialog = () => {
      showDialog.value = false
      resetForm()
    }

    const createQuote = async () => {
      loading.value = true
      try {
        if (!form.value.pacienteId) {
          // Puedes mostrar una notificación aquí si usas Quasar Notify
          loading.value = false
          return
        }
        await new Promise(resolve => setTimeout(resolve, 500))
        emit('quote-created', { ...form.value })
        closeDialog()
      } catch {
        // error handling opcional
      } finally {
        loading.value = false
      }
    }

    return {
      showDialog,
      searchCI,
      pacienteEncontrado,
      form,
      dentistaOptions,
      buscarPaciente,
      loading,
      closeDialog,
      createQuote
    }
  }
}
</script>

<style scoped>
.bordered-row {
  border: 1px solid #222;
  border-radius: 6px;
  padding: 8px;
  margin-bottom: 10px;
}
</style>
