<template>
  <div class="cu-clock cu-clock--number">
    <div class="cu-clock__container">
      <space :split="spacer" :size="props.size">
        <template v-for="(_, index) in 3">
          <ul class="cu-clock-group">
            <li class="cu-clock-lamp" v-for="(_, idx) in 7" :class="{ show: NUMBER_SHOW_ENUM[times[index * 2]][idx] }">
              <div class="cu-clock__horn first"></div>
              <div class="cu-clock__line"></div>
              <div class="cu-clock__horn last"></div>
            </li>
          </ul>
          <ul class="cu-clock-group">
            <li class="cu-clock-lamp" v-for="(_, idx) in 7"
              :class="{ show: NUMBER_SHOW_ENUM[times[index * 2 + 1]][idx] }">
              <div class="cu-clock__horn first"></div>
              <div class="cu-clock__line"></div>
              <div class="cu-clock__horn last"></div>
            </li>
          </ul>
        </template>
      </space>
      <div v-if="props.modules?.includes('date')" class="cu-clock-date"
        :style="{ color: props.color ? '#ffffff' : undefined }">
        {{ date }}&nbsp;&nbsp;&nbsp;&nbsp;{{ week }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed, h } from 'vue';
import { CuSpace as Space } from '../../../space';
import { CLOCK_PROVIDE, NUMBER_SHOW_ENUM } from '../type';

const { getTimes, props, date } = inject(CLOCK_PROVIDE)!;

const spacer = h('div', { class: ['cu-clock__dot'] });
const weekEmun = { 0: '星期日', 1: '星期一', 2: '星期二', 3: '星期三', 4: '星期四', 5: '星期五', 6: '星期六' };

const week = ref(weekEmun[new Date().getDay()]);

const times = computed(() => {
  let t = getTimes.value;
  let arr = [];
  for (const k in t) {
    if (t[k] < 10) {
      arr.push(0);
      arr.push(t[k]);
    } else {
      let a = Array.from(String(t[k]), Number);
      arr.push(a[0]);
      arr.push(a[1]);
    }
  }
  return arr;
});
</script>
