import MainLayout from 'layouts/MainLayout.vue'
//import BranchPage from 'pages/Branch/BranchPage.vue'
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
        path: '/login',
        component: () => import('pages/Login/LoginPage.vue')
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