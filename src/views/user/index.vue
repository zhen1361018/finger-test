<template>
    <div class="user-container">
        <div class="user-op">
            <a @click="funcAdd()"
                ><Icon type="md-add" style="margin-right:4px;" />新增用户</a
            >
            <span>最多可添加N个指纹</span>
        </div>
        <Divider v-if="data.length === 0">暂无数据</Divider>
        <div v-for="(item, index) in data" class="user-table">
            <div class="list-op" v-bind:key="item.userid">
                <div class="op-left">
                    <Icon type="ios-person" size="24" />{{ item.displayName }}
                </div>
                <div class="op-right">
                    <a
                        style="vertical-align: text-bottom;margin-right:2px;"
                        @click="disableUser()"
                    >
                        <i-switch
                            v-model="value"
                            size="small"
                            :before-change="handleBeforeChange"
                        ></i-switch
                    ></a>
                    <a @click="addFinger(item)">
                        <Icon type="md-add-circle" size="22" />
                    </a>
                    <a @click="setRole(item)"
                        ><Icon type="ios-create" size="22"
                    /></a>
                    <a @click="deleteUser(item)"
                        ><Icon type="md-trash" size="22" color="#F5222D"
                    /></a>
                </div>
            </div>
            <div
                class="list-body"
                v-for="child in item.fingers"
                :key="child.fingerID"
            >
                <Row>
                    <Col span="12"
                        ><img src="@/assets/main/finger.png" /><span>{{
                            child.fingerName
                        }}</span></Col
                    >
                    <Col span="12" class="text-right">
                        <a @click="deleteFinger(child)"
                            ><Icon type="md-trash" size="22" color="#F5222D"
                        /></a>
                    </Col>
                </Row>
            </div>
        </div>

        <Modal
            v-model="modal"
            width="640"
            scrollable
            :closable="false"
            :footer-hide="true"
            :styles="{ top: '50px' }"
            :mask-closable="modalTab !== 1"
        >
            <div v-if="modalTab === 1">
                <div class="modal-header">
                    <window-header :type="4" @close="close()"></window-header>
                </div>
                <div class="modal-body">
                    <Row>
                        <Col span="8">
                            <div class="body-left">
                                <div class="tag-tital">
                                    <Icon type="ios-person-add" size="24" />
                                    <span>新增用户</span>
                                </div>
                                <div style="padding: 40px 38px;">
                                    <Steps
                                        :current="current"
                                        direction="vertical"
                                    >
                                        <Step title="身份验证"></Step>
                                        <Step title="指纹录入"></Step>
                                    </Steps>
                                </div>
                            </div>
                        </Col>
                        <Col span="16">
                            <div v-if="current === 0" class="user-account">
                                <div>请输入新增用户的账号密码</div>
                                <div>
                                    <Checkbox
                                        >该用户为此设置的个人管理员</Checkbox
                                    >
                                </div>
                                <div
                                    style="margin: 30px auto;margin-bottom:0px;"
                                >
                                    <Form
                                        ref="formInline"
                                        :model="formInline"
                                        :rules="ruleInline"
                                    >
                                        <FormItem prop="user">
                                            <Input
                                                type="text"
                                                v-model="formInline.user"
                                                size="large"
                                                placeholder="请输入你的账号"
                                            >
                                                <Icon
                                                    type="ios-person"
                                                    slot="prefix"
                                                    style="color:#1890FF"
                                                />
                                            </Input>
                                        </FormItem>
                                        <FormItem prop="password">
                                            <Input
                                                type="password"
                                                size="large"
                                                v-model="formInline.password"
                                                placeholder="请输入你的密码"
                                            >
                                                <Icon
                                                    type="ios-lock"
                                                    slot="prefix"
                                                    style="color:#1890FF"
                                                />
                                            </Input>
                                        </FormItem>
                                    </Form>
                                </div>
                                <div>
                                    <a class="user-button button-default"
                                        >取 消</a
                                    >
                                    <a
                                        class="user-button button-primary"
                                        @click="funcNext()"
                                        >下一步</a
                                    >
                                </div>
                            </div>
                            <div v-if="current === 1" class="user-setting">
                                <div>
                                    请将食指/中指/无名指放在指纹登录器再移开，并重复此步骤3次。
                                </div>
                                <div class="login-logo">
                                    <img src="@/assets/main/mainLogo1.png" />
                                </div>
                                <div>
                                    <div
                                        class="progress-item item-one"
                                        :style="{
                                            background:
                                                progrss > 0 ? '#2bc852' : ''
                                        }"
                                    ></div>
                                    <div
                                        class="progress-item"
                                        :style="{
                                            background:
                                                progrss > 1 ? '#2bc852' : ''
                                        }"
                                    ></div>
                                    <div
                                        class="progress-item item-three"
                                        :style="{
                                            background:
                                                progrss > 2 ? '#2bc852' : ''
                                        }"
                                    ></div>
                                </div>
                                <div class="user-message">
                                    <Icon
                                        type="md-checkmark-circle"
                                        size="24"
                                    />录入成功
                                </div>
                                <div class="user-complete">
                                    <a
                                        class="user-button "
                                        :class="{
                                            'button-disable': progrss < 3,
                                            'button-primary': progrss > 2
                                        }"
                                        @click="funcAddFinger()"
                                        >完成</a
                                    >
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <div v-if="modalTab === 2">
                <window-header :type="3" @close="close()"></window-header>
                <div style="margin: 70px auto;width: 460px;">
                    <div>
                        <Row>
                            <Col span="4">
                                <img src="@/assets/main/Shape.png" />
                            </Col>
                            <Col
                                span="20"
                                style="font-size: 18px;padding: 4px;"
                            >
                                <div>
                                    是否确认删除此用户在当前设备登入的所有指纹？
                                </div>
                                <div>
                                    <!-- <Checkbox
                                        >同时云端删除此用户的所有指纹</Checkbox
                                    > -->
                                </div>
                                <div style="padding: 20px 0 80px 0;">
                                    <a
                                        class="user-button button-default"
                                        @click="close()"
                                        >取 消</a
                                    >
                                    <a
                                        class="user-button button-error"
                                        @click="funcDeleteUser()"
                                        >确定</a
                                    >
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            <div v-if="modalTab === 3">
                <window-header :type="3" @close="close()"></window-header>
                <div style="margin: 70px auto;width: 460px;">
                    <div>
                        <Row>
                            <Col span="4">
                                <img src="@/assets/main/Shape.png" />
                            </Col>
                            <Col
                                span="20"
                                style="font-size: 18px;padding: 4px;"
                            >
                                <div>
                                    是否确认删除此指纹？
                                </div>
                                <div>
                                    <!-- <Checkbox>同时云端删除此指纹</Checkbox> -->
                                </div>
                                <div style="padding: 20px 0 80px 0;">
                                    <a
                                        class="user-button button-default"
                                        @click="close()"
                                        >取 消</a
                                    >
                                    <a
                                        class="user-button button-error"
                                        @click="funcDeleteFinger()"
                                        >确定</a
                                    >
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>

            <div v-if="modalTab === 4">
                <window-header :type="3" @close="close()"></window-header>
                <div style="margin: 70px auto;width: 460px;">
                    <div>
                        <Row>
                            <Col span="4">
                                <img src="@/assets/main/Shape.png" />
                            </Col>
                            <Col
                                span="20"
                                style="font-size: 18px;padding: 4px;"
                            >
                                <div>
                                    是否确认禁用该用户在当前设备登录？
                                </div>

                                <div style="padding: 20px 0 80px 0;">
                                    <a class="user-button button-default"
                                        >取 消</a
                                    >
                                    <a class="user-button button-error">确定</a>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            <div v-if="modalTab === 5">
                <window-header :type="3" @close="close()"></window-header>
                <div style="margin: 70px auto;width: 480px;">
                    <div>
                        <Row>
                            <Col
                                span="24"
                                style="font-size: 18px;padding: 4px;"
                            >
                                <div>
                                    是否确认设置<a>{{ sel.displayName }}</a>
                                    为此登录器的
                                    <a>个人管理员</a>?
                                </div>
                                <div style="color:#00000073;font-size: 16px;">
                                    <Icon type="ios-alert-outline" />
                                    点击确定，之前设置的个人管理员将变为普通用户。
                                </div>

                                <div
                                    style="padding: 20px 0 80px 0;text-align:center;"
                                >
                                    <a
                                        class="user-button button-default"
                                        @click="close()"
                                        >取 消</a
                                    >
                                    <a class="user-button button-primary"
                                        >确定</a
                                    >
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            <div v-if="modalTab === 6">
                <div class="modal-header">
                    <window-header :type="4" @close="close()"></window-header>
                </div>
                <div class="modal-body">
                    <Row>
                        <Col span="8">
                            <div class="body-left">
                                <div class="tag-tital">
                                    <Icon type="ios-person-add" size="24" />
                                    <span>新增指纹</span>
                                </div>
                                <div style="padding: 40px 38px;">
                                    <Steps
                                        :current="current"
                                        direction="vertical"
                                    >
                                        <Step title="身份验证"></Step>
                                        <Step title="指纹录入"></Step>
                                    </Steps>
                                </div>
                            </div>
                        </Col>
                        <Col span="16">
                            <div v-if="current === 0" class="user-account">
                                <div
                                    style="text-align:center;margin-bottom: 30px;"
                                >
                                    指纹身份认证
                                </div>

                                <div style="text-align:center;">
                                    <div
                                        style="margin-bottom: 30px;text-align:center;"
                                    >
                                        <img
                                            src="@/assets/main/mainLogo1.png"
                                        />
                                    </div>
                                    <a class="user-button button-default"
                                        >取 消</a
                                    >
                                    <!-- <a
                                        class="user-button button-primary"
                                        @click="funcNext()"
                                        >下一步</a
                                    > -->
                                </div>
                            </div>
                            <div v-if="current === 1" class="user-setting">
                                <div>
                                    请将食指/中指/无名指放在指纹登录器再移开，并重复此步骤3次。
                                </div>
                                <div class="login-logo">
                                    <img src="@/assets/main/mainLogo1.png" />
                                </div>
                                <div>
                                    <div
                                        class="progress-item item-one"
                                        :style="{
                                            background:
                                                progrss > 0 ? '#2bc852' : ''
                                        }"
                                    ></div>
                                    <div
                                        class="progress-item"
                                        :style="{
                                            background:
                                                progrss > 1 ? '#2bc852' : ''
                                        }"
                                    ></div>
                                    <div
                                        class="progress-item item-three"
                                        :style="{
                                            background:
                                                progrss > 2 ? '#2bc852' : ''
                                        }"
                                    ></div>
                                </div>
                                <div class="user-message">
                                    <Icon
                                        type="md-checkmark-circle"
                                        size="24"
                                    />录入成功
                                </div>
                                <div class="user-complete">
                                    <a
                                        class="user-button "
                                        :class="{
                                            'button-disable': progrss < 3,
                                            'button-primary': progrss > 2
                                        }"
                                        @click="funcAddFinger()"
                                        >完成</a
                                    >
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import WindowHeader from '@/components/windowHeader/index.vue';
import fingerApi from '@/api/finger/index';
import { ipcRenderer } from 'electron';
@Component({
    components: { WindowHeader }
})
export default class User extends Vue {
    private value = true;
    private modal = false;
    private current = 0;
    private progrss = 0;
    private modalTab = 1;
    private data: any = [];
    private formInline = {
        user: '',
        password: ''
    };
    private sel: any;
    private ruleInline = {
        user: [
            {
                required: true,
                message: '账号不能为空',
                trigger: 'blur'
            }
        ],
        password: [
            {
                required: true,
                message: '密码不能为空',
                trigger: 'blur'
            },
            {
                type: 'string',
                min: 6,
                message: '密码至少为6位',
                trigger: 'blur'
            }
        ]
    };
    private timer: any;
    private funcAdd() {
        this.modal = true;
        this.current = 0;
        this.progrss = 0;
        this.modalTab = 1;
        // this.$Message.warning('该设备最多只可添加10个指纹');
    }
    private funcNext() {
        // this.$Message.error('账号或密码错误，请重新输入。');
        this.current++;
        this.timer = setInterval(() => {
            this.progrss++;
        }, 1000);
    }
    private close() {
        this.modal = false;
        this.current = 0;
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    private deleteUser(val: any) {
        this.modalTab = 2;
        this.modal = true;
        this.sel = val;
    }
    private deleteFinger(val: any) {
        this.sel = val;
        this.modalTab = 3;
        this.modal = true;
    }
    private disableUser() {
        this.modalTab = 4;
        this.modal = true;
    }
    private setRole(val: any) {
        this.sel = val;
        this.modalTab = 5;
        this.modal = true;
    }
    private addFinger(val: any) {
        this.sel = val;
        this.modalTab = 6;
        this.modal = true;
    }
    private handleBeforeChange() {
        return new Promise((resolve) => {});
    }
    private mounted() {
        this.getAllFingerData();
        ipcRenderer.on('userValid', () => {
            if (this.modalTab === 6) {
                this.funcNext();
            }
        });
    }
    /**
     * @description: 新增指纹
     * @params:
     * @author: 180392
     * @date: 2020-06-22 16:13:10
     **/
    private funcAddFinger() {
        fingerApi
            .addFinger({
                userid: this.sel === undefined ? '' : this.sel.userid,
                fingerid: 'fingerid'
            })
            .then((res) => {
                if (res.data.code === 200) {
                    this.getAllFingerData();
                    this.close();
                } else {
                    this.$Message.error(res.data.message);
                }
            })
            .catch((err) => {
                this.$Message.error(err.message);
            });
    }

    /**
     * @description: 用户指纹管理-查询所有用户信息接口
     * @params:
     * @author: 180392
     * @date: 2020-06-22 15:47:05
     **/
    private getAllFingerData() {
        fingerApi
            .getAllFinger({})
            .then((res) => {
                if (res.data.code === 200) {
                    if (res.data.data) {
                        this.data = [];
                        setTimeout(() => {
                            this.data = res.data.data;
                        });
                    } else {
                        this.data = [];
                    }
                } else {
                    this.$Message.error(res.data.message);
                }
            })
            .catch((err) => {
                this.$Message.error(err.message);
            });
    }
    /**
     * @description: 删除用户及其所有指纹信息
     * @params:
     * @author: 180392
     * @date: 2020-06-23 14:40:27
     **/
    private funcDeleteUser() {
        console.log(this.sel);
        fingerApi
            .deleteUser({ userid: this.sel.userid })
            .then((res) => {
                if (res.data.code === 200) {
                    this.getAllFingerData();
                    this.close();
                } else {
                    this.$Message.error(res.data.message);
                }
            })
            .catch((err) => {
                this.$Message.error(err.message);
            });
    }
    private funcDeleteFinger() {
        fingerApi
            .deleteFinger({ fingerid: this.sel.fingerID })
            .then((res) => {
                if (res.data.code === 200) {
                    this.getAllFingerData();
                    this.close();
                } else {
                    this.$Message.error(res.data.message);
                }
            })
            .catch((err) => {
                this.$Message.error(err.message);
            });
    }
}
</script>

<style lang="less" scoped>
.user-container {
    height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    margin: 0 8px;
}
.user-op {
    margin: 16px;
    a {
        display: inline-block;
        width: 200px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        background: #1890ff;
        border-radius: 4px;
        color: #fff;
    }
    span {
        color: #999999;
        line-height: 19px;
        margin-left: 8px;
    }
}
.user-table {
    margin: 16px;
    background: #ffffff;
    box-shadow: 0px 2px 8px 0px #dddddd;
    .list-body {
        padding: 16px;
        margin: 0 16px;
        border-bottom: 1px solid #ddd;
        img {
            width: 22px;
            height: 22px;
            margin-right: 4px;
        }
        span {
            line-height: 22px;
            font-size: 18px;
        }
    }
    .list-body:last-child {
        border-bottom: none;
    }
    .list-op {
        padding: 16px;
        background: linear-gradient(
            rgba(255, 255, 255, 0),
            rgba(221, 221, 221, 0.2)
        );
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-flex: 1;
        -ms-flex: auto;
        flex: auto;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-direction: row;
        flex-direction: row;
        .op-left {
            width: 50%;
        }
        .op-right {
            text-align: right;
            width: 50%;
            margin-right: 16px;
        }
    }
}
.modal-header {
    background: linear-gradient(to right, #4063f4, #2fbfef);
    height: 92px;
}
.modal-body {
    display: flex;
    flex-direction: column;
    flex: auto;
    .body-left {
        background: linear-gradient(
            rgba(255, 255, 255, 0),
            rgba(221, 221, 221, 0.2)
        );
        height: 380px;
    }
    .tag-tital {
        background: linear-gradient(#2fbfef, #4063f4);
        border-radius: 0px 41px 41px 0px;
        height: 50px;
        text-align: center;
        margin-top: -25px;
        i,
        span {
            color: #fff;
            font-size: 24px;
            line-height: 50px;
            margin: 0 4px;
        }
    }
    .user-account {
        margin: 40px 70px;
    }
}

.login-logo {
    margin: 24px auto;
    width: 127px;
    height: 128px;
}
.user-setting {
    padding: 40px 60px;
}
.progress-item {
    display: inline-block;
    height: 10px;
    width: 95px;
    margin: 2px;
    background: #d8d8d8;
}
.item-one {
    border-radius: 100px 0px 0px 100px;
}
.item-three {
    border-radius: 0px 100px 100px 0px;
}
.user-message {
    text-align: center;
    color: #2bc852;
}
.user-complete {
    text-align: center;
    margin-top: 10px;
}
.button-disable {
    background: #d8d8d8;
    color: #fff;
}
.text-right {
    text-align: right;
}
</style>
