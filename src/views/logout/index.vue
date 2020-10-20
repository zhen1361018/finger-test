<template>
    <div>
        <window-header :type="1"></window-header>
        <div style="margin: 50px auto;width: 460px;text-align:center;">
            <div>
                <div style="font-size: 18px;padding: 4px;">
                    <img src="@/assets/main/Shape.png" />
                    <span class="title-logout">是否确认退出登录？</span>
                </div>
            </div>
            <div>
                <div style="padding: 20px 0 40px 0;">
                    <a class="user-button button-default" @click="close"
                        >取 消</a
                    >
                    <a class="user-button button-error" @click="determine"
                        >确定</a
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { ipcRenderer } from 'electron';
import WindowHeader from '@/components/windowHeader/index.vue';
@Component({
    components: { WindowHeader }
})
export default class Logout extends Vue {
    private determine() {
        localStorage.removeItem('token');
        ipcRenderer.send('determine-logout');
    }
    private close() {
        ipcRenderer.send('close-logout');
    }
}
</script>

<style lang="less" scoped>
.title-logout {
    display: inline-block;
    height: 40px;
    vertical-align: text-bottom;
}
</style>
