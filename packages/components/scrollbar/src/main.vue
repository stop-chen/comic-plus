<template>
  <div class="cu-scrollbar" :class="display" :style="{ height }">
    <div
      class="cu-scrollbar__container"
      :style="{ 'max-height': maxHeight }"
      ref="scrollRef"
      @scroll="onScroll">
      <div ref="containerRef">
        <slot></slot>
      </div>
    </div>
    <div class="cu-scrollbar__thumb thumby" :style="thumbyStyle" @mousedown="mousedowny" v-if="hasThumby"></div>
    <div class="cu-scrollbar__thumb thumbx" :style="thumbxStyle" @mousedown="mousedownx" v-if="hasThumbx"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue';
import { useEventListener } from '@vueuse/core';
import '../style/scrollbar.css';
import { scrollbarProps, scrollbarEmits } from './main.props';
import { useResize } from '../../../hooks';
defineOptions({
  name: 'CuScrollbar'
});

const props = defineProps(scrollbarProps);
const emit = defineEmits(scrollbarEmits);

const scrollRef = ref<HTMLElement>();
const containerRef = ref<HTMLElement>();

const barTop = ref(0);
const barLeft = ref(0);
const barHeight = ref(0);
const barWidth = ref(0);
const minBarSize = 16;

const hasThumby = ref(false);
const hasThumbx = ref(false);

var clearMoveY: (() => void) | null, clearMoveX: (() => void) | null, clearUp: (() => void) | null;

watch(
  () => props.display,
  () => {
    computedShowThumb();
  }
);

useResize(scrollRef, resateScrollBar);
useResize(containerRef, resateScrollBar);

function computedShowThumb() {
  hasThumby.value = props.display === 'never' ? false : scrollRef.value?.offsetHeight < scrollRef.value?.scrollHeight;
  hasThumbx.value = props.display === 'never' ? false : scrollRef.value?.offsetWidth < scrollRef.value?.scrollWidth;
}

const thumbyStyle = computed(() => {
  return {
    '--cu-scrollbar-barheight': Math.max(minBarSize, barHeight.value) + 'px',
    '--cu-scrollbar-bartop': barTop.value + 'px'
  };
});

const thumbxStyle = computed(() => {
  return {
    '--cu-scrollbar-barwidth': Math.max(minBarSize, barWidth.value) + 'px',
    '--cu-scrollbar-barleft': barLeft.value + 'px'
  };
});

function onScroll(e: Event) {
  const eTarget = <HTMLElement>e.target;
  barTop.value = (eTarget.scrollTop / eTarget.scrollHeight) * eTarget.offsetHeight;
  barLeft.value = (eTarget.scrollLeft / eTarget.scrollWidth) * eTarget.offsetWidth;

  if (barHeight.value < minBarSize) {
    barTop.value = barTop.value - ((minBarSize - barHeight.value) / eTarget.offsetHeight) * barTop.value;
  }
  if (barWidth.value < minBarSize) {
    barLeft.value = barLeft.value - ((minBarSize - barWidth.value) / eTarget.offsetWidth) * barLeft.value;
  }

  emit('scroll', e);
}

function mousedowny(e) {
  e.preventDefault();
  setTop(e.offsetY);
  clearMoveY = useEventListener(document, 'mousemove', movey);
  clearUp = useEventListener(document, 'mouseup', up);
}

function mousedownx(e) {
  e.preventDefault();
  setLeft(e.offsetX);
  clearMoveX = useEventListener(document, 'mousemove', movex);
  clearUp = useEventListener(document, 'mouseup', up);
}
function movey(e) {
  let offsetTop = scrollRef.value.getBoundingClientRect().top;
  setTop(e.clientY - offsetTop);
}

function movex(e) {
  let offsetLeft = scrollRef.value.getBoundingClientRect().left;
  setLeft(e.clientX - offsetLeft);
}

function setTop(offsetY: number) {
  let top = (offsetY / scrollRef.value?.offsetHeight) * scrollRef.value?.scrollHeight;
  top -= (barHeight.value / 2 / scrollRef.value?.offsetHeight) * scrollRef.value?.scrollHeight;
  scrollRef.value.scrollTo({
    top: top
  });
}

function setLeft(offsetX: number) {
  let left = (offsetX / scrollRef.value?.offsetWidth) * scrollRef.value?.scrollWidth;
  left -= (barWidth.value / 2 / scrollRef.value?.offsetWidth) * scrollRef.value?.scrollWidth;
  scrollRef.value.scrollTo({
    left: left
  });
}

function up() {
  clearMoveX?.();
  clearMoveY?.();
  clearUp?.();
}

async function resateScrollBar() {
  await nextTick();
  const dom = scrollRef.value;
  if (!dom) return;
  barHeight.value = (dom.offsetHeight / dom.scrollHeight) * dom.offsetHeight;
  barWidth.value = (dom.offsetWidth / dom.scrollWidth) * dom.offsetWidth;
  barTop.value = (dom.scrollTop / dom.scrollHeight) * dom.offsetHeight;
  barLeft.value = (dom.scrollLeft / dom.scrollWidth) * dom.offsetWidth;

  if (barHeight.value < minBarSize) {
    barTop.value = barTop.value - ((minBarSize - barHeight.value) / dom.offsetHeight) * barTop.value;
  }
  if (barWidth.value < minBarSize) {
    barLeft.value = barLeft.value - ((minBarSize - barWidth.value) / dom.offsetWidth) * barLeft.value;
  }
  computedShowThumb();
}

function setBarTop(top: number, beh?) {
  scrollRef.value.scrollTo({
    top,
    behavior: beh ?? 'smooth'
  });
}

function setBarLeft(left: number, beh?) {
  scrollRef.value.scrollTo({
    left,
    behavior: beh ?? 'smooth'
  });
}

function getScrollEvent() {
  return scrollRef.value;
}

defineExpose({ setBarTop, setBarLeft, getScrollEvent, hasThumby, hasThumbx });

onMounted(() => {
  resateScrollBar();
});
</script>
