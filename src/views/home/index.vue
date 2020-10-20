<template>
    <div class="main-content">
        <div>欢迎回来，{{ $store.state.user.displayName }}。</div>
        <div
            v-if="$store.state.user.roles && $store.state.user.roles.length > 0"
        >
            <Icon type="ios-people" color="#1890FF" size="24" />
            {{ $store.state.user.roles[0].name }}
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({})
export default class Home extends Vue {}
</script>

<style lang="less" scoped>
.main-content {
    text-align: center;
    font-size: 24px;
    margin-top: 102px;
}
</style>
