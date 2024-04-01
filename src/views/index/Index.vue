<template>
  <el-container class="layout-container-demo" :style="defaultHeight">
    
    <el-aside :width="store.mobileWidth.width" style="box-shadow: #b3b3b3 0px 0px 15px -5px;">
      <MenuList/>
    </el-aside>

    <el-container>

      <el-header style="text-align: right; font-size: 12px; height: 50px; box-shadow: #d4d4d4 15px -5px 15px 5px;">
        <HeaderMain/>
      </el-header>

      <el-main>
        <el-scrollbar>
          <RouterView />
        </el-scrollbar>

      </el-main>
    </el-container>

  </el-container>

</template>

<script setup>
import { RouterView, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { getCookie } from '@/libs/local.db'
import { useCounterStore } from '@/stores/counter'

import MenuList from './components/MenuList.vue'
import HeaderMain from './components/HeaderMain.vue'

const store = useCounterStore();

const router = useRouter();

//内容高度
const defaultHeight = ref({     
  height: "500px"
})

onMounted(() => {
  window.addEventListener("resize", getHeight);  
	getHeight();
  vaPageWidth();
})

//获取页面高度
function getHeight() {
  defaultHeight.value.height = window.innerHeight + "px";
}

//判断页面宽度
function vaPageWidth() {
  if (window.innerWidth < 600) {
    store.mobileWidth.show = true;
    store.mobileWidth.width = "64px";
  }
}

//加载登录状态
const userInfo = getCookie("userInfo");
if (userInfo == null || Object.keys(userInfo).length == 0) {
  //未登录
  router.push({
    name: 'login'
  });
} else {
  store.setUser(userInfo);
}
</script>

<style scoped>
  .layout-container-demo .el-header {
    position: relative;
    color: var(--el-text-color-primary);
    border-bottom: 1px solid #e2e2e2;
  }
  .layout-container-demo .el-aside {
    color: var(--el-text-color-primary);
    border-right: 1px solid #f2f2f2;
  }
  .layout-container-demo .el-main {
    padding: 0;
  }
</style>
