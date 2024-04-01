<template>
  <el-scrollbar>
    <el-menu :default-openeds="['1', '2']" :collapse="store.mobileWidth.show">
      <el-menu-item index="0" @click="goPage('/')" style="box-shadow: 0px 5px 15px -10px #afafaf; height: 50px">
        <el-icon><House /></el-icon>
        <template #title>主页</template>
      </el-menu-item>
      <el-sub-menu index="1">
        <template #title>
          <el-icon><Goods /></el-icon>
          <span>商品中心</span>
        </template>
        <el-menu-item index="1-1" @click="goPage('/goods/list')">商品管理</el-menu-item>
        <el-menu-item index="1-2" @click="goPage('/category/list')">分类管理</el-menu-item>
        <el-menu-item index="1-3" @click="showWait">品牌管理</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><Position /></el-icon>
          <span>服务</span>
        </template>
        <el-menu-item-group title="供应商">
          <el-menu-item index="2-1" @click="goPage('/supplier/list')">供应商信息管理</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="渠道">
          <el-menu-item index="2-3" @click="showWait">渠道信息管理</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="3">
        <template #title>
          <el-icon><Key /></el-icon>
          <span>交易</span>
        </template>
        <el-menu-item-group title="订单">
          <el-menu-item index="3-1" @click="showWait">订单中心</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <el-sub-menu index="4">
        <template #title>
          <el-icon><setting /></el-icon>
          <span>系统管理</span>
        </template>
        <el-menu-item index="4-1" @click="goPage('/region/list')">地区管理</el-menu-item>
        <el-menu-item index="4-2" @click="showWait">网站配置</el-menu-item>
        <el-sub-menu index="4-3">
          <template #title>管理员及权限</template>
          <el-menu-item index="4-3-1" @click="goPage('/user/list')">管理员</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
    </el-menu>
  </el-scrollbar>
</template>

<script setup>
import { Position, Goods, Setting, House, Key } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore();

const router = useRouter();

const goPage = pname => {
  router.push(pname)
}

const showWait = () => {
  ElMessage({
    "type": "success",
    "message": "敬请期待！"
  })
}

</script>

<style scoped>
  .el-menu {
    border-right: none;
  }
</style>