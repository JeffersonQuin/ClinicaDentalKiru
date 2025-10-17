import { defineStore } from 'pinia'
import { Canvas, Group, Circle, Triangle, Rect, Line, Text } from 'fabric'

export const useOdontogramaStore = defineStore('odontograma', {
  state: () => ({
    canvas: null,
    odontograma: {
      odontograma_id: 'ODO-001',
      paciente_id: 'PAC-001',
      fecha: '2025-10-16',
      tipo: 'grafico',
      dientes: []
    },
    dientesData: [
      {
        id: '11',
        numero: '11',
        tipo: 'incisivo',
        cuadrante: 1,
        posicion: { x: 500, y: 100 },
        tamaño: { width: 40, height: 60 },
        superficies: {
          oclusal: '#FF0000',
          vestibular: null,
          mesial: null,
          distal: null,
          palatino: null
        },
        material: null,
        simbolos: []
      },
      {
        id: '12',
        numero: '12',
        tipo: 'incisivo',
        cuadrante: 1,
        posicion: { x: 450, y: 100 },
        tamaño: { width: 40, height: 60 },
        superficies: {
          oclusal: null,
          vestibular: '#0000FF',
          mesial: null,
          distal: null,
          palatino: null
        },
        material: 'Resina',
        simbolos: []
      },
      {
        id: '16',
        numero: '16',
        tipo: 'molar',
        cuadrante: 1,
        posicion: { x: 300, y: 100 },
        tamaño: { width: 50, height: 50 },
        superficies: {
          oclusal: '#0000FF',
          vestibular: '#FF0000',
          mesial: '#00FF00',
          distal: null,
          palatino: '#FFFF00'
        },
        material: 'AM',
        simbolos: ['E_relleno']
      },
      {
        id: '21',
        numero: '21',
        tipo: 'incisivo',
        cuadrante: 2,
        posicion: { x: 550, y: 100 },
        tamaño: { width: 40, height: 60 },
        superficies: {
          oclusal: null,
          vestibular: null,
          mesial: null,
          distal: null,
          palatino: null
        },
        material: null,
        simbolos: []
      },
      {
        id: '26',
        numero: '26',
        tipo: 'molar',
        cuadrante: 2,
        posicion: { x: 750, y: 100 },
        tamaño: { width: 50, height: 50 },
        superficies: {
          oclusal: null,
          vestibular: null,
          mesial: null,
          distal: null,
          palatino: null
        },
        material: null,
        simbolos: ['cruz']
      },
      {
        id: '31',
        numero: '31',
        tipo: 'incisivo',
        cuadrante: 3,
        posicion: { x: 550, y: 400 },
        tamaño: { width: 30, height: 50 },
        superficies: {
          oclusal: null,
          vestibular: null,
          mesial: null,
          distal: null,
          lingual: null
        },
        material: null,
        simbolos: []
      },
      {
        id: '36',
        numero: '36',
        tipo: 'molar',
        cuadrante: 3,
        posicion: { x: 750, y: 400 },
        tamaño: { width: 50, height: 50 },
        superficies: {
          oclusal: null,
          vestibular: null,
          mesial: null,
          distal: null,
          lingual: null
        },
        material: null,
        simbolos: ['cruz_gris_IMP']
      },
      {
        id: '46',
        numero: '46',
        tipo: 'molar',
        cuadrante: 4,
        posicion: { x: 300, y: 400 },
        tamaño: { width: 50, height: 50 },
        superficies: {
          oclusal: '#FFFF00',
          vestibular: null,
          mesial: null,
          distal: null,
          lingual: null
        },
        material: null,
        simbolos: []
      }
    ],
    colores: {
      rojo: { hex: '#FF0000', descripcion: 'Patología pendiente' },
      azul: { hex: '#0000FF', descripcion: 'Restauración' },
      verde: { hex: '#00FF00', descripcion: 'Caries radiográfica' },
      amarillo: { hex: '#FFFF00', descripcion: 'Sellado' },
      negro: { hex: '#000000', descripcion: 'Ausencia natural' },
      gris: { hex: '#808080', descripcion: 'Implante/Prótesis' }
    },
    simbolos: {
      cruz: {
        tipo: 'exodoncia',
        path: 'M10,10 L40,40 M40,10 L10,40'
      },
      E_relleno: {
        tipo: 'endodoncia',
        path: 'M15,15 L35,15 L35,35 L15,35 Z M10,20 L40,20 M10,30 L40,30'
      },
      cruz_gris_IMP: {
        tipo: 'implante',
        path: 'M10,10 L40,40 M40,10 L10,40'
      }
    },
    selectedDiente: null,
    selectedSuperficie: null
  }),

  getters: {
    getDienteById: (state) => (id) => {
      return state.dientesData.find(d => d.id === id)
    },
    
    getDientesPorCuadrante: (state) => (cuadrante) => {
      return state.dientesData.filter(d => d.cuadrante === cuadrante)
    },

    getTotalDientes: (state) => state.dientesData.length,

    getDientesConPatologia: (state) => {
      return state.dientesData.filter(d => 
        Object.values(d.superficies).some(color => color === '#FF0000')
      )
    }
  },

  actions: {
    initCanvas(canvasElement) {
      this.canvas = new Canvas(canvasElement, {
        width: 1200,
        height: 600,
        backgroundColor: '#f5f5f5',
        selection: false
      })
      
      this.renderOdontograma()
    },

    renderOdontograma() {
      if (!this.canvas) return
      
      this.canvas.clear()
      this.canvas.backgroundColor = '#f5f5f5'
      
      // Renderizar cada diente
      this.dientesData.forEach(diente => {
        this.renderDiente(diente)
      })
      
      this.canvas.renderAll()
    },

    renderDiente(diente) {
      const { x, y } = diente.posicion
      const { width, height } = diente.tamaño
      
      // Array para almacenar las partes del diente
      const partesDiente = []

      // Si es molar (forma cuadrada)
      if (diente.tipo === 'molar') {
        partesDiente.push(...this.renderMolar(diente, width, height))
      } else {
        // Incisivo o canino (forma rectangular vertical)
        partesDiente.push(...this.renderIncisivo(diente, width, height))
      }

      // Agregar número del diente
      const text = new Text(diente.numero, {
        left: 0,
        top: height + 5,
        fontSize: 14,
        fontFamily: 'Arial',
        fill: '#000',
        originX: 'center',
        originY: 'top'
      })
      partesDiente.push(text)

      // Agregar material si existe
      if (diente.material) {
        const materialText = new Text(diente.material, {
          left: 0,
          top: height + 22,
          fontSize: 10,
          fontFamily: 'Arial',
          fill: '#666',
          originX: 'center',
          originY: 'top'
        })
        partesDiente.push(materialText)
      }

      // Renderizar símbolos
      if (diente.simbolos && diente.simbolos.length > 0) {
        diente.simbolos.forEach(simbolo => {
          partesDiente.push(...this.renderSimbolo(simbolo, width, height))
        })
      }

      // Crear grupo con todas las partes
      const dienteGroup = new Group(partesDiente, {
        left: x,
        top: y,
        selectable: true,
        hasControls: false,
        hasBorders: true,
        borderColor: '#333',
        cornerColor: '#333'
      })

      // Agregar evento de clic
      dienteGroup.on('mousedown', () => {
        this.selectDiente(diente.id)
      })

      dienteGroup.set('dienteId', diente.id)
      
      this.canvas.add(dienteGroup)
    },

    renderMolar(diente, width, height) {
      const halfW = width / 2
      const halfH = height / 2
      const partes = []

      // Oclusal (centro)
      const oclusal = new Circle({
        left: 0,
        top: 0,
        radius: Math.min(halfW, halfH) * 0.6,
        fill: diente.superficies.oclusal || '#FFF',
        stroke: '#000',
        strokeWidth: 2,
        originX: 'center',
        originY: 'center'
      })
      partes.push(oclusal)

      // Vestibular (arriba)
      const vestibular = new Triangle({
        left: 0,
        top: -halfH,
        width: width * 0.8,
        height: halfH * 0.6,
        fill: diente.superficies.vestibular || '#FFF',
        stroke: '#000',
        strokeWidth: 2,
        originX: 'center',
        originY: 'bottom'
      })
      partes.push(vestibular)

      // Mesial (izquierda)
      const mesial = new Triangle({
        left: -halfW,
        top: 0,
        width: halfW * 0.6,
        height: height * 0.8,
        fill: diente.superficies.mesial || '#FFF',
        stroke: '#000',
        strokeWidth: 2,
        angle: -90,
        originX: 'center',
        originY: 'center'
      })
      partes.push(mesial)

      // Distal (derecha)
      const distal = new Triangle({
        left: halfW,
        top: 0,
        width: halfW * 0.6,
        height: height * 0.8,
        fill: diente.superficies.distal || '#FFF',
        stroke: '#000',
        strokeWidth: 2,
        angle: 90,
        originX: 'center',
        originY: 'center'
      })
      partes.push(distal)

      // Palatino/Lingual (abajo)
      const palatino = new Triangle({
        left: 0,
        top: halfH,
        width: width * 0.8,
        height: halfH * 0.6,
        fill: diente.superficies.palatino || diente.superficies.lingual || '#FFF',
        stroke: '#000',
        strokeWidth: 2,
        angle: 180,
        originX: 'center',
        originY: 'bottom'
      })
      partes.push(palatino)

      return partes
    },

    renderIncisivo(diente, width, height) {
      const halfW = width / 2
      const halfH = height / 2
      const partes = []

      // Oclusal (arriba - borde incisal)
      const oclusal = new Rect({
        left: 0,
        top: -halfH,
        width: width * 0.8,
        height: height * 0.15,
        fill: diente.superficies.oclusal || '#FFF',
        stroke: '#000',
        strokeWidth: 2,
        originX: 'center',
        originY: 'center'
      })
      partes.push(oclusal)

      // Vestibular (centro-arriba)
      const vestibular = new Rect({
        left: 0,
        top: -halfH * 0.4,
        width: width * 0.8,
        height: height * 0.4,
        fill: diente.superficies.vestibular || '#FFF',
        stroke: '#000',
        strokeWidth: 2,
        originX: 'center',
        originY: 'center'
      })
      partes.push(vestibular)

      // Mesial (izquierda)
      const mesial = new Rect({
        left: -halfW * 0.6,
        top: 0,
        width: width * 0.2,
        height: height * 0.6,
        fill: diente.superficies.mesial || '#FFF',
        stroke: '#000',
        strokeWidth: 2,
        originX: 'center',
        originY: 'center'
      })
      partes.push(mesial)

      // Distal (derecha)
      const distal = new Rect({
        left: halfW * 0.6,
        top: 0,
        width: width * 0.2,
        height: height * 0.6,
        fill: diente.superficies.distal || '#FFF',
        stroke: '#000',
        strokeWidth: 2,
        originX: 'center',
        originY: 'center'
      })
      partes.push(distal)

      // Palatino (abajo)
      const palatino = new Rect({
        left: 0,
        top: halfH * 0.4,
        width: width * 0.8,
        height: height * 0.4,
        fill: diente.superficies.palatino || '#FFF',
        stroke: '#000',
        strokeWidth: 2,
        originX: 'center',
        originY: 'center'
      })
      partes.push(palatino)

      return partes
    },

    renderSimbolo(simboloKey) {
      const simbolo = this.simbolos[simboloKey]
      const partes = []
      
      if (!simbolo) return partes

      if (simboloKey === 'cruz' || simboloKey === 'cruz_gris_IMP') {
        // Cruz de exodoncia o implante
        const line1 = new Line([-15, -15, 15, 15], {
          stroke: simboloKey === 'cruz_gris_IMP' ? '#808080' : '#000',
          strokeWidth: 3,
          left: 0,
          top: 0,
          originX: 'center',
          originY: 'center'
        })
        const line2 = new Line([15, -15, -15, 15], {
          stroke: simboloKey === 'cruz_gris_IMP' ? '#808080' : '#000',
          strokeWidth: 3,
          left: 0,
          top: 0,
          originX: 'center',
          originY: 'center'
        })
        partes.push(line1, line2)

        if (simboloKey === 'cruz_gris_IMP') {
          const impText = new Text('IMP', {
            left: 0,
            top: 20,
            fontSize: 10,
            fill: '#808080',
            originX: 'center',
            originY: 'center'
          })
          partes.push(impText)
        }
      } else if (simboloKey === 'E_relleno') {
        // Endodoncia
        const rect = new Rect({
          left: 0,
          top: 0,
          width: 20,
          height: 30,
          fill: 'transparent',
          stroke: '#FF0000',
          strokeWidth: 2,
          originX: 'center',
          originY: 'center'
        })
        const line1 = new Line([-10, -5, 10, -5], {
          stroke: '#FF0000',
          strokeWidth: 2
        })
        const line2 = new Line([-10, 5, 10, 5], {
          stroke: '#FF0000',
          strokeWidth: 2
        })
        partes.push(rect, line1, line2)
      }

      return partes
    },

    selectDiente(dienteId) {
      this.selectedDiente = dienteId
      console.log('Diente seleccionado:', dienteId)
    },

    actualizarSuperficie(dienteId, superficie, color) {
      const diente = this.getDienteById(dienteId)
      if (diente) {
        diente.superficies[superficie] = color
        this.renderOdontograma()
      }
    },

    agregarSimbolo(dienteId, simbolo) {
      const diente = this.getDienteById(dienteId)
      if (diente && !diente.simbolos.includes(simbolo)) {
        diente.simbolos.push(simbolo)
        this.renderOdontograma()
      }
    },

    eliminarSimbolo(dienteId, simbolo) {
      const diente = this.getDienteById(dienteId)
      if (diente) {
        diente.simbolos = diente.simbolos.filter(s => s !== simbolo)
        this.renderOdontograma()
      }
    },

    exportarJSON() {
      return JSON.stringify({
        ...this.odontograma,
        dientes: this.dientesData
      }, null, 2)
    },

    importarJSON(jsonData) {
      try {
        const data = JSON.parse(jsonData)
        this.dientesData = data.dientes
        this.renderOdontograma()
        return true
      } catch (error) {
        console.error('Error al importar JSON:', error)
        return false
      }
    },

    limpiarCanvas() {
      if (this.canvas) {
        this.canvas.clear()
      }
    }
  }
})