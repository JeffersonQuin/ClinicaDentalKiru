<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <q-card class="edit-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-edit"></i>
            <span>Editar Sucursal</span>
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

      <q-form @submit="saveBranch" class="form-container">
        <q-card-section class="dialog-content" style="overflow-y: auto;">
          <div class="edit-form-grid">
            <!-- Left Column -->
            <div class="form-column">
              <h4 class="section-header">Información General</h4>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-building"></i>
                  <span>Nombre de la Sucursal</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.nombre"
                  filled
                  dense
                  :rules="[val => !!val || 'El nombre es requerido']"
                  class="form-input"
                  placeholder="Ej: Sucursal Centro"
                />
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-location-dot"></i>
                  <span>Ubicación (Ciudad)</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.ubicacion"
                  filled
                  dense
                  :rules="[val => !!val || 'La ubicación es requerida']"
                  class="form-input"
                  placeholder="Ej: Oruro"
                />
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-map-marker-alt"></i>
                  <span>Dirección Completa</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.direccion"
                  filled
                  dense
                  :rules="[val => !!val || 'La dirección es requerida']"
                  class="form-input"
                  placeholder="Ej: Av. 6 de Agosto #123, Centro, Oruro"
                />
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-circle-info"></i>
                  <span>Descripción</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.descripcion"
                  filled
                  dense
                  type="textarea"
                  rows="3"
                  :rules="[val => !!val || 'La descripción es requerida']"
                  class="form-input"
                  placeholder="Descripción de la sucursal..."
                />
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-image"></i>
                  <span>Imagen de la Sucursal</span>
                </label>

                <div v-if="form.imagen && !newImageFile" style="margin-bottom: 10px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <img :src="form.imagen" alt="Preview" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;" />
                    <q-btn
                      flat
                      dense
                      icon="fa-solid fa-trash"
                      color="negative"
                      size="sm"
                      @click="removeCurrentImage"
                      label="Eliminar imagen"
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
                    Se guardará en /public/icons/
                  </template>
                </q-file>

                <div v-if="imagePreview" style="margin-top: 10px;">
                  <img :src="imagePreview" alt="Preview" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;" />
                </div>
              </div>

              <div class="field-group">
                <q-toggle
                  v-model="form.activo"
                  label="Sucursal Activa"
                  color="positive"
                  checked-icon="fa-solid fa-check"
                  unchecked-icon="fa-solid fa-xmark"
                />
              </div>
            </div>

            <!-- Right Column -->
            <div class="form-column">
              <h4 class="section-header">Coordenadas GPS</h4>

              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-location-crosshairs"></i>
                    <span>Latitud</span>
                  </label>
                  <q-input
                    v-model.number="form.latitud"
                    filled
                    dense
                    type="number"
                    step="0.000001"
                    class="form-input"
                    placeholder="-17.9758"
                  />
                </div>

                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-location-crosshairs"></i>
                    <span>Longitud</span>
                  </label>
                  <q-input
                    v-model.number="form.longitud"
                    filled
                    dense
                    type="number"
                    step="0.000001"
                    class="form-input"
                    placeholder="-67.1101"
                  />
                </div>
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-map"></i>
                  <span>Vista Previa del Mapa</span>
                </label>
                <div class="map-preview">
                  <div v-if="form.latitud && form.longitud" class="map-container-small">
                    <iframe
                      :src="`https://www.google.com/maps?q=${form.latitud},${form.longitud}&hl=es&z=15&output=embed`"
                      width="100%"
                      height="150"
                      style="border:0; border-radius: 8px;"
                      allowfullscreen=""
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <div v-else class="map-placeholder-small">
                    <i class="fa-solid fa-map-location-dot"></i>
                    <p>Ingresa las coordenadas para ver el mapa</p>
                  </div>
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

export default {
  name: 'EditBranchDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    branchData: {
      type: Object,
      default: () => null
    }
  },
  emits: ['update:modelValue', 'branch-updated'],
  setup(props, { emit }) {
    const loading = ref(false)
    const newImageFile = ref(null)
    const imagePreview = ref(null)

    const form = ref({
      id: null,
      nombre: '',
      ubicacion: '',
      direccion: '',
      descripcion: '',
      imagen: '',
      latitud: 0,
      longitud: 0,
      activo: true
    })

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const initializeForm = () => {
      if (props.branchData) {
        form.value = {
          id: props.branchData.id,
          nombre: props.branchData.nombre || '',
          ubicacion: props.branchData.ubicacion || '',
          direccion: props.branchData.direccion || '',
          descripcion: props.branchData.descripcion || '',
          imagen: props.branchData.imagen || '',
          latitud: props.branchData.latitud || 0,
          longitud: props.branchData.longitud || 0,
          activo: props.branchData.activo !== undefined ? props.branchData.activo : true
        }
      }
    }

    const resetForm = () => {
      form.value = {
        id: null,
        nombre: '',
        ubicacion: '',
        direccion: '',
        descripcion: '',
        imagen: '',
        latitud: 0,
        longitud: 0,
        activo: true
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
      form.value.imagen = ''
    }

    const saveBranch = async () => {
      loading.value = true

      try {
        // Simular procesamiento
        await new Promise(resolve => setTimeout(resolve, 1000))

        let imagePath = form.value.imagen

        if (newImageFile.value) {
          const timestamp = Date.now()
          const fileName = `sucursal_${form.value.id}_${timestamp}.${newImageFile.value.name.split('.').pop()}`
          imagePath = `/icons/${fileName}`

          console.log('Imagen a guardar:', fileName, 'en /public/icons/')
        }

        const updatedBranch = {
          id: form.value.id,
          nombre: form.value.nombre,
          ubicacion: form.value.ubicacion,
          direccion: form.value.direccion,
          descripcion: form.value.descripcion,
          imagen: imagePath,
          latitud: parseFloat(form.value.latitud) || 0,
          longitud: parseFloat(form.value.longitud) || 0,
          activo: form.value.activo
        }

        emit('branch-updated', updatedBranch)
        closeDialog()
      } catch (error) {
        console.error('Error updating branch:', error)
      } finally {
        loading.value = false
      }
    }

    watch(() => props.branchData, (newData) => {
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
      newImageFile,
      imagePreview,
      closeDialog,
      saveBranch,
      handleImageSelect,
      removeCurrentImage
    }
  }
}
</script>