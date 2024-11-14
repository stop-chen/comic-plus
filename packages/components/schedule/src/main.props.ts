import { ExtractPropTypes, PropType } from 'vue';
import { Schedules, Times } from './type';

export const scheduleProps = {
  schedules: Array as PropType<Schedules>,
  start: {
    type: Number as PropType<Times>,
    default: 9
  },
  end: {
    type: Number as PropType<Times>,
    default: 18
  },
  hasScheduleDays: Array as PropType<(string | number | Date)[]>,
  gap: {
    type: Number,
    default: 100
  },
  loading: Boolean,
  showEmpty: {
    type: Boolean,
    default: true
  },
  emptyText: {
    type: String,
    default: '暂无日程'
  },
  showLine: {
    type: Boolean,
    default: true
  },
  showTime: {
    type: Boolean,
    default: true
  },
  cardColor: {
    type: Boolean,
    default: true
  },
  separator: {
    type: String,
    default: '~'
  }
} as const;

export type ScheduleProps = ExtractPropTypes<typeof scheduleProps>;

export const scheduleEmits = {
  changeDate: (date: Date) => date instanceof Date
};

export type ScheduleEmits = typeof scheduleEmits;
