<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="detail-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-calendar-day"></i>
            <span>Detalle Reserva</span>
          </div>
          <q-btn
            flat
            round
            dense
            icon="fa-solid fa-times"
            @click="closeDialog"
            class="close-btn"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="dialog-content">
        <div class="info-section">
          <div class="reserva-row">
            <div class="reserva-box">
              <b>Fecha Reserva:</b> {{ formatDate(reserveData?.fechaReserva) }}
            </div>
            <div class="reserva-box">
              <b>Hora de Reserva:</b> {{ reserveData?.horaReserva }}
            </div>
          </div>
          <div class="reserva-fields">
            <div><b>Nombre Completo:</b> {{ reserveData?.nombreCompleto }}</div>
            <div><b>Gmail:</b> {{ reserveData?.gmail }}</div>
          </div>
        </div>
        <q-separator />
        <div class="dependiente-section">
          <h4>Reserva Dependiente</h4>
          <div><b>Nombre Completo:</b> {{ reserveData?.dependiente?.nombreCompleto }}</div>
          <div><b>Género:</b> {{ reserveData?.dependiente?.genero }}</div>
          <div><b>Parentesco:</b> {{ reserveData?.dependiente?.parentesco }}</div>
          <div><b>Teléfono:</b> {{ reserveData?.dependiente?.telefono }}</div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions class="dialog-actions">
        <q-btn
          flat
          label="Cerrar"
          @click="closeDialog"
          class="secondary-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'DetailReserveDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    reserveData: {
      type: Object,
      default: () => null
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const closeDialog = () => {
      showDialog.value = false
    }

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

    return {
      showDialog,
      closeDialog,
      formatDate
    }
  }
}
</script>

<style scoped>
.detail-dialog {
  max-width: 500px;
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  background: #fafafa;
}
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0;
}
.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}
.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  font-weight: 600;
}
.close-btn {
  margin-left: auto;
}
.info-section {
  padding: 8px;
}
.reserva-row {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}
.reserva-box {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 8px 16px;
  background: #fafafa;
  font-size: 1rem;
}
.reserva-fields > div {
  margin-bottom: 4px;
}
.dependiente-section {
  margin-top: 16px;
  padding: 10px;
  border-radius: 6px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
}
.dialog-actions {
  justify-content: flex-end;
  gap: 8px;
}
.secondary-btn {
  color: #666;
}
@media (max-width: 600px) {
  .detail-dialog {
    max-width: 98vw;
  }
}
body.body--dark .detail-dialog {
  background: #222;
}
body.body--dark .reserva-box,
body.body--dark .dependiente-section {
  background: #222;
  color: #fafafa;
  border-color: #444;
}
</style>
