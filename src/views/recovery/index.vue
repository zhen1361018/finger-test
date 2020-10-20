<template>
    <div>
        <window-header :type="1"></window-header>
        <div style="margin: 30px auto;width: 380px;">
            <div>
                <Row>
                    <Col span="4">
                        <img src="@/assets/main/Shape.png" />
                    </Col>
                    <Col span="20" style="font-size: 18px;padding: 4px;">
                        <div>
                            是否确认删除此用户在当前设备登入的所有指纹？
                        </div>
                        <div>
                            <!-- <Checkbox>同时云端删除此用户的所有指纹</Checkbox> -->
                        </div>
                        <div style="padding: 20px 0 80px 0;">
                            <a class="user-button button-default">取 消</a>
                            <a class="user-button button-error">确定</a>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import WindowHeader from '@/components/windowHeader/index.vue';
@Component({
    components: { WindowHeader }
})
export default class Recovery extends Vue {}
</script>

<style lang="less" scoped></style>
