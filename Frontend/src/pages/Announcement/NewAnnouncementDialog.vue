<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="new-dialog" style="min-width: 600px; max-width: 800px;">
      <q-card-section class="dialog-header bg-primary text-white">
        <div class="row items-center">
          <div class="col">
            <div class="text-h6">Nuevo Anuncio</div>
          </div>
          <div class="col-auto">
            <q-btn icon="close" flat round dense @click="closeDialog" color="white" />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <q-form @submit="createAnuncio" class="q-gutter-md">
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
              label="Crear Anuncio" 
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
  name: 'NewAnuncioDialog',
  
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },

  emits: ['update:modelValue', 'anuncio-created'],

  setup(props, { emit }) {
    const showDialog = ref(false)
    const formData = ref({
      titulo: '',
      descripcion: '',
      categoria: 'Promoción',
      fecha_publicacion: new Date().toISOString().split('T')[0],
      fecha_expiracion: '',
      imagen: '',
      estado: 'activo',
      userId: 101
    })

    const anuncioStore = usePublicarAnuncio()

    const categorias = ['Promoción', 'Evento', 'Aviso', 'Noticia']
    const estadoOptions = [
      { label: 'Activo', value: 'activo' },
      { label: 'Inactivo', value: 'inactivo' }
    ]

    const isFormValid = computed(() => {
      return formData.value.titulo && formData.value.descripcion && formData.value.categoria
    })

    const createAnuncio = () => {
      if (!isFormValid.value) return

      emit('anuncio-created', formData.value)
      resetForm()
      closeDialog()
    }

    const resetForm = () => {
      formData.value = {
        titulo: '',
        descripcion: '',
        categoria: 'Promoción',
        fecha_publicacion: new Date().toISOString().split('T')[0],
        fecha_expiracion: '',
        imagen: '',
        estado: 'activo',
        userId: 101
      }
    }

    const closeDialog = () => {
      emit('update:modelValue', false)
    }

    watch(() => props.modelValue, (newVal) => {
      showDialog.value = newVal
      if (newVal) {
        resetForm()
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
      createAnuncio,
      closeDialog
    }
  }
}
</script>

