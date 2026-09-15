import { createRouter, createWebHistory } from 'vue-router'

import { componentCatalog } from '../content/catalog'
import ComponentView from '../views/ComponentView.vue'

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: (to) => (to.hash ? { el: to.hash, top: 88 } : { top: 0 }),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/guide/:slug',
      name: 'guide',
      component: () => import('../views/GuideView.vue'),
      props: true,
    },
    ...componentCatalog.map((item) => ({
      path: `/components/${item.slug}`,
      name: `component-${item.slug}`,
      component: ComponentView,
      props: { slug: item.slug },
    })),
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})
