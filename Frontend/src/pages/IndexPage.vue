<template>
  <q-page class="index-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <q-container class="q-pa-xl">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <h1 class="text-h2 text-weight-bold text-primary q-mb-md animated fadeInLeft">
              Tu sonrisa es nuestra prioridad
            </h1>
            <p class="text-h6 text-grey-7 q-mb-lg animated fadeInLeft" style="animation-delay: 0.2s">
              En KIRU Odontología ofrecemos tratamientos de calidad con tecnología de vanguardia. 
              Nuestro equipo de profesionales está comprometido con tu salud dental y tu bienestar.
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
                label="Ver Servicios"
                to="/services"
                no-caps
                class="secondary-btn"
              />
            </div>
          </div>
          
          <div class="col-12 col-md-6 text-center">
            <div class="hero-image-container animated zoomIn" style="animation-delay: 0.3s">
              <q-img
                src="/KiruIMG/inicio.png"
                alt="Sonrisa perfecta"
                class="hero-image"
                fit="contain"
              />
              <div class="floating-elements">
                <q-icon name="favorite" color="light-blue" size="3em" class="floating-icon-1" />
                <q-icon name="star" color="light-blue" size="2em" class="floating-icon-2" />
              </div>
            </div>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Sección de Anuncios -->
    <section class="anuncios-section q-pa-xl">
      <q-container>
        <div class="text-center q-mb-xl animated fadeIn">
          <h2 class="text-h3 text-weight-bold">Anuncios</h2>
          <p class="text-h6 text-grey-7">Descubre nuestras promociones especiales</p>
        </div>
        
        <div class="row q-col-gutter-lg">
          <div 
            v-for="(ad, index) in ads" 
            :key="ad.id"
            class="col-12 col-md-4 animated fadeInUp"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <AdCard 
              :ad="ad"
              @click="openAdDetail(ad)"
            />
          </div>
        </div>
      </q-container>
    </section>

    <!-- Call to Action Section -->
    <section class="cta-section q-pa-xl">
      <q-container>
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6 animated fadeInLeft">
            <h2 class="text-h3 text-weight-bold q-mb-md text-white">
              Solicita tu primera consulta
            </h2>
            <p class="text-h6 q-mb-lg text-white">
              Agenda una cita con nuestros especialistas y descubre cómo podemos ayudarte a tener la sonrisa que siempre has deseado.
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
          </div>
          
          <div class="col-12 col-md-6 text-center animated zoomIn">
            <q-img
              src="/icons/prueba.jpeg"
              alt="Consulta dental"
              class="cta-image"
            />
          </div>
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

    <!-- Dialog de detalle del anuncio -->
    <q-dialog v-model="adDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card v-if="selectedAd" class="dialog-container">
        <q-card-section class="dialog-header">
          <div class="row items-center">
            <div class="col">
              <div class="text-h6">{{ selectedAd.title }}</div>
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
                :src="selectedAd.image"
                :alt="selectedAd.title"
                class="rounded-borders"
              />
            </div>
            
            <div class="col-12 col-md-6">
              <div class="text-h5 text-weight-bold q-mb-md">
                {{ selectedAd.title }}
              </div>
              <p class="text-body1 q-mb-md">
                {{ selectedAd.description }}
              </p>
              <q-btn 
                color="primary" 
                label="Agendar Cita" 
                size="lg"
                icon="calendar_today"
                @click="openAppointmentDialog"
                push
                no-caps
                class="primary-btn"
              />
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
import AdCard from 'components/AdCard.vue'
import AppointmentModal from 'components/AppointmentModal.vue'
import anunciosData from 'src/data/anuncios.json'

const $q = useQuasar()

// Datos reactivos
const appointmentDialog = ref(false)
const adDialog = ref(false)
const selectedAd = ref(null)
const ads = ref([])

// Cargar datos del JSON al montar el componente
onMounted(() => {
  ads.value = anunciosData.anuncios
})

// Métodos
const openAppointmentDialog = () => {
  appointmentDialog.value = true
}

const openAdDetail = (ad) => {
  selectedAd.value = ad
  adDialog.value = true
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
.index-page {
  padding-bottom: 0;
}

.hero-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.body--dark .hero-section {
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

.anuncios-section {
  padding-top: 80px;
  padding-bottom: 80px;
}

.cta-section {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  padding-top: 80px;
  padding-bottom: 80px;
}

.cta-image {
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
}

// Responsive
@media (max-width: 768px) {
  .hero-section {
    min-height: auto;
    padding: 40px 20px;
  }
  
  .anuncios-section {
    padding: 40px 20px;
  }
  
  .cta-section {
    padding: 40px 20px;
  }
  
  .floating-elements {
    display: none;
  }
}
</style>