<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="detail-dialog">
      <q-card-section class="dialog-header">
        <div class="header-content">
          <div class="header-title">
            <i class="fa-solid fa-user-circle"></i>
            <span>Detalles Paciente</span>
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

      <q-card-section class="dialog-tabs">
        <q-tabs v-model="tab" dense align="justify" class="tabs-bar">
          <q-tab name="info" label="Información" />
          <q-tab name="odontograma" label="Odontograma" />
          <q-tab name="imagenes" label="Imágenes" />
          <q-tab name="historial" label="Historial" />
        </q-tabs>
      </q-card-section>

      <q-separator />

      <q-card-section class="dialog-content">
        <q-tab-panels v-model="tab" animated>
          <!-- Información del paciente -->
          <q-tab-panel name="info">
            <div class="info-section">
              <div class="registro-row">
                <span><b>Fecha del Registro:</b> {{ formatDate(patientData?.fechaRegistro) }}</span>
              </div>
              <div class="historia-clinica-box">
                <h4>Historia Clínica Odontológica</h4>
                <div class="historia-fields">
                  <div><b>Nombre Completo:</b> {{ patientData?.nombre }} {{ patientData?.apellidoPaterno }} {{ patientData?.apellidoMaterno }}</div>
                  <div><b>C.I:</b> {{ patientData?.ci }}</div>
                  <div><b>Edad:</b> {{ getEdad(patientData?.fechaNacimiento) }}</div>
                  <div><b>Fecha Nacimiento:</b> {{ formatDate(patientData?.fechaNacimiento) }}</div>
                  <div><b>Ciudad:</b> {{ patientData?.ciudad }}</div>
                  <div><b>Profesión:</b> {{ patientData?.profesion }}</div>
                  <div><b>Estado Civil:</b> {{ patientData?.estadoCivil }}</div>
                  <div><b>Domicilio:</b> {{ patientData?.domicilio }}</div>
                  <div><b>Teléfono:</b> {{ patientData?.telefono }}</div>
                  <div><b>Gmail:</b> {{ patientData?.gmail }}</div>
                </div>
              </div>
              <div class="motivo-consulta-box">
                <h4>Motivo de Consulta</h4>
                <div><b>Última visita al Odontólogo:</b> {{ formatDate(patientData?.ultimaVisitaOdontologo) }}</div>
                <div><b>Motivo:</b> {{ patientData?.motivoConsulta }}</div>
                <div><b>Descripción:</b> {{ patientData?.descripcion }}</div>
              </div>
              <div class="antecedentes-alertas-row">
                <div class="antecedentes-box">
                  <h4>Antecedentes de Salud</h4>
                  <div>{{ patientData?.antecedentesSalud }}</div>
                </div>
                <div class="alertas-box">
                  <h4>Alertas Clínicas</h4>
                  <div>{{ patientData?.alertasClinicas }}</div>
                </div>
              </div>
            </div>
          </q-tab-panel>
          <!-- Odontograma -->
          <q-tab-panel name="odontograma">
            <div class="empty-section">
              <q-icon name="fa-solid fa-tooth" size="32px" color="grey-6" />
              <p>Odontograma vacío</p>
            </div>
          </q-tab-panel>
          <!-- Imágenes -->
          <q-tab-panel name="imagenes">
            <div class="empty-section">
              <q-icon name="fa-solid fa-image" size="32px" color="grey-6" />
              <p>Imágenes vacío</p>
            </div>
          </q-tab-panel>
          <!-- Historial -->
          <q-tab-panel name="historial">
            <div class="empty-section">
              <q-icon name="fa-solid fa-clock-rotate-left" size="32px" color="grey-6" />
              <p>Historial vacío</p>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-separator />

      <q-card-actions class="dialog-actions">
        <q-btn
          flat
          label="Cancelar"
          v-close-popup
          class="secondary-btn"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  name: 'DetailPatientDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    patientData: {
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
    const tab = ref('info')

    const formatDate = (dateString) => {
      if (!dateString) return 'No disponible'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch  {
        return 'Fecha inválida'
      }
    }

    const getEdad = (fechaNacimiento) => {
      if (!fechaNacimiento) return '--'
      const nacimiento = new Date(fechaNacimiento)
      const hoy = new Date()
      let edad = hoy.getFullYear() - nacimiento.getFullYear()
      const m = hoy.getMonth() - nacimiento.getMonth()
      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--
      }
      return edad
    }

    return {
      showDialog,
      tab,
      formatDate,
      getEdad
    }
  }
}
</script>


