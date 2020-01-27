import Vue from 'vue'
import Router from 'vue-router';

import Login from "@/components/Login";
import Home from "@/components/Home";
import Dashboard from "@/components/Dashboard";
import PathSetting from "@/components/PathSetting";

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/login",
            component: Login
        },
        {
            path: '/',
            redirect: '/path-setting'
        },
        {
            path: '/',
            component: Home,
            meta: {title: '自述文件'},
            children: [{
                path: '/dashboard',
                component: Dashboard,
                meta: { title: '系统首页' }
            }, {
                path: '/path-setting',
                component: PathSetting,
                meta: { title: '地图设置' }
            },]
        }
    ]
})
