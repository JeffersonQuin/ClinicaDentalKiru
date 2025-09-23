<template>
  <q-page class="service-page">
    <section class="hero-branch q-pa-xl">
      <div class="row items-center">
        <div class="col-12 col-md-8 text-align-left">
          <h1 class="text-h2 text-weight-bold text-primary q-mb-md">
            Preguntas Frecuentes (FAQ)
          </h1>
          <p class="text-h6 text-grey-7 q-mb-lg">
            Te sientes perdido, estas preguntas podrían ayudarte a aclarar tus dudas.
          </p>

          <div class="row q-gutter-md items-center">
            <q-input
              v-model="query"
              color="primary"
              placeholder="Buscar preguntas..."
              dense
              outlined
              clearable
              @input="onInput"
              @keyup.enter="runSearchNow"
              aria-label="Buscar preguntas"
              class="text-h6"
            />
          </div>
        </div>

        <div class="col-12 col-md-4 text-center">
          <div class="hero-image-container">
            <q-img src="/KiruIMG/questions.png" alt="Paciente en consulta dental" class="hero-image" />
          </div>
        </div>
      </div>
    </section>

    <div class="q-pa-md" style="max-width: 1600px">
      <div ref="resultsRef" class="results-container">
        <q-expansion-item
          v-for="q in visible"
          :key="q.id"
          class="faq-item q-mb-lg blue-14"
          :label="q.title"
          icon="help_outline"
          header-class="faq-header"
          expand-icon-class="text-white"
        >
          <q-card class="faq-content">
            <q-card-section class="q-pa-lg">
              <div class="faq-answer text-body1" v-html="q.answer"></div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <div v-if="visible.length === 0" class="no-results text-center q-pa-xl">
          <q-icon name="search_off" size="4rem" color="grey-5" class="q-mb-md" />
          <p class="text-h6 text-grey-6 q-mb-none">No se encontraron preguntas</p>
          <p class="text-body2 text-grey-5">Intenta con otras palabras clave</p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Fuse from 'fuse.js'
import questions from 'src/data/questions.json' // <-- archivo estático

const DELAY_MS = 3000 // 3 segundos

const query = ref('')
const selectedTag = ref(null)
const resultsRef = ref(null)
const timerId = ref(null)
const fuse = ref(null)
const fuseOptions = {
  keys: ['title', 'snippet', 'tags', 'answer'],
  threshold: 0.35,
  ignoreLocation: true
}

// resultados (inicial = todas)
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

// input handler con debounce manual (espera 3s)
function onInput () {
  if (timerId.value) {
    clearTimeout(timerId.value)
    timerId.value = null
  }
  timerId.value = setTimeout(() => {
    runSearch()
    timerId.value = null
  }, DELAY_MS)
}

// ejecutar búsqueda ahora (Enter)
function runSearchNow () {
  if (timerId.value) {
    clearTimeout(timerId.value)
    timerId.value = null
  }
  runSearch()
}

function runSearch () {
  let items = questions

  if (query.value && fuse.value) {
    const r = fuse.value.search(query.value)
    items = r.map(x => x.item)
  }

  if (selectedTag.value) {
    items = items.filter(i => (i.tags || []).includes(selectedTag.value))
  }

  results.value = items

  // esperar repaint y scrollear a la sección de preguntas
  setTimeout(() => {
    scrollToResults()
  }, 100)
}

function scrollToResults () {
  const el = resultsRef.value
  if (!el) return
  
  // Hacer scroll hacia la sección de preguntas
  el.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

const visible = computed(() => results.value)
</script>

<style scoped>
.faq-item {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  color: white;
  font-weight: bold;
  text-decoration: bold;
  font-size: 1.25rem;
  background: rgb(0, 89, 255);
}

.faq-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.faq-header {
  background: #f8c304;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.faq-content {
  border-radius: 0 0 12px 12px;
  background: #7cc3ee;
}

.faq-answer {
  line-height: 1.5;
  font-weight: bold;
  color: rgb(255, 255, 255);
  font-size: 1rem;
}

.faq-answer :deep(p) {
  margin-bottom: 0.75rem;
}

.faq-answer :deep(ul), 
.faq-answer :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}

.faq-answer :deep(li) {
  margin-bottom: 0.25rem;
}

.faq-answer :deep(strong) {
  color: var(--q-primary);
}

.no-results {
  margin-top: 3rem;
  opacity: 0.8;
}

.results-container {
  scroll-margin-top: 2rem;
}

/* Animación sutil para cuando aparecen los resultados */
.faq-item {
  animation: fadeInUp 0.5s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger animation para múltiples items */
.faq-item:nth-child(1) { animation-delay: 0.1s; }
.faq-item:nth-child(2) { animation-delay: 0.2s; }
.faq-item:nth-child(3) { animation-delay: 0.3s; }
.faq-item:nth-child(4) { animation-delay: 0.4s; }
.faq-item:nth-child(5) { animation-delay: 0.5s; }
</style>