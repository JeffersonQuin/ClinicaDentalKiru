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

<style scoped>
.branch-detail-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.detail-content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 24px !important;
  background: #f5f5f5;
}

.branch-detail-container {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.detail-left-column,
.detail-right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-image-container {
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.detail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-image-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  color: rgba(255, 255, 255, 0.5);
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.branch-detail-name {
  margin: 0 0 20px 0;
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
}

.detail-info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.detail-info-item i {
  color: #667eea;
  font-size: 20px;
  margin-top: 2px;
}

.info-label {
  font-size: 12px;
  font-weight: 600;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.info-value {
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
}

.detail-info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.card-title i {
  color: #667eea;
  font-size: 20px;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 14px;
  color: #2c3e50;
}

.feature-item i {
  color: #4caf50;
  font-size: 16px;
}

.schedule-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.schedule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.schedule-item.schedule-closed {
  background: #ffebee;
  border-left-color: #f44336;
}

.schedule-day {
  font-weight: 700;
  color: #2c3e50;
  font-size: 14px;
}

.schedule-time {
  font-size: 13px;
  color: #5f6368;
  font-weight: 600;
}

.schedule-closed .schedule-time {
  color: #f44336;
}

.services-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.service-chip-large {
  font-size: 13px;
  font-weight: 600;
}

.map-card {
  flex: 1;
}

.map-container {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  background: #e0e0e0;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9e9e9e;
}

.map-placeholder i {
  font-size: 64px;
  margin-bottom: 12px;
}

.coordinates-info {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #7f8c8d;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.coordinates-info i {
  color: #667eea;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #95a5a6;
  font-style: italic;
}

@media (max-width: 1024px) {
  .branch-detail-container {
    grid-template-columns: 1fr;
  }
}
</style>