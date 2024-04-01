<template>
  <el-dialog v-model="showBox" :title="preData.ttType" width="500" style="padding: 25px;">
    <el-form v-loading="doLoading" :model="formData">
      <el-form-item label="名称">
        <el-input v-model="formData.name" autocomplete="off" style="width: 200px" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="formData.list_order" style="width: 100px"/>
      </el-form-item>
      <el-form-item label="介绍">
        <el-input v-model="formData.description" type="textarea" row="3" style="width: 90%"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showBox = false">取消</el-button>
        <el-button type="primary" @click="saveData">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import supplier from '@/api/goods/supplier'
import { ElMessage } from 'element-plus';

//弹框显示状态
const props = defineProps(['editFormVisible', 'preData']);
const emit = defineEmits(['saveEditSub'])

//编辑表单
const formData = ref({
  id: 0,
  name: "",
  description: '',
  list_order: 100,
})
//初始表单数据
const formDataRe = {}

//加载中
const doLoading = ref(false);

//点击监听
const dialogFormVisible = ref(0);
const showBox = ref(false);

//初始化表单数据
function reFormData() {
  for (const key in formData.value) {
    formDataRe[key] = formData.value[key]
  }
}

//获取编辑前置数据
function getEditPreData()
{
  doLoading.value = true;
  if (props.preData.id == 0) {
    //新增
    supplier.addpre()
    .then(res => {
      for (const key in formData.value) {
        formData.value[key] = formDataRe[key]
      }
    })
    .catch(() => {
      ElMessage.error("网络错误！");
    })
    .finally(() => {
      doLoading.value = false;
    })
  } else {
    //编辑
    supplier.editpre({id: props.preData.id})
    .then(res => {
      for (const key in formData.value) {
        formData.value[key] = res.posts[key]
      }
    })
    .catch(() => {
      ElMessage.error("网络错误！");
    })
    .finally(() => {
      doLoading.value = false;
    })
  }
}

//提交编辑数据
function saveData() {
  doLoading.value = true;

  supplier.add(formData.value)
  .then(res => {
    if (res.code == 1) {
      ElMessage({
        type: 'success',
        message: '已保存！',
      })

      showBox.value = false;
      emit('saveEditSub');
    } else {
      ElMessage.error(res.msg);
    }
  })
  .catch(() => {
    ElMessage.error("网络错误！");
  })
  .finally(() => {
    doLoading.value = false;
  })
}

onMounted(() => {
  //初始化监听点击
  dialogFormVisible.value = props.editFormVisible;

  reFormData();
})

watch(props, () => {
  //判断展示
  if (dialogFormVisible.value != props.editFormVisible) {
    showBox.value = true;
    dialogFormVisible.value = props.editFormVisible;
  }

  if (formData.value.id != props.preData.id || props.preData.id == 0) {
    getEditPreData();
  }
})

</script>