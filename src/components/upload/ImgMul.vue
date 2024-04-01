<template>
  <el-upload
    v-model:file-list="fileList"
    :action="uploadImgUrl"
    :headers="uploadImgHeader"
    name="imgfile"
    list-type="picture-card"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :on-success="handleAvatarSuccess"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" style="max-width: 100%;" />
  </el-dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
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

//文件列表
const fileList = ref([])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

//上传成功
const handleAvatarSuccess = (
  res
) => {
  if (res.code == 1) {
    const imgList = [];
    fileList.value.forEach(e => {
      if (e.response) {
        imgList.push(e.response.posts.file_url);
      } else {
        imgList.push(e.url);
      }
    });
    // console.log(imgList);
    emit('saveUploadImg', imgList);
    // console.log(res);
    // console.log(fileList.value);
  } else {
    ElMessage.error(res.msg)
  }
}

//点击移除
const handleRemove = (uploadFile, uploadFiles) => {
  const imgList = [];
  uploadFiles.forEach(e => {
    imgList.push(e.response.posts.file_url);
  });
  // console.log(imgList);
  emit('saveUploadImg', imgList);
  // console.log(uploadFile, uploadFiles)
}

//查看大图
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

onMounted(() => {
  if (props.selectShowImg) {
    fileList.value = props.selectShowImg.slice()
  } else {
    fileList.value =[];
  }
})

//观察显示当前图片
watch(props, () => {
  if (props.selectShowImg) {
    if (JSON.stringify(fileList.value) !== JSON.stringify(props.selectShowImg.slice())) {
      fileList.value = props.selectShowImg.slice()
    }
  } else {
    fileList.value =[];
  }
})
</script>