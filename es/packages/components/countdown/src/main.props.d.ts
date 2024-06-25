import { PropType, ExtractPropTypes } from 'vue';

export declare const countdownProps: {
    readonly value: {
        readonly type: PropType<string | number>;
        readonly default: 0;
    };
    readonly format: {
        readonly type: StringConstructor;
        readonly default: "HH:mm:ss";
    };
    readonly prefix: StringConstructor;
    readonly suffix: StringConstructor;
};
export type CountdownProps = ExtractPropTypes<typeof countdownProps>;
export declare const countdownEmits: {
    finish: () => boolean;
};
export type CountdownEmits = typeof countdownEmits;