<template>
  <div class="header-layout">
    <!-- Banner de Promociones -->
    <div class="promo-banner">
      <div class="promo-content">
        <div class="promo-left">
          <q-icon name="local_offer" size="18px" class="promo-icon" />
          <span class="promo-text">¡Descubre nuestras promociones especiales!</span>
        </div>
        
        <div class="promo-right">
          <div class="header-controls">
            <!-- Selector de idioma -->
            <div class="language-selector">
              <q-icon name="language" size="16px" class="language-icon" />
              <q-select
                v-model="selectedLanguage"
                :options="languages"
                dense
                borderless
                class="language-select"
                emit-value
                map-options
                dropdown-icon="expand_more"
              >
                <template v-slot:selected>
                  <span class="language-label">{{ getLanguageLabel(selectedLanguage) }}</span>
                </template>
              </q-select>
            </div>
            
            <!-- Dark mode toggle -->
            <div class="theme-toggle">
              <q-icon :name="darkMode ? 'light_mode' : 'dark_mode'" size="16px" />
              <q-toggle
                v-model="darkMode"
                color="white"
                size="sm"
                @update:model-value="toggleDarkMode"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de Navegación Principal -->
    <div class="main-navbar">
      <div class="navbar-content">
        <!-- Logo KIRU -->
        <div class="logo-section">
          <div class="logo-container">
            <div class="tooth-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 4C12 4 8 6 8 12C8 18 10 24 12 26C13 27 15 28 16 28C17 28 19 27 20 26C22 24 24 18 24 12C24 6 20 4 16 4Z" fill="#FF6B35" stroke="#FF5722" stroke-width="1"/>
                <circle cx="13" cy="14" r="1.5" fill="white"/>
                <circle cx="19" cy="14" r="1.5" fill="white"/>
              </svg>
            </div>
            
            <div class="logo-text">
              <div class="brand-name">KIRU</div>
              <div class="brand-tagline">Odontología Integral</div>
            </div>
          </div>
        </div>

        <!-- Navegación Desktop -->
        <nav class="desktop-nav">
          <div class="nav-links">
            <router-link 
              to="/" 
              class="nav-link"
              :class="{ 'active': $route.path === '/' }"
            >
              Inicio
            </router-link>
            <router-link 
              to="/about" 
              class="nav-link"
              :class="{ 'active': $route.path === '/about' }"
            >
              Conócenos
            </router-link>
            <router-link 
              to="/services" 
              class="nav-link"
              :class="{ 'active': $route.path === '/services' }"
            >
              Servicios
            </router-link>
            <router-link 
              to="/branch" 
              class="nav-link"
              :class="{ 'active': $route.path === '/branch' }"
            >
              Sucursales
            </router-link>
            <router-link 
              to="/faq" 
              class="nav-link"
              :class="{ 'active': $route.path === '/faq' }"
            >
              FAQ
            </router-link>
            <router-link 
              to="/contact" 
              class="nav-link"
              :class="{ 'active': $route.path === '/contact' }"
            >
              Contacto
            </router-link>
          </div>
        </nav>

        <!-- Botones de Acción -->
        <div class="action-buttons">
          <router-link 
            to="/login" 
            class="login-btn"
            :class="{ 'active': $route.path === '/login' }"
          >
          Iniciar Sesión
          </router-link>
          <q-btn 
            unelevated
            label="Agendar Cita" 
            class="appointment-btn"
            @click="openAppointmentDialog"
          >
            <q-icon name="event" size="18px" class="q-ml-xs" />
          </q-btn>
        </div>

        <!-- Botón Menú Mobile -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          class="mobile-menu-btn"
          @click="toggleMobileMenu"
        />
      </div>
    </div>

    <!-- Menú Mobile -->
    <q-slide-transition>
      <div v-show="mobileMenuOpen" class="mobile-menu">
        <div class="mobile-menu-content">
          <q-list class="mobile-nav-list">
            <q-item 
              clickable 
              v-ripple 
              class="mobile-nav-item"
              @click="navigateAndClose('/')"
            >
              <q-item-section avatar>
                <q-icon name="home" size="20px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="mobile-nav-label">Inicio</q-item-label>
              </q-item-section>
            </q-item>
            
            <q-item 
              clickable 
              v-ripple 
              class="mobile-nav-item"
              @click="navigateAndClose('/about')"
            >
              <q-item-section avatar>
                <q-icon name="info" size="20px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="mobile-nav-label">Conócenos</q-item-label>
              </q-item-section>
            </q-item>
            
            <q-item 
              clickable 
              v-ripple 
              class="mobile-nav-item"
              @click="navigateAndClose('/services')"
            >
              <q-item-section avatar>
                <q-icon name="medical_services" size="20px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="mobile-nav-label">Servicios</q-item-label>
              </q-item-section>
            </q-item>
            
            <q-item 
              clickable 
              v-ripple 
              class="mobile-nav-item"
              @click="navigateAndClose('/contact')"
            >
              <q-item-section avatar>
                <q-icon name="contact_mail" size="20px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="mobile-nav-label">Contacto</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          
          <div class="mobile-actions">
            <q-btn 
              flat
              label="Iniciar Sesión" 
              class="mobile-login-btn"
              @click="openLoginDialog"
            />
            <q-btn 
              unelevated
              label="Agendar Cita" 
              class="mobile-appointment-btn"
              @click="openAppointmentDialog"
            >
              <q-icon name="event" size="16px" class="q-ml-xs" />
            </q-btn>
          </div>
        </div>
      </div>
    </q-slide-transition>

    <!-- Modal de Login -->
    <LoginModal 
      v-model="loginDialog"
      @login-success="onLoginSuccess"
      @register-click="onRegisterClick"
      @forgot-password-click="onForgotPasswordClick"
    />

    <!-- Modal de Citas -->
    <AppointmentModal 
      v-model="appointmentDialog"
      @new-appointment="onNewAppointment"
      @history="onHistory"
      @cancel="onAppointmentCancel"
    />

    <!-- Formulario de Nueva Cita -->
    <NewAppointmentForm 
      v-model="newAppointmentForm"
      @appointment-submitted="onAppointmentSubmitted"
    />

    <!-- Historial de Citas -->
    <AppointmentHistory 
      v-model="appointmentHistory"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import LoginModal from 'components/LoginModal.vue'
import AppointmentModal from 'components/AppointmentModal.vue'
import NewAppointmentForm from 'components/NewAppointmentForm.vue'
import AppointmentHistory from 'components/AppointmentHistory.vue'

const $q = useQuasar()
const router = useRouter()

// Datos reactivos
const selectedLanguage = ref('es')
const darkMode = ref(false)
const mobileMenuOpen = ref(false)
const loginDialog = ref(false)
const appointmentDialog = ref(false)
const newAppointmentForm = ref(false)
const appointmentHistory = ref(false)

const languages = [
  { label: 'Español', value: 'es' },
  { label: 'English', value: 'en' },
  { label: 'Português', value: 'pt' }
]

// Métodos
const getLanguageLabel = (value) => {
  const lang = languages.find(l => l.value === value)
  return lang ? lang.label.substring(0, 2).toUpperCase() : 'ES'
}

const toggleDarkMode = (value) => {
  $q.dark.set(value)
  localStorage.setItem('darkMode', value)
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const navigateAndClose = (path) => {
  router.push(path)
  mobileMenuOpen.value = false
}

const openLoginDialog = () => {
  mobileMenuOpen.value = false
  loginDialog.value = true
}

const openAppointmentDialog = () => {
  mobileMenuOpen.value = false
  appointmentDialog.value = true
}

// Funciones para manejar eventos del modal de login
const onLoginSuccess = (loginData) => {
  console.log('Login exitoso:', loginData)
  // Aquí implementarías la lógica después del login exitoso
  // Por ejemplo: guardar token, redirigir, actualizar estado del usuario, etc.
}

const onRegisterClick = () => {
  console.log('Abrir registro')
  // Aquí implementarías la lógica para abrir el modal de registro
}

const onForgotPasswordClick = () => {
  console.log('Recuperar contraseña')
  // Aquí implementarías la lógica para recuperar contraseña
}

// Funciones para manejar eventos del modal de citas
const onNewAppointment = () => {
  newAppointmentForm.value = true
}

const onHistory = () => {
  appointmentHistory.value = true
}

const onAppointmentCancel = () => {
  console.log('Cancelar modal de citas')
  // Aquí implementarías cualquier lógica adicional al cancelar
}

// Función para manejar el envío del formulario de nueva cita
const onAppointmentSubmitted = (appointmentData) => {
  console.log('Cita agendada exitosamente:', appointmentData)
  // Aquí implementarías la lógica para procesar la cita agendada
  // Por ejemplo: guardar en base de datos, enviar notificación, etc.
}

// Cargar preferencias
const loadPreferences = () => {
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode !== null) {
    darkMode.value = savedDarkMode === 'true'
    $q.dark.set(darkMode.value)
  }
}

loadPreferences()
</script>

<!-- Los estilos están en app.scss global -->