<template>
  <div v-if="props.range">
    <div class="rangetime-box">
      <div class="time-title">开始时间</div>
      <div class="cu-time-picker__listbox">
        <list v-model="currentTimes[0][0]" :time="24" />
        <list v-model="currentTimes[0][1]" :time="60" />
        <list v-model="currentTimes[0][2]" :time="60" />
      </div>
    </div>
    <div class="rangetime-box">
      <div class="time-title">结束时间</div>
      <div class="cu-time-picker__listbox">
        <list v-model="currentTimes[1][0]" :time="24" />
        <list v-model="currentTimes[1][1]" :time="60" />
        <list v-model="currentTimes[1][2]" :time="60" />
      </div>
    </div>
  </div>
  <div class="cu-time-picker__listbox" v-else>
    <list v-model="(currentTimes[0] as string)" :time="24" />
    <list v-model="(currentTimes[1] as string)" :time="60" />
    <list v-model="(currentTimes[2] as string)" :time="60" />
  </div>

  <div class="cu-time-picker__footer">
    <cu-button size="small" type="primary" text @click="_confirm">确认</cu-button>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue';
import list from './list';
import { CuButton } from '../../button';
import { TIMEPICKER_PROVIDE } from './type';

const { props, show, confirm } = inject(TIMEPICKER_PROVIDE);

const currentTimes = ref([])

const getValue = (value: any) => value ?? '00:00:00'

const setTimeValue = () => {
  if (props.range) {
    currentTimes.value = [getValue(props.modelValue[0]).split(':'), getValue(props.modelValue[1]).split(':')];
  } else {
    currentTimes.value = (getValue(props.modelValue) as string).split(':');
  }
}
setTimeValue()

const sort = () => {
  currentTimes.value = currentTimes.value.sort((a, b) => {
    for (let i = 0; i < a.length; i++) {
      let numA = parseInt(a[i], 10);
      let numB = parseInt(b[i], 10);

      if (numA !== numB) {
        return numA - numB;
      }
    }
    return 0;
  });
}

function _confirm() {
  if (props.range) {
    sort()
    let arr = [currentTimes.value[0].join(':'), currentTimes.value[1].join(':')];
    confirm(arr);
  } else {
    confirm(currentTimes.value.join(':'));
  }
}


watch(
  () => show.value,
  (val) => {
    if (val) {
      setTimeValue();
    }
  }
);
</script>
