<template>
  <div class="detail-view">
    <!-- Toast Notification Component -->
    <!-- Displays user feedback messages with different states (success/error/info) -->
    <ToastNotification
      v-model:show="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      :icon="notificationIcon"
      @close="closeNotification"
    />

    <!-- Image Modal -->
    <!-- Full-screen modal for enlarged image view -->
    <Transition name="modal">
      <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
        <div class="modal-content">
          <img 
            :src="thumbnailUrl" 
            :alt="series?.title"
            class="modal-image"
          />
          <button class="modal-close" @click="closeImageModal">×</button>
        </div>
      </div>
    </Transition>

    <!-- Main Content Layout -->
    <div class="content-wrapper">
      <!-- Left Sidebar - Image and Stats Section -->
      <div class="image-section">
        <!-- Series Image Container with Overlay Actions -->
        <div class="image-container">
          <img 
            :src="thumbnailUrl" 
            :alt="series?.title"
            class="series-image"
          />
          <!-- Image Overlay with Action Buttons -->
          <div class="image-overlay">
            <!-- Save/Unsave Toggle Button -->
            <button 
              @click="handleSave" 
              class="save-button"
              :class="{ 'is-saved': isSaved }"
            >
              <span class="icon">{{ isSaved ? '★' : '☆' }}</span>
              Save
            </button>
            <!-- Zoom Image Button -->
            <button 
              @click="openImageModal"
              class="zoom-button"
            >
              🔍 Zoom
            </button>
          </div>
        </div>

        <!-- Stats Grid -->
        <!-- Displays counts for related content types -->
        <div class="stats-container">
          <div 
            v-for="(stat, index) in stats" 
            :key="index"
            class="stat-item"
          >
            <span class="stat-icon">{{ stat.icon }}</span>
            <div class="stat-info">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="content-section">
        <!-- Series Header -->
        <!-- Title and Meta Information -->
        <div class="series-header">
          <h1 class="series-title">{{ series?.title }}</h1>
          <div class="series-meta">
            <span class="year-range">{{ yearRange }}</span>
            <span class="status-badge">{{ series?.status || 'Ongoing' }}</span>
          </div>
        </div>

        <!-- About Section -->
        <div class="about-section">
          <h2 class="section-title">About the Series</h2>
          
          <!-- Series Information Grid -->
          <!-- Displays key details in a structured format -->
          <div class="series-info">
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Format</span>
                <span class="value">{{ series?.format || 'Unknown' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Last Updated</span>
                <span class="value">{{ formattedDate }}</span>
              </div>
              <div class="info-item">
                <span class="label">Status</span>
                <span class="value">{{ series?.status || 'Unknown' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Start Year</span>
                <span class="value">{{ series?.startYear || 'Unknown' }}</span>
              </div>
            </div>
          </div>

          <!-- Description Section -->
          <!-- Expandable description with "Show More/Less" functionality -->
          <div class="description-container">
            <div 
              class="description-content"
              :class="{ 'expanded': isExpanded }"
              ref="descriptionContent"
            >
              <p v-if="series?.description" 
                 v-html="formattedDescription"
                 class="description-text"
              ></p>
              <p v-else class="no-description">
                No description available for this series.
              </p>
            </div>
            <!-- Expansion Toggle Button -->
            <button 
              v-if="hasLongDescription"
              @click="toggleExpand" 
              class="expand-button"
            >
              {{ isExpanded ? 'Show Less' : 'Show More' }}
            </button>
          </div>
        </div>

        <!-- Related Content Section -->
        <div class="related-section">
          <h2 class="section-title">Related Content</h2>
          
          <!-- Content Type Tabs -->
          <!-- Navigation tabs for different types of related content -->
          <div class="tabs-container">
            <button 
              v-for="tab in tabs"
              :key="tab.id"
              @click="currentTab = tab.id"
              class="tab-button"
              :class="{ active: currentTab === tab.id }"
            >
              {{ tab.label }}
              <span class="tab-count">{{ resourceCounts[tab.id] || 0 }}</span>
            </button>
          </div>

          <!-- Related Content Grid -->
          <!-- Animated grid of related content items -->
          <TransitionGroup 
            name="resource-fade" 
            tag="div"
            class="resources-grid"
          >
            <div 
              v-for="resource in currentResources"
              :key="resource.resourceURI"
              class="resource-card"
              @click="handleResourceClick(resource)"
            >
              <h3 class="resource-title">{{ resource.name || resource.title }}</h3>
              <p class="resource-description">
                {{ resource.description || 'No description available' }}
              </p>
            </div>
          </TransitionGroup>

          <!-- Pagination Controls -->
          <!-- Navigation between pages of related content -->
          <div v-if="totalPages > 1" class="pagination">
            <button 
              class="page-button prev"
              :disabled="currentPage === 1"
              @click="prevPage"
            >
              Previous
            </button>
            <span class="page-info">{{ currentPage }} of {{ totalPages }}</span>
            <button 
              class="page-button next"
              :disabled="currentPage === totalPages"
              @click="nextPage"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Detail View Component
 * Provides a detailed view of a Marvel series including image gallery,
 * description, stats, and related content with pagination.
 */
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMarvelStore } from '@/stores/marvelStore';
import ToastNotification from '@/components/ToastNotification.vue';

// Store and routing setup
const store = useMarvelStore();
const route = useRoute();

/**
 * Component State
 */
const isExpanded = ref(false);              // Controls description expansion state
const showNotification = ref(false);        // Controls toast visibility
const notificationType = ref('success');    // Toast type (success/error/info)
const notificationMessage = ref('');        // Toast message content
const notificationIcon = ref('');           // Toast icon
const currentTab = ref('comics');           // Active content tab
const currentPage = ref(1);                 // Current page in pagination
const itemsPerPage = 8;                     // Items displayed per page
const descriptionContent = ref(null);       // Reference to description container
const showImageModal = ref(false);          // Controls image modal visibility

/**
 * Computed Properties
 */

// Current series details from store
const series = computed(() => store.seriesDetail);

/**
 * Generates full thumbnail URL with fallback
 * @returns {string} Complete image URL or fallback image path
 */
const thumbnailUrl = computed(() => {
  if (!series.value?.thumbnail) return '/placeholder.jpg';
  return `${series.value.thumbnail.path}.${series.value.thumbnail.extension}`;
});

/**
 * Formats series year range for display
 * @returns {string} Formatted year range (e.g., "2020 - Present")
 */
const yearRange = computed(() => {
  if (!series.value) return '';
  const start = series.value.startYear;
  const end = series.value.endYear;
  if (!start) return 'Year Unknown';
  if (!end || end === new Date().getFullYear()) return `${start} - Present`;
  return `${start} - ${end}`;
});

/**
 * Formats description with HTML safety measures
 * @returns {string} Sanitized HTML string
 */
const formattedDescription = computed(() => {
  if (!series.value?.description) return '';
  return series.value.description
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
});

/**
 * Formats last modified date in localized format
 * @returns {string} Formatted date string
 */
const formattedDate = computed(() => {
  if (!series.value?.modified) return 'Not available';
  return new Date(series.value.modified).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

/**
 * Determines if description needs expansion button
 * @returns {boolean} True if description exceeds height limit
 */
const hasLongDescription = computed(() => {
  if (!descriptionContent.value) return false;
  return descriptionContent.value.scrollHeight > 200;
});

/**
 * Checks if current series is in saved collection
 * @returns {boolean} True if series is saved
 */
const isSaved = computed(() => 
  store.isSavedSeries(parseInt(route.params.id))
);

/**
 * Generates stats display data
 * @returns {Array} Array of stat objects with icons and values
 */
const stats = computed(() => [
  { icon: '📚', value: series.value?.comics?.available || 0, label: 'Comics' },
  { icon: '📖', value: series.value?.stories?.available || 0, label: 'Stories' },
  { icon: '🎭', value: series.value?.events?.available || 0, label: 'Events' },
  { icon: '👥', value: series.value?.characters?.available || 0, label: 'Characters' }
]);

/**
 * Tab Configuration
 */
const tabs = [
  { id: 'comics', label: 'Comics' },
  { id: 'stories', label: 'Stories' },
  { id: 'events', label: 'Events' },
  { id: 'characters', label: 'Characters' }
];

/**
 * Gets resource counts for each tab
 * @returns {Object} Counts indexed by resource type
 */
const resourceCounts = computed(() => {
  if (!series.value) return {};
  return {
    comics: series.value.comics?.available || 0,
    stories: series.value.stories?.available || 0,
    events: series.value.events?.available || 0,
    characters: series.value.characters?.available || 0
  };
});

/**
 * Gets paginated resources for current tab
 * @returns {Array} Slice of current resources for display
 */
const currentResources = computed(() => {
  if (!series.value || !series.value[currentTab.value]) return [];
  const items = series.value[currentTab.value].items || [];
  const start = (currentPage.value - 1) * itemsPerPage;
  return items.slice(start, start + itemsPerPage);
});

/**
 * Calculates total pages for pagination
 * @returns {number} Total number of pages
 */
const totalPages = computed(() => {
  if (!series.value || !series.value[currentTab.value]) return 0;
  return Math.ceil((series.value[currentTab.value].available || 0) / itemsPerPage);
});

/**
 * Methods
 */

/**
 * Loads series data and adds to viewed history
 */
const loadData = async () => {
  try {
    await store.fetchSeriesDetail(route.params.id);
    if (series.value) {
      store.addToViewed(series.value);
    }
  } catch (error) {
    console.error('Error loading series:', error);
  }
};

/**
 * Displays toast notification
 * @param {string} type - Notification type ('success', 'error', 'info')
 * @param {string} message - Notification message
 * @param {string} icon - Optional icon to display
 */
const showToast = (type, message, icon = '') => {
  notificationType.value = type;
  notificationMessage.value = message;
  notificationIcon.value = icon;
  showNotification.value = true;
};

// UI Event Handlers
const closeNotification = () => {
  showNotification.value = false;
};

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

/**
 * Handles saving/unsaving series with validation
 */
const handleSave = () => {
  if (!series.value) return;
  
  if (!isSaved.value && store.getSavedSeriesCount >= 10) {
    showToast('error', 'Maximum of 10 saved series reached', '⚠️');
    return;
  }
  
  const success = store.toggleSaved(series.value);
  if (success) {
    showToast(
      isSaved.value ? 'success' : 'info',
      isSaved.value ? 'Added to collection' : 'Removed from collection',
      isSaved.value ? '⭐' : '🗑️'
    );
  }
};

/**
 * Handler for resource click events
 * @param {Object} resource - Clicked resource data
 */
const handleResourceClick = (resource) => {
  console.log('Resource clicked:', resource);
};

/**
 * Pagination handlers
 */
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

/**
 * Modal handlers
 */
const openImageModal = () => {
  showImageModal.value = true;
};

const closeImageModal = () => {
  showImageModal.value = false;
};

/**
 * Lifecycle Hooks and Watchers
 */
onMounted(loadData);

// Watch for route changes to reload data
watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId) {
    currentPage.value = 1;
    currentTab.value = 'comics';
    loadData();
  }
});

// Reset pagination when changing tabs
watch(currentTab, () => {
  currentPage.value = 1;
});
</script>

<style scoped>

/**
 * Detail View Styles Index
 * Complete styling structure for Marvel series detail page

 * 1. Base Layout
 * - Main container and structural elements
 * - Background and spacing
 
 * 2. Notification System
 * - Toast notifications
 * - Success/Error/Info variants

 * 3. Modal Components
 * - Image viewer modal
 * - Overlay and controls

 * 4. Grid Layout
 * - Two-column structure
 * - Responsive grid system

 * 5. Image Components
 * - Series image display
 * - Hover overlays
 * - Action buttons

 * 6. Content Sections
 * - Series information
 * - Stats display
 * - Description panels

 * 7. Navigation Elements
 * - Tabs system
 * - Pagination controls

 * 8. Resource Display
 * - Related content grid
 * - Card components

 * 9. Animations
 * - Transitions
 * - Hover effects

 * 10. Responsive Design
 * - Breakpoints: 1200px, 1024px, 768px, 480px
 * - Mobile adaptations
 */

.detail-view {
  min-height: 100vh;
  background: #fafafa;
  padding: 2rem;
}

.toast-notification {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-width: 400px;
  width: calc(100% - 4rem);
  border: 1px solid #e0e0e0;
}

.toast-notification.success {
  border-left: 4px solid #4caf50;
}

.toast-notification.error {
  border-left: 4px solid #f44336;
}

.toast-notification.info {
  border-left: 4px solid #2196f3;
}

.toast-close {
  margin-left: auto;
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  color: #666;
}

.image-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  padding: 2rem;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.modal-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
}

.modal-close {
  position: absolute;
  top: -2rem;
  right: -2rem;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 2rem;
  position: relative;
  margin-top: 2rem;
}

.image-section {
  position: sticky;
  top: 2rem;
}

.image-container {
  position: relative;
  border: 2px solid #000;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
}

.image-container:hover {
  transform: translateY(-4px);
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.image-container:hover .image-overlay {
opacity: 1;
}

.series-image {
width: 100%;
height: auto;
aspect-ratio: 2/3;
object-fit: cover;
display: block;
transition: transform 0.3s ease;
}

.image-container:hover .series-image {
transform: scale(1.05);
}

.image-overlay {
position: absolute;
inset: 0;
background: linear-gradient(to bottom, 
  rgba(0, 0, 0, 0.3),
  rgba(0, 0, 0, 0.6)
);
opacity: 0;
transition: opacity 0.3s ease;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 1rem;
}

.save-button {
padding: 0.75rem 1.5rem;
background: white;
border: none;
border-radius: 6px;
font-weight: 600;
cursor: pointer;
display: flex;
align-items: center;
gap: 0.5rem;
transition: all 0.2s ease;
}

.save-button:hover {
transform: scale(1.05);
}

.save-button.is-saved {
background: #f44336;
color: white;
}

.zoom-button {
padding: 0.75rem 1.5rem;
background: white;
border: none;
border-radius: 6px;
font-weight: 600;
cursor: pointer;
display: flex;
align-items: center;
gap: 0.5rem;
transition: all 0.2s ease;
}

.zoom-button:hover {
transform: scale(1.05);
}

.stats-container {
  margin-top: 1.5rem;
  background: white;
  border: 2px solid #000;
  border-radius: 8px;
  overflow: hidden;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  gap: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s ease;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-item:hover {
  background-color: #f8f8f8;
}

.stat-icon {
  font-size: 1.25rem;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-value {
  font-weight: 600;
  font-size: 1rem;
  color: #000;
  min-width: 2.5rem;
}

.stat-label {
  color: #666;
  font-size: 0.875rem;
}

.content-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  border: 2px solid #000;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

.series-header {
margin-bottom: 2rem;
border-bottom: 2px solid #000;
padding-bottom: 1.5rem;
}

.series-title {
font-size: 2.5rem;
margin: 0 0 1rem 0;
color: #000;
font-weight: 700;
}

.series-meta {
display: flex;
gap: 1rem;
}

.year-range,
.status-badge {
padding: 0.5rem 1rem;
border-radius: 4px;
font-weight: 500;
font-size: 0.875rem;
}

.year-range {
background: #000;
color: white;
}

.status-badge {
background: #2196f3;
color: white;
}

/* About Section */
.about-section {
margin-bottom: 2rem;
}

.section-title {
font-size: 1.5rem;
font-weight: 600;
margin: 0 0 1.5rem 0;
color: #000;
}

.info-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 1.5rem;
margin-bottom: 2rem;
}

.info-item {
display: flex;
flex-direction: column;
gap: 0.5rem;
}

.info-item .label {
color: #666;
font-size: 0.875rem;
}

.info-item .value {
font-weight: 500;
color: #000;
}

.description-container {
position: relative;
}

.description-content {
max-height: 200px;
overflow: hidden;
transition: max-height 0.3s ease;
}

.description-content.expanded {
max-height: 1000px;
}

.description-text {
line-height: 1.7;
margin: 0;
color: #333;
}

.expand-button {
position: absolute;
bottom: 0;
left: 0;
right: 0;
padding: 1rem;
background: linear-gradient(transparent, white);
border: none;
color: #2196f3;
font-weight: 500;
cursor: pointer;
text-align: center;
}

.tabs-container {
display: flex;
gap: 1rem;
margin-bottom: 2rem;
border-bottom: 2px solid #000;
padding-bottom: 1rem;
overflow-x: auto;
scrollbar-width: none;
-ms-overflow-style: none;
}

.tabs-container::-webkit-scrollbar {
display: none;
}

.tab-button {
padding: 0.75rem 1.5rem;
background: none;
border: 2px solid #000;
border-radius: 6px;
font-weight: 500;
cursor: pointer;
transition: all 0.2s ease;
display: flex;
align-items: center;
gap: 0.5rem;
white-space: nowrap;
}

.tab-button.active {
background: #000;
color: white;
}

.tab-count {
background: rgba(255, 255, 255, 0.2);
padding: 0.25rem 0.75rem;
border-radius: 999px;
font-size: 0.875rem;
}

.resources-grid {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
gap: 1.5rem;
margin-bottom: 2rem;
margin: 2rem 0;
}

.resource-card {
background: white;
border: 1px solid #e0e0e0;
border-radius: 8px;
padding: 1.5rem;
cursor: pointer;
transition: all 0.2s ease;
}

.resource-card:hover {
transform: translateY(-4px);
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
border-color: #000;
}

.resource-title {
font-size: 1.1rem;
font-weight: 600;
margin: 0 0 0.75rem 0;
color: #000;
}

.resource-description {
color: #666;
font-size: 0.875rem;
line-height: 1.6;
margin: 0;
}

.pagination {
display: flex;
justify-content: center;
align-items: center;
gap: 1rem;
margin-top: 2rem;
}

.page-button {
padding: 0.75rem 1.5rem;
border: 2px solid #000;
background: white;
border-radius: 6px;
font-weight: 500;
cursor: pointer;
transition: all 0.2s ease;
}

.page-button:not(:disabled):hover {
background: #000;
color: white;
}

.page-button:disabled {
opacity: 0.5;
cursor: not-allowed;
border-color: #ccc;
}

.toast-enter-active,
.toast-leave-active {
transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
opacity: 0;
transform: translateY(30px) translateX(-50%);
}

.modal-enter-active,
.modal-leave-active {
transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
opacity: 0;
}

.resource-fade-enter-active,
.resource-fade-leave-active {
transition: all 0.3s ease;
}

.resource-fade-enter-from,
.resource-fade-leave-to {
opacity: 0;
transform: translateY(20px);
}

@media (max-width: 1200px) {
.content-wrapper {
  grid-template-columns: 320px 1fr;
  gap: 1.5rem;
}

.modal-content {
  max-width: 95vw;
}
}

@media (max-width: 1024px) {
.content-wrapper {
  grid-template-columns: 1fr;
}

.image-section {
  position: relative;
  top: 0;
  max-width: 400px;
  margin: 0 auto 2rem;
}

.toast-notification {
  width: calc(100% - 2rem);
}
}

@media (max-width: 768px) {
.detail-view {
  padding: 1rem;
}

.series-title {
  font-size: 2rem;
}

.modal-close {
  top: 1rem;
  right: 1rem;
}

.image-modal {
  padding: 1rem;
}

.toast-notification {
  max-width: 100%;
  margin: 0 1rem;
}

.info-grid {
  grid-template-columns: 1fr 1fr;
}
}

@media (max-width: 480px) {
.series-meta {
  flex-direction: column;
}

.info-grid {
  grid-template-columns: 1fr;
}

.stats-container {
  grid-template-columns: 1fr;
}

.resources-grid {
  grid-template-columns: 1fr;
}

.pagination {
  flex-direction: column;
}

.toast-notification {
  padding: 0.75rem;
  font-size: 0.875rem;
}

.modal-image {
  max-height: 85vh;
}

}
@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    padding: 0;
    width: 100%;
  }

  .content-section {
    padding: 1.5rem;
    margin: 0 auto;
    width: 100%;
  }

  .series-title {
    font-size: 1.75rem;
    word-wrap: break-word;
  }
}

@media (max-width: 768px) {
  .detail-view {
    padding: 1rem;
  }

  .content-section {
    padding: 1rem;
  }

  .series-header {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }

  .info-grid {
    gap: 1rem;
  }

  .resources-grid {
    grid-template-columns: 1fr;
  }

  .tab-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .detail-view {
    padding: 0.5rem;
  }
  

  .content-section {
    padding: 0.75rem;
    border-width: 1px;
  }
  
  .image-container{
    margin-top:30px;
  }

  .series-title {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .description-text {
    font-size: 0.9rem;
  }

  .resource-card {
    padding: 1rem;
  }

  .tabs-container {
    margin: 0 -0.75rem;
    padding: 0 0.75rem 1rem 0.75rem;
    -webkit-overflow-scrolling: touch;
  }
}
</style>