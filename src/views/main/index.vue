<template>
    <div>
        <div class="main-color">
            <window-header :type="2"></window-header>
            <div class="main-tab">
                <a
                    @click="selectTab(1)"
                    :class="{ active: selTab === 1 }"
                    v-if="$store.state.user.auth !== 3"
                >
                    <div>
                        <img src="@/assets/main/tab1.png" />
                    </div>
                    <div>指纹管理</div>
                </a>
                <a @click="selectTab(2)" :class="{ active: selTab === 2 }">
                    <div>
                        <img src="@/assets/main/tab2.png" />
                    </div>
                    <div>登录日志</div>
                </a>
                <a @click="selectTab(3)" :class="{ active: selTab === 3 }">
                    <div>
                        <img src="@/assets/main/tab3.png" />
                    </div>
                    <div>查看设备信息</div>
                </a>
            </div>
            <img src="@/assets/main/header.png" class="bg" />
        </div>

        <div>
            <transition name="slide-right">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import WindowHeader from '@/components/windowHeader/index.vue';
@Component({
    components: { WindowHeader }
})
export default class Main extends Vue {
    @Watch('$route', { immediate: true }) private watchRoute(route: any) {
        console.log(route);
        switch (route.path) {
            case '/main/user': {
                this.selTab = 1;
                break;
            }
            case '/main/log': {
                this.selTab = 2;
                break;
            }
            case '/main/dev': {
                this.selTab = 3;
                break;
            }
        }
    }
    private selTab = 0;
    private selectTab(val: number) {
        this.selTab = val;
        switch (val) {
            case 1: {
                this.$router.push({
                    path: '/main/user'
                });
                break;
            }
            case 2: {
                this.$router.push({
                    path: '/main/log'
                });
                break;
            }
            case 3: {
                this.$router.push({
                    path: '/main/dev'
                });
                break;
            }
        }
    }
}
</script>

<style lang="less" scoped>
.main-color {
    position: relative;
}
.main-tab {
    margin-top: 22px;
    text-align: center;
    position: relative;
    z-index: 10;
    a {
        width: 126px;
        height: 126px;
        display: inline-block;
        color: #fff;
        text-align: center;
        line-height: 40px;
        img {
            margin-top: 10px;
        }
    }
    a:hover {
        // background: url('~@/assets/main/a.png');
    }
    .active {
        background: url('~@/assets/main/a.png');
    }
}
.bg {
    width: 100%;
    height: 190px;
    position: absolute;
    top: 0;
    z-index: 1;
}
</style>
