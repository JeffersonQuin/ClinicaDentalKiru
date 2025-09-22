<template>
  <q-page class="branch-page">
    <!-- Hero Section para Sucursales -->
    <section class="hero-branch q-pa-xl">
      <div class="row items-center">
        <div class="col-12 col-md-6">
          <h1 class="text-h2 text-weight-bold text-primary q-mb-md">
            Nuestras Sucursales
          </h1>
          <p class="text-h6 text-grey-7 q-mb-lg">
            Encuentra la sucursal más cercana a ti. Contamos con múltiples ubicaciones estratégicas 
            en Oruro para brindarte la mejor atención dental con la comodidad que mereces.
          </p>
          <div class="q-gutter-md">
            <q-btn 
              color="primary" 
              size="lg" 
              label="Agendar Cita" 
              icon="calendar_today"
              @click="openAppointmentDialog"
            />
            <q-btn 
              outline 
              color="primary" 
              size="lg" 
              label="Ver Mapa Completo"
              @click="openMapDialog"
            />
          </div>
        </div>
        <div class="col-12 col-md-6 text-center">
          <div class="hero-image-container">
            <q-img
              src="/icons/prueba.jpeg"
              alt="Paciente en consulta dental"
              class="hero-image"
            />
            <div class="floating-elements">
              <q-icon name="location_on" color="red" size="2em" class="floating-icon-1" />
              <q-icon name="schedule" color="blue" size="1.5em" class="floating-icon-2" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de Sucursales -->
    <section class="branches-section q-pa-xl bg-grey-1">
      <div class="text-center q-mb-xl">
        <h2 class="text-h3 text-weight-bold">Ubicaciones Disponibles</h2>
        <p class="text-h6 text-grey-7">Selecciona la sucursal que mejor se adapte a tus necesidades</p>
      </div>
      
      <div class="row q-col-gutter-lg justify-center">
        <div 
          v-for="branch in branches" 
          :key="branch.id" 
          class="col-12 col-md-6 col-lg-4"
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
              <div class="text-h6 text-weight-bold q-mb-sm branch-title">{{ branch.name }}</div>
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
            
            <q-card-actions align="right" class="branch-actions">
              <q-btn 
                flat 
                label="Ver Detalles" 
                color="primary" 
                icon-right="arrow_forward"
                class="details-btn"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="cta-section bg-primary text-white q-pa-xl text-center">
      <h2 class="text-h3 text-weight-bold q-mb-md">
        ¿No encuentras la sucursal que buscas?
      </h2>
      <p class="text-h6 q-mb-lg">
        Contáctanos y te ayudaremos a encontrar la ubicación más conveniente para ti.
      </p>
      <q-btn
        color="white"
        text-color="primary"
        size="lg"
        label="Contactar"
        icon="phone"
        to="/contact"
      />
    </section>

    <!-- Dialog para Agendar Cita -->
    <AppointmentForm 
      v-model="appointmentDialog"
      @submit="onAppointmentSubmit"
    />

    <!-- Dialog de detalle de la sucursal -->
    <q-dialog v-model="branchDialog" maximized>
      <q-card v-if="selectedBranch">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ selectedBranch.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        
        <q-card-section>
          <div class="row">
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
            
            <div class="col-12 col-md-6 q-pl-md">
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
                  <q-list dense>
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
                
                <div class="q-mb-md">
                  <h5 class="text-h6 text-weight-bold q-mb-sm">Características</h5>
                  <q-list dense>
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
                    class="q-mr-sm"
                  />
                  <q-btn 
                    color="secondary" 
                    label="Llamar" 
                    size="lg"
                    icon="phone"
                    :href="`tel:${selectedBranch.phone}`"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog del mapa completo -->
    <q-dialog v-model="mapDialog" maximized>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Mapa de Todas las Sucursales</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
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
import AppointmentForm from 'components/AppointmentForm.vue'
import sucursalesData from 'src/data/sucursales.json'

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

const onAppointmentSubmit = (formData) => {
  console.log('Cita agendada desde BranchPage:', formData)
  // Aquí iría la lógica para enviar la cita al backend
}
</script>

<style scoped>
.branch-page {
  padding-bottom: 0;
}

.hero-branch {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.hero-image-container {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.hero-image {
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  width: 100%;
  height: auto;
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-icon-1 {
  position: absolute;
  top: 20px;
  left: 20px;
  animation: float 3s ease-in-out infinite;
}

.floating-icon-2 {
  position: absolute;
  bottom: 30px;
  right: 30px;
  animation: float 3s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.branches-section {
  padding-top: 60px;
  padding-bottom: 60px;
}

.branch-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.branch-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.branch-image-container {
  position: relative;
  overflow: hidden;
}

.branch-image {
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.branch-card:hover .branch-image {
  transform: scale(1.05);
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
  transition: opacity 0.3s ease;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.branch-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.branch-title {
  font-size: 1.25rem;
  line-height: 1.3;
  color: #1A1A1A;
}

.branch-location {
  display: flex;
  align-items: center;
  color: #6B7280;
}

.branch-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  color: #6B7280;
}

.branch-services {
  margin-top: 12px;
}

.services-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.branch-actions {
  padding: 16px;
  border-top: 1px solid #E5E7EB;
}

.details-btn {
  font-weight: 600;
  transition: all 0.3s ease;
}

.details-btn:hover {
  transform: translateX(4px);
}

.cta-section {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  padding-top: 80px;
  padding-bottom: 80px;
}

/* Estilos para el modal de detalles */
.branch-detail-image {
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.branch-detail-content {
  padding: 20px 0;
}

.branch-detail-info {
  background: #F9FAFB;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.schedule-item {
  padding: 8px 0;
  border-bottom: 1px solid #E5E7EB;
}

.schedule-item:last-child {
  border-bottom: none;
}

.services-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-item {
  padding: 8px 0;
}

.branch-detail-actions {
  margin-top: 24px;
  text-align: center;
}

.map-container {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.map-iframe {
  border-radius: 8px;
}

.map-container-full {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.map-iframe-full {
  border-radius: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-branch {
    min-height: auto;
    padding-top: 40px;
    padding-bottom: 40px;
  }
  
  .hero-branch .col-md-6 {
    text-align: center;
  }
  
  .hero-branch .q-gutter-md {
    justify-content: center;
  }
  
  .hero-image-container {
    margin-top: 30px;
  }
  
  .branches-section {
    padding: 40px 20px;
  }
  
  .floating-elements {
    display: none;
  }
  
  .branch-detail-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .branch-detail-actions .q-btn {
    width: 100%;
  }
}
</style>
