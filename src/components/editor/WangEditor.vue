<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
    />
    <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        @onCreated="handleCreated"
        @onChange="handleChange"
    />
  </div>
</template>
<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import {onBeforeUnmount, ref, shallowRef, onMounted, watch} from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { getXsrfToken } from '@/api/auth'

//接收传参
const props = defineProps(['editHtmlContent']);
//回调父级
const emit = defineEmits(['saveEditContent'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('')

onMounted(() => {
})

const toolbarConfig = {
  excludeKeys: [
    'uploadVideo',
    'editVideoSize',
    'insertVideo'
  ]
}
const editorConfig = { placeholder: '请输入内容...', MENU_CONF: { uploadImage: {} } }
//上传图片
editorConfig.MENU_CONF['uploadImage'] = {
  //接口地址
  server: import.meta.env.VITE_SERVER_URL + import.meta.env.VITE_UPLOAD_IMG_URL,
  // form-data fieldName ，默认值 'wangeditor-uploaded-image'
  fieldName: 'imgfile',

  // 单个文件的最大体积限制，默认为 2M
  maxFileSize: 3 * 1024 * 1024, // 1M

  // 最多可上传几个文件，默认为 100
  maxNumberOfFiles: 30,

  // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
  allowedFileTypes: ['image/*'],

  // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
  meta: {
    //标记编辑器提交
    type: 1
  },

  // 将 meta 拼接到 url 参数中，默认 false
  metaWithUrl: false,

  // 自定义增加 http  header
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "X-XSRF-TOKEN": getXsrfToken()
  },

  // 跨域是否传递 cookie ，默认为 false
  withCredentials: false,

  // 超时时间，默认为 10 秒
  timeout: 10 * 1000, // 10 秒
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  editorRef.value.setHtml(props.editHtmlContent);
}
const handleChange = (editor) => {
  // console.log('html:', editor.getHtml())
  emit('saveEditContent', editor.getHtml());
}

onMounted(() => {
})

//观察显示当前图片
watch(props, () => {
  editorRef.value.setHtml(props.editHtmlContent);
})
</script>