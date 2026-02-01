import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import './assets/main.css';
import { globalStore } from './stores/globalStore';

createApp(App).use(router).mount('#app');

// Register Service Worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('[App] Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('[App] Service Worker registration failed:', error);
      });
  });
}

// Listen for online/offline events
window.addEventListener('online', () => {
  console.log('[App] Back online');
  globalStore.setOffline(false);
});

window.addEventListener('offline', () => {
  console.log('[App] Gone offline');
  globalStore.setOffline(true);
});

// Set initial offline state
if (!navigator.onLine) {
  globalStore.setOffline(true);
}
