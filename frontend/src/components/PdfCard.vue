<script setup>
import { useRouter } from 'vue-router';
import { useCarousel } from '@/composables/useCarousel';

const props = defineProps({
  pdf: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const posters = props.pdf.postersSample;
const {
  currentIndex: currentPosterIndex,
  currentItem: currentPoster,
  setIndex: onDotClick,
  onTouchStart,
  onTouchEnd,
} = useCarousel(posters);

const goToPdf = () => {
  router.push({
    name: 'pdf',
    params: {
      pdfName: props.pdf.name,
    },
  });
};
</script>

<template>
  <article
    class="pdf-card"
    :class="{ landscape: pdf.usedLandscapeForSample }"
    @click="goToPdf"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <!-- Image Container -->
    <div class="image-container">
      <img
        :key="currentPoster.id"
        :src="`/poster-images/${currentPoster.imageFile}`"
        :alt="currentPoster.id"
        :width="currentPoster.imageSize[0]"
        :height="currentPoster.imageSize[1]"
      />

      <!-- Poster Count Badge -->
      <span class="poster-count">{{ pdf.totalPosters }} posters</span>
    </div>

    <!-- Carousel Dots -->
    <div class="dots">
      <button
        class="dot"
        v-for="(_, i) in posters"
        :key="i"
        :class="{ active: i === currentPosterIndex }"
        @click.stop="onDotClick(i)"
        :aria-label="`Go to slide ${i + 1}`"
      />
    </div>

    <!-- Card Info -->
    <div class="card-info">
      <h3 class="pdf-name">{{ pdf.readableName }}</h3>
      <p class="pdf-meta">{{ pdf.category }}</p>
    </div>
  </article>
</template>

<style scoped>
.pdf-card {
  width: 100%;
  max-width: 320px;
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-sm);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  background: var(--card-bg);
  box-shadow: var(--card-shadow);
  cursor: pointer;
  transition:
    transform var(--transition-fast),
    box-shadow var(--transition-fast),
    border-color var(--transition-fast);
}

.pdf-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--card-shadow-hover);
  border-color: var(--border-1);
}

/* Image Container */
.image-container {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-1);
}

.pdf-card img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}

.poster-count {
  position: absolute;
  bottom: var(--space-sm);
  right: var(--space-sm);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--text-inverse);
  background: rgba(26, 26, 46, 0.75);
  backdrop-filter: blur(4px);
}

/* Dots */
.dots {
  display: flex;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-xs) 0;
}

.dot {
  width: 6px;
  height: 6px;
  padding: 0;
  border: none;
  border-radius: var(--radius-full);
  background: var(--dot-bg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.dot:hover {
  background: var(--text-3);
  transform: scale(1.2);
}

.dot.active {
  width: 18px;
  background: var(--dot-active);
}

/* Card Info */
.card-info {
  text-align: center;
  padding: var(--space-xs) var(--space-sm);
}

.pdf-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-1);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pdf-meta {
  font-size: 0.75rem;
  color: var(--text-3);
}
</style>
