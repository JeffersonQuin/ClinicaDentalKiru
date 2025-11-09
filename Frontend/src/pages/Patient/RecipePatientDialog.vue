<template>
  <q-dialog v-model="showDialog" persistent max-width="700px">
    <q-card class="recipe-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-file-prescription"></i>
            <span>Receta Médica Odontológica</span>
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
          <!-- Información del Paciente -->
          <div class="patient-info-section">
            <h4 class="section-title">
              <i class="fa-solid fa-user-injured"></i>
              Información del Paciente
            </h4>
            <div class="patient-details">
              <div class="patient-main-info">
                <div class="patient-name">{{ pacienteNombre }}</div>
                <div class="patient-meta">
                  <span class="patient-ci"><strong>C.I.:</strong> {{ currentPatient?.ci }}</span>
                  <span class="patient-age"><strong>Edad:</strong> {{ store.calcularEdad(currentPatient?.fechaNacimiento) }} años</span>
                  <span class="patient-city"><strong>Ciudad:</strong> {{ currentPatient?.ciudad }}</span>
                </div>
              </div>
              <div class="patient-alerts" v-if="hasClinicalAlerts">
                <div class="alert-badge">
                  <i class="fa-solid fa-triangle-exclamation"></i>
                  <span>Alerta Clínica: {{ currentPatient?.alertasClinicas }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-fields">
            <!-- Información de la Receta -->
            <div class="form-section">
              <h4 class="section-title">
                <i class="fa-solid fa-file-medical"></i>
                Información de la Receta
              </h4>
              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-calendar"></i>
                    <span>Fecha de Emisión</span>
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
                    <i class="fa-solid fa-calendar-check"></i>
                    <span>Válida hasta</span>
                  </label>
                  <q-input
                    v-model="form.validaHasta"
                    filled
                    dense
                    type="date"
                    :rules="[val => !!val || 'La fecha de validez es requerida']"
                    class="form-input"
                  />
                </div>
              </div>
            </div>

            <!-- Diagnóstico -->
            <div class="form-section">
              <h4 class="section-title">
                <i class="fa-solid fa-stethoscope"></i>
                Diagnóstico
                <span class="required">*</span>
              </h4>
              <div class="field-row">
                <div class="field-group full-width">
                  <q-input
                    v-model="form.diagnostico"
                    filled
                    dense
                    type="textarea"
                    rows="3"
                    :rules="[val => !!val || 'El diagnóstico es requerido']"
                    class="form-input"
                    placeholder="Describa el diagnóstico odontológico..."
                  />
                </div>
              </div>
            </div>

            <!-- Medicamentos -->
            <div class="form-section">
              <h4 class="section-title">
                <i class="fa-solid fa-pills"></i>
                Medicamentos Recetados
                <span class="required">*</span>
              </h4>
              <div class="medicines-container">
                <div v-for="(medicine, index) in form.medicamentos" :key="index" class="medicine-item">
                  <div class="medicine-header">
                    <span class="medicine-number">Medicamento {{ index + 1 }}</span>
                    <q-btn
                      v-if="form.medicamentos.length > 1"
                      flat
                      round
                      dense
                      icon="fa-solid fa-trash"
                      color="negative"
                      size="sm"
                      @click="removeMedicine(index)"
                    />
                  </div>
                  <div class="field-row">
                    <div class="field-group">
                      <label class="field-label">Nombre del Medicamento</label>
                      <q-input
                        v-model="medicine.nombre"
                        filled
                        dense
                        :rules="[val => !!val || 'El nombre es requerido']"
                        placeholder="Ej: Amoxicilina 500mg"
                      />
                    </div>
                    <div class="field-group">
                      <label class="field-label">Dosis</label>
                      <q-input
                        v-model="medicine.dosis"
                        filled
                        dense
                        :rules="[val => !!val || 'La dosis es requerida']"
                        placeholder="Ej: 1 tableta cada 8 horas"
                      />
                    </div>
                    <div class="field-group">
                      <label class="field-label">Duración</label>
                      <q-input
                        v-model="medicine.duracion"
                        filled
                        dense
                        :rules="[val => !!val || 'La duración es requerida']"
                        placeholder="Ej: 7 días"
                      />
                    </div>
                  </div>
                  <div class="field-row">
                    <div class="field-group full-width">
                      <label class="field-label">Indicaciones Especiales</label>
                      <q-input
                        v-model="medicine.indicaciones"
                        filled
                        dense
                        type="textarea"
                        rows="1"
                        placeholder="Indicaciones adicionales..."
                      />
                    </div>
                  </div>
                </div>
                
                <q-btn
                  outline
                  color="primary"
                  icon="fa-solid fa-plus"
                  label="Agregar Medicamento"
                  @click="addMedicine"
                  class="add-medicine-btn"
                  no-caps
                />
              </div>
            </div>

            <!-- Indicaciones Generales -->
            <div class="form-section">
              <h4 class="section-title">
                <i class="fa-solid fa-list-check"></i>
                Indicaciones Generales
              </h4>
              <div class="field-row">
                <div class="field-group full-width">
                  <q-input
                    v-model="form.indicacionesGenerales"
                    filled
                    dense
                    type="textarea"
                    rows="3"
                    class="form-input"
                    placeholder="Indicaciones generales para el paciente..."
                  />
                </div>
              </div>
            </div>

            <!-- Observaciones -->
            <div class="form-section">
              <h4 class="section-title">
                <i class="fa-solid fa-note-sticky"></i>
                Observaciones
              </h4>
              <div class="field-row">
                <div class="field-group full-width">
                  <q-input
                    v-model="form.observaciones"
                    filled
                    dense
                    type="textarea"
                    rows="2"
                    class="form-input"
                    placeholder="Observaciones adicionales..."
                  />
                </div>
              </div>
            </div>

            <!-- Odontólogo -->
            <div class="form-section">
              <h4 class="section-title">
                <i class="fa-solid fa-user-md"></i>
                Información del Odontólogo
              </h4>
              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">Nombre del Odontólogo</label>
                  <q-input
                    v-model="form.odontologo"
                    filled
                    dense
                    :rules="[val => !!val || 'El nombre del odontólogo es requerido']"
                    placeholder="Dr. Nombre Apellido"
                  />
                </div>
                <div class="field-group">
                  <label class="field-label">Número de Colegiatura</label>
                  <q-input
                    v-model="form.colegiatura"
                    filled
                    dense
                    :rules="[val => !!val || 'La colegiatura es requerida']"
                    placeholder="Número de colegiatura"
                  />
                </div>
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
            no-caps
          />
          <q-space />
          <q-btn
            type="submit"
            label="Guardar Receta"
            icon="fa-solid fa-file-prescription"
            :loading="loading"
            class="primary-btn"
            unelevated
            no-caps
          />
          <q-btn
            label="Imprimir Receta"
            icon="fa-solid fa-print"
            color="secondary"
            @click="printRecipe"
            no-caps
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { usePacienteStore } from 'stores/pacienteStore'

export default {
  name: 'RecipePatientDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const store = usePacienteStore()
    const loading = ref(false)
    const today = new Date().toISOString().slice(0, 10)
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    
    const form = ref({
      fecha: today,
      validaHasta: nextWeek,
      diagnostico: '',
      medicamentos: [
        {
          nombre: '',
          dosis: '',
          duracion: '',
          indicaciones: ''
        }
      ],
      indicacionesGenerales: '',
      observaciones: '',
      odontologo: '',
      colegiatura: ''
    })

    // Computed
    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const currentPatient = computed(() => store.selectedPatient)
    const pacienteNombre = computed(() => store.nombrePacienteCompleto)
    const hasClinicalAlerts = computed(() => store.tieneAlertasClinicas)

    // Methods
    const addMedicine = () => {
      form.value.medicamentos.push({
        nombre: '',
        dosis: '',
        duracion: '',
        indicaciones: ''
      })
    }

    const removeMedicine = (index) => {
      if (form.value.medicamentos.length > 1) {
        form.value.medicamentos.splice(index, 1)
      }
    }

    const resetForm = () => {
      form.value = {
        fecha: today,
        validaHasta: nextWeek,
        diagnostico: '',
        medicamentos: [
          {
            nombre: '',
            dosis: '',
            duracion: '',
            indicaciones: ''
          }
        ],
        indicacionesGenerales: '',
        observaciones: '',
        odontologo: '',
        colegiatura: ''
      }
    }

    const closeDialog = () => {
      showDialog.value = false
      resetForm()
    }

    const saveRecipe = async () => {
      loading.value = true
      try {
        await store.guardarReceta(form.value)
        closeDialog()
      } catch (error) {
        console.error('Error saving recipe:', error)
      } finally {
        loading.value = false
      }
    }

    const printRecipe = () => {
      console.log('Imprimir receta:', form.value)
    }

    watch(() => props.modelValue, (newValue) => {
      if (newValue) resetForm()
    })

    return {
      store,
      showDialog,
      form,
      currentPatient,
      pacienteNombre,
      hasClinicalAlerts,
      loading,
      addMedicine,
      removeMedicine,
      closeDialog,
      saveRecipe,
      printRecipe
    }
  }
}
</script>