<template>
    <div style="height: 400px;overflow-y:auto;overflow-x:hidden;margin: 0 8px;">
        <div class="table-header">
            <div class="table-th" style="width: 162px;">登录时间</div>
            <div class="table-th" style="width: 84px;">姓名</div>
            <div class="table-th" style="width: 120px;">登录形式</div>
            <div class="table-th" style="width: 120px;">登录IP</div>
            <div class="table-th" style="width: 162px;">登录电脑MAC</div>
            <div class="table-th" style="width: 124px;">登录状态</div>
        </div>
        <div class="table-filter">
            <div class="table-fi" style="width: 162px;">
                <DatePicker
                    format="yyyy/MM/dd"
                    type="daterange"
                    placeholder="Select date"
                ></DatePicker>
            </div>
            <div class="table-fi" style="width: 84px;">
                <Input />
            </div>
            <div class="table-fi" style="width: 120px;">
                <Select>
                    <Option value="beijing">单点登录</Option>
                </Select>
            </div>
            <div class="table-fi" style="width: 120px;">
                <Input />
            </div>
            <div class="table-fi" style="width: 162px;">
                <Input />
            </div>
            <div class="table-fi" style="width: 124px;">
                <Select>
                    <Option value="beijing">成功登录</Option>
                </Select>
            </div>
        </div>
        <div class="table-body">
            <div class="table-tr" v-for="item of data">
                <div class="table-td" style="width: 162px;">
                    2020/3/27 12:12:44
                </div>
                <div class="table-td" style="width: 84px;">
                    格小力
                </div>
                <div class="table-td" style="width: 120px;">
                    登录电脑
                </div>
                <div class="table-td" style="width: 120px;">
                    172.168.0.1
                </div>
                <div class="table-td" style="width: 162px;">
                    84-24-8D-81-C1-F8
                </div>
                <div class="table-td" style="width: 124px;">
                    成功登录
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component({})
export default class LoginLog extends Vue {
    private data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
}
</script>

<style lang="less" scoped>
.table-header {
    width: 884px;
    height: 50px;
    background: linear-gradient(
        rgba(255, 255, 255, 0),
        rgba(221, 221, 221, 0.2)
    );
    .table-th {
        display: inline-block;
        text-align: center;
        line-height: 50px;
        margin: 4px 8px;
    }
}
.table-filter {
    width: 884px;
    height: 50px;
    .table-fi {
        display: inline-block;
        text-align: center;
        margin: 4px 8px;
    }
}
.table-body {
    width: 884px;
    height: 50px;
    .table-tr {
        border-bottom: solid 1px #ddd;
    }
    .table-td {
        display: inline-block;
        text-align: center;
        margin: 8px 8px;
    }
    .table-tr:nth-child(even) {
        background-color: #f8f8f9;
    }
}
</style>
