import { ref, readonly } from 'vue';

const isLoading = ref(false);
const error = ref(null);
const isOffline = ref(!navigator.onLine);

function startLoading() {
  isLoading.value = true;
  error.value = null;
}

function stopLoading() {
  isLoading.value = false;
}

function setError(e) {
  error.value = e.message || String(e);
  isLoading.value = false;
}

function clearError() {
  error.value = null;
}

function setOffline(offline) {
  isOffline.value = offline;
  if (offline) {
    error.value = '⚠️ You are offline. Some features may be unavailable.';
  } else {
    // Clear offline-related error when coming back online
    if (error.value && error.value.includes('offline')) {
      error.value = null;
    }
  }
}

export const globalStore = {
  isLoading: readonly(isLoading),
  error: readonly(error),
  isOffline: readonly(isOffline),
  startLoading,
  stopLoading,
  setError,
  clearError,
  setOffline,
};
