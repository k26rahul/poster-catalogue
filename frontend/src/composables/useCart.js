import { ref, watch } from 'vue';

const STORAGE_KEY = 'POSTER_CATALOGUE_CART_DATA';

const cart = ref(new Map());

function initializeCart() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      cart.value = new Map(data.map(([pdfId, postersArray]) => [pdfId, new Map(postersArray)]));
    } catch (e) {
      cart.value = new Map();
    }
  }
}

function addPoster(pdfId, poster) {
  if (!cart.value.has(pdfId)) {
    cart.value.set(pdfId, new Map());
  }
  const postersMap = cart.value.get(pdfId);
  const current = postersMap.get(poster.code) || { ...poster, quantity: 0 };
  current.quantity += 1;
  postersMap.set(poster.code, current);
}

function removePoster(pdfId, posterCode) {
  if (cart.value.has(pdfId)) {
    const postersMap = cart.value.get(pdfId);
    const poster = postersMap.get(posterCode);
    if (poster) {
      if (poster.quantity > 1) {
        poster.quantity -= 1;
      } else {
        postersMap.delete(posterCode);
      }
    }
    if (postersMap.size === 0) {
      cart.value.delete(pdfId);
    }
  }
}

function getCartForPdf(pdfId) {
  const postersMap = cart.value.get(pdfId);
  return postersMap ? Array.from(postersMap.values()) : [];
}

function clearCart() {
  cart.value.clear();
}

watch(
  cart,
  newCart => {
    const serialized = Array.from(newCart).map(([pdfId, postersMap]) => [
      pdfId,
      Array.from(postersMap),
    ]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  },
  { deep: true }
);

initializeCart();

export function useCart() {
  return {
    cart,
    addPoster,
    removePoster,
    getCartForPdf,
    clearCart,
  };
}
