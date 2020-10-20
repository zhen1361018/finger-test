import Mock from 'mockjs';
Mock.setup({
    timeout: 1000
});
Mock.mock(/\/ad\/login/, 'post', (data) => {
    console.log(data, 'mock')
    const body = JSON.parse(data.body);
    if (body.account === 'test') {
        if (body.password === '123456') {
            return {
                code: 200,
                message: '',
                data: {
                    'token': "eyJhbGciOiJIUzI1NiIsInR5cCI6Imp3dCJ9.eyJleHAiOjE1NTE2OTA3MzksImlhdCI6MTU1MTY3OTkzOSwiaWQiOjEyLCJuYW1lIjoidGVzdDk5IiwicHJpb3JpdHkiOjB9._YHr47ByML1FK2Y0aEeq5e3e9QN41-2VDxXqBWxjELI",
                    "name": "XXX10010",
                    "displayName": "李XX",
                    "company": "XXX公司",
                    "department": "IT中心",
                    "email": "XXX10010@gree.com.cn",
                    "userid": "F1001",
                    "roles": [{
                        roleId: "2",
                        name: "普通用户",
                    }]
                }
            }
        } else {
            return {
                code: 500,
                message: '密码不正确'
            }
        }
    } else {
        return {
            code: 500,
            message: '账号不存在'
        }
    }
});
Mock.mock(/\/token/, 'get', () => {
    return {
        code: 200,
        data: {
            "name": "XXX10010",
            "displayName": "李XX",
            "company": "XXX公司",
            "department": "IT中心",
            "email": "XXX10010@mail.com.cn",
            "userid": "F1001",
            "roles": [{
                roleId: "2",
                name: "普通用户",
            }]
        }
    }
})
let fingerData = []
Mock.mock(/\/user\/list/, 'post', () => {
    console.log(fingerData, 'fingerData')
    return {
        code: 200,
        message: '',
        data: fingerData
    }
})
Mock.mock(/\/finger\/create/, 'post', (data) => {
    const body = JSON.parse(data.body);
    console.log(body)
    if (body.userid) {
        fingerData.map(item => {
            if (item.userid === body.userid) {
                item.fingers.push({
                    fingerID: Mock.Random.natural(),
                    fingerName: '手指'
                })
            }
        })
    } else {
        fingerData.push({
            userid: Mock.Random.natural(),
            displayName: Mock.Random.cname() + '（计算机中心）',
            name: '180365',
            roleName: '个人管理员',
            roleId: '1',
            status: 1,
            fingers: [{
                fingerID: Mock.Random.natural(),
                fingerName: '手指'
            }]
        })
    }

    return {
        code: 200,
        message: ''
    }
})
Mock.mock(/\/finger/, 'delete', (data) => {
    console.log(data)
    const url = data.url
    const params = url.split('=');
    if (params.length === 2) {
        fingerData.map(item => {
            const fingers = []
            item.fingers.map(m => {
                if (m.fingerID !== parseInt(params[1], 10)) {
                    fingers.push(m)
                }
            })
            item.fingers = fingers;
        })
        return {
            code: 200,
            message: ''
        }
    }
    return {
        code: 500,
        message: ''
    }
})

Mock.mock(/\/user/, 'delete', (data) => {
    console.log(data)
    const url = data.url
    const params = url.split('=');
    if (params.length === 2) {
        const list = []
        fingerData.map(item => {
            if (item.userid !== parseInt(params[1], 10)) {
                list.push(item)
            }
        })
        fingerData = list;
        return {
            code: 200,
            message: ''
        }
    }
    return {
        code: 500,
        message: ''
    }
})