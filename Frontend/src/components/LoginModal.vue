<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="login-modal">
      <q-card-section class="login-header">
        <div class="text-h5 text-weight-bold text-center">Inicia sesión</div>
      </q-card-section>
      
      <q-card-section class="login-content">
        <!-- Botón de Google -->
        <q-btn
          class="google-btn full-width q-mb-md"
          @click="loginWithGoogle"
          :loading="googleLoading"
        >
          <q-icon name="fab fa-google" size="20px" class="q-mr-sm" />
          Iniciar sesión con Google
        </q-btn>
        
        <!-- Separador -->
        <div class="separator q-my-md">
          <div class="separator-line"></div>
          <span class="separator-text">o</span>
          <div class="separator-line"></div>
        </div>
        
        <!-- Formulario de email -->
        <q-form @submit="loginWithEmail" class="q-gutter-md">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            outlined
            :rules="[val => !!val || 'El email es requerido', val => isValidEmail(val) || 'Email inválido']"
            class="email-input"
          />
          
          <q-btn
            type="submit"
            color="primary"
            label="Continuar"
            class="continue-btn full-width"
            :loading="emailLoading"
          />
        </q-form>
        
        <!-- Enlaces adicionales -->
        <div class="login-footer q-mt-lg">
          <div class="text-center">
            <q-btn
              flat
              dense
              label="¿No tienes cuenta? Regístrate"
              color="primary"
              @click="openRegister"
              class="register-link"
            />
          </div>
          
          <div class="text-center q-mt-sm">
            <q-btn
              flat
              dense
              label="¿Olvidaste tu contraseña?"
              color="grey-6"
              @click="openForgotPassword"
              class="forgot-link"
            />
          </div>
        </div>
      </q-card-section>
      
      <!-- Botón de cerrar -->
      <q-btn
        icon="close"
        flat
        round
        dense
        class="close-btn"
        @click="closeModal"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'login-success', 'register-click', 'forgot-password-click'])

const $q = useQuasar()

// Controlar la visibilidad del modal
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Datos reactivos
const email = ref('')
const googleLoading = ref(false)
const emailLoading = ref(false)

// Métodos
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const loginWithGoogle = async () => {
  googleLoading.value = true
  
  try {
    // Simular autenticación con Google
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Aquí iría la lógica real de autenticación con Google
    console.log('Iniciando sesión con Google...')
    
    // Mostrar notificación de éxito
    $q.notify({
      type: 'positive',
      message: 'Inicio de sesión exitoso con Google',
      position: 'top'
    })
    
    // Emitir evento de éxito
    emit('login-success', { method: 'google', email: 'usuario@gmail.com' })
    
    // Cerrar modal
    closeModal()
    
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al iniciar sesión con Google',
      position: 'top'
    })
  } finally {
    googleLoading.value = false
  }
}

const loginWithEmail = async () => {
  emailLoading.value = true
  
  try {
    // Simular autenticación con email
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Iniciando sesión con email:', email.value)
    
    // Mostrar notificación de éxito
    $q.notify({
      type: 'positive',
      message: 'Código de verificación enviado a tu email',
      position: 'top'
    })
    
    // Emitir evento de éxito
    emit('login-success', { method: 'email', email: email.value })
    
    // Cerrar modal
    closeModal()
    
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al enviar código de verificación',
      position: 'top'
    })
  } finally {
    emailLoading.value = false
  }
}

const openRegister = () => {
  emit('register-click')
  closeModal()
}

const openForgotPassword = () => {
  emit('forgot-password-click')
  closeModal()
}

const closeModal = () => {
  isOpen.value = false
  email.value = ''
}
</script>

<style scoped>
.login-modal {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.login-header {
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.login-content {
  padding: 24px;
}

.google-btn {
  background: #ffffff;
  color: #1a1a1a;
  border: 1px solid #dadce0;
  border-radius: 8px;
  padding: 12px 16px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
}

.google-btn:hover {
  background: #f8f9fa;
  border-color: #dadce0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.google-btn .q-icon {
  color: #4285f4;
}

.separator {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.separator-line {
  flex: 1;
  height: 1px;
  background: #e0e0e0;
}

.separator-text {
  margin: 0 16px;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

.email-input {
  margin-bottom: 16px;
}

.continue-btn {
  background: #1976d2;
  color: white;
  border-radius: 8px;
  padding: 12px 16px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
}

.continue-btn:hover {
  background: #1565c0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.login-footer {
  border-top: 1px solid #e0e0e0;
  padding-top: 16px;
}

.register-link {
  font-size: 14px;
  font-weight: 500;
}

.forgot-link {
  font-size: 13px;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  color: #6b7280;
}

.close-btn:hover {
  color: #1a1a1a;
}

/* Modo oscuro */
.body--dark .login-modal {
  background: #2a2a2a !important;
  border: 1px solid #404040 !important;
}

.body--dark .login-header {
  border-bottom: 1px solid #404040 !important;
}

.body--dark .login-header .text-h5 {
  color: #ffffff !important;
}

.body--dark .google-btn {
  background: #2a2a2a !important;
  color: #ffffff !important;
  border-color: #404040 !important;
}

.body--dark .google-btn:hover {
  background: #333333 !important;
  border-color: #555555 !important;
}

.body--dark .separator-line {
  background: #404040 !important;
}

.body--dark .separator-text {
  color: #d1d5db !important;
}

.body--dark .continue-btn {
  background: #1976d2 !important;
}

.body--dark .continue-btn:hover {
  background: #1565c0 !important;
}

.body--dark .login-footer {
  border-top: 1px solid #404040 !important;
}

.body--dark .register-link {
  color: #1976d2 !important;
}

.body--dark .forgot-link {
  color: #9ca3af !important;
}

.body--dark .close-btn {
  color: #9ca3af !important;
}

.body--dark .close-btn:hover {
  color: #ffffff !important;
}

/* Responsive */
@media (max-width: 480px) {
  .login-modal {
    margin: 16px;
    max-width: calc(100vw - 32px);
  }
  
  .login-content {
    padding: 20px;
  }
  
  .google-btn,
  .continue-btn {
    padding: 14px 16px;
    font-size: 15px;
  }
}
</style>
