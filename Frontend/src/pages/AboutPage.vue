<template>
  <q-page class="about-about-page">
    <!-- Hero Section para About -->
    <section class="about-hero-section">
      <div class="about-hero-background">
        <div class="about-hero-shape about-hero-shape-1"></div>
        <div class="about-hero-shape about-hero-shape-2"></div>
        <div class="about-hero-shape about-hero-shape-3"></div>
      </div>
      
      <q-container class="q-pa-xl">
        <div class="text-center">
          <div class="about-hero-badge animated fadeInDown">
            <q-icon name="business" size="20px" />
            <span>Nuestra Historia</span>
          </div>
          
          <h1 class="about-hero-title animated fadeInDown">
            Quiénes Somos
          </h1>
          
          <p class="about-hero-subtitle animated fadeInUp" style="animation-delay: 0.2s">
            Conoce más sobre KIRU Odontología Integral y nuestro compromiso con tu salud dental
          </p>
        </div>
      </q-container>
    </section>

    <!-- Sección Principal - Quiénes Somos Mejorada -->
    <section class="about-quienes-section">
      <div class="about-quienes-background">
        <div class="about-wave about-wave-top"></div>
      </div>
      
      <q-container>
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <div class="about-content-main animated fadeInLeft">
              <div class="about-section-badge">
                <q-icon name="groups" size="20px" />
                <span>Nuestro Equipo</span>
              </div>
              
              <h2 class="about-section-title">Quiénes Somos</h2>
              
              <p class="about-section-text">
                Odontología Integral Kiru está conformada por un equipo de profesionales especialistas, 
                comprometidos en brindar a cada paciente la más alta calidad en atención odontológica. 
                Contamos con una amplia gama de servicios, que abarcan desde la odontología general 
                hasta tratamientos especializados, siempre incorporando los últimos avances en tecnología dental.
              </p>
              
              <div class="about-stats q-mb-lg">
                <div class="about-stat">
                  <div class="about-stat-number">15+</div>
                  <div class="about-stat-label">Años de Experiencia</div>
                </div>
                <div class="about-stat">
                  <div class="about-stat-number">5000+</div>
                  <div class="about-stat-label">Pacientes Atendidos</div>
                </div>
                <div class="about-stat">
                  <div class="about-stat-number">99%</div>
                  <div class="about-stat-label">Satisfacción</div>
                </div>
              </div>
              
              <div class="about-actions q-gutter-md">
                <q-btn 
                  color="primary" 
                  size="lg" 
                  label="Agendar Cita" 
                  icon="calendar_today"
                  @click="openAppointmentDialog"
                  unelevated
                  no-caps
                  class="about-primary-btn"
                />
                <q-btn 
                  outline 
                  color="primary" 
                  size="lg" 
                  label="Ver Servicios"
                  to="/services"
                  no-caps
                  class="about-secondary-btn"
                />
              </div>
            </div>
          </div>
          
          <div class="col-12 col-md-6">
            <div class="about-image-main-wrapper animated zoomIn" style="animation-delay: 0.3s">
              <div class="about-image-main-glow"></div>
              <div class="about-image-main-container">
                <q-img
                  src="/icons/prueba.jpeg"
                  alt="Paciente en consulta dental KIRU"
                  class="about-main-image"
                />
              </div>
              
              <div class="about-floating-elements">
                <div class="about-floating-card about-floating-card-1">
                  <q-icon name="verified" color="#1976d2" size="24px" />
                  <div class="about-floating-text">
                    <strong>Certificados</strong>
                    <span>Internacionalmente</span>
                  </div>
                </div>
                
                <div class="about-floating-card about-floating-card-2">
                  <q-icon name="emergency" color="#26a69a" size="24px" />
                  <div class="about-floating-text">
                    <strong>24/7</strong>
                    <span>Urgencias</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Carrusel de la Clínica Mejorado -->
    <section class="about-clinic-section q-pa-xl">
      <q-container>
        <div class="about-section-header text-center animated fadeIn">
          <div class="about-section-badge">
            <q-icon name="photo_library" size="20px" />
            <span>Nuestras Instalaciones</span>
          </div>
          <h2 class="about-section-title">Nuestra Clínica</h2>
          <p class="about-section-subtitle">Instalaciones modernas y equipos de última tecnología para tu comodidad</p>
          <div class="about-title-decoration">
            <div class="about-title-line"></div>
            <q-icon name="apartment" color="primary" size="32px" />
            <div class="about-title-line"></div>
          </div>
        </div>
        
        <!-- Carrusel Mejorado -->
        <div class="about-carousel-container animated fadeInUp">
          <q-carousel
            v-model="carouselSlide"
            animated
            swipeable
            navigation
            padding
            arrows
            control-type="regular"
            control-color="primary"
            control-text-color="white"
            height="500px"
            class="about-carousel"
          >
            <q-carousel-slide 
              v-for="(image, index) in clinicImages" 
              :key="index"
              :name="index"
              class="about-carousel-slide"
            >
              <div class="about-carousel-content">
                <q-img
                  :src="image.src"
                  :alt="image.alt"
                  class="about-carousel-image"
                >
                  <div class="about-carousel-overlay">
                    <div class="about-carousel-text">
                      <h3 class="about-carousel-title">{{ image.alt }}</h3>
                      <p class="about-carousel-description">{{ image.description }}</p>
                    </div>
                  </div>
                </q-img>
              </div>
            </q-carousel-slide>
          </q-carousel>
          
          <!-- Miniaturas del Carrusel -->
          <div class="about-carousel-thumbnails">
            <div 
              v-for="(image, index) in clinicImages" 
              :key="index"
              class="about-thumbnail"
              :class="{ 'about-thumbnail-active': carouselSlide === index }"
              @click="carouselSlide = index"
            >
              <q-img
                :src="image.src"
                :alt="image.alt"
                class="about-thumbnail-image"
              />
            </div>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Misión y Visión Mejorada -->
    <section class="about-mission-section">
      <div class="about-mission-background">
        <div class="about-mission-shape about-mission-shape-1"></div>
        <div class="about-mission-shape about-mission-shape-2"></div>
      </div>
      
      <q-container>
        <div class="about-section-header text-center animated fadeIn">
          <div class="about-section-badge">
            <q-icon name="flag" size="20px" />
            <span>Nuestra Filosofía</span>
          </div>
          <h2 class="about-section-title">Nuestra Misión y Visión</h2>
          <p class="about-section-subtitle">Los principios que guían nuestro trabajo diario</p>
        </div>
        
        <div class="about-mission-content">
          <div class="row q-col-gutter-xl">
            <!-- Misión -->
            <div class="col-12 col-md-6 animated fadeInLeft">
              <q-card class="about-mission-card">
                <q-card-section class="about-mission-card-header">
                  <div class="about-mission-icon-wrapper">
                    <q-icon name="target" size="32px" color="primary" />
                  </div>
                  <h3 class="about-mission-card-title">Misión</h3>
                </q-card-section>
                
                <q-card-section class="about-mission-card-body">
                  <p class="about-mission-text">
                    Odontología Integral Kiru es un proyecto que ha crecido rápidamente gracias al compromiso 
                    y dedicación de nuestro equipo. Nos motiva la frase que guía nuestro trabajo: 
                    <strong>«En Dios Confío»</strong>, y mantenemos nuestro lema: 
                    <strong>«Un centro para toda la familia»</strong>.
                  </p>
                  
                  <p class="about-mission-text">
                    Nuestro objetivo es brindar tratamientos preventivos y correctivos en salud oral, 
                    con especialistas altamente capacitados, equipos de última tecnología y ambientes 
                    cómodos para toda la familia.
                  </p>
                </q-card-section>
              </q-card>
            </div>
            
            <!-- Visión -->
            <div class="col-12 col-md-6 animated fadeInRight">
              <q-card class="about-vision-card">
                <q-card-section class="about-vision-card-header">
                  <div class="about-vision-icon-wrapper">
                    <q-icon name="visibility" size="32px" color="secondary" />
                  </div>
                  <h3 class="about-vision-card-title">Visión</h3>
                </q-card-section>
                
                <q-card-section class="about-vision-card-body">
                  <p class="about-vision-text">
                    Ser la clínica dental de referencia en Oruro, reconocida por nuestra excelencia 
                    en atención, tecnología de vanguardia y compromiso con la salud bucal de toda la familia.
                  </p>
                  
                  <div class="about-vision-goals">
                    <div class="about-vision-goal">
                      <q-icon name="check_circle" color="green" size="20px" />
                      <span>Innovación constante en tratamientos</span>
                    </div>
                    <div class="about-vision-goal">
                      <q-icon name="check_circle" color="green" size="20px" />
                      <span>Expansión de servicios especializados</span>
                    </div>
                    <div class="about-vision-goal">
                      <q-icon name="check_circle" color="green" size="20px" />
                      <span>Liderazgo en educación dental comunitaria</span>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          
          <!-- Valores Corporativos -->
          <div class="about-values-section animated fadeInUp" style="animation-delay: 0.3s">
            <h3 class="about-values-title text-center">Nuestros Valores</h3>
            
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-sm-6 col-md-4">
                <q-card class="about-value-card" flat>
                  <q-card-section class="about-value-content text-center">
                    <div class="about-value-icon-wrapper">
                      <q-icon name="favorite" color="red" size="2.5em" />
                    </div>
                    <h4 class="about-value-title">Compromiso</h4>
                    <p class="about-value-description">
                      Dedicación total a la excelencia en cada tratamiento y atención personalizada
                    </p>
                  </q-card-section>
                </q-card>
              </div>
              
              <div class="col-12 col-sm-6 col-md-4">
                <q-card class="about-value-card" flat>
                  <q-card-section class="about-value-content text-center">
                    <div class="about-value-icon-wrapper">
                      <q-icon name="family_restroom" color="blue" size="2.5em" />
                    </div>
                    <h4 class="about-value-title">Familia</h4>
                    <p class="about-value-description">
                      Un centro pensado para toda la familia, desde niños hasta adultos mayores
                    </p>
                  </q-card-section>
                </q-card>
              </div>
              
              <div class="col-12 col-sm-6 col-md-4">
                <q-card class="about-value-card" flat>
                  <q-card-section class="about-value-content text-center">
                    <div class="about-value-icon-wrapper">
                      <q-icon name="science" color="green" size="2.5em" />
                    </div>
                    <h4 class="about-value-title">Tecnología</h4>
                    <p class="about-value-description">
                      Equipos de última generación para diagnósticos precisos y tratamientos efectivos
                    </p>
                  </q-card-section>
                </q-card>
              </div>
              
              <div class="col-12 col-sm-6 col-md-4">
                <q-card class="about-value-card" flat>
                  <q-card-section class="about-value-content text-center">
                    <div class="about-value-icon-wrapper">
                      <q-icon name="verified" color="orange" size="2.5em" />
                    </div>
                    <h4 class="about-value-title">Calidad</h4>
                    <p class="about-value-description">
                      Estándares internacionales en todos nuestros procedimientos y servicios
                    </p>
                  </q-card-section>
                </q-card>
              </div>
              
              <div class="col-12 col-sm-6 col-md-4">
                <q-card class="about-value-card" flat>
                  <q-card-section class="about-value-content text-center">
                    <div class="about-value-icon-wrapper">
                      <q-icon name="groups" color="purple" size="2.5em" />
                    </div>
                    <h4 class="about-value-title">Equipo</h4>
                    <p class="about-value-description">
                      Profesionales especializados trabajando en conjunto para tu bienestar
                    </p>
                  </q-card-section>
                </q-card>
              </div>
              
              <div class="col-12 col-sm-6 col-md-4">
                <q-card class="about-value-card" flat>
                  <q-card-section class="about-value-content text-center">
                    <div class="about-value-icon-wrapper">
                      <q-icon name="support_agent" color="teal" size="2.5em" />
                    </div>
                    <h4 class="about-value-title">Servicio</h4>
                    <p class="about-value-description">
                      Atención cálida y personalizada en cada visita a nuestra clínica
                    </p>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Personal de KIRU Mejorado -->
    <section class="about-staff-section q-pa-xl">
      <q-container>
        <div class="about-section-header text-center animated fadeIn">
          <div class="about-section-badge">
            <q-icon name="people" size="20px" />
            <span>Nuestro Equipo</span>
          </div>
          <h2 class="about-section-title">Personal de KIRU</h2>
          <p class="about-section-subtitle">Conoce a nuestro equipo de profesionales especializados y altamente capacitados</p>
          <div class="about-title-decoration">
            <div class="about-title-line"></div>
            <q-icon name="stethoscope" color="primary" size="32px" />
            <div class="about-title-line"></div>
          </div>
        </div>
        
        <div class="about-staff-grid">
          <div 
            v-for="(doctor, index) in staff" 
            :key="doctor.id"
            class="about-staff-card animated fadeInUp"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="openDoctorDetail(doctor)"
          >
            <q-card class="about-staff-member-card" flat>
              <div class="about-staff-image-container">
                <q-img
                  :src="doctor.image"
                  :alt="doctor.name"
                  class="about-staff-image"
                />
                <div class="about-staff-overlay">
                  <div class="about-staff-overlay-content">
                    <q-icon name="visibility" color="white" size="2em" />
                    <div class="about-staff-overlay-text">Ver Perfil</div>
                  </div>
                </div>
                <div class="about-staff-experience">
                  <q-chip 
                    color="primary" 
                    text-color="white" 
                    size="sm"
                    class="about-experience-chip"
                  >
                    {{ doctor.experience }}
                  </q-chip>
                </div>
              </div>
              
              <q-card-section class="about-staff-content text-center">
                <h4 class="about-staff-name">{{ doctor.name }}</h4>
                <p class="about-staff-specialty">{{ doctor.specialty }}</p>
                
                <div class="about-staff-info">
                  <q-chip 
                    v-for="cert in doctor.certifications.slice(0, 2)" 
                    :key="cert.name"
                    :color="cert.color" 
                    text-color="white" 
                    size="sm"
                    class="about-staff-cert"
                  >
                    {{ cert.name }}
                  </q-chip>
                </div>
                
                <div class="about-staff-actions">
                  <q-btn 
                    flat 
                    color="primary" 
                    label="Ver Perfil" 
                    icon-right="arrow_forward"
                    no-caps
                    class="about-staff-btn"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Call to Action Mejorado -->
    <section class="about-cta-section">
      <div class="about-cta-background">
        <div class="about-cta-shape about-cta-shape-1"></div>
        <div class="about-cta-shape about-cta-shape-2"></div>
        <div class="about-cta-particles">
          <div class="about-particle" v-for="i in 12" :key="i"></div>
        </div>
      </div>
      
      <q-container class="animated fadeIn">
        <div class="about-cta-content text-center">
          <div class="about-cta-badge">
            <q-icon name="calendar_today" size="18px" />
            <span>¿Listo para Conocernos?</span>
          </div>
          
          <h2 class="about-cta-title">
            Agenda tu primera consulta con 
            <span class="about-cta-highlight">nosotros</span>
          </h2>
          
          <p class="about-cta-text">
            Descubre por qué somos la mejor opción para tu salud dental. 
            Nuestro equipo de especialistas está listo para atenderte.
          </p>
          
          <div class="about-cta-features">
            <div class="about-cta-feature">
              <q-icon name="verified" size="20px" />
              <span>Primera consulta gratuita</span>
            </div>
            <div class="about-cta-feature">
              <q-icon name="schedule" size="20px" />
              <span>Horarios flexibles</span>
            </div>
            <div class="about-cta-feature">
              <q-icon name="payments" size="20px" />
              <span>Planes de financiamiento</span>
            </div>
          </div>
          
          <q-btn
            color="white"
            text-color="primary"
            size="xl"
            label="Agendar Cita Ahora"
            icon="calendar_today"
            @click="openAppointmentDialog"
            unelevated
            no-caps
            class="about-cta-btn"
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

    <!-- Dialog para detalles del doctor mejorado -->
    <q-dialog v-model="doctorDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card v-if="selectedDoctor" class="about-doctor-dialog-card">
        <q-card-section class="about-doctor-dialog-header bg-primary text-white">
          <div class="row items-center">
            <div class="col">
              <div class="about-doctor-dialog-title">{{ selectedDoctor.name }}</div>
              <div class="about-doctor-dialog-subtitle">{{ selectedDoctor.specialty }}</div>
            </div>
            <div class="col-auto">
              <q-btn icon="close" flat round dense v-close-popup color="white" size="md" />
            </div>
          </div>
        </q-card-section>
        
        <q-card-section class="about-doctor-dialog-content">
          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-4">
              <div class="about-doctor-profile text-center">
                <div class="about-doctor-avatar-wrapper">
                  <q-img
                    :src="selectedDoctor.image"
                    :alt="selectedDoctor.name"
                    class="about-doctor-avatar"
                  />
                </div>
                
                <h3 class="about-doctor-name">{{ selectedDoctor.name }}</h3>
                <p class="about-doctor-specialty">{{ selectedDoctor.specialty }}</p>
                
                <div class="about-doctor-quick-info">
                  <div class="about-doctor-info-item">
                    <q-icon name="work" color="primary" size="20px" />
                    <span>{{ selectedDoctor.experience }}</span>
                  </div>
                  
                  <div class="about-doctor-info-item">
                    <q-icon name="school" color="primary" size="20px" />
                    <span>{{ selectedDoctor.education }}</span>
                  </div>
                </div>
                
                <q-btn 
                  color="primary" 
                  label="Agendar Cita" 
                  size="lg"
                  icon="calendar_today"
                  @click="openAppointmentDialog"
                  unelevated
                  no-caps
                  class="about-doctor-cta-btn"
                />
              </div>
            </div>
            
            <div class="col-12 col-md-8">
              <div class="about-doctor-details">
                <h4 class="about-doctor-details-title">Información Profesional</h4>
                
                <div class="about-doctor-info-section">
                  <h5 class="about-doctor-section-title">
                    <q-icon name="work_history" size="20px" class="q-mr-sm" />
                    Experiencia
                  </h5>
                  <p class="about-doctor-section-text">{{ selectedDoctor.experience }} de experiencia especializada</p>
                </div>
                
                <div class="about-doctor-info-section">
                  <h5 class="about-doctor-section-title">
                    <q-icon name="school" size="20px" class="q-mr-sm" />
                    Formación
                  </h5>
                  <p class="about-doctor-section-text">{{ selectedDoctor.education }}</p>
                </div>
                
                <div class="about-doctor-info-section">
                  <h5 class="about-doctor-section-title">
                    <q-icon name="language" size="20px" class="q-mr-sm" />
                    Idiomas
                  </h5>
                  <div class="about-doctor-languages">
                    <q-chip 
                      v-for="lang in selectedDoctor.languages" 
                      :key="lang"
                      color="blue-1" 
                      text-color="blue-9"
                      size="md"
                    >
                      {{ lang }}
                    </q-chip>
                  </div>
                </div>
                
                <div class="about-doctor-info-section">
                  <h5 class="about-doctor-section-title">
                    <q-icon name="description" size="20px" class="q-mr-sm" />
                    Descripción
                  </h5>
                  <p class="about-doctor-description">{{ selectedDoctor.description }}</p>
                </div>
                
                <div class="about-doctor-info-section">
                  <h5 class="about-doctor-section-title">
                    <q-icon name="verified" size="20px" class="q-mr-sm" />
                    Certificaciones
                  </h5>
                  <div class="about-doctor-certifications">
                    <q-chip 
                      v-for="cert in selectedDoctor.certifications" 
                      :key="cert.name"
                      :color="cert.color" 
                      text-color="white" 
                      size="md"
                      class="about-doctor-cert"
                    >
                      {{ cert.name }}
                    </q-chip>
                  </div>
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
import { useNotifications } from 'src/composables/useNotifications'
import AppointmentModal from 'components/AppointmentModal.vue'
import personalData from 'src/data/personal.json'

const { notifyInfo } = useNotifications()

// Datos reactivos
const appointmentDialog = ref(false)
const doctorDialog = ref(false)
const selectedDoctor = ref(null)
const staff = ref([])
const carouselSlide = ref(0)

// Datos del carrusel de la clínica mejorado
const clinicImages = ref([
  { 
    src: '/icons/prueba.jpeg', 
    alt: 'Consultorio dental moderno',
    description: 'Ambientes diseñados para tu comodidad y tranquilidad'
  },
  { 
    src: '/icons/prueba.jpeg', 
    alt: 'Sala de espera cómoda',
    description: 'Espacios amplios y confortables para tu espera'
  },
  { 
    src: '/icons/prueba.jpeg', 
    alt: 'Equipos de última tecnología',
    description: 'Tecnología de vanguardia para diagnósticos precisos'
  },
  { 
    src: '/icons/prueba.jpeg', 
    alt: 'Área de consulta especializada',
    description: 'Consultorios equipados con lo último en odontología'
  },
  { 
    src: '/icons/prueba.jpeg', 
    alt: 'Instalaciones modernas',
    description: 'Infraestructura diseñada para la excelencia en atención'
  }
])

// Cargar datos del personal al montar el componente
onMounted(() => {
  staff.value = personalData.personal
})

// Métodos
const openAppointmentDialog = () => {
  appointmentDialog.value = true
}

const openDoctorDetail = (doctor) => {
  selectedDoctor.value = doctor
  doctorDialog.value = true
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

