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
import TopBar from '../layout/TopBar.vue'
import FooterBar from '../layout/FooterBar.vue'
</script>

<style>
:root {
  --top-bar-height: 30px;
  --footer-height: 60px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #000;
  min-height: 100vh;
  overflow-x: hidden;
}

.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #ffffff;
}

.main-content {
  flex: 1;
  margin-top: var(--top-bar-height);
  min-height: calc(100vh - var(--top-bar-height));
  width: 100%;
  position: relative;
  z-index: 1;
  background-color: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  :root {
    --top-bar-height: 30px;
  }
}
</style>