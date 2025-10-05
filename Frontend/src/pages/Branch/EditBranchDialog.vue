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
                  v-model="form.name"
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
                  <span>Ciudad</span>
                  <span class="required">*</span>
                </label>
                <q-input
                  v-model="form.location"
                  filled
                  dense
                  :rules="[val => !!val || 'La ciudad es requerida']"
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
                  v-model="form.address"
                  filled
                  dense
                  :rules="[val => !!val || 'La dirección es requerida']"
                  class="form-input"
                  placeholder="Ej: Av. 6 de Agosto #123"
                />
              </div>

              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-phone"></i>
                    <span>Teléfono</span>
                    <span class="required">*</span>
                  </label>
                  <q-input
                    v-model="form.phone"
                    filled
                    dense
                    :rules="[val => !!val || 'El teléfono es requerido']"
                    class="form-input"
                    placeholder="78900785"
                  />
                </div>

                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-envelope"></i>
                    <span>Email</span>
                    <span class="required">*</span>
                  </label>
                  <q-input
                    v-model="form.email"
                    filled
                    dense
                    type="email"
                    :rules="[
                      val => !!val || 'El email es requerido',
                      val => /.+@.+\..+/.test(val) || 'Email inválido'
                    ]"
                    class="form-input"
                    placeholder="info@clinica.com"
                  />
                </div>
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-image"></i>
                  <span>Imagen de la Sucursal</span>
                </label>

                <div v-if="form.image && !newImageFile" style="margin-bottom: 10px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <img :src="form.image" alt="Preview" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;" />
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

              <h4 class="section-header">Coordenadas GPS</h4>

              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">
                    <i class="fa-solid fa-location-crosshairs"></i>
                    <span>Latitud</span>
                  </label>
                  <q-input
                    v-model.number="form.coordinates.lat"
                    filled
                    dense
                    type="number"
                    step="0.0001"
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
                    v-model.number="form.coordinates.lng"
                    filled
                    dense
                    type="number"
                    step="0.0001"
                    class="form-input"
                    placeholder="-67.1101"
                  />
                </div>
              </div>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-map"></i>
                  <span>URL del Mapa (Google Maps Embed)</span>
                </label>
                <q-input
                  v-model="form.mapUrl"
                  filled
                  dense
                  type="textarea"
                  rows="3"
                  class="form-input"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
              </div>
            </div>

            <!-- Right Column -->
            <div class="form-column">
              <h4 class="section-header">Horario de Atención</h4>

              <div v-for="(day, key) in dayTranslations" :key="key" class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-clock"></i>
                  <span>{{ day }}</span>
                </label>
                <q-input
                  v-model="form.schedule[key]"
                  filled
                  dense
                  class="form-input"
                  placeholder="8:00 AM - 6:00 PM o Cerrado"
                />
              </div>

              <h4 class="section-header">Servicios Ofrecidos</h4>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-hand-holding-medical"></i>
                  <span>Lista de Servicios</span>
                </label>
                <div class="services-editor">
                  <div
                    v-for="(service, index) in form.services"
                    :key="index"
                    class="service-input-row"
                  >
                    <q-input
                      v-model="form.services[index]"
                      filled
                      dense
                      class="form-input"
                      placeholder="Nombre del servicio"
                    />
                    <q-btn
                      round
                      dense
                      icon="fa-solid fa-trash"
                      color="negative"
                      size="sm"
                      @click="removeService(index)"
                    />
                  </div>
                  <q-btn
                    flat
                    icon="fa-solid fa-plus"
                    label="Agregar Servicio"
                    color="primary"
                    @click="addService"
                    no-caps
                    size="sm"
                  />
                </div>
              </div>

              <h4 class="section-header">Características</h4>

              <div class="field-group">
                <label class="field-label">
                  <i class="fa-solid fa-star"></i>
                  <span>Lista de Características</span>
                </label>
                <div class="features-editor">
                  <div
                    v-for="(feature, index) in form.features"
                    :key="index"
                    class="feature-input-row"
                  >
                    <q-input
                      v-model="form.features[index]"
                      filled
                      dense
                      class="form-input"
                      placeholder="Característica"
                    />
                    <q-btn
                      round
                      dense
                      icon="fa-solid fa-trash"
                      color="negative"
                      size="sm"
                      @click="removeFeature(index)"
                    />
                  </div>
                  <q-btn
                    flat
                    icon="fa-solid fa-plus"
                    label="Agregar Característica"
                    color="primary"
                    @click="addFeature"
                    no-caps
                    size="sm"
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
      name: '',
      location: '',
      address: '',
      phone: '',
      email: '',
      image: '',
      schedule: {
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
        sunday: ''
      },
      services: [],
      coordinates: {
        lat: 0,
        lng: 0
      },
      mapUrl: '',
      features: []
    })

    const dayTranslations = {
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo'
    }

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const initializeForm = () => {
      if (props.branchData) {
        form.value = {
          id: props.branchData.id,
          name: props.branchData.name || '',
          location: props.branchData.location || '',
          address: props.branchData.address || '',
          phone: props.branchData.phone || '',
          email: props.branchData.email || '',
          image: props.branchData.image || '',
          schedule: { ...props.branchData.schedule },
          services: [...(props.branchData.services || [])],
          coordinates: { ...(props.branchData.coordinates || { lat: 0, lng: 0 }) },
          mapUrl: props.branchData.mapUrl || '',
          features: [...(props.branchData.features || [])]
        }
      }
    }

    const resetForm = () => {
      form.value = {
        id: null,
        name: '',
        location: '',
        address: '',
        phone: '',
        email: '',
        image: '',
        schedule: {
          monday: '',
          tuesday: '',
          wednesday: '',
          thursday: '',
          friday: '',
          saturday: '',
          sunday: ''
        },
        services: [],
        coordinates: {
          lat: 0,
          lng: 0
        },
        mapUrl: '',
        features: []
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
      form.value.image = ''
    }

    const addService = () => {
      form.value.services.push('')
    }

    const removeService = (index) => {
      form.value.services.splice(index, 1)
    }

    const addFeature = () => {
      form.value.features.push('')
    }

    const removeFeature = (index) => {
      form.value.features.splice(index, 1)
    }

    const saveBranch = async () => {
      loading.value = true

      try {
        await new Promise(resolve => setTimeout(resolve, 1000))

        let imagePath = form.value.image

        if (newImageFile.value) {
          const timestamp = Date.now()
          const fileName = `sucursal_${form.value.id}_${timestamp}.${newImageFile.value.name.split('.').pop()}`
          imagePath = `/icons/${fileName}`

          console.log('Imagen a guardar:', fileName, 'en /public/icons/')
        }

        // Filtrar servicios y características vacíos
        const cleanedServices = form.value.services.filter(s => s.trim() !== '')
        const cleanedFeatures = form.value.features.filter(f => f.trim() !== '')

        const updatedBranch = {
          ...props.branchData,
          name: form.value.name,
          location: form.value.location,
          address: form.value.address,
          phone: form.value.phone,
          email: form.value.email,
          image: imagePath,
          schedule: form.value.schedule,
          services: cleanedServices,
          coordinates: form.value.coordinates,
          mapUrl: form.value.mapUrl,
          features: cleanedFeatures
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
      dayTranslations,
      loading,
      newImageFile,
      imagePreview,
      closeDialog,
      saveBranch,
      handleImageSelect,
      removeCurrentImage,
      addService,
      removeService,
      addFeature,
      removeFeature
    }
  }
}
</script>

<style scoped>
.edit-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  margin: 20px 0 12px 0;
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #667eea;
  padding-bottom: 8px;
}

.section-header:first-child {
  margin-top: 0;
}

.service-input-row,
.feature-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

.services-editor,
.features-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 1024px) {
  .edit-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>