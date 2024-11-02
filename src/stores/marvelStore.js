// stores/marvelStore.js
import { defineStore } from "pinia";
import md5 from "crypto-js/md5";

export const useMarvelStore = defineStore("marvel", {
  state: () => ({
    series: [],
    seriesDetail: null,
    savedSeries: [],
    viewedSeries: [],

    characters: [],
    avatarCharacter: null,
    
    offset: 0,
    limit: 20,
    
    loading: false,
    error: null,
    
    searchQuery: "",
    selectedFilters: [],
  }),

  getters: {
    getSavedSeriesCount: (state) => state.savedSeries.length,
    getViewedSeriesCount: (state) => state.viewedSeries.length,
    
    getFilteredSeries: (state) => {
      if (!state.searchQuery) return state.series;
      
      return state.series.filter(series => 
        series.title.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
    
    isSavedSeries: (state) => (seriesId) => {
      return state.savedSeries.some(series => series.id === seriesId);
    },
    
    isViewedSeries: (state) => (seriesId) => {
      return state.viewedSeries.some(series => series.id === seriesId);
    }
  },

  actions: {
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

    async fetchRandomCharacter() {
      try {
        const randomOffset = Math.floor(Math.random() * 1500);
        const data = await this.makeMarvelRequest('characters', {
          limit: 1,
          offset: randomOffset
        });

        if (data.results.length > 0) {
          this.avatarCharacter = data.results[0];
        }
        
      } catch (error) {
        console.error("Error fetching random character:", error);
        this.avatarCharacter = null;
      }
    },

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

    addToViewed(series) {
      if (!this.viewedSeries.find(s => s.id === series.id)) {
        this.viewedSeries.push(series);
        this.updateLocalStorage();
      }
    },

    updateLocalStorage() {
      localStorage.setItem('marvel-saved-series', JSON.stringify(this.savedSeries));
      localStorage.setItem('marvel-viewed-series', JSON.stringify(this.viewedSeries));
    },

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

    clearError() {
      this.error = null;
    },

    resetStore() {
      this.series = [];
      this.offset = 0;
      this.loading = false;
      this.error = null;
      this.searchQuery = "";
      this.selectedFilters = [];
    },
    
    clearSeriesDetail() {
      this.seriesDetail = null;
      this.loading = false;
      this.error = null;
    },
  }
});