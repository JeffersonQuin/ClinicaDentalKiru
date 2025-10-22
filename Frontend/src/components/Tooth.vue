<template>
  <div class="tooth-container">
    <svg
      viewBox="0 0 300 300"
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      :aria-label="`Diente ${pieza?.numero}`"
    >


      <!-- Vestibular -->
      <polygon
        :points="vestibularPoints"
        :fill="getFaceColor('Vestibular')"
        :stroke="getStrokeColor('Vestibular')"
        stroke-width="0.5"
        @click="handleSelectFace('Vestibular')"
        class="tooth-face"
      />

      <!-- Palatino -->
      <polygon
        :points="palatinoPoints"
        :fill="getFaceColor('Palatino')"
        :stroke="getStrokeColor('Palatino')"
        stroke-width="0.5"
        @click="handleSelectFace('Palatino')"
        class="tooth-face"
      />

      <!-- Mesial -->
      <polygon
        :points="mesialPoints"
        :fill="getFaceColor('Mesial')"
        :stroke="getStrokeColor('Mesial')"
        stroke-width="0.5"
        @click="handleSelectFace('Mesial')"
        class="tooth-face"
      />

      <!-- Distal -->
      <polygon
        :points="distalPoints"
        :fill="getFaceColor('Distal')"
        :stroke="getStrokeColor('Distal')"
        stroke-width="0.5"
        @click="handleSelectFace('Distal')"
        class="tooth-face"
      />
      <!-- Cara Oclusal -->
      <polygon
        :points="occlusalPoints"
        :fill="getFaceColor('Oclusal')"
        :stroke="getStrokeColor('Oclusal')"
        stroke-width="0.5"
        @click="handleSelectFace('Oclusal')"
        class="tooth-face"
      />

    </svg>

    <!-- Información del diente -->
    <div v-if="pieza" class="tooth-info q-mt-sm">
      <p class="text-caption text-grey-7 q-my-none">
        {{ obtenerNombreDiente(pieza.numero) }}
      </p>
      <p class="text-caption text-grey-6 q-my-none">
        {{ pieza.estadoGeneral }}
      </p>
    </div>

    <!-- Cara seleccionada -->
    <div v-if="caraSeleccionada" class="selection-info q-mt-sm">
      <q-chip
        removable
        @remove="caraSeleccionada = null"
        color="primary"
        text-color="white"
        size="sm"
      >
        {{ caraSeleccionada }}
      </q-chip>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import { obtenerNombreDiente } from 'src/utils/diente'
import { COLORES_CLINICOS } from 'src/types/odontograma'
import { CaraDiente} from 'src/types/odontograma'

export default defineComponent({
  name: 'ToothComponent',
  props: {
    pieza: Object,
    posicion: {
      type: String,
      default: 'superior'
    },
    escala: {
      type: Number,
      default: 1
    }
  },
  emits: ['selectFace'],
  setup(props, { emit }) {
    const caraSeleccionada = ref<CaraDiente | null>(null)
    const posicion = ref(props.posicion)

    watch(
      () => props.posicion,
      (newVal) => {
        posicion.value = newVal
      }
    )

    // Coordenadas del SVG
    const centerX = 150
    const centerY = 150
    const baseSquareSize = 100

    // Medidas escaladas
    const squareSize = computed(() => baseSquareSize * props.escala)
    const trapezoidHeight = computed(() => 50 * props.escala)
    const extraWidth = computed(() => 100 * props.escala)

    // Puntos de los polígonos
    const occlusalPoints = computed(() => {
      const half = squareSize.value / 2
      return `${centerX - half},${centerY - half} ${centerX + half},${centerY - half} ${centerX + half},${centerY + half} ${centerX - half},${centerY + half}`
    })

    const vestibularPoints = computed(() => {
      const half = squareSize.value / 2
      const topWidth = squareSize.value + extraWidth.value
      const topHalf = topWidth / 2

      if (posicion.value === 'inferior') {
        return `${centerX - half},${centerY + half} ${centerX + half},${centerY + half} ${centerX + topHalf},${centerY + half + trapezoidHeight.value} ${centerX - topHalf},${centerY + half + trapezoidHeight.value}`
      }
      return `${centerX - topHalf},${centerY - half - trapezoidHeight.value} ${centerX + topHalf},${centerY - half - trapezoidHeight.value} ${centerX + half},${centerY - half} ${centerX - half},${centerY - half}`
    })

    const palatinoPoints = computed(() => {
      const half = squareSize.value / 2
      const bottomWidth = squareSize.value + extraWidth.value
      const bottomHalf = bottomWidth / 2

      if (posicion.value === 'inferior') {
        return `${centerX - half},${centerY - half} ${centerX + half},${centerY - half} ${centerX + bottomHalf},${centerY - half - trapezoidHeight.value} ${centerX - bottomHalf},${centerY - half - trapezoidHeight.value}`
      }
      return `${centerX - half},${centerY + half} ${centerX + half},${centerY + half} ${centerX + bottomHalf},${centerY + half + trapezoidHeight.value} ${centerX - bottomHalf},${centerY + half + trapezoidHeight.value}`
    })

    const mesialPoints = computed(() => {
      const half = squareSize.value / 2
      const rightWidth = squareSize.value + extraWidth.value
      const rightHalf = rightWidth / 2
      return `${centerX + half},${centerY - half} ${centerX + half + trapezoidHeight.value},${centerY - rightHalf} ${centerX + half + trapezoidHeight.value},${centerY + rightHalf} ${centerX + half},${centerY + half}`
    })

    const distalPoints = computed(() => {
      const half = squareSize.value / 2
      const leftWidth = squareSize.value + extraWidth.value
      const leftHalf = leftWidth / 2
      return `${centerX - half - trapezoidHeight.value},${centerY - leftHalf} ${centerX - half},${centerY - half} ${centerX - half},${centerY + half} ${centerX - half - trapezoidHeight.value},${centerY + leftHalf}`
    })

    // Obtener color de una cara
    const getFaceColor = (cara) => {
      if (!props.pieza) {
        return COLORES_CLINICOS.blanco
      }

      const caraInfo = props.pieza.caras.find(c => c.cara === cara)
      if (!caraInfo) {
        return COLORES_CLINICOS.blanco
      }

      return caraInfo.color
    }

    // Obtener color del stroke
    const getStrokeColor = (cara) => {
      if (caraSeleccionada.value === cara) {
        return '#1976D2'
      }

      if (!props.pieza) {
        return '#90CAF9'
      }

      const caraInfo = props.pieza.caras.find(c => c.cara === cara)
      if (!caraInfo) {
        return '#90CAF9'
      }

      return '#2196F3'
    }

    // Manejar selección de cara
    const handleSelectFace = (cara) => {
      caraSeleccionada.value = caraSeleccionada.value === cara ? null : cara
      emit('selectFace', cara)
    }

    return {
      caraSeleccionada,
      occlusalPoints,
      vestibularPoints,
      palatinoPoints,
      mesialPoints,
      distalPoints,
      getFaceColor,
      getStrokeColor,
      handleSelectFace,
      obtenerNombreDiente
    }
  }
})
</script>

<style scoped lang="scss">
.tooth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: #f0f0f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.tooth-face {
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    opacity: 0.85;
    filter: brightness(1.1);
  }
}

</style>
