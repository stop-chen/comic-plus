import type { ExtractPropTypes, PropType } from 'vue';
import { ComicDisplay, ComicDir, isNumber } from '../../../utils';

export const carouselProps = {
  height: {
    type: String,
    default: '300px'
  },
  mode: {
    type: String as PropType<'transform' | 'opacity' | 'oblique'>,
    default: 'transform'
  },
  autoPlay: {
    type: Boolean,
    default: true
  },
  arrow: {
    type: String as PropType<ComicDisplay>,
    default: 'hover'
  },
  direction: {
    type: String as PropType<ComicDir>,
    default: 'horizontal'
  },
  indicatorPosition: {
    type: String as PropType<'default' | 'outside' | 'none'>,
    default: 'default'
  },
  defaultIndex: Number,
  pauseOnHover: {
    type: Boolean,
    default: true
  },
  delay: {
    type: Number,
    default: 3000,
    validator: (value: number) => value > 0
  }
} as const;

export type CarouselProps = ExtractPropTypes<typeof carouselProps>;

export const carouselEmits = {
  change: (value: number) => isNumber(value)
};

export type CarouselEmits = typeof carouselEmits;
