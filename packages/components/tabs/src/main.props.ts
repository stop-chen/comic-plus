import type { PropType, ExtractPropTypes } from 'vue';

export const tabsProps = {
  modelValue: [String, Number] as PropType<string | number>,
  type: {
    type: String as PropType<'line' | 'card' | 'arc'>,
    default: 'line'
  },
  color: String,
  onlyTab: Boolean,
  closable: Boolean
} as const;

export type TabsProps = ExtractPropTypes<typeof tabsProps>;

const isValidValue = (value: string | number) => ['string', 'number'].includes(typeof value);

export const tabsEmits = {
  'update:modelValue': isValidValue,
  change: isValidValue,
  'tab-remove': isValidValue
};

export type TabsEmits = typeof tabsEmits;
