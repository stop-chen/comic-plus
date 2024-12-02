import { useNow } from '@vueuse/core';
import { formatDate } from '../../../utils';
import { computed, ref, watch } from 'vue';

export const useClock = () => {
  const now = useNow({ interval: 1000 });
  const date = ref(formatDate(new Date(), 'yyyy-MM-dd'));

  const getTimes = computed(() => {
    return {
      hour: now.value?.getHours(),
      minute: now.value?.getMinutes(),
      second: now.value?.getSeconds()
    };
  });

  //监听小时变化更新日期
  watch(
    () => getTimes.value.hour,
    () => {
      date.value = formatDate(new Date(), 'yyyy-MM-dd');
    }
  );

  return {
    getTimes,
    date
  };
};

export type UseClockReturn = ReturnType<typeof useClock>;
