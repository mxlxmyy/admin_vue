<template>
  <el-upload
      ref="upload"
      class="upload-demo"
      :limit="1"
      :on-exceed="handleExceed"
      :on-success="handleAvatarSuccess"
      :auto-upload="false"
      :action="uploadFileUrl"
      :headers="uploadFileHeader"
      :data="postData"
      name="file"
  >
    <template #trigger>
      <el-button type="primary">选择文件</el-button>
    </template>
    <el-button class="ml-3" type="success" @click="submitUpload">
      开始上传
    </el-button>
  </el-upload>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { ElMessage, genFileId } from 'element-plus'
import { getXsrfToken } from '@/api/auth'

//上传地址
const uploadFileUrl = import.meta.env.VITE_SERVER_URL + import.meta.env.VITE_UPLOAD_FILE_URL
//上传header头
const uploadFileHeader = {
  "X-Requested-With": "XMLHttpRequest",
  "X-XSRF-TOKEN": getXsrfToken()
}
//附加数据
const postData = ref({
  mime: "zip"
})

//接收传参
const props = defineProps(['upFileConfig']);
//回调父级
const emit = defineEmits(['saveUploadFile'])

const upload = ref()

const handleExceed = (files) => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}

const submitUpload = () => {
  upload.value.submit()
}

//上传成功
const handleAvatarSuccess = (
    res
) => {
  if (res.code === 1) {
    emit('saveUploadFile', res.posts);
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(() => {
  postData.value.mime = props.upFileConfig.mime;
})

//观察显示当前图片
watch(props, () => {
  postData.value.mime = props.upFileConfig.mime;
})
</script>

<style scoped>
.ml-3 {
  margin-left: 10px;
}
</style>
