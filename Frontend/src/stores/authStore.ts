// stores/authStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Static mock data for development - Remove in production
const MOCK_USERS = {
  admin: {
    id: 1,
    email: 'admin@dentalsystem.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'ADMIN',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  },
  dentist: {
    id: 2,
    email: 'dentist@dentalsystem.com',
    password: 'dentist123',
    name: 'Dr. Juan García',
    role: 'DENTIST',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dentist'
  },
  client: {
    id: 3,
    email: 'client@dentalsystem.com',
    password: 'client123',
    name: 'María López',
    role: 'CLIENT',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=client'
  }
}

// Utility function to sanitize user data and prevent XSS
const sanitizeUser = (user) => {
  if (!user) return null
  
  // Create a new object with sanitized properties
  // Only include safe properties, never raw HTML
  return {
    id: user.id,
    email: String(user.email).trim(),
    name: String(user.name).trim(),
    role: String(user.role).trim(),
    avatar: String(user.avatar).trim()
    // Never include password in the returned user object
  }
}

// Generate a simple JWT-like token (for development only)
const generateMockToken = (userId, role) => {
  // This is NOT a real JWT. For production, get from backend
  const payload = {
    userId,
    role,
    iat: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }
  // Simple base64 encoding (NOT secure - development only)
  return btoa(JSON.stringify(payload))
}

// Validate token format (development only)
const validateMockToken = (token) => {
  try {
    if (!token) return null
    const decoded = JSON.parse(atob(token))
    
    // Check if token is expired
    if (decoded.exp < Date.now()) {
      return null
    }
    
    return decoded
  } catch (error) {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  
  // Only expose non-sensitive data
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  
  const userRole = computed(() => user.value?.role || null)
  
  const userName = computed(() => user.value?.name || '')
  
  const userEmail = computed(() => user.value?.email || '')

  // Login with email and password
  const login = async (email, password) => {
    try {
      isLoading.value = true
      error.value = null

      // Validate inputs exist
      if (!email || !password) {
        throw new Error('Correo y contraseña son requeridos')
      }

      // Sanitize input to prevent injection attacks
      const sanitizedEmail = String(email).trim().toLowerCase()
      const sanitizedPassword = String(password).trim()

      // Validate input
      if (!sanitizedEmail || !sanitizedPassword) {
        throw new Error('Correo y contraseña son requeridos')
      }

      // Find user in mock data
      const mockUser = Object.values(MOCK_USERS).find(
        u => u.email === sanitizedEmail && u.password === sanitizedPassword
      )

      if (!mockUser) {
        throw new Error('Correo o contraseña inválida')
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))

      // Generate token
      const generatedToken = generateMockToken(mockUser.id, mockUser.role)
      
      // Sanitize user data before storing
      const sanitizedUser = sanitizeUser(mockUser)

      // Store only in memory (not in localStorage for sensitive data)
      token.value = generatedToken
      user.value = sanitizedUser

      return {
        success: true,
        user: sanitizedUser
      }
    } catch (err) {
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
  }

  // Check if token is valid and restore session
  const checkAuth = async () => {
    try {
      // In development, we keep token only in memory
      if (!token.value) {
        return false
      }

      const decoded = validateMockToken(token.value)
      
      if (!decoded) {
        logout()
        return false
      }

      // Token is valid, user data is already in state
      return true
    } catch (err) {
      logout()
      return false
    }
  }

  // Check if user has a specific role
  const hasRole = (role) => {
    return user.value?.role === role
  }

  // Check if user has any of the provided roles
  const hasAnyRole = (roles) => {
    if (!Array.isArray(roles)) return false
    return roles.includes(user.value?.role)
  }

  // Check if user has all of the provided roles
  const hasAllRoles = (roles) => {
    if (!Array.isArray(roles) || roles.length === 0) return false
    return roles.every(role => role === user.value?.role)
  }

  // Get mock credentials for development (remove in production)
  const getMockCredentials = () => {
    // Only return this in development environment
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
    
    // Methods
    login,
    logout,
    checkAuth,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    getMockCredentials
  }
})