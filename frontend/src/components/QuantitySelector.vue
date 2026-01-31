<script setup>
import { computed } from 'vue';
import { cartStore } from '@/stores/cartStore';

const props = defineProps({
  posterId: {
    type: String,
    required: true,
  },
  pdfName: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'compact', // 'compact' or 'modal'
  },
});

const { cart, addPoster, removePoster } = cartStore;

const qty = computed(() => {
  return cart.get(props.pdfName)?.get(props.posterId)?.qty || 0;
});

const isActive = computed(() => qty.value >= 1);

const inc = e => {
  e.stopPropagation();
  addPoster(props.pdfName, props.posterId);
};

const dec = e => {
  e.stopPropagation();
  if (qty.value > 0) {
    removePoster(props.pdfName, props.posterId);
  }
};
</script>

<template>
  <!-- Outer wrapper with idle zone padding and event stoppers -->
  <div
    class="qty-wrapper"
    :class="{ modal: variant === 'modal' }"
    @click.stop
    @touchstart.stop
    @touchmove.stop
    @touchend.stop
  >
    <!-- Inner controls with min-width to prevent collapse -->
    <div class="qty-controls" :class="{ active: isActive, modal: variant === 'modal' }">
      <button class="qty-btn minus" :class="{ visible: isActive }" @click="dec">−</button>
      <span class="qty-value" :class="{ visible: isActive }">{{ qty }}</span>
      <button class="qty-btn plus" @click="inc">+</button>
    </div>
  </div>
</template>

<style scoped>
/* Wrapper with idle zone padding and min-width */
.qty-wrapper {
  padding: var(--space-sm);
  min-width: 120px;
  display: flex;
  justify-content: flex-end;
  cursor: default;
}

.qty-wrapper.modal {
  padding: var(--space-lg);
  min-width: 160px;
}

/* Controls container */
.qty-controls {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-radius: var(--radius-full);
  background: var(--bg-4);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: all var(--transition-fast);
}

.qty-controls.active {
  background: var(--accent);
}

.qty-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  font-size: 1.25rem;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.qty-btn.plus {
  padding-bottom: 2px;
  color: var(--accent);
}

.qty-controls.active .qty-btn {
  color: var(--text-inverse);
}

.qty-btn.minus {
  width: 0;
  opacity: 0;
  overflow: hidden;
  transition:
    width var(--transition-normal),
    opacity var(--transition-fast);
}

.qty-btn.minus.visible {
  width: 36px;
  opacity: 1;
}

.qty-value {
  width: 0;
  opacity: 0;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  color: var(--text-inverse);
  overflow: hidden;
  transition:
    width var(--transition-normal),
    opacity var(--transition-fast);
}

.qty-value.visible {
  width: 28px;
  opacity: 1;
}

.qty-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.qty-controls.active .qty-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Modal variant - larger size */
.qty-controls.modal {
  box-shadow: var(--shadow-lg);
}

.qty-controls.modal .qty-btn {
  height: 48px;
  font-size: 1.5rem;
}

.qty-controls.modal .qty-btn.plus {
  width: 48px;
}

/* Hidden state must come after to override the modal variant */
.qty-controls.modal .qty-btn.minus {
  width: 0;
}

.qty-controls.modal .qty-btn.minus.visible {
  width: 48px;
}

.qty-controls.modal .qty-value {
  font-size: 1.125rem;
}

.qty-controls.modal .qty-value.visible {
  width: 36px;
}

/* Mobile responsive - smaller padding */
@media (max-width: 600px) {
  .qty-wrapper.modal {
    padding: var(--space-md);
  }
}
</style>
