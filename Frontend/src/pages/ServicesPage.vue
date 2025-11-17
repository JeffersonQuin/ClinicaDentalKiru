<template>
  <q-page class="serv-services-page">
    <!-- Hero Section para Servicios -->
    <section class="serv-hero-section">
      <div class="serv-hero-background">
        <div class="serv-hero-shape serv-hero-shape-1"></div>
        <div class="serv-hero-shape serv-hero-shape-2"></div>
        <div class="serv-hero-shape serv-hero-shape-3"></div>
      </div>
      
      <q-container class="q-pa-xl">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <div class="serv-hero-badge animated fadeInDown">
              <q-icon name="medical_services" size="20px" />
              <span>Servicios Profesionales</span>
            </div>
            
            <h1 class="serv-hero-title animated fadeInLeft">
              Nuestros Servicios 
              <span class="serv-hero-highlight">Dentales</span>
            </h1>
            
            <p class="serv-hero-subtitle animated fadeInLeft" style="animation-delay: 0.2s">
              Ofrecemos una amplia gama de tratamientos para cuidar tu salud bucal y embellecer tu sonrisa. 
              Nuestro equipo de profesionales especializados utiliza tecnología de vanguardia para brindarte 
              la mejor atención dental.
            </p>
            
            <div class="serv-hero-features animated fadeInUp" style="animation-delay: 0.3s">
              <div class="serv-feature-item">
                <q-icon name="verified" color="primary" size="24px" />
                <span>Profesionales certificados</span>
              </div>
              <div class="serv-feature-item">
                <q-icon name="science" color="primary" size="24px" />
                <span>Tecnología avanzada</span>
              </div>
              <div class="serv-feature-item">
                <q-icon name="emoji_emotions" color="primary" size="24px" />
                <span>Resultados excepcionales</span>
              </div>
            </div>
            
            <div class="serv-hero-actions animated fadeInUp" style="animation-delay: 0.4s">
              <q-btn 
                color="primary" 
                size="lg" 
                label="Agendar Cita" 
                icon="calendar_today"
                @click="openAppointmentDialog"
                unelevated
                no-caps
                class="serv-primary-btn"
              />
              <q-btn 
                flat
                color="primary" 
                size="lg" 
                label="Contáctanos"
                to="/contact"
                no-caps
                class="serv-secondary-btn"
              >
                <q-icon name="arrow_forward" size="20px" class="q-ml-sm" />
              </q-btn>
            </div>
          </div>
          
          <div class="col-12 col-md-6">
            <div class="serv-hero-image-wrapper animated zoomIn" style="animation-delay: 0.3s">
              <div class="serv-hero-glow"></div>
              <div class="serv-hero-image-container">
                <q-img
                  src="/KiruIMG/services.png"
                  alt="Paciente sonriendo en consulta dental"
                  class="serv-hero-image"
                  fit="contain"
                />
              </div>
              
              <div class="serv-floating-elements">
                <div class="serv-floating-card serv-floating-card-1">
                  <q-icon name="favorite" color="red" size="24px" />
                  <div class="serv-floating-text">
                    <strong>100%</strong>
                    <span>Satisfacción</span>
                  </div>
                </div>
                
                <div class="serv-floating-card serv-floating-card-2">
                  <q-icon name="star" color="amber" size="24px" />
                  <div class="serv-floating-text">
                    <strong>20+</strong>
                    <span>Servicios</span>
                  </div>
                </div>
                
                <div class="serv-floating-card serv-floating-card-3">
                  <q-icon name="workspace_premium" color="primary" size="24px" />
                  <div class="serv-floating-text">
                    <strong>Premium</strong>
                    <span>Calidad</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Sección de Servicios -->
    <section class="serv-services-grid-section">
      <div class="serv-services-background">
        <div class="serv-wave serv-wave-top"></div>
      </div>
      
      <q-container>
        <div class="serv-section-header animated fadeIn">
          <div class="serv-section-badge">
            <q-icon name="local_hospital" size="20px" />
            <span>Tratamientos Disponibles</span>
          </div>
          <h2 class="serv-section-title">Explora Nuestros Tratamientos</h2>
          <p class="serv-section-subtitle">Encuentra el servicio dental que necesitas para mantener una sonrisa perfecta</p>
          <div class="serv-title-decoration">
            <div class="serv-title-line"></div>
            <q-icon name="auto_awesome" color="primary" size="32px" />
            <div class="serv-title-line"></div>
          </div>
        </div>
        
        <div class="row q-col-gutter-lg">
          <div 
            v-for="(service, index) in services" 
            :key="service.id" 
            class="col-12 col-sm-6 col-md-4 animated fadeInUp"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <q-card class="serv-service-card" @click="openServiceDetail(service)">
              <div class="serv-service-image-wrapper">
                <div class="serv-service-gradient"></div>
                <q-img 
                  :src="service.image" 
                  :alt="service.title" 
                  class="serv-service-image"
                  ratio="1"
                />
                <div class="serv-service-overlay">
                  <div class="serv-service-overlay-content">
                    <div class="serv-overlay-icon-wrapper">
                      <q-icon :name="service.icon" color="white" size="32px" />
                    </div>
                    <p class="serv-overlay-text">Ver detalles completos</p>
                  </div>
                </div>
                <div class="serv-service-badge">
                  <q-chip 
                    :color="service.categoryColor" 
                    text-color="white" 
                    size="md"
                    icon="label"
                    class="serv-category-chip"
                  >
                    {{ service.category }}
                  </q-chip>
                </div>
              </div>
              
              <q-card-section class="serv-service-content">
                <div class="serv-service-title">
                  {{ service.title }}
                </div>
                
                <div class="serv-service-description">
                  <p>{{ service.description }}</p>
                </div>
                
                <div class="serv-service-info">
                  <div class="serv-info-item">
                    <q-icon name="schedule" size="18px" />
                    <span>{{ service.duration }}</span>
                  </div>
                  <div class="serv-info-item">
                    <q-icon name="attach_money" size="18px" />
                    <span>{{ service.price }}</span>
                  </div>
                </div>
              </q-card-section>
              
              <q-separator />
              
              <q-card-actions class="serv-service-actions">
                <q-btn 
                  flat 
                  label="Más Detalles" 
                  color="primary" 
                  icon-right="arrow_forward"
                  no-caps
                  class="serv-details-btn"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Call to Action Section -->
    <section class="serv-cta-section">
      <div class="serv-cta-background">
        <div class="serv-cta-shape serv-cta-shape-1"></div>
        <div class="serv-cta-shape serv-cta-shape-2"></div>
        <div class="serv-cta-particles">
          <div class="serv-particle" v-for="i in 20" :key="i"></div>
        </div>
      </div>
      
      <q-container class="animated fadeIn">
        <div class="serv-cta-content">
          <div class="serv-cta-badge">
            <q-icon name="auto_awesome" size="18px" />
            <span>Comienza Hoy</span>
          </div>
          
          <h2 class="serv-cta-title">
            ¿Listo para transformar tu <span class="serv-cta-highlight">sonrisa</span>?
          </h2>
          
          <p class="serv-cta-text">
            Agenda una consulta hoy mismo y déjanos cuidar de tu salud dental con la mejor tecnología y profesionalismo.
          </p>
          
          <div class="serv-cta-features">
            <div class="serv-cta-feature">
              <q-icon name="event_available" size="20px" />
              <span>Agenda rápida y fácil</span>
            </div>
            <div class="serv-cta-feature">
              <q-icon name="card_giftcard" size="20px" />
              <span>Primera consulta gratis</span>
            </div>
            <div class="serv-cta-feature">
              <q-icon name="thumb_up" size="20px" />
              <span>Garantía de satisfacción</span>
            </div>
          </div>
          
          <q-btn
            color="white"
            text-color="primary"
            size="xl"
            label="Agendar Cita"
            icon="calendar_today"
            @click="openAppointmentDialog"
            unelevated
            no-caps
            class="serv-cta-btn"
          />
        </div>
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
      <q-card v-if="selectedService" class="serv-dialog-card">
        <q-card-section class="serv-dialog-header bg-primary text-white">
          <div class="row items-center">
            <div class="col">
              <div class="serv-dialog-title">{{ selectedService.title }}</div>
              <div class="serv-dialog-category">
                <q-icon name="label" size="16px" />
                {{ selectedService.category }}
              </div>
            </div>
            <div class="col-auto">
              <q-btn icon="close" flat round dense v-close-popup color="white" size="md" />
            </div>
          </div>
        </q-card-section>
        
        <q-card-section class="serv-dialog-content">
          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-6">
              <div class="serv-dialog-image-wrapper">
                <q-img
                  :src="selectedService.image"
                  :alt="selectedService.title"
                  class="serv-dialog-image"
                />
              </div>
              
              <!-- Información del servicio -->
              <div class="serv-dialog-info-card">
                <h5 class="serv-info-card-title">
                  <q-icon name="info" size="20px" />
                  Información del Servicio
                </h5>
                
                <q-list bordered class="rounded-borders">
                  <q-item class="serv-info-item">
                    <q-item-section avatar>
                      <q-avatar color="primary-1" text-color="primary" icon="schedule" size="48px" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption class="serv-info-label">Duración</q-item-label>
                      <q-item-label class="serv-info-value">{{ selectedService.duration }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  
                  <q-separator />
                  
                  <q-item class="serv-info-item">
                    <q-item-section avatar>
                      <q-avatar color="green-1" text-color="green" icon="attach_money" size="48px" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption class="serv-info-label">Precio</q-item-label>
                      <q-item-label class="serv-info-value">{{ selectedService.price }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  
                  <q-separator />
                  
                  <q-item class="serv-info-item">
                    <q-item-section avatar>
                      <q-avatar color="amber-1" text-color="amber" icon="category" size="48px" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption class="serv-info-label">Categoría</q-item-label>
                      <q-item-label>
                        <q-chip 
                          :color="selectedService.categoryColor" 
                          text-color="white" 
                          size="md"
                        >
                          {{ selectedService.category }}
                        </q-chip>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
            
            <div class="col-12 col-md-6">
              <div class="serv-dialog-text-content">
                <h3 class="serv-detail-title">
                  {{ selectedService.title }}
                </h3>
                
                <div class="serv-detail-badge">
                  <q-chip :color="selectedService.categoryColor" text-color="white" icon="label" size="lg">
                    {{ selectedService.category }}
                  </q-chip>
                </div>
                
                <div class="serv-detail-description">
                  <h5 class="serv-description-label">
                    <q-icon name="description" size="20px" />
                    Descripción del Tratamiento
                  </h5>
                  <p class="serv-description-text">{{ selectedService.description }}</p>
                </div>
                
                <div class="serv-detail-features" v-if="selectedService.features">
                  <h5 class="serv-features-label">
                    <q-icon name="checklist" size="20px" />
                    Características del Tratamiento
                  </h5>
                  <q-list bordered class="rounded-borders">
                    <q-item 
                      v-for="(feature, index) in selectedService.features" 
                      :key="index"
                      class="serv-feature-item"
                    >
                      <q-item-section avatar>
                        <q-avatar color="green-1" text-color="green" icon="check_circle" size="32px" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="serv-feature-text">{{ feature }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                
                <div class="serv-detail-actions">
                  <q-btn 
                    color="primary" 
                    label="Agendar Cita" 
                    size="lg"
                    icon="calendar_today"
                    @click="openAppointmentDialog"
                    unelevated
                    no-caps
                    class="serv-action-btn"
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
  serviceDialog.value = false
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
