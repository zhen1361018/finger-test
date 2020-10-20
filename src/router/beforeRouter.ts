import loginApi from '@/api/login';
import store from '@/store';
import log from 'electron-log';
import router from '@/router';
const whiteList: any = ['/login', '/loginAccount', '/loginFinger'];
router.beforeEach((to, from, next) => {
    if (
        document &&
        document.getElementById('loading') &&
        ['/main/user', '/main/dev', '/main/log', '/main/home'].indexOf(
            to.path
        ) === -1
    ) {
        const loading: any = document.getElementById('loading');
        loading.style.display = 'block';
    }

    console.log(to.path);
    if (whiteList.indexOf(to.path) !== -1) {
        next();
    } else {
        const token = localStorage.getItem('token');
        console.log(token);
        if (token) {
            loginApi
                .token()
                .then((res) => {
                    if (res.data.code === 200) {
                        res.data.data.mail = res.data.data.name;
                        store.commit('setUser', res.data.data);
                        next();
                    } else {
                        log.error(res.data.message, 'loginAPI.token-error');
                        next('/login');
                    }
                })
                .catch((err) => {
                    log.error(err.message, 'loginAPI.token-catch');
                    next('/login');
                });
        } else {
            console.log('next');
            next('/login');
        }
    }
});

router.afterEach((to, from) => {
    if (document && document.getElementById('loading')) {
        const loading: any = document.getElementById('loading');
        loading.style.display = 'none';
    }
});
