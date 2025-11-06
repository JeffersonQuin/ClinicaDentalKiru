<template>
  <q-dialog v-model="showDialog" persistent maximized>
    <q-card class="branch-detail-card">

      <!-- 🟦 ENCABEZADO -->
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

      <!-- 🟩 CONTENIDO PRINCIPAL -->
      <q-card-section class="detail-content-scroll">
        <div class="branch-detail-container">

          <!-- 🧩 COLUMNA IZQUIERDA -->
          <div class="detail-left-column">

            <!-- 📷 Imagen de la Sucursal -->
            <div class="detail-image-container">
              <img
                v-if="branchData?.imagen"
                :src="branchData.imagen"
                :alt="branchData.nombre"
                class="detail-image"
                @error="handleImageError"
              />
              <div v-else class="detail-image-placeholder">
                <i class="fa-solid fa-building"></i>
              </div>
            </div>

            <!-- 🏢 Información General -->
            <div class="info-card">
              <h2 class="branch-detail-name">
                {{ branchData?.nombre || 'Sin nombre' }}
              </h2>

              <!-- Ubicación -->
              <div class="detail-info-item">
                <i class="fa-solid fa-location-dot"></i>
                <div>
                  <div class="info-label">Ubicación</div>
                  <div class="info-value">
                    {{ branchData?.ubicacion || 'N/A' }}
                  </div>
                </div>
              </div>

              <!-- Dirección -->
              <div class="detail-info-item">
                <i class="fa-solid fa-map-marker-alt"></i>
                <div>
                  <div class="info-label">Dirección</div>
                  <div class="info-value">
                    {{ branchData?.direccion || 'N/A' }}
                  </div>
                </div>
              </div>

              <!-- Descripción -->
              <div class="detail-info-item">
                <i class="fa-solid fa-circle-info"></i>
                <div>
                  <div class="info-label">Descripción</div>
                  <div class="info-value text-justify">
                    {{ branchData?.descripcion || 'Sin descripción' }}
                  </div>
                </div>
              </div>

              <!-- Estado -->
              <div class="detail-info-item">
                <i class="fa-solid fa-toggle-on"></i>
                <div>
                  <div class="info-label">Estado</div>
                  <div class="info-value">
                    <q-chip
                      :color="branchData?.activo ? 'green' : 'red'"
                      text-color="white"
                      dense
                    >
                      {{ branchData?.activo ? 'Activo' : 'Inactivo' }}
                    </q-chip>
                  </div>
                </div>
              </div>
            </div>

            <!-- 📍 Coordenadas -->
            <div class="info-card">
              <div class="card-title">
                <i class="fa-solid fa-location-crosshairs"></i>
                <span>Coordenadas</span>
              </div>

              <div class="detail-info-item">
                <div class="info-label">Latitud</div>
                <div class="info-value">
                  {{ branchData?.latitud || 'N/A' }}
                </div>
              </div>

              <div class="detail-info-item">
                <div class="info-label">Longitud</div>
                <div class="info-value">
                  {{ branchData?.longitud || 'N/A' }}
                </div>
              </div>
            </div>
          </div>

          <!-- 🧭 COLUMNA DERECHA -->
          <div class="detail-right-column">
            <!-- 🗺️ Mapa -->
            <div class="info-card map-card">
              <div class="card-title">
                <i class="fa-solid fa-map"></i>
                <span>Ubicación en el Mapa</span>
              </div>

              <div class="map-container">
                <iframe
                  v-if="branchData?.latitud && branchData?.longitud"
                  :src="`https://www.google.com/maps?q=${branchData.latitud},${branchData.longitud}&hl=es&z=15&output=embed`"
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
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- 🟨 ACCIONES -->
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
import { computed } from 'vue'

export default {
  name: 'DetailBranchDialog',
  props: {
    modelValue: Boolean,
    branchData: Object
  },
  emits: ['update:modelValue', 'edit-branch', 'close'],
  setup(props, { emit }) {
    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const handleImageError = (event) => {
      event.target.style.display = 'none'
    }

    const editBranch = () => {
      emit('edit-branch', props.branchData)
    }

    const closeDialog = () => {
      emit('close')
    }

    return {
      showDialog,
      handleImageError,
      editBranch,
      closeDialog
    }
  }
}
</script>