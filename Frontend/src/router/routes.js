// routes.js
import MainLayout from 'layouts/MainLayout.vue'

// Define which routes each role can view
const rolePermissions = {
  DENTIST: ['dashboard', 'patients', 'reserves', 'calendar', 'odontogram', 'quotes', 'historyQuotes'],
  CLIENT: ['dashboard', 'reserves', 'quotes', 'historyQuotes'],
  ADMIN: ['dashboard', 'users', 'dentist', 'specialties', 'publications', 'branches', 'patients', 'reserves', 'quotes', 'historyQuotes']
}

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      // Public routes (no authentication required)
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: '/about',
        component: () => import('pages/AboutPage.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: '/faq',
        component: () => import('pages/FAQPage.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: '/contact',
        component: () => import('pages/ContactPage.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: '/services',
        component: () => import('pages/ServicesPage.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: '/branch',
        component: () => import('pages/BranchPage.vue'),
        meta: { requiresAuth: false }
      },

      // Protected routes (require authentication and specific role)
      // DASHBOARD - for all authenticated users
      {
        path: '/dashboard',
        component: () => import('pages/DashboardPage.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['DENTIST', 'CLIENT', 'ADMIN']
        }
      },

      // USERS - Admin only
      {
        path: '/users',
        component: () => import('pages/User/UserPage.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['ADMIN']
        }
      },

      // DENTISTS - Admin only
      {
        path: '/dentist',
        component: () => import('pages/Dentist/DentistPage.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['ADMIN']
        }
      },

      // SPECIALTIES - Admin only
      {
        path: '/specialties',
        component: () => import('pages/Specialties/SpecialityPage.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['ADMIN']
        }
      },

      // PUBLICATIONS - Admin only
      {
        path: '/publications',
        component: () => import('pages/Publication/PublicationsPage.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['ADMIN']
        }
      },

      // BRANCHES - Admin only
      {
        path: '/branches',
        component: () => import('pages/Branch/BranchPage.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['ADMIN']
        }
      },

      // PATIENTS - Dentist and Admin
      {
        path: '/patients',
        component: () => import('pages/Patient/PatientPage.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['DENTIST', 'ADMIN']
        }
      },

      // RESERVES - All authenticated roles
      {
        path: '/reserves',
        component: () => import('pages/Reserve/ReservePage.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['DENTIST', 'CLIENT', 'ADMIN']
        }
      },

      // QUOTES - All authenticated roles
      {
        path: '/quotes',
        component: () => import('pages/quotes/QuotesPage.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['DENTIST', 'CLIENT', 'ADMIN']
        }
      },

      // HISTORY QUOTES - All authenticated roles
      {
        path: '/HistoryQuotes',
        component: () => import('pages/HistoryQuotes/HistoryQuotesPage.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['DENTIST', 'CLIENT', 'ADMIN']
        }
      },

      // CALENDAR - Dentist and Admin
      {
        path: '/Calendar-Month',
        component: () => import('pages/Calendar/CalendarMonthPage.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['DENTIST', 'ADMIN']
        }
      },
      {
        path: '/Calendar-Week',
        component: () => import('pages/Calendar/CalendarWeekPage.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['DENTIST', 'ADMIN']
        }
      },
      {
        path: '/Calendar-Day',
        component: () => import('pages/Calendar/CalendarDayPage.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['DENTIST', 'ADMIN']
        }
      },

      // ODONTOGRAM - Dentist and Admin
      {
        path: '/Odontogram',
        component: () => import('pages/Odontogram/OdontogramPage.vue'),
        meta: { 
          requiresAuth: true,
          roles: ['DENTIST', 'ADMIN']
        }
      }
    ]
  },

  // Authentication routes
  {
    path: '/login',
    component: () => import('pages/Auth/LoginPage.vue'),
    meta: { requiresAuth: false }
  },

  // Unauthorized page
  {
    path: '/unauthorized',
    component: () => import('pages/UnauthorizedPage.vue'),
    meta: { requiresAuth: false }
  },

  // Always leave this as last
  {
    path: '/:catchAll(.)',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export { rolePermissions }
export default routes