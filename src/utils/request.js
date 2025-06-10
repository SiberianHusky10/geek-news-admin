//导入axios
import axios from "axios";

//导入控制消息提示的组件
import { ElMessage } from 'element-plus'

//定义一个变量，记录公共的前缀
// 这是本地测试时使用的地址
// const baseURL = 'http://localhost:8080';
// 这是线上部署时使用的地址
const baseURL = 'https://api.geeknews.tech';
const instance = axios.create({baseURL});

//添加请求拦截器
import { useTokenStore } from "@/stores/token.js";
instance.interceptors.request.use(
    (config)=>{
        //添加token
        const tokenStore = useTokenStore();
        //判断有无token
        if (tokenStore.token) {
            config.headers.Authorization = tokenStore.token
        }
        return config;
    },
    (err)=>{
        //请求错误的回调
        Promise.reject(err)
    }
)

import router from "@/router";
//添加响应拦截器
instance.interceptors.response.use(
    result=>{
        //判断业务状态码
        if (result.data.code === 0) {
            return result.data;
        }
        //操作失败
        //alert(result.data.message ? result.data.message : "服务异常");
        ElMessage.error(result.data.message ? result.data.message : "服务异常");
        //异步操作的状态转换为失败
        return Promise.reject(result.data);
    },
    err=>{
        if(err.response.status===401) {
            ElMessage.error('未登录，请先登录');
            router.push('/login');
        } else {
            ElMessage.error('服务异常')
        }
        //alert('服务异常');
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

export default instance;