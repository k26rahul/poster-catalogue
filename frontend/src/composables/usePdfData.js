import { ref } from 'vue';
import { http } from '@/utils/fetch';

const pdfCache = new Map();

const pdfData = ref(null);
const isLoading = ref(false);
const error = ref(null);

let fetchPromise = null;

async function fetchPdf(pdfId) {
  if (!pdfId) return;

  // cached
  if (pdfCache.has(pdfId)) {
    pdfData.value = pdfCache.get(pdfId);
    return;
  }

  if (fetchPromise) return fetchPromise;

  isLoading.value = true;

  fetchPromise = (async () => {
    try {
      const data = await http.get(`/pdfs-data/${pdfId}.json`);
      pdfCache.set(pdfId, data);
      pdfData.value = data;
    } catch (e) {
      error.value = e.message || String(e);
    } finally {
      isLoading.value = false;
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

export function usePdfData() {
  return {
    pdfData,
    isLoading,
    error,
    fetchPdf,
  };
}
