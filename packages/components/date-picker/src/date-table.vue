<template>
  <div class="cu-date-picker__select">
    <div class="cu-data-picker__select-head">
      <i @click="pannelType === 'year' ? page-- : tmpYear--">
        <DoubleLeft />
      </i>
      <i v-if="pannelType === 'date'" @click="prevMonth">
        <Left />
      </i>
      <div class="head-content">
        <span v-show="pannelType === 'year'" class="not-hover">{{
          yearList[0] + '年-' + yearList[yearList.length - 1] + '年'
        }}</span>
        <span v-show="pannelType !== 'year'" @click="pannelType = 'year'">{{ tmpYear + '年' }}</span>
        <span v-show="pannelType === 'date'" @click="pannelType = 'month'">{{ tmpMonth + 1 + '月' }}</span>
      </div>
      <i v-if="pannelType === 'date'" @click="nextMonth">
        <Right />
      </i>
      <i @click="pannelType === 'year' ? page++ : tmpYear++">
        <DoubleRight />
      </i>
    </div>
    <div class="cu-data-picker__select-content">
      <div class="cu-data-picker__select-week" v-show="pannelType === 'date'">
        <span v-for="week in weeks" :key="week">{{ weekForLang(week) }}</span>
      </div>
      <table class="cu-data-picker__table" v-show="pannelType === 'date'">
        <tr v-for="(weeks, weeksIndex) in dates" :key="weeksIndex">
          <td v-for="(day, index) in weeks" :key="index" :class="[
            { 'is-notcur': !day.isCurMonth },
            { 'is-disabled': isDisabled(day) },
            { 'is-selected': isSelected(day) },
            ...containClass(day)
          ]" @click="selectDay(day)">
            <div class="cu-date__cell">{{ day.value }}</div>
          </td>
        </tr>
      </table>
      <div class="cu-data-picker__div" v-show="pannelType === 'month'">
        <div v-for="month in 11" :class="{ 'is-selected': month - 1 === tmpMonth }" @click="selectMonth(month - 1)">
          <div class="cu-date__divcell">
            {{ monthForLang(month - 1) + '月' }}
          </div>
        </div>
      </div>
      <div class="cu-data-picker__div" v-show="pannelType === 'year'">
        <div v-for="year in yearList" :class="{ 'is-selected': year === tmpYear }" @click="selectYear(year)">
          <div class="cu-date__divcell">
            {{ year }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue';
import { dateTableProps, dateTableEmits } from './table.props';
import { DATEPICKER_PROVIDE } from './type';
import { DoubleLeft, DoubleRight, Left, Right } from '../../../icons';
defineOptions({
  name: 'DateTable'
});
const props = defineProps(dateTableProps);
const emit = defineEmits(dateTableEmits);

const { show, props: injectProps } = inject(DATEPICKER_PROVIDE);

type DateItem = {
  isPrevMonth?: boolean;
  isNextMonth?: boolean;
  isCurMonth?: boolean;
  value: number;
};

const dateNumber = ref<number>();
const weeks = ref([0, 1, 2, 3, 4, 5, 6]);
const tmpYear = ref();
const tmpMonth = ref();
const tmpDate = ref();

const page = ref(0);
const pannelType = ref('date');

function monthForLang(item: string | number, lang: string = 'zh') {
  return {
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
  }[item];
}
function weekForLang(item: string | number, lang: string = 'zh') {
  return { 0: '日', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六' }[item];
}

const yearList = computed(() => {
  return Array.from({ length: 12 }, (val, index) => {
    return tmpYear.value + index + 12 * page.value;
  });
});

const dates = computed<DateItem[][]>(() => {
  let tmpMonthLength = new Date(tmpYear.value, tmpMonth.value + 1, 0).getDate();
  let dateList: DateItem[] = Array.from({ length: tmpMonthLength }, (val, index) => {
    return {
      isCurMonth: true,
      value: index + 1
    };
  });
  let firstDay = new Date(tmpYear.value, tmpMonth.value, 1).getDay();
  let lastMonthLength = new Date(tmpYear.value, tmpMonth.value, 0).getDate();
  let len: number, i: number;
  for (i = lastMonthLength; i > lastMonthLength - firstDay; --i) {
    dateList.unshift({
      isPrevMonth: true,
      value: i
    });
  }
  for (i = 0, len = dateList.length; i + len < 42; ++i) {
    dateList.push({
      isNextMonth: true,
      value: i + 1
    });
  }
  let result: any[] = [];
  for (var x = 0; x < Math.ceil(dateList.length / 7); x++) {
    var start = x * 7;
    var end = start + 7;
    result.push(dateList.slice(start, end));
  }
  return result;
});

function prevMonth() {
  if (pannelType.value === 'date') {
    tmpMonth.value === 0 ? (--tmpYear.value, (tmpMonth.value = 11)) : --tmpMonth.value;
  } else if (pannelType.value === 'year') {
    --page.value;
  }
}
function nextMonth() {
  if (pannelType.value === 'date') {
    tmpMonth.value === 11 ? (++tmpYear.value, (tmpMonth.value = 0)) : ++tmpMonth.value;
  } else if (pannelType.value === 'year') {
    ++page.value;
  }
}
function selectYear(year: number) {
  tmpYear.value = year;
  pannelType.value = 'month';
}
function selectMonth(month: number) {
  tmpMonth.value = month;
  pannelType.value = 'date';
}

function selectDay(item: DateItem) {
  if (isDisabled(item)) return;
  item.isPrevMonth
    ? tmpMonth.value === 0
      ? (--tmpYear.value, (tmpMonth.value = 11))
      : --tmpMonth.value
    : item.isNextMonth
      ? tmpMonth.value === 11
        ? (++tmpYear.value, (tmpMonth.value = 0))
        : ++tmpMonth.value
      : (tmpYear.value, tmpMonth.value);
  tmpDate.value = item.value;
  dateNumber.value = new Date(tmpYear.value, tmpMonth.value, tmpDate.value).getTime();
}

function getDateTime(day: DateItem, number?: boolean) {
  let mon = tmpMonth.value;
  day.isPrevMonth && mon--;
  day.isNextMonth && mon++;
  let time = new Date(tmpYear.value, mon, day.value);
  return number ? time.setHours(0, 0, 0, 0) : time;
}

function isSelected(item: DateItem) {
  let time = getDateTime(item, true);
  let f: number = new Date(dateNumber.value).setHours(0, 0, 0, 0);
  return time === f;
}

function isDisabled(item: DateItem) {
  let time = getDateTime(item);
  return injectProps.disabledDate?.(time) || false;
}

function setValue() {
  let time = new Date(dateNumber.value);

  tmpYear.value = time.getFullYear();
  tmpMonth.value = time.getMonth();
  tmpDate.value = time.getDate();
}

function containClass(item: DateItem) {
  if (!injectProps.range) return [];
  let time: number = getDateTime(item, true) as number;
  let classs = [];

  if (props.contain[0] === time) {
    classs.push('is-contain-start');
  }
  if (props.contain[1] === time) {
    classs.push('is-contain-end');
  }
  if (props.contain[0] < time && props.contain[1] > time) {
    classs.push('is-contain');
  }
  return classs;
}

watch(
  () => show.value,
  (val) => {
    if (val) {
      dateNumber.value = props.date ? new Date(props.date).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0);
      setValue();
    }
  }
);

defineExpose({ dateNumber });
</script>
