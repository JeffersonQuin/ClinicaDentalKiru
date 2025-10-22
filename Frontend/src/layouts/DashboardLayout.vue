<template>
  <q-layout view="hHh LpR fFf">
    <!-- Header del Dashboard -->
    <q-header elevated class="bg-white text-dark">
      <q-toolbar class="dashboard-toolbar">
        <!-- Botón para toggle del drawer en móvil -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          @click="toggleLeftDrawer"
          class="lt-md"
        />

        <!-- Logo y título -->
        <q-toolbar-title class="dashboard-title">
          <div class="row items-center no-wrap">
            <div class="tooth-icon-small q-mr-sm">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M16 4C12 4 8 6 8 12C8 18 10 24 12 26C13 27 15 28 16 28C17 28 19 27 20 26C22 24 24 18 24 12C24 6 20 4 16 4Z" fill="#FF6B35" stroke="#FF5722" stroke-width="1"/>
                <circle cx="13" cy="14" r="1.5" fill="white"/>
                <circle cx="19" cy="14" r="1.5" fill="white"/>
              </svg>
            </div>
            <div class="logo-text-small">
              <div class="brand-name-small">KIRU</div>
            </div>
          </div>
        </q-toolbar-title>

        <!-- Breadcrumbs -->
        <div class="breadcrumbs gt-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" :to="getDefaultRoute()" />
            <q-breadcrumbs-el 
              v-if="currentPageTitle" 
              :label="currentPageTitle" 
            />
          </q-breadcrumbs>
        </div>

        <q-space />

        <!-- Notificaciones -->
        <q-btn flat round dense icon="notifications">
          <q-badge color="red" floating>3</q-badge>
          <q-menu>
            <q-list style="min-width: 300px">
              <q-item>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Notificaciones</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" icon="event" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Nueva cita agendada</q-item-label>
                  <q-item-label caption>Hace 5 minutos</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <!-- Perfil de usuario -->
        <q-btn flat round dense>
          <q-avatar size="36px">
            <img :src="userAvatar" />
          </q-avatar>
          <q-menu>
            <q-list style="min-width: 200px">
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="userAvatar" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ userName }}</q-item-label>
                  <q-item-label caption>{{ userEmail }}</q-item-label>
                  <q-item-label caption>
                    <q-chip size="sm" :color="getRoleColor(userRole)" text-color="white">
                      {{ getRoleLabel(userRole) }}
                    </q-chip>
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-ripple @click="goToProfile">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>Mi Perfil</q-item-section>
              </q-item>
              <q-item clickable v-ripple @click="goToSettings">
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>
                <q-item-section>Configuración</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-ripple @click="handleLogout">
                <q-item-section avatar>
                  <q-icon name="logout" color="negative" />
                </q-item-section>
                <q-item-section class="text-negative">Cerrar Sesión</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Sidebar / Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="260"
      :breakpoint="1024"
      bordered
      class="dashboard-drawer"
    >
      <q-scroll-area class="fit">
        <div class="drawer-content">
          <!-- Información del usuario en el drawer -->
          <div class="user-info q-pa-md">
            <div class="row items-center q-gutter-sm">
              <q-avatar size="50px">
                <img :src="userAvatar" />
              </q-avatar>
              <div class="col">
                <div class="text-weight-bold text-body1">{{ userName }}</div>
                <div class="text-caption text-grey-7">{{ getRoleLabel(userRole) }}</div>
              </div>
            </div>
          </div>

          <q-separator />

          <!-- Menú de navegación dinámico -->
          <q-list padding class="menu-list">
            <template v-for="(item, index) in filteredMenu" :key="index">
              <!-- Item con hijos (expandible) -->
              <q-expansion-item
                v-if="item.children"
                :icon="item.icon"
                :label="item.title"
                :default-opened="isCurrentSection(item)"
                class="menu-expansion-item"
              >
                <q-list padding>
                  <q-item
                    v-for="(child, childIndex) in item.children"
                    :key="childIndex"
                    clickable
                    v-ripple
                    :to="child.to"
                    exact
                    class="menu-child-item"
                  >
                    <q-item-section avatar>
                      <q-icon :name="child.icon" size="20px" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ child.title }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>

              <!-- Item simple (sin hijos) -->
              <q-item
                v-else
                clickable
                v-ripple
                :to="item.to"
                exact
                class="menu-item"
              >
                <q-item-section avatar>
                  <q-icon :name="item.icon" size="24px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.title }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-list>

          <q-separator class="q-my-md" />

          <!-- Botón para volver al sitio público -->
          <div class="q-pa-md">
            <q-btn
              flat
              dense
              icon="public"
              label="Ver Sitio Público"
              class="full-width"
              @click="goToPublicSite"
            />
          </div>
        </div>
      </q-scroll-area>
    </q-drawer>

    <!-- Contenido principal -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Footer opcional -->
    <q-footer class="bg-grey-2 text-dark border-top">
      <q-toolbar class="q-py-sm">
        <q-toolbar-title class="text-caption text-grey-7">
          © 2025 KIRU Odontología - Panel de Administración
        </q-toolbar-title>
        <div class="text-caption text-grey-7">
          Versión 1.0.0
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'stores/authStore'
import { dashboardMenuConfig, rolePermissions } from '../router/routes'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Estado del drawer
const leftDrawerOpen = ref(false)

// Datos del usuario desde el store
const userName = computed(() => authStore.userName)
const userEmail = computed(() => authStore.userEmail)
const userAvatar = computed(() => authStore.userAvatar)
const userRole = computed(() => authStore.userRole)

// Título de la página actual
const currentPageTitle = computed(() => route.meta.title || '')

// Toggle del drawer
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Obtener el menú filtrado según el rol del usuario
const filteredMenu = computed(() => {
  const role = userRole.value
  const menuConfig = dashboardMenuConfig[role] || []
  const permissions = rolePermissions[role] || []

  // Filtrar el menú según los permisos del rol
  return menuConfig
    .filter(item => {
      // Si el item tiene permiso, verificar si el usuario lo tiene
      if (item.permission) {
        return permissions.includes(item.permission)
      }
      // Si no tiene permiso definido, mostrarlo
      return true
    })
    .map(item => {
      // Si tiene hijos, filtrarlos también
      if (item.children) {
        return {
          ...item,
          children: item.children.filter(child => {
            if (child.permission) {
              return permissions.includes(child.permission)
            }
            return true
          })
        }
      }
      return item
    })
})

// Verificar si una sección está activa
const isCurrentSection = (item) => {
  if (!item.children) return false
  return item.children.some(child => route.path === child.to)
}

// Obtener ruta por defecto según rol
const getDefaultRoute = () => {
  return authStore.getDefaultRoute()
}

// Obtener color según rol
const getRoleColor = (role) => {
  const colors = {
    ADMIN: 'deep-purple',
    DENTIST: 'blue',
    CLIENT: 'teal'
  }
  return colors[role] || 'grey'
}

// Obtener etiqueta del rol
const getRoleLabel = (role) => {
  const labels = {
    ADMIN: 'Administrador',
    DENTIST: 'Dentista',
    CLIENT: 'Cliente'
  }
  return labels[role] || role
}

// Navegar al perfil
const goToProfile = () => {
  $q.notify({
    message: 'Función de perfil en desarrollo',
    color: 'info',
    position: 'top'
  })
}

// Navegar a configuración
const goToSettings = () => {
  $q.notify({
    message: 'Función de configuración en desarrollo',
    color: 'info',
    position: 'top'
  })
}

// Ir al sitio público
const goToPublicSite = () => {
  router.push('/')
}

// Manejar logout
const handleLogout = () => {
  $q.dialog({
    title: 'Cerrar Sesión',
    message: '¿Estás seguro que deseas cerrar sesión?',
    cancel: {
      label: 'Cancelar',
      flat: true
    },
    ok: {
      label: 'Cerrar Sesión',
      color: 'negative'
    }
  }).onOk(() => {
    authStore.logout()
    router.push('/login')
    $q.notify({
      message: 'Sesión cerrada exitosamente',
      color: 'positive',
      position: 'top',
      icon: 'logout'
    })
  })
}

// Cerrar drawer en móvil al cambiar de ruta
watch(route, () => {
  if ($q.screen.lt.md) {
    leftDrawerOpen.value = false
  }
})
</script>

<style scoped>
/* Toolbar del dashboard */
.dashboard-toolbar {
  padding: 8px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.dashboard-title {
  font-size: 18px;
  font-weight: 600;
}

/* Logo pequeño */
.tooth-icon-small {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF6B35, #FF5722);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
}

.logo-text-small {
  line-height: 1;
}

.brand-name-small {
  font-size: 18px;
  font-weight: 800;
  color: #FF6B35;
  letter-spacing: -0.5px;
}

/* Breadcrumbs */
.breadcrumbs {
  margin: 0 20px;
}

/* Drawer */
.dashboard-drawer {
  background: #ffffff;
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Información de usuario en drawer */
.user-info {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e5e7eb;
}

/* Menú de navegación */
.menu-list {
  flex: 1;
  padding-top: 16px;
}

.menu-item,
.menu-child-item {
  border-radius: 8px;
  margin: 4px 12px;
  transition: all 0.3s ease;
}

.menu-item:hover,
.menu-child-item:hover {
  background: #f3f4f6;
}

/* Item activo */
.menu-item.q-router-link--exact-active,
.menu-child-item.q-router-link--exact-active {
  background: linear-gradient(135deg, #FF6B35, #FF5722);
  color: white;
}

.menu-item.q-router-link--exact-active .q-icon,
.menu-child-item.q-router-link--exact-active .q-icon {
  color: white;
}

/* Expansion item */
.menu-expansion-item {
  margin: 4px 12px;
  border-radius: 8px;
}

.menu-expansion-item:hover {
  background: #f9fafb;
}

/* Responsive */
@media (max-width: 1023px) {
  .dashboard-drawer {
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }
}

/* Border top para footer */
.border-top {
  border-top: 1px solid #e5e7eb;
}

/* Animaciones suaves */
.q-item {
  transition: all 0.2s ease;
}

/* Estilos para modo oscuro */
body.body--dark {
  .dashboard-toolbar {
    border-bottom-color: rgba(255, 255, 255, 0.12);
  }

  .dashboard-drawer {
    background: #1e1e1e;
  }

  .user-info {
    background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%);
    border-bottom-color: rgba(255, 255, 255, 0.12);
  }

  .menu-item:hover,
  .menu-child-item:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .menu-expansion-item:hover {
    background: rgba(255, 255, 255, 0.03);
  }
}
</style>