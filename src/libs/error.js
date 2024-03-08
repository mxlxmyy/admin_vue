//抛出成功
export const failPromise = (msg) => {
    return new Promise((r, f) => {
        f(msg)
    })
}

//抛出失败
export const sucPromise = (msg) => {
    return new Promise((r) => {
        r(msg)
    })
}