<template>
  <q-page class="about-page">
    <!-- Hero Section -->
    <section class="hero-about q-pa-xl">
      <div class="text-center">
        <h1 class="text-h2 text-weight-bold text-primary q-mb-md">
          Quiénes Somos
        </h1>
        <p class="text-h6 text-grey-7">
          Conoce más sobre KIRU Odontología Integral y nuestro compromiso con tu salud dental
        </p>
      </div>
    </section>

    <!-- Sección Principal - Quiénes Somos -->
    <section class="quienes-somos q-pa-xl">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-md-6">
          <div class="about-content">
            <h2 class="text-h3 text-weight-bold q-mb-lg">Quiénes Somos</h2>
            <p class="text-body1 text-grey-7 q-mb-lg">
              Odontología Integral Kiru está conformada por un equipo de profesionales especialistas, 
              comprometidos en brindar a cada paciente la más alta calidad en atención odontológica. 
              Contamos con una amplia gama de servicios, que abarcan desde la odontología general 
              hasta tratamientos especializados, siempre incorporando los últimos avances en tecnología dental.
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
        </div>
        <div class="col-12 col-md-6">
          <div class="about-image-container">
            <q-img
              src="/icons/prueba.jpeg"
              alt="Paciente en consulta dental"
              class="about-main-image"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Galería de la Clínica -->
    <section class="clinic-gallery q-pa-xl bg-grey-1">
      <div class="text-center q-mb-xl">
        <h2 class="text-h3 text-weight-bold q-mb-md">Nuestra Clínica</h2>
        <p class="text-h6 text-grey-7">Instalaciones modernas y equipos de última tecnología</p>
      </div>
      
      <div class="gallery-container">
        <div class="gallery-grid">
          <div 
            v-for="(image, index) in clinicImages" 
            :key="index"
            class="gallery-item"
            @click="openImageDialog(image)"
          >
            <q-img
              :src="image.src"
              :alt="image.alt"
              class="gallery-image"
            >
              <div class="gallery-overlay">
                <q-icon name="zoom_in" color="white" size="2em" />
              </div>
            </q-img>
          </div>
        </div>
      </div>
    </section>

    <!-- Misión y Visión -->
    <section class="mission-vision q-pa-xl">
      <div class="container">
        <div class="text-center q-mb-xl">
          <h2 class="text-h3 text-weight-bold q-mb-md">Nuestra Misión</h2>
        </div>
        
        <div class="mission-content">
          <div class="mission-text">
            <p class="text-body1 text-grey-7 q-mb-lg">
              Odontología Integral Kiru es un proyecto que ha crecido rápidamente gracias al compromiso 
              y dedicación de nuestro equipo. Nos motiva la frase que guía nuestro trabajo: 
              <strong>«En Dios Confío»</strong>, y mantenemos nuestro lema: 
              <strong>«Un centro para toda la familia»</strong>.
            </p>
            <p class="text-body1 text-grey-7 q-mb-lg">
              Nuestro objetivo es brindar tratamientos preventivos y correctivos en salud oral, 
              con especialistas altamente capacitados, equipos de última tecnología y ambientes 
              cómodos para toda la familia: desde los más pequeños, asegurando una salud oral 
              adecuada desde temprana edad, hasta los adultos mayores, ofreciendo alternativas 
              que mantengan su salud y estética dental en óptimas condiciones.
            </p>
          </div>
          
          <div class="mission-values">
            <div class="row q-gutter-lg">
              <div class="col-12 col-md-4">
                <q-card class="value-card text-center">
                  <q-card-section>
                    <q-icon name="favorite" color="red" size="3em" class="q-mb-md" />
                    <h4 class="text-h6 text-weight-bold q-mb-sm">Compromiso</h4>
                    <p class="text-body2 text-grey-7">
                      Dedicación total a la excelencia en cada tratamiento
                    </p>
                  </q-card-section>
                </q-card>
              </div>
              
              <div class="col-12 col-md-4">
                <q-card class="value-card text-center">
                  <q-card-section>
                    <q-icon name="family_restroom" color="blue" size="3em" class="q-mb-md" />
                    <h4 class="text-h6 text-weight-bold q-mb-sm">Familia</h4>
                    <p class="text-body2 text-grey-7">
                      Un centro pensado para toda la familia
                    </p>
                  </q-card-section>
                </q-card>
              </div>
              
              <div class="col-12 col-md-4">
                <q-card class="value-card text-center">
                  <q-card-section>
                    <q-icon name="science" color="green" size="3em" class="q-mb-md" />
                    <h4 class="text-h6 text-weight-bold q-mb-sm">Tecnología</h4>
                    <p class="text-body2 text-grey-7">
                      Equipos de última generación para mejores resultados
                    </p>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Personal de KIRU -->
    <section class="staff-section q-pa-xl bg-grey-1">
      <div class="text-center q-mb-xl">
        <h2 class="text-h3 text-weight-bold q-mb-md">Personal de KIRU</h2>
        <p class="text-h6 text-grey-7">Conoce a nuestro equipo de profesionales especializados</p>
      </div>
      
      <div class="staff-grid">
        <div 
          v-for="doctor in staff" 
          :key="doctor.id"
          class="staff-card"
          @click="openDoctorDetail(doctor)"
        >
          <q-card class="staff-member-card">
            <q-card-section class="text-center">
              <div class="staff-avatar">
                <q-avatar size="120px" class="q-mb-md">
                  <q-img :src="doctor.image" :alt="doctor.name" />
                </q-avatar>
              </div>
              <h4 class="text-h6 text-weight-bold q-mb-sm">{{ doctor.name }}</h4>
              <p class="text-body2 text-grey-7 q-mb-sm">{{ doctor.specialty }}</p>
              <p class="text-caption text-grey-6 q-mb-md">{{ doctor.experience }} de experiencia</p>
              <div class="staff-info">
                <q-chip 
                  v-for="cert in doctor.certifications" 
                  :key="cert.name"
                  :color="cert.color" 
                  text-color="white" 
                  size="sm"
                  class="q-mr-xs q-mb-xs"
                >
                  {{ cert.name }}
                </q-chip>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section bg-primary text-white q-pa-xl text-center">
      <h2 class="text-h3 text-weight-bold q-mb-md">
        ¿Listo para conocer más sobre nosotros?
      </h2>
      <p class="text-h6 q-mb-lg">
        Agenda una cita y descubre por qué somos la mejor opción para tu salud dental
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

    <!-- Modal para Agendar Cita -->
    <AppointmentModal 
      v-model="appointmentDialog"
      @new-appointment="onNewAppointment"
      @history="onHistory"
      @cancel="onAppointmentCancel"
    />

    <!-- Dialog para ver imagen en grande -->
    <q-dialog v-model="imageDialog" maximized>
      <q-card v-if="selectedImage">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ selectedImage.alt }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        
        <q-card-section class="text-center">
          <q-img
            :src="selectedImage.src"
            :alt="selectedImage.alt"
            class="full-image"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog para detalles del doctor -->
    <q-dialog v-model="doctorDialog" maximized>
      <q-card v-if="selectedDoctor">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ selectedDoctor.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        
        <q-card-section>
          <div class="row">
            <div class="col-12 col-md-4 text-center">
              <q-avatar size="200px" class="q-mb-md">
                <q-img :src="selectedDoctor.image" :alt="selectedDoctor.name" />
              </q-avatar>
              <h3 class="text-h5 text-weight-bold q-mb-sm">{{ selectedDoctor.name }}</h3>
              <p class="text-h6 text-primary q-mb-md">{{ selectedDoctor.specialty }}</p>
              <q-btn 
                color="primary" 
                label="Agendar Cita" 
                size="lg"
                @click="openAppointmentDialog"
              />
            </div>
            
            <div class="col-12 col-md-8 q-pl-md">
              <div class="doctor-details">
                <h4 class="text-h6 text-weight-bold q-mb-md">Información Profesional</h4>
                
                <div class="detail-item q-mb-md">
                  <q-icon name="work" color="primary" size="20px" class="q-mr-sm" />
                  <span class="text-weight-bold">Especialidad:</span>
                  <span class="q-ml-sm">{{ selectedDoctor.specialty }}</span>
                </div>
                
                <div class="detail-item q-mb-md">
                  <q-icon name="schedule" color="primary" size="20px" class="q-mr-sm" />
                  <span class="text-weight-bold">Experiencia:</span>
                  <span class="q-ml-sm">{{ selectedDoctor.experience }}</span>
                </div>
                
                <div class="detail-item q-mb-md">
                  <q-icon name="school" color="primary" size="20px" class="q-mr-sm" />
                  <span class="text-weight-bold">Educación:</span>
                  <span class="q-ml-sm">{{ selectedDoctor.education }}</span>
                </div>
                
                <div class="detail-item q-mb-md">
                  <q-icon name="language" color="primary" size="20px" class="q-mr-sm" />
                  <span class="text-weight-bold">Idiomas:</span>
                  <span class="q-ml-sm">{{ selectedDoctor.languages.join(', ') }}</span>
                </div>
                
                <div class="q-mb-md">
                  <h5 class="text-h6 text-weight-bold q-mb-sm">Descripción</h5>
                  <p class="text-body1">{{ selectedDoctor.description }}</p>
                </div>
                
                <div class="q-mb-md">
                  <h5 class="text-h6 text-weight-bold q-mb-sm">Certificaciones</h5>
                  <div class="certifications-grid">
                    <q-chip 
                      v-for="cert in selectedDoctor.certifications" 
                      :key="cert.name"
                      :color="cert.color" 
                      text-color="white" 
                      size="md"
                      class="q-mr-sm q-mb-sm"
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
import AppointmentModal from 'components/AppointmentModal.vue'
import personalData from 'src/data/personal.json'

// Datos reactivos
const appointmentDialog = ref(false)
const imageDialog = ref(false)
const doctorDialog = ref(false)
const selectedImage = ref(null)
const selectedDoctor = ref(null)
const staff = ref([])

// Datos de la galería de la clínica
const clinicImages = ref([
  {
    src: '/icons/prueba.jpeg',
    alt: 'Consultorio dental moderno'
  },
  {
    src: '/icons/prueba.jpeg',
    alt: 'Sala de espera cómoda'
  },
  {
    src: '/icons/prueba.jpeg',
    alt: 'Equipos de última tecnología'
  },
  {
    src: '/icons/prueba.jpeg',
    alt: 'Área de consulta especializada'
  },
  {
    src: '/icons/prueba.jpeg',
    alt: 'Instalaciones modernas'
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

const openImageDialog = (image) => {
  selectedImage.value = image
  imageDialog.value = true
}

const openDoctorDetail = (doctor) => {
  selectedDoctor.value = doctor
  doctorDialog.value = true
}

// Funciones para manejar eventos del modal de citas
const onNewAppointment = () => {
  console.log('Abrir nueva cita desde AboutPage')
  // Aquí implementarías la lógica para abrir el formulario de nueva cita
  // Por ejemplo: router.push('/appointment/new') o abrir otro modal
}

const onHistory = () => {
  console.log('Abrir historial de citas desde AboutPage')
  // Aquí implementarías la lógica para abrir el historial de citas
  // Por ejemplo: router.push('/appointment/history') o abrir otro modal
}

const onAppointmentCancel = () => {
  console.log('Cancelar modal de citas desde AboutPage')
  // Aquí implementarías cualquier lógica adicional al cancelar
}
</script>

<style scoped>
.about-page {
  padding-bottom: 0;
}

.hero-about {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quienes-somos {
  padding-top: 80px;
  padding-bottom: 80px;
}

.about-content {
  max-width: 600px;
}

.about-image-container {
  position: relative;
  display: inline-block;
}

.about-main-image {
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.floating-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 16px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.badge-text {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.clinic-gallery {
  padding-top: 80px;
  padding-bottom: 80px;
}

.gallery-container {
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.gallery-item {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-5px);
}

.gallery-image {
  border-radius: 15px;
  height: 200px;
  object-fit: cover;
}

.gallery-overlay {
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
  border-radius: 15px;
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.mission-vision {
  padding-top: 80px;
  padding-bottom: 80px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.mission-content {
  text-align: center;
}

.mission-text {
  max-width: 800px;
  margin: 0 auto 60px;
  text-align: left;
}

.value-card {
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.value-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.staff-section {
  padding-top: 80px;
  padding-bottom: 80px;
}

.staff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1000px;
  margin: 0 auto;
}

.staff-member-card {
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.staff-member-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.staff-avatar {
  position: relative;
}

.staff-info {
  margin-top: 16px;
}

.cta-section {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  padding-top: 80px;
  padding-bottom: 80px;
}

.full-image {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 10px;
}

/* Estilos para el modal del doctor */
.doctor-details {
  padding: 20px 0;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.detail-item:last-child {
  border-bottom: none;
}

.certifications-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.staff-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.staff-card:hover {
  transform: translateY(-5px);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-about {
    min-height: 30vh;
    padding: 40px 20px;
  }
  
  .quienes-somos,
  .clinic-gallery,
  .mission-vision,
  .staff-section {
    padding: 40px 20px;
  }
  
  .gallery-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .gallery-image {
    height: 150px;
  }
  
  .staff-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .floating-badge {
    position: static;
    margin-top: 16px;
    justify-content: center;
  }
}
</style>
