import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login/index.vue')
    },
    {
        path: '/loginAccount',
        name: 'loginAccount',
        component: () => import('../views/loginAccount/index.vue')
    },
    {
        path: '/loginFinger',
        name: 'loginFinger',
        component: () => import('../views/loginFinger/index.vue')
    },
    {
        path: '/main',
        name: 'main',
        redirect: '/main/home',
        component: () => import('../views/main/index.vue'),
        children: [
            {
                path: 'home',
                name: 'home',
                component: () => import('../views/home/index.vue')
            },
            {
                path: 'dev',
                name: 'dev',
                component: () => import('../views/device/index.vue')
            },
            {
                path: 'log',
                name: 'log',
                component: () => import('../views/loginLog/index.vue')
            },
            {
                path: 'user',
                name: 'user',
                component: () => import('../views/user/index.vue')
            }
        ]
    },
    {
        path: '/version',
        name: 'version',
        component: () => import('../views/version/index.vue')
    },

    {
        path: '/logout',
        name: 'logout',
        component: () => import('../views/logout/index.vue')
    },
    {
        path: '/recovery',
        name: 'recovery',
        component: () => import('../views/recovery/index.vue')
    }
];

const router = new VueRouter({
    routes
});

export default router;
