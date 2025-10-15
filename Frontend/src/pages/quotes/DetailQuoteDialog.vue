<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="detail-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-calendar-day"></i>
            <span>Detalles de la Cita</span>
          </div>
          <q-btn
            flat
            round
            dense
            icon="fa-solid fa-times"
            v-close-popup
            class="close-btn"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="dialog-content">
        <div class="quote-details">
          <div class="detail-row">
            <div class="detail-label">
              <i class="fa-solid fa-hashtag"></i>
              <span>ID de Cita</span>
            </div>
            <div class="detail-value">{{ quoteData?.id ?? 'No disponible' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">
              <i class="fa-solid fa-comment-medical"></i>
              <span>Asunto</span>
            </div>
            <div class="detail-value">{{ quoteData?.asunto ?? 'No disponible' }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">
              <i class="fa-solid fa-user-md"></i>
              <span>Dentista</span>
            </div>
            <div class="detail-value">{{ getDentistaName(quoteData?.dentistaId) }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">
              <i class="fa-solid fa-user"></i>
              <span>Paciente</span>
            </div>
            <div class="detail-value">{{ getPacienteName(quoteData?.pacienteId) }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">
              <i class="fa-solid fa-calendar"></i>
              <span>Fecha</span>
            </div>
            <div class="detail-value">{{ formatDate(quoteData?.fecha) }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">
              <i class="fa-solid fa-clock"></i>
              <span>Hora</span>
            </div>
            <div class="detail-value">{{ quoteData?.hora ?? 'No disponible' }}</div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions class="dialog-actions">
        <q-btn
          flat
          label="Cerrar"
          v-close-popup
          class="secondary-btn"
        />
        <q-btn
          flat
          label="Editar Cita"
          icon="fa-solid fa-edit"
          @click="editQuote"
          class="primary-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'DetailQuoteDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    quoteData: {
      type: Object,
      default: () => null
    },
    getDentistaName: {
      type: Function,
      required: true
    },
    getPacienteName: {
      type: Function,
      required: true
    }
  },
  emits: ['update:modelValue', 'edit-quote'],
  setup(props, { emit }) {
    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const formatDate = (dateString) => {
      if (!dateString) return 'No disponible'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      } catch {
        return 'Fecha inválida'
      }
    }

    const editQuote = () => {
      emit('edit-quote', props.quoteData)
      showDialog.value = false
    }

    return {
      showDialog,
      formatDate,
      editQuote
    }
  }
}
</script>

<style scoped>
</style>
