// stores/marvelStore.js
import { defineStore } from "pinia";
import md5 from "crypto-js/md5";

/**
 * Marvel Store - Manages the state and operations for Marvel series and characters
 * using Pinia for state management.
 * 
 * @store marvel
 */
export const useMarvelStore = defineStore("marvel", {
  /**
   * State - Defines the store's reactive state properties
   * @returns {Object} Initial state
   */
  state: () => ({
    series: [],              // List of Marvel series
    seriesDetail: null,      // Currently selected series details
    savedSeries: [],         // User's saved series (max 10)
    viewedSeries: [],        // User's viewing history
    
    characters: [],          // List of Marvel characters
    avatarCharacter: null,   // Random character for avatar display
    
    offset: 0,               // Pagination offset
    limit: 20,               // Items per page limit
    
    loading: false,          // Global loading state
    error: null,             // Global error state
    
    searchQuery: "",         // Current search query
    selectedFilters: [],     // Applied filters
  }),

  /**
   * Getters - Computed state properties
   */
  getters: {
    /**
     * Get the count of saved series
     * @returns {number} Number of saved series
     */
    getSavedSeriesCount: (state) => state.savedSeries.length,

    /**
     * Get the count of viewed series
     * @returns {number} Number of viewed series
     */
    getViewedSeriesCount: (state) => state.viewedSeries.length,
    
    /**
     * Get series filtered by search query
     * @returns {Array} Filtered series list
     */
    getFilteredSeries: (state) => {
      if (!state.searchQuery) return state.series;
      
      return state.series.filter(series => 
        series.title.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
    
    /**
     * Check if a series is saved
     * @param {number} seriesId - The ID of the series to check
     * @returns {boolean} Whether the series is saved
     */
    isSavedSeries: (state) => (seriesId) => {
      return state.savedSeries.some(series => series.id === seriesId);
    },
    
    /**
     * Check if a series has been viewed
     * @param {number} seriesId - The ID of the series to check
     * @returns {boolean} Whether the series has been viewed
     */
    isViewedSeries: (state) => (seriesId) => {
      return state.viewedSeries.some(series => series.id === seriesId);
    }
  },

  actions: {
    /**
     * Generates Marvel API authentication parameters
     * @throws {Error} If API keys are not configured
     * @returns {Object} Authentication parameters
     */
    generateMarvelAuth() {
      const timestamp = Date.now();
      const publicKey = process.env.VUE_APP_MARVEL_PUBLIC_KEY;
      const privateKey = process.env.VUE_APP_MARVEL_PRIVATE_KEY;

      if (!publicKey || !privateKey) {
        throw new Error("Marvel API keys are not configured. Check your .env file.");
      }

      const hash = md5(timestamp + privateKey + publicKey).toString();
      
      return { timestamp, publicKey, hash };
    },

    /**
     * Makes an authenticated request to the Marvel API
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} API response data
     * @throws {Error} If the API request fails
     */
    async makeMarvelRequest(endpoint, params = {}) {
      try {
        const { timestamp, publicKey, hash } = this.generateMarvelAuth();
        
        const queryParams = new URLSearchParams({
          ts: timestamp,
          apikey: publicKey,
          hash: hash,
          ...params
        });

        const response = await fetch(
          `https://gateway.marvel.com/v1/public/${endpoint}?${queryParams}`
        );

        if (!response.ok) {
          throw new Error(`Marvel API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.data;

      } catch (error) {
        this.error = error.message;
        console.error("Marvel API Request Error:", error);
        throw error;
      }
    },

    /**
     * Fetches series with pagination
     * @returns {Promise<void>}
     */
    async fetchSeries() {
      if (this.loading) return;
      
      try {
        this.loading = true;
        const data = await this.makeMarvelRequest('series', {
          offset: this.offset,
          limit: this.limit
        });
        
        this.series = [...this.series, ...data.results];
        this.offset += this.limit;
        
      } catch (error) {
        this.error = `Error fetching series: ${error.message}`;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetches details for a specific series
     * @param {number} id - Series ID
     * @returns {Promise<Object|null>} Series details or null if error
     */
    async fetchSeriesDetail(id) {
      try {
        this.loading = true;
        const data = await this.makeMarvelRequest(`series/${id}`);
        this.seriesDetail = data.results[0];
        return this.seriesDetail;
        
      } catch (error) {
        this.error = `Error fetching series detail: ${error.message}`;
        return null;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Searches series by title
     * @param {string} query - Search query
     * @returns {Promise<void>}
     */
    async searchSeries(query) {
      try {
        this.loading = true;
        this.searchQuery = query;
        this.offset = 0;
        this.series = [];
        
        if (!query) {
          await this.fetchSeries();
          return;
        }

        const data = await this.makeMarvelRequest('series', {
          titleStartsWith: query,
          limit: this.limit
        });
        
        this.series = data.results;
        
      } catch (error) {
        this.error = `Error searching series: ${error.message}`;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetches a random character with image for avatar
     * @returns {Promise<void>}
     */
    async fetchRandomCharacter() {
      try {
        const maxAttempts = 5; // Prevent infinite loops
        let attempts = 0;
        
        while (attempts < maxAttempts) {
          const randomOffset = Math.floor(Math.random() * 1500);
          const data = await this.makeMarvelRequest('characters', {
            limit: 1,
            offset: randomOffset
          });

          if (data.results.length > 0) {
            const character = data.results[0];
            // Check if character has a valid image
            if (character.thumbnail && 
                character.thumbnail.path && 
                !character.thumbnail.path.includes('image_not_available')) {
              this.avatarCharacter = character;
              break;
            }
          }
          attempts++;
        }
        
        if (!this.avatarCharacter) {
          throw new Error("Could not find character with valid image");
        }
        
      } catch (error) {
        console.error("Error fetching random character:", error);
        this.avatarCharacter = null;
      }
    },

    /**
     * Toggles a series as saved/unsaved
     * @param {Object} series - Series to toggle
     * @returns {boolean} Success status
     */
    toggleSaved(series) {
      const index = this.savedSeries.findIndex(s => s.id === series.id);
      
      if (index === -1) {
        if (this.savedSeries.length >= 10) {
          return false;
        }
        this.savedSeries.push(series);
      } else {
        this.savedSeries.splice(index, 1);
      }
      
      this.updateLocalStorage();
      return true;
    },

    /**
     * Adds a series to viewing history
     * @param {Object} series - Series to add to history
     */
    addToViewed(series) {
      if (!this.viewedSeries.find(s => s.id === series.id)) {
        this.viewedSeries.push(series);
        this.updateLocalStorage();
      }
    },

    /**
     * Updates localStorage with current state
     */
    updateLocalStorage() {
      localStorage.setItem('marvel-saved-series', JSON.stringify(this.savedSeries));
      localStorage.setItem('marvel-viewed-series', JSON.stringify(this.viewedSeries));
    },

    /**
     * Loads saved state from localStorage
     */
    loadFromLocalStorage() {
      try {
        const savedSeries = localStorage.getItem('marvel-saved-series');
        const viewedSeries = localStorage.getItem('marvel-viewed-series');
        
        if (savedSeries) this.savedSeries = JSON.parse(savedSeries);
        if (viewedSeries) this.viewedSeries = JSON.parse(viewedSeries);
        
      } catch (error) {
        console.error("Error loading from localStorage:", error);
      }
    },

    /**
     * Clears current error state
     */
    clearError() {
      this.error = null;
    },

    /**
     * Resets store to initial state
     */
    resetStore() {
      this.series = [];
      this.offset = 0;
      this.loading = false;
      this.error = null;
      this.searchQuery = "";
      this.selectedFilters = [];
    },
    
    /**
     * Clears series detail state
     */
    clearSeriesDetail() {
      this.seriesDetail = null;
      this.loading = false;
      this.error = null;
    },
  }
});