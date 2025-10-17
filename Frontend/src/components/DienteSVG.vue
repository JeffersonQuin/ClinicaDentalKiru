<template>
  <div
    class="tooth-container"
    :style="{ maxWidth: responsive ? maxWidth + 'px' : (width * scale) + 'px' }"
  >
    <!-- SVG responsivo: viewBox fijo, width 100% -> escala dentro del contenedor -->
    <svg
      viewBox="0 0 300 300"
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      :aria-label="`Odontograma - ${position}`"
    >
      <!-- Cara Oclusal (Cuadrado central) -->
      <polygon
        :points="occlusalPoints"
        :fill="getFaceColor('Oclusal')"
        :stroke="getStrokeColor('Oclusal')"
        stroke-width="2"
        @click="selectFace('Oclusal')"
        class="tooth-face"
      />
      <!-- Vestibular -->
      <polygon
        :points="vestibularPoints"
        :fill="getFaceColor('Vestibular')"
        :stroke="getStrokeColor('Vestibular')"
        stroke-width="2"
        @click="selectFace('Vestibular')"
        class="tooth-face"
      />
      <!-- Palatino -->
      <polygon
        :points="palatinoPoints"
        :fill="getFaceColor('Palatino')"
        :stroke="getStrokeColor('Palatino')"
        stroke-width="2"
        @click="selectFace('Palatino')"
        class="tooth-face"
      />
      <!-- Mesial -->
      <polygon
        :points="mesialPoints"
        :fill="getFaceColor('Mesial')"
        :stroke="getStrokeColor('Mesial')"
        stroke-width="2"
        @click="selectFace('Mesial')"
        class="tooth-face"
      />
      <!-- Distal -->
      <polygon
        :points="distalPoints"
        :fill="getFaceColor('Distal')"
        :stroke="getStrokeColor('Distal')"
        stroke-width="2"
        @click="selectFace('Distal')"
        class="tooth-face"
      />
    </svg>

    <!-- Controles (opcional) -->
    <div class="controls q-mt-md">
      <!-- Emite update:position para permitir v-model:position desde el padre -->
      <q-btn-toggle
        v-model="localPosition"
        toggle-color="primary"
        :options="[
          { label: 'Superior', value: 'superior' },
          { label: 'Inferior', value: 'inferior' }
        ]"
        @update:model-value="onPositionChange"
      />
      <div class="q-mt-sm">
        <strong>Cara seleccionada:</strong> {{ selectedFace || 'Ninguna' }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'ToothGeometric',
  props: {
    width: { type: Number, default: 300 },
    height: { type: Number, default: 300 },
    // Controla si el SVG escala dentro del contenedor (recomendado true)
    responsive: { type: Boolean, default: true },
    // Máximo ancho que ocupará el componente cuando responsive=true
    maxWidth: { type: Number, default: 300 },
    // Factor extra de escala para ajustar el contenido internamente
    scale: { type: Number, default: 1 },
    // posición (superior|inferior). Se permite v-model:position desde el padre.
    position: {
      type: String,
      default: 'superior',
      validator: (v) => ['superior', 'inferior'].includes(v)
    }
  },
  emits: ['update:position'],
  setup(props, { emit }) {
    // localPosition para control interno; cuando cambia emitimos update:position
    const localPosition = ref(props.position)
    watch(
      () => props.position,
      (v) => {
        if (v !== localPosition.value) localPosition.value = v
      }
    )
    const onPositionChange = (val) => {
      localPosition.value = val
      emit('update:position', val)
    }

    const selectedFace = ref(null)

    // Coordenadas base (coordenadas en el viewBox 0..300)
    const centerX = 150
    const centerY = 150
    // Tamaño del cuadrado central base (en coordenadas viewBox)
    const baseSquareSize = 100

    // Aplicamos el scale prop a las medidas de los polígonos.
    // IMPORTANTE: el viewBox mantiene la proporción, por eso operamos sobre las coordenadas,
    // no sobre el width/height del SVG.
    const squareSize = computed(() => baseSquareSize * props.scale)
    const trapezoidHeight = computed(() => 60 * props.scale)
    const extraWidth = computed(() => 120 * props.scale) // ancho extra de trapecios

    const occlusalPoints = computed(() => {
      const half = squareSize.value / 2
      return `${centerX - half},${centerY - half} ${centerX + half},${centerY - half} ${centerX + half},${centerY + half} ${centerX - half},${centerY + half}`
    })

    const vestibularPoints = computed(() => {
      const half = squareSize.value / 2
      const topWidth = squareSize.value + extraWidth.value
      const topHalf = topWidth / 2

      if (localPosition.value === 'inferior') {
        // En dent. inferiores vestibular abajo
        return `${centerX - half},${centerY + half} ${centerX + half},${centerY + half} ${centerX + topHalf},${centerY + half + trapezoidHeight.value} ${centerX - topHalf},${centerY + half + trapezoidHeight.value}`
      }
      // superiores: vestibular arriba
      return `${centerX - topHalf},${centerY - half - trapezoidHeight.value} ${centerX + topHalf},${centerY - half - trapezoidHeight.value} ${centerX + half},${centerY - half} ${centerX - half},${centerY - half}`
    })

    const palatinoPoints = computed(() => {
      const half = squareSize.value / 2
      const bottomWidth = squareSize.value + extraWidth.value
      const bottomHalf = bottomWidth / 2

      if (localPosition.value === 'inferior') {
        // Palatino arriba (dientes inferiores)
        return `${centerX - half},${centerY - half} ${centerX + half},${centerY - half} ${centerX + bottomHalf},${centerY - half - trapezoidHeight.value} ${centerX - bottomHalf},${centerY - half - trapezoidHeight.value}`
      }
      // superiores: palatino abajo
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

    const getFaceColor = (face) => (selectedFace.value === face ? '#2196F3' : '#E3F2FD')
    const getStrokeColor = (face) => (selectedFace.value === face ? '#1976D2' : '#90CAF9')
    const selectFace = (face) => {
      selectedFace.value = selectedFace.value === face ? null : face
    }

    return {
      localPosition,
      selectedFace,
      occlusalPoints,
      vestibularPoints,
      palatinoPoints,
      mesialPoints,
      distalPoints,
      getFaceColor,
      getStrokeColor,
      selectFace,
      onPositionChange
    }
  }
}
</script>

<style scoped>
.tooth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  box-sizing: border-box;
  /* centrar y permitir que el SVG escale al 100% del contenedor */
  width: 100%;
}

.tooth-face {
  cursor: pointer;
  transition: all 0.18s ease;
}

.tooth-face:hover {
  opacity: 0.9;
  filter: brightness(1.05);
}

.controls {
  text-align: center;
  width: 100%;
}
</style>
