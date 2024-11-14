<template>
  <div class="cu-schedule-calendar">
    <div class="cu-schedule-calendar__header">
      <span> {{ ty + '年 ' + (tm + 1) + '月' }}</span>
      <button-group size="small">
        <c-button color="#acadad" light :icon="Left" @click="prevMonth" />
        <c-button color="#acadad" light :icon="Right" @click="nextMonth" />
      </button-group>
    </div>
    <table class="cu-schedule-calendar__table" cellspacing="5" cellpadding="5">
      <thead class="cu-schedule-calendar__thead">
        <tr class="cu-schedule-calendar__tr">
          <th v-for="week in weeks" class="cu-schedule-calendar__th">
            {{ weekForLang[week] }}
          </th>
        </tr>
      </thead>
      <tbody class="cu-schedule-calendar__tbody">
        <tr v-for="week in dates" class="cu-schedule-calendar__tr">
          <td
            v-for="day in week"
            class="cu-schedule-calendar__td"
            :class="{ 'is-prev': day.isPrevMonth, 'is-next': day.isNextMonth, 'is-today': isSelect(day) }"
            @click="selectDay(day)">
            <div class="cu-schedule-calendar__cell">
              <div class="dot" v-if="hasSchedule(day)"></div>
              {{ day.value }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="cu-schedule-calendar__extra" v-if="$slots.calendar">
      <slot name="calendar" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch, warn } from 'vue';
import { SCHEDULE_PROVIDE } from './type';
import { CuButtonGroup as ButtonGroup, CuButton as CButton } from '../../../index';
import { Left, Right } from '../../../icons';

defineOptions({
  name: 'CuCalendar'
});

type DateItem = {
  isPrevMonth?: boolean;
  isNextMonth?: boolean;
  isCurMonth?: boolean;
  value: number;
};

const { date, props } = inject(SCHEDULE_PROVIDE);

const weeks = ref([0, 1, 2, 3, 4, 5, 6]);
const ty = ref();
const tm = ref();
const dn = ref(new Date().setHours(0, 0, 0, 0));

const weekForLang = { 0: '日', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六' };

function setValue() {
  let time = new Date(dn.value);
  ty.value = time.getFullYear();
  tm.value = time.getMonth();
}

setValue();

const hasScheduleDays = computed(() => {
  if (!props.hasScheduleDays) return [];
  return props.hasScheduleDays?.map((v) => {
    return new Date(v).setHours(0, 0, 0, 0);
  });
});

const dates = computed(() => {
  let tml = new Date(ty.value, tm.value + 1, 0).getDate();

  let dl: DateItem[] = Array.from({ length: tml }, (val, index) => {
    return {
      isCurMonth: true,
      value: index + 1
    };
  });
  let fd = new Date(ty.value, tm.value, 1).getDay();
  let ld = new Date(ty.value, tm.value, 0).getDate();
  let len: number, i: number;
  for (i = ld; i > ld - fd; --i) {
    dl.unshift({
      isPrevMonth: true,
      value: i
    });
  }

  for (i = 0, len = dl.length; i + len < 42; ++i) {
    dl.push({
      isNextMonth: true,
      value: i + 1
    });
  }
  let result: DateItem[][] = [];
  for (var x = 0; x < Math.ceil(dl.length / 7); x++) {
    var start = x * 7;
    var end = start + 7;
    result.push(dl.slice(start, end));
  }

  if (result[0].every((v) => v.isPrevMonth)) {
    result.shift();
  }

  if (result[result.length - 1].every((v) => v.isNextMonth)) {
    result.pop();
  }

  return result;
});

function prevMonth() {
  if (props.loading) return;
  tm.value === 0 ? (--ty.value, (tm.value = 11)) : --tm.value;
  dn.value = new Date(ty.value, tm.value, 1).getTime();
}
function nextMonth() {
  if (props.loading) return;
  tm.value === 11 ? (++ty.value, (tm.value = 0)) : ++tm.value;
  dn.value = new Date(ty.value, tm.value, 1).getTime();
}

function prevYear() {
  ty.value--;
  dn.value = new Date(ty.value, tm.value, 1).getTime();
}

function nextYear() {
  ty.value++;
  dn.value = new Date(ty.value, tm.value, 1).getTime();
}

function today() {
  dn.value = new Date().setHours(0, 0, 0, 0);
  setValue();
}

function isSelect(item: DateItem) {
  let time: number = getTime(item);
  let f: number = new Date(dn.value).setHours(0, 0, 0, 0);
  return time === f;
}

function hasSchedule(item: DateItem) {
  return hasScheduleDays.value.includes(getTime(item));
}

function getTime(item: DateItem) {
  let mon = tm.value;
  item.isPrevMonth && mon--;
  item.isNextMonth && mon++;
  return new Date(ty.value, mon, item.value).setHours(0, 0, 0, 0);
}

function selectDay(item: DateItem) {
  if (props.loading) return;
  item.isPrevMonth
    ? tm.value === 0
      ? (--ty.value, (tm.value = 11))
      : --tm.value
    : item.isNextMonth
    ? tm.value === 11
      ? (++ty.value, (tm.value = 0))
      : ++tm.value
    : (ty.value, tm.value);
  dn.value = new Date(ty.value, tm.value, item.value).setHours(0, 0, 0, 0);
}

const dateTypeFn = {
  'prev-year': prevYear,
  'prev-month': prevMonth,
  today: today,
  'next-month': nextMonth,
  'next-year': nextYear
} as const;

type DateType = keyof typeof dateTypeFn | Date;

function selectDate(value: DateType) {
  if (props.loading) return;
  if (value instanceof Date) {
    dn.value = new Date(value).setHours(0, 0, 0, 0);
    setValue();
  } else if (value in dateTypeFn) {
    dateTypeFn[value]?.();
  } else {
    warn('SelectDate can only pass in parameters in Date or specified string format');
    return;
  }
}

watch(dn, (val) => {
  date.value = new Date(val);
});

defineExpose({
  selectDate
});
</script>
