<template>
  <div :style="cardStyle" ref="cardRef" class="cu-schedule-cards">
    <div
      v-for="(card, idx) in data.children"
      class="cu-schedule-card"
      :style="cardStyleFn(card)"
      :key="card.time + idx">
      <slot name="card" :data="card">
        <component v-if="isVNode(card.content!)" :is="card.content!"></component>
        <template v-else>
          <div class="cu-schedule-defaultcard" :style="{ '--card-color': card.color }">
            <div class="cu-schedule-defaultcard__content">
              {{ card.content! }}
            </div>
            <div class="timer">{{ card.time }}</div>
          </div>
        </template>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, inject, isVNode, ref } from 'vue';
import { CardList, SCHEDULE_PROVIDE, Schedules } from './type';

defineOptions({
  name: 'CuScheduleCards'
});

const props = defineProps({
  data: Object as PropType<CardList[number]>
});

const { props: injectProps, spacing } = inject(SCHEDULE_PROVIDE);

const cardRef = ref();

const maxHeight = computed(() => {
  return (injectProps.end + 1 - injectProps.start) * spacing.value;
});

const startTime = computed(() => {
  return Math.max(props.data.startTime, injectProps.start);
});

const endTime = computed(() => {
  return Math.min(props.data.endTime, injectProps.end + 1);
});

const getMaxPx = (number: number) => {
  return Math.min(Math.max(number, 0), maxHeight.value);
};

const cardStyle = computed(() => {
  return {
    top: getMaxPx((startTime.value - injectProps.start) * spacing.value) + 'px',
    height: Math.min((endTime.value - startTime.value) * spacing.value, maxHeight.value) + 'px'
  };
});

function cardStyleFn(card: Schedules[number]) {
  return {
    marginTop: getMaxPx((card.getTimes[0] - startTime.value) * spacing.value) + 'px',
    marginBottom: getMaxPx((endTime.value - card.getTimes[1]) * spacing.value) + 'px'
  };
}
</script>
