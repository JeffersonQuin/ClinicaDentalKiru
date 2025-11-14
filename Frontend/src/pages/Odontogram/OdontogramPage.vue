<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <i class="fa-solid fa-tooth header-icon"></i>
          <div>
            <h1 class="page-title">Odontograma</h1>
            <p class="page-subtitle">Visualiza y gestiona el tratamiento dental del paciente</p>
          </div>
        </div>
      </div>
    </div>

    <SearchPaciente @paciente-seleccionado="cargarOdontograma" />

    <div v-if="pacienteSeleccionado && odontograma" class="odontograma-container q-mt-md">
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row items-center q-col-gutter-md">
            <div class="col">
              <h6 class="text-h6 q-my-none">Odontograma de {{ pacienteSeleccionado.nombre }}</h6>
              <p class="text-caption text-grey-7 q-mb-none">CI: {{ pacienteSeleccionado.ci }}</p>
              <p class="text-caption text-grey-7 q-mb-none">Tipo: {{ odontograma.tipo_denticion }}</p>
            </div>
            <div class="col-auto">
              <q-btn flat color="primary" icon="edit" label="Editar" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 q-mb-xs">Diagnóstico General:</div>
              <div class="text-body2">{{ odontograma.diagnostico_general }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 q-mb-xs">Plan de Tratamiento:</div>
              <div class="text-body2">{{ odontograma.plan_tratamiento }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="odontograma-grid">
            <div class="quadrant quadrant-superior-derecho">
              <div class="quadrant-label">Superior Derecho</div>
              <div class="teeth-row">
                <Tooth
                  v-for="num in [18, 17, 16, 15, 14, 13, 12, 11]"
                  :key="num"
                  :pieza="obtenerPieza(num)"
                  posicion="superior"
                  @select-face="handleSelectFace"
                />
              </div>
            </div>

            <div class="quadrant quadrant-superior-izquierdo">
              <div class="quadrant-label">Superior Izquierdo</div>
              <div class="teeth-row">
                <Tooth
                  v-for="num in [21, 22, 23, 24, 25, 26, 27, 28]"
                  :key="num"
                  :pieza="obtenerPieza(num)"
                  posicion="superior"
                  @select-face="handleSelectFace"
                />
              </div>
            </div>

            <div class="separator"></div>

            <div class="quadrant quadrant-inferior-derecho">
              <div class="teeth-row">
                <Tooth
                  v-for="num in [48, 47, 46, 45, 44, 43, 42, 41]"
                  :key="num"
                  :pieza="obtenerPieza(num)"
                  posicion="inferior"
                  @select-face="handleSelectFace"
                />
              </div>
              <div class="quadrant-label">Inferior Derecho</div>
            </div>

            <div class="quadrant quadrant-inferior-izquierdo">
              <div class="teeth-row">
                <Tooth
                  v-for="num in [31, 32, 33, 34, 35, 36, 37, 38]"
                  :key="num"
                  :pieza="obtenerPieza(num)"
                  posicion="inferior"
                  @select-face="handleSelectFace"
                />
              </div>
              <div class="quadrant-label">Inferior Izquierdo</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-mt-md">
        <q-card-section>
          <h6 class="text-h6 q-my-none q-mb-md">Resumen de Tratamientos</h6>
          
          <q-list bordered separator>
            <q-item v-for="pieza in piezasConTratamiento" :key="pieza.id">
              <q-item-section avatar>
                <q-avatar :color="getColorEstado(pieza.estado_general)" text-color="white">
                  {{ pieza.numero }}
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>Diente #{{ pieza.numero }}</q-item-label>
                <q-item-label caption>{{ pieza.diagnostico }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-chip 
                  :color="getColorEstado(pieza.estado_general)" 
                  text-color="white"
                  size="sm"
                >
                  {{ pieza.estado_general }}
                </q-chip>
                <div class="text-caption">Bs. {{ pieza.precio.toFixed(2) }}</div>
              </q-item-section>
            </q-item>
          </q-list>

          <q-separator class="q-my-md" />

          <div class="row items-center justify-between">
            <div class="text-h6">Total:</div>
            <div class="text-h5 text-primary">Bs. {{ costoTotal.toFixed(2) }}</div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div v-else class="no-patient q-mt-md">
      <q-card>
        <q-card-section class="text-center q-pa-lg">
          <i class="fa-solid fa-inbox text-grey-5" style="font-size: 48px;"></i>
          <p class="text-h6 text-grey-7 q-mt-md">Selecciona un paciente</p>
          <p class="text-body2 text-grey-6">
            Ingresa el CI del paciente en el campo de búsqueda para cargar su odontograma
          </p>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePacientesStore } from 'src/stores/pacientes'
import SearchPaciente from '../../components/SearchPatien.vue'
import Tooth from '../../components/ToothComponent.vue'
import odontogramaData from '../../data/odontograma.json'

const store = usePacientesStore()

const odontograma = ref(null)
const piezas = ref([])
const caras = ref([])

onMounted(() => {
  store.cargarPacientes()
})

const pacienteSeleccionado = computed(() => store.pacienteSeleccionado)
console.log('Paciente seleccionado:', pacienteSeleccionado.value)

const cargarOdontograma = (paciente) => {
  if (!paciente || !paciente.ci) {
    console.error('No se puede cargar odontograma sin CI del paciente')
    return
  }

  // Buscar el odontograma que corresponde al CI del paciente
  const odontogramaEncontrado = odontogramaData.odontogramas.find(
    (o) => o.paciente_ci === paciente.ci
  )

  if (!odontogramaEncontrado) {
    console.warn(`No se encontró odontograma para el paciente con CI: ${paciente.ci}`)
    odontograma.value = null
    piezas.value = []
    caras.value = []
    return
  }

  // Cargar el odontograma encontrado
  odontograma.value = odontogramaEncontrado

  // Filtrar solo las piezas que pertenecen a este odontograma
  piezas.value = odontogramaData.piezas.filter(
    (p) => p.id_odontograma === odontogramaEncontrado.id
  )

  // Obtener los IDs de las piezas encontradas
  const idsPiezas = piezas.value.map((p) => p.id)

  // Filtrar solo las caras que pertenecen a las piezas de este odontograma
  caras.value = odontogramaData.caras.filter(
    (c) => idsPiezas.includes(c.id_pieza)
  )

  console.log('Odontograma cargado:', {
    paciente_ci: paciente.ci,
    odontograma: odontogramaEncontrado,
    total_piezas: piezas.value.length,
    total_caras: caras.value.length
  })
}

const obtenerPieza = (numero) => {
  const pieza = piezas.value.find((p) => p.numero === numero)
  
  if (!pieza) {
    return {
      numero,
      caras: [],
      estado_general: 'sano',
      precio: 0,
      diagnostico: '',
      image_tooth: numero >= 11 && numero <= 28 ? 'tooth_up.png' : 'tooth_down.png'
    }
  }

  const carasPieza = caras.value.filter((c) => c.id_pieza === pieza.id)
  
  return {
    ...pieza,
    caras: carasPieza
  }
}

const piezasConTratamiento = computed(() => {
  return piezas.value.filter((p) => p.estado_general !== 'sano')
})

const costoTotal = computed(() => {
  return piezas.value.reduce((sum, pieza) => sum + (pieza.precio || 0), 0)
})

const getColorEstado = (estado) => {
  const colores = {
    sano: 'positive',
    enfermo: 'negative',
    tratado: 'info',
    ausente: 'grey'
  }
  return colores[estado] || 'grey'
}

const handleSelectFace = (data) => {
  console.log('Cara seleccionada:', data)
}
</script>

<style scoped>
.odontograma-container {
  max-width: 1400px;
  margin: 0 auto;
}

.odontograma-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 20px auto;
  gap: 30px;
  padding: 20px;
}

.quadrant {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quadrant-label {
  text-align: center;
  font-weight: 600;
  color: #616161;
  font-size: 14px;
  padding: 8px;
  background: rgba(33, 150, 243, 0.1);
  border-radius: 4px;
}

.teeth-row {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.separator {
  grid-column: 1 / -1;
  height: 2px;
  background: linear-gradient(to right, transparent, #2196F3, transparent);
  margin: 0 40px;
}
</style>