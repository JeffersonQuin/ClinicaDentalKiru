// router/index.js
import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'stores/authStore'

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  // Global guard before entering each route
  Router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()
    
    // If the route doesn't require authentication, allow access
    if (!to.meta.requiresAuth) {
      next()
      return
    }

    try {
      // If it requires authentication but user is not authenticated
      if (!authStore.isAuthenticated || !authStore.user) {
        // Redirect to login, storing the intended destination
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
        return
      }

      // If the route requires specific roles
      if (to.meta.roles && to.meta.roles.length > 0) {
        const userRole = authStore.userRole
        
        if (to.meta.roles.includes(userRole)) {
          next()
        } else {
          // User authenticated but without permissions
          next({
            path: '/unauthorized',
            query: { from: to.fullPath }
          })
        }
      } else {
        // Protected route but no specific roles required
        next()
      }
    } catch (error) {
      console.error('Navigation guard error:', error)
      // On error, redirect to login for safety
      next('/login')
    }
  })

  // Global error handler
  Router.afterEach((to, from, failure) => {
    if (failure) {
      console.error('Navigation failed:', failure)
    }
  })

  return Router
})