<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="edit-dialog" style="min-width: 600px; max-width: 800px;">
      <q-card-section class="dialog-header bg-primary text-white">
        <div class="row items-center">
          <div class="col">
            <div class="text-h6">Editar Anuncio</div>
          </div>
          <div class="col-auto">
            <q-btn icon="close" flat round dense @click="closeDialog" color="white" />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <q-form @submit="updateAnuncio" class="q-gutter-md">
          <!-- Título -->
          <q-input
            v-model="formData.titulo"
            label="Título del anuncio *"
            outlined
            dense
            :rules="[val => !!val || 'El título es requerido']"
          />

          <!-- Categoría -->
          <q-select
            v-model="formData.categoria"
            :options="categorias"
            label="Categoría *"
            outlined
            dense
            :rules="[val => !!val || 'La categoría es requerida']"
          />

          <!-- Descripción -->
          <q-input
            v-model="formData.descripcion"
            label="Descripción *"
            type="textarea"
            rows="3"
            outlined
            dense
            :rules="[val => !!val || 'La descripción es requerida']"
          />

          <!-- Fechas -->
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input
                v-model="formData.fecha_publicacion"
                label="Fecha de publicación"
                type="date"
                outlined
                dense
              />
            </div>
            <div class="col-6">
              <q-input
                v-model="formData.fecha_expiracion"
                label="Fecha de expiración"
                type="date"
                outlined
                dense
              />
            </div>
          </div>

          <!-- Imagen -->
          <q-input
            v-model="formData.imagen"
            label="URL de la imagen"
            outlined
            dense
            placeholder="https://ejemplo.com/imagen.jpg"
          />

          <!-- Estado -->
          <q-option-group
            v-model="formData.estado"
            :options="estadoOptions"
            color="primary"
            inline
            label="Estado del anuncio"
          />

          <!-- Previsualización de imagen -->
          <div v-if="formData.imagen" class="image-preview q-mt-md">
            <div class="text-caption text-weight-bold q-mb-xs">Vista previa:</div>
            <q-img
              :src="formData.imagen"
              style="max-height: 200px; max-width: 300px;"
              class="rounded-borders"
              @error="anuncioStore.handleImageError"
            />
          </div>

          <!-- Acciones -->
          <q-card-actions align="right" class="q-pt-md">
            <q-btn label="Cancelar" color="grey" @click="closeDialog" no-caps />
            <q-btn 
              label="Guardar Cambios" 
              type="submit" 
              color="primary" 
              unelevated 
              no-caps
              :disable="!isFormValid"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { usePublicarAnuncio } from 'src/stores/publicarAnuncio'

export default {
  name: 'EditAnuncioDialog',
  
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    anuncioData: {
      type: Object,
      default: () => ({})
    }
  },

  emits: ['update:modelValue', 'anuncio-updated'],

  setup(props, { emit }) {
    const showDialog = ref(false)
    const formData = ref({})
    const anuncioStore = usePublicarAnuncio()

    const categorias = ['Promoción', 'Evento', 'Aviso', 'Noticia']
    const estadoOptions = [
      { label: 'Activo', value: 'activo' },
      { label: 'Inactivo', value: 'inactivo' }
    ]

    const isFormValid = computed(() => {
      return formData.value.titulo && formData.value.descripcion && formData.value.categoria
    })

    const loadAnuncioData = () => {
      if (props.anuncioData) {
        formData.value = {
          ...props.anuncioData,
          fecha_publicacion: props.anuncioData.fecha_publicacion || '',
          fecha_expiracion: props.anuncioData.fecha_expiracion || ''
        }
      }
    }

    const updateAnuncio = () => {
      if (!isFormValid.value) return

      const updatedData = {
        ...formData.value,
        id: props.anuncioData.id
      }

      emit('anuncio-updated', updatedData)
      closeDialog()
    }

    const closeDialog = () => {
      emit('update:modelValue', false)
    }

    watch(() => props.modelValue, (newVal) => {
      showDialog.value = newVal
      if (newVal) {
        loadAnuncioData()
      }
    })

    watch(showDialog, (newVal) => {
      if (newVal !== props.modelValue) {
        emit('update:modelValue', newVal)
      }
    })

    return {
      showDialog,
      formData,
      categorias,
      estadoOptions,
      anuncioStore,
      isFormValid,
      updateAnuncio,
      closeDialog
    }
  }
}
</script>
