<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { pdfStore, cartStore, checkoutStore } from '@/stores';
import { SIZES, MATERIALS } from '@/config/posterOptions';
import { Icon } from '@iconify/vue';
import QuantitySelector from '@/components/QuantitySelector.vue';

const router = useRouter();

const { pdfs, categories, fetchMetadata } = pdfStore;
const { cart, clearCart, getCartSnapshot } = cartStore;
const { addBatch, allBatches } = checkoutStore;

const selectedSize = ref('');
const selectedMaterial = ref('');

// Build category lookup from pdfStore
const categoryLookup = computed(() => {
  const lookup = {};
  for (const [catName, cat] of categories.entries()) {
    for (const pdfName of cat.pdfs) {
      lookup[pdfName] = catName;
    }
  }
  return lookup;
});

// Get cart items grouped by category then PDF
const cartByCategory = computed(() => {
  const result = {};

  for (const [pdfName, posters] of cart.entries()) {
    const catName = categoryLookup.value[pdfName] || 'Unknown';
    const pdfData = pdfs.get(pdfName);

    if (!result[catName]) {
      result[catName] = { uniqueCount: 0, totalCount: 0, pdfs: {} };
    }

    if (!result[catName].pdfs[pdfName]) {
      result[catName].pdfs[pdfName] = {
        readableName: pdfData?.readableName || pdfName,
        posters: [],
        uniqueCount: 0,
        totalCount: 0,
      };
    }

    for (const [posterId, cartItem] of posters.entries()) {
      const posterData = pdfData?.posters?.find(p => p.id === posterId);

      result[catName].pdfs[pdfName].posters.push({
        id: posterId,
        pdfName,
        code: posterData?.code || '',
        imageFile: posterData?.imageFile || '',
        qty: cartItem.qty,
      });

      result[catName].pdfs[pdfName].uniqueCount++;
      result[catName].pdfs[pdfName].totalCount += cartItem.qty;
      result[catName].uniqueCount++;
      result[catName].totalCount += cartItem.qty;
    }
  }

  return result;
});

// Summary statistics
const summary = computed(() => {
  let totalCategories = 0;
  let totalUniquePosters = 0;
  let totalPosterCount = 0;

  for (const catData of Object.values(cartByCategory.value)) {
    totalCategories++;
    for (const pdfData of Object.values(catData.pdfs)) {
      totalUniquePosters += pdfData.posters.length;
      totalPosterCount += pdfData.totalCount;
    }
  }

  return { totalCategories, totalUniquePosters, totalPosterCount };
});

const isCartEmpty = computed(() => cart.size === 0);
const canAddToCheckout = computed(() => {
  return !isCartEmpty.value && selectedSize.value && selectedMaterial.value;
});

function handleAddToCheckout() {
  if (!canAddToCheckout.value) return;

  const snapshot = getCartSnapshot(pdfStore);
  addBatch(selectedSize.value, selectedMaterial.value, snapshot, categoryLookup.value);
  clearCart();
  selectedSize.value = '';
  selectedMaterial.value = '';
}

function handleClearCart() {
  if (confirm('Are you sure you want to clear the entire cart?')) {
    clearCart();
  }
}

function goToCheckout() {
  router.push('/checkout');
}

function getImageUrl(imageFile) {
  return `/poster-images/${imageFile}`;
}

onMounted(() => {
  fetchMetadata();
});
</script>

<template>
  <div class="cart-view">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <h1>Cart</h1>
        <p>Configure size and material for this batch</p>
      </div>
      <div class="header-badges">
        <span class="badge" v-if="allBatches.length > 0">
          {{ allBatches.length }} batch{{ allBatches.length > 1 ? 'es' : '' }} pending
        </span>
      </div>
    </header>

    <!-- Empty State -->
    <div v-if="isCartEmpty" class="empty-state">
      <Icon icon="mdi:cart-outline" class="empty-icon" />
      <h2>Your cart is empty</h2>
      <p>Browse posters and add them to your cart</p>
      <button class="btn btn--primary" @click="router.push('/')">
        <Icon icon="mdi:home" />
        Browse Posters
      </button>
    </div>

    <!-- Cart Content -->
    <template v-else>
      <!-- Batch Configuration -->
      <section class="batch-config">
        <h2>Batch Configuration</h2>
        <div class="config-row">
          <div class="config-field">
            <label for="size-select">Size</label>
            <select id="size-select" v-model="selectedSize">
              <option value="" disabled>Select size...</option>
              <option v-for="size in SIZES" :key="size.slug" :value="size.slug">
                {{ size.label }}
              </option>
            </select>
          </div>
          <div class="config-field">
            <label for="material-select">Material</label>
            <select id="material-select" v-model="selectedMaterial">
              <option value="" disabled>Select material...</option>
              <option
                v-for="material in MATERIALS"
                :key="material.slug"
                :value="material.slug"
              >
                {{ material.label }}
              </option>
            </select>
          </div>
          <button
            class="btn btn--primary add-batch-btn"
            :disabled="!canAddToCheckout"
            @click="handleAddToCheckout"
          >
            <Icon icon="mdi:plus" />
            Add to Checkout
          </button>
        </div>
      </section>

      <!-- Summary Section -->
      <section class="summary-section">
        <div class="summary-header">
          <h2>Summary</h2>
          <div class="summary-badges">
            <span class="badge">{{ summary.totalCategories }} categories</span>
            <span class="badge"
              >{{ summary.totalUniquePosters }} (~{{ summary.totalPosterCount }})</span
            >
          </div>
        </div>

        <div class="category-list">
          <div
            v-for="(catData, catName) in cartByCategory"
            :key="catName"
            class="category-card"
          >
            <span class="category-name">{{ catName }}</span>
            <span class="category-count"
              >{{ catData.uniqueCount }}
              <span class="count-total">(~{{ catData.totalCount }})</span></span
            >
          </div>
        </div>
      </section>

      <!-- Cart Items Grid -->
      <section class="cart-items-section">
        <div
          v-for="(catData, catName) in cartByCategory"
          :key="catName"
          class="category-group"
        >
          <h3 class="category-header">{{ catName }}</h3>

          <div
            v-for="(pdfData, pdfName) in catData.pdfs"
            :key="pdfName"
            class="pdf-group"
          >
            <div class="pdf-header">
              <span class="pdf-title">{{ pdfData.readableName }}</span>
              <span class="badge"
                >{{ pdfData.uniqueCount }} (~{{ pdfData.totalCount }})</span
              >
            </div>

            <div class="poster-grid">
              <div v-for="poster in pdfData.posters" :key="poster.id" class="poster-item">
                <div class="poster-image-wrapper">
                  <img
                    :src="getImageUrl(poster.imageFile)"
                    :alt="poster.code"
                    class="poster-image"
                    loading="lazy"
                  />
                </div>
                <div class="poster-info">
                  <span class="poster-code">{{ poster.code }}</span>
                  <QuantitySelector
                    :posterId="poster.id"
                    :pdfName="poster.pdfName"
                    variant="compact"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Action Bar -->
      <section class="action-bar">
        <button class="btn btn--danger" @click="handleClearCart">
          <Icon icon="mdi:trash-can-outline" />
          Clear Cart
        </button>
        <button class="btn btn--primary" @click="goToCheckout">
          <Icon icon="mdi:check-all" />
          Proceed to Checkout
          <span v-if="allBatches.length > 0" class="batch-count">
            ({{ allBatches.length }})
          </span>
        </button>
      </section>
    </template>
  </div>
</template>

<style scoped>
.cart-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-lg);
  padding: var(--space-lg);
  background: linear-gradient(135deg, var(--bg-4) 0%, var(--bg-accent-subtle) 100%);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-2);
}

.header-content h1 {
  margin-bottom: var(--space-xs);
}

.header-content p {
  font-size: 0.875rem;
}

.header-badges {
  display: flex;
  gap: var(--space-sm);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  padding: var(--space-3xl);
  background: var(--bg-4);
  border: 1px solid var(--border-2);
  border-radius: var(--radius-lg);
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  color: var(--text-3);
}

.empty-state h2 {
  color: var(--text-2);
}

.empty-state p {
  color: var(--text-3);
}

/* Batch Configuration */
.batch-config {
  padding: var(--space-lg);
  background: var(--bg-4);
  border: 1px solid var(--border-2);
  border-radius: var(--radius-lg);
}

.batch-config h2 {
  margin-bottom: var(--space-lg);
  font-size: 1rem;
}

.config-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--space-lg);
}

.config-field {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 180px;
  gap: var(--space-sm);
}

.config-field label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-3);
}

.config-field select {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--border-1);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  background: var(--bg-3);
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.config-field select:focus {
  border-color: var(--accent);
  outline: none;
}

.add-batch-btn {
  flex-shrink: 0;
}

.add-batch-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Summary Section */
.summary-section {
  padding: var(--space-lg);
  background: var(--bg-4);
  border: 1px solid var(--border-2);
  border-radius: var(--radius-lg);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.summary-header h2 {
  font-size: 1rem;
}

.summary-badges {
  display: flex;
  gap: var(--space-sm);
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.category-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-3);
  border: 1px solid var(--border-3);
  border-radius: var(--radius-md);
}

.category-name {
  font-weight: 500;
  color: var(--text-2);
}

.category-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--accent);
}

.count-total {
  font-weight: 400;
  color: var(--text-3);
}

/* Cart Items */
.cart-items-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.category-group {
  background: var(--bg-4);
  border: 1px solid var(--border-2);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.category-header {
  padding: var(--space-lg);
  background: linear-gradient(135deg, var(--bg-3) 0%, var(--bg-accent-subtle) 100%);
  border-bottom: 1px solid var(--border-2);
}

.pdf-group {
  padding: var(--space-lg);
  border-bottom: 1px solid var(--border-3);
}

.pdf-group:last-child {
  border-bottom: none;
}

.pdf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.pdf-title {
  font-weight: 500;
  color: var(--text-2);
}

.poster-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--space-md);
}

.poster-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: var(--bg-3);
  border-radius: var(--radius-md);
}

.poster-image-wrapper {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: var(--radius-sm);
}

.poster-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
}

.poster-code {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-3);
  text-align: center;
}

/* Action Bar */
.action-bar {
  display: flex;
  justify-content: space-between;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--bg-4);
  border: 1px solid var(--border-2);
  border-radius: var(--radius-lg);
}

.btn--danger {
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.btn--danger:hover {
  background: var(--color-danger);
  color: var(--text-inverse);
}

.batch-count {
  margin-left: var(--space-xs);
}

/* Responsive */
@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
  }

  .config-row {
    flex-direction: column;
  }

  .config-field {
    width: 100%;
  }

  .add-batch-btn {
    width: 100%;
  }

  .action-bar {
    flex-direction: column;
  }

  .action-bar .btn {
    width: 100%;
    justify-content: center;
  }

  .poster-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}
</style>
