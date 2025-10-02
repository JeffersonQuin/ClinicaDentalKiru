<template>
  <q-dialog v-model="isOpen" maximized>
    <q-card class="new-appointment-form">
      <!-- Header del formulario -->
      <q-card-section class="form-header">
        <div class="row items-center justify-between">
          <div class="text-h4 text-weight-bold">Agenda tu cita fácilmente</div>
          <q-btn flat round icon="close" @click="closeModal" />
        </div>
        
        <!-- Indicador de pasos -->
        <div class="steps-indicator">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="step-item"
            :class="{ 
              'active': currentStep === index,
              'completed': currentStep > index 
            }"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-label">{{ step }}</div>
          </div>
        </div>
      </q-card-section>

      <!-- Contenido del formulario -->
      <q-card-section class="form-content">
        
        <!-- Paso 1: Motivo -->
        <div v-if="currentStep === 0" class="step-container">
          <div class="step-content">
            <!-- ¿Para quién es la cita? -->
            <div class="section">
              <h3 class="section-title">¿Para quién es la cita?</h3>
              <div class="patient-selection">
                <q-radio 
                  v-model="appointmentData.patientType" 
                  val="me" 
                  label="Para mí"
                  class="q-mb-md"
                />
                <q-radio 
                  v-model="appointmentData.patientType" 
                  val="other" 
                  label="Para otra persona"
                  class="q-mb-md"
                />
                
                <!-- Formulario para otra persona -->
                <div v-if="appointmentData.patientType === 'other'" class="other-patient-form">
                  <div class="row q-gutter-md">
                    <div class="col-12 col-md-4">
                      <q-input
                        v-model="otherPatient.nombre"
                        label="Nombre"
                        outlined
                        dense
                      />
                    </div>
                    <div class="col-12 col-md-4">
                      <q-input
                        v-model="otherPatient.apellidoPaterno"
                        label="Apellido Paterno"
                        outlined
                        dense
                      />
                    </div>
                    <div class="col-12 col-md-4">
                      <q-input
                        v-model="otherPatient.apellidoMaterno"
                        label="Apellido Materno"
                        outlined
                        dense
                      />
                    </div>
                  </div>
                  <div class="row q-gutter-md q-mt-md">
                    <div class="col-12 col-md-6">
                      <q-select
                        v-model="otherPatient.genero"
                        :options="['Masculino', 'Femenino']"
                        label="Género"
                        outlined
                        dense
                      />
                    </div>
                    <div class="col-12 col-md-6">
                      <q-input
                        v-model="otherPatient.telefono"
                        label="Teléfono"
                        outlined
                        dense
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Selección de servicio -->
            <div class="section">
              <h3 class="section-title">Selecciona el servicio</h3>
              <div class="services-grid">
                <div 
                  v-for="service in services" 
                  :key="service.id"
                  class="service-option"
                  :class="{ 'selected': appointmentData.service === service.id }"
                  @click="selectService(service.id)"
                >
                  <q-icon :name="service.icon" class="service-icon" size="32px" />
                  <span class="service-label">{{ service.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Paso 2: Clínica -->
        <div v-if="currentStep === 1" class="step-container">
          <div class="step-content">
            <h3 class="section-title">Selecciona la Clínica</h3>
            <div class="clinics-list">
              <!-- Sucursal 1 de Oruro -->
              <div 
                class="clinic-card"
                :class="{ 'selected': appointmentData.clinic === 1 }"
                @click="selectClinic(1)"
              >
                <div class="clinic-info">
                  <h4 class="clinic-name">Sucursal 1 de Oruro</h4>
                  <p class="clinic-address">Dirección: Av. 6 de Octubre #567, Oruro</p>
                  <p class="clinic-zone">Zona Norte: Calle Comercio esq. Av. 16 de Julio</p>
                </div>
                <div class="clinic-map">
                  <div class="map-placeholder">
                    <div class="map-streets">
                      <div class="street horizontal"></div>
                      <div class="street vertical"></div>
                      <div class="location-pin">
                        <q-icon name="place" color="blue" size="24px" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sucursal 2 de Oruro -->
              <div 
                class="clinic-card"
                :class="{ 'selected': appointmentData.clinic === 2 }"
                @click="selectClinic(2)"
              >
                <div class="clinic-info">
                  <h4 class="clinic-name">Sucursal 2 de Oruro</h4>
                  <p class="clinic-address">Dirección: Av. Ayacucho #345, Cochabamba</p>
                  <p class="clinic-zone">Zona Central: Calle 25 de Mayo esq. Av. Oquendo</p>
                </div>
                <div class="clinic-map">
                  <div class="map-placeholder">
                    <div class="map-streets">
                      <div class="street horizontal"></div>
                      <div class="street vertical"></div>
                      <div class="location-pin">
                        <q-icon name="place" color="blue" size="24px" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Paso 3: Fecha y Hora -->
        <div v-if="currentStep === 2" class="step-container">
          <div class="step-content">
            <div class="row">
              <div class="col-12 col-md-6">
                <h3 class="section-title">Selecciona la fecha</h3>
                <q-date
                  v-model="appointmentData.date"
                  :options="dateOptions"
                  class="calendar"
                />
              </div>
              <div class="col-12 col-md-6">
                <h3 class="section-title">Selecciona la hora</h3>
                <div class="time-slots">
                  <div 
                    v-for="time in availableTimeSlots" 
                    :key="time"
                    class="time-slot"
                    :class="{ 'selected': appointmentData.time === time }"
                    @click="appointmentData.time = time"
                  >
                    {{ time }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Paso 4: Validación -->
        <div v-if="currentStep === 3" class="step-container">
          <div class="step-content">
            <h3 class="section-title">Confirma tu cita</h3>
            <div class="appointment-summary">
              <div class="summary-item">
                <strong>Paciente:</strong> 
                <span>{{ appointmentData.patientType === 'me' ? 'Yo mismo' : `${otherPatient.nombre} ${otherPatient.apellidoPaterno}` }}</span>
              </div>
              <div class="summary-item">
                <strong>Servicio:</strong> 
                <span>{{ services.find(s => s.id === appointmentData.service)?.name || 'No seleccionado' }}</span>
              </div>
              <div class="summary-item">
                <strong>Clínica:</strong> 
                <span>{{ appointmentData.clinic === 1 ? 'Sucursal 1 de Oruro' : 'Sucursal 2 de Oruro' }}</span>
              </div>
              <div class="summary-item">
                <strong>Fecha:</strong> 
                <span>{{ appointmentData.date }}</span>
              </div>
              <div class="summary-item">
                <strong>Hora:</strong> 
                <span>{{ appointmentData.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- Footer con botones de navegación -->
      <q-card-actions class="form-footer">
        <q-btn 
          flat 
          label="ATRÁS" 
          @click="previousStep"
          :disable="currentStep === 0"
          class="back-btn"
        />
        <q-space />
        <q-btn 
          v-if="currentStep < 3"
          color="primary" 
          label="SIGUIENTE" 
          @click="nextStep"
          class="next-btn"
        />
        <q-btn 
          v-else
          color="primary" 
          label="CONFIRMAR CITA" 
          @click="submitAppointment"
          class="confirm-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'appointment-submitted'])

// Quasar
const $q = useQuasar()

// Estado del modal
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Estado del formulario
const currentStep = ref(0)
const steps = ['Motivo', 'Clínica', 'Fecha y Hora', 'Validación']

// Datos del formulario
const appointmentData = ref({
  patientType: 'me',
  service: null,
  clinic: null,
  date: '',
  time: ''
})

const otherPatient = ref({
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  genero: '',
  telefono: ''
})

// Servicios disponibles
const services = ref([
  { id: 1, name: 'Limpieza Dental', icon: 'cleaning_services' },
  { id: 2, name: 'Extracción', icon: 'medical_services' },
  { id: 3, name: 'Ortodoncia', icon: 'straighten' },
  { id: 4, name: 'Endodoncia', icon: 'healing' },
  { id: 5, name: 'Prótesis', icon: 'build' },
  { id: 6, name: 'Blanqueamiento', icon: 'auto_fix_high' }
])

// Horarios disponibles
const availableTimeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
]

// Métodos
const selectService = (serviceId) => {
  appointmentData.value.service = serviceId
}

const selectClinic = (clinicId) => {
  appointmentData.value.clinic = clinicId
}

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const closeModal = () => {
  isOpen.value = false
  resetForm()
}

const resetForm = () => {
  currentStep.value = 0
  appointmentData.value = {
    patientType: 'me',
    service: null,
    clinic: null,
    date: '',
    time: ''
  }
  otherPatient.value = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    genero: '',
    telefono: ''
  }
}

const submitAppointment = () => {
  // Validar datos
  if (!appointmentData.value.service) {
    $q.notify({
      type: 'negative',
      message: 'Por favor selecciona un servicio'
    })
    return
  }
  
  if (!appointmentData.value.clinic) {
    $q.notify({
      type: 'negative',
      message: 'Por favor selecciona una clínica'
    })
    return
  }
  
  if (!appointmentData.value.date) {
    $q.notify({
      type: 'negative',
      message: 'Por favor selecciona una fecha'
    })
    return
  }
  
  if (!appointmentData.value.time) {
    $q.notify({
      type: 'negative',
      message: 'Por favor selecciona una hora'
    })
    return
  }

  // Simular envío
  $q.notify({
    type: 'positive',
    message: '¡Cita agendada exitosamente!'
  })
  
  emit('appointment-submitted', appointmentData.value)
  closeModal()
}

// Opciones de fecha (solo fechas futuras)
const dateOptions = (date) => {
  const today = new Date()
  const selectedDate = new Date(date)
  return selectedDate >= today
}

// Watch para resetear cuando se cierra el modal
watch(isOpen, (newValue) => {
  if (!newValue) {
    resetForm()
  }
})
</script>
