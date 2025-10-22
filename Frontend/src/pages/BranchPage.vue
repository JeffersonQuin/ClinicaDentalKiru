<template>
  <q-page class="branch-page">
    <!-- Hero Section para Sucursales -->
    <section class="hero-branch">
      <q-container class="q-pa-xl">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <h1 class="text-h2 text-weight-bold text-primary q-mb-md animated fadeInLeft">
              Nuestras Sucursales
            </h1>
            <p class="text-h6 text-grey-7 q-mb-lg animated fadeInLeft" style="animation-delay: 0.2s">
              Encuentra la sucursal más cercana a ti. Contamos con múltiples ubicaciones estratégicas 
              en Oruro para brindarte la mejor atención dental con la comodidad que mereces.
            </p>
            <div class="q-gutter-md animated fadeInUp" style="animation-delay: 0.4s">
              <q-btn 
                color="primary" 
                size="lg" 
                label="Agendar Cita" 
                icon="calendar_today"
                @click="openAppointmentDialog"
                push
                no-caps
                class="primary-btn"
              />
              <q-btn 
                outline 
                color="primary" 
                size="lg" 
                label="Ver Mapa Completo"
                @click="openMapDialog"
                no-caps
                class="secondary-btn"
              />
            </div>
          </div>
          
          <div class="col-12 col-md-6 text-center">
            <div class="hero-image-container animated zoomIn" style="animation-delay: 0.3s">
              <q-img
                src="/KiruIMG/sucursales.png"
                alt="Sucursales KIRU"
                class="hero-image"
                fit="contain"
              />
              <div class="floating-elements">
                <q-icon name="location_on" color="red" size="2em" class="floating-icon-1" />
                <q-icon name="schedule" color="blue" size="1.5em" class="floating-icon-2" />
              </div>
            </div>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Sección de Sucursales -->
    <section class="branches-section q-pa-xl">
      <q-container>
        <div class="text-center q-mb-xl animated fadeIn">
          <h2 class="text-h3 text-weight-bold">Ubicaciones Disponibles</h2>
          <p class="text-h6 text-grey-7">Selecciona la sucursal que mejor se adapte a tus necesidades</p>
        </div>
        
        <div class="row q-col-gutter-lg">
          <div 
            v-for="(branch, index) in branches" 
            :key="branch.id" 
            class="col-12 col-sm-6 col-lg-4 animated fadeInUp"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <q-card class="branch-card" flat bordered @click="openBranchDetail(branch)">
              <div class="branch-image-container">
                <q-img :src="branch.image" :alt="branch.name" class="branch-image" />
                <div class="branch-overlay">
                  <q-icon name="visibility" color="white" size="2em" />
                </div>
                <div class="branch-status">
                  <q-chip 
                    color="green" 
                    text-color="white" 
                    size="sm"
                    class="status-chip"
                  >
                    Abierto
                  </q-chip>
                </div>
              </div>
              
              <q-card-section class="branch-content">
                <div class="text-h6 text-weight-bold q-mb-sm branch-title">
                  {{ branch.name }}
                </div>
                <div class="branch-location q-mb-md">
                  <q-icon name="location_on" color="primary" size="16px" class="q-mr-xs" />
                  <span class="text-grey-7">{{ branch.location }}</span>
                </div>
                
                <div class="branch-info q-mb-md">
                  <div class="info-item">
                    <q-icon name="phone" color="primary" size="16px" class="q-mr-xs" />
                    <span class="text-caption">{{ branch.phone }}</span>
                  </div>
                  <div class="info-item">
                    <q-icon name="email" color="primary" size="16px" class="q-mr-xs" />
                    <span class="text-caption">{{ branch.email }}</span>
                  </div>
                </div>
                
                <div class="branch-services q-mb-md">
                  <div class="text-caption text-weight-bold q-mb-xs">Servicios disponibles:</div>
                  <div class="services-tags">
                    <q-chip 
                      v-for="service in branch.services.slice(0, 3)" 
                      :key="service"
                      color="blue" 
                      text-color="white" 
                      size="xs"
                      class="q-mr-xs q-mb-xs"
                    >
                      {{ service }}
                    </q-chip>
                    <q-chip 
                      v-if="branch.services.length > 3"
                      color="grey" 
                      text-color="white" 
                      size="xs"
                      class="q-mr-xs q-mb-xs"
                    >
                      +{{ branch.services.length - 3 }} más
                    </q-chip>
                  </div>
                </div>
              </q-card-section>
              
              <q-separator />
              
              <q-card-actions align="right" class="branch-actions">
                <q-btn 
                  flat 
                  label="Ver Detalles" 
                  color="primary" 
                  icon-right="arrow_forward"
                  no-caps
                  class="details-btn"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Call to Action Section -->
    <section class="cta-section q-pa-xl text-center">
      <q-container class="animated fadeIn">
        <h2 class="text-h3 text-weight-bold q-mb-md text-white">
          ¿No encuentras la sucursal que buscas?
        </h2>
        <p class="text-h6 q-mb-lg text-white">
          Contáctanos y te ayudaremos a encontrar la ubicación más conveniente para ti.
        </p>
        <q-btn
          color="white"
          text-color="primary"
          size="lg"
          label="Contactar"
          icon="phone"
          to="/contact"
          push
          no-caps
        />
      </q-container>
    </section>

    <!-- Modal para Agendar Cita -->
    <AppointmentModal 
      v-model="appointmentDialog"
      @new-appointment="onNewAppointment"
      @history="onHistory"
      @cancel="onAppointmentCancel"
    />

    <!-- Dialog de detalle de la sucursal -->
    <q-dialog v-model="branchDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card v-if="selectedBranch">
        <q-card-section class="dialog-header">
          <div class="row items-center">
            <div class="col">
              <div class="text-h6">{{ selectedBranch.name }}</div>
            </div>
            <div class="col-auto">
              <q-btn icon="close" flat round dense v-close-popup color="white" />
            </div>
          </div>
        </q-card-section>
        
        <q-card-section class="dialog-content">
          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-6">
              <q-img
                :src="selectedBranch.image"
                :alt="selectedBranch.name"
                class="branch-detail-image"
              />
              
              <!-- Mapa embebido -->
              <div class="q-mt-md">
                <h5 class="text-h6 text-weight-bold q-mb-sm">Ubicación</h5>
                <div class="map-container">
                  <iframe
                    :src="selectedBranch.mapUrl"
                    width="100%"
                    height="300"
                    style="border:0;"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    class="map-iframe"
                  ></iframe>
                </div>
              </div>
            </div>
            
            <div class="col-12 col-md-6">
              <div class="branch-detail-content">
                <div class="text-h5 text-weight-bold q-mb-md">
                  {{ selectedBranch.name }}
                </div>
                
                <div class="branch-detail-info q-mb-md">
                  <div class="detail-row">
                    <q-icon name="location_on" color="primary" size="20px" class="q-mr-sm" />
                    <span class="text-weight-bold">Dirección:</span>
                    <span class="q-ml-sm">{{ selectedBranch.address }}</span>
                  </div>
                  
                  <div class="detail-row">
                    <q-icon name="phone" color="primary" size="20px" class="q-mr-sm" />
                    <span class="text-weight-bold">Teléfono:</span>
                    <span class="q-ml-sm">{{ selectedBranch.phone }}</span>
                  </div>
                  
                  <div class="detail-row">
                    <q-icon name="email" color="primary" size="20px" class="q-mr-sm" />
                    <span class="text-weight-bold">Email:</span>
                    <span class="q-ml-sm">{{ selectedBranch.email }}</span>
                  </div>
                </div>
                
                <div class="q-mb-md">
                  <h5 class="text-h6 text-weight-bold q-mb-sm">Horarios de Atención</h5>
                  <q-list dense bordered separator class="rounded-borders">
                    <q-item 
                      v-for="(time, day) in selectedBranch.schedule" 
                      :key="day"
                      class="schedule-item"
                    >
                      <q-item-section>
                        <q-item-label class="text-weight-bold">{{ getDayName(day) }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label>{{ time }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                
                <div class="q-mb-md">
                  <h5 class="text-h6 text-weight-bold q-mb-sm">Servicios Disponibles</h5>
                  <div class="services-grid">
                    <q-chip 
                      v-for="service in selectedBranch.services" 
                      :key="service"
                      color="blue" 
                      text-color="white" 
                      size="md"
                      class="q-mr-sm q-mb-sm"
                    >
                      {{ service }}
                    </q-chip>
                  </div>
                </div>
                
                <div class="q-mb-md" v-if="selectedBranch.features">
                  <h5 class="text-h6 text-weight-bold q-mb-sm">Características</h5>
                  <q-list dense bordered class="rounded-borders">
                    <q-item 
                      v-for="feature in selectedBranch.features" 
                      :key="feature"
                      class="feature-item"
                    >
                      <q-item-section avatar>
                        <q-icon name="check_circle" color="green" size="20px" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ feature }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                
                <div class="branch-detail-actions">
                  <q-btn 
                    color="primary" 
                    label="Agendar Cita" 
                    size="lg"
                    icon="calendar_today"
                    @click="openAppointmentDialog"
                    push
                    no-caps
                    class="q-mr-sm"
                  />
                  <q-btn 
                    color="secondary" 
                    label="Llamar" 
                    size="lg"
                    icon="phone"
                    :href="`tel:${selectedBranch.phone}`"
                    push
                    no-caps
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog del mapa completo -->
    <q-dialog v-model="mapDialog" maximized transition-show="scale" transition-hide="scale">
      <q-card>
        <q-card-section class="row items-center q-pb-none bg-primary text-white">
          <div class="text-h6">Mapa de Todas las Sucursales</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="white" />
        </q-card-section>
        
        <q-card-section>
          <div class="map-container-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.123456789!2d-67.1101!3d-17.9758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDU4JzMzLjAiUyA2N8KwMDYnMzYuNCJX!5e0!3m2!1ses!2sbo!4v1234567890"
              width="100%"
              height="600"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              class="map-iframe-full"
            ></iframe>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNotifications } from 'src/composables/useNotifications'
import AppointmentModal from 'components/AppointmentModal.vue'
import sucursalesData from 'src/data/sucursales.json'

const { notifyInfo } = useNotifications()

// Datos reactivos
const appointmentDialog = ref(false)
const branchDialog = ref(false)
const mapDialog = ref(false)
const selectedBranch = ref(null)
const branches = ref([])

// Cargar datos de sucursales al montar el componente
onMounted(() => {
  branches.value = sucursalesData.sucursales
})

// Métodos
const openAppointmentDialog = () => {
  appointmentDialog.value = true
}

const openBranchDetail = (branch) => {
  selectedBranch.value = branch
  branchDialog.value = true
}

const openMapDialog = () => {
  mapDialog.value = true
}

const getDayName = (day) => {
  const days = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
  }
  return days[day] || day
}

// Funciones para manejar eventos del modal de citas
const onNewAppointment = () => {
  notifyInfo('Abriendo formulario de nueva cita...')
}

const onHistory = () => {
  notifyInfo('Abriendo historial de citas...')
}

const onAppointmentCancel = () => {
  console.log('Cancelar modal de citas')
}
</script>

<style lang="scss" scoped>
.branch-page {
  padding-bottom: 0;
}

.hero-branch {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.body--dark .hero-branch {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.hero-image-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-icon-1,
.floating-icon-2 {
  position: absolute;
  animation: float 3s ease-in-out infinite;
}

.floating-icon-1 {
  top: 20px;
  left: 20px;
}

.floating-icon-2 {
  bottom: 30px;
  right: 30px;
  animation-direction: reverse;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.branches-section {
  padding-top: 80px;
  padding-bottom: 80px;
}

.branch-card {
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all var(--transition-normal);
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary-orange);
  }
}

.branch-image-container {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.branch-image {
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.branch-card:hover .branch-image {
  transform: scale(1.1);
}

.branch-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.branch-card:hover .branch-overlay {
  opacity: 1;
}

.branch-status {
  position: absolute;
  top: 12px;
  right: 12px;
}

.status-chip {
  font-weight: 600;
  box-shadow: var(--shadow-md);
}

.branch-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
}

.branch-title {
  font-size: 1.25rem;
  line-height: 1.3;
  color: var(--text-primary);
}

.branch-location {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
}

.branch-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.info-item {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
}

.branch-services {
  margin-top: auto;
}

.services-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.branch-actions {
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--border-light);
}

.details-btn {
  font-weight: 600;
  transition: all var(--transition-fast);
  
  &:hover {
    transform: translateX(4px);
  }
}

.cta-section {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  padding-top: 80px;
  padding-bottom: 80px;
}

/* Estilos para el modal de detalles */
.branch-detail-image {
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.branch-detail-content {
  padding: var(--spacing-lg) 0;
}

.branch-detail-info {
  background: var(--bg-secondary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
}

.detail-row {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  
  &:last-child {
    margin-bottom: 0;
  }
}

.schedule-item {
  padding: var(--spacing-sm) 0;
}

.services-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.feature-item {
  padding: var(--spacing-sm) 0;
}

.branch-detail-actions {
  margin-top: var(--spacing-xl);
  display: flex;
  gap: var(--spacing-sm);
}

.map-container,
.map-container-full {
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.map-iframe,
.map-iframe-full {
  border-radius: var(--radius-md);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-branch {
    min-height: auto;
    padding: 40px 20px;
  }
  
  .branches-section {
    padding: 40px 20px;
  }
  
  .floating-elements {
    display: none;
  }
  
  .branch-detail-actions {
    flex-direction: column;
    
    .q-btn {
      width: 100%;
    }
  }
}
</style>