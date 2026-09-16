import { createRouter, createWebHistory } from 'vue-router'

import { componentCatalog } from '../content/catalog'
import ComponentView from '../views/ComponentView.vue'

function findHashTarget(hash: string): HTMLElement | null {
  const rawId = hash.startsWith('#') ? hash.slice(1) : hash
  let id = rawId

  try {
    id = decodeURIComponent(rawId)
  } catch {
    // Keep malformed escape sequences literal instead of breaking navigation.
  }

  return document.getElementById(id)
}

export async function waitForHashTarget(
  hash: string,
  attempts = 100,
  delay = 50,
  signal?: AbortSignal,
): Promise<boolean> {
  if (signal?.aborted) return false
  if (findHashTarget(hash)) return true

  return new Promise((resolve) => {
    let settled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const observer = new MutationObserver(() => {
      if (findHashTarget(hash)) finish(true)
    })
    const finish = (found: boolean) => {
      if (settled) return
      settled = true
      observer.disconnect()
      if (timer !== undefined) clearTimeout(timer)
      signal?.removeEventListener('abort', handleAbort)
      resolve(found)
    }
    const handleAbort = () => finish(false)

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })
    timer = setTimeout(
      () => finish(findHashTarget(hash) !== null),
      Math.max(0, attempts * delay),
    )
    signal?.addEventListener('abort', handleAbort, { once: true })
  })
}

let pendingHashScroll: AbortController | undefined

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: async (to) => {
    pendingHashScroll?.abort()
    pendingHashScroll = undefined
    if (!to.hash) return { top: 0 }

    const controller = new AbortController()
    pendingHashScroll = controller
    const found = await waitForHashTarget(
      to.hash,
      undefined,
      undefined,
      controller.signal,
    )
    if (controller.signal.aborted) return false

    const target = found ? findHashTarget(to.hash) : null

    if (pendingHashScroll === controller) pendingHashScroll = undefined
    return target ? { el: target, top: 88 } : { top: 0 }
  },
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
