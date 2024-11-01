import { defineComponent, h } from 'vue';
import '../style/link.css';
import { linkProps, linkEmits } from './main.props';
export default defineComponent({
  name: 'CuLink',
  props: linkProps,
  emits: linkEmits,
  setup(props, { slots, emit }) {
    function handleClick(e: MouseEvent) {
      if (props.disabled) return;
      emit('click', e, props.href);
    }

    return () => {
      return h(
        'a',
        {
          class: [
            'cu-link',
            props.type ? 'cu-link--' + props.type : undefined,
            { underline: props.underline, 'is-disabled': props.disabled }
          ],
          download: props.download,
          href: props.disabled || !props.href ? undefined : props.href,
          target: props.target,
          disabled: props.disabled,
          onclick: handleClick
        },
        slots
      );
    };
  }
});
