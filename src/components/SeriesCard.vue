<template>
  <div class="series-card" @click="navigateToDetail">
    <div class="card-image-container">
      <button 
        class="bookmark-button" 
        :class="{ 'saved': isSaved }"
        @click.stop="handleToggleSaved"
        :title="isSaved ? 'Remove from saved' : 'Add to saved'"
      >
        <svg viewBox="0 0 24 24" class="bookmark-icon">
          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="currentColor"/>
        </svg>
      </button>
      <img 
        :src="thumbnailUrl" 
        :alt="series.title" 
        class="card-image"
        :class="{ 'small': isSmallView }"
        @error="handleImageError"
        loading="lazy"
      />
      <div class="card-overlay">
        <span class="view-details">
          <svg viewBox="0 0 24 24" class="view-icon">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
          </svg>
          View
        </span>
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="card-title">{{ series.title }}</h3>
      
      <div class="card-metadata">
        <span class="year-badge">{{ yearRange }}</span>
        <span 
          class="type-badge"
          :class="typeClasses"
        >
          {{ displayType }}
        </span>
      </div>
      
      <div class="resources-info">
        <span class="resource-count">
          <svg class="resource-icon" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" fill="currentColor"/>
            <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z" fill="currentColor"/>
          </svg>
          <strong>{{ series.comics?.available || 0 }}</strong>
        </span>
        <span class="resource-count">
          <svg class="resource-icon" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" fill="currentColor"/>
          </svg>
          <strong>{{ series.stories?.available || 0 }}</strong>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMarvelStore } from '@/stores/marvelStore';

/**
 * Series Card Component
 * Displays information about a Marvel series in a card format.
 * Features include series image, title, year range, type badge, and resource counts.
 */

/**
 * Component Props
 */
const props = defineProps({
  /** The series object containing all necessary data */
  series: {
    type: Object,
    required: true,
  },
  /** Flag to determine if the card should be rendered in a smaller view */
  isSmallView: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();
const store = useMarvelStore();
const hasImageError = ref(false);

/**
 * Computes the URL for the series thumbnail image
 * Falls back to a placeholder if the image is not available or fails to load
 * @returns {string} The URL of the thumbnail image
 */
const thumbnailUrl = computed(() => {
  if (hasImageError.value) {
    return '/placeholder-image.jpg';
  }
  if (!props.series.thumbnail) return '/placeholder-image.jpg';
  
  const path = props.series.thumbnail.path.replace('http:', 'https:');
  return `${path}.${props.series.thumbnail.extension}`;
});

/**
 * Formats and computes the year range for display
 * Handles different cases: unknown year, ongoing series, and completed series
 * @returns {string} Formatted year range string
 */
const yearRange = computed(() => {
  const { startYear, endYear } = props.series;
  const currentYear = new Date().getFullYear();
  
  if (!startYear) return 'Year Unknown';
  if (!endYear || endYear === currentYear) return `${startYear} - Present`;
  return `${startYear} - ${endYear}`;
});

/**
 * Formats the series type for display with proper capitalization
 * Defaults to 'Ongoing' if no type is specified
 * @returns {string} Formatted series type
 */
const displayType = computed(() => {
  return props.series.type?.charAt(0).toUpperCase() + 
         props.series.type?.slice(1) || 'Ongoing';
});

/**
 * Computes CSS classes for the type badge based on series type
 * @returns {Object} Object containing CSS class conditions
 */
const typeClasses = computed(() => ({
  'limited': props.series.type === 'limited',
  'ongoing': !props.series.type || props.series.type === 'ongoing'
}));

/**
 * Checks if the current series is saved in the store
 * @returns {boolean} True if the series is saved
 */
const isSaved = computed(() => {
  return store.isSavedSeries(props.series.id);
});

/**
 * Handles image loading errors by setting a flag to show placeholder
 */
const handleImageError = () => {
  hasImageError.value = true;
};

/**
 * Navigates to the series detail page and adds the series to viewed history
 */
const navigateToDetail = () => {
  store.addToViewed(props.series);
  router.push(`/detail/${props.series.id}`);
};

/**
 * Event Emits Declaration
 */
const emit = defineEmits(['toggle-save']);

/**
 * Handles the bookmark toggle action
 * Emits toggle-save event to parent component
 */
const handleToggleSaved = () => {
  emit('toggle-save', props.series);
};
</script>

<style scoped>

/**
 * Styles are organized into sections:
 * 1. Card Container
 * 2. Image Container and Overlay
 * 3. Bookmark Button
 * 4. Content Area
 * 5. Typography
 * 6. Badges and Icons
 * 7. Resource Counts
 * 8. Responsive Design
 */

.series-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 200px;
}

.series-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.card-image-container {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  background: #f3f4f6;
  max-height: 330px;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card-image.small {
  max-height: 160px;
}

.series-card:hover .card-image {
  transform: scale(1.05);
}

.bookmark-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
  width: 2rem;
  height: 2rem;
  background: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
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
  transition: color 0.2s ease;
}

.bookmark-button.saved .bookmark-icon {
  color: #e62429;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.view-details {
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.4rem 0.8rem;
  border-radius: 16px;
  background: rgba(230, 36, 41, 0.9);
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.view-icon {
  width: 16px;
  height: 16px;
}

.series-card:hover .card-overlay {
  opacity: 1;
}

.card-content {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
  height: 2.6em;
}

.card-metadata {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
}

.year-badge {
  font-size: 0.75rem;
  color: #64748b;
}

.type-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.type-badge.limited {
  background: #fef2f2;
  color: #dc2626;
}

.type-badge.ongoing {
  background: #f0fdf4;
  color: #16a34a;
}

.resources-info {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.75rem;
}

.resource-count {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  color: #64748b;
}

.resource-icon {
  width: 14px;
  height: 14px;
  color: #64748b;
}

.resource-count strong {
  color: #1a202c;
  font-weight: 600;
}

@media (max-width: 640px) {
  .series-card {
    max-width: 160px;
  }
  
  .card-content {
    padding: 0.5rem;
  }
  
  .card-title {
    font-size: 0.8rem;
    height: 2.4em;
  }
  
  .type-badge {
    padding: 0.15rem 0.4rem;
    font-size: 0.65rem;
  }
  
  .resources-info {
    padding-top: 0.4rem;
  }
  
  .resource-icon {
    width: 12px;
    height: 12px;
  }

  .bookmark-button {
    width: 1.75rem;
    height: 1.75rem;
  }

  .bookmark-icon {
    width: 1rem;
    height: 1rem;
  }
}
</style>