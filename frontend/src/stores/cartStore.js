import { reactive, readonly, watch } from 'vue';
import { stringify } from '@/utils/json';

const STORAGE_KEY = 'POSTER_CATALOGUE_CART_DATA';

const cart = reactive(new Map());

function initializeCart() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);

    for (const [pdfName, posters] of Object.entries(parsed)) {
      cart.set(pdfName, new Map(Object.entries(posters)));
    }
  }
}

function addPoster(pdfName, posterId) {
  if (!cart.has(pdfName)) {
    cart.set(pdfName, new Map());
  }
  const postersInPdf = cart.get(pdfName);

  if (postersInPdf.has(posterId)) {
    const poster = postersInPdf.get(posterId);
    poster.qty++;
    poster.addedAt = Date.now();
  } else {
    postersInPdf.set(posterId, {
      qty: 1,
      addedAt: Date.now(),
    });
  }
}

function removePoster(pdfName, posterId) {
  const postersInPdf = cart.get(pdfName);
  const poster = postersInPdf.get(posterId);

  poster.qty--;

  if (poster.qty <= 0) {
    postersInPdf.delete(posterId);
  }

  if (postersInPdf.size === 0) {
    cart.delete(pdfName);
  }
}

function clearCart() {
  cart.clear();
}

/**
 * Get a deep snapshot of cart items with poster metadata for batch creation
 * @param {Object} pdfStore - The PDF store to lookup poster data
 * @returns {Object} Snapshot of cart items with poster metadata
 */
function getCartSnapshot(pdfStore) {
  const snapshot = {};

  for (const [pdfName, posters] of cart.entries()) {
    const pdfData = pdfStore.pdfs.get(pdfName);
    if (!pdfData) continue;

    snapshot[pdfName] = {};

    for (const [posterId, cartItem] of posters.entries()) {
      const posterData = pdfData.posters?.find(p => p.id === posterId);

      snapshot[pdfName][posterId] = {
        qty: cartItem.qty,
        addedAt: cartItem.addedAt,
        code: posterData?.code || '',
        imageFile: posterData?.imageFile || '',
      };
    }
  }

  return snapshot;
}

/**
 * Restore cart from batch items (for editing a batch)
 * @param {Object} batchItems - The batch items to restore
 */
function restoreFromBatch(batchItems) {
  cart.clear();

  for (const [pdfName, posters] of Object.entries(batchItems)) {
    const postersMap = new Map();

    for (const [posterId, posterData] of Object.entries(posters)) {
      postersMap.set(posterId, {
        qty: posterData.qty,
        addedAt: posterData.addedAt,
      });
    }

    cart.set(pdfName, postersMap);
  }
}

watch(
  cart,
  newCart => {
    localStorage.setItem(STORAGE_KEY, stringify(newCart));
  },
  { deep: true },
);

initializeCart();

export const cartStore = {
  cart: readonly(cart),
  addPoster,
  removePoster,
  clearCart,
  getCartSnapshot,
  restoreFromBatch,
};
