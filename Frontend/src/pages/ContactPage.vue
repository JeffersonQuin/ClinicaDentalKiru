<template>
  <q-page class="service-page">
    <!-- Hero Section -->
    <section class="hero-branch q-pa-xl">
      <div class="row items-center">
        <div class="col-12 col-md-6">
          <h1 class="text-h2 text-weight-bold text-primary q-mb-md">
            Contáctanos
          </h1>
          <p class="text-h6 text-grey-7 text-justify q-mb-lg">
            Estamos aquí para resolver todas tus dudas y ayudarte a mantener tu sonrisa perfecta. 
            Contáctanos por cualquiera de nuestros medios disponibles.
          </p>
        </div>
        <div class="col-12 col-md-6 text-center">
          <div class="hero-image-container">
            <q-img
              src="/KiruIMG/contact.png"
              alt="Contacto clínica dental"
              class="hero-image"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Información de Contacto Rápido -->
    <section class="quick-contact q-pa-xl bg-grey-1">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-4 col-sm-6">
          <q-card class="contact-card text-center" flat>
            <q-card-section>
              <q-icon name="phone" size="3em" color="primary" class="q-mb-md" />
              <div class="text-h6 text-weight-bold">Teléfono</div>
              <div class="text-body1 text-grey-7">{{ contactInfo.phone }}</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-4 col-sm-6">
          <q-card class="contact-card text-center" flat>
            <q-card-section>
              <q-icon name="email" size="3em" color="secondary" class="q-mb-md" />
              <div class="text-h6 text-weight-bold">Email</div>
              <div class="text-body1 text-grey-7">{{ contactInfo.email }}</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-4 col-sm-6">
          <q-card class="contact-card text-center" flat>
            <q-card-section>
              <q-icon name="location_on" size="3em" color="red" class="q-mb-md" />
              <div class="text-h6 text-weight-bold">Ubicación</div>
              <div class="text-body1 text-grey-7">{{ contactInfo.address }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Formulario de Contacto y Mapa -->
    <section class="contact-form-section q-pa-xl">
      <div class="row q-col-gutter-xl">
        <!-- Formulario de Contacto -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="contact-form-card">
            <q-card-section>
              <div class="text-h5 text-weight-bold q-mb-md">
                <q-icon name="message" class="q-mr-sm" />
                Envíanos un Mensaje
              </div>
              <p class="text-grey-7 q-mb-lg">
                Completa el formulario y nos pondremos en contacto contigo lo antes posible.
              </p>

              <q-form @submit="onSubmitContact" ref="contactForm">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="contactForm.name"
                      label="Nombre completo *"
                      outlined
                      :rules="[val => !!val || 'Nombre es requerido']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="person" />
                      </template>
                    </q-input>
                  </div>
                  
                  <div class="col-12 col-sm-6">
                    <q-input
                      v-model="contactForm.phone"
                      label="Teléfono *"
                      outlined
                      :rules="[val => !!val || 'Teléfono es requerido']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="phone" />
                      </template>
                    </q-input>
                  </div>
                  
                  <div class="col-12">
                    <q-input
                      v-model="contactForm.email"
                      label="Email *"
                      type="email"
                      outlined
                      :rules="[
                        val => !!val || 'Email es requerido',
                        val => /.+@.+\..+/.test(val) || 'Email debe ser válido'
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="email" />
                      </template>
                    </q-input>
                  </div>
                  
                  <div class="col-12">
                    <q-select
                      v-model="contactForm.subject"
                      :options="subjectOptions"
                      label="Motivo de consulta *"
                      outlined
                      :rules="[val => !!val || 'Seleccione un motivo']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="topic" />
                      </template>
                    </q-select>
                  </div>
                  
                  <div class="col-12">
                    <q-input
                      v-model="contactForm.message"
                      label="Mensaje *"
                      type="textarea"
                      rows="4"
                      outlined
                      :rules="[val => !!val || 'Mensaje es requerido']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="message" />
                      </template>
                    </q-input>
                  </div>
                  
                  <div class="col-12">
                    <q-checkbox
                      v-model="contactForm.consent"
                      :rules="[val => !!val || 'Debe aceptar el tratamiento de datos']"
                    >
                      <span class="text-body2">
                        Acepto el tratamiento de mis datos personales según la 
                        <a href="#" @click.prevent="showPrivacyPolicy = true" class="text-primary">
                          política de privacidad
                        </a>
                      </span>
                    </q-checkbox>
                  </div>
                  
                  <div class="col-12 text-center">
                    <q-btn
                      type="submit"
                      color="primary"
                      size="lg"
                      label="Enviar Mensaje"
                      icon="send"
                      :loading="loading"
                      class="full-width"
                    />
                  </div>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>

        <!-- Horarios  -->
        <div class="col-12 col-md-6">
          <q-card flat bordered class="q-mb-lg">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">
                <q-icon name="access_time" class="q-mr-sm" />
                Horarios de Atención
              </div>
              <q-card-section>
                <q-list>
                  <q-item v-for="schedule in scheduleInfo" :key="schedule.day">
                    <q-item-section>
                      <q-item-label class="text-weight-bold">{{ schedule.day }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{ schedule.hours }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card-section>
          </q-card>

          <!-- Información Adicional -->
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">
                <q-icon name="info" class="q-mr-sm" />
                Información Adicional
              </div>
              
              <q-list>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="emergency" color="red" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Emergencias 24/7</q-item-label>
                    <q-item-label caption>{{ contactInfo.emergency }}</q-item-label>
                  </q-item-section>
                </q-item>
                
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="payment" color="green" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">Métodos de Pago</q-item-label>
                    <q-item-label caption>Efectivo, Tarjetas, Transferencia</q-item-label>
                  </q-item-section>
                </q-item>
                
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Social Media Section -->
    <section class="social-section q-pa-xl text-center">
      <h3 class="text-h5 text-weight-bold q-mb-md">Síguenos en Redes Sociales</h3>
      <p class="text-body1 text-grey-7 q-mb-lg">
        Mantente al día con consejos de salud dental y nuestras novedades
      </p>
      
      <div class="social-buttons">
        <q-btn
          v-for="social in socialMedia"
          :key="social.name"
          :color="social.color"
          round
          size="lg"
          :icon="social.icon"
          class="q-mx-sm"
          @click="openSocialMedia(social.url)"
        />
      </div>
    </section>

     <!-- Dialog de Política de Privacidad -->
    <q-dialog v-model="showPrivacyPolicy">
      <q-card style="max-width: 600px; width: 100%">
        <q-card-section>
          <div class="text-h6 text-weight-bold">Política de Privacidad</div>
        </q-card-section>
        
        <q-card-section class="q-pt-none">
          <p class="text-body2">
            Sus datos personales serán tratados de acuerdo con la normativa vigente de protección de datos.
            La información proporcionada será utilizada únicamente para contactarlo y brindarle nuestros servicios.
            No compartimos su información con terceros sin su consentimiento expreso.
          </p>
        </q-card-section>
        
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const loading = ref(false)
const showPrivacyPolicy = ref(false)

// Información de contacto
const contactInfo = {
  phone: '+591 78900785',
  email: 'info@clinicaboliviaKiru.com',
  address: 'Av. 6 de Octubre #567, Oruro, Bolivia',
  emergency: '+591 70123456'
}

// Formulario de contacto
const contactForm = reactive({
  name: '',
  phone: '',
  email: '',
  subject: '',
  message: '',
  consent: false
})

// Opciones para el selector de motivo
const subjectOptions = [
  'Consulta general',
  'Solicitar cita',
  'Urgencia dental',
  'Información sobre tratamientos',
  'Reclamo o sugerencia',
  'Seguro dental'
]

// Horarios de atención
const scheduleInfo = [
  { day: 'Lunes', hours: '8:00 - 18:00' },
  { day: 'Martes', hours: '8:00 - 18:00' },
  { day: 'Miércoles', hours: '8:00 - 18:00' },
  { day: 'Jueves', hours: '8:00 - 18:00' },
  { day: 'Viernes', hours: '8:00 - 18:00' },
  { day: 'Sábado', hours: '8:00 - 13:00' },
  { day: 'Domingo', hours: 'Cerrado' }
]

// Redes sociales
const socialMedia = [
  { name: 'Facebook', icon: 'fab fa-facebook-f', color: 'blue-8', url: 'https://facebook.com/clinicadental' },
  { name: 'Instagram', icon: 'fab fa-instagram', color: 'purple', url: 'https://instagram.com/clinicadental' },
  { name: 'WhatsApp', icon: 'fab fa-whatsapp', color: 'green', url: 'https://wa.me/59170123456' },
  { name: 'Twitter', icon: 'fab fa-twitter', color: 'light-blue', url: 'https://twitter.com/clinicadental' }
]

// Métodos
const onSubmitContact = () => {
  loading.value = true
  
  // Simular envío
  setTimeout(() => {
    loading.value = false
    
    $q.notify({
      type: 'positive',
      message: 'Mensaje enviado correctamente',
      caption: 'Te contactaremos pronto'
    })
    
    // Limpiar formulario
    Object.keys(contactForm).forEach(key => {
      if (typeof contactForm[key] === 'boolean') {
        contactForm[key] = false
      } else {
        contactForm[key] = ''
      }
    })
  }, 2000)
}

const openSocialMedia = (url) => {
  window.open(url, '_blank')
}
</script>

<style lang="scss" scoped>
.contact-page {
  .hero-contact {
    background: linear-gradient(135deg, var(--q-primary) 0%, #1976d2 100%);
  }

  .contact-card {
    transition: transform 0.2s;
    height: 100%;
    
    &:hover {
      transform: translateY(-4px);
    }
  }

  .contact-form-card {
    min-height: 600px;
  }

  .social-buttons {
    .q-btn {
      margin: 0 8px;
      transition: transform 0.2s;
      
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>