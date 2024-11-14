<template>
  <div class="cu-schedule-content">
    <div class="cu-schedule-list--warpper">
      <ul class="cu-schedule-list">
        <li v-for="el in timeList" class="cu-schedule-list__li" :style="{ height: spacing + 'px' }">
          <span class="cu-schedule-list__time" v-if="props.showTime">
            <span>{{ (el.key < 10 ? '0' + el.key : el.key) + ':00' }}</span>
          </span>
          <span class="cu-schedule-list__line" v-if="props.showLine"></span>
        </li>
      </ul>
      <div class="cu-schedule-cards--warpper" :style="{ paddingLeft: props.showTime ? undefined : '0' }">
        <schedule-cards v-for="(item, idx) in cardForArr" :data="item" :key="idx">
          <template #card="{ data }" v-if="$slots['card']">
            <slot name="card" :data="data" />
          </template>
        </schedule-cards>
      </div>
    </div>
    <div class="cu-schedule-empty" v-if="props.showEmpty && cardForArr.length === 0">
      <slot name="empty" :date="date">{{ props.emptyText }}</slot>
    </div>
    <transition name="cu-fade">
      <div class="loading-mask" v-show="props.loading">
        <Loading class="is-loading" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { CardList, SCHEDULE_PROVIDE } from './type';
import ScheduleCards from './card.vue';
import { randomColor } from '../../../utils';
import { Loading } from '../../../icons';

const { date, props, spacing } = inject(SCHEDULE_PROVIDE);

const flag = 100 / 60;

const timeList = computed(() => {
  let result = [];
  let i = props.start;
  do {
    if (i > 23) {
      i -= 24;
    }
    result.push({
      key: i,
      timeTemp: date.value.setHours(i, 0, 0, 0)
    });
    i++;
    if (i === 24) {
      i = 0;
    }
  } while (!(i === props.end + 1));
  return result;
});

function getNumber(t: number) {
  let t1 = Math.floor(t);
  let t2 = (t % 1) * flag;
  return t1 + t2;
}

const cardForArr = computed(() => {
  let arr = props.schedules
    .map((v, index) => {
      return {
        ...v,
        _index: index,
        color: props.cardColor ? v.color ?? randomColor() : undefined,
        getTimes: v.time.split(props.separator).map((v) => {
          return getNumber(Number(v.replace(/:/g, '.')));
        })
      };
    })
    .sort((a, b) => a.getTimes[0] - b.getTimes[0]);
  let chunkArr: CardList = [];

  if (arr.length > 0) {
    chunkArr = [
      {
        startTime: arr[0].getTimes[0],
        endTime: arr[0].getTimes[1],
        children: [arr[0]]
      }
    ];
    for (let i = 1; i < arr.length; i++) {
      let item = arr[i];
      let last = chunkArr[chunkArr.length - 1];
      if (item.getTimes[0] < last.endTime) {
        last.children.push(item);
        last.endTime = Math.max(last.endTime, item.getTimes[1]);
      } else {
        chunkArr.push({
          startTime: item.getTimes[0],
          endTime: item.getTimes[1],
          children: [item]
        });
      }
    }
  }
  return chunkArr;
});
</script>
