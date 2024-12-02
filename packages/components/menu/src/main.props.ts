import type { PropType, ExtractPropTypes, StyleValue } from 'vue';
import { ComicDir, isString } from '../../../utils';

export const menuProps = {
  modelValue: String,
  mode: {
    type: String as PropType<ComicDir>,
    default: 'vertical'
  },
  size: {
    type: Number,
    default: 40
  },
  // backgroundColor: String,
  // activeTextColor: String,
  // activeBackgroundColor: String,
  // textColor: String,
  collapse: Boolean,
  style: Object as PropType<StyleValue>
} as const;

export type MenuProps = ExtractPropTypes<typeof menuProps>;

export const menuEmits = {
  ['update:modelValue']: (value: string) => isString(value),
  ['menu-click']: (value: string) => isString(value)
};

export type MenuEmits = typeof menuEmits;
