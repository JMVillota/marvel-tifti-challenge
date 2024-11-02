<template>
  <header class="top-bar">
    <nav class="nav-container">
      <div class="left-section">
        <router-link to="/" class="logo-link">
          <div class="marvel-logo-container">
            <div class="marvel-logo">
              <span class="logo-letter">M</span>
            </div>
            <h1 class="brand-text">Marvel Series</h1>
          </div>
        </router-link>
      </div>
      
      <div class="center-section">
        <ul class="nav-links">
          <li>
            <router-link to="/" :class="{ active: $route.name === 'home' }">
              <svg class="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>HOME</span>
              <div class="nav-indicator"></div>
            </router-link>
          </li>
          <li>
            <router-link to="/history" :class="{ active: $route.name === 'history' }">
              <svg class="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>HISTORY</span>
              <div class="nav-indicator"></div>
            </router-link>
          </li>
        </ul>
      </div>
      
      <div class="right-section">
        <div 
          class="avatar-container" 
          @click="forceChangeAvatar"
          :class="{ 'avatar-loading': store.isLoading }"
        >
          <div class="avatar-ring"></div>
          <div 
            v-if="store.avatarCharacter" 
            class="character-avatar" 
            :title="store.avatarCharacter.name"
          >
            <img 
              :src="`${store.avatarCharacter.thumbnail.path}.${store.avatarCharacter.thumbnail.extension}`" 
              :alt="store.avatarCharacter.name"
              @error="handleImageError"
            />
            <div class="avatar-info">
              <span>{{ store.avatarCharacter.name }}</span>
            </div>
          </div>
          <div v-else class="character-avatar-placeholder">
            <span>👤</span>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useMarvelStore } from '@/stores/marvelStore';

const store = useMarvelStore();
const avatarInterval = ref(null);
const ROTATION_INTERVAL = 30000;

const startAvatarRotation = () => {
  store.fetchRandomCharacter();
  avatarInterval.value = setInterval(() => {
    store.fetchRandomCharacter();
  }, ROTATION_INTERVAL);
};

const stopAvatarRotation = () => {
  if (avatarInterval.value) {
    clearInterval(avatarInterval.value);
    avatarInterval.value = null;
  }
};

const forceChangeAvatar = () => {
  store.fetchRandomCharacter();
  stopAvatarRotation();
  startAvatarRotation();
};

const handleImageError = () => {
  forceChangeAvatar();
};

onMounted(() => {
  startAvatarRotation();
});

onUnmounted(() => {
  stopAvatarRotation();
});
</script>

<style scoped>
/**
 * TopBar Component Styles
 * Complete styling for the main navigation header including:
 * - Fixed header with hardware acceleration
 * - Marvel branding elements
 * - Navigation menu
 * - Character avatar system
 * - Responsive design
 */

/* Fixed Header
 * 1. Fixed positioning for persistent visibility
 * 2. Hardware acceleration enabled
 * 3. Shadow for depth
 */
 .top-bar {
  background-color: #000000;
  color: white;
  height: 60px;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  will-change: transform;
}

/* Navigation Container
 * Main flex container for header elements
 */
.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Logo Section
 * Interactive Marvel branding with hover effects
 */
.logo-link {
  text-decoration: none;
  display: flex;
  align-items: center;
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.logo-link:hover {
  transform: translateY(-2px);
}

/* Marvel Logo Container
 * Layout for logo and brand text
 */
.marvel-logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Marvel Logo
 * Styled box with Marvel's signature red
 */
.marvel-logo {
  background-color: #ED1D24;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(237, 29, 36, 0.3);
}

.logo-link:hover .marvel-logo {
  transform: rotate(-5deg);
  box-shadow: 0 6px 16px rgba(237, 29, 36, 0.4);
}

/* Logo Typography
 * Text styling for logo and brand
 */
.logo-letter {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.brand-text {
  color: white;
  font-size: 20px;
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Navigation Links
 * Main menu styling with hover effects
 */
.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 40px;
}

.nav-links li {
  position: relative;
}

.nav-links a {
  color: #a0a0a0;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  transition: all 0.3s ease;
  position: relative;
}

/* Navigation Indicators
 * Animated underline for active and hover states
 */
.nav-indicator {
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #ED1D24;
  transition: width 0.3s ease;
}

.nav-links a:hover,
.nav-links a.active {
  color: white;
}

.nav-links a:hover .nav-indicator,
.nav-links a.active .nav-indicator {
  width: 100%;
}

/* Navigation Icons
 * Styling for menu icons with hover animation
 */
.nav-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.nav-links a:hover .nav-icon {
  transform: translateY(-2px);
}

/* Character Avatar Section
 * Dynamic Marvel character avatar with animations
 */
.avatar-container {
  position: relative;
  width: 44px;
  height: 44px;
  cursor: pointer;
}

/* Avatar Ring Animation
 * Pulsing effect for the avatar border
 */
.avatar-ring {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  border: 2px solid #ED1D24;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 0.4; }
  100% { transform: scale(1); opacity: 0.8; }
}

/* Character Avatar Styling
 * Image container with hover effects
 */
.character-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.character-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.character-avatar:hover img {
  transform: scale(1.2) rotate(5deg);
}

/* Avatar Info Tooltip
 * Popup information on hover
 */
.avatar-info {
  position: absolute;
  bottom: -48px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background-color: #ED1D24;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.character-avatar:hover .avatar-info {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* Placeholder and Loading States
 * Fallback styling when no avatar is available
 */
.character-avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background-color: #2a2a2a;
  color: #ED1D24;
  transition: all 0.3s ease;
}

.avatar-loading {
  opacity: 0.7;
  pointer-events: none;
}

/* Responsive Design
 * Breakpoints for different screen sizes
 */
@media (max-width: 1024px) {
  .nav-container {
    padding: 0 20px;
  }
}

@media (max-width: 768px) {
  .brand-text {
    display: none;
  }
  
  .nav-links {
    gap: 24px;
  }
  
  .nav-links a span {
    display: none;
  }
  
  .nav-container {
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .top-bar {
    height: 56px;
  }
  
  .marvel-logo {
    width: 36px;
    height: 36px;
  }
  
  .nav-links {
    gap: 16px;
  }
  
  .nav-container {
    padding: 0 12px;
  }
  
  .avatar-container {
    width: 36px;
    height: 36px;
  }
}

/* Accessibility
 * Reduced motion preferences
 */
@media (prefers-reduced-motion: reduce) {
  .logo-link,
  .nav-icon,
  .character-avatar img,
  .avatar-ring {
    transition: none;
    animation: none;
  }
}
</style>