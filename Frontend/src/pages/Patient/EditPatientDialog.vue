<template>
  <q-dialog v-model="showDialog" persistent max-width="800px">
    <q-card class="edit-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-user-edit"></i>
            <span>Editar Paciente</span>
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

      <q-form @submit="savePatient" class="form-container">
        <q-card-section class="dialog-content">
          <div class="form-fields">
            <!-- Información Personal -->
            <div class="form-section">
              <h4 class="section-title">
                <i class="fa-solid fa-user"></i>
                Información Personal
              </h4>
              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">
                    <span>Nombre</span>
                    <span class="required">*</span>
                  </label>
                  <q-input
                    v-model="form.nombre"
                    filled
                    dense
                    :rules="[val => !!val || 'El nombre es requerido']"
                    class="form-input"
                    placeholder="Nombre"
                  />
                </div>
                <div class="field-group">
                  <label class="field-label">
                    <span>Apellido Paterno</span>
                    <span class="required">*</span>
                  </label>
                  <q-input
                    v-model="form.apellidoPaterno"
                    filled
                    dense
                    :rules="[val => !!val || 'El apellido paterno es requerido']"
                    class="form-input"
                    placeholder="Apellido Paterno"
                  />
                </div>
                <div class="field-group">
                  <label class="field-label">
                    <span>Apellido Materno</span>
                    <span class="required">*</span>
                  </label>
                  <q-input
                    v-model="form.apellidoMaterno"
                    filled
                    dense
                    :rules="[val => !!val || 'El apellido materno es requerido']"
                    class="form-input"
                    placeholder="Apellido Materno"
                  />
                </div>
              </div>
              
              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-id-card"></i>
                    <span>C.I.</span>
                    <span class="required">*</span>
                  </label>
                  <q-input
                    v-model="form.ci"
                    filled
                    dense
                    :rules="[val => !!val || 'El CI es requerido']"
                    class="form-input"
                    placeholder="Número de CI"
                  />
                </div>
                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-calendar"></i>
                    <span>Fecha Nacimiento</span>
                  </label>
                  <q-input
                    v-model="form.fechaNacimiento"
                    filled
                    dense
                    type="date"
                    class="form-input"
                  />
                </div>
                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-heart"></i>
                    <span>Estado Civil</span>
                  </label>
                  <q-select
                    v-model="form.estadoCivil"
                    filled
                    dense
                    :options="estadoCivilOptions"
                    class="form-input"
                    placeholder="Seleccionar estado civil"
                  />
                </div>
              </div>
            </div>

            <!-- Información de Contacto -->
            <div class="form-section">
              <h4 class="section-title">
                <i class="fa-solid fa-address-book"></i>
                Información de Contacto
              </h4>
              <div class="field-row">
                <div class="field-group full-width">
                  <label class="field-label">
                    <i class="fa-solid fa-envelope"></i>
                    <span>Email</span>
                    <span class="required">*</span>
                  </label>
                  <q-input
                    v-model="form.gmail"
                    filled
                    dense
                    type="email"
                    :rules="[
                      val => !!val || 'El correo es requerido',
                      val => /.+@.+\..+/.test(val) || 'Ingrese un correo válido'
                    ]"
                    class="form-input"
                    placeholder="paciente@ejemplo.com"
                  />
                </div>
              </div>
              
              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-phone"></i>
                    <span>Teléfono</span>
                  </label>
                  <q-input
                    v-model="form.telefono"
                    filled
                    dense
                    class="form-input"
                    placeholder="Teléfono"
                    mask="########"
                  />
                </div>
                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-city"></i>
                    <span>Ciudad</span>
                  </label>
                  <q-select
                    v-model="form.ciudad"
                    filled
                    dense
                    :options="ciudadOptions"
                    class="form-input"
                    placeholder="Seleccionar ciudad"
                  />
                </div>
              </div>
              
              <div class="field-row">
                <div class="field-group full-width">
                  <label class="field-label">
                    <i class="fa-solid fa-home"></i>
                    <span>Domicilio</span>
                  </label>
                  <q-input
                    v-model="form.domicilio"
                    filled
                    dense
                    class="form-input"
                    placeholder="Dirección completa"
                  />
                </div>
              </div>
            </div>

            <!-- Información Profesional -->
            <div class="form-section">
              <h4 class="section-title">
                <i class="fa-solid fa-briefcase"></i>
                Información Profesional
              </h4>
              <div class="field-row">
                <div class="field-group full-width">
                  <label class="field-label">
                    <span>Profesión</span>
                  </label>
                  <q-input
                    v-model="form.profesion"
                    filled
                    dense
                    class="form-input"
                    placeholder="Profesión u ocupación"
                  />
                </div>
              </div>
            </div>

            <!-- Información Médica -->
            <div class="form-section">
              <h4 class="section-title">
                <i class="fa-solid fa-stethoscope"></i>
                Información Médica
              </h4>
              
              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-calendar-check"></i>
                    <span>Última visita odontológica</span>
                  </label>
                  <q-input
                    v-model="form.ultimaVisitaOdontologo"
                    filled
                    dense
                    type="date"
                    class="form-input"
                  />
                </div>
                <div class="field-group full-width">
                  <label class="field-label">
                    <i class="fa-solid fa-comment-medical"></i>
                    <span>Motivo de Consulta</span>
                  </label>
                  <q-input
                    v-model="form.motivoConsulta"
                    filled
                    dense
                    class="form-input"
                    placeholder="Motivo principal de la consulta"
                  />
                </div>
              </div>
              
              <div class="field-row">
                <div class="field-group full-width">
                  <label class="field-label">
                    <i class="fa-solid fa-align-left"></i>
                    <span>Descripción</span>
                  </label>
                  <q-input
                    v-model="form.descripcion"
                    filled
                    dense
                    type="textarea"
                    rows="2"
                    class="form-input"
                    placeholder="Descripción detallada de los síntomas"
                  />
                </div>
              </div>
            </div>

            <!-- Antecedentes y Alertas -->
            <div class="form-section">
              <h4 class="section-title">
                <i class="fa-solid fa-clipboard-list"></i>
                Antecedentes y Alertas
              </h4>
              
              <div class="field-row">
                <div class="field-group full-width">
                  <label class="field-label">
                    <i class="fa-solid fa-notes-medical"></i>
                    <span>Antecedentes de Salud</span>
                  </label>
                  <q-input
                    v-model="form.antecedentesSalud"
                    filled
                    dense
                    type="textarea"
                    rows="2"
                    class="form-input"
                    placeholder="Enfermedades crónicas, medicamentos, cirugías previas..."
                  />
                </div>
              </div>
              
              <div class="field-row">
                <div class="field-group full-width">
                  <label class="field-label">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <span>Alertas Clínicas</span>
                  </label>
                  <q-input
                    v-model="form.alertasClinicas"
                    filled
                    dense
                    type="textarea"
                    rows="2"
                    class="form-input"
                    placeholder="Alergias, condiciones especiales, precauciones..."
                  />
                </div>
              </div>
            </div>

            <!-- Estado del Paciente -->
            <div class="form-section">
              <h4 class="section-title">
                <i class="fa-solid fa-toggle-on"></i>
                Estado del Paciente
              </h4>
              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">
                    <span>Estado</span>
                  </label>
                  <q-select
                    v-model="form.state"
                    filled
                    dense
                    :options="stateOptions"
                    class="form-input"
                    map-options
                    emit-value
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
            label="Guardar Cambios"
            icon="fa-solid fa-save"
            :loading="loading"
            class="primary-btn"
            unelevated
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
  name: 'EditPatientDialog',
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
  emits: ['update:modelValue'], // Eliminamos 'patient-updated'
  setup(props, { emit }) {
    const store = usePacienteStore()
    const loading = ref(false)
    const form = ref({
      id: null,
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      ci: '',
      gmail: '',
      fechaNacimiento: '',
      ciudad: '',
      profesion: '',
      estadoCivil: '',
      domicilio: '',
      telefono: '',
      motivoConsulta: '',
      ultimaVisitaOdontologo: '',
      descripcion: '',
      antecedentesSalud: '',
      alertasClinicas: '',
      state: 'active'
    })

    // Opciones para los selects
    const estadoCivilOptions = [
      'Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'Unión Libre'
    ]

    const ciudadOptions = [
      'La Paz', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Tarija', 
      'Potosí', 'Sucre', 'Beni', 'Pando'
    ]

    const stateOptions = [
      { label: 'Activo', value: 'active' },
      { label: 'Inactivo', value: 'inactive' }
    ]

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const initializeForm = () => {
      if (props.patientData) {
        form.value = {
          id: props.patientData.id,
          nombre: props.patientData.nombre || '',
          apellidoPaterno: props.patientData.apellidoPaterno || '',
          apellidoMaterno: props.patientData.apellidoMaterno || '',
          ci: props.patientData.ci || '',
          gmail: props.patientData.gmail || '',
          fechaNacimiento: props.patientData.fechaNacimiento || '',
          ciudad: props.patientData.ciudad || '',
          profesion: props.patientData.profesion || '',
          estadoCivil: props.patientData.estadoCivil || '',
          domicilio: props.patientData.domicilio || '',
          telefono: props.patientData.telefono || '',
          motivoConsulta: props.patientData.motivoConsulta || '',
          ultimaVisitaOdontologo: props.patientData.ultimaVisitaOdontologo || '',
          descripcion: props.patientData.descripcion || '',
          antecedentesSalud: props.patientData.antecedentesSalud || '',
          alertasClinicas: props.patientData.alertasClinicas || '',
          state: props.patientData.state || 'active'
        }
      }
    }

    const resetForm = () => {
      form.value = {
        id: null,
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        ci: '',
        gmail: '',
        fechaNacimiento: '',
        ciudad: '',
        profesion: '',
        estadoCivil: '',
        domicilio: '',
        telefono: '',
        motivoConsulta: '',
        ultimaVisitaOdontologo: '',
        descripcion: '',
        antecedentesSalud: '',
        alertasClinicas: '',
        state: 'active'
      }
    }

    const closeDialog = () => {
      showDialog.value = false
      resetForm()
    }

    const savePatient = async () => {
      loading.value = true
      try {
        // Usamos directamente el store en lugar de emitir
        await store.actualizarPaciente({ ...form.value })
        closeDialog()
        
        // Opcional: Mostrar notificación de éxito
        // store.mostrarNotificacion('Paciente actualizado exitosamente', 'positive')
        
      } catch (error) {
        console.error('Error updating patient:', error)
        // Opcional: Mostrar notificación de error
        // store.mostrarNotificacion('Error al actualizar paciente', 'negative')
      } finally {
        loading.value = false
      }
    }

    watch(() => props.patientData, (newData) => {
      if (newData) {
        initializeForm()
      }
    }, { immediate: true })

    watch(() => props.modelValue, (newValue) => {
      if (newValue && props.patientData) {
        initializeForm()
      }
    })

    return {
      showDialog,
      form,
      estadoCivilOptions,
      ciudadOptions,
      stateOptions,
      loading,
      closeDialog,
      savePatient
    }
  }
}
</script>