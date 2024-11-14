<template>
  <div class="cu-schedule">
    <div class="cu-schedule-header">
      <slot :date="date" name="header">
        <div class="cu-schedule-header__time">
          {{ formatDate(date, 'yyyy年MM月dd日') }}
        </div>
      </slot>
    </div>
    <div class="cu-schedule--flexbox">
      <content>
        <template v-if="$slots.card" #card="{ data }">
          <slot name="card" :data="data" />
        </template>
        <template v-if="$slots.empty" #empty="{ date }">
          <slot name="empty" :date="date" />
        </template>
      </content>
      <calendar ref="calendarRef">
        <template v-if="$slots.calendar" #calendar>
          <slot name="calendar" />
        </template>
      </calendar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue';
import '../style/schedule.css';
import Calendar from './calendar.vue';
import Content from './content.vue';
import { SCHEDULE_PROVIDE } from './type';
import { scheduleEmits, scheduleProps } from './main.props';
import { formatDate, isNumber } from '../../../utils';

defineOptions({
  name: 'CuSchedule'
});

const props = defineProps(scheduleProps);
const emit = defineEmits(scheduleEmits);

const date = ref(new Date());
const calendarRef = ref();

const spacing = computed(() => {
  return isNumber(props.gap) ? Math.max(props.gap, 50) : 100;
});

watch(date, (val) => {
  emit('changeDate', val);
});

provide(SCHEDULE_PROVIDE, {
  date,
  props,
  spacing
});

function selectDate(value) {
  calendarRef.value?.selectDate(value);
}

defineExpose({
  selectDate
});
</script>
