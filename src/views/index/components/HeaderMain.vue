<template>
    <div class="toolbar">
      <el-dropdown>
        <el-icon style="margin-right: 8px; margin-top: 1px"
          ><setting
        /></el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span>{{ userInfo.name }}</span>
    </div>
</template>

<script setup>
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
import loginApi from '@/api/login/login'

import { getData, setData } from '@/libs/local.db'

import { useRouter } from 'vue-router';
const router = useRouter();

const userInfo = getData("userInfo");
if (Object.keys(userInfo).length == 0) {
  //未登录
  router.push("login");
}

//退出登录
function loginOut()
{
  loginApi.out()
  .then(res => {
    setData("userInfo", {})
    //跳转
    router.push("login");
  })
  .catch(err => {
    ElMessage.error(err)
  })
}
</script>

<style scoped>
  .el-header {
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
  }
  .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
  }
</style>