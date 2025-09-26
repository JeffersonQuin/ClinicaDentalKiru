<template>
  <q-page class="index-page">
    <!-- Hero Section -->
    <section class="hero-section q-pa-xl">
      <div class="row items-center">
        <div class="col-12 col-md-6">
          <h1 class="text-h2 text-weight-bold text-primary q-mb-md">
            Tu sonrisa es nuestra prioridad
          </h1>
          <p class="text-h6 text-grey-7 q-mb-lg">
            En KIRU Odontología ofrecemos tratamientos de calidad con tecnología de vanguardia. 
            Nuestro equipo de profesionales está comprometido con tu salud dental y tu bienestar.
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
              label="Ver Servicios"
              to="/services"
            />
          </div>
        </div>
        <div class="col-12 col-md-6 text-center">
          <div class="hero-image-container">
            <q-img
              src="/KiruIMG/inicio.png"
              alt="Sonrisa perfecta"
              class="hero-image"
            />
            <div class="floating-elements">
              <q-icon name="favorite" color="light-blue" size="3em" class="floating-icon-1" />
              <q-icon name="star" color="light-blue" size="2em" class="floating-icon-2" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de Anuncios -->
    <section class="anuncios-section q-pa-xl bg-grey-1">
      <div class="text-center q-mb-xl">
        <h2 class="text-h3 text-weight-bold">Anuncios</h2>
        <p class="text-h6 text-grey-7">Descubre nuestras promociones especiales</p>
      </div>
      
      <div class="row q-gutter-lg">
        <!-- Anuncio 1: Product Efficacy -->
        <div class="col-12 col-md-4">
          <AdCard 
            :ad="ads[0]"
            @click="openAdDetail(ads[0])"
          />
        </div>

        <!-- Anuncio 2: Blanqueamiento Dental -->
        <div class="col-12 col-md-4">
          <AdCard 
            :ad="ads[1]"
            @click="openAdDetail(ads[1])"
          />
        </div>

        <!-- Anuncio 3: Blanqueamiento Dental -->
        <div class="col-12 col-md-4">
          <AdCard 
            :ad="ads[2]"
            @click="openAdDetail(ads[2])"
          />
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="cta-section bg-primary text-white q-pa-xl">
      <div class="row items-center">
        <div class="col-12 col-md-6">
          <h2 class="text-h3 text-weight-bold q-mb-md">
            Solicita tu primera consulta
          </h2>
          <p class="text-h6 q-mb-lg">
            Agenda una cita con nuestros especialistas y descubre cómo podemos ayudarte a tener la sonrisa que siempre has deseado.
          </p>
          <q-btn 
            color="white" 
            text-color="primary" 
            size="lg" 
            label="Agendar Cita"
            icon="calendar_today"
            @click="openAppointmentDialog"
          />
        </div>
        <div class="col-12 col-md-6 text-center">
          <q-img
            src="/icons/prueba.jpeg"
            alt="Consulta dental"
            class="cta-image"
          />
        </div>
      </div>
    </section>

    <!-- Modal para Agendar Cita -->
    <AppointmentModal 
      v-model="appointmentDialog"
      @new-appointment="onNewAppointment"
      @history="onHistory"
      @cancel="onAppointmentCancel"
    />

    <!-- Dialog de detalle del anuncio -->
    <q-dialog v-model="adDialog" maximized>
      <q-card v-if="selectedAd">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ selectedAd.title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        
        <q-card-section>
          <div class="row">
            <div class="col-12 col-md-6">
              <q-img
                :src="selectedAd.image"
                :alt="selectedAd.title"
                class="rounded-borders"
              />
            </div>
            <div class="col-12 col-md-6 q-pl-md">
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
                @click="openAppointmentDialog"
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
import AdCard from 'components/AdCard.vue'
import AppointmentModal from 'components/AppointmentModal.vue'
import anunciosData from 'src/data/anuncios.json'


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
  console.log('Abrir nueva cita desde IndexPage')
  // Aquí implementarías la lógica para abrir el formulario de nueva cita
  // Por ejemplo: router.push('/appointment/new') o abrir otro modal
}

const onHistory = () => {
  console.log('Abrir historial de citas desde IndexPage')
  // Aquí implementarías la lógica para abrir el historial de citas
  // Por ejemplo: router.push('/appointment/history') o abrir otro modal
}

const onAppointmentCancel = () => {
  console.log('Cancelar modal de citas desde IndexPage')
  // Aquí implementarías cualquier lógica adicional al cancelar
}
</script>

<style scoped>
.index-page {
  padding-bottom: 0;
}

.hero-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 70vh;
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

.cta-section {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
}

.cta-image {
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
</style>
