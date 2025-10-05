<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="edit-dialog" style="min-width: 600px;">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-user-doctor"></i>
            <span>Editar Dentista</span>
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

      <q-form @submit="saveDentist" class="form-container">
        <q-card-section class="dialog-content">
          <div class="form-fields">
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
                :rules="[val => !!val || 'El nombre es requerido']"
                class="form-input"
                placeholder="Ingrese el nombre"
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
                placeholder="Ingrese el segundo nombre (opcional)"
              />
            </div>

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
                :rules="[val => !!val || 'El apellido paterno es requerido']"
                class="form-input"
                placeholder="Ingrese el apellido paterno"
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
                placeholder="Ingrese el apellido materno (opcional)"
              />
            </div>

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
                emit-value
                map-options
                use-chips
                :rules="[val => val && val.length > 0 || 'Seleccione al menos una especialidad']"
                class="form-input"
                placeholder="Seleccione las especialidades"
              />
            </div>

            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-user-tag"></i>
                <span>Usuario del Sistema</span>
              </label>
              <q-input
                v-model.number="form.userId"
                filled
                dense
                type="number"
                class="form-input"
                placeholder="ID del usuario asignado"
              />
            </div>

            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-toggle-on"></i>
                <span>Estado</span>
                <span class="required">*</span>
              </label>
              <q-select
                v-model="form.state"
                filled
                dense
                :options="stateOptions"
                emit-value
                map-options
                :rules="[val => !!val || 'El estado es requerido']"
                class="form-input"
                placeholder="Seleccione el estado"
              />
            </div>

            <div class="field-group">
              <label class="field-label">
                <i class="fa-solid fa-image"></i>
                <span>Foto del Dentista</span>
              </label>
              
              <div v-if="form.img && !newImageFile" style="margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <q-avatar size="60px">
                    <img :src="form.img" alt="Preview" />
                  </q-avatar>
                  <q-btn
                    flat
                    dense
                    icon="fa-solid fa-trash"
                    color="negative"
                    size="sm"
                    @click="removeCurrentImage"
                    label="Eliminar foto actual"
                  />
                </div>
              </div>

              <q-file
                v-model="newImageFile"
                filled
                dense
                accept="image/*"
                class="form-input"
                label="Seleccionar nueva imagen"
                @update:model-value="handleImageSelect"
              >
                <template v-slot:prepend>
                  <i class="fa-solid fa-camera"></i>
                </template>
                <template v-slot:hint>
                  La imagen se guardará en /public/dentists/
                </template>
              </q-file>

              <div v-if="imagePreview" style="margin-top: 10px;">
                <q-avatar size="60px">
                  <img :src="imagePreview" alt="Preview" />
                </q-avatar>
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
import especialidades from 'src/data/especialidades.json'

export default {
  name: 'EditDentistDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    dentistData: {
      type: Object,
      default: () => null
    }
  },
  emits: ['update:modelValue', 'dentist-updated'],
  setup(props, { emit }) {
    const loading = ref(false)
    const newImageFile = ref(null)
    const imagePreview = ref(null)
    
    const form = ref({
      id: null,
      name: '',
      second_name: '',
      father_last_name: '',
      mother_last_name: '',
      speciality: [],
      userId: null,
      state: '',
      img: null
    })

    const specialtyOptions = especialidades.especialidades
      .filter(spec => spec.state === 'active')
      .map(spec => ({
        label: spec.name,
        value: spec.id
      }))

    const stateOptions = [
      { label: 'Activo', value: 'active' },
      { label: 'Inactivo', value: 'inactive' }
    ]

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const initializeForm = () => {
      if (props.dentistData) {
        form.value = {
          id: props.dentistData.id,
          name: props.dentistData.name || '',
          second_name: props.dentistData.second_name || '',
          father_last_name: props.dentistData.father_last_name || '',
          mother_last_name: props.dentistData.mother_last_name || '',
          speciality: props.dentistData.speciality || [],
          userId: props.dentistData.userId || null,
          state: props.dentistData.state || 'active',
          img: props.dentistData.img || null
        }
      }
    }

    const resetForm = () => {
      form.value = {
        id: null,
        name: '',
        second_name: '',
        father_last_name: '',
        mother_last_name: '',
        speciality: [],
        userId: null,
        state: 'active',
        img: null
      }
      newImageFile.value = null
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

    const removeCurrentImage = () => {
      form.value.img = null
    }

    const saveDentist = async () => {
      loading.value = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        let imagePath = form.value.img

        // Si hay nueva imagen, generar ruta
        if (newImageFile.value) {
          const timestamp = Date.now()
          const fileName = `dentist_${form.value.id}_${timestamp}.${newImageFile.value.name.split('.').pop()}`
          imagePath = `/dentists/${fileName}`
          
          // Aquí en producción subirías el archivo al servidor
          console.log('Imagen a guardar:', fileName, 'en /public/dentists/')
        }

        const updatedDentist = {
          ...props.dentistData,
          name: form.value.name,
          second_name: form.value.second_name,
          father_last_name: form.value.father_last_name,
          mother_last_name: form.value.mother_last_name,
          speciality: form.value.speciality,
          userId: form.value.userId,
          state: form.value.state,
          img: imagePath
        }

        emit('dentist-updated', updatedDentist)
        closeDialog()
      } catch (error) {
        console.error('Error updating dentist:', error)
      } finally {
        loading.value = false
      }
    }

    watch(() => props.dentistData, (newData) => {
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
      specialtyOptions,
      stateOptions,
      loading,
      newImageFile,
      imagePreview,
      closeDialog,
      saveDentist,
      handleImageSelect,
      removeCurrentImage
    }
  }
}
</script>