<template>
  <div class="history-container"> 
    <ToastNotification
      v-model:show="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      :icon="notificationIcon"
      @close="closeNotification"
    />   
    <section class="collection-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="section-icon">
            <svg viewBox="0 0 24 24" class="star-icon" width="24" height="24">
              <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" fill="currentColor"/>
            </svg>
          </span>
          Saved Series
        </h2>
        <div class="series-counter" :class="{ 'limit-warning': store.savedSeries.length >= 8 }">
          {{ store.savedSeries.length }}/10
          <div class="counter-bar">
            <div class="counter-progress" :style="{ width: `${(store.savedSeries.length/10) * 100}%` }"></div>
          </div>
        </div>
      </div>

      <div class="carousel-container" v-if="store.savedSeries.length">
        <button class="carousel-button prev" @click="scrollCarousel('saved', -1)" :disabled="savedScrollPosition <= 0">
          <svg viewBox="0 0 24 24" class="carousel-icon">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
          </svg>
        </button>
        
        <div class="carousel-wrapper saved" ref="savedCarousel">
          <div v-for="series in store.savedSeries" 
               :key="series.id" 
               class="series-card carousel-card"
               @mouseover="hoveredCard = series.id"
               @mouseleave="hoveredCard = null">
            <div class="bookmark-button" 
                 :class="{ 'saved': true }"
                 @click.stop="handleToggleSaved(series)">
              <svg viewBox="0 0 24 24" class="bookmark-icon" width="20" height="20">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="currentColor"/>
              </svg>
            </div>
            
            <div class="card-image-wrapper" @click="navigateToDetail(series)">
              <img 
                :src="getThumbnailUrl(series)" 
                :alt="series.title" 
                class="card-image"
                @error="handleImageError"
              />
              <div class="card-overlay" :class="{ 'show': hoveredCard === series.id }">
                <span class="view-button">
                  <svg viewBox="0 0 24 24" class="view-icon" width="20" height="20">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                  </svg>
                  View
                </span>
              </div>
            </div>

            <div class="card-content">
              <h3 class="card-title">{{ series.title }}</h3>
              <div class="card-metadata">
                <span class="year-badge">{{ getYearRange(series.startYear, series.endYear) }}</span>
                <span class="type-badge" :class="getTypeClass(series.type)">
                  {{ series.type || 'Ongoing' }}
                </span>
              </div>
              <div class="stats-container">
                <div class="stat-item">
                  <svg viewBox="0 0 24 24" class="stat-icon" width="16" height="16">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
                  </svg>
                  {{ series.comics?.available || 0 }} Comics
                </div>
                <div class="stat-item">
                  <svg viewBox="0 0 24 24" class="stat-icon" width="16" height="16">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                  </svg>
                  {{ series.stories?.available || 0 }} Stories
                </div>
              </div>
            </div>
          </div>
        </div>

        <button class="carousel-button next" @click="scrollCarousel('saved', 1)" :disabled="savedScrollPosition >= maxSavedScroll">
          <svg viewBox="0 0 24 24" class="carousel-icon">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      <div v-else class="empty-state">
        <svg viewBox="0 0 24 24" class="empty-icon" width="48" height="48">
          <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="currentColor"/>
          <path d="M12 12.5c1.4 0 2.5-1.1 2.5-2.5S13.4 7.5 12 7.5 9.5 8.6 9.5 10s1.1 2.5 2.5 2.5z" fill="currentColor"/>
          <path d="M12 14c-2.2 0-4 1.8-4 4v2h8v-2c0-2.2-1.8-4-4-4z" fill="currentColor"/>
        </svg>
        <p>No saved series yet</p>
        <button class="browse-button" @click="$router.push('/')">Browse Series</button>
      </div>
    </section>
    <section class="collection-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="section-icon">
            <svg viewBox="0 0 24 24" class="history-icon" width="24" height="24">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8z" fill="currentColor"/>
            </svg>
          </span>
          Recently Viewed
        </h2>
      </div>
      <div class="carousel-container" v-if="filteredViewedSeries.length">
        <button class="carousel-button prev" @click="scrollCarousel('recent', -1)" :disabled="recentScrollPosition <= 0">
          <svg viewBox="0 0 24 24" class="carousel-icon">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
          </svg>
        </button>
        <div class="carousel-wrapper recent" ref="recentCarousel">
          <div v-for="series in filteredViewedSeries" 
               :key="series.id" 
               class="series-card carousel-card"
               @mouseover="hoveredCard = series.id"
               @mouseleave="hoveredCard = null">
            <div class="bookmark-button" 
                 :class="{ 'saved': isSeriesSaved(series.id) }"
                 @click.stop="handleToggleSaved(series)">
              <svg viewBox="0 0 24 24" class="bookmark-icon" width="20" height="20">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="currentColor"/>
              </svg>
            </div>
            <div class="card-image-wrapper" @click="navigateToDetail(series)">
              <img 
                :src="getThumbnailUrl(series)" 
                :alt="series.title" 
                class="card-image"
                @error="handleImageError"
              />
              <div class="card-overlay" :class="{ 'show': hoveredCard === series.id }">
                <span class="view-button">
                  <svg viewBox="0 0 24 24" class="view-icon" width="20" height="20">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                  </svg>
                  View Details
                </span>
              </div>
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ series.title }}</h3>
              <div class="card-metadata">
                <span class="year-badge">{{ getYearRange(series.startYear, series.endYear) }}</span>
                <span class="type-badge" :class="getTypeClass(series.type)">
                  {{ series.type || 'Ongoing' }}
                </span>
              </div>
              <div class="stats-container">
                <div class="stat-item">
                  <svg viewBox="0 0 24 24" class="stat-icon" width="16" height="16">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
                  </svg>
                  {{ series.comics?.available || 0 }} Comics
                </div>
                <div class="stat-item">
                  <svg viewBox="0 0 24 24" class="stat-icon" width="16" height="16">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                  </svg>
                  {{ series.stories?.available || 0 }} Stories
                </div>
              </div>
            </div>
          </div>
        </div>
        <button class="carousel-button next" @click="scrollCarousel('recent', 1)" :disabled="recentScrollPosition >= maxRecentScroll">
          <svg viewBox="0 0 24 24" class="carousel-icon">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" fill="currentColor"/>
          </svg>
        </button>
      </div>
      <div v-else class="empty-state">
        <svg viewBox="0 0 24 24" class="empty-icon" width="48" height="48">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
        </svg>
        <p>No viewed series yet</p>
        <button class="browse-button" @click="$router.push('/')">Start Exploring</button>
      </div>
    </section>
  </div>
</template>


<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';import { useRouter } from 'vue-router';
import { useMarvelStore } from '@/stores/marvelStore';
import ToastNotification from '@/components/ToastNotification.vue';

const router = useRouter();
const store = useMarvelStore();
const hoveredCard = ref(null);
const savedCarousel = ref(null);
const recentCarousel = ref(null);
const savedScrollPosition = ref(0);
const recentScrollPosition = ref(0);
const maxSavedScroll = ref(0);
const maxRecentScroll = ref(0);
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationType = ref('success');
const notificationIcon = ref('');

const filteredViewedSeries = computed(() => {
  return store.viewedSeries
    .filter(series => !store.savedSeries.some(saved => saved.id === series.id))
    .reverse();
});

const getThumbnailUrl = (series) => {
  if (!series?.thumbnail) return '/placeholder-image.jpg';
  
  const path = series.thumbnail.path.replace('http:', 'https:');
  return `${path}.${series.thumbnail.extension}`;
};

const getYearRange = (start, end) => {
  if (!start) return 'Year Unknown';
  if (!end || end >= new Date().getFullYear()) return `${start} - Present`;
  return `${start} - ${end}`;
};

const getTypeClass = (type) => {
  const normalizedType = type?.toLowerCase() || '';
  return {
    'type-limited': normalizedType === 'limited',
    'type-ongoing': !normalizedType || normalizedType === 'ongoing',
    'type-finished': normalizedType === 'finished'
  };
};

const isSeriesSaved = (seriesId) => {
  return store.savedSeries.some(s => s.id === seriesId);
};

const navigateToDetail = (series) => {
  store.addToViewed(series);
  router.push(`/detail/${series.id}`);
};

const showToast = (type, message, icon = '') => {
  notificationType.value = type;
  notificationMessage.value = message;
  notificationIcon.value = icon;
  showNotification.value = true;
};

const handleToggleSaved = (series) => {
  const success = store.toggleSaved(series);
  if (!success) {
    showToast('error', 'Maximum of 10 saved series reached', '⚠️');
    return;
  }
  
  showToast(
    isSeriesSaved(series.id) ? 'info' : 'success',
    isSeriesSaved(series.id) ? 'Added to collection' : 'Removed from collection',
    isSeriesSaved(series.id) ? '⭐' : '🗑️'
  );
};

const closeNotification = () => {
  showNotification.value = false;
};

const handleImageError = (event) => {
  event.target.src = '/placeholder-image.jpg';
};

const updateScrollLimits = () => {
  if (savedCarousel.value) {
    maxSavedScroll.value = Math.max(0, savedCarousel.value.scrollWidth - savedCarousel.value.offsetWidth);
  }
  if (recentCarousel.value) {
    maxRecentScroll.value = Math.max(0, recentCarousel.value.scrollWidth - recentCarousel.value.offsetWidth);
  }
};

const scrollCarousel = (type, direction) => {
  const carousel = type === 'saved' ? savedCarousel.value : recentCarousel.value;
  const scrollAmount = carousel.offsetWidth * 0.8;
  const newPosition = carousel.scrollLeft + (scrollAmount * direction);
  
  carousel.scrollTo({
    left: newPosition,
    behavior: 'smooth'
  });

  if (type === 'saved') {
    savedScrollPosition.value = newPosition;
  } else {
    recentScrollPosition.value = newPosition;
  }
};

const handleCarouselScroll = (type) => {
  const carousel = type === 'saved' ? savedCarousel.value : recentCarousel.value;
  if (type === 'saved') {
    savedScrollPosition.value = carousel.scrollLeft;
    maxSavedScroll.value = Math.max(0, carousel.scrollWidth - carousel.offsetWidth);
  } else {
    recentScrollPosition.value = carousel.scrollLeft;
    maxRecentScroll.value = Math.max(0, carousel.scrollWidth - carousel.offsetWidth);
  }
};

const setupLazyLoading = () => {
  const options = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, options);

  document.querySelectorAll('.card-image[data-src]').forEach(img => {
    observer.observe(img);
  });
};

onMounted(() => {
  updateScrollLimits();
  savedCarousel.value?.addEventListener('scroll', () => handleCarouselScroll('saved'));
  recentCarousel.value?.addEventListener('scroll', () => handleCarouselScroll('recent'));
  window.addEventListener('resize', updateScrollLimits);
  window.addEventListener('keydown', handleKeyNavigation);
  setupLazyLoading();
});

onBeforeUnmount(() => {
  savedCarousel.value?.removeEventListener('scroll', () => handleCarouselScroll('saved'));
  recentCarousel.value?.removeEventListener('scroll', () => handleCarouselScroll('recent'));
  
  window.removeEventListener('resize', updateScrollLimits);
  window.removeEventListener('keydown', handleKeyNavigation);
});

watch(() => store.savedSeries.length, () => {
  nextTick(() => {
    updateScrollLimits();
    setupLazyLoading();
  });
});

watch(() => filteredViewedSeries.value.length, () => {
  nextTick(() => {
    updateScrollLimits();
    setupLazyLoading();
  });
});

const handleKeyNavigation = (event) => {
  if (document.activeElement.tagName === 'INPUT') return;

  if (event.key === 'ArrowLeft') {
    scrollCarousel('saved', -1);
    scrollCarousel('recent', -1);
  } else if (event.key === 'ArrowRight') {
    scrollCarousel('saved', 1);
    scrollCarousel('recent', 1);
  }
};
</script>


<style>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.series-grid-move,
.series-grid-enter-active,
.series-grid-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.series-grid-enter-from,
.series-grid-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.series-grid-leave-active {
  position: absolute;
}

.history-container {
  width: 100%;
  min-height: 100vh;
  background: #f8f9fa;
  position: relative;
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.5s ease;

}

.main-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  text-transform: uppercase;
  letter-spacing: -0.5px;
}

.marvel-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #e62429;
}

.collection-section {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.collection-section:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #e62429;
}

.series-counter {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
  color: #4a5568;
  padding: 0.5rem 1rem;
  background: #f8fafc;
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.counter-bar {
  width: 100px;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.counter-progress {
  height: 100%;
  background: #48bb78;
  border-radius: 3px;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.limit-warning .counter-progress {
  background: #ed8936;
}

.carousel-container {
  position: relative;
  padding: 0 3rem;
  margin: 0 -1rem;
}

.carousel-wrapper {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 1rem 0;
  scroll-snap-type: x mandatory;
}

.carousel-wrapper::-webkit-scrollbar {
  display: none;
}

.carousel-card {
  flex: 0 0 280px;
  scroll-snap-align: start;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 3rem;
  height: 3rem;
  background: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 10;
}

.carousel-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.carousel-button:not(:disabled):hover {
  transform: translateY(-50%) scale(1.1);
  background: #f7fafc;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.carousel-button.prev { left: 0; }
.carousel-button.next { right: 0; }

.carousel-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #4a5568;
}

.series-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.series-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -3px rgba(0, 0, 0, 0.15);
}

.card-image-wrapper {
  position: relative;
  padding-top: 150%;
  overflow: hidden;
  cursor: pointer;
}

.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.series-card:hover .card-image {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-overlay.show {
  opacity: 1;
}

.view-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  background: rgba(230, 36, 41, 0.9);
  transition: transform 0.3s ease;
}

.view-button:hover {
  transform: scale(1.05);
}

.bookmark-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  width: 2.5rem;
  height: 2.5rem;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bookmark-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.bookmark-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #a0aec0;
  transition: color 0.3s ease;
}

.bookmark-button.saved .bookmark-icon {
  color: #e62429;
}

.card-content {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 3rem;
}

.card-metadata {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.year-badge {
  background: #edf2f7;
  color: #4a5568;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.type-limited {
  background: #fed7d7;
  color: #c53030;
}

.type-ongoing {
  background: #c6f6d5;
  color: #2f855a;
}

.type-finished {
  background: #e9d8fd;
  color: #6b46c1;
}

.stats-container {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.875rem;
}

.stat-icon {
  width: 1rem;
  height: 1rem;
  color: #718096;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #718096;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.browse-button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #e62429;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.browse-button:hover {
  background: #c41e23;
  transform: translateY(-2px);
}

@media (max-width: 1200px) {
  .history-container {
    padding: 1.5rem;

  }

  .carousel-card {
    flex: 0 0 250px;
  }
}

@media (max-width: 768px) {
  .history-container {
    padding: 1rem;
  }

  .collection-section {
    padding: 1.5rem;
  }

  .carousel-container {
    padding: 0 2rem;
  }

  .carousel-card {
    flex: 0 0 220px;
  }

  .main-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .carousel-container {
    padding: 0 1.5rem;
  }

  .carousel-card {
    flex: 0 0 180px;
  }

  .card-metadata {
    flex-direction: column;
    gap: 0.5rem;
  }

  .stats-container {
    flex-direction: column;
    gap: 0.5rem;
  }
  .history-container {
    margin-top: 3rem;
    gap: 0;
  }
}
</style>