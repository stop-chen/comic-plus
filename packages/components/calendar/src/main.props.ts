import { ExtractPropTypes, PropType } from 'vue';
import { ComicSize } from '../../../utils';
import { Schedules } from './type';

export const calendarProps = {
  modelValue: Date,
  size: String as PropType<ComicSize>,
  showWeek: {
    type: Boolean,
    default: true
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showDay: {
    type: Boolean,
    default: true
  },
  openSchedule: Boolean,
  schedules: {
    type: Array as PropType<Schedules>
  },
  cardWidth: Number,
  format: String
} as const;

export type CalendarProps = ExtractPropTypes<typeof calendarProps>;

export const calendarEmits = {
  'update:modelValue': (date: Date) => date instanceof Date,
  change: (date: Date) => date instanceof Date
};

export type CalendarEmits = typeof calendarEmits;
