<template>
  <div class="main-layout">
    <TopBar />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <FooterBar />
  </div>
</template>

<script setup>
/**
 * Main Layout Component
 * Provides the primary layout structure for the application
 * Includes navigation bar, main content area with route transitions, and footer
 */
import TopBar from '../layout/TopBar.vue'
import FooterBar from '../layout/FooterBar.vue'
</script>

<style>
/**
 * Global CSS Variables and Base Styles
 * Defines layout measurements and basic reset styles
 * Note: Not using scoped as these styles need global application
 */

:root {
  /* Layout dimensions - can be modified globally */
  --top-bar-height: 30px;
  --footer-height: 60px;
}

/**
 * CSS Reset
 * Ensures consistent base styling across browsers
 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/**
 * Base body styles
 * Sets up the fundamental page structure
 */
body {
  margin: 0;
  padding: 0;
  background-color: #000;
  min-height: 100vh;
  overflow-x: hidden;
}

/**
 * Main Layout Container
 * Establishes a flex container for the entire application
 * Ensures footer sticks to bottom with flex-direction: column
 */
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #ffffff;
}

/**
 * Main Content Area
 * 1. Grows to fill available space (flex: 1)
 * 2. Accounts for fixed header height
 * 3. Ensures minimum height for sparse content
 * 4. Maintains proper stacking context
 */
.main-content {
  flex: 1;
  margin-top: var(--top-bar-height);
  min-height: calc(100vh - var(--top-bar-height));
  width: 100%;
  position: relative;
  z-index: 1;
  background-color: white;
}

/**
 * Route Transition Animations
 * Provides smooth transitions between routes using Vue's transition component
 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/**
 * Responsive Adjustments
 * Modifies layout dimensions for mobile devices
 */
@media (max-width: 768px) {
  :root {
    --top-bar-height: 30px;
  }
}

@media (max-width: 480px) {
  :root {
    --top-bar-height: 0.1rem;
  }
}
</style>