<template>
  <el-popover :visible="showOptions" placement="top" :width="360">
    <template #reference>
      <div class="show_position"></div>
    </template>
    <div class="select_options" v-click-outside="closeOptions" v-loading="doLoading">
      <el-table :data="tableData" :height="280">
        <el-table-column width="100" property="id" label="编号" />
        <el-table-column label="名称">
          <template #default="scope">
            <el-link>{{ scope.row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column width="80" label="操作">
          <template #default="scope">
            <el-checkbox :value="JSON.stringify(scope.row)" @change="checkOneDo" v-model="hasChooseIds[scope.row.id]"/>
          </template>
        </el-table-column>
      </el-table>
      <div class="page_box">
        <el-pagination background small layout="next, pager, prev" :total="pagination._count" :page-size="pagination._pagesize" :current-page="pagination._page" @current-change="handleCurrentChange" class="page_num_box" />
      </div>
    </div>
  </el-popover>
  <div class="select_box" ref="selectregionRef" :style="inputStyle" @click="showOptionsBut">
    <div class="select_input" v-bind:class="{ is_focused: isFocusOn }">
      <div class="select_has">
        <div class="select_one" v-for="rg in hasChooseList">
          <span class="select_one_con">
            <span class="select_one_text"><span class="select_one_textin">{{ rg.name }}</span></span>
            <el-icon class="select_one_close" @click.stop="rmChooseOption(rg.id)"><Close /></el-icon>
          </span>
        </div>
      </div>
      <div class="select_but">
        <el-icon v-bind:class="{ is_reverse: showOptions }"><ArrowDown /></el-icon>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { ArrowDown, Close } from '@element-plus/icons-vue'
import { ClickOutside, ElMessage } from 'element-plus'
import upfile from '@/api/data/upfile'

//是否已展开选择
const showOptions = ref(false);
//当前focus状态
const isFocusOn = ref(false);
//查询条件
const searchMap = ref({
  //文件类型
  mime: "zip",
});
//页码显示
const pagination = ref({
  _count: 0,
  _page: 1,
  _pagesize: 10,
})
//列表数据
const tableData = ref([])

//接收传参
const props = defineProps(['inputStyle', 'maxChooseOption', 'selectOptions', 'searchMapSet']);
//回调父级
const emit = defineEmits(['saveChooseIds'])

//选项框元素
const selectregionRef = ref();
//元素外点击
const vClickOutside = ClickOutside
//加载状态
const doLoading = ref(false);
//已选择的选项
const hasChooseList = ref([]);
//标记选择的ID
const hasChooseIds = ref({});

//关闭选项框
function closeOptions(e) {
  if (isChildOfParent(e.target)) {
    return;
  }

  showOptions.value = false
  isFocusOn.value = false;
}

//打开或关闭选项框
function showOptionsBut() {
  isFocusOn.value = true;
  if (showOptions.value) {
    showOptions.value = false;
  } else {
    showOptions.value = true;
  }
}

//元素是否为选择框的子元素
function isChildOfParent (child) {
  return selectregionRef.value && child && selectregionRef.value.contains(child);
};

//查询
function searchSub() {
  doLoading.value = true;

  const map = searchMap.value;
  map.page = pagination.value._page;
  map.pagesize = pagination.value._pagesize;
  upfile.flist(map)
      .then(res => {
        if (res.code === 1) {
          hasChooseIds.value = {};
          if (res.posts.list.length > 0) {
            res.posts.list.forEach(item => {
              if (hasChooseList.value.some(item2 => item.id === item2.id)) {
                hasChooseIds.value[item.id] = true;
              } else {
                hasChooseIds.value[item.id] = false;
              }
            })
          }

          tableData.value = res.posts.list;
          pagination.value._count = res.posts.count;
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

//分页加载
function handleCurrentChange(page) {
  pagination.value._page = page;

  searchSub();
}

//点击选择
function checkOneDo(e, r) {
  const rg = JSON.parse(r.target.value);
  if (e) {
    if (hasChooseList.value.length >= props.maxChooseOption) {
      ElMessage.error("最多只能选择" + props.maxChooseOption + "个！");
      hasChooseIds.value[rg.id] = false;
      return;
    }

    hasChooseList.value.push({
      id: rg.id,
      name: rg.name
    })
  } else {
    const findIndex = hasChooseList.value.findIndex(obj => obj.id === rg.id);
    if (findIndex !== -1) {
      hasChooseList.value.splice(findIndex, 1);
    }
  }

  //返回给上级组件所选地区id
  emit('saveChooseIds', hasChooseList.value);
}

//点击删除
function rmChooseOption(rgid) {
  const findIndex = hasChooseList.value.findIndex(obj => obj.id === rgid);
  if (findIndex !== -1) {
    hasChooseList.value.splice(findIndex, 1);
    hasChooseIds.value[rgid] = false;

    //返回给上级组件所选地区id
    emit('saveChooseIds', hasChooseList.value);
  }
}

onMounted(() => {
  for (const key in searchMap.value) {
    if (props.searchMapSet[key]) {
      searchMap.value[key] = props.searchMapSet[key]
    }
  }
  //加载列表数据
  searchSub();
})

//观察已选择的地区信息变更
watch(props, () => {
  hasChooseList.value.length = 0;
  props.selectOptions.forEach(e => {
    hasChooseList.value.push({
      id: e.id,
      name: e.name
    })
  });

  //加载列表数据
  searchSub();
})

</script>
<style scoped>
.select_box {
  width: 100%;
  line-height: var(--el-input-height);
  display: inline-flex;
  box-sizing: border-box;
  vertical-align: middle;
  --el-input-height: var(--el-component-size);
  position: relative;
  font-size: var(--el-font-size-base);
}

.select_box .select_input {
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  padding: 4px 12px;
  gap: 6px;
  min-height: 32px;
  line-height: 24px;
  border-radius: var(--el-border-radius-base);
  background-color: var(--el-fill-color-blank);
  transition: var(--el-transition-duration);
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
  width: 100%;
}

.select_has {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 6px;
}

.select_one {
  display: flex;
  flex-wrap: wrap;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border-radius: 3px;
  overflow: hidden;
}

.select_one_con {
  background-color: var(--el-tag-bg-color);
  color: var(--el-tag-text-color);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  height: 24px;
  padding: 0 9px;
  font-size: var(--el-tag-font-size);
  line-height: 1;
  border-width: 1px;
  border-style: solid;
  border-radius: var(--el-tag-border-radius);
  box-sizing: border-box;
  white-space: nowrap;
  --el-icon-size: 14px;
  cursor: pointer;
  border-color: transparent;
  --el-tag-bg-color: var(--el-color-info-light-9);
  --el-tag-border-color: var(--el-color-info-light-8);
  --el-tag-hover-color: var(--el-color-info);
  --el-tag-text-color: var(--el-color-info);
  padding-right: 5px;
}

.select_one_text {
  min-width: 0;
}

.select_one_textin {
  display: block;
  line-height: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.select_one_close {
  margin-left: 6px;
  font-size: 12px;
  padding: 1px;
  border-radius: 50%;
  margin-top: 2px;
}
.select_one_close:hover {
  background-color: #999;
  color: #fff;
}

.select_but {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 6px;
  color: var(--el-input-icon-color, var(--el-text-color-placeholder));
}

.select_but .is_reverse {
  transform: rotateZ(180deg);
}

.select_box .is_focused {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

.page_box {
  padding: 10px 5px 2px;
}

.show_position {
  width: 100%;
}
</style>