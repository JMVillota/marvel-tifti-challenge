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
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
.footer {
  background-color: #000000;
  color: #fff;
  padding: 20px 0;
  width: 100%;
  margin-top: auto;
}

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

.copyright {
  font-size: 12px;
  color: #666;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-link {
  color: #666;
  text-decoration: none;
  font-size: 12px;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #ED1D24;
}

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