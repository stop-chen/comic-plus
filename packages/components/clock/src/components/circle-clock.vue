<template>
  <div class="cu-clock cu-clock--circle">
    <div class="cu-clock__container">
      <div class="cu-clock__times">
        <span v-for="(time, idx) in times" class="cu-clock__times-item" :class="{ 'roman-text': props.romanText }"
          :style="{
            '--cu-clock-time-rotate': (180 / times.length) * idx + 'deg'
          }">
          <div v-for="item in time">
            <span class="block" v-if="hasMarks" :class="{ 'is-time': isNumber(item) }"></span>
            <span class="cu-clock__text" v-if="hasNumbers">
              {{ hasNumbers ? (props.romanText ? NUMBER_ROMAN[item] : item) : '' }}
            </span>
          </div>
        </span>
      </div>
      <div v-if="props.modules?.includes('date')" class="cu-clock-date"
        :style="{ color: props.color ? '#ffffff' : undefined }">
        {{ date }}
      </div>
      <div class="cu-clock__pointer hour" :style="{
        '--cu-clock-time-rotate': (360 / 12) * getTimes.hour + 'deg'
      }"></div>
      <div class="cu-clock__pointer minute" :style="{
        '--cu-clock-time-rotate': (360 / 60) * getTimes.minute + 'deg'
      }"></div>
      <div class="cu-clock__pointer second" :style="{
        '--cu-clock-time-rotate': (360 / 60) * getTimes.second + 'deg'
      }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue';
import { CLOCK_PROVIDE, NUMBER_ROMAN } from '../type';
import { isNumber } from '../../../../utils';

const timeList1 = [
  [12, 6],
  [1, 7],
  [2, 8],
  [3, 9],
  [4, 10],
  [5, 11]
];
const timeList2 = [
  [12, 6],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  [1, 7],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  [2, 8],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  [3, 9],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  [4, 10],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', ''],
  [5, 11],
  ['', ''],
  ['', ''],
  ['', ''],
  ['', '']
];

const { getTimes, props, date } = inject(CLOCK_PROVIDE)!;

const hasMarks = computed(() => {
  return props.modules?.some((val) => val === 'second_marks' || val === 'marks');
});

const times = computed(() => {
  if (props.modules) {
    if (props.modules.includes('second_marks')) {
      return timeList2;
    }
    if (props.modules.includes('marks')) {
      return timeList1;
    }
  }
  return timeList1;
});

const hasNumbers = computed(() => {
  return props.modules && props.modules.includes('numbers');
});

</script>
