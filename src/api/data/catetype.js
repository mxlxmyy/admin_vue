import { postUrl, getUrl } from '../index'

//请求地址前缀
const urlPath = "/api/mg/catetype/";

const catetype = {
  //列表
  list: (params) => {
    return postUrl(urlPath + "list", params);
  },
  //全部
  all: () => {
    return getUrl(urlPath + "all");
  },
}

export default catetype