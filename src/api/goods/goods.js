import { postUrl, getUrl, deleteUrl } from '../index'

//请求地址前缀
const urlPath = "/api/mg/goods/";

const goods = {
  //列表
  list: (params) => {
    return postUrl(urlPath + "list", params);
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

export default goods