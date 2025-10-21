<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Logo/Header -->
      <div class="login-header">
        <h1 class="text-h4 text-weight-bold text-primary">
          Sistema Dental
        </h1>
        <p class="text-subtitle2 text-grey-7">
          Portal de Autenticación Segura
        </p>
      </div>

      <!-- Login Form -->
      <q-form @submit="handleLogin" class="login-form">
        <!-- Email Input -->
        <div class="form-group">
          <label for="email" class="text-weight-medium">Correo Electrónico</label>
          <q-input
            id="email"
            v-model="formState.email"
            type="email"
            outlined
            dense
            :disable="formState.isLoading"
            :rules="[val => val && val.length > 0 || 'El correo es requerido']"
            class="input-field"
            @keyup.enter="handleLogin"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>
        </div>

        <!-- Password Input -->
        <div class="form-group">
          <label for="password" class="text-weight-medium">Contraseña</label>
          <q-input
            id="password"
            v-model="formState.password"
            :type="formState.showPassword ? 'text' : 'password'"
            outlined
            dense
            :disable="formState.isLoading"
            :rules="[val => val && val.length > 0 || 'La contraseña es requerida']"
            class="input-field"
            @keyup.enter="handleLogin"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="formState.showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="togglePasswordVisibility"
              />
            </template>
          </q-input>
        </div>

        <!-- Submit Button -->
        <q-btn
          type="submit"
          color="primary"
          label="Iniciar Sesión"
          size="lg"
          class="full-width login-button"
          :loading="formState.isLoading"
          :disable="formState.isLoading"
        />
      </q-form>

      <!-- Error Message (Sanitized) -->
      <q-banner
        v-if="formState.errorMessage"
        class="bg-negative text-white q-mt-md"
        dense
      >
        <template v-slot:avatar>
          <q-icon name="warning" />
        </template>
        <div v-text="formState.errorMessage"></div>
      </q-banner>

      <!-- Success Message -->
      <q-banner
        v-if="formState.successMessage"
        class="bg-positive text-white q-mt-md"
        dense
      >
        <template v-slot:avatar>
          <q-icon name="check_circle" />
        </template>
        <div v-text="formState.successMessage"></div>
      </q-banner>

      <!-- Development Credentials Section -->
      <div v-if="isDevelopmentMode" class="dev-credentials q-mt-lg">
        <q-expansion-item
          header-class="text-weight-bold text-info"
          icon="info"
          label="Credenciales de Desarrollo (Eliminar en Producción)"
          class="bg-blue-1"
        >
          <div class="q-pa-md">
            <p class="text-caption text-grey-8 q-mb-md">
              <q-icon name="warning" class="text-warning" />
              Estas credenciales son solo para pruebas y no deben usarse en producción.
            </p>

            <!-- Credentials Table -->
            <div class="credentials-list">
              <div
                v-for="(cred, index) in mockCredentials"
                :key="index"
                class="credential-item"
              >
                <div class="role-badge">
                  <q-chip
                    :color="getRoleColor(cred.role)"
                    text-color="white"
                    size="sm"
                    icon="person"
                  >
                    {{ getSpanishRole(cred.role) }}
                  </q-chip>
                </div>

                <div class="credential-details">
                  <p class="text-weight-medium q-mb-xs">
                    {{ cred.name }}
                  </p>
                  <p class="text-caption text-grey-7 q-mb-xs">
                    <span class="text-weight-bold">Correo:</span>
                    <code v-text="cred.email"></code>
                  </p>
                  <p class="text-caption text-grey-7">
                    <span class="text-weight-bold">Contraseña:</span>
                    <code v-text="cred.password"></code>
                  </p>
                </div>

                <!-- Copy Button -->
                <q-btn
                  flat
                  dense
                  round
                  icon="content_copy"
                  size="sm"
                  @click="copyToClipboard(cred.email)"
                  class="copy-btn"
                >
                  <q-tooltip>Copiar correo</q-tooltip>
                </q-btn>
              </div>
            </div>
          </div>
        </q-expansion-item>
      </div>

      <!-- Footer -->
      <div class="login-footer q-mt-lg text-center">
        <p class="text-caption text-grey-7">
          © 2025 Sistema Dental. Todos los derechos reservados.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const quasar = useQuasar()

// Form state
const formState = reactive({
  email: '',
  password: '',
  showPassword: false,
  isLoading: false,
  errorMessage: '',
  successMessage: ''
})

const mockCredentials = ref([])

// Computed
const isDevelopmentMode = computed(() => import.meta.env.MODE !== 'production')

// Methods
const togglePasswordVisibility = () => {
  formState.showPassword = !formState.showPassword
}

const handleLogin = async () => {
  try {
    // Clear previous messages
    formState.errorMessage = ''
    formState.successMessage = ''

    // Validate form
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formState.email)) {
      formState.errorMessage = 'Por favor ingrese un correo válido'
      return
    }

    if (formState.password.length < 1) {
      formState.errorMessage = 'Por favor ingrese su contraseña'
      return
    }

    formState.isLoading = true

    // Attempt login
    const result = await authStore.login(formState.email, formState.password)

    if (result.success) {
      // Show success message
      formState.successMessage = '¡Inicio de sesión exitoso!'
      
      // Clear form
      formState.email = ''
      formState.password = ''

      // Show notification using Quasar
      quasar.notify({
        type: 'positive',
        message: '¡Bienvenido al Sistema Dental!',
        position: 'top',
        timeout: 2000
      })

      // Redirect based on role
      setTimeout(() => {
        const roleRedirects = {
          ADMIN: '/admin-dashboard',
          DENTIST: '/dentist-dashboard',
          CLIENT: '/client-dashboard'
        }

        const redirectPath = roleRedirects[authStore.userRole] || '/dashboard'
        router.push(redirectPath)
      }, 500)
    } else {
      formState.errorMessage = result.message || 'Error en la autenticación'
      quasar.notify({
        type: 'negative',
        message: formState.errorMessage,
        position: 'top',
        timeout: 3000
      })
    }
  } catch (error) {
    formState.errorMessage = 'Error inesperado durante el inicio de sesión'
    quasar.notify({
      type: 'negative',
      message: formState.errorMessage,
      position: 'top',
      timeout: 3000
    })
    console.error('Login error:', error)
  } finally {
    formState.isLoading = false
  }
}

const getRoleColor = (role) => {
  const colorMap = {
    ADMIN: 'negative',
    DENTIST: 'primary',
    CLIENT: 'info'
  }
  return colorMap[role] || 'grey'
}

const getSpanishRole = (role) => {
  const roleMap = {
    ADMIN: 'Administrador',
    DENTIST: 'Dentista',
    CLIENT: 'Cliente'
  }
  return roleMap[role] || role
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    quasar.notify({
      type: 'positive',
      message: '¡Copiado al portapapeles!',
      position: 'top',
      timeout: 1500
    })
  }).catch(err => {
    console.error('Error al copiar:', err)
    quasar.notify({
      type: 'negative',
      message: 'Error al copiar',
      position: 'top',
      timeout: 1500
    })
  })
}

// Lifecycle
onMounted(() => {
  // Get mock credentials for development
  if (isDevelopmentMode.value) {
    mockCredentials.value = authStore.getMockCredentials()
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 40px;
  width: 100%;
  max-width: 420px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  margin: 0 0 8px 0;
}

.login-header p {
  margin: 0;
  color: #999;
}

.login-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.input-field {
  width: 100%;
}

.login-button {
  height: 48px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.dev-credentials {
  border-left: 3px solid #2196f3;
}

.credentials-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.credential-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.role-badge {
  flex-shrink: 0;
}

.credential-details {
  flex: 1;
  min-width: 0;
}

.credential-details code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #d32f2f;
}

.copy-btn {
  flex-shrink: 0;
}

.login-footer {
  border-top: 1px solid #eee;
  padding-top: 16px;
  margin-top: 24px;
}

/* Responsive */
@media (max-width: 600px) {
  .login-card {
    padding: 24px;
  }

  .credential-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>