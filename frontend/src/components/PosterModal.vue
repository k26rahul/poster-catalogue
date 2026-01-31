<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import QuantitySelector from './QuantitySelector.vue';

const props = defineProps({
  poster: {
    type: Object,
    default: null,
  },
  posters: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['close', 'navigate']);

// Current index in posters array
const currentIndex = computed(() => {
  if (!props.poster) return -1;
  return props.posters.findIndex(p => p.id === props.poster.id);
});

// Navigation
const hasPrev = computed(() => currentIndex.value > 0);
const hasNext = computed(() => currentIndex.value < props.posters.length - 1);

function goToPrev() {
  if (hasPrev.value) {
    emit('navigate', props.posters[currentIndex.value - 1]);
  }
}

function goToNext() {
  if (hasNext.value) {
    emit('navigate', props.posters[currentIndex.value + 1]);
  }
}

function closeModal() {
  emit('close', props.poster);
}

// Keyboard navigation
function handleKeydown(e) {
  if (!props.poster) return;

  switch (e.key) {
    case 'ArrowLeft':
      goToPrev();
      break;
    case 'ArrowRight':
      goToNext();
      break;
    case 'Escape':
      closeModal();
      break;
  }
}

// Touch swipe support
const touchStartX = ref(0);
const touchEndX = ref(0);
const SWIPE_THRESHOLD = 50;

function handleTouchStart(e) {
  touchStartX.value = e.touches[0].clientX;
}

function handleTouchMove(e) {
  touchEndX.value = e.touches[0].clientX;
}

function handleTouchEnd() {
  const swipeDistance = touchStartX.value - touchEndX.value;

  if (Math.abs(swipeDistance) > SWIPE_THRESHOLD) {
    if (swipeDistance > 0) {
      // Swiped left -> go next
      goToNext();
    } else {
      // Swiped right -> go prev
      goToPrev();
    }
  }

  // Reset
  touchStartX.value = 0;
  touchEndX.value = 0;
}

// Image orientation
const isLandscape = computed(() => {
  if (!props.poster?.imageSize) return true;
  return props.poster.imageSize[0] > props.poster.imageSize[1];
});

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="poster"
        class="poster-modal-overlay"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <!-- Left Navigation Bar -->
        <button
          class="nav-bar nav-left"
          :class="{ disabled: !hasPrev }"
          @click="goToPrev"
        >
          <Icon icon="mdi:chevron-left" />
        </button>

        <!-- Center Content -->
        <div class="modal-center" @click="closeModal">
          <div class="image-container">
            <img
              :src="`/poster-images/${poster.imageFile}`"
              :alt="poster.id"
              class="modal-image"
              :class="isLandscape ? 'landscape' : 'portrait'"
              @click="closeModal"
            />

            <!-- Quantity Selector -->
            <QuantitySelector
              class="qty-position"
              :poster-id="poster.id"
              :pdf-name="poster.pdfName"
              variant="modal"
            />
          </div>
        </div>

        <!-- Right Navigation Bar -->
        <button
          class="nav-bar nav-right"
          :class="{ disabled: !hasNext }"
          @click="goToNext"
        >
          <Icon icon="mdi:chevron-right" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.poster-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
}

/* Navigation Bars */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 2.5rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.nav-bar:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.15);
}

.nav-bar.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Center Content */
.modal-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  cursor: zoom-out;
}

.image-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: zoom-out;
}

.modal-image {
  display: block;
  max-width: calc(100vw - 180px);
  max-height: 85vh;
  object-fit: contain;
  border-radius: var(--radius-lg);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  cursor: zoom-out;
}

/* Landscape images: min 500px width on desktop */
.modal-image.landscape {
  min-width: 500px;
}

/* Portrait images: min 300px width on desktop */
.modal-image.portrait {
  min-width: 300px;
}

/* Quantity Selector Position */
.qty-position {
  position: absolute;
  bottom: 0;
  right: 0;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-image,
.modal-leave-active .modal-image {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-image,
.modal-leave-to .modal-image {
  transform: scale(0.9);
  opacity: 0;
}

/* Mobile responsive */
@media (max-width: 600px) {
  .nav-bar {
    width: 44px;
    font-size: 1.75rem;
  }

  .modal-center {
    padding: var(--space-sm);
  }

  .modal-image {
    max-width: calc(100vw - 100px);
    max-height: 80vh;
  }

  /* Landscape on mobile: 100% width */
  .modal-image.landscape {
    min-width: unset;
    width: 100%;
    max-width: 100%;
  }

  /* Portrait on mobile: 80% screen height */
  .modal-image.portrait {
    min-width: unset;
    min-height: 80vh;
    max-height: 80vh;
  }
}
</style>
