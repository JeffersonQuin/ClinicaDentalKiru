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
          <h2 class="text-h3 text-weight-bold">Anuncios y Promociones</h2>
          <p class="text-h6 text-grey-7">Descubre nuestras ofertas especiales y eventos</p>
        </div>
        
        <!-- Loading State -->
        <div v-if="anuncioStore.filteredRows.length === 0" class="text-center q-pa-xl">
          <q-icon name="campaign" color="grey-5" size="80px" />
          <div class="text-h5 q-mt-md text-grey-7">No hay anuncios disponibles</div>
          <p class="text-grey-6">Próximamente tendremos nuevas promociones para ti.</p>
        </div>
        
        <!-- Anuncios Grid -->
        <div v-else class="row q-col-gutter-lg">
          <div 
            v-for="(anuncio, index) in anunciosActivos" 
            :key="anuncio.id"
            class="col-12 col-md-4 animated fadeInUp"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <q-card class="anuncio-card" flat bordered @click="openAnuncioDetail(anuncio)">
              <div class="anuncio-image-container">
                <q-img 
                  :src="anuncio.imagen || '/default-ad.jpg'" 
                  :alt="anuncio.titulo" 
                  class="anuncio-image"
                  @error="anuncioStore.handleImageError"
                  ratio="1"
                />
                <div class="anuncio-overlay">
                  <q-icon name="visibility" color="white" size="2em" />
                </div>
                <div class="anuncio-categoria">
                  <q-chip 
                    color="primary" 
                    text-color="white" 
                    size="sm"
                    class="categoria-chip"
                  >
                    {{ anuncio.categoria }}
                  </q-chip>
                </div>
              </div>
              
              <q-card-section class="anuncio-content">
                <div class="text-h6 text-weight-bold q-mb-sm anuncio-title">
                  {{ anuncio.titulo }}
                </div>
                
                <div class="anuncio-descripcion q-mb-md">
                  <p class="text-caption text-grey-7">
                    {{ truncateDescription(anuncio.descripcion) }}
                  </p>
                </div>
                
                <div class="anuncio-fechas q-mb-sm">
                  <div class="fecha-info">
                    <q-icon name="event" color="primary" size="14px" class="q-mr-xs" />
                    <span class="text-caption">Válido hasta: {{ anuncioStore.formatDate(anuncio.fecha_expiracion) }}</span>
                  </div>
                </div>
              </q-card-section>
              
              <q-separator />
              
              <q-card-actions align="right" class="anuncio-actions">
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
    <q-dialog v-model="anuncioDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card v-if="selectedAnuncio" class="dialog-container">
        <q-card-section class="dialog-header bg-primary text-white">
          <div class="row items-center">
            <div class="col">
              <div class="text-h6">{{ selectedAnuncio.titulo }}</div>
              <div class="text-caption">{{ selectedAnuncio.categoria }}</div>
            </div>
            <div class="col-auto">
              <q-btn icon="close" flat round dense v-close-popup color="white" />
            </div>
          </div>
        </q-card-section>
        
        <q-card-section class="dialog-content q-pt-lg">
          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-6">
              <q-img
                :src="selectedAnuncio.imagen || '/default-ad.jpg'"
                :alt="selectedAnuncio.titulo"
                class="rounded-borders anuncio-detail-image"
                @error="anuncioStore.handleImageError"
              />
              
              <!-- Información adicional -->
              <div class="anuncio-meta q-mt-md">
                <q-list bordered class="rounded-borders">
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="event_available" color="green" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Publicado</q-item-label>
                      <q-item-label>{{ anuncioStore.formatDate(selectedAnuncio.fecha_publicacion) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="event_busy" color="red" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Válido hasta</q-item-label>
                      <q-item-label>{{ anuncioStore.formatDate(selectedAnuncio.fecha_expiracion) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
            
            <div class="col-12 col-md-6">
              <div class="anuncio-detail-content">
                <div class="text-h4 text-weight-bold q-mb-md">
                  {{ selectedAnuncio.titulo }}
                </div>
                
                <div class="categoria-badge q-mb-md">
                  <q-chip color="primary" text-color="white" icon="local_offer">
                    {{ selectedAnuncio.categoria }}
                  </q-chip>
                </div>
                
                <div class="descripcion-completa q-mb-lg">
                  <h5 class="text-h6 text-weight-bold q-mb-sm">Descripción</h5>
                  <p class="text-body1">{{ selectedAnuncio.descripcion }}</p>
                </div>
                
                <div class="anuncio-detail-actions">
                  <q-btn 
                    color="primary" 
                    label="Agendar Cita" 
                    size="lg"
                    icon="calendar_today"
                    @click="openAppointmentDialogFromDetail"
                    push
                    no-caps
                    class="q-mr-sm"
                  />
                  <q-btn 
                    color="secondary" 
                    label="Compartir" 
                    size="lg"
                    icon="share"
                    outline
                    no-caps
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
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { usePublicarAnuncio } from 'src/stores/publicarAnuncio'
import AppointmentModal from 'components/AppointmentModal.vue'

const $q = useQuasar()
const anuncioStore = usePublicarAnuncio()

// Datos reactivos
const appointmentDialog = ref(false)
const anuncioDialog = ref(false)
const selectedAnuncio = ref(null)

// Computed properties
const anunciosActivos = computed(() => {
  // Filtrar solo anuncios activos y que no hayan expirado
  return anuncioStore.filteredRows.filter(anuncio => {
    if (anuncio.estado !== 'activo') return false
    
    // Verificar si la fecha de expiración ha pasado
    if (anuncio.fecha_expiracion) {
      const hoy = new Date()
      const expiracion = new Date(anuncio.fecha_expiracion)
      return expiracion >= hoy
    }
    
    return true
  })
})

// Cargar datos del store al montar el componente
onMounted(() => {
  anuncioStore.initialize()
})

// Métodos
const openAppointmentDialog = () => {
  appointmentDialog.value = true
}

const openAnuncioDetail = (anuncio) => {
  selectedAnuncio.value = anuncio
  anuncioDialog.value = true
}

const openAppointmentDialogFromDetail = () => {
  anuncioDialog.value = false
  appointmentDialog.value = true
}

const truncateDescription = (description) => {
  if (!description) return ''
  return description.length > 100 
    ? description.substring(0, 100) + '...' 
    : description
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

