<template>
  <q-page class="contact-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <q-container class="q-pa-xl">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <h1 class="text-h2 text-weight-bold text-primary q-mb-md animated fadeInLeft">
              Contáctanos
            </h1>
            <p class="text-h6 text-grey-7 q-mb-lg animated fadeInLeft" style="animation-delay: 0.2s">
              Estamos aquí para resolver todas tus dudas y ayudarte a mantener tu sonrisa perfecta.
              Contáctanos por cualquiera de nuestros medios disponibles.
            </p>
          </div>
          <div class="col-12 col-md-6 text-center">
            <div class="hero-image-container animated zoomIn" style="animation-delay: 0.3s">
              <q-img src="/KiruIMG/contact.png" alt="Contacto clínica dental" class="hero-image" fit="contain" />
            </div>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Información de Contacto Rápido -->
    <section class="quick-contact q-pa-xl">
      <q-container>
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-4 animated fadeInUp" style="animation-delay: 0.1s">
            <q-card class="contact-card text-center" flat bordered>
              <q-card-section class="q-pa-xl">
                <q-icon name="phone" size="3em" color="primary" class="q-mb-md" />
                <div class="text-h6 text-weight-bold q-mb-sm">Teléfono</div>
                <div class="text-body1 text-grey-7">{{ contactInfo.phone }}</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4 animated fadeInUp" style="animation-delay: 0.2s">
            <q-card class="contact-card text-center" flat bordered>
              <q-card-section class="q-pa-xl">
                <q-icon name="email" size="3em" color="secondary" class="q-mb-md" />
                <div class="text-h6 text-weight-bold q-mb-sm">Email</div>
                <div class="text-body1 text-grey-7">{{ contactInfo.email }}</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-4 animated fadeInUp" style="animation-delay: 0.3s">
            <q-card class="contact-card text-center" flat bordered>
              <q-card-section class="q-pa-xl">
                <q-icon name="location_on" size="3em" color="red" class="q-mb-md" />
                <div class="text-h6 text-weight-bold q-mb-sm">Ubicación</div>
                <div class="text-body1 text-grey-7">{{ contactInfo.address }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Formulario de Contacto y Horarios -->
    <section class="contact-form-section q-pa-xl">
      <q-container>
        <div class="row q-col-gutter-xl">
          <!-- Formulario de Contacto -->
          <div class="col-12 col-md-6 animated fadeInLeft">
            <q-card flat bordered class="contact-form-card">
              <q-card-section class="q-pa-xl">
                <div class="text-h5 text-weight-bold q-mb-md">
                  <q-icon name="message" class="q-mr-sm" color="primary" />
                  Envíanos un Mensaje
                </div>
                <p class="text-grey-7 q-mb-lg">
                  Completa el formulario y nos pondremos en contacto contigo lo antes posible.
                </p>

                <q-form @submit.prevent="onSubmitContact" ref="contactFormRef">
                  <div class="form-fields">
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="contactForm.name"
                          label="Nombre completo *"
                          outlined
                          :rules="[val => !!val || 'Nombre es requerido']"
                          lazy-rules
                          class="form-input"
                        >
                          <template v-slot:prepend>
                            <q-icon name="person" color="primary" />
                          </template>
                        </q-input>
                      </div>

                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="contactForm.phone"
                          label="Teléfono *"
                          outlined
                          :rules="[val => !!val || 'Teléfono es requerido']"
                          lazy-rules
                          class="form-input"
                        >
                          <template v-slot:prepend>
                            <q-icon name="phone" color="primary" />
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
                          lazy-rules
                          class="form-input"
                        >
                          <template v-slot:prepend>
                            <q-icon name="email" color="primary" />
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
                          lazy-rules
                          class="form-input"
                        >
                          <template v-slot:prepend>
                            <q-icon name="topic" color="primary" />
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
                          lazy-rules
                          class="form-input"
                        >
                          <template v-slot:prepend>
                            <q-icon name="message" color="primary" />
                          </template>
                        </q-input>
                      </div>

                      <div class="col-12">
                        <q-checkbox
                          v-model="contactForm.consent"
                          :error="!!consentError"
                          :error-message="consentError"
                        >
                          <span class="text-body2">
                            Acepto el tratamiento de mis datos personales según la
                            <a href="#" @click.prevent="showPrivacyPolicy = true" class="text-primary">
                              política de privacidad
                            </a>
                          </span>
                        </q-checkbox>
                      </div>

                      <div class="col-12">
                        <q-btn
                          type="submit"
                          color="primary"
                          size="lg"
                          label="Enviar Mensaje"
                          icon="send"
                          :loading="loading"
                          push
                          no-caps
                          class="full-width primary-btn"
                        />
                      </div>
                    </div>
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </div>

          <!-- Horarios y Info Adicional -->
          <div class="col-12 col-md-6 animated fadeInRight">
            <q-card flat bordered class="q-mb-lg">
              <q-card-section class="q-pa-xl">
                <div class="text-h6 text-weight-bold q-mb-md">
                  <q-icon name="access_time" class="q-mr-sm" color="primary" />
                  Horarios de Atención
                </div>
                <q-list bordered separator class="rounded-borders">
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
            </q-card>

            <q-card flat bordered>
              <q-card-section class="q-pa-xl">
                <div class="text-h6 text-weight-bold q-mb-md">
                  <q-icon name="info" class="q-mr-sm" color="primary" />
                  Información Adicional
                </div>

                <q-list>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="emergency" color="red" size="md" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-bold">Emergencias 24/7</q-item-label>
                      <q-item-label caption>{{ contactInfo.emergency }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-separator spaced />

                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="payment" color="green" size="md" />
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
      </q-container>
    </section>

    <!-- Social Media -->
    <section class="social-section q-pa-xl text-center">
      <q-container class="animated fadeIn">
        <h3 class="text-h5 text-weight-bold q-mb-md">Síguenos en Redes Sociales</h3>
        <p class="text-body1 text-grey-7 q-mb-lg">
          Mantente al día con consejos de salud dental y nuestras novedades
        </p>

        <div class="social-buttons">
          <q-btn
            v-for="(social, index) in socialMedia"
            :key="social.name"
            :color="social.color"
            round
            size="lg"
            :icon="social.icon"
            class="q-mx-sm animated bounceIn"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="openSocialMedia(social.url)"
          />
        </div>
      </q-container>
    </section>

    <!-- Dialog de Política de Privacidad -->
    <q-dialog v-model="showPrivacyPolicy" transition-show="scale" transition-hide="scale">
      <q-card style="max-width: 600px; width: 100%">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6 text-weight-bold">Política de Privacidad</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-pa-lg">
          <p class="text-body2">
            Sus datos personales serán tratados de acuerdo con la normativa vigente de protección de datos.
            La información proporcionada será utilizada únicamente para contactarlo y brindarle nuestros servicios.
            No compartimos su información con terceros sin su consentimiento expreso.
          </p>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
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
const contactFormRef = ref(null)
const consentError = ref('')

// Contact info
const contactInfo = {
  phone: '+591 78900785',
  email: 'info@clinicaboliviaKiru.com',
  address: 'Av. 6 de Octubre #567, Oruro, Bolivia',
  emergency: '+591 70123456'
}

// Form data
const contactForm = reactive({
  name: '',
  phone: '',
  email: '',
  subject: '',
  message: '',
  consent: false
})

// Options
const subjectOptions = [
  'Consulta general',
  'Solicitar cita',
  'Urgencia dental',
  'Información sobre tratamientos',
  'Reclamo o sugerencia',
  'Seguro dental'
]

const scheduleInfo = [
  { day: 'Lunes', hours: '8:00 - 18:00' },
  { day: 'Martes', hours: '8:00 - 18:00' },
  { day: 'Miércoles', hours: '8:00 - 18:00' },
  { day: 'Jueves', hours: '8:00 - 18:00' },
  { day: 'Viernes', hours: '8:00 - 18:00' },
  { day: 'Sábado', hours: '8:00 - 13:00' },
  { day: 'Domingo', hours: 'Cerrado' }
]

const socialMedia = [
  { name: 'Facebook', icon: 'fab fa-facebook-f', color: 'blue-8', url: 'https://facebook.com/clinicadental' },
  { name: 'Instagram', icon: 'fab fa-instagram', color: 'purple', url: 'https://instagram.com/clinicadental' },
  { name: 'WhatsApp', icon: 'fab fa-whatsapp', color: 'green', url: 'https://wa.me/59170123456' },
  { name: 'Twitter', icon: 'fab fa-twitter', color: 'light-blue', url: 'https://twitter.com/clinicadental' }
]

// Methods
const onSubmitContact = async () => {
  consentError.value = ''

  if (!contactFormRef.value) {
    return
  }

  const formValid = await contactFormRef.value.validate().catch(() => false)

  if (!contactForm.consent) {
    consentError.value = 'Debe aceptar el tratamiento de datos'
  }

  if (!formValid || consentError.value) {
    $q.notify({
      type: 'negative',
      message: 'Por favor corrige los campos resaltados',
      icon: 'warning'
    })
    return
  }

  loading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1200))

    $q.notify({
      type: 'positive',
      message: 'Mensaje enviado correctamente',
      caption: 'Te contactaremos pronto',
      icon: 'check_circle'
    })

    // Reset form
    contactForm.name = ''
    contactForm.phone = ''
    contactForm.email = ''
    contactForm.subject = ''
    contactForm.message = ''
    contactForm.consent = false

    if (contactFormRef.value) {
      contactFormRef.value.resetValidation()
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al enviar el mensaje',
      caption: 'Inténtalo nuevamente',
      icon: 'error',
    })
    return error
  } finally {
    loading.value = false
  }
}

const openSocialMedia = (url) => {
  window.open(url, '_blank')
}
</script>

<style lang="scss" scoped>
.contact-page {
  padding-bottom: 0;
}

.hero-section {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  min-height: 50vh;
  display: flex;
  align-items: center;
}

.body--dark .hero-section {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.hero-image-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.quick-contact {
  padding-top: 80px;
  padding-bottom: 80px;
}

.contact-card {
  transition: all var(--transition-normal);
  height: 100%;
  border-radius: var(--radius-xl);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary-color);
  }
}

.contact-form-section {
  padding-top: 80px;
  padding-bottom: 80px;
}

.contact-form-card {
  border-radius: var(--radius-xl);
  min-height: 600px;
}

.form-fields {
  .form-input {
    :deep(.q-field__control) {
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
      
      &:hover {
        border-color: var(--primary-color);
      }
    }
  }
}

.social-section {
  padding-top: 80px;
  padding-bottom: 80px;
  background: var(--bg-secondary);
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  
  .q-btn {
    transition: all var(--transition-normal);
    
    &:hover {
      transform: scale(1.15);
    }
  }
}

// Responsive
@media (max-width: 768px) {
  .hero-section {
    min-height: auto;
    padding: 40px 20px;
  }
  
  .quick-contact,
  .contact-form-section,
  .social-section {
    padding: 40px 20px;
  }
  
  .contact-form-card {
    min-height: auto;
  }
}
</style>