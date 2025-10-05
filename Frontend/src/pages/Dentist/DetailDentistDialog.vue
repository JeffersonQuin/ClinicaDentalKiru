<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="detail-dialog credential-card">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-id-card"></i>
            <span>Detalles del Dentista</span>
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

      <q-card-section class="dialog-content credential-content">
        <!-- Sección Superior: Foto y Nombre -->
        <div class="credential-header">
          <div class="credential-header-content">
            <div class="credential-text-section">
              <div class="dentist-label">DENTISTA</div>
              <h3 class="credential-full-name">{{ getFullName().toUpperCase() }}</h3>
              <div class="credential-badge-inline">
                <q-badge
                  :class="['credential-state-badge', getStateClass(dentistData?.state)]"
                  :label="formatState(dentistData?.state)"
                />
              </div>
            </div>

            <div class="credential-photo-container">
              <q-avatar
                size="140px"
                :color="dentistData?.img ? 'transparent' : getAvatarColor(dentistData?.name)"
                :text-color="dentistData?.img ? 'transparent' : 'white'"
                class="credential-avatar"
              >
                <img
                  v-if="dentistData?.img && !imageErrored"
                  :src="dentistData.img"
                  :alt="getFullName()"
                  @error="handleImageError"
                />
                <span v-else class="credential-initials">{{ getInitials() }}</span>
              </q-avatar>
            </div>
          </div>
        </div>

        <q-separator class="credential-separator" />

        <!-- Sección de Especialidades -->
        <div class="credential-section">
          <div class="credential-section-title">
            <i class="fa-solid fa-graduation-cap"></i>
            <span>Especialidades</span>
          </div>
          <div class="credential-specialties">
            <q-chip
              v-for="specId in (dentistData?.speciality || [])"
              :key="specId"
              class="specialty-chip"
              icon="fa-solid fa-check-circle"
              color="primary"
              text-color="white"
            >
              {{ getSpecialtyName(specId) }}
            </q-chip>
            <div v-if="!dentistData?.speciality || dentistData.speciality.length === 0" class="no-specialties">
              <i class="fa-solid fa-info-circle"></i>
              <span>Sin especialidades asignadas</span>
            </div>
          </div>
        </div>

        <q-separator class="credential-separator" />

        <!-- Información Personal -->
        <div class="credential-section">
          <div class="credential-section-title">
            <i class="fa-solid fa-user-circle"></i>
            <span>Información Personal</span>
          </div>
          
          <div class="credential-info-grid">
            <div class="info-item">
              <div class="info-label">Primer Nombre</div>
              <div class="info-value">{{ dentistData?.name || 'N/A' }}</div>
            </div>

            <div class="info-item" v-if="dentistData?.second_name">
              <div class="info-label">Segundo Nombre</div>
              <div class="info-value">{{ dentistData?.second_name }}</div>
            </div>

            <div class="info-item">
              <div class="info-label">Apellido Paterno</div>
              <div class="info-value">{{ dentistData?.father_last_name || 'N/A' }}</div>
            </div>

            <div class="info-item" v-if="dentistData?.mother_last_name">
              <div class="info-label">Apellido Materno</div>
              <div class="info-value">{{ dentistData?.mother_last_name }}</div>
            </div>
          </div>
        </div>

        <q-separator class="credential-separator" />

        <!-- Usuario del Sistema -->
        <div class="credential-section">
          <div class="credential-section-title">
            <i class="fa-solid fa-user-lock"></i>
            <span>Acceso al Sistema</span>
          </div>
          
          <div class="credential-system-user">
            <q-chip
              class="system-user-chip"
              icon="fa-solid fa-key"
              color="teal"
              text-color="white"
              size="md"
            >
              Usuario ID: {{ dentistData?.userId || 'No asignado' }}
            </q-chip>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions class="dialog-actions credential-actions">
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
          label="Editar Información"
          icon="fa-solid fa-edit"
          @click="editDentist"
          class="primary-btn"
          color="primary"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, ref } from 'vue'
import especialidades from 'src/data/especialidades.json'

export default {
  name: 'DetailDentistDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    dentistData: {
      type: Object,
      default: () => null
    }
  },
  emits: ['update:modelValue', 'edit-dentist'],
  setup(props, { emit }) {
    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const imageErrored = ref(false)
    const specialtiesMap = ref({})

    especialidades.especialidades.forEach(spec => {
      specialtiesMap.value[spec.id] = spec.name
    })

    const getAvatarColor = (name) => {
      if (!name) return '#9e9e9e'
      
      const colors = [
        '#f44336', '#e91e63', '#9c27b0', '#673ab7',
        '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
        '#009688', '#4caf50', '#8bc34a', '#cddc39',
        '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
      ]
      
      let hash = 0
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
      }
      
      return colors[Math.abs(hash) % colors.length]
    }

    const getFullName = () => {
      if (!props.dentistData) return ''
      return `${props.dentistData.name || ''} ${props.dentistData.second_name || ''} ${props.dentistData.father_last_name || ''} ${props.dentistData.mother_last_name || ''}`.trim()
    }

    const getInitials = () => {
      if (!props.dentistData) return '?'
      const firstName = props.dentistData.name?.charAt(0) || ''
      const lastName = props.dentistData.father_last_name?.charAt(0) || ''
      return (firstName + lastName).toUpperCase() || '?'
    }

    const getSpecialtyName = (id) => {
      return specialtiesMap.value[id] || `Especialidad ${id}`
    }

    const handleImageError = () => {
      imageErrored.value = true
    }

    const formatState = (state) => {
      const s = String(state || '').toLowerCase()
      const states = {
        active: 'Activo',
        inactive: 'Inactivo',
        pending: 'Pendiente'
      }
      return states[s] || (state ? String(state) : 'No disponible')
    }

    const getStateClass = (state) => {
      const s = String(state || '').toLowerCase()
      const classes = {
        active: 'state-active',
        inactive: 'state-inactive',
        pending: 'state-pending'
      }
      return classes[s] || 'state-default'
    }

    const editDentist = () => {
      emit('edit-dentist', props.dentistData)
      showDialog.value = false
      imageErrored.value = false
    }

    return {
      showDialog,
      imageErrored,
      formatState,
      getStateClass,
      getInitials,
      handleImageError,
      getAvatarColor,
      editDentist,
      getFullName,
      getSpecialtyName
    }
  }
}
</script>

<style scoped>
.credential-card {
  max-width: 650px;
  min-width: 550px;
}

.credential-content {
  padding: 0 !important;
}

.credential-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: 35px;
  color: white;
  position: relative;
  overflow: hidden;
}

.credential-header::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  border-radius: 50% 50% 0 0;
}

.credential-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  position: relative;
  z-index: 1;
}

.credential-text-section {
  flex: 1;
  text-align: left;
}

.clinic-name {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 8px;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dentist-label {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.9;
  margin-bottom: 8px;
}

.credential-full-name {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  line-height: 1.2;
  margin-bottom: 12px;
}

.credential-license {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.25);
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 14px;
  backdrop-filter: blur(10px);
  margin-bottom: 12px;
}

.credential-badge-inline {
  display: inline-block;
  margin-top: 8px;
}

.credential-state-badge {
  font-size: 11px;
  padding: 5px 12px;
  border-radius: 12px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.credential-photo-container {
  position: relative;
  flex-shrink: 0;
}

.credential-initials {
  font-size: 56px;
  font-weight: 700;
}

.credential-separator {
  margin: 0 !important;
}

.credential-section {
  padding: 24px 30px;
}

.credential-section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.credential-section-title i {
  color: #667eea;
  font-size: 18px;
}

.credential-specialties {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.specialty-chip {
  font-weight: 600;
  font-size: 13px;
}

.no-specialties {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #95a5a6;
  font-style: italic;
  padding: 8px 0;
}

.credential-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  background: #f8f9fa;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.info-label {
  font-size: 11px;
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

.credential-system-user {
  display: flex;
  justify-content: center;
}

.system-user-chip {
  font-weight: 600;
  font-size: 14px;
  padding: 8px 20px;
}

.credential-actions {
  padding: 16px 24px;
  background: #f8f9fa;
  justify-content: space-between;
}

.credential-actions .q-btn {
  min-width: 140px;
}
</style>