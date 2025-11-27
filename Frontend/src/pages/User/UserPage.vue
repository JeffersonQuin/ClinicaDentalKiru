<template>
  <div class="user-page-container">
    <!-- Header Section -->
    <div class="user-page-header">
      <div class="user-header-background">
        <div class="user-header-shape user-header-shape-1"></div>
        <div class="user-header-shape user-header-shape-2"></div>
      </div>
      <div class="user-header-content">
        <div class="user-title-section">
          <div class="user-icon-wrapper">
            <i class="fa-solid fa-users user-header-icon"></i>
          </div>
          <div>
            <h1 class="user-page-title">Gestión de Usuarios</h1>
            <p class="user-page-subtitle">Administra permisos y accesos del personal de tu clínica</p>
          </div>
        </div>
        <q-btn
          class="user-primary-btn"
          color="primary"
          icon="fa-solid fa-plus"
          label="Agregar Usuario"
          @click="openNewUserDialog"
          unelevated
          no-caps
          size="md"
        />
      </div>
    </div>

    <!-- Stats Section -->
    <div class="user-stats-section">
      <div class="user-stat-card">
        <div class="user-stat-icon-container active">
          <i class="fa-solid fa-user-check"></i>
        </div>
        <div class="user-stat-content">
          <div class="user-stat-value">{{ activeUsersCount }}</div>
          <div class="user-stat-label">Usuarios Activos</div>
        </div>
        <div class="user-stat-glow active"></div>
      </div>
      
      <div class="user-stat-card">
        <div class="user-stat-icon-container inactive">
          <i class="fa-solid fa-user-slash"></i>
        </div>
        <div class="user-stat-content">
          <div class="user-stat-value">{{ inactiveUsersCount }}</div>
          <div class="user-stat-label">Usuarios Inactivos</div>
        </div>
        <div class="user-stat-glow inactive"></div>
      </div>
      
      <div class="user-stat-card">
        <div class="user-stat-icon-container admin">
          <i class="fa-solid fa-user-shield"></i>
        </div>
        <div class="user-stat-content">
          <div class="user-stat-value">{{ adminUsersCount }}</div>
          <div class="user-stat-label">Administradores</div>
        </div>
        <div class="user-stat-glow admin"></div>
      </div>
      
      <div class="user-stat-card">
        <div class="user-stat-icon-container total">
          <i class="fa-solid fa-users"></i>
        </div>
        <div class="user-stat-content">
          <div class="user-stat-value">{{ filteredRows.length }}</div>
          <div class="user-stat-label">Total de Usuarios</div>
        </div>
        <div class="user-stat-glow total"></div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="user-search-section">
      <div class="user-search-container">
        <q-input
          v-model="search"
          class="user-search-input"
          outlined
          type="search"
          placeholder="Buscar por nombre, email o tipo de usuario..."
          @input="filterRows"
          clearable
        >
          <template v-slot:prepend>
            <i class="fa-solid fa-search user-search-icon"></i>
          </template>
          <template v-slot:append>
            <q-icon 
              v-if="search" 
              name="fa-solid fa-filter" 
              class="text-primary"
            />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Table Section -->
    <div class="user-table-container">
      <div class="user-table-header">
        <div class="user-table-title-section">
          <h3 class="user-table-title">Lista de Usuarios</h3>
          <div class="user-table-underline"></div>
        </div>
        <div class="user-results-count">
          <span class="user-count-badge">
            <i class="fa-solid fa-list-check"></i>
            {{ filteredRows.length }} usuario{{ filteredRows.length !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>

      <q-table
        class="user-data-table"
        flat
        :rows="filteredRows"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[5, 10, 15, 20, 0]"
        :pagination="{ rowsPerPage: 5 }"
        separator="cell"
      >
        <template v-slot:no-data>
          <div class="user-no-data-container">
            <div class="user-no-data-illustration">
              <i class="fa-solid fa-users-slash user-no-data-icon"></i>
              <div class="user-no-data-circle user-no-data-circle-1"></div>
              <div class="user-no-data-circle user-no-data-circle-2"></div>
            </div>
            <p class="user-no-data-text">No se encontraron usuarios</p>
            <p class="user-no-data-subtext">Intenta ajustar los filtros de búsqueda o agrega un nuevo usuario</p>
          </div>
        </template>

        <template v-slot:body-cell-avatar="props">
          <q-td :props="props">
            <div class="user-avatar-container">
              <div class="user-avatar-wrapper">
                <q-avatar 
                  size="56px"
                  class="user-user-avatar"
                  :color="props.row.avatar ? 'transparent' : getAvatarColor(props.row.username)"
                  :text-color="props.row.avatar ? 'transparent' : 'white'"
                >
                  <img 
                    v-if="props.row.avatar" 
                    :src="props.row.avatar" 
                    :alt="props.row.username"
                    @error="handleImageError"
                  />
                  <span v-else class="user-avatar-initials">{{ getInitials(props.row.username) }}</span>
                </q-avatar>
                <div class="user-avatar-status" :class="getStateClass(props.row.state)"></div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-username="props">
          <q-td :props="props">
            <div class="user-user-info">
              <span class="user-user-name">{{ props.row.username }}</span>
              <span class="user-user-role">{{ formatType(props.row.type) }}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-email="props">
          <q-td :props="props">
            <div class="user-email-content">
              <i class="fa-solid fa-envelope user-email-icon"></i>
              <span class="user-email-text">{{ props.row.email }}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-type="props">
          <q-td :props="props">
            <q-chip
              :class="['user-type-chip', getTypeClass(props.row.type)]"
              :label="formatType(props.row.type)"
              :icon="getTypeIcon(props.row.type)"
              dense
            />
          </q-td>
        </template>

        <template v-slot:body-cell-state="props">
          <q-td :props="props">
            <q-badge
              :class="['user-state-badge', getStateClass(props.row.state)]"
              :label="formatState(props.row.state)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="user-action-buttons">
              <q-btn
                class="user-action-btn user-view-btn"
                flat
                dense
                round
                icon="fa-solid fa-eye"
                size="sm"
                @click="viewUser(props.row)"
                color="grey-8"
              >
                <q-tooltip>Ver detalles</q-tooltip>
              </q-btn>
              
              <q-btn
                class="user-action-btn user-edit-btn"
                flat
                dense
                round
                icon="fa-solid fa-edit"
                size="sm"
                @click="editUser(props.row)"
                color="primary"
              >
                <q-tooltip>Editar usuario</q-tooltip>
              </q-btn>
              
              <q-btn
                class="user-action-btn user-delete-btn"
                flat
                dense
                round
                icon="fa-solid fa-trash"
                size="sm"
                @click="confirmDeleteUser(props.row)"
                color="negative"
              >
                <q-tooltip>Eliminar usuario</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
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
      <q-card class="user-confirm-dialog">
        <q-card-section class="user-dialog-header">
          <div class="user-dialog-icon-container">
            <i class="fa-solid fa-exclamation-triangle user-dialog-icon"></i>
          </div>
          <h3 class="user-dialog-title">Confirmar Eliminación</h3>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="user-dialog-text">
            ¿Está seguro que desea eliminar al usuario <strong>{{ selectedUser?.username }}</strong>?
          </p>
          <p class="user-dialog-subtext">
            Esta acción no se puede deshacer y el usuario perderá acceso al sistema.
          </p>
        </q-card-section>

        <q-card-actions class="user-dialog-actions">
          <q-btn 
            flat 
            label="Cancelar" 
            color="grey-7" 
            v-close-popup 
            no-caps
            class="user-dialog-btn"
          />
          <q-btn 
            unelevated
            label="Eliminar Usuario" 
            color="negative" 
            @click="deleteUser"
            v-close-popup 
            no-caps
            class="user-dialog-btn user-dialog-delete-btn"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue'
import users from 'src/data/users.json'
import Fuse from 'fuse.js'
import DetailUserDialog from './DetailUserDialog.vue'
import EditUserDialog from './EditUserDialog.vue'
import NewUserDialog from './NewUserDialog.vue'

// Configuración de columnas de la tabla
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
    sortable: false,
    align: 'center',
    style: 'width: 160px'
  },
  {
    name: 'state',
    label: 'Estado',
    field: 'state',
    sortable: true,
    align: 'center',
    style: 'width: 120px'
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

// Configuración de Fuse.js para búsqueda difusa
const FUSE_OPTIONS = {
  keys: ['username', 'email', 'type', 'state'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 1
}

// Mapeos de traducción
const STATE_TRANSLATIONS = {
  active: 'Activo',
  inactive: 'Inactivo',
  pending: 'Pendiente'
}

const TYPE_TRANSLATIONS = {
  admin: 'Administrador',
  user: 'Usuario',
  moderator: 'Moderador'
}

const STATE_CLASSES = {
  active: 'user-state-active',
  inactive: 'user-state-inactive',
  pending: 'user-state-pending'
}

const TYPE_CLASSES = {
  admin: 'user-type-admin',
  user: 'user-type-user',
  moderator: 'user-type-moderator'
}

const TYPE_ICONS = {
  admin: 'fa-solid fa-shield-halved',
  user: 'fa-solid fa-user',
  moderator: 'fa-solid fa-user-tie'
}

export default {
  name: 'UserTable',
  
  components: {
    DetailUserDialog,
    EditUserDialog,
    NewUserDialog
  },
  
  setup() {
    // ============================================
    // Estado Reactivo
    // ============================================
    const search = ref('')
    const rows = ref([])
    const filteredRows = ref([])
    const selectedUser = ref(null)
    const showDetailDialog = ref(false)
    const showEditDialog = ref(false)
    const showNewDialog = ref(false)
    const showDeleteDialog = ref(false)
    let fuse = null

    // ============================================
    // Propiedades Computadas
    // ============================================
    const activeUsersCount = computed(() => 
      filteredRows.value.filter(user => user.state === 'active').length
    )

    const inactiveUsersCount = computed(() => 
      filteredRows.value.filter(user => user.state === 'inactive').length
    )

    const adminUsersCount = computed(() => 
      filteredRows.value.filter(user => user.type === 'admin').length
    )

    // ============================================
    // Funciones Utilitarias Mejoradas
    // ============================================
    
    const getAvatarColor = (username) => {
      if (!username) return '#9e9e9e'
      
      const colors = [
        '#f44336', '#e91e63', '#9c27b0', '#673ab7',
        '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
        '#009688', '#4caf50', '#8bc34a', '#cddc39',
        '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
      ]
      
      let hash = 0
      for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash)
      }
      
      return colors[Math.abs(hash) % colors.length]
    }

    const getInitials = (name) => {
      if (!name) return '?'
      
      const words = name.trim().split(' ')
      
      if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase()
      }
      
      return (words[0][0] + (words[1]?.[0] || '')).toUpperCase()
    }

    const handleImageError = (event) => {
      event.target.style.display = 'none'
    }

    const formatState = (state) => STATE_TRANSLATIONS[state] || state
    const formatType = (type) => TYPE_TRANSLATIONS[type] || type
    const getStateClass = (state) => STATE_CLASSES[state] || 'user-state-default'
    const getTypeClass = (type) => TYPE_CLASSES[type] || 'user-type-default'
    const getTypeIcon = (type) => TYPE_ICONS[type] || 'fa-solid fa-user'

    // ============================================
    // Gestión de Búsqueda con Fuse.js
    // ============================================
    
    const rebuildFuse = () => {
      const collection = rows.value.filter(user => user.state !== 'deleted')
      
      if (fuse && typeof fuse.setCollection === 'function') {
        fuse.setCollection(collection)
      } else {
        fuse = new Fuse(collection, FUSE_OPTIONS)
      }
    }

    const filterRows = () => {
      if (!search.value?.trim()) {
        filteredRows.value = rows.value.filter(user => user.state !== 'deleted')
        return
      }

      const results = fuse.search(search.value.trim())
      filteredRows.value = results.map(result => result.item)
    }

    // ============================================
    // Operaciones CRUD
    // ============================================
    
    const loadUsers = () => {
      rows.value = users.users.map(user => ({ 
        ...user, 
        id: Number(user.id) 
      }))
      
      filteredRows.value = rows.value.filter(user => user.state !== 'deleted')
      fuse = new Fuse(filteredRows.value, FUSE_OPTIONS)
    }

    const handleUserCreate = (newUser) => {
      const userToAdd = {
        username: newUser.username || 'sin-nombre',
        email: newUser.email || '',
        type: newUser.type || 'user',
        state: newUser.state || 'active',
        password: newUser.password || '',
        notes: newUser.notes || '',
        createdAt: newUser.createdAt || new Date().toISOString(),
        lastLogin: newUser.lastLogin || null,
        avatar: newUser.avatar || null
      }

      const numericIds = rows.value
        .map(u => Number(u.id))
        .filter(n => !Number.isNaN(n))
      
      const maxId = numericIds.length ? Math.max(...numericIds) : 0
      userToAdd.id = maxId + 1

      rows.value.push(userToAdd)
      rebuildFuse()
      filterRows()
    }

    const handleUserUpdate = (updatedUser) => {
      const index = rows.value.findIndex(
        u => Number(u.id) === Number(updatedUser.id)
      )
      
      if (index > -1) {
        rows.value[index] = { 
          ...updatedUser, 
          id: Number(updatedUser.id) 
        }
        rebuildFuse()
        filterRows()
      }
    }

    const deleteUser = () => {
      const index = rows.value.findIndex(
        u => Number(u.id) === Number(selectedUser.value.id)
      )
      
      if (index > -1) {
        rows.value[index].state = 'deleted'
        rebuildFuse()
        filterRows()
      }
    }

    // ============================================
    // Gestión de Diálogos
    // ============================================
    
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

    // ============================================
    // Ciclo de Vida
    // ============================================
    
    onMounted(() => {
      loadUsers()
    })

    watch(search, () => {
      filterRows()
    })

    // ============================================
    // API Pública del Componente
    // ============================================
    
    return {
      // Estado
      search,
      columns,
      rows,
      filteredRows,
      selectedUser,
      showDetailDialog,
      showEditDialog,
      showNewDialog,
      showDeleteDialog,
      
      // Computadas
      activeUsersCount,
      inactiveUsersCount,
      adminUsersCount,
      
      // Métodos de búsqueda y filtrado
      filterRows,
      
      // Operaciones CRUD
      handleUserCreate,
      handleUserUpdate,
      deleteUser,
      
      // Gestión de diálogos
      viewUser,
      editUser,
      openNewUserDialog,
      confirmDeleteUser,
      
      // Utilidades
      getAvatarColor,
      getInitials,
      handleImageError,
      formatState,
      formatType,
      getStateClass,
      getTypeClass,
      getTypeIcon
    }
  }
}
</script>

