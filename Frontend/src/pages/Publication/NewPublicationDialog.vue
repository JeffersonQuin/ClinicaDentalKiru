<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="new-dialog" style="min-width: 650px; max-width: 750px;">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-plus-circle"></i>
            <span>Crear Nueva Publicación</span>
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

      <q-form @submit="createPublication" class="form-container">
        <q-card-section class="dialog-content">
          <div class="welcome-message">
            <i class="fa-solid fa-info-circle"></i>
            <p>Complete los siguientes datos para crear una nueva publicación educativa.</p>
          </div>

          <div class="form-fields">
            <div class="field-group full-width">
              <label class="field-label">
                <i class="fa-solid fa-heading"></i>
                <span>Título de la Publicación</span>
                <span class="required">*</span>
              </label>
              <q-input
                v-model="form.titulo"
                filled
                dense
                :rules="[
                  val => !!val || 'El título es requerido',
                  val => val.length >= 5 || 'El título debe tener al menos 5 caracteres'
                ]"
                class="form-input"
                placeholder="Ej: Importancia de la higiene bucal diaria"
              />
            </div>

            <div class="field-group full-width">
              <label class="field-label">
                <i class="fa-solid fa-align-left"></i>
                <span>Descripción</span>
                <span class="required">*</span>
              </label>
              <q-input
                v-model="form.descripcion"
                filled
                dense
                type="textarea"
                rows="5"
                :rules="[
                  val => !!val || 'La descripción es requerida',
                  val => val.length >= 20 || 'La descripción debe tener al menos 20 caracteres'
                ]"
                class="form-input"
                placeholder="Escriba una descripción detallada y educativa sobre el tema..."
                counter
                maxlength="500"
              />
            </div>

            <div class="field-row">
              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-user-pen"></i>
                  <span>Autor de la Publicación</span>
                  <span class="required">*</span>
                </label>
                <q-select
                  v-model="form.userId"
                  filled
                  dense
                  :options="userOptions"
                  :rules="[val => !!val || 'Seleccione un autor']"
                  class="form-input"
                  placeholder="Seleccione el autor"
                  map-options
                  emit-value
                  option-label="label"
                  option-value="value"
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
                <i class="fa-solid fa-images"></i>
                <span>Imágenes de la Publicación</span>
                <span class="required">*</span>
              </label>
              
              <q-file
                v-model="imageFiles"
                filled
                dense
                multiple
                accept="image/*"
                class="form-input"
                :rules="[val => !!val && val.length > 0 || 'Debe seleccionar al menos una imagen']"
                @update:model-value="handleImageSelect"
                counter
                max-files="10"
              >
                <template v-slot:prepend>
                  <i class="fa-solid fa-camera"></i>
                </template>
                <template v-slot:hint>
                  Seleccione una o múltiples imágenes (máximo 10). Se guardarán en /public/publications/
                </template>
              </q-file>

              <!-- Vista previa de imágenes -->
              <div v-if="imagePreviews.length > 0" class="images-preview-section">
                <div class="preview-header">
                  <span class="preview-title">Vista previa ({{ imagePreviews.length }} imagen{{ imagePreviews.length > 1 ? 'es' : '' }})</span>
                  <q-btn
                    flat
                    dense
                    icon="fa-solid fa-trash-can"
                    color="negative"
                    size="sm"
                    label="Eliminar todas"
                    @click="clearAllImages"
                  />
                </div>
                <div class="images-preview-grid">
                  <div
                    v-for="(preview, index) in imagePreviews"
                    :key="index"
                    class="preview-image-item"
                  >
                    <img :src="preview" :alt="`Imagen ${index + 1}`" class="preview-image" />
                    <div class="preview-overlay">
                      <span class="preview-index">{{ index + 1 }}</span>
                      <q-btn
                        round
                        dense
                        icon="fa-solid fa-times"
                        color="negative"
                        size="xs"
                        @click="removeImage(index)"
                      />
                    </div>
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
          />
          <q-btn
            type="submit"
            label="Crear Publicación"
            icon="fa-solid fa-paper-plane"
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
import users from 'src/data/users.json'

export default {
  name: 'NewPublicationDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'publication-created'],
  setup(props, { emit }) {
    const loading = ref(false)
    const imageFiles = ref(null)
    const imagePreviews = ref([])
    
    const form = ref({
      titulo: '',
      descripcion: '',
      userId: null,
      state: 'active',
      imagenes: []
    })

    const userOptions = users.users
      .filter(user => user.state === 'active')
      .map(user => ({
        label: `${user.username} (${user.email})`,
        value: user.id
      }))

    const stateOptions = [
      { label: 'Activa', value: 'active' },
      { label: 'Inactiva', value: 'inactive' }
    ]

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const resetForm = () => {
      form.value = {
        titulo: '',
        descripcion: '',
        userId: null,
        state: 'active',
        imagenes: []
      }
      imageFiles.value = null
      imagePreviews.value = []
    }

    const closeDialog = () => {
      showDialog.value = false
      resetForm()
    }

    const handleImageSelect = (files) => {
      if (!files || files.length === 0) {
        imagePreviews.value = []
        return
      }

      const filesArray = Array.isArray(files) ? files : [files]
      imagePreviews.value = []

      filesArray.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          imagePreviews.value.push(e.target.result)
        }
        reader.readAsDataURL(file)
      })
    }

    const removeImage = (index) => {
      imagePreviews.value.splice(index, 1)
      if (imageFiles.value) {
        const filesArray = Array.isArray(imageFiles.value) ? imageFiles.value : [imageFiles.value]
        filesArray.splice(index, 1)
        imageFiles.value = filesArray.length > 0 ? filesArray : null
      }
    }

    const clearAllImages = () => {
      imageFiles.value = null
      imagePreviews.value = []
    }

    const createPublication = async () => {
      loading.value = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        let imagePaths = []

        // Si hay imágenes, generar rutas
        if (imageFiles.value) {
          const filesArray = Array.isArray(imageFiles.value) ? imageFiles.value : [imageFiles.value]
          
          filesArray.forEach((file, index) => {
            const timestamp = Date.now()
            const fileName = `publication_${timestamp}_${index}.${file.name.split('.').pop()}`
            const imagePath = `/publications/${fileName}`
            imagePaths.push(imagePath)
            
            console.log('Imagen a guardar:', fileName, 'en /public/publications/')
          })
        }

        const newPublication = {
          titulo: form.value.titulo,
          descripcion: form.value.descripcion,
          userId: form.value.userId,
          state: form.value.state,
          imagenes: imagePaths
        }

        emit('publication-created', newPublication)
        closeDialog()
      } catch (error) {
        console.error('Error creating publication:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      showDialog,
      form,
      userOptions,
      stateOptions,
      loading,
      imageFiles,
      imagePreviews,
      closeDialog,
      createPublication,
      handleImageSelect,
      removeImage,
      clearAllImages
    }
  }
}
</script>

<!-- Los estilos están en app.scss global -->