declare module '*.vue' {
    import VueRouter, { Route } from 'vue-router';
    import { Message } from 'view-design';
    interface Vue {
        $router: VueRouter; // 这表示this下有这个东西
        $route: Route;
        $Message: Message;
    }
}
