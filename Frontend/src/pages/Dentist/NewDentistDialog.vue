<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="new-dialog" style="min-width: 700px;">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-plus"></i>
            <span>Crear Nuevo Dentista</span>
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

      <q-form @submit="createDentist" class="form-container">
        <q-card-section class="dialog-content">
          <div class="welcome-message">
            <i class="fa-solid fa-info-circle"></i>
            <p>Complete los siguientes datos para registrar un nuevo dentista en el sistema.</p>
          </div>

          <div class="form-fields">
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-user"></i>
                  <span>Nombre</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.name"
                  filled
                  dense
                  :rules="[
                    val => !!val || 'El nombre es requerido',
                    val => val.length >= 2 || 'Mínimo 2 caracteres'
                  ]"
                  class="form-input"
                  placeholder="Carlos"
                />
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-user"></i>
                  <span>Segundo Nombre</span>
                </label>
                <q-input
                  v-model="form.second_name"
                  filled
                  dense
                  class="form-input"
                  placeholder="Andrés (opcional)"
                />
              </div>
            </div>

            <div class="field-row">
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-id-card"></i>
                  <span>Apellido Paterno</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.father_last_name"
                  filled
                  dense
                  :rules="[
                    val => !!val || 'El apellido paterno es requerido',
                    val => val.length >= 2 || 'Mínimo 2 caracteres'
                  ]"
                  class="form-input"
                  placeholder="García"
                />
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-id-card"></i>
                  <span>Apellido Materno</span>
                </label>
                <q-input
                  v-model="form.mother_last_name"
                  filled
                  dense
                  class="form-input"
                  placeholder="López (opcional)"
                />
              </div>
            </div>

            <div class="field-row">
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-graduation-cap"></i>
                  <span>Especialidades</span>
                  <span class="required">*</span>
                </label>
                <q-select
                  v-model="form.speciality"
                  filled
                  dense
                  multiple
                  :options="specialtyOptions"
                  :rules="[val => val && val.length > 0 || 'Seleccione al menos una especialidad']"
                  class="form-input"
                  placeholder="Seleccione las especialidades"
                  map-options
                  emit-value
                  use-chips
                />
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-toggle-on"></i>
                  <span>Estado Inicial</span>
                  <span class="required">*</span>
                </label>
                <q-select
                  v-model="form.state"
                  filled
                  dense
                  :options="stateOptions"
                  :rules="[val => !!val || 'Seleccione un estado']"
                  class="form-input"
                  placeholder="Seleccione el estado"
                  map-options
                  emit-value
                />
              </div>
            </div>

            <div class="field-group full-width">
              <label class="field-label">
                <i class="fa-solid fa-user-tag"></i>
                <span>Usuario del Sistema</span>
              </label>
              <q-select
                v-model="form.userId"
                filled
                dense
                :options="userOptions"
                class="form-input"
                placeholder="Asignar usuario del sistema (opcional)"
                map-options
                emit-value
                clearable
                option-label="label"
                option-value="value"
              >
                <template v-slot:hint>
                  Seleccione el usuario que tendrá acceso con este perfil
                </template>
              </q-select>
            </div>

            <div class="field-group full-width">
              <label class="field-label">
                <i class="fa-solid fa-camera"></i>
                <span>Foto del Dentista</span>
              </label>
              
              <q-file
                v-model="imageFile"
                filled
                dense
                accept="image/*"
                class="form-input"
                label="Seleccionar imagen"
                @update:model-value="handleImageSelect"
              >
                <template v-slot:prepend>
                  <i class="fa-solid fa-image"></i>
                </template>
                <template v-slot:hint>
                  La imagen se guardará en /public/dentists/
                </template>
              </q-file>

              <div v-if="imagePreview" style="margin-top: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <q-avatar size="80px">
                    <img :src="imagePreview" alt="Preview" />
                  </q-avatar>
                  <q-btn
                    flat
                    dense
                    icon="fa-solid fa-trash"
                    color="negative"
                    size="sm"
                    @click="removeImage"
                    label="Eliminar"
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
          />
          <q-btn
            type="submit"
            label="Crear Dentista"
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
import especialidades from 'src/data/especialidades.json'
import users from 'src/data/users.json'

export default {
  name: 'NewDentistDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'dentist-created'],
  setup(props, { emit }) {
    const loading = ref(false)
    const imageFile = ref(null)
    const imagePreview = ref(null)
    
    const form = ref({
      name: '',
      second_name: '',
      father_last_name: '',
      mother_last_name: '',
      speciality: [],
      userId: null,
      state: 'active',
      img: null
    })

    const specialtyOptions = especialidades.especialidades
      .filter(spec => spec.state === 'active')
      .map(spec => ({
        label: spec.name,
        value: spec.id
      }))

    const userOptions = users.users
      .filter(user => user.state === 'active')
      .map(user => ({
        label: `${user.username} (${user.email})`,
        value: user.id
      }))

    const stateOptions = [
      { label: 'Activo', value: 'active' },
      { label: 'Inactivo', value: 'inactive' },
      { label: 'Pendiente de Activación', value: 'pending' }
    ]

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const resetForm = () => {
      form.value = {
        name: '',
        second_name: '',
        father_last_name: '',
        mother_last_name: '',
        speciality: [],
        userId: null,
        state: 'active',
        img: null
      }
      imageFile.value = null
      imagePreview.value = null
    }

    const closeDialog = () => {
      showDialog.value = false
      resetForm()
    }

    const handleImageSelect = (file) => {
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          imagePreview.value = e.target.result
        }
        reader.readAsDataURL(file)
      } else {
        imagePreview.value = null
      }
    }

    const removeImage = () => {
      imageFile.value = null
      imagePreview.value = null
    }

    const createDentist = async () => {
      loading.value = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        let imagePath = null

        // Si hay imagen, generar ruta
        if (imageFile.value) {
          const timestamp = Date.now()
          const fileName = `dentist_${timestamp}.${imageFile.value.name.split('.').pop()}`
          imagePath = `/dentists/${fileName}`
          
          // Aquí en producción subirías el archivo al servidor
          console.log('Imagen a guardar:', fileName, 'en /public/dentists/')
        }

        const newDentist = {
          name: form.value.name,
          second_name: form.value.second_name,
          father_last_name: form.value.father_last_name,
          mother_last_name: form.value.mother_last_name,
          speciality: form.value.speciality,
          userId: form.value.userId,
          state: form.value.state,
          img: imagePath
        }

        emit('dentist-created', newDentist)
        closeDialog()
      } catch (error) {
        console.error('Error creating dentist:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      showDialog,
      form,
      specialtyOptions,
      userOptions,
      stateOptions,
      loading,
      imageFile,
      imagePreview,
      closeDialog,
      createDentist,
      handleImageSelect,
      removeImage
    }
  }
}
</script>