<!-- App.vue -->
<script setup>
import { ref } from 'vue';
import SplashScreen from './views/SplashScreen.vue';

const loading = ref(true);

const onSplashComplete = () => {
  loading.value = false;
};
</script>

<template>
  <splash-screen v-if="loading" @splashComplete="onSplashComplete" />
  <router-view v-else />
</template>