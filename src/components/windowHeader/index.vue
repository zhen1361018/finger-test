<template>
    <div>
        <div
            style="width: 100%; z-index: 100;position: relative;"
            :class="{ 'login-container': type === 0 }"
        >
            <div
                class="window-header"
                :class="{ 'login-color': type === 1 || type === 3 }"
            >
                <div>
                    <img src="@/assets/main/logo.png" />
                    <span class="title">{{
                        type === 0 ? '联云科技' : '指纹登录器'
                    }}</span>
                    <div style="float:right;">
                        <Poptip
                            trigger="hover"
                            padding="8px 0px"
                            v-model="visible"
                        >
                            <a
                                style=" -webkit-app-region: no-drag;"
                                v-if="type === 2"
                            >
                                <Icon type="md-settings" size="28" />
                            </a>
                            <div slot="content" class="window-menu">
                                <div
                                    class="menu-item"
                                    @click="selectMenu(1)"
                                    v-if="
                                        $store.state.user &&
                                            $store.state.user.auth === 1
                                    "
                                >
                                    <Icon type="ios-timer-outline" size="18" />
                                    <a>恢复出厂设置</a>
                                </div>
                                <div class="menu-item" @click="selectMenu(2)">
                                    <Icon type="md-log-out" size="18" />
                                    <a>注销登录</a>
                                </div>
                                <div class="menu-item" @click="selectMenu(3)">
                                    <Icon type="md-cloud-download" size="18" />
                                    <a>检查更新</a>
                                </div>
                            </div>
                        </Poptip>

                        <a
                            @click="min()"
                            style=" -webkit-app-region: no-drag;"
                            v-if="headerOp"
                        >
                            <Icon type="md-remove" size="28"
                        /></a>
                        <a
                            @click="close()"
                            style=" -webkit-app-region: no-drag;"
                            v-if="headerOp"
                            ><Icon type="md-close" size="28"
                        /></a>
                    </div>
                </div>
            </div>
            <div class="login-title" v-if="type === 0">指纹登录器</div>
            <div class="login-desc" v-if="type === 0">
                客户端 v1.0.1 驱动 v1.0.1
            </div>
        </div>
        <img src="@/assets/main/header.png" class="bg" v-if="type === 0" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import winDecorated from '@/utils/WindowDecorated';
import { ipcRenderer } from 'electron';
@Component({})
export default class WindowHeader extends Vue {
    @Prop({ default: true }) headerOp?: boolean;
    @Prop({ default: 0 })
    private type?: number;
    private visible = false;
    private close() {
        if (this.type === 3 || this.type === 4) {
            this.$emit('close');
        } else {
            location.reload();
            winDecorated.hide();
        }
    }
    private min() {
        winDecorated.min();
    }
    private selectMenu(val: number) {
        ipcRenderer.send('menu', val);
        this.visible = false;
    }
}
</script>

<style lang="less" scoped>
.window-header {
    height: 48px;
    padding: 12px 16px;
    -webkit-app-region: drag;
    img {
        height: 24px;
    }
    a {
        color: #fff;
        margin-left: 8px;
    }
    .title {
        font-size: 16px;
        font-family: monospace;
        text-align: center;
        color: #ffffff;
        line-height: 24px;
        vertical-align: top;
        margin-left: 10px;
    }
}
.login-title {
    margin-top: 18px;
    text-align: center;
    color: #fff;
    font-size: 28px;
    font-family: monospace, MicrosoftYaHei;
}
.login-desc {
    text-align: center;
    color: #fff;
    font-size: 14px;
}
.login-container {
    height: 145px;
}
.login-color {
    background: linear-gradient(to right, #244ba4, #129ae0);
}
.window-menu {
    // height: 100px;
    .menu-item {
        padding: 6px 12px;
    }
    .menu-item:hover {
        background: #f3f3f3;
        a,
        i {
            color: #1890ff;
        }
    }
    a {
        color: #333;
    }
}
.bg {
    width: 100%;
    height: 145px;
    position: absolute;
    top: 0;
    z-index: 1;
}
</style>
