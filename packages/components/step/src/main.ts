import { ref, provide, onBeforeMount, watch, computed, defineComponent, h } from 'vue';
import { isNumber } from '../../../utils';
import '../style/step.css';
import { stepProps } from './main.props';
import { STEP_PROVIDE } from './type';

export default defineComponent({
  name: 'CuStep',
  props: stepProps,
  setup(props, { slots }) {
    const step = ref();
    const itemList = ref<number[]>([]);

    function addItem(uid: number) {
      itemList.value.push(uid);
    }
    function removeItem(uid: number) {
      itemList.value.splice(
        itemList.value.findIndex((id) => id === uid),
        1
      );
    }

    watch(
      () => props.active,
      (val) => {
        if (step.value && isNumber(val)) {
          let child: any = Array.from(step.value.children)[val!];
          child?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        }
      }
    );
    const maxWidth = computed(() => {
      return 100 / itemList.value.length;
    });

    provide(STEP_PROVIDE, {
      addItem,
      removeItem,
      props,
      itemList,
      maxWidth
    });

    onBeforeMount(() => {
      itemList.value = [];
    });

    return () => {
      return h(
        'div',
        {
          class: ['cu-step', props.direction ? 'is-' + props.direction : undefined, { 'is-border': props.border }],
          style: { '--cu-step-active-color': props.activeColor }
        },
        slots
      );
    };
  }
});
