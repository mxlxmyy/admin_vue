<template>
  <main style="height: 500px;">
    <el-container>
      <el-header class="header">
        <el-form :inline="true" :model="searchMap" label-width="auto" class="form">
          <el-row>
            <el-col :span="20">
              <el-form-item label="类型名">
                <el-input style="width: 120px;" v-model="searchMap.cate_name" />
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
          <el-button type="primary" @click="ElMessage({type:'info', message:'开发中'})">添加</el-button>
        </div>
      </el-header>
      <el-main class="mainlist">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="cate_name" label="类型名" />
          <el-table-column prop="cate_alias" label="别名" width="120" />
          <el-table-column prop="list_order" label="排序" width="100" />
          <el-table-column label="状态" width="80">
            <template #default="scope">
              <el-button v-if="scope.row.status==1" size="small" type="success" >启用</el-button>
              <el-button v-if="scope.row.status==0" size="small" type="info" >禁用</el-button>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="160">
            <template #default="scope">
              <el-button size="small" @click="ElMessage({type:'info',message:'开发中'})" >编辑</el-button>
              <el-button size="small" type="danger" @click="ElMessage({type:'info',message:'开发中'})" >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background layout="next, pager, prev" :total="pagination._count" :page-size="pagination._pagesize" :current-page="pagination._page" @current-change="handleCurrentChange" class="page_num_box" />
      </el-main>
    </el-container>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import catetype from '@/api/data/catetype'
import { ElMessage } from 'element-plus';

//查询条件
const searchMap = ref({
  //类型名
  cate_name: "",
});

//列表数据
const tableData = ref([])
//页码显示
const pagination = ref({
  _count: 0,
  _page: 1,
  _pagesize: 10,
})

//重置查询
function reSearchMap()
{
  searchMap.value.cate_name = "";
}

//查询
function searchSub() {
  const map = searchMap.value;
  map.page = pagination.value._page;
  map.pagesize = pagination.value._pagesize;
  catetype.list(map)
  .then(res => {
    if (res.code == 1) {
      tableData.value = res.posts.list;
      pagination.value._count = res.posts.count;
    } else {
      ElMessage.error(res.msg);
    }
  })
  .catch(err => {
    ElMessage.error("网络错误！");
  })
}

//分页加载
function handleCurrentChange(page) {
  pagination.value._page = page;

  searchSub();
}

onMounted(() => {
  //加载列表数据
  searchSub();
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