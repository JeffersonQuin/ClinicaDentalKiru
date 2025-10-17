<template>
  <q-dialog v-model="showDialog" persistent>
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
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-user"></i>
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
                  <i class="fa-solid fa-user"></i>
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
                  <i class="fa-solid fa-user"></i>
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
                  <i class="fa-solid fa-envelope"></i>
                  <span>Gmail</span>
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
                  <i class="fa-solid fa-city"></i>
                  <span>Ciudad</span>
                </label>
                <q-input
                  v-model="form.ciudad"
                  filled
                  dense
                  class="form-input"
                  placeholder="Ciudad"
                />
              </div>
            </div>
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-briefcase"></i>
                  <span>Profesión</span>
                </label>
                <q-input
                  v-model="form.profesion"
                  filled
                  dense
                  class="form-input"
                  placeholder="Profesión"
                />
              </div>
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-heart"></i>
                  <span>Estado Civil</span>
                </label>
                <q-input
                  v-model="form.estadoCivil"
                  filled
                  dense
                  class="form-input"
                  placeholder="Estado Civil"
                />
              </div>
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-home"></i>
                  <span>Domicilio</span>
                </label>
                <q-input
                  v-model="form.domicilio"
                  filled
                  dense
                  class="form-input"
                  placeholder="Dirección"
                />
              </div>
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
                />
              </div>
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-user-tag"></i>
                  <span>Rol</span>
                </label>
                <q-select
                  v-model="form.rol"
                  filled
                  dense
                  :options="rolOptions"
                  class="form-input"
                  placeholder="Rol"
                  map-options
                  emit-value
                />
              </div>
            </div>
            <q-separator />
            <div class="field-group full-width">
              <label class="field-label">
                <i class="fa-solid fa-comment-medical"></i>
                <span>Motivo de la Consulta</span>
              </label>
              <q-input
                v-model="form.motivoConsulta"
                filled
                dense
                class="form-input"
                placeholder="Motivo de la consulta"
              />
            </div>
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-user-md"></i>
                  <span>Última visita al Odontólogo</span>
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
                  placeholder="Descripción breve"
                />
              </div>
            </div>
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
                  placeholder="Antecedentes de salud"
                />
              </div>
              <div class="field-group full-width">
                <label class="field-label">
                  <i class="fa-solid fa-exclamation-triangle"></i>
                  <span>Alertas Clínicas</span>
                </label>
                <q-input
                  v-model="form.alertasClinicas"
                  filled
                  dense
                  type="textarea"
                  rows="2"
                  class="form-input"
                  placeholder="Alergias, alertas clínicas"
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
  emits: ['update:modelValue', 'patient-updated'],
  setup(props, { emit }) {
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
      rol: 'Cliente',
      motivoConsulta: '',
      ultimaVisitaOdontologo: '',
      descripcion: '',
      antecedentesSalud: '',
      alertasClinicas: '',
      state: 'active'
    })

    const rolOptions = [
      { label: 'Cliente', value: 'Cliente' }
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
          rol: props.patientData.rol || 'Cliente',
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
        rol: 'Cliente',
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
        await new Promise(resolve => setTimeout(resolve, 1000))
        const updatedPatient = {
          ...props.patientData,
          ...form.value,
          updatedAt: new Date().toISOString()
        }
        emit('patient-updated', updatedPatient)
        closeDialog()
      } catch (error) {
        console.error('Error updating patient:', error)
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
      if (newValue) {
        initializeForm()
      }
    })

    return {
      showDialog,
      form,
      rolOptions,
      loading,
      closeDialog,
      savePatient
    }
  }
}
</script>
