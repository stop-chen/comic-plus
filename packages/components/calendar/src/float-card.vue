<template>
  <teleport to="body">
    <transition name="cu-fade">
      <div
        class="cu-calendar--floatCard"
        ref="containerRef"
        v-show="!!data"
        :style="{
          ...floatingStyles,
          zIndex,
          'max-width': cardWidth ? cardWidth + 'px' : undefined
        }">
        <slot :data="recordData">
          <div class="floatCard__container" :style="{ '--card-color': recordData.color }" v-if="recordData">
            <div class="floatCard__content">{{ recordData.content }}</div>
            <div class="floatCard__time">
              <span>{{ formatDate(recordData.startDate, 'MM-dd') }}</span>
              <template v-if="recordData.endDate.getTime() > recordData.startDate.getTime()">
                <span>~</span>
                <span>{{ formatDate(recordData.endDate, 'MM-dd') }}</span>
              </template>
            </div>
          </div>
        </slot>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue';
import { useMouse, type UseMouseEventExtractor } from '@vueuse/core';
import { useFloating, offset, flip, shift } from '@floating-ui/vue';
import { formatDate, getNextZIndex, raf } from '../../../utils';

const props = defineProps({
  data: Object,
  trigger: Object as PropType<Element>,
  cardWidth: Number
});

const zIndex = ref(0);
const recordData = ref(props.data);
const containerRef = ref();
const virtualEl = ref();
const triggerRef = computed(() => {
  return props.trigger;
});

const extractor: UseMouseEventExtractor = (event) => [event.clientX, event.clientY];

const { x, y } = useMouse({ target: triggerRef, touch: false, type: extractor });

const { floatingStyles } = useFloating(virtualEl, containerRef, {
  placement: 'right-end',
  middleware: [offset(10), flip(), shift({ padding: 10 })]
});

const updateVirtualEl = () => {
  raf(() => {
    virtualEl.value = {
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x: x.value,
          y: y.value,
          left: x.value,
          right: x.value,
          top: y.value,
          bottom: y.value
        };
      }
    };
  });
};

watch([x, y], updateVirtualEl);

watch(
  () => props.data,
  (val) => {
    if (val) {
      if (zIndex.value === 0) {
        zIndex.value = getNextZIndex();
      }
      recordData.value = val;
      updateVirtualEl();
    } else {
      zIndex.value = 0;
    }
  }
);
</script>
