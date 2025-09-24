<template>
  <q-page class="services-page">
    <!-- Hero Section para Servicios -->
    <section class="hero-services q-pa-xl">
      <div class="row items-center">
        <div class="col-12 col-md-6">
          <h1 class="text-h2 text-weight-bold text-primary q-mb-md">
            Nuestros Servicios Dentales
          </h1>
          <p class="text-h6 text-grey-7 text-justify q-mb-lg">
            Ofrecemos una amplia gama de tratamientos para cuidar tu salud bucal y embellecer tu sonrisa. 
            Nuestro equipo de profesionales especializados utiliza tecnología de vanguardia para brindarte 
            la mejor atención dental.
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
              label="Contáctanos"
              to="/contact"
            />
          </div>
        </div>
        <div class="col-12 col-md-6 text-center">
          <div class="hero-image-container">
            <q-img
              src="/KiruIMG/services.png"
              alt="Paciente sonriendo en consulta dental"
              class="hero-image"
            />
            <div class="floating-elements">
              <q-icon name="favorite" color="red" size="2em" class="floating-icon-1" />
              <q-icon name="star" color="amber" size="1.5em" class="floating-icon-2" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de Servicios -->
    <section class="services-grid-section q-pa-xl bg-grey-1">
      <div class="text-center q-mb-xl">
        <h2 class="text-h3 text-weight-bold">Explora Nuestros Tratamientos</h2>
        <p class="text-h6 text-grey-7">Encuentra el servicio dental que necesitas para mantener una sonrisa perfecta</p>
      </div>
      
      <div class="row q-col-gutter-lg justify-center">
        <div 
          v-for="service in services" 
          :key="service.id" 
          class="col-12 col-sm-6 col-md-4"
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
              <div class="text-h6 text-weight-bold q-mb-sm service-title">{{ service.title }}</div>
              <p class="text-grey-7 service-description">{{ service.description }}</p>
              
              <div class="service-info q-mb-md">
                <div class="info-item">
                  <q-icon name="schedule" size="16px" class="q-mr-xs" />
                  <span class="text-caption">{{ service.duration }}</span>
                </div>
                <div class="info-item">
                  <q-icon name="attach_money" size="16px" class="q-mr-xs" />
                  <span class="text-caption">{{ service.price }}</span>
                </div>
              </div>
            </q-card-section>
            
            <q-card-actions align="right" class="service-actions">
              <q-btn 
                flat 
                label="Más Detalles" 
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
        ¿Listo para transformar tu sonrisa?
      </h2>
      <p class="text-h6 q-mb-lg">
        Agenda una consulta hoy mismo y déjanos cuidar de tu salud dental con la mejor tecnología y profesionalismo.
      </p>
      <q-btn
        color="white"
        text-color="primary"
        size="lg"
        label="Agendar Cita"
        icon="calendar_today"
        @click="openAppointmentDialog"
      />
    </section>

    <!-- Dialog para Agendar Cita -->
    <AppointmentForm 
      v-model="appointmentDialog"
      @submit="onAppointmentSubmit"
    />

    <!-- Dialog de detalle del servicio -->
    <q-dialog v-model="serviceDialog" maximized>
      <q-card v-if="selectedService">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ selectedService.title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        
        <q-card-section>
          <div class="row">
            <div class="col-12 col-md-6">
              <q-img
                :src="selectedService.image"
                :alt="selectedService.title"
                class="service-detail-image"
              />
            </div>
            <div class="col-12 col-md-6 q-pl-md">
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
                
                <div class="q-mb-md">
                  <h5 class="text-h6 text-weight-bold q-mb-sm">Características del Tratamiento</h5>
                  <q-list dense>
                    <q-item 
                      v-for="feature in selectedService.features" 
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
                
                <div class="service-detail-actions">
                  <q-btn 
                    color="primary" 
                    label="Agendar Cita" 
                    size="lg"
                    icon="calendar_today"
                    @click="openAppointmentDialog"
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
import AppointmentForm from 'components/AppointmentForm.vue'
import serviciosData from 'src/data/servicios.json'

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

const onAppointmentSubmit = (formData) => {
  console.log('Cita agendada desde ServicesPage:', formData)
  // Aquí iría la lógica para enviar la cita al backend
}
</script>

<style scoped>
.services-page {
  padding-bottom: 0;
}

.hero-services {
  background: linear-gradient(135deg, #e0f7fa 0%, #c2e0e8 100%);
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

.services-grid-section {
  padding-top: 60px;
  padding-bottom: 60px;
}

.service-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.service-image-container {
  position: relative;
  overflow: hidden;
}

.service-image {
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.service-card:hover .service-image {
  transform: scale(1.05);
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
  transition: opacity 0.3s ease;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.service-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.service-title {
  font-size: 1.25rem;
  line-height: 1.3;
  color: #1A1A1A;
}

.service-description {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #6B7280;
  flex-grow: 1;
}

.service-info {
  display: flex;
  gap: 16px;
  margin-top: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  color: #6B7280;
}

.service-actions {
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
.service-detail-image {
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.service-detail-content {
  padding: 20px 0;
}

.service-detail-info {
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

.feature-item {
  padding: 8px 0;
}

.service-detail-actions {
  margin-top: 24px;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-services {
    min-height: auto;
    padding-top: 40px;
    padding-bottom: 40px;
  }
  
  .hero-services .col-md-6 {
    text-align: center;
  }
  
  .hero-services .q-gutter-md {
    justify-content: center;
  }
  
  .hero-image-container {
    margin-top: 30px;
  }
  
  .services-grid-section {
    padding: 40px 20px;
  }
  
  .service-info {
    flex-direction: column;
    gap: 8px;
  }
  
  .floating-elements {
    display: none;
  }
}
</style>
