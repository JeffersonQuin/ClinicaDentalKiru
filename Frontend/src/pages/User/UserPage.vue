<template>
  <div class="page-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <i class="fa-solid fa-users"></i>
          Gestión de Usuarios
        </h1>
        <q-btn
          class="primary-btn"
          color="primary"
          icon="fa-solid fa-plus"
          label="Nuevo Usuario"
          @click="openNewUserDialog"
          push
          no-caps
        />
      </div>
    </div>

    <!-- Search Section -->
    <div class="search-section">
      <q-input
        v-model="search"
        class="search-input"
        filled
        type="search"
        placeholder="Buscar por nombre, email o tipo de usuario..."
        @input="filterRows"
        clearable
      >
        <template v-slot:prepend>
          <i class="fa-solid fa-search text-grey-6"></i>
        </template>
      </q-input>
    </div>

    <!-- Table Section -->
    <div class="table-container">
      <q-table
        class="data-table"
        flat
        bordered
        :rows="filteredRows"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[5, 10, 15, 20, 0]"
        :pagination="{ rowsPerPage: 5 }"
        separator="horizontal"
      >
        <template v-slot:no-data>
          <div class="no-data-container">
            <i class="fa-solid fa-users-slash no-data-icon"></i>
            <p class="no-data-text">No se encontraron usuarios</p>
          </div>
        </template>

        <template v-slot:body-cell-avatar="props">
          <q-td :props="props">
            <div class="avatar-container">
              <q-avatar 
                :size="props.row.avatar ? '40px' : '40px'"
                class="user-avatar"
              >
                <img 
                  v-if="props.row.avatar" 
                  :src="props.row.avatar" 
                  :alt="props.row.username"
                  @error="handleImageError"
                />
                <span v-else>{{ getInitials(props.row.username) }}</span>
              </q-avatar>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-state="props">
          <q-td :props="props">
            <q-badge
              :class="getStateClass(props.row.state)"
              :label="formatState(props.row.state)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-type="props">
          <q-td :props="props">
            <q-chip
              :class="getTypeClass(props.row.type)"
              :label="props.row.type"
              dense
            />
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="action-buttons">
              <q-btn
                class="action-btn view-btn"
                dense
                round
                icon="fa-solid fa-eye"
                size="sm"
                @click="viewUser(props.row)"
                push
              >
                <q-tooltip>Ver detalles</q-tooltip>
              </q-btn>
              
              <q-btn
                class="action-btn edit-btn"
                dense
                round
                icon="fa-solid fa-edit"
                size="sm"
                @click="editUser(props.row)"
                push
              >
                <q-tooltip>Editar usuario</q-tooltip>
              </q-btn>
              
              <q-btn
                class="action-btn delete-btn"
                dense
                round
                icon="fa-solid fa-trash"
                size="sm"
                @click="confirmDeleteUser(props.row)"
                push
              >
                <q-tooltip>Eliminar usuario</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Branding Section -->
    <div class="branding-section">
      <q-img
        src="/KiruIMG/credential.png"
        class="hero-image"
        fit="contain"
      />
    </div>

    <!-- Dialogs -->
    <DetailUserDialog
      v-model="showDetailDialog"
      :user-data="selectedUser"
    />

    <EditUserDialog
      v-model="showEditDialog"
      :user-data="selectedUser"
      @user-updated="handleUserUpdate"
    />

    <NewUserDialog
      v-model="showNewDialog"
      @user-created="handleUserCreate"
    />

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card class="confirm-dialog">
        <q-card-section class="row items-center">
          <i class="fa-solid fa-exclamation-triangle text-warning q-mr-sm"></i>
          <span class="text-h6">Confirmar eliminación</span>
        </q-card-section>

        <q-card-section class="q-pt-none">
          ¿Está seguro que desea eliminar al usuario <strong>{{ selectedUser?.username }}</strong>?
          Esta acción no se puede deshacer.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn 
            flat 
            label="Eliminar" 
            color="negative" 
            @click="deleteUser"
            v-close-popup 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import users from 'src/data/users.json'
import Fuse from 'fuse.js'
import DetailUserDialog from './DetailUserDialog.vue'
import EditUserDialog from './EditUserDialog.vue'
import NewUserDialog from './NewUserDialog.vue'

const columns = [
  {
    name: 'avatar',
    required: true,
    label: 'Avatar',
    align: 'center',
    field: 'avatar',
    sortable: false,
    style: 'width: 80px'
  },
  {
    name: 'username',
    required: true,
    label: 'Usuario',
    align: 'left',
    field: 'username',
    sortable: true
  },
  {
    name: 'email',
    label: 'Correo Electrónico',
    field: 'email',
    sortable: true,
    align: 'left'
  },
  {
    name: 'type',
    label: 'Tipo',
    field: 'type',
    sortable: true,
    align: 'center',
    style: 'width: 120px'
  },
  {
    name: 'state',
    label: 'Estado',
    field: 'state',
    sortable: true,
    align: 'center',
    style: 'width: 100px'
  },
  {
    name: 'actions',
    label: 'Acciones',
    field: 'actions',
    align: 'center',
    sortable: false,
    style: 'width: 150px'
  }
]

export default {
  name: 'UserTable',
  components: {
    DetailUserDialog,
    EditUserDialog,
    NewUserDialog
  },
  setup() {
    const search = ref('')
    const rows = ref([])
    const filteredRows = ref([])
    const selectedUser = ref(null)
    const showDetailDialog = ref(false)
    const showEditDialog = ref(false)
    const showNewDialog = ref(false)
    const showDeleteDialog = ref(false)
    let fuse = null

    const fuseOptions = {
      keys: ['username', 'email', 'type', 'state'],
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 1
    }

    const loadUsers = () => {
      rows.value = users.users
      filteredRows.value = users.users.filter(user => user.state !== 'deleted')
      fuse = new Fuse(users.users.filter(user => user.state !== 'deleted'), fuseOptions)
    }

    const filterRows = () => {
      if (!search.value || search.value.trim() === '') {
        filteredRows.value = rows.value.filter(user => user.state !== 'deleted')
      } else {
        const results = fuse.search(search.value.trim())
        filteredRows.value = results.map(result => result.item)
      }
    }

    // Dialog handlers
    const viewUser = (user) => {
      selectedUser.value = { ...user }
      showDetailDialog.value = true
    }

    const editUser = (user) => {
      selectedUser.value = { ...user }
      showEditDialog.value = true
    }

    const openNewUserDialog = () => {
      showNewDialog.value = true
    }

    const confirmDeleteUser = (user) => {
      selectedUser.value = { ...user }
      showDeleteDialog.value = true
    }

    const deleteUser = () => {
      const index = rows.value.findIndex(u => u.id === selectedUser.value.id)
      if (index > -1) {
        rows.value[index].state = 'deleted'
        filterRows()
      }
    }

    const handleUserUpdate = (updatedUser) => {
      const index = rows.value.findIndex(u => u.id === updatedUser.id)
      if (index > -1) {
        rows.value[index] = { ...updatedUser }
        filterRows()
      }
    }

    const handleUserCreate = (newUser) => {
      const maxId = Math.max(...rows.value.map(u => u.id))
      newUser.id = maxId + 1
      rows.value.push(newUser)
      filterRows()
    }

    // Utility functions
    const getInitials = (name) => {
      if (!name) return '?'
      const words = name.trim().split(' ')
      if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase()
      }
      return (words[0][0] + (words[1] ? words[1][0] : '')).toUpperCase()
    }

    const getAvatarColor = (name) => {
      if (!name) return '#9e9e9e'
      
      const colors = [
        '#f44336', '#e91e63', '#9c27b0', '#673ab7',
        '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
        '#009688', '#4caf50', '#8bc34a', '#cddc39',
        '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
      ]
      
      let hash = 0
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
      }
      
      return colors[Math.abs(hash) % colors.length]
    }

    const handleImageError = (event) => {
      // Si la imagen falla al cargar, ocultar el elemento img
      event.target.style.display = 'none'
    }

    const formatState = (state) => {
      const states = {
        active: 'Activo',
        inactive: 'Inactivo',
        pending: 'Pendiente'
      }
      return states[state] || state
    }

    const getStateClass = (state) => {
      const classes = {
        active: 'state-active',
        inactive: 'state-inactive',
        pending: 'state-pending'
      }
      return classes[state] || 'state-default'
    }

    const getTypeClass = (type) => {
      const classes = {
        admin: 'type-admin',
        user: 'type-user',
        moderator: 'type-moderator'
      }
      return classes[type] || 'type-default'
    }

    onMounted(() => {
      loadUsers()
    })

    watch(search, () => {
      filterRows()
    })

    return {
      search,
      columns,
      rows,
      filteredRows,
      selectedUser,
      showDetailDialog,
      showEditDialog,
      showNewDialog,
      showDeleteDialog,
      filterRows,
      viewUser,
      editUser,
      openNewUserDialog,
      confirmDeleteUser,
      deleteUser,
      handleUserUpdate,
      handleUserCreate,
      getInitials,
      getAvatarColor,
      handleImageError,
      formatState,
      getStateClass,
      getTypeClass
    }
  }
}
</script>

<style lang="scss" scoped>
// Page Layout
.page-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

// Branding Section
.branding-section {
  display: flex;
  justify-content: center;
  padding: 24px 0;
  
  .brand-image {
    max-width: 300px;
    height: auto;
    opacity: 0.8;
  }
}

// Buttons
.primary-btn {
  padding: 12px 24px;
  font-weight: 500;
  border-radius: 8px;
  text-transform: none;
}

// Confirmation Dialog
.confirm-dialog {
  min-width: 400px;
  border-radius: 8px;
}
// State Badges
.state-active {
  background: #4caf50;
  color: white;
  font-weight: 500;
}

.state-inactive {
  background: #f44336;
  color: white;
  font-weight: 500;
}

.state-pending {
  background: #ff9800;
  color: white;
  font-weight: 500;
}

.state-default {
  background: #9e9e9e;
  color: white;
  font-weight: 500;
}

// Type Chips
.type-admin {
  background: #e91e63;
  color: white;
}

.type-user {
  background: #2196f3;
  color: white;
}

.type-moderator {
  background: #9c27b0;
  color: white;
}

.type-default {
  background: #607d8b;
  color: white;
}
</style>