<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

/**
 * Component State & Events
 */
const showSplash = ref(true);  // Controls splash visibility
const emit = defineEmits(['splashComplete']); // Event when animation completes

/**
 * Lifecycle timer for auto-dismiss
 * Cleans up on component unmount
 */
let timer;
onMounted(() => {
  timer = setTimeout(() => {
    showSplash.value = false;
    emit('splashComplete');
  }, 5000); // 5-second duration
});

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});
</script>

<template>
  <!-- Main transition wrapper for fade effect -->
  <transition name="fade">
    <div v-if="showSplash" class="splash-container">
      <!-- Particle Effects Layer -->
      <div class="particles-container">
        <!-- Generate 20 random particles with dynamic positioning -->
        <div v-for="n in 20" :key="n" class="particle"
          :style="{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`
          }">
        </div>
      </div>

      <!-- Energy Rings Animation -->
      <div class="rings-container">
        <!-- Three concentric animated rings with staggered delays -->
        <div v-for="n in 3" :key="n" class="energy-ring"
          :style="{ animationDelay: `${n * 0.5}s` }">
        </div>
      </div>

      <!-- Marvel Branding -->
      <div class="marvel-wrapper">
        <!-- Animated MARVEL Letters -->
        <div class="marvel-letters">
          <!-- Individual letter animations with position classes -->
          <div v-for="(letter, index) in 'MARVEL'" 
               :key="index"
               class="letter"
               :class="[
                 // Position-based animation classes
                 index < 2 ? 'left' : 
                 index > 3 ? 'right' : 'center',
                 `delay-${index}`
               ]">
            {{ letter }}
          </div>
        </div>
        
        <!-- Animated Subtitle -->
        <div class="subtitle-wrapper">
          <!-- Staggered letter animations for subtitle -->
          <span v-for="(letter, index) in 'CHALLENGE-TIFTI'"
                :key="index"
                class="subtitle-letter"
                :style="{ animationDelay: `${2 + index * 0.1}s` }">
            {{ letter }}
          </span>
        </div>
      </div>
    </div>
  </transition>
</template>