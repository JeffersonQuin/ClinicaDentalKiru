<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <i class="fa-solid fa-chart-line header-icon"></i>
          <div>
            <h1 class="page-title">Estadísticas del Sistema</h1>
            <p class="page-subtitle">Análisis y métricas de rendimiento dental</p>
          </div>
        </div>
        
        <div class="header-actions">
          <q-select
            v-model="filtroTiempo"
            :options="opcionesFiltro"
            label="Ver por"
            outlined
            dense
            style="min-width: 150px"
          />
          
          <q-input
            v-model="fechaSeleccionada"
            type="date"
            label="Fecha"
            outlined
            dense
          />
        </div>
      </div>
    </div>

    <!-- Estadísticas KPIs -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-icon-container total">
          <i class="fa-solid fa-users"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ estadisticas.totalPacientes }}</div>
          <div class="stat-label">Pacientes Activos</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon-container doctor">
          <i class="fa-solid fa-user-md"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ estadisticas.totalDentistas }}</div>
          <div class="stat-label">Dentistas Activos</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon-container appointment">
          <i class="fa-solid fa-calendar-check"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ estadisticas.totalCitas }}</div>
          <div class="stat-label">Citas Programadas</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon-container money">
          <i class="fa-solid fa-dollar-sign"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">Bs. {{ formatearNumero(estadisticas.ingresosTotales) }}</div>
          <div class="stat-label">Ingresos Totales</div>
        </div>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="charts-section">
      <!-- Gráfico de Citas por Mes -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <i class="fa-solid fa-trending-up"></i>
            Citas por Mes
          </h3>
          <div class="chart-actions">
            <q-btn
              flat
              icon="fa-solid fa-download"
              @click="descargarGrafico('citasMes')"
              color="primary"
              size="sm"
            >
              <q-tooltip>Descargar gráfico</q-tooltip>
            </q-btn>
          </div>
        </div>
        <div class="chart-container">
          <canvas ref="citasMesChart" id="citasMesChart"></canvas>
        </div>
      </div>

      <!-- Gráfico de Pacientes por Ciudad -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <i class="fa-solid fa-map-marker-alt"></i>
            Pacientes por Ciudad
          </h3>
          <div class="chart-actions">
            <q-btn
              flat
              icon="fa-solid fa-download"
              @click="descargarGrafico('ciudades')"
              color="primary"
              size="sm"
            >
              <q-tooltip>Descargar gráfico</q-tooltip>
            </q-btn>
          </div>
        </div>
        <div class="chart-container">
          <canvas ref="ciudadesChart" id="ciudadesChart"></canvas>
        </div>
      </div>

      <!-- Gráfico de Servicios Más Comunes -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <i class="fa-solid fa-tooth"></i>
            Servicios Más Solicitados
          </h3>
          <div class="chart-actions">
            <q-btn
              flat
              icon="fa-solid fa-download"
              @click="descargarGrafico('servicios')"
              color="primary"
              size="sm"
            >
              <q-tooltip>Descargar gráfico</q-tooltip>
            </q-btn>
          </div>
        </div>
        <div class="chart-container">
          <canvas ref="serviciosChart" id="serviciosChart"></canvas>
        </div>
      </div>

      <!-- Gráfico de Estado de Tratamientos -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">
            <i class="fa-solid fa-chart-pie"></i>
            Estado de Tratamientos
          </h3>
          <div class="chart-actions">
            <q-btn
              flat
              icon="fa-solid fa-download"
              @click="descargarGrafico('tratamientos')"
              color="primary"
              size="sm"
            >
              <q-tooltip>Descargar gráfico</q-tooltip>
            </q-btn>
          </div>
        </div>
        <div class="chart-container">
          <canvas ref="tratamientosChart" id="tratamientosChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Información Adicional -->
    <div class="info-section">
      <div class="info-card">
        <div class="info-header">
          <h3 class="info-title">
            <i class="fa-solid fa-star"></i>
            Dentista Más Ocupado
          </h3>
        </div>
        <div class="info-content">
          <div class="dentist-info">
            <p class="dentist-name">{{ dentistaMasOcupado?.dentista?.name || 'N/A' }} {{ dentistaMasOcupado?.dentista?.father_last_name || '' }}</p>
            <p class="dentist-stats">{{ dentistaMasOcupado?.citas || 0 }} citas programadas</p>
          </div>
        </div>
      </div>

      <div class="info-card">
        <div class="info-header">
          <h3 class="info-title">
            <i class="fa-solid fa-birthday-cake"></i>
            Edad Promedio de Pacientes
          </h3>
        </div>
        <div class="info-content">
          <div class="age-info">
            <p class="age-number">{{ Math.round(estadisticas.edadPromediosPacientes) }} años</p>
            <p class="age-description">Promedio general</p>
          </div>
        </div>
      </div>

      <div class="info-card">
        <div class="info-header">
          <h3 class="info-title">
            <i class="fa-solid fa-clipboard-list"></i>
            Motivos de Consulta Principales
          </h3>
        </div>
        <div class="info-content">
          <div class="motives-list">
            <div v-for="(cantidad, motivo) in motivosTopLimitados" :key="motivo" class="motive-item">
              <span class="motive-name">{{ motivo }}</span>
              <div class="motive-badge">{{ cantidad }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón para generar reporte PDF -->
    <div class="report-section">
      <q-btn
        class="primary-btn"
        icon="fa-solid fa-file-pdf"
        label="Generar Reporte PDF"
        @click="generarReportePDF"
        unelevated
        no-caps
        size="md"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useEstadisticasStore } from '../../stores/estadisticaStore'
import { Chart, registerables } from 'chart.js'
import { useQuasar } from 'quasar'

Chart.register(...registerables)

export default {
  name: 'EstadisticasPage',
  setup() {
    const $q = useQuasar()
    const estadisticas = useEstadisticasStore()
    
    // Referencias para los canvas de los gráficos
    const citasMesChart = ref(null)
    const ciudadesChart = ref(null)
    const serviciosChart = ref(null)
    const tratamientosChart = ref(null)
    
    // Variables reactivas
    const filtroTiempo = ref('mes')
    const fechaSeleccionada = ref(new Date().toISOString().split('T')[0])
    
    // Opciones del filtro
    const opcionesFiltro = [
      { label: 'Por día', value: 'dia' },
      { label: 'Por mes', value: 'mes' },
      { label: 'Por año', value: 'año' }
    ]
    
    // Charts instances
    let citasChart = null
    let ciudadesChartInstance = null
    let serviciosChartInstance = null
    let tratamientosChartInstance = null

    // Computed properties
    const dentistaMasOcupado = computed(() => estadisticas.dentistaMasOcupado)
    
    const motivosTopLimitados = computed(() => {
      const motivos = estadisticas.motivosConsultaMasComunes
      const entries = Object.entries(motivos)
      entries.sort((a, b) => b[1] - a[1])
      return Object.fromEntries(entries.slice(0, 5))
    })

    // Función para formatear números
    const formatearNumero = (numero) => {
      return new Intl.NumberFormat('es-BO').format(numero)
    }

    // Configuración de colores para los gráficos
    const colores = {
      primary: '#1976D2',
      secondary: '#424242',
      accent: '#82B1FF',
      positive: '#21BA45',
      negative: '#C10015',
      warning: '#F2C037',
      info: '#31CCEC',
      dark: '#1D1D1D'
    }

    const crearGraficoCitasPorMes = () => {
      if (citasChart) citasChart.destroy()
      
      const ctx = citasMesChart.value?.getContext('2d')
      if (!ctx) return

      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      const data = meses.map((mes, index) => estadisticas.citasPorMes[index] || 0)

      citasChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: meses,
          datasets: [{
            label: 'Citas',
            data: data,
            borderColor: colores.primary,
            backgroundColor: colores.primary + '20',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      })
    }

    const crearGraficoCiudades = () => {
      if (ciudadesChartInstance) ciudadesChartInstance.destroy()
      
      const ctx = ciudadesChart.value?.getContext('2d')
      if (!ctx) return

      const ciudades = estadisticas.pacientesPorCiudad
      const labels = Object.keys(ciudades)
      const data = Object.values(ciudades)

      ciudadesChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [
              colores.primary,
              colores.secondary,
              colores.accent,
              colores.positive,
              colores.warning
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })
    }

    const crearGraficoServicios = () => {
      if (serviciosChartInstance) serviciosChartInstance.destroy()
      
      const ctx = serviciosChart.value?.getContext('2d')
      if (!ctx) return

      const servicios = estadisticas.serviciosMasComunes
      const labels = Object.keys(servicios)
      const data = Object.values(servicios)

      serviciosChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Cantidad',
            data: data,
            backgroundColor: colores.positive
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      })
    }

    const crearGraficoTratamientos = () => {
      if (tratamientosChartInstance) tratamientosChartInstance.destroy()
      
      const ctx = tratamientosChart.value?.getContext('2d')
      if (!ctx) return

      const tratamientos = estadisticas.tratamientosPorEstado
      const labels = Object.keys(tratamientos)
      const data = Object.values(tratamientos)

      tratamientosChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels.map(label => {
            const labelMap = {
              'enfermo': 'Enfermo',
              'tratado': 'Tratado',
              'ausente': 'Ausente',
              'sano': 'Sano'
            }
            return labelMap[label] || label
          }),
          datasets: [{
            data: data,
            backgroundColor: [
              colores.negative,
              colores.positive,
              colores.warning,
              colores.info
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })
    }

    const inicializarGraficos = () => {
      setTimeout(() => {
        crearGraficoCitasPorMes()
        crearGraficoCiudades()
        crearGraficoServicios()
        crearGraficoTratamientos()
      }, 100)
    }

    // Función para descargar gráficos
    const descargarGrafico = (tipoGrafico) => {
      let chartInstance = null
      let filename = ''

      switch (tipoGrafico) {
        case 'citasMes':
          chartInstance = citasChart
          filename = 'citas-por-mes.png'
          break
        case 'ciudades':
          chartInstance = ciudadesChartInstance
          filename = 'pacientes-por-ciudad.png'
          break
        case 'servicios':
          chartInstance = serviciosChartInstance
          filename = 'servicios-mas-solicitados.png'
          break
        case 'tratamientos':
          chartInstance = tratamientosChartInstance
          filename = 'estado-tratamientos.png'
          break
      }

      if (chartInstance) {
        const url = chartInstance.toBase64Image()
        const link = document.createElement('a')
        link.download = filename
        link.href = url
        link.click()
        
        $q.notify({
          type: 'positive',
          message: 'Gráfico descargado exitosamente',
          position: 'top-right'
        })
      }
    }

    // Función para generar reporte PDF
    const generarReportePDF = async () => {
      try {
        $q.loading.show({
          message: 'Generando reporte PDF...'
        })

        // Importar las librerías dinámicamente
        const jsPDF = (await import('jspdf')).default
        const html2canvas = (await import('html2canvas')).default

        // Crear nuevo documento PDF
        const pdf = new jsPDF('p', 'mm', 'a4')
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        let yPosition = 20

        // Configurar fuentes y colores
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(20)
        pdf.setTextColor(25, 118, 210) // Color primario #1976D2

        // Título del reporte
        pdf.text('Reporte de Estadísticas - Sistema Dental', pageWidth / 2, yPosition, { align: 'center' })
        yPosition += 15

        // Fecha del reporte
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(12)
        pdf.setTextColor(100, 100, 100)
        const fechaActual = new Date().toLocaleDateString('es-BO', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        pdf.text(`Fecha de generación: ${fechaActual}`, pageWidth / 2, yPosition, { align: 'center' })
        yPosition += 20

        // Línea separadora
        pdf.setDrawColor(220, 220, 220)
        pdf.line(20, yPosition, pageWidth - 20, yPosition)
        yPosition += 15

        // Sección de KPIs
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(16)
        pdf.setTextColor(44, 62, 80)
        pdf.text('Indicadores Principales (KPIs)', 20, yPosition)
        yPosition += 10

        // KPIs en formato tabla
        const kpis = [
          ['Pacientes Activos', estadisticas.totalPacientes.toString()],
          ['Dentistas Activos', estadisticas.totalDentistas.toString()],
          ['Citas Programadas', estadisticas.totalCitas.toString()],
          ['Ingresos Totales', `Bs. ${formatearNumero(estadisticas.ingresosTotales)}`]
        ]

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(12)
        pdf.setTextColor(0, 0, 0)

        kpis.forEach(([label, value]) => {
          pdf.text(`• ${label}:`, 25, yPosition)
          pdf.setFont('helvetica', 'bold')
          pdf.text(value, 120, yPosition)
          pdf.setFont('helvetica', 'normal')
          yPosition += 8
        })

        yPosition += 10

        // Información adicional
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(14)
        pdf.setTextColor(44, 62, 80)
        pdf.text('Información Adicional', 20, yPosition)
        yPosition += 10

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(11)

        // Dentista más ocupado
        const dentistaMasOcupadoInfo = dentistaMasOcupado.value
        if (dentistaMasOcupadoInfo?.dentista) {
          pdf.text(`Dentista más ocupado: ${dentistaMasOcupadoInfo.dentista.name} ${dentistaMasOcupadoInfo.dentista.father_last_name}`, 25, yPosition)
          yPosition += 6
          pdf.text(`Número de citas: ${dentistaMasOcupadoInfo.citas}`, 25, yPosition)
          yPosition += 8
        }

        // Edad promedio
        pdf.text(`Edad promedio de pacientes: ${Math.round(estadisticas.edadPromediosPacientes)} años`, 25, yPosition)
        yPosition += 10

        // Motivos de consulta principales
        pdf.setFont('helvetica', 'bold')
        pdf.text('Motivos de consulta más comunes:', 25, yPosition)
        pdf.setFont('helvetica', 'normal')
        yPosition += 6

        Object.entries(motivosTopLimitados.value).slice(0, 5).forEach(([motivo, cantidad]) => {
          pdf.text(`• ${motivo}: ${cantidad} casos`, 30, yPosition)
          yPosition += 6
        })

        yPosition += 15

        // Nueva página para gráficos si es necesario
        if (yPosition > pageHeight - 60) {
          pdf.addPage()
          yPosition = 20
        }

        // Capturar y añadir gráficos
        const graficos = [
          { ref: citasMesChart, titulo: 'Citas por Mes' },
          { ref: ciudadesChart, titulo: 'Pacientes por Ciudad' },
          { ref: serviciosChart, titulo: 'Servicios Más Solicitados' },
          { ref: tratamientosChart, titulo: 'Estado de Tratamientos' }
        ]

        for (let i = 0; i < graficos.length; i++) {
          const { ref, titulo } = graficos[i]
          
          if (ref.value) {
            // Verificar si necesitamos nueva página
            if (yPosition > pageHeight - 100) {
              pdf.addPage()
              yPosition = 20
            }

            // Título del gráfico
            pdf.setFont('helvetica', 'bold')
            pdf.setFontSize(14)
            pdf.setTextColor(44, 62, 80)
            pdf.text(titulo, 20, yPosition)
            yPosition += 10

            try {
              // Capturar el canvas como imagen
              const canvas = await html2canvas(ref.value, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true
              })

              const imgData = canvas.toDataURL('image/png')
              const imgWidth = 160 // Ancho en mm
              const imgHeight = (canvas.height * imgWidth) / canvas.width

              // Añadir imagen al PDF
              pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight)
              yPosition += imgHeight + 15

            } catch (chartError) {
              console.warn(`Error capturando gráfico ${titulo}:`, chartError)
              pdf.setFont('helvetica', 'italic')
              pdf.setFontSize(10)
              pdf.setTextColor(150, 150, 150)
              pdf.text('(Error al capturar gráfico)', 20, yPosition)
              yPosition += 15
            }
          }
        }

        // Footer en todas las páginas
        const totalPages = pdf.internal.getNumberOfPages()
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i)
          
          // Línea del footer
          pdf.setDrawColor(220, 220, 220)
          pdf.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25)
          
          // Texto del footer
          pdf.setFont('helvetica', 'normal')
          pdf.setFontSize(8)
          pdf.setTextColor(100, 100, 100)
          pdf.text('Sistema Dental - Reporte de Estadísticas', 20, pageHeight - 15)
          pdf.text(`Página ${i} de ${totalPages}`, pageWidth - 20, pageHeight - 15, { align: 'right' })
          
          // Fecha en el footer
          const horaGeneracion = new Date().toLocaleString('es-BO')
          pdf.text(`Generado el: ${horaGeneracion}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
        }

        // Generar nombre del archivo
        const fechaArchivo = new Date().toISOString().split('T')[0]
        const nombreArchivo = `reporte-estadisticas-${fechaArchivo}.pdf`

        // Descargar el PDF
        pdf.save(nombreArchivo)

        $q.notify({
          type: 'positive',
          message: 'Reporte PDF generado exitosamente',
          position: 'top-right'
        })

      } catch (error) {
        console.error('Error generando PDF:', error)
        $q.notify({
          type: 'negative',
          message: 'Error al generar el reporte PDF: ' + (error.message || ''),
          position: 'top-right'
        })
      } finally {
        $q.loading.hide()
      }
    }

    // Watchers para actualizar gráficos cuando cambien los filtros
    watch([filtroTiempo, fechaSeleccionada], () => {
      inicializarGraficos()
    })

    onMounted(() => {
      inicializarGraficos()
    })

    return {
      estadisticas,
      filtroTiempo,
      fechaSeleccionada,
      opcionesFiltro,
      citasMesChart,
      ciudadesChart,
      serviciosChart,
      tratamientosChart,
      dentistaMasOcupado,
      motivosTopLimitados,
      formatearNumero,
      descargarGrafico,
      generarReportePDF
    }
  }
}
</script>

<style lang="scss" scoped>
// Estilos de gráficos
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  .chart-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    
    i {
      color: #1976D2;
    }
  }
  
  .chart-actions {
    display: flex;
    gap: 8px;
  }
}

.chart-container {
  position: relative;
  height: 320px;
  width: 100%;
}

// Estilos de información adicional
.info-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.info-header {
  margin-bottom: 16px;
  
  .info-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    
    i {
      color: #d2f50a;
    }
  }
}

.info-content {
  .dentist-info,
  .age-info {
    text-align: center;
    
    .dentist-name,
    .age-number {
      font-size: 1.25rem;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 4px;
    }
    
    .dentist-stats,
    .age-description {
      color: #7f8c8d;
      font-size: 0.875rem;
    }
  }
  
  .motives-list {
    .motive-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .motive-name {
        font-size: 0.875rem;
        color: #2c3e50;
        font-weight: 500;
      }
      
      .motive-badge {
        background: #1976D2;
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
      }
    }
  }
}

// Sección de reportes
.report-section {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.primary-btn {
  background: linear-gradient(135deg, #1976D2, #42A5F5);
  color: white;
  padding: 12px 32px;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(25, 118, 210, 0.4);
  }
}

// Filtros
.filter-select,
.date-input {
  min-width: 150px;
  
  :deep(.q-field__control) {
    background: white;
    border-radius: 8px;
  }
}

// Responsive design
@media (max-width: 1024px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .chart-container {
    height: 280px;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }
  
  .page-header .header-content {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .stats-section,
  .info-section {
    grid-template-columns: 1fr;
  }
  
  .chart-container {
    height: 240px;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .stat-value {
    font-size: 1.75rem !important;
  }
  
  .chart-card {
    padding: 16px;
  }
  
  .chart-container {
    height: 200px;
  }
}
</style>