<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const showSplash = ref(true);
const emit = defineEmits(['splashComplete']);

let timer;
onMounted(() => {
  timer = setTimeout(() => {
    showSplash.value = false;
    emit('splashComplete');
  }, 5000);
});

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});
</script>

<template>
  <transition name="fade">
    <div v-if="showSplash" class="splash-container">
      <div class="particles-container">
        <div v-for="n in 20" :key="n" class="particle"
          :style="{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`
          }">
        </div>
      </div>

      <div class="rings-container">
        <div v-for="n in 3" :key="n" class="energy-ring"
          :style="{ animationDelay: `${n * 0.5}s` }">
        </div>
      </div>

      <div class="marvel-wrapper">
        <div class="marvel-letters">
          <div v-for="(letter, index) in 'MARVEL'" 
               :key="index"
               class="letter"
               :class="[
                 index < 2 ? 'left' : 
                 index > 3 ? 'right' : 'center',
                 `delay-${index}`
               ]">
            {{ letter }}
          </div>
        </div>
        
        <div class="subtitle-wrapper">
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