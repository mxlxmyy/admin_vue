import { postUrl, getUrl, deleteUrl } from '../index'
import { failPromise } from '@/libs/error'

//请求地址前缀
const urlPath = "/api/mg/category/";

const category = {
  //列表
  list: (params) => {
    return postUrl(urlPath + "list", params);
  },
  //全部分类列表，分层级
  slist: (params) => {
    return getUrl(urlPath + "slist", params)
    .then(res => {
      if (res.code == 1) {
        return setCategoryDataTree(res.posts);
      } else {
        failPromise(res.msg);
      }
    });
  },
  //添加前置
  addpre: () => {
    return getUrl(urlPath + "addpre");
  },
  //添加
  add: (params) => {
    return postUrl(urlPath + "add", params);
  },
  //编辑前置
  editpre: (params) => {
    return getUrl(urlPath + "editpre", params);
  },
  //编辑
  edit: (params) => {
    return postUrl(urlPath + "edit", params);
  },
  //删除
  del: (params) => {
    return deleteUrl(urlPath + "del", params);
  },
}

//整理分类结构
const setCategoryDataTree = d => {
  const list = [];
  if (d.length == 0) {
    return list;
  }
  d.forEach(e => {
    const slist = setCategoryDataTree(e.s_list);
    list.push({
      value: e.id,
      label: e.name,
      children: slist
    })
  });

  return list;
}

export default category