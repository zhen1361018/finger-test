<template>
    <div>
        <window-header :type="1"></window-header>
        <div class="login-logo">
            <img src="@/assets/main/mainLogo1.png" />
        </div>
        <div class="login-link">
            您尚未在此设备录入过指纹，使用<a
                @click="goLoginAccount()"
                style="color:#1890FF"
                >账号密码</a
            >登录
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import WindowHeader from '@/components/windowHeader/index.vue';
@Component({
    components: { WindowHeader }
})
export default class LoginFinger extends Vue {
    private goLoginAccount() {
        this.$router.push({
            path: '/loginAccount'
        });
    }
}
</script>

<style lang="less" scoped>
.login-logo {
    // border: 1px solid;
    margin: 68px auto;
    margin-bottom: 0;
    width: 127px;
    height: 128px;
}
.login-link {
    text-align: center;
    margin-top: 36px;
}
</style>
