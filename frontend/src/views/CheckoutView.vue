<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { cartStore, checkoutStore } from '@/stores';
import { SIZES, MATERIALS } from '@/config/posterOptions';
import { Icon } from '@iconify/vue';

const router = useRouter();

const { clearCart, restoreFromBatch } = cartStore;
const {
  allBatches,
  grandSummary,
  deleteBatch,
  loadBatchForEdit,
  finishEditing,
  clearBatches,
} = checkoutStore;

const isEmpty = computed(() => allBatches.value.length === 0);

function getSizeLabel(slug) {
  return SIZES.find(s => s.slug === slug)?.label || slug;
}

function getMaterialLabel(slug) {
  return MATERIALS.find(m => m.slug === slug)?.label || slug;
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString();
}

function handleEditBatch(batchId) {
  const confirmMessage =
    'Current cart will be cleared and this batch will be loaded for editing. Continue?';
  if (!confirm(confirmMessage)) return;

  const batchItems = loadBatchForEdit(batchId);
  if (batchItems) {
    clearCart();
    restoreFromBatch(batchItems);
    finishEditing(); // Removes the batch
    router.push('/cart');
  }
}

function handleDeleteBatch(batchId) {
  if (!confirm('Are you sure you want to delete this batch?')) return;
  deleteBatch(batchId);
}

function handleFinalCommit() {
  const commitData = {
    batches: allBatches.value,
    grandSummary: grandSummary.value,
    committedAt: Date.now(),
  };

  console.log('=== FINAL COMMIT DATA ===');
  console.log(JSON.stringify(commitData, null, 2));
  console.log('=========================');

  alert('Checkout data logged to console. Check browser dev tools.');
}

function handleClearAllBatches() {
  if (!confirm('Are you sure you want to clear ALL batches? This cannot be undone.'))
    return;
  clearBatches();
}
</script>

<template>
  <div class="checkout-view">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <h1>Checkout</h1>
        <p>Review all batches before final commit</p>
      </div>
      <button class="btn" @click="router.push('/cart')">
        <Icon icon="mdi:cart" />
        Back to Cart
      </button>
    </header>

    <!-- Empty State -->
    <div v-if="isEmpty" class="empty-state">
      <Icon icon="mdi:package-variant" class="empty-icon" />
      <h2>No batches yet</h2>
      <p>Add items to your cart and create batches to proceed</p>
      <button class="btn btn--primary" @click="router.push('/cart')">
        <Icon icon="mdi:cart" />
        Go to Cart
      </button>
    </div>

    <!-- Checkout Content -->
    <template v-else>
      <!-- Grand Summary -->
      <section class="grand-summary">
        <h2>Order Summary</h2>
        <div class="summary-cards">
          <div class="summary-card">
            <span class="summary-value">{{ grandSummary.totalBatches }}</span>
            <span class="summary-label">Batches</span>
          </div>
          <div class="summary-card">
            <span class="summary-value"
              >{{ grandSummary.totalUniquePosters }}
              <span class="count-total"
                >(~{{ grandSummary.totalPosterCount }})</span
              ></span
            >
            <span class="summary-label">Posters</span>
          </div>
        </div>
      </section>

      <!-- Batches List -->
      <section class="batches-section">
        <h2>Batches</h2>

        <div class="batches-list">
          <div v-for="(batch, index) in allBatches" :key="batch.id" class="batch-card">
            <div class="batch-header">
              <div class="batch-title">
                <span class="batch-number">Batch #{{ index + 1 }}</span>
                <span class="batch-date">{{ formatDate(batch.createdAt) }}</span>
              </div>
              <div class="batch-config-badges">
                <span class="badge badge--size">{{ getSizeLabel(batch.size) }}</span>
                <span class="badge badge--material">{{
                  getMaterialLabel(batch.material)
                }}</span>
              </div>
            </div>

            <div class="batch-summary">
              <div class="batch-stat">
                <Icon icon="mdi:image-multiple" />
                <span
                  >{{ batch.summary.totalUniquePosters ?? '-' }}
                  <span class="count-total"
                    >(~{{ batch.summary.totalPosterCount ?? '-' }})</span
                  ></span
                >
              </div>
            </div>

            <!-- Category Breakdown -->
            <details class="batch-breakdown">
              <summary>
                <span>Category Breakdown</span>
              </summary>
              <div class="breakdown-content">
                <div
                  v-for="(catData, catName) in batch.summary.categoryBreakdown"
                  :key="catName"
                  class="breakdown-category"
                >
                  <div class="category-row">
                    <span class="category-name">{{ catName }}</span>
                    <span class="category-count"
                      >{{ catData.uniqueCount ?? '' }}
                      <span class="count-total"
                        >(~{{ catData.totalCount ?? catData.count ?? '-' }})</span
                      ></span
                    >
                  </div>
                </div>
              </div>
            </details>

            <div class="batch-actions">
              <button class="btn btn--small" @click="handleEditBatch(batch.id)">
                <Icon icon="mdi:pencil" />
                Edit
              </button>
              <button
                class="btn btn--small btn--danger"
                @click="handleDeleteBatch(batch.id)"
              >
                <Icon icon="mdi:trash-can-outline" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Final Actions -->
      <section class="final-actions">
        <button class="btn btn--danger" @click="handleClearAllBatches">
          <Icon icon="mdi:trash-can" />
          Clear All Batches
        </button>
        <button class="btn btn--primary btn--large" @click="handleFinalCommit">
          <Icon icon="mdi:check-bold" />
          Final Commit
        </button>
      </section>
    </template>
  </div>
</template>

<style scoped>
.checkout-view {
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

/* Grand Summary */
.grand-summary {
  padding: var(--space-lg);
  background: var(--bg-4);
  border: 1px solid var(--border-2);
  border-radius: var(--radius-lg);
}

.grand-summary h2 {
  margin-bottom: var(--space-lg);
  font-size: 1rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--space-md);
}

.summary-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-lg);
  background: linear-gradient(135deg, var(--bg-3) 0%, var(--bg-accent-subtle) 100%);
  border-radius: var(--radius-md);
}

.summary-value {
  font-size: 2rem;
  font-weight: 600;
  color: var(--accent);
}

.summary-label {
  font-size: 0.8125rem;
  color: var(--text-3);
}

/* Batches Section */
.batches-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.batches-section h2 {
  font-size: 1rem;
}

.batches-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.batch-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--bg-4);
  border: 1px solid var(--border-2);
  border-radius: var(--radius-lg);
}

.batch-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.batch-title {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.batch-number {
  font-size: 1.125rem;
  font-weight: 600;
}

.batch-date {
  font-size: 0.75rem;
  color: var(--text-3);
}

.batch-config-badges {
  display: flex;
  gap: var(--space-sm);
}

.badge--size {
  background: rgba(76, 175, 80, 0.1);
  color: var(--color-success);
}

.badge--material {
  background: rgba(255, 152, 0, 0.1);
  color: var(--color-warning);
}

.batch-summary {
  display: flex;
  gap: var(--space-lg);
}

.batch-stat {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 0.875rem;
  color: var(--text-2);
}

/* Batch Breakdown */
.batch-breakdown {
  border: 1px solid var(--border-3);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.batch-breakdown summary {
  padding: var(--space-md);
  background: var(--bg-3);
  font-size: 0.875rem;
  border: none;
  box-shadow: none;
}

.breakdown-content {
  padding: var(--space-md);
}

.breakdown-category {
  margin-bottom: var(--space-md);
}

.breakdown-category:last-child {
  margin-bottom: 0;
}

.category-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-sm) 0;
  font-weight: 500;
  border-bottom: 1px solid var(--border-3);
}

.category-name {
  color: var(--text-1);
}

.category-count {
  color: var(--accent);
}

.batch-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-3);
}

.btn--small {
  padding: var(--space-xs) var(--space-md);
  font-size: 0.75rem;
}

.btn--danger {
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.btn--danger:hover {
  background: var(--color-danger);
  color: var(--text-inverse);
}

/* Final Actions */
.final-actions {
  display: flex;
  justify-content: space-between;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--bg-4);
  border: 1px solid var(--border-2);
  border-radius: var(--radius-lg);
}

.btn--large {
  padding: var(--space-md) var(--space-xl);
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
  }

  .batch-header {
    flex-direction: column;
  }

  .batch-summary {
    flex-direction: column;
    gap: var(--space-sm);
  }

  .final-actions {
    flex-direction: column;
  }

  .final-actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
