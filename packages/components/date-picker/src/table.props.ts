import type { ExtractPropTypes, PropType } from 'vue';
import { isNumber } from '../../../utils';

export const dateTableProps = {
  date: [Date, String, Number] as PropType<Date | string | number>,
  flagTime: Number,
  contain: Array as PropType<number[]>
} as const;

export type DateTableProps = ExtractPropTypes<typeof dateTableProps>;

export const dateTableEmits = {
  change: (value: number) => isNumber(value)
};

export type DateTableEmits = typeof dateTableEmits;
