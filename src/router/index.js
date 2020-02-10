import Vue from 'vue'
import Router from 'vue-router';

import Login from "@/components/Login";
import Home from "@/components/Home";
import Dashboard from "@/components/Dashboard";
import PathSetting from "@/components/PathSetting";
import Challenge from "@/components/Challenge";

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/login",
            name: 'login',
            component: Login
        },
        {
            path: '/',
            redirect: '/challenge'
        },
        {
            path: '/',
            component: Home,
            meta: {title: '自述文件'},
            children: [{
                path: '/dashboard',
                name: 'dashboard',
                component: Dashboard,
                meta: { title: '系统首页' }
            }, {
                path: '/path-setting',
                name: 'path-setting',
                component: PathSetting,
                meta: { title: '地图设置' }
            },{
                path: '/challenge',
                name: 'challenge',
                component: Challenge,
                meta: { title: '出征' }
            },]
        }
    ]
})
