<template>
    <div style="-webkit-app-region: drag;postion:relative;overflow:hidden;">
        <div>
            <img src="@/assets/main/logo1.png" class="header-logo" />
            <div class="header-title">
                指纹登录器
            </div>
        </div>
        <img
            :style="{ width: width + 'px', height: height + 'px' }"
            class="bg"
            src="@/assets/main/bg1.png"
        />
        <img
            :style="{ width: width * 0.7 + 'px', height: height + 'px' }"
            class="bg"
            src="@/assets/main/bg2.png"
        />
        <div
            class="bg-version"
            :style="{ top: height - 120 + 'px', width: width + 'px' }"
        >
            <img src="@/assets/main/logo.png" />
            <div>客户端版本：V1.1.0 驱动版本：V1.1.0</div>
            <div>©2020 珠海联云科技有限公司版权所有</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class LoginMain extends Vue {
    private width = 0;
    private height = 0;
    private mounted() {
        this.height = window.innerHeight - 16;
        this.width = window.innerWidth - 16;
    }
}
</script>

<style lang="less" scoped>
.header-logo {
    width: 200px;
    position: absolute;
    top: 80px;
    left: 30px;
}
.header-title {
    position: absolute;
    top: 86px;
    left: 246px;
    font-size: 18px;
    font-weight: 600;
}
.bg {
    position: absolute;
}
.bg-version {
    position: absolute;
    height: 80px;
    width: 100%;
    text-align: right;
    padding: 0 20px;
    color: #ddd;
    font-size: 12px;
    img {
        height: 40px;
        width: 120px;
    }
}
</style>
