<template>
  <q-page class="services-page">
    <!-- Hero Section para Servicios -->
    <section class="hero-services">
      <q-container class="q-pa-xl">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <h1 class="text-h2 text-weight-bold text-primary q-mb-md animated fadeInLeft">
              Nuestros Servicios Dentales
            </h1>
            <p class="text-h6 text-grey-7 q-mb-lg animated fadeInLeft" style="animation-delay: 0.2s">
              Ofrecemos una amplia gama de tratamientos para cuidar tu salud bucal y embellecer tu sonrisa. 
              Nuestro equipo de profesionales especializados utiliza tecnología de vanguardia para brindarte 
              la mejor atención dental.
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
                label="Contáctanos"
                to="/contact"
                no-caps
                class="secondary-btn"
              />
            </div>
          </div>
          
          <div class="col-12 col-md-6 text-center">
            <div class="hero-image-container animated zoomIn" style="animation-delay: 0.3s">
              <q-img
                src="/KiruIMG/services.png"
                alt="Paciente sonriendo en consulta dental"
                class="hero-image"
                fit="contain"
              />
              <div class="floating-elements">
                <q-icon name="favorite" color="red" size="2em" class="floating-icon-1" />
                <q-icon name="star" color="amber" size="1.5em" class="floating-icon-2" />
              </div>
            </div>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Sección de Servicios -->
    <section class="services-grid-section q-pa-xl">
      <q-container>
        <div class="text-center q-mb-xl animated fadeIn">
          <h2 class="text-h3 text-weight-bold">Explora Nuestros Tratamientos</h2>
          <p class="text-h6 text-grey-7">Encuentra el servicio dental que necesitas para mantener una sonrisa perfecta</p>
        </div>
        
        <div class="row q-col-gutter-lg">
          <div 
            v-for="(service, index) in services" 
            :key="service.id" 
            class="col-12 col-sm-6 col-md-4 animated fadeInUp"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <q-card class="service-card" flat bordered @click="openServiceDetail(service)">
              <div class="service-image-container">
                <q-img :src="service.image" :alt="service.title" class="service-image" />
                <div class="service-overlay">
                  <q-icon :name="service.icon" color="white" size="2em" />
                </div>
                <div class="service-category">
                  <q-chip 
                    :color="service.categoryColor" 
                    text-color="white" 
                    size="sm"
                    class="category-chip"
                  >
                    {{ service.category }}
                  </q-chip>
                </div>
              </div>
              
              <q-card-section class="service-content">
                <div class="text-h6 text-weight-bold q-mb-sm service-title">
                  {{ service.title }}
                </div>
                <p class="text-grey-7 service-description">
                  {{ service.description }}
                </p>
                
                <div class="service-info q-mb-md">
                  <div class="info-item">
                    <q-icon name="schedule" size="16px" class="q-mr-xs" color="primary" />
                    <span class="text-caption">{{ service.duration }}</span>
                  </div>
                  <div class="info-item">
                    <q-icon name="attach_money" size="16px" class="q-mr-xs" color="primary" />
                    <span class="text-caption">{{ service.price }}</span>
                  </div>
                </div>
              </q-card-section>
              
              <q-separator />
              
              <q-card-actions align="right" class="service-actions">
                <q-btn 
                  flat 
                  label="Más Detalles" 
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
          ¿Listo para transformar tu sonrisa?
        </h2>
        <p class="text-h6 q-mb-lg text-white">
          Agenda una consulta hoy mismo y déjanos cuidar de tu salud dental con la mejor tecnología y profesionalismo.
        </p>
        <q-btn
          color="white"
          text-color="primary"
          size="lg"
          label="Agendar Cita"
          icon="calendar_today"
          @click="openAppointmentDialog"
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

    <!-- Dialog de detalle del servicio -->
    <q-dialog v-model="serviceDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card v-if="selectedService" class="dialog-container">
        <q-card-section class="dialog-header">
          <div class="row items-center">
            <div class="col">
              <div class="text-h6">{{ selectedService.title }}</div>
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
                :src="selectedService.image"
                :alt="selectedService.title"
                class="service-detail-image"
              />
            </div>
            
            <div class="col-12 col-md-6">
              <div class="service-detail-content">
                <div class="text-h5 text-weight-bold q-mb-md">
                  {{ selectedService.title }}
                </div>
                
                <div class="service-detail-info q-mb-md">
                  <div class="detail-row">
                    <q-icon name="schedule" color="primary" size="20px" class="q-mr-sm" />
                    <span class="text-weight-bold">Duración:</span>
                    <span class="q-ml-sm">{{ selectedService.duration }}</span>
                  </div>
                  
                  <div class="detail-row">
                    <q-icon name="attach_money" color="primary" size="20px" class="q-mr-sm" />
                    <span class="text-weight-bold">Precio:</span>
                    <span class="q-ml-sm">{{ selectedService.price }}</span>
                  </div>
                  
                  <div class="detail-row">
                    <q-icon name="category" color="primary" size="20px" class="q-mr-sm" />
                    <span class="text-weight-bold">Categoría:</span>
                    <q-chip 
                      :color="selectedService.categoryColor" 
                      text-color="white" 
                      size="sm"
                      class="q-ml-sm"
                    >
                      {{ selectedService.category }}
                    </q-chip>
                  </div>
                </div>
                
                <p class="text-body1 q-mb-md">
                  {{ selectedService.description }}
                </p>
                
                <div class="q-mb-md" v-if="selectedService.features">
                  <h5 class="text-h6 text-weight-bold q-mb-sm">Características del Tratamiento</h5>
                  <q-list dense bordered class="rounded-borders">
                    <q-item 
                      v-for="(feature, index) in selectedService.features" 
                      :key="index"
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
                
                <div class="service-detail-actions">
                  <q-btn 
                    color="primary" 
                    label="Agendar Cita" 
                    size="lg"
                    icon="calendar_today"
                    @click="openAppointmentDialog"
                    push
                    no-caps
                    class="full-width"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import AppointmentModal from 'components/AppointmentModal.vue'
import serviciosData from 'src/data/servicios.json'

const $q = useQuasar()

// Datos reactivos
const appointmentDialog = ref(false)
const serviceDialog = ref(false)
const selectedService = ref(null)
const services = ref([])

// Cargar datos de servicios al montar el componente
onMounted(() => {
  services.value = serviciosData.servicios
})

// Métodos
const openAppointmentDialog = () => {
  appointmentDialog.value = true
}

const openServiceDetail = (service) => {
  selectedService.value = service
  serviceDialog.value = true
}

// Funciones para manejar eventos del modal de citas
const onNewAppointment = () => {
  $q.notify({
    type: 'info',
    message: 'Abriendo formulario de nueva cita...',
    icon: 'calendar_today'
  })
}

const onHistory = () => {
  $q.notify({
    type: 'info',
    message: 'Abriendo historial de citas...',
    icon: 'history'
  })
}

const onAppointmentCancel = () => {
  console.log('Cancelar modal de citas')
}
</script>

<style lang="scss" scoped>
.services-page {
  padding-bottom: 0;
}

.hero-services {
  background: linear-gradient(135deg, #e0f7fa 0%, #c2e0e8 100%);
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.body--dark .hero-services {
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

.services-grid-section {
  padding-top: 80px;
  padding-bottom: 80px;
}

.service-card {
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

.service-image-container {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.service-image {
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.service-card:hover .service-image {
  transform: scale(1.1);
}

.service-overlay {
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

.service-card:hover .service-overlay {
  opacity: 1;
}

.service-category {
  position: absolute;
  top: 12px;
  right: 12px;
}

.category-chip {
  font-weight: 600;
  box-shadow: var(--shadow-md);
}

.service-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
}

.service-title {
  font-size: 1.25rem;
  line-height: 1.3;
  color: var(--text-primary);
}

.service-description {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-secondary);
  flex-grow: 1;
  margin-bottom: var(--spacing-md);
}

.service-info {
  display: flex;
  gap: var(--spacing-md);
  margin-top: auto;
}

.info-item {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
}

.service-actions {
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

// Modal de detalles
.service-detail-image {
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
}

.service-detail-content {
  padding: var(--spacing-md) 0;
}

.service-detail-info {
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

.feature-item {
  padding: var(--spacing-sm) 0;
}

.service-detail-actions {
  margin-top: var(--spacing-xl);
}

// Responsive
@media (max-width: 768px) {
  .hero-services {
    min-height: auto;
    padding: 40px 20px;
  }
  
  .services-grid-section {
    padding: 40px 20px;
  }
  
  .service-info {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .floating-elements {
    display: none;
  }
}
</style>