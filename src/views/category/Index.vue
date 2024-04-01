<template>
  <main style="height: 500px;">
    <el-container v-loading="doLoading">
      <el-header class="header">
        <el-form :inline="true" :model="searchMap" label-width="auto" class="form">
          <el-row>
            <el-col :span="20">
              <el-form-item label="分类名">
                <el-select v-model="searchMap.cate_type_id" placeholder="选择类型" style="width: 150px" >
                  <el-option v-for="item in catetypeAll" :key="item.id" :label="item.cate_name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="分类名">
                <el-input style="width: 120px;" v-model="searchMap.name" />
              </el-form-item>
              <el-form-item label="分类编码">
                <el-input style="width: 120px;" v-model="searchMap.code" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <div class="search_but">
                <el-button type="primary" @click="searchSub">查询</el-button>
                <el-button class="but2" @click="reSearchMap">重置</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <div class="mb-4">
          <el-button @click="searchSubUp">返回上级</el-button>
          <el-button type="primary" @click="showEditBox(0)">新增</el-button>
          <el-button @click="openCateType">分类类型管理</el-button>
        </div>
      </el-header>
      <el-main class="mainlist">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="ID" width="100" />
          <el-table-column label="分类名">
            <template #default="scope">
              <el-link @click="searchSubUd(scope.row.id)">{{ scope.row.name }} [{{ scope.row.count }}]</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="编码" width="160" />
          <el-table-column label="状态" width="80">
            <template #default="scope">
              <el-button v-if="scope.row.status==1" size="small" type="success" >启用</el-button>
              <el-button v-if="scope.row.status==0" size="small" type="info" >禁用</el-button>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="160">
            <template #default="scope">
              <el-button size="small" @click="showEditBox(scope.row.id)" >编辑</el-button>
              <el-popconfirm title="确定要删除吗？" confirm-button-text="确认" cancel-button-text="取消" @confirm="delListItem(scope.row.id)">
                <template #reference>
                  <el-button size="small" type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background layout="next, pager, prev" :total="pagination._count" :page-size="pagination._pagesize" :current-page="pagination._page" @current-change="handleCurrentChange" class="page_num_box" />
      </el-main>
    </el-container>

    <!-- 新增与编辑 -->
    <Edit :editFormVisible="dialogShow" :preData="setPreData" @saveEditSub="reloadList" />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import category from '@/api/data/category'
import catetype from '@/api/data/catetype'
import { ElMessage } from 'element-plus';
import Edit from './components/Edit.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

//加载状态
const doLoading = ref(false);

//查询条件
const searchMap = ref({
  //分类名
  name: "",
  //编码
  code: "",
  //父级ID
  pid: 0,
  //所属类型ID
  cate_type_id: 0,
});

//上级列表的父级ID
const ppid = ref(0);

//列表数据
const tableData = ref([])
//页码显示
const pagination = ref({
  _count: 0,
  _page: 1,
  _pagesize: 10,
})

//编辑框是否显示
const dialogShow = ref(0);
//编辑框预设信息
const setPreData = ref({
  //显示标题 新增 编辑
  ttType: '',
  pid: 0,
  cate_type_id: 0,
  id: 0,
});

//分类选项
const catetypeAll = ref([]);

//重置查询
function reSearchMap()
{
  searchMap.value.name = "";
  searchMap.value.code = "";
}

//查询
function searchSub() {
  doLoading.value = true;

  const map = searchMap.value;
  map.page = 1;
  map.pagesize = pagination.value._pagesize;
  category.list(map)
  .then(res => {
    if (res.code == 1) {
      tableData.value = res.posts.list;
      pagination.value._count = res.posts.count;
      ppid.value = res.posts.ppid;
    } else {
      ElMessage.error(res.msg);
    }
  })
  .catch(err => {
    ElMessage.error("网络错误！");
  })
  .finally(() => {
    doLoading.value = false;
  })
}

//刷新列表
function reloadList()
{
  reSearchMap();
  searchSub();
}

//删除
function delListItem(id) {
  doLoading.value = true;

  category.del({'id': id})
  .then(res => {
    if (res.code == 1) {
      ElMessage({
        type: 'success',
        message: '已删除！',
      })

      reloadList();
    } else {
      ElMessage.error(res.msg);
    }
  })
  .catch(() => {
    ElMessage.error('网络错误！');
  })
  .finally(() => {
    doLoading.value = false;
  })
}

//返回上级
function searchSubUp() {
  if (searchMap.value.pid == ppid.value) {
    ElMessage({
      type: "info",
      message: "已经是顶级！",
    })
    return;
  }

  searchMap.value.name = "";
  searchMap.value.pid = ppid.value;
  searchSub();
}

//查看子级
function searchSubUd(pid) {
  searchMap.value.name = "";
  searchMap.value.pid = pid;
  searchSub();
}

//分页加载
function handleCurrentChange(page) {
  pagination.value._page = page;

  searchSub();
}

//显示编辑框
function showEditBox(dataId) {
  setPreData.value.id = dataId;
  setPreData.value.pid = searchMap.value.pid
  setPreData.value.cate_type_id = searchMap.value.cate_type_id
  if (dataId == 0) {
    setPreData.value.ttType = '新增';
  } else {
    setPreData.value.ttType = '编辑';
  }

  dialogShow.value++;
}

//获取全部分类类型
function getCateTypeAll()
{
  return catetype.all()
  .then(res => {
    catetypeAll.value = res.posts;
    searchMap.value.cate_type_id = res.posts[0].id
  })
}

//打开分类类型页
function openCateType() {
  router.push({
    name: "category_group_list"
  })
}

onMounted(() => {
  getCateTypeAll()
  .then(() => {
    //加载列表数据
    searchSub();
  })
  .catch(() => {
    ElMessage.error("网络错误！")
  })
})

</script>

<style scoped>
.header {
  height: auto;
  padding: 10px;
}
.form {
  border-bottom: 1px solid #e3e3e3;
  margin-bottom: 5px;
  padding-bottom: 5px;

  .search_but {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    .but2 {
      margin: 10px 0 0;
    }
  }
}
</style>