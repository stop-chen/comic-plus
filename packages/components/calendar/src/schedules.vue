<template>
  <ul class="cu-calendar__schedules">
    <li
      v-for="item in eventDay.events"
      :class="getClasses(item)"
      :style="{ background: item.color, marginTop: item.top + 4 + 'px' }"
      @mouseenter="mouseenter(item)"
      @mouseleave="emit('mouse-out')"></li>
  </ul>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { DateItem, Schedules } from './type';

const props = defineProps({
  data: Array as PropType<DateItem[]>,
  day: Object as PropType<DateItem>
});

const emit = defineEmits(['mouse-in', 'mouse-out']);

const eventDay = computed(() => {
  return props.data.find((v) => v.date.getTime() === props.day.date.getTime());
});

function getClasses(item: Schedules[number]) {
  let classes = [];

  if (item.startDate.getDate() === props.day.value) {
    classes.push('is-start');
  }

  if (item.endDate.getDate() === props.day.value) {
    classes.push('is-end');
  }

  return classes;
}

function mouseenter(item: Schedules[number]) {
  emit('mouse-in', item);
}
</script>
