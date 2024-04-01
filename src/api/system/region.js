import { postUrl } from '../index'

//请求地址前缀
const urlPath = "/api/mg/region/";

const region = {
  //列表
  list: (params) => {
    return postUrl(urlPath + "list", params);
  },
  //列表，带面包屑数据
  bclist: (params) => {
    return postUrl(urlPath + "bclist", params);
  },
}

export default region