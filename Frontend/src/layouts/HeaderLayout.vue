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

<style scoped>
/* Variables CSS */
:root {
  --primary-orange: #FF6B35;
  --primary-orange-dark: #FF5722;
  --secondary-blue: #2C5AA0;
  --text-dark: #1A1A1A;
  --text-light: #6B7280;
  --border-color: #E5E7EB;
  --background-white: #FFFFFF;
  --background-gray: #F9FAFB;
}

/* Header Layout */
.header-layout {
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
}

/* Banner de Promociones */
.promo-banner {
  background: linear-gradient(135deg, #FF6B35 0%, #FF5722 100%) !important;
  color: white !important;
  padding: 8px 0;
  position: relative;
  overflow: hidden;
}

.promo-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 200%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(50%); }
}

.promo-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.promo-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.promo-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.promo-text {
  font-weight: 500;
  font-size: 14px;
}

.promo-right {
  display: flex;
  align-items: center;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.language-selector {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 4px 12px;
  backdrop-filter: blur(10px);
}

.language-icon {
  opacity: 0.9;
}

.language-select {
  min-width: 45px;
}

.language-select .q-field__control {
  color: white;
  font-weight: 500;
}

.language-label {
  font-size: 12px;
  font-weight: 600;
}

.theme-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 4px 8px;
  backdrop-filter: blur(10px);
}

/* Navbar Principal */
.main-navbar {
  background: #FFFFFF !important;
  border-bottom: 1px solid #E5E7EB !important;
  backdrop-filter: blur(20px);
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.logo-section {
  flex-shrink: 0;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.logo-container:hover {
  transform: scale(1.02);
}

.tooth-icon {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF6B35, #FF5722);
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.tooth-icon svg {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.logo-text {
  line-height: 1.2;
}

.brand-name {
  font-size: 24px;
  font-weight: 800;
  color: #FF6B35 !important;
  letter-spacing: -0.5px;
}

.brand-tagline {
  font-size: 12px;
  font-weight: 500;
  color: #6B7280 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Navegación Desktop */
.desktop-nav {
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 40px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  color: #1A1A1A !important;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  padding: 8px 0;
  position: relative;
  transition: all 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-orange), var(--primary-orange-dark));
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #FF6B35 !important;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.nav-link.active {
  color: #FF6B35 !important;
  font-weight: 600;
}

/* Botones de Acción */
.action-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.login-btn {
  color: #1A1A1A !important;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: #F9FAFB !important;
}

.appointment-btn {
  background: linear-gradient(135deg, #FF6B35, #FF5722) !important;
  color: white !important;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 25px;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  transition: all 0.3s ease;
}

.appointment-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

/* Botón Mobile */
.mobile-menu-btn {
  display: none;
  color: var(--text-dark);
}

/* Menú Mobile */
.mobile-menu {
  background: #FFFFFF !important;
  border-bottom: 1px solid #E5E7EB !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.mobile-menu-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.mobile-nav-list {
  padding: 0;
}

.mobile-nav-item {
  border-radius: 12px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.mobile-nav-item:hover {
  background: #F9FAFB !important;
}

.mobile-nav-label {
  font-weight: 500;
  color: #1A1A1A !important;
}

.mobile-actions {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 12px;
}

.mobile-login-btn {
  flex: 1;
  color: #1A1A1A !important;
  font-weight: 500;
  padding: 12px;
  border: 1px solid #E5E7EB !important;
  border-radius: 12px;
}

.mobile-appointment-btn {
  flex: 2;
  background: linear-gradient(135deg, #FF6B35, #FF5722) !important;
  color: white !important;
  font-weight: 600;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

/* Media Queries */
@media (max-width: 1024px) {
  .desktop-nav {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
}

@media (max-width: 768px) {
  .navbar-content {
    padding: 0 16px;
    height: 70px;
  }
  
  .promo-content {
    padding: 0 16px;
  }
  
  .promo-text {
    font-size: 13px;
  }
  
  .brand-name {
    font-size: 20px;
  }
  
  .header-controls {
    gap: 12px;
  }
  
  .action-buttons {
    gap: 8px;
  }
  
  .login-btn {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .appointment-btn {
    padding: 8px 16px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .promo-left {
    flex: 1;
  }
  
  .promo-text {
    font-size: 12px;
  }
  
  .header-controls {
    gap: 8px;
  }
  
  .action-buttons .login-btn {
    display: none;
  }
  
  .appointment-btn {
    padding: 8px 12px;
    font-size: 13px;
  }
}

/* Los estilos de modo oscuro ahora están en app.scss global */
</style>