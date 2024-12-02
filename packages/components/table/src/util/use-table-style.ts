import { unrefElement } from '@vueuse/core';
import { ref, computed, onMounted, onUpdated, nextTick } from 'vue';
import { Column, UseTableStyleOptions } from '../type';
import { useResize } from '../../../../hooks';

export const useTableStyle = ({ containerRef, columns, MIN_SIZE }: UseTableStyleOptions) => {
  const expandColumn = computed(() => columns.value.find((v) => v.type === 'expand'));

  const containerEl = computed(() => {
    return unrefElement<HTMLElement>(containerRef);
  });

  const barWidth = ref(0);
  const leftShadow = ref(false);
  const rightShadow = ref(false);

  const getBodyScrollbarWidth = () => {
    barWidth.value = containerEl.value?.offsetWidth - containerEl.value?.clientWidth;
    columnDefaultWidth.value = updateColumnDefaultWidth();
  };

  const onscroll = (e: any) => {
    leftShadow.value = e.target.scrollLeft > 0;
    rightShadow.value = e.target.scrollWidth - (e.target.scrollLeft + e.target.clientWidth) > 1;
  };

  const updateShadow = () => {
    let e = containerEl.value;

    leftShadow.value = e.scrollLeft > 0;
    rightShadow.value = e.scrollWidth - (e.scrollLeft + e.clientWidth) > 1;
  };

  const updateColumnDefaultWidth = () => {
    let el = containerEl.value;
    if (el && columns.value.length > 0) {
      let i = 0;
      let allWritesWidth = columns.value.reduce((v, o) => {
        if (!o.props.width) {
          i++;
          return (v += 0);
        } else {
          return (v += Number(o.props.width));
        }
      }, 0);

      let containerWidth = el.getBoundingClientRect().width - (barWidth.value ?? 0) - 2;
      let res = (containerWidth - allWritesWidth) / i;
      return Math.max(res, MIN_SIZE);
    }
    return MIN_SIZE;
  };
  const columnDefaultWidth = ref(80);

  const setColumnWidth = (col: Column): string | number => {
    let width = col.props.width;

    if (width && width !== '0') return width;
    return columnDefaultWidth.value;
  };

  const getCellClass = (col: Column): string[] => {
    let classList = [];
    if (col.props.align) {
      classList.push('is-' + col.props.align);
    }

    return classList;
  };

  const uFn = () => {
    getBodyScrollbarWidth();
    updateShadow();
  };

  useResize(containerRef, uFn);
  onMounted(uFn);
  onUpdated(uFn);

  return {
    barWidth,
    leftShadow,
    rightShadow,
    expandColumn,

    onscroll,
    setColumnWidth,
    getCellClass
  };
};

export type UseTableStyleReturn = ReturnType<typeof useTableStyle>;
