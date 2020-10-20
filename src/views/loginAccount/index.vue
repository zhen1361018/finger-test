<template>
    <div>
        <window-header></window-header>
        <div style="width: 240px;margin: 10px auto;margin-bottom:0px;">
            <Form ref="formInline" :model="formInline" :rules="ruleInline">
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
                <a class="button" long @click="handleSubmit('formInline')"
                        >登录</a
                    >
            </Form>
        </div>
         <div class="login-link"><a @click="goLoginFinger()">可使用指纹快速登录</a></div>
         <div class="login-floot">Copyright &#169 2020 Lyentech. All rights reserved.</div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import WindowHeader from '@/components/windowHeader/index.vue';
import { ipcRenderer } from 'electron';
import StoreData from 'electron-store';
import loginApi from '@/api/login/index';
@Component({
    components: { WindowHeader }
})
export default class LoginAccount extends Vue {
    private store = new StoreData({ encryptionKey: 'gree1234qwe!2345' });
    private formInline = {
        user: '',
        password: ''
    };
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
        ]
    };
    private handleSubmit(name: any) {
        const rel: any = this.$refs[name];
        rel.validate((valid: any) => {
            if (valid) {
                loginApi.login({
                    account: this.formInline.user,
                    password: this.formInline.password
                }).then(res => {
                    if (res.data.code === 200) {
                        this.$Message.success('登录成功');
                        const result = res.data.data
                        this.store.set('mail', this.formInline.user);
                        this.store.set('userToken', result.token);
                        this.store.set('displayName', result.displayName);
                        localStorage.setItem('token', result.token)
                        result.mail = result.name;
                        this.$store.commit('setUser', result)
                        console.log(this.$store.state.user)
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
                                ipcRenderer.send('user', 3); // 个人管理员
                            }
                        } else {
                            this.store.set('role', 3);
                            ipcRenderer.send('user', 3); // 普通用户
                        }
                       
                    } else {
                         this.$Message.error(res.data.message)
                    }
                }).catch(err => {
                    this.$Message.error(err.message)
                })
               
            }
        });
    }
     private goLoginFinger() {
        this.$router.push({
            path: '/loginFinger'
        });
    }
}
</script>

<style lang="less" scoped>
.button {
    background: #1890ff;
    display: block;
    color: #fff;
    border-radius: 4px;
    text-align: center;
    padding: 8px 0px;
}
.login-floot {
    font-size: 12px;
    color: #333333;
    text-align: center;
    margin-top: 10px;
}
.login-link{
    text-align: center;
    margin-top: 10px;
}
</style>
