<template>
  <div class="home-container">
    <!-- Toast Notification Component for user feedback -->
    <ToastNotification
      v-model:show="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      :icon="notificationIcon"
      @close="closeNotification"
    />

    <!-- Fixed Header Search Section -->
    <div class="search-header" :class="{ 'is-loading': store.loading }">
      <div class="search-container">
        <!-- Search Input with loading indicator -->
        <div class="search-box">
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search Marvel series..." 
            v-model="searchQuery"
            @input="handleSearch"
          />
          <div class="search-icon">
            <div v-if="store.loading" class="mini-spinner"></div>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
        
        <!-- Series Type Filter -->
        <select 
          class="type-select" 
          v-model="selectedType"
        >
          <option value="">All Series</option>
          <option value="limited">Limited Series</option>
          <option value="ongoing">Ongoing Series</option>
          <option value="one shot">One Shot</option>
        </select>
      </div>
      <div class="loading-bar" v-show="store.loading"></div>
    </div>

    <!-- Main Content Area with Conditional Rendering -->
    <main class="main-content">
      <!-- Initial Loading State -->
      <div v-if="store.loading && !store.series.length" class="loading-state">
        <!-- Marvel-themed loader animation -->
        <div class="marvel-loader">
          <div class="loader-ring red"></div>
          <div class="loader-ring blue"></div>
          <div class="loader-ring yellow"></div>
        </div>
        <p>Loading Marvel Universe...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="store.error" class="error-container">
        <span class="error-text">{{ store.error }}</span>
        <button class="retry-button" @click="retryFetch">
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!filteredSeries.length" class="empty-state">
        <p>No series found. Try adjusting your filters.</p>
      </div>

      <!-- Series Grid with Transition Effects -->
      <TransitionGroup 
        v-else
        name="series-grid" 
        tag="div" 
        class="series-grid"
      >
        <SeriesCard
          v-for="(series, index) in filteredSeries"
          :key="series.id"
          :series="series"
          class="series-item"
          :style="{ 
            '--animation-delay': `${index * 0.05}s`,
            '--animation-order': index 
          }"
          @toggle-save="handleToggleSave"
        />
      </TransitionGroup>

      <!-- Loading More Indicator -->
      <div v-if="store.loading && store.series.length > 0" class="loading-more">
        <div class="marvel-loader small">
          <div class="loader-ring red"></div>
          <div class="loader-ring blue"></div>
          <div class="loader-ring yellow"></div>
        </div>
        <p>Loading more series...</p>
      </div>

      <!-- Infinite Scroll Trigger -->
      <div ref="scrollTrigger" class="scroll-trigger"></div>
    </main>
  </div>
</template>


 <!-- Home View Component
 Displays a grid of Marvel series with search, filtering, and infinite scroll capabilities -->
 
<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useMarvelStore } from '@/stores/marvelStore';
import SeriesCard from '@/components/SeriesCard.vue';
import ToastNotification from '@/components/ToastNotification.vue';

// Store and reactive references
const store = useMarvelStore();
const searchQuery = ref('');              // Current search input value
const selectedType = ref('');             // Selected series type filter
const scrollTrigger = ref(null);          // Ref for infinite scroll detection

// Toast notification state
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationType = ref('success');
const notificationIcon = ref('');

/**
 * Computed property that filters series based on search, type, and valid images
 * @returns {Array} Filtered array of series
 */
const filteredSeries = computed(() => {
  return store.series.filter(series => {
    const hasValidImage = series.thumbnail && 
                         series.thumbnail.path && 
                         !series.thumbnail.path.includes('image_not_available');
    
    const matchesSearch = series.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesType = !selectedType.value || series.type === selectedType.value;
    
    return hasValidImage && matchesSearch && matchesType;
  });
});

/**
 * Displays a toast notification with specified parameters
 * @param {string} type - Notification type ('success', 'error', 'info')
 * @param {string} message - Notification message
 * @param {string} icon - Optional icon for the notification
 */
const showToast = (type, message, icon = '') => {
  notificationType.value = type;
  notificationMessage.value = message;
  notificationIcon.value = icon;
  showNotification.value = true;
};

/**
 * Closes the current toast notification
 */
const closeNotification = () => {
  showNotification.value = false;
};

/**
 * Handles toggling series save state with notification feedback
 * @param {Object} series - Series object to toggle
 */
const handleToggleSave = (series) => {
  const success = store.toggleSaved(series);
  if (!success) {
    showToast('error', 'Maximum of 10 saved series reached', '⚠️');
    return;
  }
  
  showToast(
    store.isSavedSeries(series.id) ? 'success' : 'info',
    store.isSavedSeries(series.id) ? 'Added to collection' : 'Removed from collection',
    store.isSavedSeries(series.id) ? '⭐' : '🗑️'
  );
};

/**
 * Debounced search handler to prevent excessive API calls
 */
let searchTimeout;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    store.resetStore();
    store.fetchSeries();
  }, 300);
};

/**
 * Sets up infinite scroll functionality using Intersection Observer
 * @returns {IntersectionObserver} Configured observer instance
 */
const setupInfiniteScroll = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && !store.loading && store.series.length > 0) {
        store.fetchSeries();
      }
    },
    {
      rootMargin: '100px',
      threshold: 0.1
    }
  );

  if (scrollTrigger.value) {
    observer.observe(scrollTrigger.value);
  }

  return observer;
};

// Watch for type filter changes
watch(selectedType, () => {
  store.resetStore();
  store.fetchSeries();
});

/**
 * Retry handler for failed fetch attempts
 */
const retryFetch = () => {
  store.clearError();
  store.fetchSeries();
};

// Lifecycle hooks
let observer;
onMounted(async () => {
  await store.fetchSeries();
  observer = setupInfiniteScroll();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
  clearTimeout(searchTimeout);
});
</script>

<style scoped>
/**
 * Root Variables
 * Define global theming colors and dimensions used throughout the component
 */
:root {
  --marvel-red: #ED1D24;    /* Primary brand color */
  --marvel-blue: #518CCA;   /* Secondary brand color */
  --marvel-yellow: #FED112; /* Accent brand color */
  --header-height: 64px;    /* Fixed header height */
}

/**
 * Main Container
 * Primary container for the home view that spans the full viewport
 */
.home-container {
  width: 100%;
  min-height: 100vh;
  background: #f8f9fa;
  position: relative;
}

/**
 * State Containers
 * Styling for error and empty state messages
 */
.error-container, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  min-height: 200px;
}

.error-text {
  color: var(--marvel-red);
  margin-bottom: 1rem;
}

/**
 * Action Buttons
 * Styles for interactive buttons with hover states
 */
.retry-button {
  padding: 0.5rem 1rem;
  background-color: var(--marvel-red);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.retry-button:hover {
  background-color: #c41920;
}

/**
 * Search Header
 * Sticky header containing search and filter controls
 */
.search-header {
  position: sticky;
  top: 60px;
  background: white;
  height: var(--header-height);
  z-index: 100;
  border-bottom: 1px solid #edf2f7;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  width: 100%;
}

.search-header.is-loading {
  border-bottom-color: var(--marvel-red);
}

/**
 * Loading Indicators
 * Animated loading bar with Marvel brand colors
 */
.loading-bar {
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 2px;
  width: 100%;
  background: linear-gradient(90deg, 
    var(--marvel-red) 0%, 
    var(--marvel-blue) 50%, 
    var(--marvel-yellow) 100%);
  background-size: 200% 100%;
  animation: loadingBar 2s linear infinite;
}

/**
 * Search Controls Container
 * Layout for search input and type filter
 */
.search-container {
  width: 100%;
  padding: 0.75rem 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}

/**
 * Search Box
 * Container for search input and icon
 */
.search-box {
  position: relative;
  flex: 1;
  max-width: 500px;
}

/**
 * Search Input
 * Styled input field with focus states
 */
.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: var(--marvel-red);
  box-shadow: 0 0 0 4px rgba(237, 29, 36, 0.15);
  outline: none;
}

/**
 * Search Icon
 * Positioned icon within search input
 */
.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

/**
 * Type Select
 * Dropdown for filtering series types
 */
.type-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  width: 160px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-select:focus {
  border-color: var(--marvel-red);
  box-shadow: 0 0 0 4px rgba(237, 29, 36, 0.15);
  outline: none;
}

/**
 * Main Content
 * Primary content area with scroll behavior
 */
.main-content {
  width: 100%;
  padding: 1.5rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

/**
 * Series Grid
 * Responsive grid layout for series cards
 */
.series-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  width: 100%;
  padding: 0 1rem;
}

/**
 * Series Item
 * Individual card animation and hover effects
 */
.series-item {
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: var(--animation-delay);
  transform-origin: center;
  transition: transform 0.3s ease;
  width: 100%;
}

.series-item:hover {
  transform: translateY(-5px) scale(1.02);
}

/**
 * Loading States
 * Styles for initial and incremental loading indicators
 */
.loading-state,
.loading-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
  width: 100%;
}

.loading-state {
  min-height: 400px;
}

.loading-more {
  min-height: 150px;
}

/**
 * Marvel Loader
 * Custom animated loader with brand colors
 */
.marvel-loader {
  position: relative;
  width: 80px;
  height: 80px;
}

.marvel-loader.small {
  width: 40px;
  height: 40px;
}

/**
 * Loader Rings
 * Concentric animated rings with brand colors
 */
.loader-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

.loader-ring.red {
  border-top-color: var(--marvel-red);
}

.loader-ring.blue {
  border-right-color: var(--marvel-blue);
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
  animation-delay: 0.2s;
}

.loader-ring.yellow {
  border-bottom-color: var(--marvel-yellow);
  width: 40%;
  height: 40%;
  top: 30%;
  left: 30%;
  animation-delay: 0.4s;
}

/**
 * Mini Spinner
 * Compact loading indicator for inline use
 */
.mini-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: var(--marvel-red);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/**
 * Animations
 * Keyframe definitions for various animations
 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes loadingBar {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/**
 * Grid Transitions
 * Animation controls for grid items entering/leaving
 */
.series-grid-enter-active,
.series-grid-leave-active {
  transition: all 0.4s ease;
}

.series-grid-enter-from,
.series-grid-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

/**
 * Responsive Design
 * Media queries for different viewport sizes
 */
@media (max-width: 1200px) {
  .series-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.875rem;
    padding: 0 0.875rem;
  }
  .main-content{
    padding: 1rem 0.5rem;
  }
}

@media (max-width: 768px) {
  /* Tablet and smaller devices */
  .search-container {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0 0.75rem;
  }

  .search-box {
    width: 100%;
    max-width: 100%;
  }

  .type-select {
    width: 100%;
  }

  .series-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    padding: 0 0.75rem;
  }

  .main-content {
    padding: 1rem 0.5rem;
  }
}

@media (max-width: 480px) {
  /* Mobile devices */
  .search-header {
    height: auto;
  }

  .search-container {
    padding: 0.5rem;
  }

  .series-grid {
    gap: 0.5rem;
    padding: 0 0.5rem;
  }

  .loading-state,
  .loading-more {
    padding: 1rem;
  }

  .main-content {
    padding: 0.5rem;
  }
}
</style>