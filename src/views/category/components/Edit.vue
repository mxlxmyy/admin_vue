<template>
  <el-dialog v-model="showBox" :title="preData.ttType" width="500" style="padding: 25px;">
    <el-form v-loading="doLoading" :model="formData">
      <el-form-item label="名称">
        <el-input v-model="formData.name" autocomplete="off" style="width: 200px" />
      </el-form-item>
      <el-form-item label="编码">
        <el-input v-model="formData.code" disabled style="width: 200px" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="formData.list_order" style="width: 100px"/>
      </el-form-item>
      <el-form-item label="介绍">
        <el-input v-model="formData.note" type="textarea" row="2" style="width: 90%"/>
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
import category from '@/api/data/category'
import { ElMessage } from 'element-plus';

//弹框显示状态
const props = defineProps(['editFormVisible', 'preData']);
const emit = defineEmits(['saveEditSub'])

//编辑表单
const formData = ref({
  id: 0,
  name: "",
  code: '',
  cate_type_id: 0,
  note: '',
  pid: 0,
  list_order: 100,
})

//加载中
const doLoading = ref(false);

//点击监听
const dialogFormVisible = ref(0);
const showBox = ref(false);

//获取编辑前置数据
function getEditPreData()
{
  formData.value.cate_type_id = props.preData.cate_type_id;
  formData.value.pid = props.preData.pid;

  doLoading.value = true;
  if (props.preData.id == 0) {
    //新增
    category.addpre()
    .then(res => {
      formData.value.code = res.posts.code;

      formData.value.id = 0;
      formData.value.list_order = 100;
      formData.value.note = '';
      formData.value.name = '';
    })
    .catch(() => {
      ElMessage.error("网络错误！");
    })
    .finally(() => {
      doLoading.value = false;
    })
  } else {
    //编辑
    category.editpre({id: props.preData.id})
    .then(res => {
      formData.value.code = res.posts.code;
      formData.value.id = res.posts.id;
      formData.value.list_order = res.posts.list_order;
      formData.value.note = res.posts.note;
      formData.value.name = res.posts.name;
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

  category.add(formData.value)
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