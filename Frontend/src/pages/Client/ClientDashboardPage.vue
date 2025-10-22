// pages/Client/ClientDashboardPage.vue
<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h1 class="q-ma-none text-h4">
          <q-icon name="home" class="text-primary" />
          My Dashboard
        </h1>
        <p class="text-subtitle2 text-grey-7 q-mt-sm">
          Welcome back, {{ sanitizedName }}
        </p>
      </div>
      <div class="col-auto">
        <q-chip
          color="info"
          text-color="white"
          icon="person"
        >
          <div v-text="authStore.userName"></div>
        </q-chip>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6">
        <q-card class="stat-card">
          <q-card-section>
            <div class="text-h6">3</div>
            <div class="text-subtitle2 text-grey-7">Upcoming Appointments</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6">
        <q-card class="stat-card">
          <q-card-section>
            <div class="text-h6">2</div>
            <div class="text-subtitle2 text-grey-7">Pending Quotes</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Patient Actions -->
    <q-card class="q-mb-lg">
      <q-card-section class="bg-info text-white">
        <div class="text-h6">My Appointments</div>
      </q-card-section>
      <q-card-section>
        <q-btn
          flat
          color="info"
          label="Book Appointment"
          icon="event_available"
          to="/reserves"
          class="full-width q-mb-md"
        />
        <q-btn
          flat
          color="info"
          label="View My Quotes"
          icon="description"
          to="/quotes"
          class="full-width q-mb-md"
        />
        <q-btn
          flat
          color="info"
          label="Quote History"
          icon="history"
          to="/HistoryQuotes"
          class="full-width"
        />
      </q-card-section>
    </q-card>

    <!-- Appointment List (Mock Data) -->
    <q-card>
      <q-card-section class="bg-grey-2">
        <div class="text-h6">Upcoming Appointments</div>
      </q-card-section>
      <q-list separator>
        <q-item v-for="i in 3" :key="i">
          <q-item-section avatar>
            <q-icon name="event" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ getDentistName(i) }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip
              size="sm"
              :color="getStatusColor(i)"
              text-color="white"
            >
              {{ getStatus(i) }}
            </q-chip>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script setup>
import { useAuthStore } from 'stores/authStore'
import { computed } from 'vue'

const authStore = useAuthStore()

// Sanitize user name to prevent XSS
const sanitizedName = computed(() => {
  const name = authStore.userName || 'User'
  // Create a temporary element and use textContent to sanitize
  const el = document.createElement('div')
  el.textContent = name
  return el.innerHTML
})

// Mock data functions
const getDentistName = (index) => {
  const names = [
    'Dr. García - Cleaning',
    'Dr. Martínez - Root Canal',
    'Dr. López - Follow-up'
  ]
  return names[index - 1] || 'Appointment'
}


const getStatus = (index) => {
  const statuses = ['Confirmed', 'Scheduled', 'Pending']
  return statuses[index - 1] || 'Pending'
}

const getStatusColor = (index) => {
  const colors = ['positive', 'primary', 'warning']
  return colors[index - 1] || 'grey'
}
</script>

<style scoped>
.stat-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}
</style>