import { getUrl } from '../index'

//请求地址前缀
const urlPath = "/api/mg/upload/";

const upfile = {
    //列表
    flist: (params) => {
        return getUrl(urlPath + "flist", params);
    },
}

export default upfile