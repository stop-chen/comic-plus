import { defineComponent, h, onBeforeUnmount, ref, watch, inject, nextTick } from 'vue';
import { repairZero } from '../../../utils';
import { TIMEPICKER_PROVIDE } from './type';

export default defineComponent({
  name: 'list',
  props: {
    time: Number,
    modelValue: String
  },
  emit: ['update:modelValue'],
  setup(props, { emit }) {
    const scrollRef = ref(null);
    const { show } = inject(TIMEPICKER_PROVIDE);

    const itemHandClick = (idx: number) => {
      scrollRef.value.scrollTo({
        top: idx * 30,
        behavior: 'smooth'
      });
      emit('update:modelValue', repairZero(idx));
    };

    const ob = ref<IntersectionObserver>();

    const createObserver = () => {
      ob.value = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              emit('update:modelValue', entry.target.innerHTML);
            }
          });
        },
        {
          root: scrollRef.value,
          rootMargin: `-51% 0px -49% 0px`
        }
      );
      Array.from(scrollRef.value.children).forEach((item: Element) => {
        ob.value.observe(item);
      });
    };

    watch(
      () => show.value,
      (val) => {
        if (val) {
          nextTick(() => {
            scrollRef.value?.scrollTo({
              top: Number(props.modelValue) * 30
            });
            createObserver();
          });
        } else {
          ob.value?.disconnect();
        }
      }
    );

    onBeforeUnmount(() => ob.value?.disconnect());

    return () => {
      return h(
        'ul',
        { class: 'cu-time-picker__list', ref: scrollRef },
        Array.from({ length: props.time }).map((v, idx) => {
          return h(
            'li',
            { class: { active: Number(props.modelValue) === Number(idx) }, onclick: () => itemHandClick(idx) },
            repairZero(idx)
          );
        })
      );
    };
  }
});
