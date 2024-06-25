import { FileEnum, UploadFile } from './type';
import { PropType } from 'vue';

declare const _default: __VLS_WithTemplateSlots<import('vue').DefineComponent<{
    type: {
        type: StringConstructor;
        required: true;
    };
    previewList: PropType<UploadFile[]>;
    uploadFileEnum: {
        type: PropType<FileEnum>;
        required: true;
    };
    disabled: BooleanConstructor;
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    choose: (...args: any[]) => void;
    remove: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    type: {
        type: StringConstructor;
        required: true;
    };
    previewList: PropType<UploadFile[]>;
    uploadFileEnum: {
        type: PropType<FileEnum>;
        required: true;
    };
    disabled: BooleanConstructor;
}>> & {
    onChoose?: (...args: any[]) => any;
    onRemove?: (...args: any[]) => any;
}, {
    disabled: boolean;
}, {}>, {
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};