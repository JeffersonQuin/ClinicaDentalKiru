<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <q-card class="new-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-plus-circle"></i>
            <span>Crear Nueva Sucursal</span>
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

      <q-form @submit="createBranch" class="form-container">
        <q-card-section class="dialog-content" style="overflow-y: auto;">
          <div class="welcome-message" style="max-width: 800px; margin: 0 auto 30px;">
            <i class="fa-solid fa-info-circle"></i>
            <p>Complete los siguientes datos para registrar una nueva sucursal de la clínica dental.</p>
          </div>

          <div class="create-form-grid">
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
                  :rules="[
                    val => !!val || 'El nombre es requerido',
                    val => val.length >= 3 || 'Mínimo 3 caracteres'
                  ]"
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
                  placeholder="Ej: Av. 6 de Agosto #123, Centro"
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

                <q-file
                  v-model="imageFile"
                  filled
                  dense
                  accept="image/*"
                  class="form-input"
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
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <img :src="imagePreview" alt="Preview" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px;" />
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
                >
                  <template v-slot:hint>
                    Obtén el código de inserción desde Google Maps
                  </template>
                </q-input>
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
                  <span class="required">*</span>
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
            label="Crear Sucursal"
            icon="fa-solid fa-plus-circle"
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
  name: 'NewBranchDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'branch-created'],
  setup(props, { emit }) {
    const loading = ref(false)
    const imageFile = ref(null)
    const imagePreview = ref(null)

    const form = ref({
      name: '',
      location: '',
      address: '',
      phone: '',
      email: '',
      image: '',
      schedule: {
        monday: '8:00 AM - 6:00 PM',
        tuesday: '8:00 AM - 6:00 PM',
        wednesday: '8:00 AM - 6:00 PM',
        thursday: '8:00 AM - 6:00 PM',
        friday: '8:00 AM - 6:00 PM',
        saturday: '8:00 AM - 2:00 PM',
        sunday: 'Cerrado'
      },
      services: ['Odontología General'],
      coordinates: {
        lat: 0,
        lng: 0
      },
      mapUrl: '',
      features: ['WiFi gratuito']
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

    const resetForm = () => {
      form.value = {
        name: '',
        location: '',
        address: '',
        phone: '',
        email: '',
        image: '',
        schedule: {
          monday: '8:00 AM - 6:00 PM',
          tuesday: '8:00 AM - 6:00 PM',
          wednesday: '8:00 AM - 6:00 PM',
          thursday: '8:00 AM - 6:00 PM',
          friday: '8:00 AM - 6:00 PM',
          saturday: '8:00 AM - 2:00 PM',
          sunday: 'Cerrado'
        },
        services: ['Odontología General'],
        coordinates: {
          lat: 0,
          lng: 0
        },
        mapUrl: '',
        features: ['WiFi gratuito']
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

    const createBranch = async () => {
      loading.value = true

      try {
        await new Promise(resolve => setTimeout(resolve, 1500))

        let imagePath = null

        if (imageFile.value) {
          const timestamp = Date.now()
          const fileName = `sucursal_${timestamp}.${imageFile.value.name.split('.').pop()}`
          imagePath = `/icons/${fileName}`

          console.log('Imagen a guardar:', fileName, 'en /public/icons/')
        }

        // Filtrar servicios y características vacíos
        const cleanedServices = form.value.services.filter(s => s.trim() !== '')
        const cleanedFeatures = form.value.features.filter(f => f.trim() !== '')

        const newBranch = {
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

        emit('branch-created', newBranch)
        closeDialog()
      } catch (error) {
        console.error('Error creating branch:', error)
      } finally {
        loading.value = false
      }
    }

    return {
      showDialog,
      form,
      dayTranslations,
      loading,
      imageFile,
      imagePreview,
      closeDialog,
      createBranch,
      handleImageSelect,
      removeImage,
      addService,
      removeService,
      addFeature,
      removeFeature
    }
  }
}
</script>

<!-- Los estilos están en app.scss global -->