<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="new-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-user-plus"></i>
            <span>Registrar Nuevo Paciente</span>
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

      <q-form @submit="createPatient" class="form-container">
        <q-card-section class="dialog-content">
          <div class="welcome-message">
            <i class="fa-solid fa-info-circle"></i>
            <p>Complete los siguientes datos para registrar un nuevo paciente. <br>
              <b>La fecha de registro se llena automáticamente con la fecha de hoy.</b>
            </p>
          </div>

          <div class="form-fields">
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-calendar-plus"></i>
                  <span>Fecha de Registro</span>
                </label>
                <q-input
                  v-model="form.fechaRegistro"
                  filled
                  dense
                  readonly
                  class="form-input"
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
                  :rules=" [
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
                  <i class="fa-solid fa-calendar"></i>
                  <span>Fecha Nacimiento</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.fechaNacimiento"
                  filled
                  dense
                  type="date"
                  :rules="[val => !!val || 'La fecha de nacimiento es requerida']"
                  class="form-input"
                />
              </div>
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-city"></i>
                  <span>Ciudad</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.ciudad"
                  filled
                  dense
                  :rules="[val => !!val || 'La ciudad es requerida']"
                  class="form-input"
                  placeholder="Ciudad"
                />
              </div>
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
            </div>

            <div class="field-row">
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
                  <span class="required">*</span>
                </label>
                <q-select
                  v-model="form.rol"
                  filled
                  dense
                  :options="rolOptions"
                  :rules="[val => !!val || 'Seleccione el rol']"
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
            label="Registrar Paciente"
            icon="fa-solid fa-user-plus"
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

export default {
  name: 'NewPatientDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'patient-created'],
  setup(props, { emit }) {
    const loading = ref(false)
    const today = new Date().toISOString().slice(0, 10)
    const form = ref({
      fechaRegistro: today,
      gmail: '',
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      ci: '',
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

    const resetForm = () => {
      form.value = {
        fechaRegistro: today,
        gmail: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        ci: '',
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

    const createPatient = async () => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        emit('patient-created', { ...form.value })
        closeDialog()
      } catch (error) {
        console.error('Error creating patient:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      showDialog,
      form,
      rolOptions,
      loading,
      closeDialog,
      createPatient
    }
  }
}
</script>
