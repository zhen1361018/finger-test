<template>
    <div id="app">
        <router-view></router-view>
        <Modal v-model="visiable" :footer-hide="true" :mask-closable="false">
            <div style="height: 350px;">
                <version :headerOp="false"></version>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import StoreData from 'electron-store';
import { ipcRenderer } from 'electron';
import LogoMain from '@/components/logoMain/index.vue';
import loginApi from '@/api/login/index';
import Version from '@/views/version/index.vue';
@Component({
    components: {
        LogoMain,
        Version
    }
})
export default class App extends Vue {
    private store = new StoreData({ encryptionKey: 'gree1234qwe!2345' });
    private visiable = false;
    private currentVersion = '';
    private newVersion = '';
    private mounted() {
        ipcRenderer.on('router', (e, val) => {
            console.log(val, 'router');
            this.$router.push({
                path: val.path
            });
        });
        ipcRenderer.on('token', (e, val) => {
            if (this.$route.path === '/loginFinger') {
                loginApi
                    .token()
                    .then((res) => {
                        if (res.data.code === 200) {
                            this.$Message.success('登录成功');
                            const result = res.data.data;
                            this.store.set('mail', result.name);
                            this.store.set('userToken', val);
                            this.store.set('displayName', result.displayName);
                            localStorage.setItem('token', val);
                            result.mail = result.name;
                            this.$store.commit('setUser', result);
                            if (result.roles && result.roles.length > 0) {
                                if (result.roles[0].roleId === '1') {
                                    this.store.set('role', 1);
                                    ipcRenderer.send('user', 1); // 超级管理员
                                }
                                if (result.roles[0].roleId === '2') {
                                    this.store.set('role', 2);
                                    ipcRenderer.send('user', 2); // 个人管理员
                                }
                                if (result.roles[0].roleId === '3') {
                                    this.store.set('role', 3);
                                    ipcRenderer.send('user', 3); // 普通用户
                                }
                            } else {
                                this.store.set('role', 3);
                                ipcRenderer.send('user', 3); // 普通用户
                            }
                        } else {
                            this.$Message.error(res.data.message);
                        }
                    })
                    .catch((err) => {
                        this.$Message.error(err.message);
                    });
            }
        });
        if (this.$route.path !== '/main/version') {
            this.getVersion();
            ipcRenderer.on('getVersion', () => {
                this.getVersion();
            });
        }
    }
    private getVersion() {
        if (this.store.get('sysVersion')) {
            this.currentVersion = this.store.get('sysVersion');
        }
        if (this.store.get('newVersion')) {
            this.newVersion = this.store.get('newVersion');
        }
        if (this.currentVersion === this.newVersion) {
            this.visiable = false;
        } else {
            this.visiable = true;
        }
    }

    private setUser(val: number) {
        console.log(val);
        switch (val) {
            case 1: {
                ipcRenderer.send('user', 1);
                break;
            }
            case 2: {
                ipcRenderer.send('user', 2);
                break;
            }
            case 3: {
                ipcRenderer.send('user', 3);
                break;
            }
        }
    }
    private destroyed() {
        ipcRenderer.removeAllListeners('router');
    }
}
</script>

<style lang="less">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}
</style>
