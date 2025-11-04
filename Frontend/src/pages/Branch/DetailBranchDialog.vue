<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <q-card class="branch-detail-card">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-building"></i>
            <span>Detalles de la Sucursal</span>
          </div>
          <q-btn
            flat
            round
            dense
            icon="fa-solid fa-times"
            v-close-popup
            class="close-btn"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="detail-content-scroll">
        <div class="branch-detail-container">
          <!-- Left Column: Image and Basic Info -->
          <div class="detail-left-column">
            <!-- Branch Image -->
            <div class="detail-image-container">
              <img
                v-if="branchData?.image"
                :src="branchData.image"
                :alt="branchData.name"
                class="detail-image"
                @error="handleImageError"
              />
              <div v-else class="detail-image-placeholder">
                <i class="fa-solid fa-building"></i>
              </div>
            </div>

            <!-- Basic Info Card -->
            <div class="info-card">
              <h2 class="branch-detail-name">{{ branchData?.name || 'Sin nombre' }}</h2>
              
              <div class="detail-info-item">
                <i class="fa-solid fa-location-dot"></i>
                <div>
                  <div class="info-label">Ubicación</div>
                  <div class="info-value">{{ branchData?.location || 'N/A' }}</div>
                </div>
              </div>

              <div class="detail-info-item">
                <i class="fa-solid fa-map-marker-alt"></i>
                <div>
                  <div class="info-label">Dirección</div>
                  <div class="info-value">{{ branchData?.address || 'N/A' }}</div>
                </div>
              </div>

              <div class="detail-info-row">
                <div class="detail-info-item">
                  <i class="fa-solid fa-phone"></i>
                  <div>
                    <div class="info-label">Teléfono</div>
                    <div class="info-value">{{ branchData?.phone || 'N/A' }}</div>
                  </div>
                </div>

                <div class="detail-info-item">
                  <i class="fa-solid fa-envelope"></i>
                  <div>
                    <div class="info-label">Email</div>
                    <div class="info-value">{{ branchData?.email || 'N/A' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Features Card -->
            <div class="info-card">
              <div class="card-title">
                <i class="fa-solid fa-star"></i>
                <span>Características</span>
              </div>
              <div class="features-list">
                <div
                  v-for="(feature, index) in (branchData?.features || [])"
                  :key="index"
                  class="feature-item"
                >
                  <i class="fa-solid fa-check-circle"></i>
                  <span>{{ feature }}</span>
                </div>
                <div v-if="!branchData?.features || branchData.features.length === 0" class="no-data">
                  No hay características registradas
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Schedule, Services and Map -->
          <div class="detail-right-column">
            <!-- Schedule Card -->
            <div class="info-card">
              <div class="card-title">
                <i class="fa-solid fa-clock"></i>
                <span>Horario de Atención</span>
              </div>
              <div class="schedule-grid">
                <div
                  v-for="(day, key) in dayTranslations"
                  :key="key"
                  class="schedule-item"
                  :class="{ 'schedule-closed': branchData?.schedule?.[key] === 'Cerrado' }"
                >
                  <div class="schedule-day">{{ day }}</div>
                  <div class="schedule-time">{{ branchData?.schedule?.[key] || 'N/A' }}</div>
                </div>
              </div>
            </div>

            <!-- Services Card -->
            <div class="info-card">
              <div class="card-title">
                <i class="fa-solid fa-hand-holding-medical"></i>
                <span>Servicios Ofrecidos</span>
              </div>
              <div class="services-grid">
                <q-chip
                  v-for="(service, index) in (branchData?.services || [])"
                  :key="index"
                  color="primary"
                  text-color="white"
                  icon="fa-solid fa-tooth"
                  class="service-chip-large"
                >
                  {{ service }}
                </q-chip>
                <div v-if="!branchData?.services || branchData.services.length === 0" class="no-data">
                  No hay servicios registrados
                </div>
              </div>
            </div>

            <!-- Map Card -->
            <div class="info-card map-card">
              <div class="card-title">
                <i class="fa-solid fa-map"></i>
                <span>Ubicación en el Mapa</span>
              </div>
              <div class="map-container">
                <iframe
                  v-if="branchData?.mapUrl"
                  :src="branchData.mapUrl"
                  width="100%"
                  height="100%"
                  style="border:0;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
                <div v-else class="map-placeholder">
                  <i class="fa-solid fa-map-location-dot"></i>
                  <p>Mapa no disponible</p>
                </div>
              </div>
              <div v-if="branchData?.coordinates" class="coordinates-info">
                <i class="fa-solid fa-location-crosshairs"></i>
                <span>Lat: {{ branchData.coordinates.lat }}, Lng: {{ branchData.coordinates.lng }}</span>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions class="dialog-actions">
        <q-btn
          flat
          label="Cerrar"
          icon="fa-solid fa-times"
          v-close-popup
          class="secondary-btn"
          no-caps
        />
        <q-btn
          unelevated
          label="Editar Sucursal"
          icon="fa-solid fa-edit"
          @click="editBranch"
          class="primary-btn"
          color="primary"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed} from 'vue'

export default {
  name: 'DetailBranchDialog',
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
  emits: ['update:modelValue', 'edit-branch'],
  setup(props, { emit }) {
    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
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

    const handleImageError = (event) => {
      event.target.style.display = 'none'
    }

    const editBranch = () => {
      emit('edit-branch', props.branchData)
      showDialog.value = false
    }

    return {
      showDialog,
      dayTranslations,
      handleImageError,
      editBranch
    }
  }
}
</script>

<!-- Los estilos están en app.scss global -->