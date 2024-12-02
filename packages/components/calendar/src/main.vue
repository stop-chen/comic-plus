<template>
  <div class="cu-calendar" ref="calendarRef" :class="size ?? globalSize">
    <div class="cu-calendar__header" v-if="showHeader">
      <slot name="header" :data="{ year: ty, month: tm + 1 }">
        <span>{{ ty + '年 ' + monthForLang[tm] + '月' }}</span>
        <span>
          <button-group :size="size ?? globalSize">
            <c-button @click="prevMonth">上月</c-button>
            <c-button @click="today()">今天</c-button>
            <c-button @click="nextMonth">下月</c-button>
          </button-group>
        </span>
      </slot>
    </div>
    <table class="cu-calendar__table" cellspacing="0" cellpadding="0">
      <thead class="cu-calendar__thead" v-if="showWeek">
        <tr class="cu-calendar__tr">
          <th v-for="(week, idx) in weeks" class="cu-calendar__th">
            {{ weekForLang[week] }}
          </th>
        </tr>
      </thead>
      <tbody class="cu-calendar__tbody">
        <tr v-for="week in dates" class="cu-calendar__tr">
          <td v-for="day in week" class="cu-calendar__td"
            :class="{ 'is-prev': day.isPrevMonth, 'is-next': day.isNextMonth, 'is-today': isSelect(day) }"
            @click="selectDay(day)">
            <div class="cu-calendar__cell">
              <div class="cu-calendar__date" v-if="showDay">{{ formatDate(day.date, format ?? 'd') }}</div>
              <schedules-list v-if="openSchedule" :data="filterSchedules" :day="day" @mouse-in="dFc" @mouse-out="dFc" />
              <slot name="day" :data="{
                isSelected: isSelect(day),
                day: day.value,
                type: day.isPrevMonth ? 'prev-month' : day.isNextMonth ? 'next-month' : 'current-month',
                date: formatDate(day.date, 'yyyy-MM-dd')
              }"></slot>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <float-card v-if="openSchedule" :data="currentSchedule" :card-width="cardWidth" :trigger="calendarRef">
      <template v-if="$slots['schedule-card']" #default="{ data }">
        <slot name="schedule-card" :data="data" />
      </template>
    </float-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, warn, watch } from 'vue';
import { CuButtonGroup as ButtonGroup } from '../../button-group';
import { CuButton as CButton } from '../../button';
import SchedulesList from './schedules.vue';
import FloatCard from './float-card.vue';
import '../style/calendar.css';
import { calendarEmits, calendarProps } from './main.props';
import { debounce, formatDate, useGlobal } from '../../../utils';
import { DateItem } from './type';
import { useSchedules } from '../util';

defineOptions({
  name: 'CuCalendar'
});

const props = defineProps(calendarProps);
const emit = defineEmits(calendarEmits);
const calendarRef = ref();

const { globalSize } = useGlobal();

const weeks = ref([0, 1, 2, 3, 4, 5, 6]);
const ty = ref();
const tm = ref();
const dn = ref(new Date(props.modelValue || Date.now()).setHours(0, 0, 0, 0));

const monthForLang = {
  0: '一',
  1: '二',
  2: '三',
  3: '四',
  4: '五',
  5: '六',
  6: '七',
  7: '八',
  8: '九',
  9: '十',
  10: '十一',
  11: '十二'
};

const weekForLang = { 0: '日', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六' };

const currentSchedule = ref();

const dFc = debounce((val) => (currentSchedule.value = val), 300);

function setValue() {
  let time = new Date(dn.value);

  ty.value = time.getFullYear();
  tm.value = time.getMonth();
}

setValue();

const dates = computed(() => {
  let tml = new Date(ty.value, tm.value + 1, 0).getDate();

  let dl: DateItem[] = Array.from({ length: tml }, (val, index) => {
    return {
      isCurMonth: true,
      value: index + 1,
      date: new Date(ty.value, tm.value, index + 1)
    };
  });

  let fd = new Date(ty.value, tm.value, 1).getDay();
  let ld = new Date(ty.value, tm.value, 0).getDate();
  let len: number, i: number;
  for (i = ld; i > ld - fd; --i) {
    dl.unshift({
      isPrevMonth: true,
      value: i,
      date: new Date(ty.value, tm.value - 1, i)
    });
  }

  for (i = 0, len = dl.length; i + len < 42; ++i) {
    dl.push({
      isNextMonth: true,
      value: i + 1,
      date: new Date(ty.value, tm.value + 1, i + 1)
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

const { filterSchedules } = useSchedules(props, { year: ty, month: tm, dates });

function prevMonth() {
  tm.value === 0 ? (--ty.value, (tm.value = 11)) : --tm.value;
  dn.value = new Date(ty.value, tm.value, 1).getTime();
}
function nextMonth() {
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

function isSelect(item) {
  let mon = tm.value;
  item.isPrevMonth && mon--;
  item.isNextMonth && mon++;
  let time: number = new Date(ty.value, mon, item.value).setHours(0, 0, 0, 0);
  let f: number = new Date(dn.value).setHours(0, 0, 0, 0);
  return time === f;
}

function selectDay(item: DateItem) {
  item.isPrevMonth
    ? tm.value === 0
      ? (--ty.value, (tm.value = 11))
      : --tm.value
    : item.isNextMonth
      ? tm.value === 11
        ? (++ty.value, (tm.value = 0))
        : ++tm.value
      : (ty.value, tm.value);
  dn.value = new Date(ty.value, tm.value, item.value).getTime();


}

// function dateFormat(day) {
//   let mon = tm.value;
//   day.isPrevMonth && mon--;
//   day.isNextMonth && mon++;
//   let time: number = new Date(ty.value, mon, day.value).setHours(0, 0, 0, 0);
//   return formatDate(time, 'yyyy-MM-dd');
// }

const dateTypeFn = {
  'prev-year': prevYear,
  'prev-month': prevMonth,
  today: today,
  'next-month': nextMonth,
  'next-year': nextYear
} as const;

type DateType = keyof typeof dateTypeFn;

function selectDate(value: DateType | Date) {
  if ((value as DateType) in dateTypeFn) {
    dateTypeFn[value as DateType]?.();
  } else if (value instanceof Date) {
    dn.value = new Date(value).setHours(0, 0, 0, 0);
    setValue();
  } else {
    warn('SelectDate can only pass in parameters in Date or specified string format');
    return;
  }
}

watch(
  () => props.modelValue,
  (val) => {
    dn.value = new Date(val).setHours(0, 0, 0, 0);
    setValue();
  }
);

watch(dn, (val) => {
  emit('update:modelValue', new Date(val));
  emit('change', new Date(val));
});

defineExpose({
  selectDate
});
</script>
