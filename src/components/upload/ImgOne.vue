<template>
  <el-upload
    class="avatar-uploader"
    :action="uploadImgUrl"
    :headers="uploadImgHeader"
    name="imgfile"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getXsrfToken } from '@/api/auth'

//图片上传地址
const uploadImgUrl = import.meta.env.VITE_SERVER_URL + import.meta.env.VITE_UPLOAD_IMG_URL
//图片上传header头
const uploadImgHeader = {
  "X-Requested-With": "XMLHttpRequest",
  "X-XSRF-TOKEN": getXsrfToken()
}

//接收传参
const props = defineProps(['selectShowImg']);
//回调父级
const emit = defineEmits(['saveUploadImg'])

//图片地址
const imageUrl = ref('')

//上传成功
const handleAvatarSuccess = (
  res
) => {
  if (res.code == 1) {
    imageUrl.value = res.posts.show_url
    emit('saveUploadImg', res.posts.file_url);
    // console.log(res);
  } else {
    ElMessage.error(res.msg)
  }
}

onMounted(() => {
  imageUrl.value = props.selectShowImg;
})

//观察显示当前图片
watch(props, () => {
  imageUrl.value = props.selectShowImg;
})
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>