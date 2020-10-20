<template>
    <!-- <div>
        <div v-if="status === 0">
            <div class="login-tig" v-if="!macUnion">
                该指纹登录器未与电脑绑定，是否与电脑进行绑定？
            </div>
            <div class="login-tig" v-if="macUnion" style="text-align:left;">
                该指纹登录器已绑定过电脑，是否解绑旧电脑，与新电脑进行绑定？
                <div style="color:#ff0000;">注：解绑后，旧绑定数据将被清除</div>
            </div>
            <div style="float: right;margin: 0 32px;">
                <Button style="margin: 0 4px;" @click="close">否</Button>
                <Button type="primary" @click="setMac">是</Button>
            </div>
        </div>
        <div v-if="status === 1">
            <div v-if="tab === 0" style="margin: 40px auto;text-align:center;">
                <div class="top-16">{{ title }}</div>
                <img class="top-16" src="@/assets/login/u2656.png" />
                <div class="top-16">
                    <a @click="tabAccount"
                        >无法识别指纹？请使用账号密码登入</a
                    >
                </div>
            </div>
            <div v-if="tab === 1" style="margin: 16px auto;text-align:center;">
                <div class="top-16">{{ title }}</div>
                <div style="width: 240px;margin: 10px auto;">
                    <Form
                        ref="formInline"
                        :model="formInline"
                        :rules="ruleInline"
                    >
                        <FormItem prop="user">
                            <Input
                                type="text"
                                v-model="formInline.user"
                                placeholder="请输入"
                            >
                                <div slot="prepend" style="width: 42px;">
                                    邮箱号
                                </div>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input
                                type="password"
                                v-model="formInline.password"
                                placeholder="请输入"
                            >
                                <div slot="prepend" style="width: 42px;">
                                    密码 &nbsp
                                </div>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button
                                type="primary"
                                long
                                @click="handleSubmit('formInline')"
                                >登录</Button
                            >
                        </FormItem>
                    </Form>
                </div>
                <div class="top-16">
                    <a @click="tabAccount"> 可使用指纹快速登入</a>
                </div>
            </div>
        </div>
    </div> -->
   <div>
       <window-header></window-header>
       
    <div>
        <div class="login-logo">
            <img src="@/assets/main/mainLogo.png" class="logo">
        </div>
        
        <div class="login-op">
            <div>
                <a @click="goLogin(2)">指纹登陆</a>
            </div>
            <div style="margin-top: 38px;">
                <a @click="goLogin(1)">账号密码登录</a>
            </div>
        </div>
        <div class="login-floot">Copyright &#169 2020 Lyentech. All rights reserved.</div>
    </div>
   </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import StoreData from 'electron-store';
import winDecorated from '@/utils/WindowDecorated';
import { ipcRenderer } from 'electron';
import WindowHeader from '@/components/windowHeader/index.vue'
@Component({
    components: {WindowHeader}
})
export default class Login extends Vue {
    private store = new StoreData({ encryptionKey: 'test1234' });
    private macUnion = '';
    private currentMac = '';
    private status = 0;
    private tab = 0;
    private title = '';
    private formInline = {
        user: '',
        password: ''
    };
    private ruleInline = {
        user: [
            {
                required: true,
                message: 'Please fill in the user name',
                trigger: 'blur'
            }
        ],
        password: [
            {
                required: true,
                message: 'Please fill in the password.',
                trigger: 'blur'
            },
            {
                type: 'string',
                min: 6,
                message: 'The password length cannot be less than 6 bits',
                trigger: 'blur'
            }
        ]
    };
    @Watch('$route', { immediate: true })
    private changeRouter(route: any) {
        if (route.query.status === '1') {
            this.status = 1;
        }
    }
    private mounted() {
        this.macUnion = this.store.get('macUnion');
        this.currentMac = this.store.get('currentMac');
        if (this.macUnion === this.currentMac) {
            this.status = 1;
            this.title = 'WELCOME';
        } else {
            this.status = 0;
            this.title = '验证公共管理员身份，以绑定主机。';
        }
    }
    private close() {
        winDecorated.close();
    }
    private setMac() {
        this.store.set('macUnion', this.currentMac);
        ipcRenderer.send('login');
    }
    private tabAccount() {
        this.tab = this.tab === 0 ? 1 : 0;
    }
    private handleSubmit(name: any) {
        const rel: any = this.$refs[name];
        rel.validate((valid: any) => {
            if (valid) {
                this.$Message.success('登录成功');
                this.store.set('mail', this.formInline.user);
                this.store.set('userToken', 'userToken');
                if (this.formInline.user === '180392') {
                    this.store.set('role', 1);
                    ipcRenderer.send('user', 1); // 超级管理员
                } else if (this.formInline.user === '180393') {
                    this.store.set('role', 2);
                    ipcRenderer.send('user', 2); // 个人管理员
                } else {
                    this.store.set('role', 3);
                    ipcRenderer.send('user', 3); // 普通用户
                }

                this.close();
            } else {
                this.$Message.error('Fail!');
            }
            rel.resetFields();
        });
    }

    private goLogin(val: any) {
        if (val === 1) {
            this.$router.push({
                path: '/loginAccount'
            })
        }
         if (val === 2) {
            this.$router.push({
                path: '/loginFinger'
            })
        }
    }
}
</script>

<style lang="less" scoped>


.login-logo {
    // border: 1px dashed;
    margin: 38px auto;
    margin-bottom: 10px;
    text-align: center;
    width: 70px;
    height: 70px;
    .logo{
         width: 100%;
         height: 100%;
    }
}
.login-op {
    text-align: center;
    a {
        color: #1890ff;
        font-size: 14px;
    }
}
.login-floot {
    font-size: 12px;
    color: #333333;
    text-align: center;
    margin-top: 12px;
}
</style>
