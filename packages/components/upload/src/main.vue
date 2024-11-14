<template>
  <div class="cu-upload" :class="{ 'is-disabled': disabled }"
    :style="{ '--cu-upload-size': size ? size + 'px' : undefined }">
    <template v-if="type === 'picture'">
      <upload-list :disabled="disabled" :type="type" :previewList="previewList" :uploadFileEnum="uploadFileEnum"
        @remove="removeFile">
        <upload-choose :disabled="disabled" :type="type" @choose="uploadHandleClick">
          <slot v-if="$slots['default']"></slot>
          <template #trigger v-if="$slots['trigger']">
            <slot name="trigger"></slot>
          </template>
        </upload-choose>
      </upload-list>
      <div class="cu-upload__tips">
        <slot name="tip"></slot>
      </div>
    </template>

    <template v-if="type === 'list'">
      <div class="cu-upload-choose--warpper">
        <upload-choose :disabled="disabled" :type="type" @choose="uploadHandleClick">
          <slot v-if="$slots['default']"></slot>
          <template #trigger v-if="$slots['trigger']">
            <slot name="trigger"></slot>
          </template>
        </upload-choose>
      </div>
      <div class="cu-upload__tips">
        <slot name="tip"></slot>
      </div>
      <upload-list :disabled="disabled" :type="type" :previewList="previewList" :uploadFileEnum="uploadFileEnum"
        @remove="removeFile" />
    </template>

    <input type="file" ref="inputRef" v-show="false" @change="handleChange" :multiple="multiple" :disabled="disabled"
      :accept="accept" :limit="limit" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import '../style/upload.css';
import uploadList from './upload-list.vue';
import uploadChoose from './upload-choose.vue';
import { isBoolean, isFunction } from '../../../utils';
import UploadInstance, { parseFileSize, getUid } from '../utils/upload';
import { uploadProps, uploadEmits } from './main.props';
import type { FileEnum, UploadFile, UploadError } from './type';
defineOptions({
  name: 'CuUpload'
});

const props = defineProps(uploadProps);
const emit = defineEmits(uploadEmits);

const inputRef = ref();
const uploadFileEnum = reactive({}) as FileEnum;

const previewList = computed(() => {
  return props.fileList ?? [];
});

function uploadHandleClick() {
  if (props.disabled) return;
  inputRef.value.click();
}

function handleChange(e: Event) {
  const fArr = (<HTMLInputElement>e.target).files || [];
  const files = <File[]>Array.from(fArr);
  inputRef.value.value = '';
  processFile(files);
}

function processFile(files: File[]) {
  if (files.length + props.fileList?.length! > props.limit!) {
    //数量超出
    props.onExceed?.(files, props.fileList);
    return;
  }
  if (!props.multiple) {
    files = files.slice(0, 1);
    clearFiles();
  }

  if (props.maxFileSize && files.filter((v) => v.size > parseFileSize(props.maxFileSize)).length > 0) {
    //大小超出
    props.onLarge?.(
      files,
      files.filter((v) => v.size > parseFileSize(props.maxFileSize)),
      props.fileList
    );
    return;
  }

  files.forEach((file) => {
    readyUpload(file);
  });
  updateFileList();
  if (props.autoUpload) {
    submit();
  }
}

function clearFiles() {
  for (const uid in uploadFileEnum) {
    delete uploadFileEnum[uid];
  }
}

function readyUpload(file: File) {
  const { headers, http, withCredentials, data } = props;
  const uid = getUid();
  let params = reactive(
    new UploadInstance({
      headers,
      http,
      file,
      data,
      uid,
      withCredentials,
      status: 'ready',
      name: file.name,
      url: URL.createObjectURL(file),
      success: (res: UploadFile, instance: UploadInstance) => {
        const files = changeFiles(instance.uid);
        props.onSuccess?.(res, files);
      },
      fail: (err: UploadError, instance: UploadInstance) => {
        removeFile(instance.uid);
        props.onError?.(err, props.fileList);
      }
    })
  ) as UploadInstance;
  uploadFileEnum[uid] = params;
}

function changeFiles(uid: number): UploadFile[] {
  let files = props.fileList ?? [];
  if (!props.multiple) {
    files = [];
  }
  const { file } = uploadFileEnum[uid];
  let index = files.findIndex((v) => v.uid === uid);
  if (index >= 0) {
    files[index] = { name: file.name, url: file.url, uid };
  } else {
    files.push({ name: file.name, url: file.url, uid });
  }
  delete uploadFileEnum[uid];
  emit('update:fileList', files);
  return files;
}

function updateFileList() {
  let files = props.fileList ?? [];
  if (!props.multiple) {
    files = [];
  }
  const reloadFiles = (<UploadInstance[]>Object.values(uploadFileEnum))
    .map((item: UploadInstance) => {
      return {
        uid: item.uid,
        name: item.name,
        url: item.url
      };
    })
    .filter((v) => files.findIndex((s) => s.uid === v.uid) === -1);

  emit('update:fileList', [...files, ...reloadFiles]);
  props.onChange?.(files, reloadFiles);
}

function removeFile(uid: number) {
  const propFiles = props.fileList ?? [];
  let index = propFiles.findIndex((v) => v.uid === uid);
  if (index >= 0) {
    propFiles.splice(index, 1);
  }
  if (uploadFileEnum[uid]) {
    delete uploadFileEnum[uid];
  }
  emit('update:fileList', propFiles);
}

async function submit() {
  let result = true;
  const readyList = <UploadInstance[]>Object.values(uploadFileEnum);
  if (props.beforeUpload) {
    let res = await props.beforeUpload(readyList);
    result = isBoolean(res) ? res : result;
  }
  if (result) {
    readyList.forEach((item: UploadInstance) => {
      if (isFunction(props.http)) {
        props.http(item);
      } else {
        item.upload();
      }
    });
  }
}

watch(
  () => props.fileList,
  () => {
    props.fileList?.forEach((_, index) => {
      props.fileList[index].uid ||= getUid();
    });
  },
  {
    deep: true,
    immediate: true
  }
);

defineExpose({ submit });
</script>
