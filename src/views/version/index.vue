<template>
    <div>
        <window-header :type="1" :headerOp="headerOp"></window-header>
        <div style="margin: 70px auto;width: 460px;">
            <Row>
                <Col span="12">
                    <img
                        src="@/assets/main/desk.png"
                        style="width: 150px;height: 150px;vertical-align: text-bottom;"
                /></Col>
                <Col span="12">
                    <div style="padding: 20px 10px;font-size:18px;">
                        <div>客户端版本： V{{ currentVersion }}</div>
                        <div
                            style="margin-top: 14px;"
                            v-if="currentVersion !== newVersion"
                        >
                            最新版本：
                            <span style="margin-left: 20px;"
                                >V{{ newVersion }}</span
                            >
                        </div>
                        <div
                            style="text-align:center;margin-top: 8px;"
                            v-if="currentVersion !== newVersion"
                        >
                            <a style="margin-top: 8px;" @click="update"
                                >版本升级</a
                            >
                        </div>
                        <div
                            style="margin-top: 14px;"
                            v-if="currentVersion === newVersion"
                        >
                            已经是最新版本
                            <a @click="getVersion()" v-if="!loading">
                                <Icon type="ios-refresh" size="24" />
                            </a>
                            <Spin
                                v-if="loading"
                                style="display: inline-block;"
                            ></Spin>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import StoreData from 'electron-store';
import { ipcRenderer } from 'electron';
import WindowHeader from '@/components/windowHeader/index.vue';
@Component({
    components: { WindowHeader }
})
export default class Version extends Vue {
    @Prop({ default: true }) headerOp?: boolean;
    private store = new StoreData({ encryptionKey: 'gree1234qwe!2345' });
    private currentVersion = '';
    private newVersion = '';
    private loading = false;

    private mounted() {
        if (this.store.get('sysVersion')) {
            this.currentVersion = this.store.get('sysVersion');
        }
        if (this.store.get('newVersion')) {
            this.newVersion = this.store.get('newVersion');
        }

        ipcRenderer.on('getVersion', () => {
            this.loading = false;
            this.$Message.success('获取版本成功');
            if (this.store.get('sysVersion')) {
                this.currentVersion = this.store.get('sysVersion');
            }
            if (this.store.get('newVersion')) {
                this.newVersion = this.store.get('newVersion');
            }
        });
    }
    private destroyed() {}
    private update() {
        ipcRenderer.send('updateVersion', this.newVersion);
    }
    private getVersion() {
        this.loading = true;
        ipcRenderer.send('getVersion', {});
    }
}
</script>

<style lang="less" scoped></style>
