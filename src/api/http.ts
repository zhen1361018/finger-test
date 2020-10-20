import axiso from 'axios';
const http = axiso.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 8000,
    responseType: 'json',
    headers: { 'content-type': 'application/json' }
});
http.interceptors.request.use(
    (config) => {
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);
http.interceptors.response.use(
    (config) => {
        return config;
    },
    (err) => {
        if (err.message.includes('timeout')) {
            err.message = '请求超时，请重新操作';
        } else if (err.message.includes('404')) {
            err.message = '服务-404错误，请联系管理员处理';
        }
        return Promise.reject(err);
    }
);
export default http;
