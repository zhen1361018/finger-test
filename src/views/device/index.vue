<template>
    <div style="padding: 80px 40px;">
        <Row>
            <Col span="12">
                <div style="text-align:right;margin-right: 40px;">
                    <img
                        src="@/assets/main/desk.png"
                        style="width: 180px;height:
                180px;vertical-align: text-bottom;"
                    />
                </div>
            </Col>
            <Col span="12">
                <div style="padding: 10px 10px">
                    <div>
                        <div class="label">设备ID:</div>
                        <div class="value">15631235</div>
                    </div>
                    <div>
                        <div class="label">设备主版本号:</div>
                        <div class="value">v1</div>
                    </div>
                    <div>
                        <div class="label">设备次版本号:</div>
                        <div class="value">v2</div>
                    </div>
                    <div>
                        <div class="label">波特率:</div>
                        <div class="value">12</div>
                    </div>
                    <div>
                        <div class="label">超时时间:</div>
                        <div class="value">3s</div>
                    </div>
                    <div>
                        <div class="label">状态:</div>
                        <div class="value">
                            <span style="color:#19be6b;">正常</span>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({})
export default class Device extends Vue {}
</script>

<style lang="less" scoped>
.label {
    display: inline-block;
    margin: 2px 4px;
    width: 150px;
    font-size: 18px;
    line-height: 28px;
}
.value {
    display: inline-block;
    font-size: 18px;
    line-height: 28px;
}
</style>
