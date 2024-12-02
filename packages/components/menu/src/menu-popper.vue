<template>
  <teleport to="body" :disabled="!fixed">
    <div class="cu-menu-popper-warpper" ref="popperRef" :style="{ ...floatingStyles, zIndex }">
      <transition name="cu-menu-popper" @after-leave="() => (zIndex = 0)">
        <div
          class="cu-menu-popper"
          :data-placement="placement"
          v-show="show"
          @mouseenter="emit('mouse-in')"
          @mouseleave="emit('mouse-out')">
          <slot></slot>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, inject, computed, watch } from 'vue';
import { getNextZIndex } from '../../../utils';
import { MENU_PROVIDE } from './type';
import { useFloating, offset, flip, autoUpdate, shift } from '@floating-ui/vue';

defineOptions({
  name: 'CuMenuPopper'
});

const props = defineProps({
  disabled: Boolean,
  fixed: Boolean,
  show: Boolean,
  trigger: HTMLElement
});

const emit = defineEmits(['mouse-in', 'mouse-out']);

const zIndex = ref(0);

const { props: injectProps } = inject(MENU_PROVIDE);

const popperRef = ref(null);

const triggerRef = computed(() => props.trigger);
var cleanup: (() => void) | null;

const middleware = computed(() => {
  return [offset(10), flip(), shift({ padding: 10 })];
});

const { floatingStyles, placement, update } = useFloating(triggerRef, popperRef, {
  placement: injectProps.mode === 'vertical' || !props.fixed ? 'right-start' : 'bottom',
  middleware
});

watch(
  () => props.show,
  (val, old) => {
    if (val) {
      if (val && val !== old) {
        zIndex.value = getNextZIndex();
      }
      if (val) {
        if (triggerRef.value && popperRef.value) {
          cleanup = autoUpdate(triggerRef.value, popperRef.value, update);
        }
      } else {
        cleanup();
      }
    }
  }
);
</script>
