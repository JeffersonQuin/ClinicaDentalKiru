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
        path: '/services',
        component: () => import('pages/ServicesPage.vue')
      },
      {
        path: '/branch',
        component: () => import('pages/BranchPage.vue')
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