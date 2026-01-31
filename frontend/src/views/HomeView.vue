<script setup>
import { ref, reactive, onMounted, onUpdated } from 'vue';
import { pdfStore } from '@/stores';
import PdfCard from '@/components/PdfCard.vue';

const { fetchMetadata, categories, pdfs } = pdfStore;

const categoryStates = reactive({});
const shouldExpandAll = ref(true);

function toggleAll() {
  const newState = shouldExpandAll.value;
  for (const category of categories.values()) {
    categoryStates[category.name] = newState;
  }
  shouldExpandAll.value = !newState;
}

function onToggle(event, categoryName) {
  categoryStates[categoryName] = event.target.open;
}

onMounted(() => {
  console.log('HomeView mounted');
  fetchMetadata();
});

onUpdated(() => {
  console.log('HomeView updated');
});
</script>

<template>
  <div class="home-view">
    <!-- Page Header -->
    <header class="page-header">
      <div class="header-content">
        <h1>Poster Catalogue</h1>
        <p>Browse our collection of spiritual and modern posters</p>
      </div>
      <button class="btn" @click="toggleAll">
        {{ shouldExpandAll ? 'Expand All' : 'Collapse All' }}
      </button>
    </header>

    <!-- Categories List -->
    <div class="categories-list">
      <details
        v-for="category in categories.values()"
        :key="category.name"
        :open="categoryStates[category.name]"
        @toggle="onToggle($event, category.name)"
        class="category-section"
      >
        <summary>
          <span class="category-title">{{ category.name }}</span>
          <span class="category-meta">
            <span class="badge">{{ category.pdfs.length }} PDFs</span>
          </span>
        </summary>

        <div class="category-content">
          <p class="category-description">{{ category.description }}</p>

          <div class="pdf-cards-grid">
            <PdfCard
              v-for="pdfName in category.pdfs"
              :key="pdfName"
              :pdf="pdfs.get(pdfName)"
            />
          </div>
        </div>
      </details>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

/* Page Header */
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

/* Categories */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.category-section summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-title {
  flex: 1;
}

.category-meta {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-right: var(--space-md);
}

.category-content {
  padding: 0 var(--space-sm);
}

.category-description {
  margin-bottom: var(--space-lg);
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-3);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--accent);
  font-size: 0.875rem;
}

/* PDF Cards Grid */
.pdf-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-lg);
  justify-items: center;
}

@media (min-width: 40rem) {
  .pdf-cards-grid {
    justify-items: start;
  }
}

@media (max-width: 480px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .page-header .btn {
    align-self: flex-end;
  }
}
</style>
