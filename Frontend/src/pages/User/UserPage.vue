<template>
  <div class="q-pa-md">
    <!-- Tabla -->
    <GenericTable
      title="Gestión de Usuarios"
      :rows="items"
      :columns="columns"
      :loading="loading"
      @add="openForm()"
      @action="handleAction"
    />

    <!-- Formulario -->
    <GenericDialog
      v-model="showForm"
      :title="isEditing ? 'Editar Usuario' : 'Nuevo Usuario'"
    >
      <GenericForm
        :fields="fields"
        v-model="currentItem"
        :loading="loading"
        @submit="handleSubmit"
        @cancel="showForm = false"
      />
    </GenericDialog>

    <!-- Vista de detalles -->
    <GenericDialog
      v-model="showDetails"
      title="Detalles del Usuario"
      :show-actions="false"
    >
      <div class="q-gutter-md">
        <div><strong>ID:</strong> {{ currentItem.id }}</div>
        <div><strong>Nombre:</strong> {{ currentItem.nombre }}</div>
        <div><strong>Email:</strong> {{ currentItem.email }}</div>
        <div><strong>Edad:</strong> {{ currentItem.edad }} años</div>
        <div><strong>Teléfono:</strong> {{ currentItem.telefono }}</div>
        <div><strong>Cargo:</strong> {{ currentItem.cargo }}</div>
        <div>
          <strong>Estado:</strong> 
          <q-chip 
            :color="currentItem.activo ? 'positive' : 'negative'" 
            text-color="white"
            dense
          >
            {{ currentItem.activo ? 'Activo' : 'Inactivo' }}
          </q-chip>
        </div>
        <div><strong>Fecha de Registro:</strong> {{ formatDate(currentItem.fecha_registro) }}</div>
      </div>
    </GenericDialog>

    <!-- Confirmación de eliminación -->
    <GenericDialog
      v-model="showConfirm"
      title="Confirmar eliminación"
      :message="`¿Estás seguro de que deseas eliminar al usuario '${currentItem.nombre}'?`"
      @action="handleConfirmAction"
    />

    <!-- Notificaciones -->
    <q-banner
      v-if="notification.show"
      :class="`bg-${notification.type} text-white q-mb-md`"
      dense
    >
      {{ notification.message }}
      <template v-slot:action>
        <q-btn
          flat
          dense
          icon="close"
          @click="hideNotification"
        />
      </template>
    </q-banner>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { FIELD_TYPES, VALIDATION_TYPES } from '../fieldConfig.js'
import GenericTable from '../../components/GenericTable.vue'
import GenericForm from '../../components/GenericForm.vue'
import GenericDialog from '../../components/GenericDialog.vue'

import usersData from '../../data/users.json'

export default {
  name: 'UsersCrudWithTestData',
  components: {
    GenericTable,
    GenericForm,
    GenericDialog
  },
  setup() {
    // Estado reactivo
    const loading = ref(false)
    const items = ref([])
    const currentItem = reactive({})
    const showForm = ref(false)
    const showDetails = ref(false)
    const showConfirm = ref(false)
    const isEditing = ref(false)
    const notification = reactive({
      show: false,
      type: 'positive',
      message: ''
    })

    // Configuración de columnas de la tabla
    const columns = [
      { 
        name: 'id', 
        label: 'ID', 
        field: 'id', 
        align: 'left',
        sortable: true,
        style: 'width: 50px'
      },
      { 
        name: 'nombre', 
        label: 'Nombre', 
        field: 'nombre', 
        align: 'left',
        sortable: true
      },
      { 
        name: 'email', 
        label: 'Email', 
        field: 'email', 
        align: 'left',
        sortable: true
      },
      { 
        name: 'edad', 
        label: 'Edad', 
        field: 'edad', 
        align: 'center',
        sortable: true,
        style: 'width: 70px'
      },
      { 
        name: 'cargo', 
        label: 'Cargo', 
        field: 'cargo', 
        align: 'left',
        sortable: true
      },
      { 
        name: 'activo', 
        label: 'Estado', 
        field: 'activo', 
        align: 'center',
        format: (val) => val ? 'Activo' : 'Inactivo',
        style: 'width: 100px'
      },
      { 
        name: 'actions', 
        label: 'Acciones', 
        field: 'actions', 
        align: 'center',
        style: 'width: 150px'
      }
    ]

    // Configuración de campos del formulario
    const fields = [
      {
        name: 'nombre',
        label: 'Nombre Completo',
        type: FIELD_TYPES.TEXT,
        validations: [
          { type: VALIDATION_TYPES.REQUIRED, message: 'El nombre es obligatorio' },
          { type: VALIDATION_TYPES.MIN_LENGTH, value: 2, message: 'Mínimo 2 caracteres' },
          { type: VALIDATION_TYPES.MAX_LENGTH, value: 50, message: 'Máximo 50 caracteres' }
        ]
      },
      {
        name: 'email',
        label: 'Correo Electrónico',
        type: FIELD_TYPES.EMAIL,
        validations: [
          { type: VALIDATION_TYPES.REQUIRED, message: 'El email es obligatorio' },
          { type: VALIDATION_TYPES.EMAIL, message: 'Formato de email inválido' }
        ]
      },
      {
        name: 'edad',
        label: 'Edad',
        type: FIELD_TYPES.NUMBER,
        validations: [
          { type: VALIDATION_TYPES.REQUIRED, message: 'La edad es obligatoria' },
          { type: VALIDATION_TYPES.MIN_VALUE, value: 18, message: 'Edad mínima 18 años' },
          { type: VALIDATION_TYPES.MAX_VALUE, value: 65, message: 'Edad máxima 65 años' }
        ]
      },
      {
        name: 'telefono',
        label: 'Teléfono',
        type: FIELD_TYPES.TEXT,
        validations: [
          { type: VALIDATION_TYPES.REQUIRED, message: 'El teléfono es obligatorio' }
        ]
      },
      {
        name: 'cargo',
        label: 'Cargo',
        type: FIELD_TYPES.SELECT,
        options: [
          { label: 'Desarrolladora Frontend', value: 'Desarrolladora Frontend' },
          { label: 'Backend Developer', value: 'Backend Developer' },
          { label: 'Full Stack Developer', value: 'Full Stack Developer' },
          { label: 'Mobile Developer', value: 'Mobile Developer' },
          { label: 'DevOps Engineer', value: 'DevOps Engineer' },
          { label: 'QA Tester', value: 'QA Tester' },
          { label: 'UX Designer', value: 'UX Designer' },
          { label: 'UI Designer', value: 'UI Designer' },
          { label: 'Project Manager', value: 'Project Manager' },
          { label: 'Product Owner', value: 'Product Owner' },
          { label: 'Scrum Master', value: 'Scrum Master' },
          { label: 'Tech Lead', value: 'Tech Lead' },
          { label: 'Data Analyst', value: 'Data Analyst' },
          { label: 'Database Administrator', value: 'Database Administrator' },
          { label: 'Business Analyst', value: 'Business Analyst' },
          { label: 'Security Specialist', value: 'Security Specialist' }
        ],
        validations: [
          { type: VALIDATION_TYPES.REQUIRED, message: 'El cargo es obligatorio' }
        ]
      },
      {
        name: 'activo',
        label: 'Usuario Activo',
        type: FIELD_TYPES.CHECKBOX
      },
      {
        name: 'fecha_registro',
        label: 'Fecha de Registro',
        type: FIELD_TYPES.DATE,
        validations: [
          { type: VALIDATION_TYPES.REQUIRED, message: 'La fecha de registro es obligatoria' }
        ]
      }
    ]

    // Funciones CRUD simuladas
    const fetchItems = async () => {
      loading.value = true
      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500))
        items.value = usersData.users
        showNotification('Datos cargados correctamente', 'positive')
      } catch (error) {
        showNotification('Error al cargar los datos', 'negative')
        console.error('Error fetching items:', error)
      } finally {
        loading.value = false
      }
    }

    const createItem = async (data) => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const newId = Math.max(...items.value.map(item => item.id)) + 1
        const newItem = { ...data, id: newId }
        items.value.push(newItem)
        showForm.value = false
        showNotification('Usuario creado exitosamente', 'positive')
      } catch (error) {
        showNotification('Error al crear el usuario', 'negative')
        console.error('Error creating item:', error)
      } finally {
        loading.value = false
      }
    }

    const updateItem = async (id, data) => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const index = items.value.findIndex(item => item.id === id)
        if (index !== -1) {
          items.value[index] = { ...data, id }
        }
        showForm.value = false
        showNotification('Usuario actualizado exitosamente', 'positive')
      } catch (error) {
        showNotification('Error al actualizar el usuario', 'negative')
        console.error('Error updating item:', error)
      } finally {
        loading.value = false
      }
    }

    const deleteItem = async (id) => {
      loading.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        const index = items.value.findIndex(item => item.id === id)
        if (index !== -1) {
          items.value.splice(index, 1)
        }
        showNotification('Usuario eliminado exitosamente', 'positive')
      } catch (error) {
        showNotification('Error al eliminar el usuario', 'negative')
        console.error('Error deleting item:', error)
      } finally {
        loading.value = false
      }
    }

    // Funciones de manejo de formulario
    const openForm = (item = null) => {
      if (item) {
        Object.assign(currentItem, item)
        isEditing.value = true
      } else {
        // Resetear el formulario con valores por defecto
        Object.keys(currentItem).forEach(key => delete currentItem[key])
        Object.assign(currentItem, {
          nombre: '',
          email: '',
          edad: '',
          telefono: '',
          cargo: '',
          activo: true,
          fecha_registro: new Date().toISOString().split('T')[0]
        })
        isEditing.value = false
      }
      showForm.value = true
    }

    const openDetails = (item) => {
      Object.assign(currentItem, item)
      showDetails.value = true
    }

    const openConfirmDelete = (item) => {
      Object.assign(currentItem, item)
      showConfirm.value = true
    }

    const handleSubmit = (data) => {
      if (isEditing.value) {
        updateItem(currentItem.id, data)
      } else {
        createItem(data)
      }
    }

    const handleAction = ({ action, row }) => {
      switch (action) {
        case 'view':
          openDetails(row)
          break
        case 'edit':
          openForm(row)
          break
        case 'delete':
          openConfirmDelete(row)
          break
      }
    }

    const handleConfirmAction = (action) => {
      if (action === 'accept') {
        deleteItem(currentItem.id)
      }
    }

    // Funciones de utilidad
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const showNotification = (message, type = 'positive') => {
      notification.message = message
      notification.type = type
      notification.show = true
      // Auto-ocultar después de 3 segundos
      setTimeout(() => {
        notification.show = false
      }, 3000)
    }

    const hideNotification = () => {
      notification.show = false
    }

    // Cargar datos al montar el componente
    onMounted(() => {
      fetchItems()
    })

    return {
      loading,
      items,
      currentItem,
      showForm,
      showDetails,
      showConfirm,
      isEditing,
      notification,
      columns,
      fields,
      openForm,
      handleAction,
      handleConfirmAction,
      handleSubmit,
      formatDate,
      hideNotification
    }
  }
}
</script>

<style scoped>
.q-table th {
  font-weight: bold;
}

.q-banner {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
}
</style>