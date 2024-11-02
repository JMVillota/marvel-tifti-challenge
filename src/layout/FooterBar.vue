<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="copyright">
        Data provided by Marvel. © {{ currentYear }} MARVEL
      </div>
      <div class="footer-links">
        <a href="#" class="footer-link">Terms</a>
        <a href="#" class="footer-link">Privacy</a>
        <a href="#" class="footer-link">API</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
/**
 * Footer Component
 * Simple footer component displaying Marvel copyright and legal links
 */
import { ref } from 'vue'

// Dynamic current year for copyright notice
const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
/**
 * Scoped CSS Implementation
 * Vue's scoped CSS feature ensures styles only apply to this component
 * This follows the requirement of creating isolated component styles
 * without depending on external CSS frameworks
 *
 * How scoped works:
 * 1. Vue adds a unique data attribute to component elements
 * 2. CSS selectors are automatically prefixed with that attribute
 * 3. Styles cannot leak to child components
 * 4. Promotes better CSS encapsulation and maintainability
 */

/* Base footer layout */
.footer {
  background-color: #000000;
  color: #fff;
  padding: 20px 0;
  width: 100%;
  margin-top: auto; /* Pushes footer to bottom in flex layouts */
}

/* Container with max-width for content alignment */
.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

/* Typography styles */
.copyright {
  font-size: 12px;
  color: #666;
}

/* Navigation links container */
.footer-links {
  display: flex;
  gap: 20px;
}

/* Individual link styling */
.footer-link {
  color: #666;
  text-decoration: none;
  font-size: 12px;
  transition: color 0.3s ease;
}

/* Interactive state */
.footer-link:hover {
  color: #ED1D24; /* Marvel red */
}

/* Responsive design adjustments */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-links {
    justify-content: center;
  }
}
</style>