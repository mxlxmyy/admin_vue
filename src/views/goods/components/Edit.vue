<template>
  <el-dialog v-model="showBox" :title="preData.ttType" width="720" style="padding: 25px;">
    <el-steps :active="activeStep" finish-status="success" simple class="step_list">
      <el-step title="商品基本信息" />
      <el-step title="商品图片信息完善" />
      <el-step title="商品价格信息完善" />
    </el-steps>
    <el-form v-loading="doLoading" label-width="auto" :model="formData">
      <div v-if="activeStep == 0">
        <el-form-item label="商品名称">
          <el-input v-model="formData.title" autocomplete="off" style="width: 390px" />
        </el-form-item>
        <el-form-item label="供应商商品名称">
          <el-input v-model="formData.s_title" autocomplete="off" style="width: 390px" />
        </el-form-item>
        <el-form-item label="所属分类">
          <el-cascader style="width: 390px"
            v-model="categoryOnName"
            :options="categoryData"
            @change="handleChangeCategory"
          />
        </el-form-item>
        <el-form-item label="商品规格">
          <el-input v-model="formData.specs" style="width: 390px" />
        </el-form-item>
        <el-form-item label="商品类型">
          <el-radio-group v-model="formData.type">
            <el-radio value="0">实物产品</el-radio>
            <el-radio value="1">虚拟产品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="起购数量">
          <el-input v-model="formData.min_num" style="width: 390px" />
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input v-model="formData.code" style="width: 390px" />
        </el-form-item>
        <!-- 选择地区 -->
        <SelectRegion inputStyle="width: 390px" @saveChooseIds="setRegionIds" :selectOptions="hasRegionIds" />
        <el-form-item label="商品链接">
          <el-input v-model="formData.link_url" style="width: 390px"/>
        </el-form-item>
        <el-form-item label="所属供应商">
          <el-autocomplete style="width: 390px"
            v-model="supplierOnName"
            :fetch-suggestions="querySearch"
            clearable
            class="inline-input w-50"
            placeholder="请选择"
            @select="handleSelectSupplier"
          />
        </el-form-item>
        <el-form-item label="上架状态">
          <el-radio-group v-model="formData.status">
            <el-radio value="1">上架</el-radio>
            <el-radio value="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div v-else-if="activeStep == 1">
        <el-form-item label="商品主图">
          <ImgOne @saveUploadImg="setUploadImg" :selectShowImg="hasShowImg" />
        </el-form-item>
        <el-form-item label="展示图片">
          <ImgMul @saveUploadImg="setUploadImgMul" :selectShowImg="hasShowImgMul" />
        </el-form-item>
        <el-form-item label="商品详情">
          <WangEditor @saveEditContent="setEditHtml" :editHtmlContent="hasShowContent" />
        </el-form-item>
      </div>
      <div v-else-if="activeStep == 2">
        <el-form-item label="销售价格">
          <el-input v-model="formData.sell_price" style="width: 390px" />
        </el-form-item>
        <el-form-item label="市场价格">
          <el-input v-model="formData.list_price" style="width: 390px" />
        </el-form-item>
        <el-form-item label="供货价格">
          <el-input v-model="formData.buying_price" style="width: 390px" />
        </el-form-item>
        <el-form-item label="商品税率">
          <el-select v-model="formData.tax_rate" placeholder="请选择" style="width: 390px" >
            <el-option v-for="item in taxRate" :label="item.name" :value="item.val" />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="preData.detail == 0" @click="cancelEdit">取消</el-button>
        <el-button v-if="activeStep == 2" type="primary" @click="saveData"><span v-if="preData.detail == 0">保存并完成</span><span v-if="preData.detail == 1">关闭</span></el-button>
        <el-button v-else type="primary" @click="saveData"><span v-if="preData.detail == 0">保存并下一步></span><span v-if="preData.detail == 1">更多></span></el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import goods from '@/api/goods/goods'
import supplier from '@/api/goods/supplier'
import category from '@/api/data/category'
import { ElMessage } from 'element-plus';
import SelectRegion from '@/components/find/SelectRegion.vue'
import ImgOne from '@/components/upload/ImgOne.vue'
import ImgMul from '@/components/upload/ImgMul.vue'
import WangEditor from '@/components/editor/WangEditor.vue'

//弹框显示状态
const props = defineProps(['editFormVisible', 'preData']);
const emit = defineEmits(['saveEditSub'])

//编辑表单
const formData = ref({
  id: 0,
  title: "",
  s_title: '',
  category_id: 0,
  specs: '',
  type: '0',
  min_num: 1,
  code: '',
  no_region_id: [],
  link_url: '',
  supplier_id: 1,
  status: '1',

  sell_price: '',
  buying_price: '',
  list_price: '',
  tax_rate: '',
})
//详情数据
const formDataShow = ref({
  image: '',
  image_list: '',
  content: '',
})
//初始表单数据
const formDataRe = {}
//初始选中的地区
const hasRegionIds = ref([])
//初始上传的主图
const hasShowImg = ref("")
//初始上传的展示图
const hasShowImgMul = ref([])
//初始内容
const hasShowContent = ref("")

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
    goods.addpre()
    .then(res => {
      if (res.code == 1) {
        hasRegionIds.value = [];
        
        hasShowImg.value = ""
        hasShowImgMul.value = [];

        cateTypeId.value = res.posts.cate_type_id
        taxRate.value = res.posts.tax_rate
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
    //编辑
    goods.editpre({id: props.preData.id})
    .then(res => {
      if (res.code == 1) {
        for (const key in formData.value) {
          formData.value[key] = res.posts[key]
        }
        for (const key in formDataShow.value) {
          formDataShow.value[key] = res.posts.show_data[key]
        }

        supplierOnName.value = res.posts.supplier_name;
        categoryOnName.value = res.posts.category_path;
        hasRegionIds.value = res.posts.no_region_list;

        hasShowImg.value = formDataShow.value.image;
        hasShowImgMul.value = res.posts.show_data.image_list_edit;
        if (res.posts.show_data.content) {
          hasShowContent.value = res.posts.show_data.content
        } else {
          hasShowContent.value = ""
        }

        cateTypeId.value = res.posts.attr_data.cate_type_id
        taxRate.value = res.posts.attr_data.tax_rate
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
}

//提交编辑数据
function saveData() {
  //这里判断是否为查看详情
  if (props.preData.detail == 1) {
    if (activeStep.value == 2) {
      showBox.value = false;
    } else {
      activeStep.value ++;
    }
    return;
  }

  doLoading.value = true;

  let postData = {};
  if (activeStep.value == 0) {
    postData = formData.value;
    postData.act = 0;
  } else if (activeStep.value == 1) {
    postData = formDataShow.value;
    postData.id = formData.value.id;
    postData.act = 1;
  } else if (activeStep.value == 2) {
    postData = formData.value;
    postData.act = 2;
  }

  goods.add(postData)
  .then(res => {
    if (res.code == 1) {
      formData.value.id = res.posts;

      ElMessage({
        type: 'success',
        message: '已保存！',
      })

      if (activeStep.value == 2) {
        showBox.value = false;
        emit('saveEditSub');
      } else {
        activeStep.value ++;
      }
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

//取消按钮
function cancelEdit() {
  showBox.value = false;
  emit('saveEditSub');
}

//步骤显示
const activeStep = ref(0);

//税率
const taxRate = ref([]);

//供应商列表
const supplierList = ref([
])
//选中的供应商
const supplierOnName = ref("");
//查询供应商
function querySearch(str, cb) {
  doLoading.value = true;

  supplier.list({name: str})
  .then(res => {
    if (res.code == 1) {
      supplierList.value = [];
      res.posts.list.forEach(item => {
        supplierList.value.push({
          value: item.name,
          id: item.id
        });
      });
      cb(supplierList.value)
    } else {
      ElMessage.error(res.msg);
    }
  })
  .catch(() => {
    ElMessage.error("网络错误！");
    cb(supplierList.value)
  })
  .finally(() => {
    doLoading.value = false;
  })
}
//点选供应商
function handleSelectSupplier(item) {
  formData.value.supplier_id = item.id;
}

//商品默认分类类型ID
const cateTypeId = ref(0);
//分类数据
const categoryData = ref([])
//选择的分类
const categoryOnName = ref([]);
//查询分类数据
function getCategoryList() {
  category.slist({ctid: cateTypeId.value})
  .then(res => {
    // console.log(res);
    categoryData.value = res;
  })
  .catch(() => {
    ElMessage.error("网络错误！");
  })
}
//点选分类
function handleChangeCategory(item) {
  formData.value.category_id = item[(item.length - 1)]
}

//选择的地区
function setRegionIds(e) {
  formData.value.no_region_id = e;
}

//主图上传
function setUploadImg(e) {
  formDataShow.value.image = e;
}

//展示图片上传
function setUploadImgMul(e) {
  formDataShow.value.image_list = e;
}

//富文本内容
function setEditHtml(e) {
  formDataShow.value.content = e;
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

  //重置表单数据
  for (const key in formData.value) {
    formData.value[key] = formDataRe[key]
  }
  for (const key in formDataShow.value) {
    formDataShow.value[key] = ""
  }
  categoryOnName.value = [];
  supplierOnName.value = "";
  activeStep.value = 0;

  if (formData.value.id != props.preData.id || props.preData.id == 0) {
    getEditPreData();
  }
})
//观察分类类型ID变更
watch(cateTypeId, (n, o) => {
  if (n == 0) {
    return;
  }
  //变更时重新获取
  getCategoryList();
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