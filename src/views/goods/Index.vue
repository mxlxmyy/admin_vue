<template>
  <main style="height: 500px;">
    <el-container v-loading="doLoading">
      <el-header class="header">
        <el-form :inline="true" :model="searchMap" label-width="auto" class="form">
          <el-row>
            <el-col :span="20">
              <el-form-item label="商品名称">
                <el-input style="width: 120px;" v-model="searchMap.title" />
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
          <el-button type="primary" @click="showEditBox(0)">新增</el-button>
        </div>
      </el-header>
      <el-main class="mainlist">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="ID" width="100" />
          <el-table-column prop="title" label="商品名称" />
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
import goods from '@/api/goods/goods'
import { ElMessage } from 'element-plus';
import Edit from './components/Edit.vue';

//加载状态
const doLoading = ref(false);

//查询条件
const searchMap = ref({
  //商品名称
  title: "",
});

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
  id: 0,
});

//重置查询
function reSearchMap()
{
  searchMap.value.title = "";
}

//查询
function searchSub() {
  doLoading.value = true;

  const map = searchMap.value;
  map.page = 1;
  map.pagesize = pagination.value._pagesize;
  goods.list(map)
  .then(res => {
    if (res.code == 1) {
      tableData.value = res.posts.list;
      pagination.value._count = res.posts.count;
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

//刷新列表
function reloadList()
{
  reSearchMap();
  searchSub();
}

//删除
function delListItem(id) {
  doLoading.value = true;

  goods.del({'id': id})
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

//分页加载
function handleCurrentChange(page) {
  pagination.value._page = page;

  searchSub();
}

//显示编辑框
function showEditBox(dataId) {
  setPreData.value.id = dataId;
  if (dataId == 0) {
    setPreData.value.ttType = '新增';
  } else {
    setPreData.value.ttType = '编辑';
  }

  dialogShow.value++;
}

onMounted(() => {
  //加载列表数据
  searchSub()
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