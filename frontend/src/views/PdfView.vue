<script setup>
import { ref, computed, onMounted, onUpdated, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { pdfStore, cartStore } from '@/stores';
import PosterCard from '@/components/PosterCard.vue';
import PosterModal from '@/components/PosterModal.vue';
import { Icon } from '@iconify/vue';

const route = useRoute();
const pdfName = route.params.pdfName;

const { pdfs, fetchPdf } = pdfStore;
const { cart } = cartStore;

const pdfData = computed(() => pdfs.get(pdfName));
const sortOrder = ref('sequential');
const viewDensity = ref('normal'); // 'normal' or 'compact'
const displayedPosters = ref([]);
const zoomedPoster = ref(null); // Track zoomed poster for modal
const posterRefs = ref({}); // Refs for scrolling to posters

function toggleZoom(poster) {
  zoomedPoster.value = poster;
}

function navigatePoster(poster) {
  zoomedPoster.value = poster;
}

function closeModal(lastViewedPoster) {
  zoomedPoster.value = null;

  // Scroll to the last viewed poster
  if (lastViewedPoster) {
    nextTick(() => {
      const posterElement = posterRefs.value[lastViewedPoster.id];
      if (posterElement) {
        posterElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
}

function setPosterRef(posterId, el) {
  if (el) {
    posterRefs.value[posterId] = el;
  }
}

function applySort() {
  const posters = [...pdfData.value.posters];

  if (sortOrder.value === 'selected') {
    const postersInCart = cart.get(pdfName);

    if (postersInCart?.size > 0) {
      const selectedPosters = [];
      const unselectedPosters = [];

      for (const poster of posters) {
        if (postersInCart.has(poster.id)) selectedPosters.push(poster);
        else unselectedPosters.push(poster);
      }

      displayedPosters.value = [...selectedPosters, ...unselectedPosters];
    }
  } else {
    // Sequential
    displayedPosters.value = posters;
  }
}

function setSortOrder(order) {
  sortOrder.value = order;
  applySort();
}

onMounted(async () => {
  console.log('PdfView mounted');
  await fetchPdf(pdfName);
  applySort();
});

onUpdated(() => {
  console.log('PdfView updated');
});
</script>

<template>
  <div class="pdf-view" v-if="pdfData">
    <!-- Header -->
    <header class="pdf-header">
      <div class="header-content">
        <h1>{{ pdfData.readableName }}</h1>
        <div class="header-meta">
          <span class="badge">{{ pdfData.totalPosters }} posters</span>
          <span class="badge">{{ pdfData.category }}</span>
        </div>
      </div>
    </header>

    <!-- Controls Bar -->
    <div class="controls-bar">
      <div class="controls-left">
        <span class="controls-label">Sort by:</span>
        <div class="sort-options">
          <button
            class="sort-btn"
            :class="{ active: sortOrder === 'sequential' }"
            @click="setSortOrder('sequential')"
          >
            Sequential
          </button>
          <button
            class="sort-btn"
            :class="{ active: sortOrder === 'selected' }"
            @click="setSortOrder('selected')"
          >
            Selected First
          </button>
        </div>
      </div>
      <div class="view-density-options">
        <button
          class="density-btn"
          :class="{ active: viewDensity === 'normal' }"
          @click="viewDensity = 'normal'"
          title="Normal view"
        >
          <Icon icon="mdi:view-grid-outline" />
        </button>
        <button
          class="density-btn"
          :class="{ active: viewDensity === 'compact' }"
          @click="viewDensity = 'compact'"
          title="Compact view"
        >
          <Icon icon="mdi:view-grid-compact" />
        </button>
      </div>
    </div>

    <!-- Poster Grid -->
    <div class="poster-grid" :class="{ compact: viewDensity === 'compact' }">
      <PosterCard
        v-for="(poster, index) in displayedPosters"
        :key="poster.id"
        :ref="el => setPosterRef(poster.id, el?.$el)"
        :poster="poster"
        :index="index + 1"
        @toggle-zoom="toggleZoom"
      />
    </div>

    <!-- Poster Modal -->
    <PosterModal
      :poster="zoomedPoster"
      :posters="displayedPosters"
      @close="closeModal"
      @navigate="navigatePoster"
    />
  </div>
</template>

<style scoped>
.pdf-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

/* Header */
.pdf-header {
  padding: var(--space-xl);
  background: linear-gradient(135deg, var(--bg-4) 0%, var(--bg-accent-subtle) 100%);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-2);
}

.header-content h1 {
  margin-bottom: var(--space-md);
  font-size: 1.5rem;
}

.header-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

/* Controls Bar */
.controls-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-4);
  border: 1px solid var(--border-2);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.controls-left {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.controls-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-3);
}

.sort-options {
  display: flex;
  gap: 2px;
  padding: 3px;
  background: var(--bg-1);
  border-radius: var(--radius-full);
}

.sort-btn {
  padding: var(--space-sm) var(--space-lg);
  border: none;
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-3);
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.sort-btn:hover {
  color: var(--text-1);
}

.sort-btn.active {
  color: var(--accent);
  background: var(--bg-4);
  box-shadow: var(--shadow-sm);
}

/* View Density Toggle */
.view-density-options {
  display: flex;
  gap: 2px;
  padding: 3px;
  background: var(--bg-1);
  border-radius: var(--radius-md);
}

.density-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm);
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-3);
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.density-btn:hover {
  color: var(--text-1);
}

.density-btn.active {
  color: var(--accent);
  background: var(--bg-4);
  box-shadow: var(--shadow-sm);
}

/* Poster Grid */
.poster-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-lg);
  justify-items: center;
}

.poster-grid.compact {
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--space-md);
}

@media (max-width: 480px) {
  .controls-bar {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-sm);
  }

  .controls-left {
    flex-direction: column;
    align-items: stretch;
  }

  .sort-options {
    justify-content: center;
  }

  .view-density-options {
    justify-content: center;
  }
}
</style>
