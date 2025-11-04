<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="edit-dialog" style="min-width: 650px; max-width: 750px;">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-edit"></i>
            <span>Editar Publicación</span>
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

      <q-form @submit="savePublication" class="form-container">
        <q-card-section class="dialog-content">
          <div class="form-fields">
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
                rows="4"
                :rules="[val => !!val || 'La descripción es requerida']"
                class="form-input"
                placeholder="Escriba una descripción detallada de la publicación"
              />
            </div>

            <div class="field-group full-width">
              <label class="field-label">
                <i class="fa-solid fa-user"></i>
                <span>Autor de la Publicación</span>
                <span class="required">*</span>
              </label>
              <q-select
                v-model="form.userId"
                filled
                dense
                :options="userOptions"
                emit-value
                map-options
                :rules="[val => !!val || 'Seleccione un autor']"
                class="form-input"
                placeholder="Seleccione el autor"
              />
            </div>

            <div class="field-group full-width">
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

            <div class="field-group full-width">
              <label class="field-label">
                <i class="fa-solid fa-images"></i>
                <span>Imágenes de la Publicación</span>
              </label>

              <!-- Imágenes actuales -->
              <div v-if="form.imagenes && form.imagenes.length > 0" class="current-images-section">
                <div class="current-images-label">Imágenes actuales:</div>
                <div class="current-images-grid">
                  <div
                    v-for="(img, index) in form.imagenes"
                    :key="index"
                    class="current-image-item"
                  >
                    <img :src="img" :alt="`Imagen ${index + 1}`" class="current-image-preview" />
                    <q-btn
                      round
                      dense
                      icon="fa-solid fa-trash"
                      color="negative"
                      size="xs"
                      class="remove-image-btn"
                      @click="removeCurrentImage(index)"
                    />
                  </div>
                </div>
              </div>

              <!-- Subir nuevas imágenes -->
              <q-file
                v-model="newImageFiles"
                filled
                dense
                multiple
                accept="image/*"
                class="form-input"
                label="Agregar nuevas imágenes"
                @update:model-value="handleImageSelect"
                counter
                max-files="10"
              >
                <template v-slot:prepend>
                  <i class="fa-solid fa-camera"></i>
                </template>
                <template v-slot:hint>
                  Puede seleccionar múltiples imágenes. Se guardarán en /public/publications/
                </template>
              </q-file>

              <!-- Vista previa de nuevas imágenes -->
              <div v-if="imagePreviews.length > 0" class="new-images-section">
                <div class="new-images-label">Nuevas imágenes a agregar:</div>
                <div class="new-images-grid">
                  <div
                    v-for="(preview, index) in imagePreviews"
                    :key="index"
                    class="new-image-item"
                  >
                    <img :src="preview" :alt="`Nueva ${index + 1}`" class="new-image-preview" />
                    <q-btn
                      round
                      dense
                      icon="fa-solid fa-times"
                      color="negative"
                      size="xs"
                      class="remove-new-image-btn"
                      @click="removeNewImage(index)"
                    />
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
import users from 'src/data/users.json'

export default {
  name: 'EditPublicationDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    publicationData: {
      type: Object,
      default: () => null
    }
  },
  emits: ['update:modelValue', 'publication-updated'],
  setup(props, { emit }) {
    const loading = ref(false)
    const newImageFiles = ref(null)
    const imagePreviews = ref([])
    
    const form = ref({
      id: null,
      titulo: '',
      descripcion: '',
      userId: null,
      state: '',
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

    const initializeForm = () => {
      if (props.publicationData) {
        form.value = {
          id: props.publicationData.id,
          titulo: props.publicationData.titulo || '',
          descripcion: props.publicationData.descripcion || '',
          userId: props.publicationData.userId || null,
          state: props.publicationData.state || 'active',
          imagenes: [...(props.publicationData.imagenes || [])]
        }
      }
    }

    const resetForm = () => {
      form.value = {
        id: null,
        titulo: '',
        descripcion: '',
        userId: null,
        state: 'active',
        imagenes: []
      }
      newImageFiles.value = null
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

    const removeCurrentImage = (index) => {
      form.value.imagenes.splice(index, 1)
    }

    const removeNewImage = (index) => {
      imagePreviews.value.splice(index, 1)
      if (newImageFiles.value) {
        const filesArray = Array.isArray(newImageFiles.value) ? newImageFiles.value : [newImageFiles.value]
        filesArray.splice(index, 1)
        newImageFiles.value = filesArray.length > 0 ? filesArray : null
      }
    }

    const savePublication = async () => {
      loading.value = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        let allImages = [...form.value.imagenes]

        // Si hay nuevas imágenes, generar rutas
        if (newImageFiles.value) {
          const filesArray = Array.isArray(newImageFiles.value) ? newImageFiles.value : [newImageFiles.value]
          
          filesArray.forEach((file, index) => {
            const timestamp = Date.now()
            const fileName = `publication_${form.value.id}_${timestamp}_${index}.${file.name.split('.').pop()}`
            const imagePath = `/publications/${fileName}`
            allImages.push(imagePath)
            
            console.log('Imagen a guardar:', fileName, 'en /public/publications/')
          })
        }

        const updatedPublication = {
          ...props.publicationData,
          titulo: form.value.titulo,
          descripcion: form.value.descripcion,
          userId: form.value.userId,
          state: form.value.state,
          imagenes: allImages
        }

        emit('publication-updated', updatedPublication)
        closeDialog()
      } catch (error) {
        console.error('Error updating publication:', error)
      } finally {
        loading.value = false
      }
    }

    watch(() => props.publicationData, (newData) => {
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
      userOptions,
      stateOptions,
      loading,
      newImageFiles,
      imagePreviews,
      closeDialog,
      savePublication,
      handleImageSelect,
      removeCurrentImage,
      removeNewImage
    }
  }
}
</script>

<!-- Los estilos están en app.scss global -->