<template>
  <div class="login-page flex flex-center">
    <q-card class="login-card row no-wrap animated zoomIn">
      <!-- Formulario de Login -->
      <div class="col-12 col-md-6 login-form-section">
        <div class="row items-center justify-center q-mb-lg animated fadeInDown">
          <q-img 
            :src="logo" 
            fit="contain"  
            style="width: 120px; height: 120px;"  
          />
        </div>

        <div class="text-center q-mb-md animated fadeInUp" style="animation-delay: 0.2s">
          <h5 class="text-h5 q-my-sm text-weight-bold">Iniciar Sesión</h5>
          <p class="text-grey-7">Accede a tu panel de control</p>
        </div>

        <q-form @submit="onSubmit" class="column q-gutter-md animated fadeInUp" style="animation-delay: 0.3s">
          <q-input 
            v-model="email" 
            label="Correo Electrónico" 
            outlined
            autofocus
            type="email"
            :rules="[
              val => !!val || 'El correo es requerido',
              val => isValidEmail(val) || 'Correo inválido'
            ]"
            lazy-rules
            class="form-input"
          >
            <template v-slot:prepend>
              <q-icon name="email" color="primary" />
            </template>
          </q-input>

          <q-input 
            v-model="password" 
            label="Contraseña" 
            outlined
            :type="showPassword ? 'text' : 'password'"
            :rules="[
              val => !!val || 'La contraseña es requerida',
              val => val.length >= 6 || 'Mínimo 6 caracteres'
            ]"
            lazy-rules
            class="form-input"
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="primary" />
            </template>
            <template v-slot:append>
              <q-icon 
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                color="grey-6"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <div class="row items-center justify-between">
            <q-checkbox 
              v-model="rememberMe" 
              label="Recordarme" 
              color="primary"
            />
            <q-btn 
              flat 
              dense 
              label="¿Olvidaste tu contraseña?" 
              color="primary"
              size="sm"
              @click="forgotPassword"
              no-caps
            />
          </div>

          <q-btn 
            unelevated 
            label="INGRESAR" 
            color="primary" 
            type="submit"
            :loading="isLoading"
            :disable="isLoading"
            class="primary-btn"
            size="lg"
            push
            no-caps
          />

          <q-btn 
            flat 
            label="CANCELAR" 
            color="grey-7"
            @click="goBack"
            :disable="isLoading"
            no-caps
            class="secondary-btn"
            
          />
        </q-form>

        <!-- Credenciales de prueba (solo desarrollo) -->
        <transition name="fade">
          <div v-if="isDevelopment" class="q-mt-lg">
            <q-separator class="q-mb-md" />
            <div class="text-caption text-grey-7 q-mb-sm">
              <q-icon name="info" size="xs" /> Credenciales de prueba:
            </div>
            <div class="test-credentials">
              <q-chip 
                v-for="(cred, index) in mockCredentials" 
                :key="cred.email"
                clickable
                @click="fillCredentials(cred)"
                :color="getRoleColor(cred.role)"
                text-color="white"
                size="sm"
                class="q-ma-xs animated bounceIn"
                :style="{ animationDelay: `${index * 0.1}s` }"
              >
                <q-avatar :color="getRoleColor(cred.role)" text-color="white">
                  {{ cred.role.charAt(0) }}
                </q-avatar>
                {{ cred.role }}
              </q-chip>
            </div>
          </div>
        </transition>

        <div class="q-mt-lg text-center">
          <small class="text-grey">© 2025 KIRU Odontología</small>
        </div>
      </div>

      <!-- Panel decorativo -->
      <div class="col-12 col-md-6 flex flex-center welcome-panel">
        <div class="q-pa-lg text-center welcome-content">
          <div class="welcome-icon q-mb-md animated bounceIn">
            <q-icon name="favorite" size="64px" color="white" />
          </div>
          <div class="text-h5 welcome-title animated fadeInUp" style="animation-delay: 0.2s">
            ¡Bienvenido de vuelta!
          </div>
          <div class="text-subtitle2 q-mt-md welcome-subtitle animated fadeInUp" style="animation-delay: 0.3s">
            Accede rápido a tu panel para administrar citas, pacientes y más.
          </div>
          <div class="q-mt-lg features-list">
            <div class="feature-item animated slideInLeft" style="animation-delay: 0.4s">
              <q-icon name="event" size="24px" />
              <span>Gestión de Citas</span>
            </div>
            <div class="feature-item animated slideInLeft" style="animation-delay: 0.5s">
              <q-icon name="people" size="24px" />
              <span>Control de Pacientes</span>
            </div>
            <div class="feature-item animated slideInLeft" style="animation-delay: 0.6s">
              <q-icon name="analytics" size="24px" />
              <span>Reportes y Estadísticas</span>
            </div>
          </div>
          <div class="q-mt-lg animated fadeIn" style="animation-delay: 0.7s">
            <q-btn 
              flat 
              round 
              dense 
              icon="info" 
              color="white" 
              class="q-mr-sm"
              @click="showInfo"
            >
              <q-tooltip>Información</q-tooltip>
            </q-btn>
            <q-btn 
              flat 
              round 
              dense 
              icon="phone" 
              color="white"
              @click="contactSupport"
            >
              <q-tooltip>Contactar Soporte</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'stores/authStore'
import { useNotifications } from 'src/composables/useNotifications'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { notifySuccess, notifyError, notifyInfo, showLoading, hideLoading } = useNotifications()

// Datos del formulario
const logo = '/KiruIMG/LogoKiru.png'
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

// Estado de carga
const isLoading = computed(() => authStore.isLoading)
const isDevelopment = import.meta.env.DEV

// Credenciales mock para desarrollo
const mockCredentials = computed(() => authStore.getMockCredentials())

// Validación de email
const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}

// Obtener color según rol
const getRoleColor = (role) => {
  const colors = {
    ADMIN: 'deep-purple',
    DENTIST: 'blue',
    CLIENT: 'teal'
  }
  return colors[role] || 'grey'
}

// Llenar credenciales de prueba
const fillCredentials = (cred) => {
  email.value = cred.email
  password.value = cred.password
  notifyInfo(`Credenciales de ${cred.role} cargadas`)
}

// Enviar formulario
const onSubmit = async () => {
  try {
    showLoading('Iniciando sesión...')
    
    const result = await authStore.login(email.value, password.value)
    
    hideLoading()
    
    if (result.success) {
      notifySuccess(`¡Bienvenido ${result.user.name}!`)

      // Redirigir a la ruta guardada o al dashboard
      const redirectTo = route.query.redirect || result.redirectTo
      router.push(redirectTo)
    } else {
      notifyError(result.message || 'Error al iniciar sesión')
    }
  } catch (error) {
    hideLoading()
    console.error('Error en login:', error)
    notifyError('Error inesperado al iniciar sesión')
  }
}

// Volver atrás
const goBack = () => {
  router.push('/')
}

// Olvidé mi contraseña
const forgotPassword = () => {
  $q.dialog({
    title: 'Recuperar Contraseña',
    message: 'Ingresa tu correo electrónico para recibir instrucciones de recuperación.',
    prompt: {
      model: '',
      type: 'email',
      label: 'Correo electrónico',
      isValid: val => isValidEmail(val)
    },
    cancel: {
      flat: true,
      label: 'Cancelar'
    },
    ok: {
      push: true,
      label: 'Enviar'
    },
    persistent: true
  }).onOk(data => {
    notifySuccess(`Se han enviado las instrucciones a ${data}`)
  })
}

// Mostrar información
const showInfo = () => {
  $q.dialog({
    title: 'Sistema de Gestión KIRU',
    message: 'Plataforma integral para la gestión de clínicas odontológicas. Administra pacientes, citas, tratamientos y más desde un solo lugar.',
    ok: {
      push: true,
      label: 'Entendido'
    }
  })
}

// Contactar soporte
const contactSupport = () => {
  $q.dialog({
    title: 'Contactar Soporte',
    message: '¿Necesitas ayuda? Contáctanos:',
    options: {
      type: 'radio',
      model: 'phone',
      items: [
        { label: 'Teléfono: +591 78900785', value: 'phone' },
        { label: 'Email: soporte@kiruodontologia.com', value: 'email' },
        { label: 'WhatsApp', value: 'whatsapp' }
      ]
    },
    cancel: {
      flat: true,
      label: 'Cancelar'
    },
    ok: {
      push: true,
      label: 'Seleccionar'
    }
  }).onOk(data => {
    if (data === 'whatsapp') {
      window.open('https://wa.me/59178900785?text=Necesito ayuda con el sistema', '_blank')
    }
  })
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-orange-dark) 100%);
}

.login-card {
  max-width: 900px;
  width: 100%;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
}

.login-form-section {
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
}

.body--dark .login-form-section {
  background: var(--bg-secondary);
}

.form-input {
  :deep(.q-field__control) {
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    
    &:hover {
      border-color: var(--primary-color);
    }
    
    &:focus-within {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px var(--primary-color-light);
    }
  }
}

/* Panel de bienvenida */
.welcome-panel {
  background: linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-orange-dark) 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.welcome-panel::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: pulse 15s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.1) rotate(180deg); }
}

.welcome-content {
  position: relative;
  z-index: 1;
  max-width: 350px;
}

.welcome-icon {
  animation: float 3s ease-in-out infinite;
}

.welcome-title {
  font-weight: 600;
  margin-bottom: 0;
}

.welcome-subtitle {
  opacity: 0.95;
  line-height: 1.6;
}

/* Features list */
.features-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  backdrop-filter: blur(10px);
  transition: all var(--transition-normal);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
  }
}

/* Credenciales de prueba */
.test-credentials {
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 2px dashed var(--border-medium);
}

.body--dark .test-credentials {
  background: var(--bg-tertiary);
  border-color: var(--border-dark);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 959px) {
  .login-card {
    flex-direction: column;
  }

  .welcome-panel {
    min-height: 250px;
    border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  }

  .login-form-section {
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  }
}

@media (max-width: 599px) {
  .login-page {
    padding: 10px;
  }

  .login-card {
    border-radius: var(--radius-lg);
  }

  .login-form-section {
    padding: var(--spacing-xl) var(--spacing-lg);
  }

  .welcome-panel {
    min-height: 200px;
  }

  .features-list {
    gap: var(--spacing-xs);
  }

  .feature-item {
    padding: 6px 12px;
    font-size: 14px;
  }
}
</style>