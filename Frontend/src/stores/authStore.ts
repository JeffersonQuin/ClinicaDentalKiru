// stores/authStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

// Tipos de usuarios
export type UserRole = 'PUBLIC' | 'ADMIN' | 'DENTIST' | 'CLIENT'

export interface User {
  id: number
  email: string
  name: string
  role: UserRole
  avatar: string
}

// Mock users para desarrollo
const MOCK_USERS = {
  admin: {
    id: 1,
    email: 'admin@dentalsystem.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'ADMIN' as UserRole,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  },
  dentist: {
    id: 2,
    email: 'dentist@dentalsystem.com',
    password: 'dentist123',
    name: 'Dr. Juan García',
    role: 'DENTIST' as UserRole,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dentist'
  },
  client: {
    id: 3,
    email: 'client@dentalsystem.com',
    password: 'client123',
    name: 'María López',
    role: 'CLIENT' as UserRole,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client'
  }
}

// Sanitización de usuario
const sanitizeUser = (user: any): User | null => {
  if (!user) return null
  
  return {
    id: user.id,
    email: String(user.email).trim(),
    name: String(user.name).trim(),
    role: String(user.role).trim() as UserRole,
    avatar: String(user.avatar).trim()
  }
}

// Generación de token mock
const generateMockToken = (userId: number, role: UserRole): string => {
  const payload = {
    userId,
    role,
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
  }
  return btoa(JSON.stringify(payload))
}

// Validación de token
const validateMockToken = (token: string) => {
  try {
    if (!token) return null
    const decoded = JSON.parse(atob(token))
    
    if (decoded.exp < Date.now()) {
      return null
    }
    
    return decoded
  } catch (error) {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const redirectPath = ref<string | null>(null) // Para recordar dónde quería ir el usuario
  
  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || 'PUBLIC')
  const userName = computed(() => user.value?.name || '')
  const userEmail = computed(() => user.value?.email || '')
  const userAvatar = computed(() => user.value?.avatar || '')
  
  // Verificar si el usuario es público
  const isPublicUser = computed(() => userRole.value === 'PUBLIC' || !isAuthenticated.value)
  
  // Obtener la ruta inicial según el rol
  const getDefaultRoute = (): string => {
    if (!isAuthenticated.value) return '/'
    
    switch (userRole.value) {
      case 'ADMIN':
        return '/dashboard'
      case 'DENTIST':
        return '/dashboard'
      case 'CLIENT':
        return '/dashboard'
      default:
        return '/'
    }
  }

  // Login
  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null

      if (!email || !password) {
        throw new Error('Correo y contraseña son requeridos')
      }

      const sanitizedEmail = String(email).trim().toLowerCase()
      const sanitizedPassword = String(password).trim()

      // Buscar usuario en mock data
      const mockUser = Object.values(MOCK_USERS).find(
        u => u.email === sanitizedEmail && u.password === sanitizedPassword
      )

      if (!mockUser) {
        throw new Error('Correo o contraseña inválida')
      }

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800))

      // Generar token y sanitizar usuario
      const generatedToken = generateMockToken(mockUser.id, mockUser.role)
      const sanitizedUser = sanitizeUser(mockUser)

      token.value = generatedToken
      user.value = sanitizedUser

      // Guardar en sessionStorage para persistencia durante la sesión
      sessionStorage.setItem('authToken', generatedToken)
      sessionStorage.setItem('user', JSON.stringify(sanitizedUser))

      return {
        success: true,
        user: sanitizedUser,
        redirectTo: redirectPath.value || getDefaultRoute()
      }
    } catch (err: any) {
      error.value = err.message || 'Error en la autenticación'
      user.value = null
      token.value = null
      return {
        success: false,
        message: error.value
      }
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  const logout = () => {
    user.value = null
    token.value = null
    error.value = null
    redirectPath.value = null
    
    // Limpiar storage
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('user')
  }

  // Restaurar sesión
  const restoreSession = async (): Promise<boolean> => {
    try {
      const savedToken = sessionStorage.getItem('authToken')
      const savedUser = sessionStorage.getItem('user')

      if (!savedToken || !savedUser) {
        return false
      }

      const decoded = validateMockToken(savedToken)
      
      if (!decoded) {
        logout()
        return false
      }

      token.value = savedToken
      user.value = JSON.parse(savedUser)
      
      return true
    } catch (err) {
      logout()
      return false
    }
  }

  // Verificar autenticación
  const checkAuth = async (): Promise<boolean> => {
    if (token.value && user.value) {
      return true
    }
    
    return await restoreSession()
  }

  // Verificar rol específico
  const hasRole = (role: UserRole): boolean => {
    return user.value?.role === role
  }

  // Verificar si tiene alguno de los roles
  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!Array.isArray(roles)) return false
    return roles.includes(userRole.value)
  }

  // Verificar permisos para acceder a una ruta
  const canAccessRoute = (route: RouteLocationNormalized): boolean => {
    // Rutas públicas siempre son accesibles
    if (!route.meta.requiresAuth) {
      return true
    }

    // Si requiere autenticación pero no está autenticado
    if (!isAuthenticated.value) {
      return false
    }

    // Si no hay roles específicos requeridos, cualquier usuario autenticado puede acceder
    if (!route.meta.roles || !Array.isArray(route.meta.roles)) {
      return true
    }

    // Verificar si el usuario tiene uno de los roles requeridos
    return hasAnyRole(route.meta.roles as UserRole[])
  }

  // Guardar ruta de redirección
  const setRedirectPath = (path: string) => {
    redirectPath.value = path
  }

  // Obtener credenciales mock (solo desarrollo)
  const getMockCredentials = () => {
    if (import.meta.env.MODE === 'production') {
      return null
    }

    return Object.entries(MOCK_USERS).map(([key, userData]) => ({
      email: userData.email,
      password: userData.password,
      role: userData.role,
      name: userData.name
    }))
  }

  return {
    // State
    user: computed(() => user.value),
    isAuthenticated,
    isLoading,
    error: computed(() => error.value),
    
    // Computed
    userRole,
    userName,
    userEmail,
    userAvatar,
    isPublicUser,
    
    // Methods
    login,
    logout,
    checkAuth,
    restoreSession,
    hasRole,
    hasAnyRole,
    canAccessRoute,
    getDefaultRoute,
    setRedirectPath,
    getMockCredentials
  }
})