import { reactive, readonly, computed, watch } from 'vue';
import { stringify } from '@/utils/json';

const STORAGE_KEY = 'POSTER_CATALOGUE_CHECKOUT_BATCHES';

const batches = reactive(new Map());
const batchBeingEdited = reactive({ id: null });

function initializeBatches() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    for (const [batchId, batch] of Object.entries(parsed)) {
      // Reconstruct nested Maps for items
      const itemsMap = {};
      for (const [pdfName, posters] of Object.entries(batch.items)) {
        itemsMap[pdfName] = posters;
      }
      batches.set(batchId, { ...batch, items: itemsMap });
    }
  }
}

function generateId() {
  return `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Add a new batch from the current cart
 * @param {string} size - Size slug
 * @param {string} material - Material slug
 * @param {Object} cartSnapshot - Deep copy of cart items with poster metadata
 * @param {Object} categoryLookup - Map of pdfName -> categoryName
 */
function addBatch(size, material, cartSnapshot, categoryLookup) {
  const batchId = generateId();

  // Calculate summary
  let totalUniquePosters = 0;
  let totalPosterCount = 0;
  const categoryBreakdown = {};

  for (const [pdfName, posters] of Object.entries(cartSnapshot)) {
    const categoryName = categoryLookup[pdfName] || 'Unknown';

    if (!categoryBreakdown[categoryName]) {
      categoryBreakdown[categoryName] = { count: 0, pdfs: {} };
    }

    let pdfCount = 0;
    for (const posterData of Object.values(posters)) {
      totalUniquePosters++;
      totalPosterCount += posterData.qty;
      pdfCount += posterData.qty;
    }

    categoryBreakdown[categoryName].count += pdfCount;
    categoryBreakdown[categoryName].pdfs[pdfName] = pdfCount;
  }

  const batch = {
    id: batchId,
    createdAt: Date.now(),
    size,
    material,
    items: cartSnapshot,
    summary: {
      totalUniquePosters,
      totalPosterCount,
      categoryBreakdown,
    },
  };

  batches.set(batchId, batch);
  return batchId;
}

function deleteBatch(batchId) {
  batches.delete(batchId);
}

function getBatch(batchId) {
  return batches.get(batchId);
}

/**
 * Load batch items back to cart for editing
 * @param {string} batchId
 * @returns {Object|null} The batch items to restore, or null if not found
 */
function loadBatchForEdit(batchId) {
  const batch = batches.get(batchId);
  if (!batch) return null;

  batchBeingEdited.id = batchId;
  return batch.items;
}

function finishEditing() {
  if (batchBeingEdited.id) {
    batches.delete(batchBeingEdited.id);
    batchBeingEdited.id = null;
  }
}

function cancelEditing() {
  batchBeingEdited.id = null;
}

function clearBatches() {
  batches.clear();
  batchBeingEdited.id = null;
}

const allBatches = computed(() => {
  return Array.from(batches.values()).sort((a, b) => a.createdAt - b.createdAt);
});

const grandSummary = computed(() => {
  let totalBatches = batches.size;
  let totalUniquePosters = 0;
  let totalPosterCount = 0;

  for (const batch of batches.values()) {
    totalUniquePosters += batch.summary.totalUniquePosters || 0;
    totalPosterCount += batch.summary.totalPosterCount || 0;
  }

  return { totalBatches, totalUniquePosters, totalPosterCount };
});

// Persist to localStorage
watch(
  batches,
  newBatches => {
    localStorage.setItem(STORAGE_KEY, stringify(newBatches));
  },
  { deep: true },
);

initializeBatches();

export const checkoutStore = {
  batches: readonly(batches),
  batchBeingEdited: readonly(batchBeingEdited),
  allBatches,
  grandSummary,
  addBatch,
  deleteBatch,
  getBatch,
  loadBatchForEdit,
  finishEditing,
  cancelEditing,
  clearBatches,
};
