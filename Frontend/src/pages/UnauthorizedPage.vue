<template>
  <div class="error-container">
    <div class="error-content">
      <!-- Icon -->
      <div class="error-icon">
        <q-icon name="lock" size="80px" color="negative" />
      </div>

      <!-- Error Title -->
      <h1 class="text-h3 text-weight-bold text-negative q-mt-lg">
        Access Denied
      </h1>

      <!-- Error Message -->
      <p class="text-subtitle1 text-grey-7 q-mt-md" v-text="errorMessage"></p>

      <!-- User Role Info -->
      <q-card class="info-card q-my-lg">
        <q-card-section class="bg-grey-2">
          <div class="text-subtitle2 text-weight-bold">Your Current Role</div>
        </q-card-section>
        <q-card-section>
          <q-chip
            :color="getRoleColor()"
            text-color="white"
            icon="verified"
            size="lg"
          >
            <div v-text="authStore.userRole || 'Not Authenticated'"></div>
          </q-chip>
          <p class="text-caption text-grey-7 q-mt-md">
            {{ roleDescription }}
          </p>
        </q-card-section>
      </q-card>

      <!-- Action Buttons -->
      <div class="actions q-mt-xl">
        <q-btn
          color="primary"
          label="Go to My Dashboard"
          icon="dashboard"
          size="lg"
          :to="getDashboardPath()"
          class="q-mr-md"
        />
        <q-btn
          flat
          color="primary"
          label="Go Home"
          icon="home"
          size="lg"
          to="/"
        />
      </div>

      <!-- Logout Option -->
      <div class="q-mt-lg">
        <q-btn
          flat
          color="negative"
          label="Logout and Try Another Account"
          icon="logout"
          @click="handleLogout"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const errorMessage = computed(() => {
  return "You don't have permission to access this page. Please contact your administrator if you believe this is an error."
})

const roleDescription = computed(() => {
  const descriptions = {
    ADMIN: 'Administrator - Full system access',
    DENTIST: 'Dentist - Patient care and scheduling',
    CLIENT: 'Client - View appointments and quotes'
  }
  return descriptions[authStore.userRole] || 'Unauthorized user'
})

const getRoleColor = () => {
  const colors = {
    ADMIN: 'negative',
    DENTIST: 'primary',
    CLIENT: 'info'
  }
  return colors[authStore.userRole] || 'grey'
}

const getDashboardPath = () => {
  const dashboardMap = {
    ADMIN: '/admin-dashboard',
    DENTIST: '/dentist-dashboard',
    CLIENT: '/client-dashboard'
  }
  return dashboardMap[authStore.userRole] || '/dashboard'
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 16px;
}

.error-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 40px;
  max-width: 500px;
  text-align: center;
}

.error-icon {
  display: flex;
  justify-content: center;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.info-card {
  background: #f5f5f5;
  border-left: 4px solid #f44336;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 600px) {
  .error-content {
    padding: 24px;
  }

  .actions {
    flex-direction: column;
  }

  .actions .q-mr-md {
    margin-right: 0 !important;
    margin-bottom: 12px;
  }
}
</style>