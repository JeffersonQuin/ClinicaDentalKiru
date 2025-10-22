<template>
  <q-page class="faq-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <q-container class="q-pa-xl">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <h1 class="text-h2 text-weight-bold text-primary q-mb-md animated fadeInLeft">
              Preguntas Frecuentes
            </h1>
            <p class="text-h6 text-grey-7 q-mb-lg animated fadeInLeft" style="animation-delay: 0.2s">
              En esta sección respondemos las dudas más comunes sobre tratamientos y atención dental.
              Te ayudamos a entender los procesos, costos y cuidados posteriores a cada procedimiento.
            </p>

            <div class="animated fadeInUp" style="animation-delay: 0.4s">
              <q-input
                v-model="query"
                size="lg"
                color="primary"
                placeholder="Buscar preguntas..."
                outlined
                clearable
                @input="onInput"
                @keyup.enter="runSearchNow"
                class="search-input-hero"
              >
                <template v-slot:prepend>
                  <q-icon name="search" color="primary" />
                </template>
              </q-input>
            </div>
          </div>

          <div class="col-12 col-md-6 text-center">
            <div class="hero-image-container animated zoomIn" style="animation-delay: 0.3s">
              <q-img 
                src="/KiruIMG/questions.png" 
                alt="Preguntas frecuentes" 
                class="hero-image"
                fit="contain"
              />
            </div>
          </div>
        </div>
      </q-container>
    </section>

    <!-- Sección de Preguntas -->
    <section class="questions-section q-pa-xl">
      <q-container>
        <div ref="resultsRef" class="results-container">
          <transition-group name="fade" mode="out-in">
            <q-expansion-item
              v-for="(q, index) in visible"
              :key="q.id"
              class="faq-item q-mb-lg animated fadeInUp"
              :style="{ animationDelay: `${index * 0.05}s` }"
              :label="q.title"
              icon="help_outline"
              header-class="faq-header"
              expand-icon-class="text-white"
              dense-toggle
            >
              <q-card class="faq-content">
                <q-card-section class="q-pa-lg">
                  <div class="faq-answer text-body1" v-html="q.answer"></div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </transition-group>

          <div v-if="visible.length === 0" class="no-results text-center q-pa-xl animated fadeIn">
            <q-icon name="search_off" size="4rem" color="grey-5" class="q-mb-md animated bounceIn" />
            <p class="text-h6 text-grey-6 q-mb-sm">No se encontraron preguntas</p>
            <p class="text-body2 text-grey-5">Intenta con otras palabras clave</p>
            <q-btn 
              flat 
              color="primary" 
              label="Limpiar búsqueda" 
              icon="refresh"
              @click="clearSearch"
              class="q-mt-md"
            />
          </div>
        </div>
      </q-container>
    </section>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import Fuse from 'fuse.js'
import questions from 'src/data/questions.json'

const $q = useQuasar()
const query = ref('')
const resultsRef = ref(null)
const timerId = ref(null)
const fuse = ref(null)

const fuseOptions = {
  keys: ['title', 'snippet', 'tags', 'answer'],
  threshold: 0.35,
  ignoreLocation: true
}

const results = ref([...questions])

onMounted(() => {
  fuse.value = new Fuse(questions, fuseOptions)
})

onBeforeUnmount(() => {
  if (timerId.value) {
    clearTimeout(timerId.value)
    timerId.value = null
  }
})

const onInput = () => {
  if (timerId.value) {
    clearTimeout(timerId.value)
  }
  timerId.value = setTimeout(() => {
    runSearch()
  }, 300)
}

const runSearchNow = () => {
  if (timerId.value) {
    clearTimeout(timerId.value)
    timerId.value = null
  }
  runSearch()
}

const runSearch = () => {
  let items = questions

  if (query.value && fuse.value) {
    const r = fuse.value.search(query.value)
    items = r.map(x => x.item)
    
    if (items.length > 0) {
      $q.notify({
        type: 'positive',
        message: `Se encontraron ${items.length} resultados`,
        timeout: 1000,
        icon: 'check_circle'
      })
    }
  }

  results.value = items

  setTimeout(() => {
    scrollToResults()
  }, 100)
}

const scrollToResults = () => {
  const el = resultsRef.value
  if (!el) return
  
  el.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

const clearSearch = () => {
  query.value = ''
  results.value = [...questions]
}

const visible = computed(() => results.value)
</script>

<style lang="scss" scoped>
.faq-page {
  padding-bottom: 0;
}

.hero-section {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
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

.search-input-hero {
  :deep(.q-field__control) {
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    border: 2px solid transparent;
    transition: all var(--transition-fast);
    
    &:hover {
      border-color: var(--primary-color);
      box-shadow: var(--shadow-xl);
    }
    
    &:focus-within {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 4px var(--primary-color-light);
    }
  }
}

.questions-section {
  padding-top: 80px;
  padding-bottom: 80px;
}

.results-container {
  max-width: 900px;
  margin: 0 auto;
  scroll-margin-top: 2rem;
}

.faq-item {
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  border: 2px solid transparent;
  background: white;
  
  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-4px);
    border-color: var(--primary-color);
  }
  
  :deep(.faq-header) {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%);
    padding: var(--spacing-lg) var(--spacing-xl);
    font-weight: 600;
    font-size: 1.1rem;
    color: white;
    transition: all var(--transition-fast);
    
    &:hover {
      background: linear-gradient(135deg, var(--primary-color-dark) 0%, var(--primary-color) 100%);
    }
  }
}

.body--dark .faq-item {
  background: var(--bg-primary);
  
  :deep(.faq-header) {
    background: linear-gradient(135deg, #2C5AA0 0%, #1976d2 100%);
  }
}

.faq-content {
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  background: var(--bg-primary);
  border-top: 2px solid var(--border-light);
}

.faq-answer {
  line-height: 1.6;
  color: var(--text-primary);
  font-size: 1rem;
  
  :deep(p) {
    margin-bottom: 0.75rem;
  }
  
  :deep(ul), 
  :deep(ol) {
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
  }
  
  :deep(li) {
    margin-bottom: 0.25rem;
  }
  
  :deep(strong) {
    color: var(--primary-color);
    font-weight: 600;
  }
}

.no-results {
  margin-top: 3rem;
  opacity: 0.8;
}

// Transition animations
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

// Responsive
@media (max-width: 768px) {
  .hero-section {
    min-height: auto;
    padding: 40px 20px;
  }
  
  .questions-section {
    padding: 40px 20px;
  }
  
  .faq-item {
    :deep(.faq-header) {
      font-size: 1rem;
      padding: var(--spacing-md) var(--spacing-lg);
    }
  }
  
  .faq-answer {
    font-size: 0.95rem;
  }
}
</style>