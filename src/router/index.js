/**
 * Vue Router Configuration
 * This file sets up the routing configuration for the Marvel Series application.
 * It includes route definitions, lazy loading, and scroll behavior management.
 */

import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layout/MainLayout.vue";

/**
 * Router instance configuration
 * Uses HTML5 history mode and defines the application's route structure
 */
const router = createRouter({
  history: createWebHistory(),
  
  /**
   * Route Definitions
   * Structured with a main layout component that wraps child routes
   */
  routes: [
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "/",
          name: "home",
          component: () => import("@/views/HomeView.vue"),
          meta: {
            title: "Home - Marvel Series"
          }
        },
        {
          path: "/detail/:id",
          name: "detail",
          component: () => import("@/views/DetailView.vue"),
          props: true,
          meta: {
            title: "Series Detail"
          }
        },
        {
          path: "/history",
          name: "history",
          component: () => import("@/views/HistoryView.vue"),
          meta: {
            title: "History"
          }
        },
      ],
    },
  ],

  /**
   * Scroll Behavior Configuration
   * Handles scroll position when navigating between routes
   * @param {RouteLocation} to - Target route
   * @param {RouteLocation} from - Current route
   * @param {SavedPosition} savedPosition - Saved scroll position if exists
   * @returns {ScrollPosition} Desired scroll position
   */
  scrollBehavior(to, from, savedPosition) {
    // If there's a saved position (when using browser back/forward buttons)
    if (savedPosition) {
      return savedPosition;
    }
    
    // If navigating to a specific hash
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      };
    }
    
    // Default: scroll to top of the page
    return { 
      top: 0,
      behavior: 'smooth'
    };
  }
});

/**
 * Navigation Guard
 * Updates document title based on route meta data
 */
router.beforeEach((to, from, next) => {
  // Update document title if meta title is provided
  document.title = to.meta.title || 'Marvel Series';
  next();
});

export default router;