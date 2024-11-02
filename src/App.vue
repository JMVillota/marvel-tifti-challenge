<script setup>
import { ref } from 'vue';
import SplashScreen from './views/SplashScreen.vue';

/**
 * State Management
 * 
 * @constant {Ref<boolean>} loading - Controls whether to show splash screen
 * Initially true to display splash screen on app launch
 */
const loading = ref(true);

/**
 * Event Handlers
 * 
 * @function onSplashComplete
 * Callback triggered when splash screen animation completes
 * Sets loading to false to transition to main application content
 */
const onSplashComplete = () => {
  loading.value = false;
};
</script>

<template>
  <!-- 
    Dynamic Component Rendering:
    - Shows splash screen during initial load
    - Transitions to main app content after splash completes 
  -->
  <splash-screen 
    v-if="loading" 
    @splashComplete="onSplashComplete" 
  />
  <!-- 
    Main Router View:
    - Renders route-based components after splash screen
    - Handles all application routing and views 
  -->
  <router-view v-else />
</template>

