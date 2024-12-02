import type { ExtractPropTypes, PropType, Component } from 'vue';

export const submenuProps = {
  label: String,
  icon: Object as PropType<Component>,
  index: String,
  showEllipsis: Boolean,
  open:Boolean
} as const;

export type SubmenuProps = ExtractPropTypes<typeof submenuProps>;
