<template>
  <el-dialog v-model="showBox" title="导入数据" width="550" style="padding: 25px;">
    <el-steps :active="activeStep" finish-status="success" simple class="step_list">
      <el-step title="上传详情图包" />
      <el-step title="上传商品数据" />
      <el-step title="开始导入" />
    </el-steps>

    <el-form v-loading="doLoading" label-width="auto">
      <div v-if="activeStep === 0">
        <el-form-item label="详情图包">
          <el-radio-group v-model="zipType">
            <el-radio value="0">选择已上传文件</el-radio>
            <el-radio value="1">重新上传</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="zipType === '1'" label="~">
          <FileOne @saveUploadFile="setUploadFile" :upFileConfig="upConfig" />
        </el-form-item>
        <el-form-item v-if="zipType === '0'" label="~">
          <!-- 选择文件 -->
          <FileSelect inputStyle="width: 390px" @saveChooseIds="setFileIds" maxChooseOption="1" :searchMapSet="upConfig" />
        </el-form-item>
      </div>
      <div v-else-if="activeStep === 1">
        <el-form-item label="商品数据">
          <el-radio-group v-model="excelType">
            <el-radio value="0">选择已上传文件</el-radio>
            <el-radio value="1">重新上传</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="excelType === '1'" label="~">
          <FileOne @saveUploadFile="setUploadFile2" :upFileConfig="upConfig2" />
        </el-form-item>
        <el-form-item v-if="excelType === '0'" label="~">
          <!-- 选择文件 -->
          <FileSelect inputStyle="width: 390px" @saveChooseIds="setFileIds2" maxChooseOption="1" :searchMapSet="upConfig2" />
        </el-form-item>
      </div>
      <div v-else-if="activeStep === 2">
        <el-form-item label="详情图包">
          <el-input v-model="chooseZip.name" readonly style="width: 390px" />
        </el-form-item>
        <el-form-item label="商品数据">
          <el-input v-model="chooseExcel.name" readonly style="width: 390px" />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancelEdit">取消</el-button>
        <el-button v-if="activeStep === 2" type="primary" @click="saveData">开始导入</el-button>
        <el-button v-else type="primary" @click="saveData">确认并下一步></el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import goods from '@/api/goods/goods'
import { ElMessage } from 'element-plus';
import FileOne from '@/components/upload/FileOne.vue'
import FileSelect from "@/components/upload/FileSelect.vue";

//弹框显示状态
const props = defineProps(['editFormVisible']);
const emit = defineEmits(['saveEditSub'])

//加载中
const doLoading = ref(false);

//点击监听
const dialogFormVisible = ref(0);
const showBox = ref(false);

//步骤显示
const activeStep = ref(0);

//图包
const zipType = ref("0")
const chooseZip = ref({
  id: 0,
  name: ""
})
const upConfig = ref({
  mime: "zip"
})
//图包文件
function setUploadFile (file) {
  chooseZip.value.id = file.id;
  chooseZip.value.name = file.name;
}
//选择的图包
function setFileIds(e) {
  if (e.length == 0) {
    chooseZip.value.id = 0;
    chooseZip.value.name = "";
  } else {
    chooseZip.value.id = e[0].id;
    chooseZip.value.name = e[0].name;
  }
}

//Excel
const excelType = ref("0")
const chooseExcel = ref({
  id: 0,
  name: ""
})
const upConfig2 = ref({
  mime: "excel"
})
//Excel文件
function setUploadFile2 (file) {
  chooseExcel.value.id = file.id;
  chooseExcel.value.name = file.name;
}
//选择的Excel
function setFileIds2(e) {
  if (e.length == 0) {
    chooseExcel.value.id = 0;
    chooseExcel.value.name = "";
  } else {
    chooseExcel.value.id = e[0].id;
    chooseExcel.value.name = e[0].name;
  }
}

//取消按钮
function cancelEdit() {
  showBox.value = false;
}

//提交数据
function saveData() {
  if (activeStep.value === 0) {
    if (chooseZip.value.id === 0) {
      ElMessage.error("请选择或上传详情图压缩包！")
      return;
    } else {
      activeStep.value ++;
    }
  } else if (activeStep.value === 1) {
    if (chooseExcel.value.id === 0) {
      ElMessage.error("请选择或上传商品数据Excel文件！")
      return;
    } else {
      activeStep.value ++;
    }
  } else if (activeStep.value === 2) {
    doLoading.value = true;
    //提交
    goods.import({
      zipfile_id: chooseZip.value.id,
      excelfile_id: chooseExcel.value.id,
    })
    .then(res => {
      if (res.code === 1) {
        showBox.value = false;
        emit('saveEditSub');
      } else {
        ElMessage.error(res.msg);
      }
    })
    .catch((err) => {
      ElMessage.error("网络错误！");
    })
    .finally(() => {
      doLoading.value = false;
    })
  } else {
    ElMessage.error("错误，请刷新重试！")
    return;
  }
}

watch(props, () => {
  //判断展示
  if (dialogFormVisible.value !== props.editFormVisible) {
    showBox.value = true;
    dialogFormVisible.value = props.editFormVisible;
  }

  activeStep.value = 0;
})
</script>

<style scoped>
.step_list {
  max-width: 600px;
  margin-bottom: 15px;
}
.step_list ::v-deep( .el-step__title) {
  font-size: 12px;
}

</style>