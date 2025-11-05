<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="detail-dialog">
      <!-- Header -->
      <q-card-section class="dialog-header">
        <div class="header-content row items-center justify-between">
          <div class="header-title row items-center">
            <q-icon name="event" class="text-primary" />
            <span class="q-ml-sm">Detalle Reserva</span>
          </div>
          <q-btn
            flat
            round
            dense
            icon="fa-solid fa-times"
            @click="closeDialog"
            aria-label="Cerrar"
          />
        </div>
      </q-card-section>

      <q-separator />

      <!-- Contenido scrollable -->
      <q-card-section class="dialog-content-scrollable">
        <div class="content-wrapper">
          <!-- Información Principal de la Reserva -->
          <div class="info-section">
            <div class="section-title row items-center q-gutter-sm">
              <q-icon name="info" />
              <span>INFORMACIÓN DE LA RESERVA</span>
            </div>

            <div class="reserva-row">
              <div class="reserva-box">
                <div class="box-label">Fecha</div>
                <div class="box-value">{{ formatDate(reserveData?.fechaReserva) }}</div>
              </div>
              <div class="reserva-box">
                <div class="box-label">Hora</div>
                <div class="box-value">{{ reserveData?.horaReserva }}</div>
              </div>
            </div>

            <div class="reserva-details">
              <div class="detail-item">
                <span class="detail-label">Paciente:</span>
                <span class="detail-value">{{ reserveData?.nombreCompleto }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{ reserveData?.gmail }}</span>
              </div>
              <div v-if="reserveData?.servicio" class="detail-item">
                <span class="detail-label">Servicio:</span>
                <span class="detail-value">{{ reserveData.servicio }}</span>
              </div>
              <div v-if="reserveData?.sucursal" class="detail-item">
                <span class="detail-label">Sucursal:</span>
                <span class="detail-value">{{ reserveData.sucursal }}</span>
              </div>
            </div>
          </div>

          <!-- Indicador de tipo de reserva -->
          <div class="tipo-reserva-section" :class="{ 'for-other': hasDependiente }">
            <q-icon :name="hasDependiente ? 'fa-solid fa-users' : 'fa-solid fa-user'" />
            <span>{{ hasDependiente ? 'Reserva para Dependiente' : 'Reserva para Titular' }}</span>
          </div>

          <!-- Dependiente -->
          <div v-if="hasDependiente" class="dependiente-section">
            <div class="section-title row items-center q-gutter-sm">
              <q-icon name="people" />
              <span>INFORMACIÓN DEL DEPENDIENTE</span>
            </div>
            <div class="dependiente-info">
              <div class="info-row">
                <span class="label">Nombre Completo:</span>
                <span class="value">{{ reserveData?.dependiente?.nombreCompleto }}</span>
              </div>
              <div class="info-row">
                <span class="label">Género:</span>
                <span class="value">{{ reserveData?.dependiente?.genero }}</span>
              </div>
              <div class="info-row">
                <span class="label">Parentesco:</span>
                <span class="value">{{ reserveData?.dependiente?.parentesco }}</span>
              </div>
              <div class="info-row">
                <span class="label">Teléfono:</span>
                <span class="value">{{ reserveData?.dependiente?.telefono }}</span>
              </div>
            </div>
          </div>

          <div v-else class="no-dependiente-section">
            <q-icon name="verified_user" size="32px" />
            <p>Esta reserva es para el titular principal</p>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Footer -->
      <q-card-actions class="dialog-actions">
        <q-btn flat label="Cerrar" @click="closeDialog" class="secondary-btn" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'DetailReserveDialog',
  props: {
    modelValue: Boolean,
    reserveData: Object
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const hasDependiente = computed(() => {
      return !!(props.reserveData?.dependiente?.nombreCompleto && props.reserveData.dependiente?.parentesco)
    })

    const closeDialog = () => { showDialog.value = false }

    const formatDate = (dateString) => {
      if (!dateString) return 'No disponible'
      try {
        if (dateString.includes('-')) {
          const [year, month, day] = dateString.split('-')
          return `${day}/${month}/${year}`
        }
        if (dateString.includes('/')) return dateString
        const date = new Date(dateString)
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
        }
        return 'Fecha inválida'
      } catch { return 'Fecha inválida' }
    }

    return { showDialog, hasDependiente, closeDialog, formatDate }
  }
}
</script>

<style scoped>
.detail-dialog {
  max-width: 640px;
  width: 100%;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  background: #fff;
  overflow: hidden;
}

/* header & footer fixed */
.dialog-header, .dialog-actions {
  flex: 0 0 auto;
  padding: 12px 16px;
}

/* central area scrollable */
.dialog-content-scrollable {
  flex: 1 1 auto;
  min-height: 0; /* crucial for flex scroll */
  overflow-y: auto;
  padding: 16px;
}

/* ensure children can shrink (avoid overflow) */
.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

/* Reserva row: allow wrap and shrink */
.reserva-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: stretch;
}

.reserva-box,
.dependiente-section,
.no-dependiente-section {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e1e8ed;
  background: #f8f9fa;
  flex: 1 1 140px;
  min-width: 0; /* important: allow shrinking to avoid overflow */
}

/* Labels / values use flex so long values wrap, right align on wide screens */
.box-label,
.detail-label,
.label {
  font-weight: 600;
  color: #6c757d;
  font-size: 0.9rem;
}

.box-value,
.detail-value,
.value {
  color: #2c3e50;
  font-weight: 600;
  text-align: right;
  word-break: break-word;
  overflow-wrap: anywhere;
}

/* detail rows: label left, value right; allow wrapping */
.detail-item,
.info-row {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f3f4;
}

.detail-item:last-child,
.info-row:last-child {
  border-bottom: none;
}

/* left label fixed-ish, right value flexible */
.detail-item .detail-label,
.info-row .label {
  flex: 0 0 40%;
  max-width: 40%;
  color: #6c757d;
}

.detail-item .detail-value,
.info-row .value {
  flex: 1 1 60%;
  text-align: right;
}

/* tipo-reserva */
.tipo-reserva-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  background: #e3f2fd;
  border: 1px solid #bbdefb;
  color: #1565c0;
  font-weight: 500;
}
.tipo-reserva-section.for-other {
  background: #fff3e0;
  border-color: #ffe0b2;
  color: #e65100;
}

/* responsive: stack label/value on small screens */
@media (max-width: 600px) {
  .detail-dialog {
    max-width: 95vw;
    margin: 8px;
  }
  .reserva-row { flex-direction: column; }
  .detail-item, .info-row { flex-direction: column; align-items: flex-start; }
  .detail-item .detail-label,
  .info-row .label { flex: 0 0 auto; max-width: 100%; }
  .detail-item .detail-value,
  .info-row .value { flex: 0 0 auto; text-align: left; margin-top: 6px; }
}
</style>
