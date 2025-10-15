import MainLayout from 'layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: '/about',
        component: () => import('pages/AboutPage.vue')
      },
      {
        path: '/faq',
        component: () => import('pages/FAQPage.vue')
      },
      {
        path: '/contact',
        component: () => import('pages/ContactPage.vue')
      },
      {
        path: '/services',
        component: () => import('pages/ServicesPage.vue')
      },
      {
        path: '/branch',
        component: () => import('pages/BranchPage.vue')
      },
      {
        path: '/users',
        component: () => import('pages/User/UserPage.vue')
      },
      {
        path: '/dentist',
        component: () => import('pages/Dentist/DentistPage.vue')
      },
      {
        path: '/specialties',
        component: () => import('pages/Specialties/SpecialityPage.vue')
      },
      {
        path: '/publications',
        component: () => import('pages/Publication/PublicationsPage.vue')
      },
      {
        path: '/branches',
        component: () => import('pages/Branch/BranchPage.vue')
      },
      {
        path: '/patients',
        component: () => import('pages/patient/PatientPage.vue')
      },
      {
        path: '/reserves',
        component: () => import('pages/Reserve/ReservePage.vue')
      },
      {
        path: '/quotes',
        component: () => import('pages/quotes/QuotesPage.vue')
      },
      {
        path: '/HistoryQuotes',
        component: () => import('pages/HistoryQuotes/HistoryQuotesPage.vue')
      },
      {
        path: '/Calendar-Month',
        component: () => import('pages/Calendar/CalendarMonthPage.vue')
      },
      {
        path: '/Calendar-Week',
        component: () => import('pages/Calendar/CalendarWeekPage.vue')
      },
      {
        path: '/Calendar-Day',
        component: () => import('pages/Calendar/CalendarDayPage.vue')
      }

    ]
  },

  // Siempre dejar esto como último
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes