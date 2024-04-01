import Cookies from "js-cookie";

const saveConfig = {
    "prefix": "database"
};

//保存数据
export function setData(key, val)
{
    if (typeof key != 'string') {
        ElMessage.error("local db 保存失败，key格式错误！")
        return false;
    }
    const data = {};
    if (typeof val == 'object') {
        data.type = "ob";
        data.val = val;
    } else {
        data.type = "st";
        data.val = val;
    }

    localStorage.setItem(saveConfig.prefix + "." + key, JSON.stringify(data));
    
    return true;
}

//读取数据
export function getData(key)
{
    if (typeof key != 'string') {
        ElMessage.error("local db 读取失败，key格式错误！")
        return null;
    }

    const data = localStorage.getItem(saveConfig.prefix + "." + key);
    if (data == null) {
        return null;
    }

    return JSON.parse(data).val;
}

//删除数据
export function rmData(key)
{
    if (typeof key != 'string') {
        ElMessage.error("local db 删除失败，key格式错误！")
        return false;
    }

    localStorage.removeItem(saveConfig.prefix + "." + key);
    return true;
}

//清空数据
export function clearData()
{
    localStorage.clear();
    return true;
}

//保存数据 到cookie
export function setCookie(key, val)
{
    if (typeof key != 'string') {
        ElMessage.error("local db 保存失败，key格式错误！")
        return false;
    }
    const data = {};
    if (typeof val == 'object') {
        data.type = "ob";
        data.val = val;
    } else {
        data.type = "st";
        data.val = val;
    }

    Cookies.set(saveConfig.prefix + "." + key, JSON.stringify(data));

    return true;
}

//读取数据 从Cookie
export function getCookie(key)
{
    if (typeof key != 'string') {
        ElMessage.error("local db 读取失败，key格式错误！")
        return null;
    }

    const data = Cookies.get(saveConfig.prefix + "." + key);
    if (data == null) {
        return null;
    }

    return JSON.parse(data).val;
}

//删除数据 从Cookie
export function rmCookie(key)
{
    if (typeof key != 'string') {
        ElMessage.error("local db 删除失败，key格式错误！")
        return false;
    }

    Cookies.remove(saveConfig.prefix + "." + key);
    return true;
}