<template>
  <q-footer class="footer-layout bg-grey-9 text-white">
    <!-- Sección principal del footer -->
    <div class="footer-main q-pa-xl">
      <div class="container">
        <div class="row q-gutter-xl">
          <!-- Columna 1: Información de la clínica -->
          <div class="col-12 col-md-4">
            <div class="footer-brand q-mb-lg">
              <div class="row items-center q-mb-md">
                <q-icon name="favorite" color="orange" size="2.5em" class="q-mr-sm" />
                <div>
                  <div class="text-h5 text-weight-bold text-orange">KIRU</div>
                  <div class="text-caption text-grey-4">Odontología</div>
                </div>
              </div>
              <p class="text-body2 text-grey-3 q-mb-md">
                Tu sonrisa es nuestra prioridad. Ofrecemos tratamientos dentales de calidad 
                con tecnología de vanguardia y un equipo de profesionales comprometidos 
                con tu salud dental.
              </p>
              
              <!-- Redes sociales -->
              <div class="social-links">
                <h6 class="text-weight-bold q-mb-sm">Síguenos</h6>
                <div class="row q-gutter-sm">
                  <q-btn 
                    v-for="social in socialMedia" 
                    :key="social.name"
                    :icon="social.icon"
                    round
                    color="orange"
                    size="md"
                    @click="openSocialLink(social.url)"
                  >
                    <q-tooltip>{{ social.name }}</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna 2: Enlaces rápidos -->
          <div class="col-12 col-md-2">
            <div class="footer-links">
              <h6 class="text-weight-bold q-mb-md">Enlaces Rápidos</h6>
              <q-list dense>
                <q-item 
                  v-for="link in quickLinks" 
                  :key="link.name"
                  clickable
                  v-ripple
                  @click="navigateTo(link.route)"
                  class="footer-link-item"
                >
                  <q-item-section>
                    <q-item-label class="text-body2">{{ link.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>

          <!-- Columna 3: Servicios -->
          <div class="col-12 col-md-3">
            <div class="footer-services">
              <h6 class="text-weight-bold q-mb-md">Nuestros Servicios</h6>
              <q-list dense>
                <q-item 
                  v-for="service in services" 
                  :key="service.name"
                  clickable
                  v-ripple
                  @click="navigateToService(service.route)"
                  class="footer-link-item"
                >
                  <q-item-section>
                    <q-item-label class="text-body2">{{ service.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>

          <!-- Columna 4: Información de contacto -->
          <div class="col-12 col-md-3">
            <div class="footer-contact">
              <h6 class="text-weight-bold q-mb-md">Contacto</h6>
              <div class="contact-info">
                <div class="contact-item q-mb-sm">
                  <q-icon name="location_on" color="orange" class="q-mr-sm" />
                  <span class="text-body2">{{ contactInfo.address }}</span>
                </div>
                <div class="contact-item q-mb-sm">
                  <q-icon name="phone" color="orange" class="q-mr-sm" />
                  <span class="text-body2">{{ contactInfo.phone }}</span>
                </div>
                <div class="contact-item q-mb-sm">
                  <q-icon name="email" color="orange" class="q-mr-sm" />
                  <span class="text-body2">{{ contactInfo.email }}</span>
                </div>
                <div class="contact-item q-mb-sm">
                  <q-icon name="schedule" color="orange" class="q-mr-sm" />
                  <span class="text-body2">{{ contactInfo.schedule }}</span>
                </div>
              </div>
              
              <!-- Botón de WhatsApp -->
              <div class="q-mt-md">
                <q-btn 
                  color="green" 
                  icon="chat" 
                  label="WhatsApp"
                  @click="openWhatsApp"
                  class="whatsapp-btn"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección inferior del footer -->
    <div class="footer-bottom bg-grey-10">
      <div class="container">
        <div class="row items-center justify-between q-py-md">
          <div class="col-12 col-md-6">
            <div class="text-body2 text-grey-4">
              © {{ currentYear }} KIRU Odontología. Todos los derechos reservados.
            </div>
          </div>
          <div class="col-12 col-md-6 text-right">
            <div class="row items-center justify-end q-gutter-md">
              <q-btn 
                flat 
                dense 
                label="Política de Privacidad" 
                class="text-grey-4"
                @click="openPrivacyPolicy"
              />
              <q-btn 
                flat 
                dense 
                label="Términos y Condiciones" 
                class="text-grey-4"
                @click="openTermsConditions"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-footer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Datos reactivos
const currentYear = computed(() => new Date().getFullYear())

const socialMedia = ref([
  { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com/kiruodontologia' },
  { name: 'Instagram', icon: 'camera_alt', url: 'https://instagram.com/kiruodontologia' },
  { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com/kiruodontologia' },
  { name: 'YouTube', icon: 'play_circle', url: 'https://youtube.com/kiruodontologia' },
  { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com/company/kiruodontologia' }
])

const quickLinks = ref([
  { name: 'Inicio', route: '/' },
  { name: 'Conócenos', route: '/about' },
  { name: 'Servicios', route: '/services' },
  { name: 'Sucursal', route: '/branch' },
  { name: 'Preguntas Frecuentes', route: '/faq' },
  { name: 'Contacto', route: '/contact' }
])

const services = ref([
  { name: 'Blanqueamiento Dental', route: '/services#blanqueamiento' },
  { name: 'Ortodoncia', route: '/services#ortodoncia' },
  { name: 'Implantes Dentales', route: '/services#implantes' },
  { name: 'Endodoncia', route: '/services#endodoncia' },
  { name: 'Periodoncia', route: '/services#periodoncia' },
  { name: 'Prótesis Dentales', route: '/services#protesis' }
])

const contactInfo = ref({
  address: 'Av. Principal 123, Centro, Ciudad',
  phone: '+1 (555) 123-4567',
  email: 'info@kiruodontologia.com',
  schedule: 'Lun - Vie: 8:00 AM - 6:00 PM'
})

// Métodos
const navigateTo = (route) => {
  router.push(route)
}

const navigateToService = (route) => {
  router.push(route)
}

const openSocialLink = (url) => {
  window.open(url, '_blank')
}

const openWhatsApp = () => {
  const phoneNumber = '5551234567' // Reemplaza con tu número real
  const message = 'Hola, me gustaría agendar una cita en KIRU Odontología'
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}

const openPrivacyPolicy = () => {
  // Aquí podrías abrir un dialog o navegar a una página de política de privacidad
  console.log('Abrir política de privacidad')
}

const openTermsConditions = () => {
  // Aquí podrías abrir un dialog o navegar a una página de términos y condiciones
  console.log('Abrir términos y condiciones')
}
</script>

<style scoped>
.footer-layout {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.footer-main {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.footer-brand {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding-right: 24px;
}

.social-links .q-btn {
  transition: all 0.3s ease;
}

.social-links .q-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.footer-link-item {
  transition: all 0.3s ease;
  border-radius: 4px;
  margin-bottom: 4px;
}

.footer-link-item:hover {
  background-color: rgba(255, 152, 0, 0.1);
  transform: translateX(4px);
}

.contact-item {
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.contact-item:hover {
  color: #ff9800;
}

.whatsapp-btn {
  transition: all 0.3s ease;
}

.whatsapp-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .footer-main {
    padding: 24px 16px;
  }
  
  .footer-brand {
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-right: 0;
    padding-bottom: 24px;
    margin-bottom: 24px;
  }
  
  .footer-bottom .row {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-bottom .col-md-6:last-child {
    margin-top: 16px;
  }
}

/* Animaciones */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.footer-main > * {
  animation: fadeInUp 0.6s ease-out;
}
</style>
